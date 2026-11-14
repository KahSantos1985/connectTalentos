import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Autorização necessária');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verificar usuário autenticado
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Usuário não autenticado');
    }

    const { requestId, latitude, longitude } = await req.json();

    // Validar input
    if (!requestId || typeof requestId !== 'number') {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid request ID' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid coordinates' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Validar ranges de coordenadas
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return new Response(
        JSON.stringify({ success: false, error: 'Coordinates out of valid range' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Verificar se a solicitação existe e está no status correto
    const { data: request, error: fetchError } = await supabaseClient
      .from('solicitacoes_servico')
      .select(`
        id,
        status,
        servico_id,
        servicos!inner (
          prestador_id
        )
      `)
      .eq('id', requestId)
      .single();

    if (fetchError || !request) {
      throw new Error('Solicitação não encontrada');
    }

    // Verificar se o usuário é o prestador do serviço
    const servico = Array.isArray(request.servicos) ? request.servicos[0] : request.servicos;
    if (!servico || servico.prestador_id !== user.id) {
      throw new Error('Apenas o prestador do serviço pode fazer check-in');
    }

    // Verificar se o status é 'aprovado'
    if (request.status !== 'aprovado') {
      throw new Error(`Check-in não permitido. Status atual: ${request.status}. Necessário: aprovado`);
    }

    // Preparar dados de geolocalização com precisão reduzida (privacidade)
    // Arredondar para ~11m de precisão
    const checkinData = {
      lat: Math.round(latitude * 10000) / 10000,
      lng: Math.round(longitude * 10000) / 10000,
      ts: new Date().toISOString()
    };

    // Atualizar a solicitação com check-in
    const { error: updateError } = await supabaseClient
      .from('solicitacoes_servico')
      .update({
        status: 'checked_in',
        checkin_location: JSON.stringify(checkinData)
      })
      .eq('id', requestId);

    if (updateError) {
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to update service request' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Check-in realizado com sucesso',
        data: {
          requestId,
          newStatus: 'checked_in'
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
