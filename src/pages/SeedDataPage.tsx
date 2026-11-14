import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const SeedDataPage = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSeedData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('seed-providers', {
        body: { seedKey: 'populate-demo-data' }
      });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: `${data.providersCount} prestadores e ${data.servicesCount} serviços criados.`,
      });
    } catch (error: any) {
      console.error('Erro ao popular dados:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar dados fictícios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Popular Banco de Dados</CardTitle>
            <CardDescription>
              Crie prestadores de serviços fictícios para testar a aplicação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Esta ação irá criar 6 prestadores de serviços fictícios:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
              <li>Carlos Silva - Eletricista</li>
              <li>João Santos - Encanador</li>
              <li>Roberto Lima - Chaveiro</li>
              <li>Maria Oliveira - Trancista</li>
              <li>Ana Paula Costa - Babá</li>
              <li>Juliana Ferreira - Manicure</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Cada prestador terá 2 serviços cadastrados.
            </p>
            <Button 
              onClick={handleSeedData} 
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar Dados Fictícios
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default SeedDataPage;
