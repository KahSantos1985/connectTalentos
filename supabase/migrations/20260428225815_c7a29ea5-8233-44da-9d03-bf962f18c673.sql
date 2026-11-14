-- Tabela para armazenar a localização atual do prestador durante uma solicitação ativa
CREATE TABLE public.localizacoes_prestador (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  solicitacao_id UUID NOT NULL,
  prestador_id UUID NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  accuracy DOUBLE PRECISION,
  heading DOUBLE PRECISION,
  speed DOUBLE PRECISION,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT localizacoes_prestador_solicitacao_unique UNIQUE (solicitacao_id)
);

CREATE INDEX idx_localizacoes_prestador_solicitacao ON public.localizacoes_prestador(solicitacao_id);

ALTER TABLE public.localizacoes_prestador ENABLE ROW LEVEL SECURITY;

-- Prestador insere/atualiza sua própria localização para solicitações onde ele é o prestador
CREATE POLICY "Prestador insere sua localização"
ON public.localizacoes_prestador
FOR INSERT
WITH CHECK (
  auth.uid() = prestador_id
  AND EXISTS (
    SELECT 1 FROM public.solicitacoes_servico s
    WHERE s.id = solicitacao_id
      AND s.prestador_id = auth.uid()
      AND s.status IN ('aprovado', 'em_andamento', 'a_caminho')
  )
);

CREATE POLICY "Prestador atualiza sua localização"
ON public.localizacoes_prestador
FOR UPDATE
USING (auth.uid() = prestador_id);

CREATE POLICY "Prestador remove sua localização"
ON public.localizacoes_prestador
FOR DELETE
USING (auth.uid() = prestador_id);

-- Cliente e prestador da solicitação podem ver a localização — apenas enquanto a solicitação está ativa
CREATE POLICY "Cliente da solicitação ativa vê localização"
ON public.localizacoes_prestador
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.solicitacoes_servico s
    WHERE s.id = solicitacao_id
      AND (s.cliente_id = auth.uid() OR s.prestador_id = auth.uid())
      AND s.status IN ('aprovado', 'em_andamento', 'a_caminho')
      AND s.checkout_at IS NULL
  )
);

-- Habilitar Realtime
ALTER TABLE public.localizacoes_prestador REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.localizacoes_prestador;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_localizacoes_prestador_updated_at
BEFORE UPDATE ON public.localizacoes_prestador
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();