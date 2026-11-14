import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, CreditCard, Wallet, Loader2 } from "lucide-react";

interface ServiceDetail {
  id: string;
  titulo_servico: string;
  categoria: string;
  descricao: string;
  preco_unico: number | null;
  preco_por_hora: number | null;
  prestador_id: string;
  prestador: {
    id: string;
    nome_completo: string;
    foto_perfil_url: string | null;
    endereco_bairro: string;
    endereco_cidade: string;
  };
}

const ServiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { toast } = useToast();

  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [datas, setDatas] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState<"app" | "direto">("direto");

  // O id vem como `${providerId}-${serviceId}` do ProviderCard
  const serviceId = id?.includes("-") && id.split("-").length > 5
    ? id.split("-").slice(5).join("-")
    : id;

  useEffect(() => {
    if (!serviceId) return;
    setLoading(true);
    supabase
      .from("servicos")
      .select(
        `id, titulo_servico, categoria, descricao, preco_unico, preco_por_hora, prestador_id,
         usuarios!servicos_prestador_id_fkey(id, nome_completo, foto_perfil_url, endereco_bairro, endereco_cidade)`
      )
      .eq("id", serviceId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) {
          toast({ title: "Serviço não encontrado", variant: "destructive" });
          navigate("/search");
          return;
        }
        const s: any = data;
        setService({ ...s, prestador: s.usuarios });
        
        setLoading(false);
      });
  }, [serviceId, navigate, toast]);

  const handleSolicitar = async () => {
    if (!user) {
      toast({ title: "Faça login para solicitar", variant: "destructive" });
      navigate("/login");
      return;
    }
    if (!service) return;
    if (user.id === service.prestador_id) {
      toast({ title: "Você não pode solicitar seu próprio serviço", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("solicitacoes_servico").insert({
      cliente_id: user.id,
      prestador_id: service.prestador_id,
      servico_id: service.id,
      datas_solicitadas: datas || null,
      valor_acordado: service.preco_unico ?? service.preco_por_hora ?? null,
      metodo_pagamento: metodoPagamento,
      status: "pendente",
      status_pagamento: "pendente",
    });
    setSubmitting(false);

    if (error) {
      toast({ title: "Erro ao solicitar", description: error.message, variant: "destructive" });
      return;
    }

    toast({
      title: "Solicitação enviada!",
      description:
        metodoPagamento === "app"
          ? "Você pagará pelo app após a aprovação do prestador."
          : "Você combinará o pagamento diretamente com o prestador.",
    });
    navigate("/resident-dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!service) return null;

  const precoLabel = service.preco_unico
    ? `R$ ${service.preco_unico.toFixed(2)} (valor fixo)`
    : service.preco_por_hora
    ? `R$ ${service.preco_por_hora.toFixed(2)} / hora`
    : "A combinar";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-24 max-w-2xl">
        <Card className="mb-4">
          <CardHeader>
            <div className="flex items-start gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={service.prestador.foto_perfil_url ?? undefined} />
                <AvatarFallback>{service.prestador.nome_completo.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-xl">{service.titulo_servico}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {service.prestador.nome_completo}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge variant="secondary">{service.categoria}</Badge>
                  <span className="text-sm font-semibold text-primary">{precoLabel}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{service.descricao}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {service.prestador.endereco_bairro}, {service.prestador.endereco_cidade}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Solicitar serviço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="datas">Datas/horários desejados</Label>
              <Input
                id="datas"
                placeholder="Ex: Sábado pela manhã"
                value={datas}
                onChange={(e) => setDatas(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Valor do serviço</Label>
              <div className="border rounded-lg p-3 bg-muted/30 text-sm">
                <span className="font-semibold text-primary">{precoLabel}</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Valor definido pelo prestador. Não pode ser alterado.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Forma de pagamento</Label>
              <RadioGroup
                value={metodoPagamento}
                onValueChange={(v) => setMetodoPagamento(v as "app" | "direto")}
                className="gap-3"
              >
                <label
                  htmlFor="pay-app"
                  className={`flex items-start gap-3 border rounded-lg p-3 cursor-pointer transition ${
                    metodoPagamento === "app" ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <RadioGroupItem value="app" id="pay-app" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-medium">
                      <CreditCard className="h-4 w-4" />
                      Pagar pelo app
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Pagamento processado pela plataforma após aprovação. (Em breve)
                    </p>
                  </div>
                </label>

                <label
                  htmlFor="pay-direto"
                  className={`flex items-start gap-3 border rounded-lg p-3 cursor-pointer transition ${
                    metodoPagamento === "direto" ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <RadioGroupItem value="direto" id="pay-direto" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 font-medium">
                      <Wallet className="h-4 w-4" />
                      Pagamento direto ao prestador
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Combinar pagamento (dinheiro/Pix) ao concluir o serviço. O prestador
                      confirma o recebimento no app.
                    </p>
                  </div>
                </label>
              </RadioGroup>
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={submitting}
              onClick={handleSolicitar}
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Enviar solicitação
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default ServiceDetailPage;
