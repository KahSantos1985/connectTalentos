import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNavigation from "@/components/layout/BottomNavigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useProviderServices } from "@/hooks/useProviderServices";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { serviceSchema } from "@/lib/validations";
import { ZodError } from "zod";

const categories = [
  "Limpeza",
  "Jardinagem",
  "Elétrica",
  "Encanamento",
  "Pintura",
  "Marcenaria",
  "Tecnologia",
  "Cuidados Pessoais",
  "Educação",
  "Outros"
];

interface ServiceFormData {
  titulo_servico: string;
  descricao: string;
  categoria: string;
  preco_unico: string;
  preco_por_hora: string;
}

interface ServiceFormProps {
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
  formData: ServiceFormData;
  onFieldChange: (field: string, value: string) => void;
  loading: boolean;
}

const ServiceForm = ({ onSubmit, submitLabel, formData, onFieldChange, loading }: ServiceFormProps) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div>
      <Label htmlFor="titulo">Título do Serviço</Label>
      <Input
        id="titulo"
        value={formData.titulo_servico}
        onChange={(e) => onFieldChange("titulo_servico", e.target.value)}
        placeholder="Ex: Limpeza residencial completa"
        required
      />
    </div>

    <div>
      <Label htmlFor="categoria">Categoria</Label>
      <Select value={formData.categoria} onValueChange={(value) => onFieldChange("categoria", value)} required>
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma categoria" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div>
      <Label htmlFor="descricao">Descrição</Label>
      <Textarea
        id="descricao"
        value={formData.descricao}
        onChange={(e) => onFieldChange("descricao", e.target.value)}
        placeholder="Descreva detalhadamente o serviço que você oferece..."
        rows={4}
        required
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="preco_unico">Preço Fixo (R$)</Label>
        <Input
          id="preco_unico"
          type="number"
          step="0.01"
          value={formData.preco_unico}
          onChange={(e) => onFieldChange("preco_unico", e.target.value)}
          placeholder="150.00"
        />
      </div>

      <div>
        <Label htmlFor="preco_por_hora">Preço por Hora (R$)</Label>
        <Input
          id="preco_por_hora"
          type="number"
          step="0.01"
          value={formData.preco_por_hora}
          onChange={(e) => onFieldChange("preco_por_hora", e.target.value)}
          placeholder="50.00"
        />
      </div>
    </div>

    <Button type="submit" disabled={loading} className="w-full">
      {loading ? "Salvando..." : submitLabel}
    </Button>
  </form>
);

