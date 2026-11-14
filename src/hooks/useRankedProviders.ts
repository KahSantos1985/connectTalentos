import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProviderRanking } from "./useProviderRanking";

interface Provider {
  id: string;
  nome_completo: string;
  endereco_cidade: string;
  endereco_bairro: string;
  foto_perfil_url?: string | null;
  servicos: Array<{
    id: string;
    titulo_servico: string;
    categoria: string;
    descricao: string;
    preco_unico?: number | null;
    preco_por_hora?: number | null;
  }>;
}

export const useRankedProviders = (category?: string, location?: string) => {
  const { data: rankingData } = useProviderRanking();

  return useQuery({
    queryKey: ['ranked-providers', category, location, rankingData?.rankedIds],
    queryFn: async () => {
      let query = supabase
        .from('usuarios')
        .select(`
          id,
          nome_completo,
          endereco_cidade,
          endereco_bairro,
          foto_perfil_url,
          servicos (
            id,
            titulo_servico,
            categoria,
            descricao,
            preco_unico,
            preco_por_hora,
            ativo
          )
        `)
        .eq('tipo_usuario', 'prestador');

      // Filtrar por localização se especificado
      if (location) {
        query = query.or(`endereco_cidade.ilike.%${location}%,endereco_bairro.ilike.%${location}%`);
      }

      const { data: providers, error } = await query;

      if (error) {
        console.error('Erro ao buscar prestadores:', error);
        throw error;
      }

      // Filtrar prestadores que têm serviços ativos
      let filteredProviders = (providers || [])
        .filter(p => p.servicos && p.servicos.length > 0)
        .map(p => ({
          ...p,
          servicos: p.servicos.filter((s: any) => s.ativo)
        }))
        .filter(p => p.servicos.length > 0);

      // Filtrar por categoria se especificado
      if (category) {
        filteredProviders = filteredProviders.filter(p =>
          p.servicos.some((s: any) => s.categoria === category)
        );
      }

      // Aplicar ranking de ML se disponível
      if (rankingData?.rankedIds && rankingData.rankedIds.length > 0) {
        const rankedIds = rankingData.rankedIds;
        
        // Ordenar os prestadores de acordo com o ranking de ML
        filteredProviders.sort((a, b) => {
          const indexA = rankedIds.indexOf(a.id);
          const indexB = rankedIds.indexOf(b.id);
          
          // Se ambos estão no ranking, ordenar pela posição
          if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
          }
          
          // Se apenas A está no ranking, A vem primeiro
          if (indexA !== -1) return -1;
          
          // Se apenas B está no ranking, B vem primeiro
          if (indexB !== -1) return 1;
          
          // Se nenhum está no ranking, manter ordem original
          return 0;
        });
      }

      return filteredProviders as unknown as Provider[];
    },
    enabled: true,
  });
};
