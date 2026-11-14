import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Search, TrendingUp, Users, DollarSign, Briefcase, 
  GraduationCap, Clock, Building2, Info
} from "lucide-react";
import { useSebraeData } from "@/hooks/useSebraeData";
import { Progress } from "@/components/ui/progress";

const SECTOR_MAP = {
  'agronegócio': 'agribusiness',
  'agronegocio': 'agribusiness',
  'agronegocios': 'agribusiness',
  'agro': 'agribusiness',
  'agricultura': 'agribusiness',
  'pecuária': 'agribusiness',
  'pecuaria': 'agribusiness',
  'comércio': 'commerce',
  'comercio': 'commerce',
  'varejo': 'commerce',
  'loja': 'commerce',
  'venda': 'commerce',
  'construção': 'construction',
  'construcao': 'construction',
  'obra': 'construction',
  'engenharia': 'construction',
  'reforma': 'construction',
  'indústria': 'industry',
  'industria': 'industry',
  'fábrica': 'industry',
  'fabrica': 'industry',
  'manufatura': 'industry',
  'produção': 'industry',
  'producao': 'industry',
  'serviços': 'services',
  'servicos': 'services',
  'serviço': 'services',
  'servico': 'services',
  'consultoria': 'services',
  'manutenção': 'services',
  'manutencao': 'services',
  'reparação': 'services',
  'reparacao': 'services',
} as const;

const SECTOR_LABELS = {
  agribusiness: 'Agronegócio',
  commerce: 'Comércio',
  construction: 'Construção',
  industry: 'Indústria',
  services: 'Serviços',
};

