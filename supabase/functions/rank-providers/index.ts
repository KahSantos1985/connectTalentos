import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  record.count++;
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting
  const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(clientIp)) {
    return new Response(
      JSON.stringify({ error: 'Too many requests', rankedIds: [] }),
      { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Buscar todos os prestadores com seus serviços
    const { data: providers, error } = await supabaseClient
      .from('usuarios')
      .select(`
        id,
        nome_completo,
        servicos (
          id,
          titulo_servico,
          categoria
        )
      `)
      .eq('tipo_usuario', 'prestador');

    if (error) {
      console.error('Failed to fetch providers:', error);
      throw new Error(error.message || 'Failed to fetch providers');
    }

    // Buscar avaliações separadamente (sem FK relation)
    const providerIds = (providers || []).map((p: any) => p.id);
    let avaliacoesByProvider: Record<string, number[]> = {};
    if (providerIds.length > 0) {
      const { data: avaliacoes } = await supabaseClient
        .from('avaliacoes')
        .select('prestador_id, nota')
        .in('prestador_id', providerIds);
      for (const a of avaliacoes || []) {
        const pid = (a as any).prestador_id;
        if (!avaliacoesByProvider[pid]) avaliacoesByProvider[pid] = [];
        avaliacoesByProvider[pid].push((a as any).nota);
      }
    }

    // Calcular score para cada prestador
    const rankedProviders = providers
      ?.map(provider => {
        // Calcular média de avaliações
        const ratings = avaliacoesByProvider[provider.id] || [];
        const avgRating = ratings.length > 0
          ? ratings.reduce((sum: number, n: number) => sum + Number(n), 0) / ratings.length
          : 0;

        // Número de serviços oferecidos
        const serviceCount = provider.servicos?.length || 0;

        // Score composto (70% avaliação, 30% quantidade de serviços)
        // Normalizar serviceCount para escala 0-1 (assumindo máximo 10 serviços)
        const normalizedServiceCount = Math.min(serviceCount / 10, 1);
        const score = (avgRating / 5) * 0.7 + normalizedServiceCount * 0.3;

        return {
          id: provider.id,
          score
        };
      })
      .sort((a, b) => b.score - a.score) || [];

    // Retornar apenas os IDs ordenados por score
    const rankedIds = rankedProviders.map(p => p.id);

    return new Response(
      JSON.stringify({
        rankedIds,
        metadata: {
          totalProviders: rankedProviders.length,
          timestamp: new Date().toISOString()
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('rank-providers error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
        rankedIds: []
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
