import React, { useEffect, useState, useCallback } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, MessageSquare, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { ProviderTrackingMapLazy as ProviderTrackingMap } from "@/components/tracking/ProviderTrackingMapLazy";

interface ActiveRequest {
  id: string;
  status: string;
  criado_at: string;
  datas_solicitadas: string | null;
  data_proposta_prestador: string | null;
  mensagem_prestador: string | null;
  servico: { titulo_servico: string; categoria: string };
  prestador: { id: string; nome_completo: string };
}

const geocode = async (
  bairro: string,
  cidade: string
): Promise<{ lat: number; lng: number } | null> => {
  try {
    const q = encodeURIComponent(`${bairro}, ${cidade}, Brasil`);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${q}`
    );
    const data = await res.json();
    if (data?.[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    /* ignore */
  }
  return null;
};

const ResidentDashboard = () => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [requests, setRequests] = useState<ActiveRequest[]>([]);
  const [clientCoords, setClientCoords] = useState<{ lat: number; lng: number } | null>(null);

  const fetchRequests = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("solicitacoes_servico")
      .select(
        `id, status, criado_at, datas_solicitadas, data_proposta_prestador, mensagem_prestador,
         servicos!inner(titulo_servico, categoria),
         usuarios!solicitacoes_servico_prestador_id_fkey(id, nome_completo)`
      )
      .eq("cliente_id", user.id)
      .in("status", ["pendente", "aprovado"])
      .order("criado_at", { ascending: false });

    const mapped: ActiveRequest[] = (data || []).map((r: any) => ({
      id: r.id,
      status: r.status,
      criado_at: r.criado_at,
      datas_solicitadas: r.datas_solicitadas,
      data_proposta_prestador: r.data_proposta_prestador,
      mensagem_prestador: r.mensagem_prestador,
      servico: r.servicos,
      prestador: r.usuarios,
    }));
    setRequests(mapped);
  }, [user]);

  useEffect(() => {
    fetchRequests();
    if (user?.address_neighborhood && user?.address_city) {
      geocode(user.address_neighborhood, user.address_city).then(setClientCoords);
    }
  }, [user, fetchRequests]);

  const aceitarProposta = async (req: ActiveRequest) => {
    if (!req.data_proposta_prestador) return;
    const { error } = await supabase
      .from("solicitacoes_servico")
      .update({
        datas_solicitadas: req.data_proposta_prestador,
        data_proposta_prestador: null,
        mensagem_prestador: null,
      })
      .eq("id", req.id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Proposta aceita!", description: "Data/horário confirmado com o prestador." });
    fetchRequests();
  };

  const recusarProposta = async (req: ActiveRequest) => {
    const { error } = await supabase
      .from("solicitacoes_servico")
      .update({ data_proposta_prestador: null, mensagem_prestador: null })
      .eq("id", req.id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Proposta recusada", description: "Aguarde nova proposta do prestador." });
    fetchRequests();
  };

  const activeTracking = requests.find((r) => r.status === "aprovado");

  const getStatusColor = (status: string) =>
    status === "aprovado"
      ? "bg-blue-100 text-blue-800"
      : status === "concluido"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-20">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Olá, {user?.full_name}!
          </h1>
          <p className="text-muted-foreground">Bem-vindo ao seu painel de cliente</p>
        </div>

        {activeTracking && (
          <div className="mb-6">
            <ProviderTrackingMap
              solicitacaoId={activeTracking.id}
              clientLat={clientCoords?.lat}
              clientLng={clientCoords?.lng}
              providerName={activeTracking.prestador?.nome_completo}
            />
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Suas Solicitações</span>
              <Button variant="outline" size="sm">Ver Todas</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Você ainda não tem solicitações ativas.
              </p>
            ) : (
              <div className="space-y-4">
                {requests.map((r) => (
                  <div key={r.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-sm">
                          {r.servico?.titulo_servico}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Prestador: {r.prestador?.nome_completo}
                        </p>
                      </div>
                      <Badge className={getStatusColor(r.status)}>{r.status}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {r.datas_solicitadas || new Date(r.criado_at).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{user?.address_neighborhood}</span>
                      </div>
                    </div>

                    {r.data_proposta_prestador && (
                      <div className="rounded-md border-2 border-blue-300 bg-blue-50 p-3 space-y-2">
                        <div className="flex items-center gap-2 text-blue-900 font-semibold text-sm">
                          <MessageSquare className="h-4 w-4" />
                          Contraproposta do prestador
                        </div>
                        <div className="text-sm text-blue-900">
                          <strong>Nova data/horário proposto:</strong>{" "}
                          {r.data_proposta_prestador}
                        </div>
                        {r.mensagem_prestador && (
                          <div className="text-sm text-blue-800 italic">
                            "{r.mensagem_prestador}"
                          </div>
                        )}
                        <div className="flex gap-2 pt-1">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => aceitarProposta(r)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Aceitar proposta
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => recusarProposta(r)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Recusar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default ResidentDashboard;
