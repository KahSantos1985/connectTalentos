ALTER TABLE public.solicitacoes_servico
ADD COLUMN IF NOT EXISTS data_proposta_prestador text,
ADD COLUMN IF NOT EXISTS mensagem_prestador text;