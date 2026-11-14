import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Calendar, DollarSign, Star, Users, Clock, CheckCircle, XCircle, MapPin, Camera, Calculator, CreditCard, Wallet, MessageSquare } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNavigation from "@/components/layout/BottomNavigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MarketInsights from "@/components/provider/MarketInsights";
import SebraeMarketAnalysis from "@/components/provider/SebraeMarketAnalysis";
import CnaeAnalysis from "@/components/provider/CnaeAnalysis";
import PricingChatbot from "@/components/provider/PricingChatbot";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useConfirmDirectPayment, useProposeSchedule, useProviderServices, useServiceRequests, useUpdateRequestStatus } from "@/hooks/useProviderServices";
import { useServiceCheckin } from "@/hooks/useServiceCheckin";
import { useServiceCompletion } from "@/hooks/useServiceCompletion";
import { format } from "date-fns";

type ServiceSummary = {
  preco_unico?: number | null;
  preco_por_hora?: number | null;
};

type RequestSummary = {
  valor_acordado?: number | null;
  metodo_pagamento?: string | null;
  status_pagamento?: string | null;
  servicos?: ServiceSummary | null;
};

const ProviderDashboardContent = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [isPricingChatbotOpen, setIsPricingChatbotOpen] = useState(false);
  const { data: services = [], isLoading: servicesLoading } = useProviderServices();
  const { data: serviceRequests = [], isLoading: requestsLoading } = useServiceRequests();
  const updateRequestMutation = useUpdateRequestStatus();
  const confirmDirectPaymentMutation = useConfirmDirectPayment();
  const proposeScheduleMutation = useProposeSchedule();
  const checkinMutation = useServiceCheckin();
  const completionMutation = useServiceCompletion();

  const [scheduleDialogId, setScheduleDialogId] = useState<string | null>(null);
  const [proposalDate, setProposalDate] = useState("");
  const [proposalMessage, setProposalMessage] = useState("");

  const openScheduleDialog = (request: any) => {
    setScheduleDialogId(request.id);
    setProposalDate(request.data_proposta_prestador ?? request.datas_solicitadas ?? "");
    setProposalMessage(request.mensagem_prestador ?? "");
  };

  const submitProposal = () => {
    if (!scheduleDialogId || !proposalDate.trim()) return;
    proposeScheduleMutation.mutate(
      { requestId: scheduleDialogId, dataProposta: proposalDate.trim(), mensagem: proposalMessage.trim() || undefined },
      { onSuccess: () => setScheduleDialogId(null) }
    );
  };

  const handleApproveRequest = (requestId: string) => {
    updateRequestMutation.mutate({ requestId, status: "aprovado" });
  };

  const handleDeclineRequest = (requestId: string) => {
    updateRequestMutation.mutate({ requestId, status: "recusado" });
  };

  const handleCheckin = (requestId: string) => {
    checkinMutation.mutate({ requestId });
  };

  const handleCompletion = (requestId: string) => {
    if (!user?.id) return;
    completionMutation.mutate({ requestId, providerId: user.id });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      pendente: { variant: "secondary", label: "Pendente" },
      aprovado: { variant: "default", label: "Aprovado" },
      checked_in: { variant: "outline", label: "Em Andamento" },
      concluido: { variant: "default", label: "Concluído" },
      recusado: { variant: "destructive", label: "Recusado" },
    };
    
    const statusInfo = statusMap[status] || { variant: "secondary" as const, label: status };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  // Calculate stats from real data
  const stats = {
    totalServices: services.length,
    activeRequests: serviceRequests.length,
    completedJobs: 0, // This would need another query for completed jobs
    rating: 4.8, // This would need to be calculated from reviews
    monthlyEarnings: 0 // This would need to be calculated from completed jobs
  };

  const formatPrice = (service: ServiceSummary) => {
    if (service.preco_unico) {
      return `R$ ${service.preco_unico}`;
    }
    if (service.preco_por_hora) {
      return `R$ ${service.preco_por_hora}/hora`;
    }
    return "Preço sob consulta";
  };

  const formatRequestPrice = (request: RequestSummary) => {
    const value = request.valor_acordado ?? request.servicos?.preco_unico ?? request.servicos?.preco_por_hora;

    if (value == null) {
      return "A combinar";
    }

    const suffix = request.valor_acordado != null || request.servicos?.preco_unico ? "" : "/hora";
    return `R$ ${Number(value).toFixed(2).replace(".", ",")}${suffix}`;
  };

  const getPaymentInfo = (request: RequestSummary) => {
    if (request.metodo_pagamento === "app") {
      return {
        icon: CreditCard,
        label: "Pagamento pelo app",
        status: request.status_pagamento === "pago_app" ? "Pago" : "Aguardando pagamento",
      };
    }

    return {
      icon: Wallet,
      label: "Pagamento direto ao prestador",
      status: request.status_pagamento === "confirmado_prestador" ? "Recebido" : "Receber após o serviço",
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        {/* Welcome Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Olá, {user?.full_name}!
            </h1>
            <p className="text-muted-foreground">
              Gerencie seus serviços e solicitações
            </p>
          </div>
          <Button 
            className="flex items-center space-x-2"
            onClick={() => navigate("/my-services")}
          >
            <Plus className="h-4 w-4" />
            <span>Gerenciar Serviços</span>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Serviços</p>
              <p className="text-xl font-bold">{stats.totalServices}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Ativos</p>
              <p className="text-xl font-bold">{stats.activeRequests}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Concluídos</p>
              <p className="text-xl font-bold">{stats.completedJobs}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Star className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Avaliação</p>
              <p className="text-xl font-bold">{stats.rating}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Este Mês</p>
              <p className="text-xl font-bold">R$ {stats.monthlyEarnings}</p>
            </CardContent>
          </Card>
        </div>

        {/* Market Intelligence Section */}
        <div className="mb-8 space-y-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Dados de Inteligência de Mercado</h3>
                  <p className="text-sm text-muted-foreground">
                    As análises e estatísticas apresentadas abaixo são baseadas em dados oficiais do{" "}
                    <span className="font-semibold text-foreground">SEBRAE (Serviço Brasileiro de Apoio às Micro e Pequenas Empresas)</span>{" "}
                    referentes ao estado de <span className="font-semibold text-foreground">São Paulo</span>.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <ErrorBoundary>
            <MarketInsights />
          </ErrorBoundary>
        </div>

        {/* SEBRAE Market Analysis */}
        <div className="mb-8">
          <ErrorBoundary>
            <SebraeMarketAnalysis />
          </ErrorBoundary>
        </div>

        {/* CNAE Analysis */}
        <div className="mb-8">
          <ErrorBoundary>
            <CnaeAnalysis />
          </ErrorBoundary>
        </div>

        {/* Pricing Assistant Card with Dialog Trigger */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Assistente de Precificação
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Use nossa calculadora inteligente para definir preços competitivos e lucrativos
            </p>
          </CardHeader>
          <CardContent>
            <Dialog open={isPricingChatbotOpen} onOpenChange={setIsPricingChatbotOpen}>
              <DialogTrigger asChild>
                <Button className="w-full flex items-center justify-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Abrir Calculadora de Preços
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    Assistente de Precificação
                  </DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-hidden">
                  <PricingChatbot />
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* My Services Section */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Meus Serviços</CardTitle>
              <p className="text-sm text-muted-foreground">
                Gerencie os serviços que você oferece
              </p>
            </div>
            <Button 
              onClick={() => navigate("/my-services")}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Ver Todos os Serviços</span>
            </Button>
          </CardHeader>
          <CardContent>
            {servicesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Carregando serviços...</p>
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Você ainda não cadastrou nenhum serviço.</p>
                <Button 
                  onClick={() => navigate("/my-services")}
                  className="mt-4"
                >
                  Cadastrar Primeiro Serviço
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                  <Card key={service.id} className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{service.titulo_servico}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{service.categoria}</p>
                    <p className="text-sm text-muted-foreground mb-3">{service.descricao}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-primary">
                        {formatPrice(service)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {service.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Service Requests Section */}
        <Card>
          <CardHeader>
            <CardTitle>Solicitações de Serviço</CardTitle>
            <p className="text-sm text-muted-foreground">
              Gerencie suas solicitações de serviço
            </p>
          </CardHeader>
          <CardContent>
            {requestsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Carregando solicitações...</p>
              </div>
            ) : serviceRequests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhuma solicitação ativa no momento.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Datas</TableHead>
                    <TableHead>Cobrança/Pagamento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.servicos?.titulo_servico ?? "Serviço"}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.usuarios?.nome_completo ?? 'Cliente'}</div>
                          <div className="text-sm text-muted-foreground">
                            {request.usuarios?.endereco_bairro ?? '—'}, {request.usuarios?.endereco_cidade ?? '—'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1 min-w-44">
                          <div>
                            <span className="text-xs text-muted-foreground">Cliente pediu:</span>
                            <div className="font-medium">{request.datas_solicitadas || 'A combinar'}</div>
                          </div>
                          {request.data_proposta_prestador && (
                            <div className="rounded-md border border-primary/30 bg-primary/5 p-2">
                              <span className="text-xs text-primary font-semibold">Sua proposta:</span>
                              <div className="font-medium">{request.data_proposta_prestador}</div>
                              {request.mensagem_prestador && (
                                <div className="text-xs text-muted-foreground mt-1 italic">
                                  "{request.mensagem_prestador}"
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const payment = getPaymentInfo(request);
                          const PaymentIcon = payment.icon;

                          return (
                            <div className="min-w-52 space-y-2 rounded-md border bg-muted/30 p-3 text-sm">
                              <div className="flex items-center gap-2 font-medium text-foreground">
                                <DollarSign className="h-4 w-4 text-primary" />
                                {formatRequestPrice(request)}
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <PaymentIcon className="h-4 w-4 text-primary" />
                                <span>{payment.label}</span>
                              </div>
                              <Badge variant={request.status_pagamento === "pendente" ? "secondary" : "default"}>
                                {payment.status}
                              </Badge>
                            </div>
                          );
                        })()}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(request.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                        {(request.status === 'pendente' || request.status === 'aprovado') && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openScheduleDialog(request)}
                            className="flex items-center space-x-1"
                          >
                            <MessageSquare className="h-3 w-3" />
                            <span>Negociar data/horário</span>
                          </Button>
                        )}
                        {request.status === 'pendente' && (
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveRequest(request.id)}
                              disabled={updateRequestMutation.isPending}
                              className="flex items-center space-x-1"
                            >
                              <CheckCircle className="h-3 w-3" />
                              <span>Aprovar</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeclineRequest(request.id)}
                              disabled={updateRequestMutation.isPending}
                              className="flex items-center space-x-1"
                            >
                              <XCircle className="h-3 w-3" />
                              <span>Recusar</span>
                            </Button>
                          </div>
                        )}
                        {request.status === 'aprovado' && (
                          <Button
                            size="sm"
                            onClick={() => handleCheckin(request.id)}
                            disabled={checkinMutation.isPending}
                            className="flex items-center space-x-1"
                          >
                            <MapPin className="h-3 w-3" />
                            <span>Check-in e Iniciar</span>
                          </Button>
                        )}
                        {request.status === 'checked_in' && (
                          <Button
                            size="sm"
                            onClick={() => handleCompletion(request.id)}
                            disabled={completionMutation.isPending}
                            className="flex items-center space-x-1"
                          >
                            <Camera className="h-3 w-3" />
                            <span>Concluir e Anexar Foto</span>
                          </Button>
                        )}
                        {request.status === 'concluido' &&
                          request.metodo_pagamento === 'direto' &&
                          request.status_pagamento !== 'confirmado_prestador' && (
                            <Button
                              size="sm"
                              onClick={() => confirmDirectPaymentMutation.mutate(request.id)}
                              disabled={confirmDirectPaymentMutation.isPending}
                              className="flex items-center space-x-1"
                            >
                              <CheckCircle className="h-3 w-3" />
                              <span>Confirmar recebimento</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={!!scheduleDialogId} onOpenChange={(o) => !o && setScheduleDialogId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Negociar data e horário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="proposal-date">Data e horário propostos</Label>
              <Input
                id="proposal-date"
                placeholder="Ex: Sábado 03/05 às 14h"
                value={proposalDate}
                onChange={(e) => setProposalDate(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Sugira ao cliente uma data/horário que funcione para você.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="proposal-msg">Mensagem (opcional)</Label>
              <Textarea
                id="proposal-msg"
                placeholder="Ex: Posso atender no sábado pela tarde, tudo bem?"
                value={proposalMessage}
                onChange={(e) => setProposalMessage(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleDialogId(null)}>
              Cancelar
            </Button>
            <Button
              onClick={submitProposal}
              disabled={!proposalDate.trim() || proposeScheduleMutation.isPending}
            >
              Enviar proposta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
      <BottomNavigation />
    </div>
  );
};

const ProviderDashboard = () => {
  return (
    <ProtectedRoute requiredUserType="provider">
      <ProviderDashboardContent />
    </ProtectedRoute>
  );
};

export default ProviderDashboard;