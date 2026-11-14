import { useEffect, useRef, useState } from "react";
import { Geolocation } from "@capacitor/geolocation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseShareLocationParams {
  solicitacaoId: string | null;
  prestadorId: string | null;
  enabled: boolean;
  intervalMs?: number;
}

/**
 * Hook usado pelo PRESTADOR para compartilhar sua localização GPS
 * em tempo real durante uma solicitação ativa.
 *
 * - Pede permissão de localização
 * - Faz upsert em localizacoes_prestador a cada `intervalMs`
 * - Para automaticamente quando enabled=false (ex: checkout)
 */
export const useShareLocation = ({
  solicitacaoId,
  prestadorId,
  enabled,
  intervalMs = 10000,
}: UseShareLocationParams) => {
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!enabled || !solicitacaoId || !prestadorId) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsSharing(false);
      return;
    }

    let cancelled = false;

    const sendOnce = async () => {
      try {
        const perms = await Geolocation.checkPermissions();
        if (perms.location !== "granted") {
          const req = await Geolocation.requestPermissions();
          if (req.location !== "granted") {
            throw new Error("Permissão de localização negada");
          }
        }

        const pos = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });

        if (cancelled) return;

        const { error } = await supabase
          .from("localizacoes_prestador")
          .upsert(
            {
              solicitacao_id: solicitacaoId,
              prestador_id: prestadorId,
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: pos.coords.accuracy ?? null,
              heading: pos.coords.heading ?? null,
              speed: pos.coords.speed ?? null,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "solicitacao_id" }
          );

        if (error) throw error;
        setLastError(null);
        setIsSharing(true);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro desconhecido";
        setLastError(message);
        setIsSharing(false);
      }
    };

    // dispara imediatamente, depois em intervalos
    sendOnce().then(() => {
      if (cancelled) return;
      toast({
        title: "Localização ativa",
        description: "O cliente pode acompanhar seu trajeto em tempo real.",
      });
    });
    intervalRef.current = setInterval(sendOnce, intervalMs);

    return () => {
      cancelled = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, solicitacaoId, prestadorId, intervalMs, toast]);

  return { isSharing, lastError };
};
