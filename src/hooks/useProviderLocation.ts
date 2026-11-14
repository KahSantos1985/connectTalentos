import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ProviderLocation {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  heading: number | null;
  speed: number | null;
  updated_at: string;
}

/**
 * Hook usado pelo CLIENTE para acompanhar a localização do prestador
 * em tempo real via Supabase Realtime.
 */
export const useProviderLocation = (solicitacaoId: string | null) => {
  const [location, setLocation] = useState<ProviderLocation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!solicitacaoId) {
      setLocation(null);
      setLoading(false);
      return;
    }

    let active = true;

    // 1. Carrega posição inicial
    supabase
      .from("localizacoes_prestador")
      .select("latitude, longitude, accuracy, heading, speed, updated_at")
      .eq("solicitacao_id", solicitacaoId)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        if (data) setLocation(data as ProviderLocation);
        setLoading(false);
      });

    // 2. Realtime: escuta INSERT e UPDATE
    const channel = supabase
      .channel(`location-${solicitacaoId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "localizacoes_prestador",
          filter: `solicitacao_id=eq.${solicitacaoId}`,
        },
        (payload) => {
          if (!active) return;
          const row = payload.new as ProviderLocation | undefined;
          if (row && row.latitude && row.longitude) {
            setLocation(row);
          }
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [solicitacaoId]);

  return { location, loading };
};

/**
 * Calcula a distância em metros entre duas coordenadas (Haversine).
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371000; // metros
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const formatDistance = (meters: number): string => {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
};
