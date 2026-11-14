-- Remove the public policy that still exposes all columns
DROP POLICY IF EXISTS "Perfis públicos básicos de prestadores" ON public.usuarios;

-- Create a view for public provider profiles that only includes safe, non-sensitive columns
CREATE OR REPLACE VIEW public.provider_profiles AS
SELECT 
  id,
  nome_completo,
  endereco_cidade,
  endereco_bairro,
  foto_perfil_url,
  tipo_usuario,
  criado_at
FROM public.usuarios
WHERE tipo_usuario = 'prestador';

-- Enable RLS on the view
ALTER VIEW public.provider_profiles SET (security_barrier = true);

-- Create a policy to allow public access to the view
-- Note: Views inherit permissions, so we need to grant SELECT
GRANT SELECT ON public.provider_profiles TO anon, authenticated;

-- Add a comment documenting the security design
COMMENT ON VIEW public.provider_profiles IS 
'Public view of provider profiles exposing only non-sensitive information. Sensitive data like email and phone are excluded and only accessible through specific RLS policies on the usuarios table.';