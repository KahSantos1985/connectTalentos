import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

interface Service {
  id: string;
  titulo_servico: string;
  categoria: string;
  descricao: string;
  preco_unico?: number | null;
  preco_por_hora?: number | null;
  ativo: boolean;
  created_at: string;
}

interface ServiceRequest {
  id: string;
  servico_id: string;
  cliente_id: string;
  status: string;
  metodo_pagamento: string;
  status_pagamento: string;
  valor_acordado: number | null;
  datas_solicitadas: string | null;
  data_proposta_prestador: string | null;
  mensagem_prestador: string | null;
  criado_at: string;
  servicos: {
    titulo_servico: string;
    preco_unico?: number | null;
    preco_por_hora?: number | null;
  };
  usuarios: {
    nome_completo: string;
    endereco_cidade: string;
    endereco_bairro: string;
  };
}

export const useProviderServices = () => {
  const { user } = useAuthContext();
  
  return useQuery({
    queryKey: ["provider-services", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("servicos")
        .select("*")
        .eq("prestador_id", user.id)
        .eq("ativo", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as unknown as Service[];
    },
    enabled: !!user?.id,
  });
};

export const useServiceRequests = () => {
  const { user } = useAuthContext();
  
  return useQuery({
    queryKey: ["service-requests", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("solicitacoes_servico")
        .select(`
          *,
          servicos(titulo_servico, prestador_id, preco_unico, preco_por_hora),
          usuarios:usuarios!solicitacoes_servico_cliente_id_fkey(nome_completo, endereco_cidade, endereco_bairro)
        `)
        .eq("prestador_id", user.id)
        .in("status", ["pendente", "aprovado", "em_andamento", "checked_in", "concluido"])
        .order("criado_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as unknown as ServiceRequest[];
    },
    enabled: !!user?.id,
  });
};

export const useConfirmDirectPayment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .from("solicitacoes_servico")
        .update({ status_pagamento: "confirmado_prestador" })
        .eq("id", requestId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-requests", user?.id] });
      toast.success("Pagamento marcado como recebido!");
    },
    onError: () => {
      toast.error("Erro ao confirmar recebimento do pagamento");
    },
  });
};

export const useProposeSchedule = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async ({
      requestId,
      dataProposta,
      mensagem,
    }: {
      requestId: string;
      dataProposta: string;
      mensagem?: string;
    }) => {
      const { error } = await supabase
        .from("solicitacoes_servico")
        .update({
          data_proposta_prestador: dataProposta,
          mensagem_prestador: mensagem ?? null,
        })
        .eq("id", requestId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-requests", user?.id] });
      toast.success("Proposta de data/horário enviada ao cliente!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Erro ao enviar proposta");
    },
  });
};

export const useUpdateRequestStatus = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();

  return useMutation({
    mutationFn: async ({ requestId, status }: { requestId: string; status: string }) => {
      const { error } = await supabase
        .from("solicitacoes_servico")
        .update({ status })
        .eq("id", requestId);

      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["service-requests", user?.id] });
      toast.success(
        status === "aprovado" 
          ? "Solicitação aprovada com sucesso!" 
          : "Solicitação recusada com sucesso!"
      );
    },
    onError: () => {
      toast.error("Erro ao atualizar status da solicitação");
    },
  });
};