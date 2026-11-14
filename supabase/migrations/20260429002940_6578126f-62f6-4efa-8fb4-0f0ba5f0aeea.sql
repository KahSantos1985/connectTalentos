CREATE POLICY "Prestador vê cliente com solicitação"
ON public.usuarios
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.solicitacoes_servico s
    WHERE s.cliente_id = usuarios.id
      AND s.prestador_id = auth.uid()
  )
);