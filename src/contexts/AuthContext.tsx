import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

export interface User {
  id: string;
  email: string;
  nome_completo: string;
  tipo_usuario: "cliente" | "prestador";
  contato_telefone?: string;
  foto_perfil_url?: string;
  endereco_cidade: string;
  endereco_bairro: string;
}

// Frontend interface for easier use
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  user_type: "resident" | "provider";
  contact_phone?: string;
  profile_picture_url?: string;
  address_city: string;
  address_neighborhood: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; userType?: "resident" | "provider" }>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  user_type: "resident" | "provider";
  contact_phone?: string;
  address_city: string;
  address_neighborhood: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener (no async calls inside to avoid deadlocks)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session?.user) {
        // Defer fetching/ensuring profile to avoid blocking auth state handling
        setTimeout(() => {
          ensureUserProfile(session.user).then(setUser);
        }, 0);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setTimeout(() => {
          ensureUserProfile(session.user).then(setUser);
        }, 0);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        // Sanitized error logging - no sensitive data
        if (import.meta.env.DEV) {
          console.error('Error fetching user profile:', error.message);
        }
        return null;
      }

      if (!data) return null;

      // Transform database fields to frontend interface
      return {
        id: data.id,
        email: data.email,
        full_name: data.nome_completo,
        user_type: data.tipo_usuario === 'prestador' ? 'provider' : 'resident',
        contact_phone: data.contato_telefone,
        profile_picture_url: data.foto_perfil_url,
        address_city: data.endereco_cidade,
        address_neighborhood: data.endereco_bairro,
      };
    } catch (error) {
      // Sanitized error logging - no sensitive data
      if (import.meta.env.DEV) {
        console.error('Unexpected error fetching user profile');
      }
      return null;
    }
  };

  // Ensure a profile exists; if not, try to create it from user metadata
  const ensureUserProfile = async (sbUser: SupabaseUser): Promise<UserProfile | null> => {
    const existing = await fetchUserProfile(sbUser.id);
    if (existing) return existing;

    const meta: any = sbUser.user_metadata || {};
    const full_name = meta.full_name || meta.name || '';
    const user_type_db = meta.user_type === 'provider' ? 'prestador' : 'cliente';
    const contact_phone = meta.contact_phone || null;
    const address_city = meta.address_city || '';
    const address_neighborhood = meta.address_neighborhood || '';

    const { error: insertError } = await supabase.from('usuarios').insert({
      id: sbUser.id,
      email: sbUser.email,
      nome_completo: full_name,
      tipo_usuario: user_type_db,
      contato_telefone: contact_phone,
      endereco_cidade: address_city,
      endereco_bairro: address_neighborhood,
    });

    if (insertError) {
      if (import.meta.env.DEV) {
        console.error('Error ensuring user profile:', insertError.message);
      }
      return null;
    }

    return await fetchUserProfile(sbUser.id);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; userType?: "resident" | "provider" }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Sanitized error logging - no credentials
        if (import.meta.env.DEV) {
          console.error("Login error:", error.message);
        }
        return { success: false };
      }

      if (data.user) {
        // Fetch user profile to get user type
        const profile = await fetchUserProfile(data.user.id);
        if (profile) {
          setUser(profile);
          return { success: true, userType: profile.user_type };
        }
      }

      return { success: true };
    } catch (error) {
      // Sanitized error logging - no sensitive data
      if (import.meta.env.DEV) {
        console.error("Login error occurred");
      }
      return { success: false };
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: userData.full_name,
            user_type: userData.user_type,
            contact_phone: userData.contact_phone ?? null,
            address_city: userData.address_city,
            address_neighborhood: userData.address_neighborhood,
          }
        }
      });

      if (error) {
        // Show specific error messages to the user
        let errorMessage = 'Não foi possível criar sua conta.';
        const msg = error.message || '';
        const code = (error as any)?.code || '';

        if (msg.includes('User already registered') || code === 'user_already_exists') {
          errorMessage = 'Este email já está cadastrado. Tente fazer login.';
        } else if (msg.includes('Password should be at least') || code === 'weak_password') {
          errorMessage = 'A senha é muito fraca. Use no mínimo 6 caracteres, com letras e números.';
        } else if (msg.toLowerCase().includes('pwned') || msg.toLowerCase().includes('compromised') || msg.toLowerCase().includes('leaked')) {
          errorMessage = 'Esta senha apareceu em vazamentos públicos de dados. Por segurança, escolha outra senha.';
        } else if (msg.includes('Unable to validate email') || msg.toLowerCase().includes('invalid email')) {
          errorMessage = 'Email inválido. Verifique e tente novamente.';
        } else if (msg.toLowerCase().includes('database error')) {
          errorMessage = 'Erro no servidor ao criar sua conta. Tente novamente em instantes.';
        } else if (msg) {
          errorMessage = msg;
        }
        
        // Sanitized error logging - no credentials
        if (import.meta.env.DEV) {
          console.error("Registration error:", error.message);
        }
        
        throw new Error(errorMessage);
      }

      // If email confirmation is required, there might be no session yet.
      // Only create the profile immediately if we have a session.
      if (data.user && data.session) {
        const { error: profileError } = await supabase
          .from('usuarios')
          .insert({
            id: data.user.id,
            email: userData.email,
            nome_completo: userData.full_name,
            tipo_usuario: userData.user_type === 'provider' ? 'prestador' : 'cliente',
            contato_telefone: userData.contact_phone || null,
            endereco_cidade: userData.address_city,
            endereco_bairro: userData.address_neighborhood,
          });

        if (profileError) {
          // Sanitized error logging - no sensitive data
          if (import.meta.env.DEV) {
            console.error("Profile creation error:", profileError.message);
          }
          return false;
        }

        // Wait a moment for the database to commit before fetching
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Fetch and set the user profile immediately to avoid race condition
        const profile = await fetchUserProfile(data.user.id);
        if (profile) {
          setUser(profile);
        }
      }

      return true;
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "Não foi possível criar sua conta.";

      if (import.meta.env.DEV) {
        console.error("Registration error occurred:", message);
      }

      throw new Error(message);
    }
  };

  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const value = {
    user,
    session,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};