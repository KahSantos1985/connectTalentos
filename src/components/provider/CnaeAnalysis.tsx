import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Building2, Info, TrendingUp, BarChart3 } from "lucide-react";
import { useCnaeData } from "@/hooks/useCnaeData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CnaeAnalysis = () => {
  const { 
    isLoading, 
    error, 
    searchActivities, 
    getSectionSummary,
    totalActivities,
    totalEstablishments 
  } = useCnaeData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchActivities>>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    const results = searchActivities(searchTerm);
    setSearchResults(results);
    setHasSearched(true);
  };

  const sectionSummary = getSectionSummary();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Análise por CNAE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Carregando dados CNAE...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Análise por CNAE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Dados CNAE não disponíveis no momento.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Análise por CNAE - Estabelecimentos Registrados
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Busque por código CNAE ou tipo de atividade para ver o número de estabelecimentos
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Atividades</p>
                  <p className="text-2xl font-bold">{totalActivities.toLocaleString('pt-BR')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-success/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Estabelecimentos</p>
                  <p className="text-2xl font-bold">{totalEstablishments.toLocaleString('pt-BR')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Search and Sections */}
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Buscar Atividade</TabsTrigger>
            <TabsTrigger value="sections">Visão por Seção</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-4 mt-4">
            {/* Search Section */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Busque por CNAE (ex: 4711301) ou atividade (ex: supermercado, construção, restaurante)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch}>Buscar</Button>
            </div>

            {/* Search Results */}
            {hasSearched && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    {searchResults.length > 0 
                      ? `${searchResults.length} resultado${searchResults.length > 1 ? 's' : ''} encontrado${searchResults.length > 1 ? 's' : ''}`
                      : 'Nenhum resultado encontrado'
                    }
                  </h3>
                  {searchResults.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setHasSearched(false); }}>
                      Limpar
                    </Button>
                  )}
                </div>

                <ScrollArea className="h-[500px] rounded-md border">
                  <div className="p-4 space-y-3">
                    {searchResults.map((activity, index) => (
                      <Card key={index} className="hover:border-primary transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="font-mono">
                                  {activity.cnaeCode}
                                </Badge>
                                <Badge className="bg-primary/10 text-primary border-primary/20">
                                  {typeof activity.establishmentCount === 'string'
                                    ? activity.establishmentCount
                                    : `${activity.establishmentCount.toLocaleString('pt-BR')} estabelecimentos`
                                  }
                                </Badge>
                              </div>
                              <h4 className="font-semibold text-sm leading-tight">
                                {activity.denomination}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {activity.section}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>

                {searchResults.length > 0 && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Dica:</strong> Os dados mostram o número de estabelecimentos registrados para cada atividade CNAE. 
                      Mais estabelecimentos indicam maior concorrência, mas também maior demanda de mercado.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sections" className="space-y-4 mt-4">
            <ScrollArea className="h-[500px] rounded-md border">
              <div className="p-4 space-y-3">
                {sectionSummary.map((section, index) => (
                  <Card key={index} className="hover:border-primary transition-colors">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm">{section.section}</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Atividades</p>
                            <p className="text-xl font-bold text-primary">
                              {section.count.toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Estabelecimentos</p>
                            <p className="text-xl font-bold text-success">
                              {section.establishments.toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CnaeAnalysis;