const SebraeMarketAnalysis = () => {
  const { data, isLoading, error } = useSebraeData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  const handleSearch = () => {
    const normalizedSearch = searchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    for (const [key, value] of Object.entries(SECTOR_MAP)) {
      if (normalizedSearch.includes(key)) {
        setSelectedSector(value);
        return;
      }
    }
    
    setSelectedSector(null);
  };

  const latestData = data.length > 0 ? data[0] : null;
  const previousYearData = data.length > 1 ? data[1] : null;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Análise de Mercado SEBRAE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Carregando dados...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !latestData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Análise de Mercado SEBRAE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Dados de mercado não disponíveis no momento.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const calculateGrowth = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getSectorData = (sectorKey: string) => {
    const sector = latestData.sectors[sectorKey as keyof typeof latestData.sectors];
    const previousSector = previousYearData?.sectors[sectorKey as keyof typeof previousYearData.sectors];
    
    // Calculate number of entrepreneurs in this sector
    const entrepreneursInSector = Math.round((latestData.totalEntrepreneurs * sector) / 100);
    const growth = previousSector ? calculateGrowth(sector, previousSector) : 0;
    
    return { percentage: sector, entrepreneurs: entrepreneursInSector, growth };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Análise de Mercado SEBRAE {latestData.year}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Dados oficiais sobre empreendedores no Brasil
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Section */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Busque por setor ou palavra-chave (ex: comércio, loja, construção, obra, serviços...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>Buscar</Button>
          </div>

          {/* Quick Sector Buttons */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(SECTOR_LABELS).map(([key, label]) => (
              <Button
                key={key}
                variant={selectedSector === key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSector(key)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Sector Analysis */}
        {selectedSector && (
          <div className="space-y-6 p-6 bg-muted/30 rounded-lg border">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {SECTOR_LABELS[selectedSector as keyof typeof SECTOR_LABELS]}
              </h3>
              <Badge variant="default" className="text-lg px-4 py-1">
                {getSectorData(selectedSector).percentage.toFixed(2)}% do mercado
              </Badge>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Empreendedores no Setor</p>
                      <p className="text-2xl font-bold">
                        {getSectorData(selectedSector).entrepreneurs.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Crescimento Anual</p>
                      <p className="text-2xl font-bold text-success">
                        {getSectorData(selectedSector).growth > 0 ? '+' : ''}
                        {getSectorData(selectedSector).growth.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Brasil</p>
                      <p className="text-2xl font-bold">
                        {(latestData.totalEntrepreneurs / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Statistics */}
            <div className="space-y-6">
              {/* Income Distribution */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold">Distribuição de Renda</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Até 2 Salários Mínimos</span>
                    <span className="text-sm font-semibold">{latestData.income['0-2SM'].toFixed(1)}%</span>
                  </div>
                  <Progress value={latestData.income['0-2SM']} />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">De 2 até 5 Salários Mínimos</span>
                    <span className="text-sm font-semibold">{latestData.income['2-5SM'].toFixed(1)}%</span>
                  </div>
                  <Progress value={latestData.income['2-5SM']} />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Acima de 5 Salários Mínimos</span>
                    <span className="text-sm font-semibold">{latestData.income['5+SM'].toFixed(1)}%</span>
                  </div>
                  <Progress value={latestData.income['5+SM']} />
                </div>
              </div>

              {/* Education Level */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold">Nível de Instrução</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center p-3 bg-background rounded-lg border">
                    <p className="text-2xl font-bold text-primary">{latestData.education.incomplete.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">Fundamental Incompleto</p>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg border">
                    <p className="text-2xl font-bold text-primary">{latestData.education.complete.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">Fundamental Completo</p>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg border">
                    <p className="text-2xl font-bold text-primary">{latestData.education.highSchool.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">Médio Completo</p>
                  </div>
                  <div className="text-center p-3 bg-background rounded-lg border">
                    <p className="text-2xl font-bold text-primary">{latestData.education.college.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">Superior Completo</p>
                  </div>
                </div>
              </div>

              {/* Work Hours */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold">Carga Horária Semanal</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  <div className="text-center p-2 bg-background rounded border">
                    <p className="text-lg font-bold">{latestData.workload['0-14h'].toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">0-14h</p>
                  </div>
                  <div className="text-center p-2 bg-background rounded border">
                    <p className="text-lg font-bold">{latestData.workload['15-39h'].toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">15-39h</p>
                  </div>
                  <div className="text-center p-2 bg-background rounded border">
                    <p className="text-lg font-bold">{latestData.workload['40-44h'].toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">40-44h</p>
                  </div>
                  <div className="text-center p-2 bg-background rounded border">
                    <p className="text-lg font-bold">{latestData.workload['45-48h'].toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">45-48h</p>
                  </div>
                  <div className="text-center p-2 bg-background rounded border">
                    <p className="text-lg font-bold">{latestData.workload['49h+'].toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">49h+</p>
                  </div>
                </div>
              </div>

              {/* Type of Work */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold">Tipo de Ocupação</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-background rounded-lg border">
                    <p className="text-3xl font-bold text-primary">{latestData.occupation.selfEmployed.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">Conta Própria</p>
                  </div>
                  <div className="p-4 bg-background rounded-lg border">
                    <p className="text-3xl font-bold text-primary">{latestData.occupation.employer.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">Empregador</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Insight:</strong> Com {getSectorData(selectedSector).entrepreneurs.toLocaleString('pt-BR')} empreendedores no setor de {SECTOR_LABELS[selectedSector as keyof typeof SECTOR_LABELS].toLowerCase()}, 
                você está competindo em um mercado que representa {getSectorData(selectedSector).percentage.toFixed(1)}% do total de empreendedores no Brasil. 
                O setor apresentou {getSectorData(selectedSector).growth > 0 ? 'crescimento' : 'redução'} de {Math.abs(getSectorData(selectedSector).growth).toFixed(2)}% no último ano.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* All Sectors Overview */}
        {!selectedSector && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Panorama Geral dos Setores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(SECTOR_LABELS).map(([key, label]) => {
                const sectorData = getSectorData(key);
                return (
                  <Card 
                    key={key} 
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setSelectedSector(key)}
                  >
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">{label}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Participação</span>
                          <span className="font-semibold text-primary">{sectorData.percentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={sectorData.percentage} />
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Empreendedores</span>
                          <span className="font-medium">{(sectorData.entrepreneurs / 1000).toFixed(0)}k</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Crescimento</span>
                          <span className={sectorData.growth > 0 ? "text-success font-medium" : "text-destructive font-medium"}>
                            {sectorData.growth > 0 ? '+' : ''}{sectorData.growth.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SebraeMarketAnalysis;
