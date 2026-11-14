-- Create market_insights table for storing pre-processed market intelligence data
CREATE TABLE IF NOT EXISTS public.market_insights (
  id BIGSERIAL PRIMARY KEY,
  city TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  avg_income NUMERIC,
  population_profile JSONB,
  local_competitors_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(city, neighborhood)
);

-- Enable RLS
ALTER TABLE public.market_insights ENABLE ROW LEVEL SECURITY;

-- Policy: Only providers can read market insights for their own location
CREATE POLICY "Providers can view market insights for their location"
ON public.market_insights
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.tipo_usuario = 'prestador'
    AND usuarios.endereco_cidade = market_insights.city
    AND usuarios.endereco_bairro = market_insights.neighborhood
  )
);

-- Create index for better query performance
CREATE INDEX idx_market_insights_location ON public.market_insights(city, neighborhood);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_market_insights_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_market_insights_timestamp
BEFORE UPDATE ON public.market_insights
FOR EACH ROW
EXECUTE FUNCTION public.update_market_insights_updated_at();

-- Insert sample data for testing (optional - can be removed in production)
INSERT INTO public.market_insights (city, neighborhood, avg_income, population_profile, local_competitors_count)
VALUES 
  ('São Paulo', 'Vila Mariana', 5500.00, '{"income_distribution": {"low": 15, "medium": 50, "high": 35}, "education": {"basic": 20, "secondary": 40, "higher": 40}}'::jsonb, 12),
  ('Rio de Janeiro', 'Copacabana', 6200.00, '{"income_distribution": {"low": 10, "medium": 45, "high": 45}, "education": {"basic": 15, "secondary": 35, "higher": 50}}'::jsonb, 18),
  ('Belo Horizonte', 'Savassi', 4800.00, '{"income_distribution": {"low": 20, "medium": 55, "high": 25}, "education": {"basic": 25, "secondary": 45, "higher": 30}}'::jsonb, 8)
ON CONFLICT (city, neighborhood) DO NOTHING;