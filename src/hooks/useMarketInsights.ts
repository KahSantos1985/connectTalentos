import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";

interface MarketInsight {
  id: string;
  cidade: string;
  bairro: string;
  categoria: string | null;
  total_prestadores: number;
  preco_medio: number | null;
  demanda_estimada: number | null;
  insights_json: any;
  updated_at: string;
}

export const useMarketInsights = () => {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ["market-insights", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      // First, get the user's location from usuarios table
      const { data: userData, error: userError } = await supabase
        .from("usuarios")
        .select("endereco_cidade, endereco_bairro")
        .eq("id", user.id)
        .single();

      if (userError) throw userError;
      if (!userData) throw new Error("User data not found");

      // Then fetch market insights for the user's location
      const { data, error } = await supabase
        .from("market_insights")
        .select("*")
        .eq("cidade", userData.endereco_cidade)
        .eq("bairro", userData.endereco_bairro)
        .maybeSingle();

      if (error) throw error;
      if (data) return data as MarketInsight;

      // Fallback: compute live insights from registered providers/services in the same city
      const cidade = userData.endereco_cidade || "";
      const bairro = userData.endereco_bairro || "";
      let provQuery = supabase
        .from("usuarios")
        .select("id, endereco_bairro")
        .eq("tipo_usuario", "prestador")
        .neq("id", user.id);
      if (cidade) provQuery = provQuery.ilike("endereco_cidade", cidade);
      const { data: providers } = await provQuery;
      const provs = providers ?? [];
      const sameBairro = provs.filter(
        (p) => (p.endereco_bairro || "").toLowerCase() === bairro.toLowerCase()
      );
      const ids = provs.map((p) => p.id);

      let precoMedio: number | null = null;
      if (ids.length) {
        const { data: svcs } = await supabase
          .from("servicos")
          .select("preco_unico, preco_por_hora")
          .eq("ativo", true)
          .in("prestador_id", ids);
        const prices = (svcs ?? [])
          .map((s) => Number(s.preco_unico ?? s.preco_por_hora))
          .filter((n) => Number.isFinite(n) && n > 0);
        if (prices.length) precoMedio = prices.reduce((a, b) => a + b, 0) / prices.length;
      }

      return {
        id: "computed",
        cidade: cidade || "sua cidade",
        bairro: bairro || "sua região",
        categoria: null,
        total_prestadores: sameBairro.length || provs.length,
        preco_medio: precoMedio,
        demanda_estimada: null,
        insights_json: null,
        updated_at: new Date().toISOString(),
      } as MarketInsight;
    },
    enabled: !!user?.id,
  });
};
