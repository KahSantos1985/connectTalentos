import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body for seed key
    const body = await req.json().catch(() => ({}));
    const seedKey = body.seedKey || req.headers.get('x-seed-key');
    
    // Simple protection: require seed key (you can call with any key for now)
    // In production, you'd validate against a secret
    if (!seedKey) {
      return new Response(
        JSON.stringify({ error: 'Seed key required in body or x-seed-key header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Using service role key to bypass RLS for seeding data
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const providers = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        nome_completo: 'Carlos Silva',
        email: 'carlos.eletricista@email.com',
        tipo_usuario: 'prestador',
        endereco_cidade: 'São Paulo',
        endereco_bairro: 'Vila Mariana',
        contato_telefone: '(11) 98765-4321',
        foto_perfil_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos'
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        nome_completo: 'João Santos',
        email: 'joao.encanador@email.com',
        tipo_usuario: 'prestador',
        endereco_cidade: 'São Paulo',
        endereco_bairro: 'Pinheiros',
        contato_telefone: '(11) 97654-3210',
        foto_perfil_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao'
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        nome_completo: 'Roberto Lima',
        email: 'roberto.chaveiro@email.com',
        tipo_usuario: 'prestador',
        endereco_cidade: 'São Paulo',
        endereco_bairro: 'Centro',
        contato_telefone: '(11) 96543-2109',
        foto_perfil_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto'
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        nome_completo: 'Maria Oliveira',
        email: 'maria.trancista@email.com',
        tipo_usuario: 'prestador',
        endereco_cidade: 'São Paulo',
        endereco_bairro: 'Mooca',
        contato_telefone: '(11) 95432-1098',
        foto_perfil_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria'
      },
      {
        id: '55555555-5555-5555-5555-555555555555',
        nome_completo: 'Ana Paula Costa',
        email: 'ana.baba@email.com',
        tipo_usuario: 'prestador',
        endereco_cidade: 'São Paulo',
        endereco_bairro: 'Tatuapé',
        contato_telefone: '(11) 94321-0987',
        foto_perfil_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana'
      },
      {
        id: '66666666-6666-6666-6666-666666666666',
        nome_completo: 'Juliana Ferreira',
        email: 'juliana.manicure@email.com',
        tipo_usuario: 'prestador',
        endereco_cidade: 'São Paulo',
        endereco_bairro: 'Jardins',
        contato_telefone: '(11) 93210-9876',
        foto_perfil_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juliana'
      }
    ];

    // Inserir prestadores
    for (const provider of providers) {
      const { error: providerError } = await supabaseClient
        .from('usuarios')
        .upsert(provider, { onConflict: 'id' });

      if (providerError) {
        console.error('Erro ao inserir prestador:', providerError);
      }
    }

    const services = [
      // Eletricista
      {
        prestador_id: '11111111-1111-1111-1111-111111111111',
        titulo_servico: 'Instalação Elétrica Residencial',
        descricao: 'Instalação completa de sistemas elétricos, tomadas, interruptores e quadros de distribuição. Trabalho com segurança e qualidade garantida.',
        categoria: 'Elétrica',
        preco_unico: 150.00,
        preco_por_hora: 80.00,
        ativo: true
      },
      {
        prestador_id: '11111111-1111-1111-1111-111111111111',
        titulo_servico: 'Manutenção Elétrica',
        descricao: 'Manutenção preventiva e corretiva de instalações elétricas, troca de disjuntores e reparos em geral.',
        categoria: 'Elétrica',
        preco_por_hora: 70.00,
        ativo: true
      },
      // Encanador
      {
        prestador_id: '22222222-2222-2222-2222-222222222222',
        titulo_servico: 'Desentupimento de Canos',
        descricao: 'Serviço especializado em desentupimento de pias, vasos sanitários, ralos e caixas de gordura.',
        categoria: 'Hidráulica',
        preco_unico: 120.00,
        ativo: true
      },
      {
        prestador_id: '22222222-2222-2222-2222-222222222222',
        titulo_servico: 'Instalação Hidráulica',
        descricao: 'Instalação de torneiras, chuveiros, válvulas de descarga e tubulações. Atendimento rápido e eficiente.',
        categoria: 'Hidráulica',
        preco_por_hora: 75.00,
        ativo: true
      },
      // Chaveiro
      {
        prestador_id: '33333333-3333-3333-3333-333333333333',
        titulo_servico: 'Abertura de Portas 24h',
        descricao: 'Serviço emergencial de abertura de portas, carros e cofres. Disponível 24 horas por dia.',
        categoria: 'Chaveiro',
        preco_unico: 100.00,
        ativo: true
      },
      {
        prestador_id: '33333333-3333-3333-3333-333333333333',
        titulo_servico: 'Cópia de Chaves e Fechaduras',
        descricao: 'Cópia de chaves residenciais, automotivas e comerciais. Instalação e troca de fechaduras.',
        categoria: 'Chaveiro',
        preco_unico: 50.00,
        ativo: true
      },
      // Trancista
      {
        prestador_id: '44444444-4444-4444-4444-444444444444',
        titulo_servico: 'Tranças Afro e Box Braids',
        descricao: 'Especialista em tranças afro, box braids, twist e penteados afros. Atendimento com hora marcada.',
        categoria: 'Beleza',
        preco_por_hora: 60.00,
        ativo: true
      },
      {
        prestador_id: '44444444-4444-4444-4444-444444444444',
        titulo_servico: 'Dreadlocks e Manutenção',
        descricao: 'Criação e manutenção de dreadlocks naturais e sintéticos. Trabalho artesanal de qualidade.',
        categoria: 'Beleza',
        preco_unico: 200.00,
        ativo: true
      },
      // Babá
      {
        prestador_id: '55555555-5555-5555-5555-555555555555',
        titulo_servico: 'Cuidado Infantil Diário',
        descricao: 'Cuidado profissional de crianças, com experiência em primeiros socorros e atividades educativas.',
        categoria: 'Cuidados',
        preco_por_hora: 25.00,
        ativo: true
      },
      {
        prestador_id: '55555555-5555-5555-5555-555555555555',
        titulo_servico: 'Babá para Eventos',
        descricao: 'Serviço de babá para eventos, festas e ocasiões especiais. Profissional com referências.',
        categoria: 'Cuidados',
        preco_unico: 150.00,
        ativo: true
      },
      // Manicure
      {
        prestador_id: '66666666-6666-6666-6666-666666666666',
        titulo_servico: 'Manicure e Pedicure Completo',
        descricao: 'Serviço completo de manicure e pedicure com esmaltação tradicional ou em gel.',
        categoria: 'Beleza',
        preco_unico: 50.00,
        ativo: true
      },
      {
        prestador_id: '66666666-6666-6666-6666-666666666666',
        titulo_servico: 'Alongamento de Unhas',
        descricao: 'Alongamento de unhas em gel ou fibra de vidro com design personalizado.',
        categoria: 'Beleza',
        preco_unico: 120.00,
        ativo: true
      }
    ];

    // Inserir serviços
    const { error: servicesError } = await supabaseClient
      .from('servicos')
      .insert(services);

    if (servicesError) {
      throw servicesError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Prestadores e serviços fictícios criados com sucesso!',
        providersCount: providers.length,
        servicesCount: services.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
