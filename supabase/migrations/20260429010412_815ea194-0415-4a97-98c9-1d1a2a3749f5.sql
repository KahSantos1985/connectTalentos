REVOKE ALL ON FUNCTION public.protect_solicitacao_service_billing() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.protect_solicitacao_service_billing() FROM anon;
REVOKE ALL ON FUNCTION public.protect_solicitacao_service_billing() FROM authenticated;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM authenticated;