const MyServicesContent = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: services = [], isLoading, refetch } = useProviderServices();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    titulo_servico: "",
    descricao: "",
    categoria: "",
    preco_unico: "",
    preco_por_hora: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      titulo_servico: "",
      descricao: "",
      categoria: "",
      preco_unico: "",
      preco_por_hora: "",
    });
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const validatedData = serviceSchema.parse(formData);
      
      const serviceData = {
        prestador_id: user.id,
        titulo_servico: validatedData.titulo_servico,
        descricao: validatedData.descricao,
        categoria: validatedData.categoria,
        preco_unico: validatedData.preco_unico ? parseFloat(validatedData.preco_unico) : null,
        preco_por_hora: validatedData.preco_por_hora ? parseFloat(validatedData.preco_por_hora) : null,
        ativo: true,
      };

      const { error } = await supabase
        .from('servicos')
        .insert([serviceData]);

      if (error) throw error;

      toast({
        title: "Serviço cadastrado!",
        description: "Seu serviço foi cadastrado com sucesso.",
      });

      resetForm();
      setIsAddDialogOpen(false);
      refetch();
    } catch (error) {
      if (error instanceof ZodError) {
        toast({
          title: "Erro de validação",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro",
          description: "Erro ao cadastrar serviço. Tente novamente.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    setLoading(true);
    try {
      const validatedData = serviceSchema.parse(formData);
      
      const serviceData = {
        titulo_servico: validatedData.titulo_servico,
        descricao: validatedData.descricao,
        categoria: validatedData.categoria,
        preco_unico: validatedData.preco_unico ? parseFloat(validatedData.preco_unico) : null,
        preco_por_hora: validatedData.preco_por_hora ? parseFloat(validatedData.preco_por_hora) : null,
      };

      const { error } = await supabase
        .from('servicos')
        .update(serviceData)
        .eq('id', editingService.id);

      if (error) throw error;

      toast({
        title: "Serviço atualizado!",
        description: "Seu serviço foi atualizado com sucesso.",
      });

      resetForm();
      setIsEditDialogOpen(false);
      setEditingService(null);
      refetch();
    } catch (error) {
      if (error instanceof ZodError) {
        toast({
          title: "Erro de validação",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro",
          description: "Erro ao atualizar serviço. Tente novamente.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (serviceId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('servicos')
        .update({ ativo: !currentStatus })
        .eq('id', serviceId);

      if (error) throw error;

      toast({
        title: currentStatus ? "Serviço desativado" : "Serviço ativado",
        description: `Serviço ${currentStatus ? "desativado" : "ativado"} com sucesso.`,
      });

      refetch();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao alterar status do serviço.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      const { error } = await supabase
        .from('servicos')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      toast({
        title: "Serviço excluído",
        description: "Serviço excluído com sucesso.",
      });

      refetch();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir serviço.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (service: any) => {
    setEditingService(service);
    setFormData({
      titulo_servico: service.titulo_servico,
      descricao: service.descricao,
      categoria: service.categoria,
      preco_unico: service.preco_unico?.toString() || "",
      preco_por_hora: service.preco_por_hora?.toString() || "",
    });
    setIsEditDialogOpen(true);
  };

  const formatPrice = (service: any) => {
    if (service.preco_unico) {
      return `R$ ${service.preco_unico}`;
    }
    if (service.preco_por_hora) {
      return `R$ ${service.preco_por_hora}/hora`;
    }
    return "Preço sob consulta";
  };


  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-20">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/provider-dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Meus Serviços</h1>
              <p className="text-muted-foreground">
                Gerencie os serviços que você oferece
              </p>
            </div>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Novo Serviço
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Serviço</DialogTitle>
                <DialogDescription>
                  Preencha os dados do serviço que você deseja oferecer
                </DialogDescription>
              </DialogHeader>
              <ServiceForm onSubmit={handleAddService} submitLabel="Cadastrar Serviço" formData={formData} onFieldChange={handleInputChange} loading={loading} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Carregando serviços...</p>
          </div>
        ) : services.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Você ainda não cadastrou nenhum serviço.</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                Cadastrar Primeiro Serviço
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className={service.ativo ? "" : "opacity-60"}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{service.titulo_servico}</CardTitle>
                      <Badge variant="outline" className="mb-2">
                        {service.categoria}
                      </Badge>
                    </div>
                    <Badge variant={service.ativo ? "default" : "secondary"}>
                      {service.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {service.descricao}
                  </p>
                  <div className="mb-4">
                    <span className="font-semibold text-primary text-lg">
                      {formatPrice(service)}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(service)}
                      className="flex-1"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(service.id, service.ativo)}
                      className="flex-1"
                    >
                      {service.ativo ? (
                        <>
                          <EyeOff className="h-3 w-3 mr-1" />
                          Desativar
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3 mr-1" />
                          Ativar
                        </>
                      )}
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteService(service.id)}>
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Serviço</DialogTitle>
              <DialogDescription>
                Atualize as informações do seu serviço
              </DialogDescription>
            </DialogHeader>
            <ServiceForm onSubmit={handleEditService} submitLabel="Salvar Alterações" formData={formData} onFieldChange={handleInputChange} loading={loading} />
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
};

const MyServicesPage = () => {
  return (
    <ProtectedRoute requiredUserType="provider">
      <MyServicesContent />
    </ProtectedRoute>
  );
};

export default MyServicesPage;
