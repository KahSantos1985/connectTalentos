import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { serviceSchema } from "@/lib/validations";
import { ZodError } from "zod";

const ServiceRegistrationForm = () => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo_servico: "",
    descricao: "",
    categoria: "",
    preco_unico: "",
    preco_por_hora: "",
  });

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Validate form data with Zod
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

      if (error) {
        throw error;
      }

      toast({
        title: "Serviço cadastrado!",
        description: "Seu serviço foi cadastrado com sucesso.",
      });

      // Reset form
      setFormData({
        titulo_servico: "",
        descricao: "",
        categoria: "",
        preco_unico: "",
        preco_por_hora: "",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        // Display the first validation error
        const firstError = error.errors[0];
        toast({
          title: "Erro de validação",
          description: firstError.message,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastrar Novo Serviço</CardTitle>
        <CardDescription>
          Registre um novo serviço que você oferece na sua região
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="titulo">Título do Serviço</Label>
            <Input
              id="titulo"
              value={formData.titulo_servico}
              onChange={(e) => handleInputChange("titulo_servico", e.target.value)}
              placeholder="Ex: Limpeza residencial completa"
              required
            />
          </div>

          <div>
            <Label htmlFor="categoria">Categoria</Label>
            <Select value={formData.categoria} onValueChange={(value) => handleInputChange("categoria", value)} required>
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
              onChange={(e) => handleInputChange("descricao", e.target.value)}
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
                onChange={(e) => handleInputChange("preco_unico", e.target.value)}
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
                onChange={(e) => handleInputChange("preco_por_hora", e.target.value)}
                placeholder="50.00"
              />
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Região de atendimento: {user?.address_neighborhood}, {user?.address_city}</p>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Cadastrando..." : "Cadastrar Serviço"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ServiceRegistrationForm;