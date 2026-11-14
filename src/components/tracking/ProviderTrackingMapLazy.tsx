import React, { Suspense, lazy } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MapPin } from "lucide-react";

const ProviderTrackingMap = lazy(() =>
  import("./ProviderTrackingMap").then((m) => ({ default: m.ProviderTrackingMap }))
);

interface Props {
  solicitacaoId: string;
  clientLat?: number;
  clientLng?: number;
  providerName?: string;
}

interface State {
  hasError: boolean;
}

class MapErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("[ProviderTrackingMap] erro ao renderizar mapa:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card>
          <CardContent className="py-6 flex items-center gap-3 text-muted-foreground">
            <MapPin className="h-5 w-5" />
            <div className="text-sm">
              Não foi possível carregar o mapa de acompanhamento agora.
              <br />
              Recarregue a página para tentar novamente.
            </div>
          </CardContent>
        </Card>
      );
    }
    return this.props.children;
  }
}

export const ProviderTrackingMapLazy = (props: Props) => (
  <MapErrorBoundary>
    <Suspense
      fallback={
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Carregando mapa...</span>
          </CardContent>
        </Card>
      }
    >
      <ProviderTrackingMap {...props} />
    </Suspense>
  </MapErrorBoundary>
);
