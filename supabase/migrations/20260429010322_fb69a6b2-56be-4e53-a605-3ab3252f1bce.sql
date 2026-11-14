CREATE OR REPLACE FUNCTION public.protect_solicitacao_service_billing()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  service_record public.servicos%ROWTYPE;
BEGIN
  SELECT *
  INTO service_record
  FROM public.servicos
  WHERE id = NEW.servico_id;

  IF service_record.id IS NULL THEN
    RAISE EXCEPTION 'Serviço não encontrado';
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.prestador_id := service_record.prestador_id;
    NEW.valor_acordado := COALESCE(service_record.preco_unico, service_record.preco_por_hora);
    RETURN NEW;
  END IF;

  IF NEW.servico_id IS DISTINCT FROM OLD.servico_id
    OR NEW.cliente_id IS DISTINCT FROM OLD.cliente_id
    OR NEW.prestador_id IS DISTINCT FROM OLD.prestador_id
    OR NEW.valor_acordado IS DISTINCT FROM OLD.valor_acordado
    OR NEW.metodo_pagamento IS DISTINCT FROM OLD.metodo_pagamento THEN
    RAISE EXCEPTION 'Dados do serviço e cobrança não podem ser alterados após a solicitação';
  END IF;

  IF auth.uid() = OLD.cliente_id
    AND NEW.status_pagamento IS DISTINCT FROM OLD.status_pagamento THEN
    RAISE EXCEPTION 'Cliente não pode alterar status de pagamento';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_solicitacao_service_billing ON public.solicitacoes_servico;

CREATE TRIGGER trg_protect_solicitacao_service_billing
BEFORE INSERT OR UPDATE ON public.solicitacoes_servico
FOR EACH ROW
EXECUTE FUNCTION public.protect_solicitacao_service_billing();