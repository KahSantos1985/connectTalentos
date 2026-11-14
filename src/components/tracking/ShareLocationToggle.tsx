import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Navigation, AlertCircle } from "lucide-react";
import { useShareLocation } from "@/hooks/useShareLocation";

interface ShareLocationToggleProps {
  solicitacaoId: string;
  prestadorId: string;
}

/**
 * Componente para o PRESTADOR ativar/desativar o compartilhamento de localização.
 * Mostre apenas quando a solicitação estiver ativa (aprovada/em andamento).
 */
export const ShareLocationToggle = ({
  solicitacaoId,
  prestadorId,
}: ShareLocationToggleProps) => {
  const [enabled, setEnabled] = useState(false);
  const { isSharing, lastError } = useShareLocation({
    solicitacaoId,
    prestadorId,
    enabled,
  });

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Navigation className="h-5 w-5 text-primary" />
            </div>
            <div>
              <Label htmlFor="share-location" className="font-semibold">
                Compartilhar localização
              </Label>
              <p className="text-sm text-muted-foreground mt-0.5">
                O cliente verá seu trajeto em tempo real até concluir o serviço.
              </p>
              {enabled && isSharing && (
                <Badge variant="secondary" className="mt-2 gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Transmitindo
                </Badge>
              )}
              {lastError && (
                <div className="mt-2 flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {lastError}
                </div>
              )}
            </div>
          </div>
          <Switch
            id="share-location"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </div>
      </CardContent>
    </Card>
  );
};
