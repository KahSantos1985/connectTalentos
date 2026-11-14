-- ================================================
-- MIGRAÇÃO DE SEGURANÇA: Correção de RLS Policies
-- ================================================

-- 1. PROTEGER TABELA DE REVIEWS CONTRA FRAUDE
-- ================================================

-- Usuários podem criar reviews (uma por profissional)
CREATE POLICY "Users create reviews"
ON reviews FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND NOT EXISTS (
    SELECT 1 FROM reviews r2 
    WHERE r2.user_id = auth.uid() 
    AND r2.professional_id = reviews.professional_id
  )
);

-- Reviews são imutáveis após criação
CREATE POLICY "Reviews are immutable"
ON reviews FOR UPDATE 
USING (false);

-- Reviews não podem ser deletadas
CREATE POLICY "Reviews cannot be deleted"
ON reviews FOR DELETE 
USING (false);


-- 2. PROTEGER SLOTS DE DISPONIBILIDADE
-- ================================================

-- Apenas profissionais podem gerenciar seus próprios slots
CREATE POLICY "Professionals manage own slots"
ON available_slots FOR ALL
USING (professional_id = auth.uid())
WITH CHECK (professional_id = auth.uid());


-- 3. PROTEGER ESPECIALIDADES DOS PROFISSIONAIS
-- ================================================

-- Apenas profissionais podem gerenciar suas próprias especialidades
CREATE POLICY "Professionals manage own specialties"
ON professional_specialties FOR ALL
USING (professional_id = auth.uid())
WITH CHECK (professional_id = auth.uid());


-- 4. BLOQUEAR EDIÇÃO DA TABELA DE ESPECIALIDADES
-- ================================================

-- Tabela de especialidades é somente leitura via RLS
-- (deve ser gerenciada via acesso direto ao banco ou service role)
CREATE POLICY "Specialties INSERT blocked"
ON specialties FOR INSERT 
WITH CHECK (false);

CREATE POLICY "Specialties UPDATE blocked"
ON specialties FOR UPDATE 
USING (false);

CREATE POLICY "Specialties DELETE blocked"
ON specialties FOR DELETE 
USING (false);