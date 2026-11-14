-- Adicionar colunas para IoT e prova de serviço
ALTER TABLE public.solicitacoes_servico
ADD COLUMN checkin_location TEXT,
ADD COLUMN proof_of_service_url TEXT;

-- Atualizar constraint de status para incluir 'checked_in'
-- Primeiro removemos o constraint antigo
ALTER TABLE public.solicitacoes_servico
DROP CONSTRAINT IF EXISTS solicitacoes_servico_status_check;

-- Adicionar novo constraint com o status 'checked_in'
ALTER TABLE public.solicitacoes_servico
ADD CONSTRAINT solicitacoes_servico_status_check 
CHECK (status IN ('pendente', 'aprovado', 'checked_in', 'concluido', 'recusado'));

-- Criar bucket para provas de serviço
INSERT INTO storage.buckets (id, name, public)
VALUES ('proofs-of-service', 'proofs-of-service', false)
ON CONFLICT (id) DO NOTHING;

-- Políticas RLS para o bucket proofs-of-service
-- Prestadores podem fazer upload das provas de serviço
CREATE POLICY "Prestadores podem fazer upload de provas"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'proofs-of-service' AND
  auth.uid()::text = (storage.foldername(name))[1] AND
  EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE id = auth.uid() AND tipo_usuario = 'prestador'
  )
);

-- Prestadores podem visualizar suas próprias provas
CREATE POLICY "Prestadores podem ver suas provas"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'proofs-of-service' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Residentes podem visualizar provas de serviços que solicitaram
CREATE POLICY "Residentes podem ver provas de serviços solicitados"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'proofs-of-service' AND
  EXISTS (
    SELECT 1 FROM public.solicitacoes_servico ss
    JOIN public.servicos s ON s.id = ss.servico_id
    WHERE ss.residente_id = auth.uid()
    AND s.prestador_id::text = (storage.foldername(name))[1]
    AND ss.proof_of_service_url LIKE '%' || name || '%'
  )
);

-- Adicionar comentário na tabela
COMMENT ON COLUMN public.solicitacoes_servico.checkin_location IS 
'Armazena a geolocalização e timestamp do check-in do prestador em formato JSON: {"latitude": number, "longitude": number, "timestamp": ISO8601}';

COMMENT ON COLUMN public.solicitacoes_servico.proof_of_service_url IS 
'URL da foto de prova de conclusão do serviço armazenada no Supabase Storage';