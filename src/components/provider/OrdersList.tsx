import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, User, Clock, CreditCard, Wallet, CheckCircle2 } from "lucide-react";
import { ShareLocationToggle } from "@/components/tracking/ShareLocationToggle";

interface Order {
  id: string;
  status: string;
  datas_solicitadas: string | null;
  criado_at: string;
  metodo_pagamento: string;
  status_pagamento: string;
  valor_acordado: number | null;
  servico: {
    titulo_servico: string;
    categoria: string;
    preco_unico: number | null;
    preco_por_hora: number | null;
  };
  cliente: {
    nome_completo: string;
    endereco_bairro: string;
    endereco_cidade: string;
    contato_telefone: string | null;
  } | null;
}

const OrdersList = () => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('solicitacoes_servico')
        .select(`
          id,
          status,
          datas_solicitadas,
          criado_at,
          metodo_pagamento,
          status_pagamento,
          valor_acordado,
          servicos (
            titulo_servico,
            categoria,
            preco_unico,
            preco_por_hora,
            prestador_id
          ),
          cliente:usuarios!solicitacoes_servico_cliente_id_fkey (
            nome_completo,
            endereco_bairro,
            endereco_cidade,
            contato_telefone
          )
        `)
        .eq('prestador_id', user?.id)
        .order('criado_at', { ascending: false });

      if (error) {
        throw error;
      }

      const transformedData: Order[] = (data || []).map((order: any) => ({
        id: order.id,
        status: order.status,
        datas_solicitadas: order.datas_solicitadas,
        criado_at: order.criado_at,
        metodo_pagamento: order.metodo_pagamento,
        status_pagamento: order.status_pagamento,
        valor_acordado: order.valor_acordado,
        servico: order.servicos,
        cliente: order.cliente ?? order.usuarios ?? null,
      }));

      setOrders(transformedData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar pedidos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('solicitacoes_servico')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
        throw error;
      }

      toast({
        title: "Status atualizado!",
        description: `Pedido ${newStatus === 'aprovado' ? 'aprovado' : 'rejeitado'} com sucesso.`,
      });

      fetchOrders(); // Refresh the list
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status do pedido.",
        variant: "destructive",
      });
    }
  };

  const confirmarRecebimento = async (orderId: string) => {
    const { error } = await supabase
      .from('solicitacoes_servico')
      .update({ status_pagamento: 'confirmado_prestador' })
      .eq('id', orderId);

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Recebimento confirmado!", description: "Pagamento marcado como recebido." });
    fetchOrders();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'aprovado':
        return 'bg-blue-100 text-blue-800';
      case 'rejeitado':
        return 'bg-red-100 text-red-800';
      case 'concluido':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'aprovado':
        return 'Aprovado';
      case 'rejeitado':
        return 'Rejeitado';
      case 'concluido':
        return 'Concluído';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando pedidos...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos de Serviços</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum pedido encontrado.
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{order.servico?.titulo_servico ?? 'Serviço'}</h3>
                    <p className="text-sm text-muted-foreground">{order.servico?.categoria ?? '—'}</p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{order.cliente?.nome_completo ?? 'Cliente'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{order.cliente?.endereco_bairro ?? '—'}, {order.cliente?.endereco_cidade ?? '—'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Datas: {order.datas_solicitadas || 'A combinar'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Solicitado em: {new Date(order.criado_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                {order.cliente?.contato_telefone && (
                  <div className="text-sm">
                    <strong>Telefone:</strong> {order.cliente.contato_telefone}
                  </div>
                )}

                <div className="text-sm">
                  <strong>Valor:</strong>{' '}
                  {order.valor_acordado != null
                    ? `R$ ${Number(order.valor_acordado).toFixed(2)} (acordado)`
                    : order.servico?.preco_unico
                    ? `R$ ${order.servico.preco_unico.toFixed(2)} (fixo)`
                    : order.servico?.preco_por_hora
                    ? `R$ ${order.servico.preco_por_hora.toFixed(2)}/hora`
                    : 'A combinar'}
                </div>

                <div className={`flex items-center gap-2 text-sm rounded-md p-3 border-2 ${
                  order.metodo_pagamento === 'app'
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-amber-50 border-amber-300'
                }`}>
                  {order.metodo_pagamento === 'app' ? (
                    <>
                      <CreditCard className="h-5 w-5 text-blue-700" />
                      <div className="flex-1">
                        <div className="font-semibold text-blue-900">Pagamento pelo app</div>
                        <div className="text-xs text-blue-700">Cliente pagará pela plataforma</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Wallet className="h-5 w-5 text-amber-700" />
                      <div className="flex-1">
                        <div className="font-semibold text-amber-900">Pagamento direto ao prestador</div>
                        <div className="text-xs text-amber-700">Combine dinheiro/Pix ao concluir</div>
                      </div>
                    </>
                  )}
                  {order.status_pagamento === 'confirmado_prestador' && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Recebido
                    </Badge>
                  )}
                </div>

                {order.status === 'pendente' && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'aprovado')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Aprovar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateOrderStatus(order.id, 'rejeitado')}
                    >
                      Rejeitar
                    </Button>
                  </div>
                )}

                {order.status === 'aprovado' && user && (
                  <div className="space-y-3 pt-2">
                    <ShareLocationToggle
                      solicitacaoId={order.id}
                      prestadorId={user.id}
                    />
                    <Button
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'concluido')}
                    >
                      Marcar como Concluído
                    </Button>
                  </div>
                )}

                {order.status === 'concluido' &&
                  order.metodo_pagamento === 'direto' &&
                  order.status_pagamento !== 'confirmado_prestador' && (
                    <div className="pt-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => confirmarRecebimento(order.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Confirmar recebimento do pagamento
                      </Button>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersList;