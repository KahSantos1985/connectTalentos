-- Allow providers to see contact info of residents who have requested their services
CREATE POLICY "Prestadores veem contato de residentes solicitantes"
ON public.usuarios
FOR SELECT
USING (
  tipo_usuario = 'residente'
  AND EXISTS (
    SELECT 1
    FROM solicitacoes_servico ss
    JOIN servicos s ON s.id = ss.servico_id
    WHERE ss.residente_id = usuarios.id
      AND s.prestador_id = auth.uid()
      AND ss.status IN ('pendente', 'aprovado', 'concluido')
  )
);

-- Allow residents to see contact info of providers whose services they have requested (approved/completed only)
CREATE POLICY "Residentes veem contato de prestadores contratados"
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