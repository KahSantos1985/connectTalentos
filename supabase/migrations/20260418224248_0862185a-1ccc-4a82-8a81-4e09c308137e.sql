
-- =========================
-- USUARIOS
-- =========================
CREATE TABLE public.usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nome_completo TEXT NOT NULL DEFAULT '',
  tipo_usuario TEXT NOT NULL CHECK (tipo_usuario IN ('cliente','prestador')),
  contato_telefone TEXT,
  foto_perfil_url TEXT,
  endereco_cidade TEXT NOT NULL DEFAULT '',
  endereco_bairro TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Perfis de prestadores são públicos"
  ON public.usuarios FOR SELECT
  USING (tipo_usuario = 'prestador' OR auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON public.usuarios FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.usuarios FOR UPDATE
  USING (auth.uid() = id);

-- =========================
-- SERVICOS
-- =========================
CREATE TABLE public.servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prestador_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  titulo_servico TEXT NOT NULL,
  descricao TEXT NOT NULL DEFAULT '',
  categoria TEXT NOT NULL,
  preco_unico NUMERIC(10,2),
  preco_por_hora NUMERIC(10,2),
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Serviços ativos são públicos"
  ON public.servicos FOR SELECT
  USING (ativo = true OR auth.uid() = prestador_id);

CREATE POLICY "Prestadores criam seus serviços"
  ON public.servicos FOR INSERT
  WITH CHECK (auth.uid() = prestador_id);

CREATE POLICY "Prestadores atualizam seus serviços"
  ON public.servicos FOR UPDATE
  USING (auth.uid() = prestador_id);

CREATE POLICY "Prestadores excluem seus serviços"
  ON public.servicos FOR DELETE
  USING (auth.uid() = prestador_id);

-- =========================
-- SOLICITACOES_SERVICO
-- =========================
CREATE TABLE public.solicitacoes_servico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  servico_id UUID NOT NULL REFERENCES public.servicos(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  prestador_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  datas_solicitadas TEXT,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente','aprovado','recusado','em_andamento','concluido','cancelado')),
  proof_of_service_url TEXT,
  checkin_at TIMESTAMPTZ,
  checkout_at TIMESTAMPTZ,
  criado_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.solicitacoes_servico ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cliente e prestador veem a solicitação"
  ON public.solicitacoes_servico FOR SELECT
  USING (auth.uid() = cliente_id OR auth.uid() = prestador_id);

CREATE POLICY "Cliente cria solicitação"
  ON public.solicitacoes_servico FOR INSERT
  WITH CHECK (auth.uid() = cliente_id);

CREATE POLICY "Cliente e prestador atualizam solicitação"
  ON public.solicitacoes_servico FOR UPDATE
  USING (auth.uid() = cliente_id OR auth.uid() = prestador_id);

-- =========================
-- AVALIACOES
-- =========================
CREATE TABLE public.avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitacao_id UUID REFERENCES public.solicitacoes_servico(id) ON DELETE SET NULL,
  prestador_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  nota INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Avaliações são públicas"
  ON public.avaliacoes FOR SELECT
  USING (true);

CREATE POLICY "Cliente cria sua avaliação"
  ON public.avaliacoes FOR INSERT
  WITH CHECK (auth.uid() = cliente_id);

CREATE POLICY "Cliente atualiza sua avaliação"
  ON public.avaliacoes FOR UPDATE
  USING (auth.uid() = cliente_id);

CREATE POLICY "Cliente exclui sua avaliação"
  ON public.avaliacoes FOR DELETE
  USING (auth.uid() = cliente_id);

-- =========================
-- MARKET_INSIGHTS
-- =========================
CREATE TABLE public.market_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cidade TEXT NOT NULL,
  bairro TEXT NOT NULL,
  categoria TEXT,
  total_prestadores INTEGER NOT NULL DEFAULT 0,
  preco_medio NUMERIC(10,2),
  demanda_estimada INTEGER,
  insights_json JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.market_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Insights de mercado são públicos"
  ON public.market_insights FOR SELECT
  USING (true);

-- =========================
-- TIMESTAMP TRIGGER
-- =========================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_usuarios_updated BEFORE UPDATE ON public.usuarios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_servicos_updated BEFORE UPDATE ON public.servicos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_solicitacoes_updated BEFORE UPDATE ON public.solicitacoes_servico
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.usuarios (
    id, email, nome_completo, tipo_usuario,
    contato_telefone, endereco_cidade, endereco_bairro
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE WHEN NEW.raw_user_meta_data->>'user_type' = 'provider' THEN 'prestador' ELSE 'cliente' END,
    NEW.raw_user_meta_data->>'contact_phone',
    COALESCE(NEW.raw_user_meta_data->>'address_city', ''),
    COALESCE(NEW.raw_user_meta_data->>'address_neighborhood', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
