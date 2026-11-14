import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProviderRanking = () => {
  return useQuery({
    queryKey: ['provider-ranking'],
    queryFn: async () => {
      try {
        // Chamar edge function de ranking de ML
        const { data, error } = await supabase.functions.invoke('rank-providers');

        if (error) {
          console.error('Erro ao buscar ranking:', error);
          // Em caso de erro, retornar array vazio para não quebrar a UI
          return { rankedIds: [], metadata: null };
        }

        return {
          rankedIds: data?.rankedIds || [],
          metadata: data?.metadata || null
        };
      } catch (error) {
        console.error('Erro inesperado no ranking:', error);
        return { rankedIds: [], metadata: null };
      }
    },
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
    retry: 1, // Tentar apenas 1 vez em caso de erro
  });
};
