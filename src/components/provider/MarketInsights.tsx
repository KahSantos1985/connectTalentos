import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, Users, DollarSign, Target, Info } from "lucide-react";
import { useMarketInsights } from "@/hooks/useMarketInsights";

const MarketInsights = () => {
  const { data: insights, isLoading, error } = useMarketInsights();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Inteligência e Oportunidades de Mercado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Carregando insights...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !insights) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Inteligência e Oportunidades de Mercado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Dados de mercado não disponíveis para sua região no momento. 
              Entre em contato com o suporte para mais informações.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Derive useful values from the new schema
  const avgPrice = insights.preco_medio ?? null;
  const competitors = insights.total_prestadores ?? 0;
  const incomeDistribution = (insights.insights_json as any)?.income_distribution as
    | { low: number; medium: number; high: number }
    | undefined;

  // Suggested price range derived from average market price (±20%)
  const priceRange = avgPrice
    ? { min: Math.round(avgPrice * 0.8), max: Math.round(avgPrice * 1.2) }
    : { min: 0, max: 0 };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Inteligência e Oportunidades de Mercado
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Insights sobre sua região e recomendações estratégicas
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Competition Insight */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Concorrência Local</p>
                <p className="text-2xl font-bold text-foreground">{competitors}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Você tem <span className="font-semibold text-foreground">{competitors}</span> concorrentes
              diretos ativos em <span className="font-medium">{insights.bairro}, {insights.cidade}</span>.
            </p>
          </div>

          {/* Average Price */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Preço Médio do Mercado</p>
                <p className="text-2xl font-bold text-foreground">
                  {avgPrice ? `R$ ${avgPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Preço médio praticado por prestadores semelhantes na região.
            </p>
          </div>

          {/* Pricing Suggestion */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sugestão de Preço</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {priceRange.min} - R$ {priceRange.max}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Faixa sugerida com base no preço médio da região (±20%).
            </p>
          </div>
        </div>

        {/* Additional Info */}
        {incomeDistribution && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="text-sm font-semibold mb-3">Distribuição de Renda na Região</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">
                  {incomeDistribution.low}%
                </div>
                <div className="text-xs text-muted-foreground">Baixa Renda</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {incomeDistribution.medium}%
                </div>
                <div className="text-xs text-muted-foreground">Renda Média</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {incomeDistribution.high}%
                </div>
                <div className="text-xs text-muted-foreground">Alta Renda</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketInsights;
