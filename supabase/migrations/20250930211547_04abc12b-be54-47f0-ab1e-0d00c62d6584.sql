-- Drop the security definer view that's causing the security warning
DROP VIEW IF EXISTS public.provider_profiles;

-- First, ensure table-level SELECT is granted to roles
-- (This may already be set, but we'll make it explicit)
GRANT SELECT ON public.usuarios TO authenticated;

-- Now revoke SELECT on sensitive columns from anon role
-- Anon users can see provider profiles but NOT email or phone
REVOKE SELECT (email, contato_telefone) ON public.usuarios FROM anon;

-- Grant SELECT on only the safe, non-sensitive columns to anon
GRANT SELECT (id, nome_completo, endereco_cidade, endereco_bairro, foto_perfil_url, tipo_usuario, criado_at) 
ON public.usuarios TO anon;

-- Add back the public policy for provider profiles (for anon users)
-- This allows anon users to see provider rows, but column privileges restrict which columns they can access
CREATE POLICY "Perfis públicos de prestadores (somente dados não sensíveis)"
ON public.usuarios
FOR SELECT TO anon
USING (tipo_usuario = 'prestador');

-- Add a table comment documenting the security design
COMMENT ON TABLE public.usuarios IS 
'User profiles table. Column-level privileges restrict anon users from accessing email and contato_telefone columns. Authenticated users can access contact details through specific RLS policies based on service requests.';