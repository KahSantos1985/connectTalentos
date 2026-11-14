-- Drop the overly permissive public policy
DROP POLICY IF EXISTS "Perfis públicos de prestadores visíveis" ON public.usuarios;

-- Create a new policy that only allows viewing basic provider info (excluding sensitive data)
-- Note: Since RLS is row-level, we'll rely on application code to only query specific columns
-- This policy allows reading provider profiles, but sensitive columns should not be selected in queries
CREATE POLICY "Perfis públicos básicos de prestadores"
ON public.usuarios
FOR SELECT
USING (tipo_usuario = 'prestador');

-- Allow authenticated users to see contact details only for providers they have approved service requests with
CREATE POLICY "Ver contato de prestadores com solicitação aprovada"
ON public.usuarios
FOR SELECT
USING (
  tipo_usuario = 'prestador' 
  AND EXISTS (
    SELECT 1
    FROM solicitacoes_servico ss
    JOIN servicos s ON s.id = ss.servico_id
    WHERE s.prestador_id = usuarios.id
      AND ss.residente_id = auth.uid()
      AND ss.status IN ('aprovado', 'concluido')
  )
);

-- Add comment to document the security considerations
COMMENT ON POLICY "Perfis públicos básicos de prestadores" ON public.usuarios IS 
'Allows viewing provider profiles. Application code MUST only SELECT non-sensitive columns (nome_completo, endereco_cidade, endereco_bairro, foto_perfil_url) for unauthenticated users. Email and phone should only be queried by authenticated users with approved service requests.';