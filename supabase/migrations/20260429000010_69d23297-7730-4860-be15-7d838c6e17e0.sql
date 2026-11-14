ALTER TABLE public.solicitacoes_servico
  ADD COLUMN IF NOT EXISTS metodo_pagamento text NOT NULL DEFAULT 'direto' CHECK (metodo_pagamento IN ('app','direto')),
  ADD COLUMN IF NOT EXISTS status_pagamento text NOT NULL DEFAULT 'pendente' CHECK (status_pagamento IN ('pendente','pago_app','confirmado_prestador')),
  ADD COLUMN IF NOT EXISTS valor_acordado numeric;