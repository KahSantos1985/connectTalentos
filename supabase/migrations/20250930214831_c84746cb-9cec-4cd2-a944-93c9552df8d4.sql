-- Remove public access to provider profiles
DROP POLICY IF EXISTS "Perfis públicos de prestadores (somente dados não sensíveis)" ON public.usuarios;

-- Create authenticated-only policy for viewing provider profiles
CREATE POLICY "Authenticated users can view provider profiles"
ON public.usuarios
FOR SELECT
TO authenticated
USING (tipo_usuario = 'prestador');

-- Add index for better performance on provider queries
CREATE INDEX IF NOT EXISTS idx_usuarios_tipo_usuario ON public.usuarios(tipo_usuario);

-- Add index for service requests status queries
CREATE INDEX IF NOT EXISTS idx_solicitacoes_status ON public.solicitacoes_servico(status);

-- Add index for service provider queries
CREATE INDEX IF NOT EXISTS idx_servicos_prestador_ativo ON public.servicos(prestador_id, ativo);