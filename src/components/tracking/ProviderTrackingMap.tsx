import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Navigation } from "lucide-react";
import {
  useProviderLocation,
  calculateDistance,
  formatDistance,
} from "@/hooks/useProviderLocation";

// Fix dos ícones padrão do Leaflet (caminho quebra com bundlers)
const providerIcon = L.divIcon({
  className: "custom-provider-marker",
  html: `<div style="
    background: hsl(var(--primary));
    width: 32px; height: 32px; border-radius: 50%;
    border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    display:flex; align-items:center; justify-content:center;
    color: white; font-weight: bold; font-size: 14px;">P</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const clientIcon = L.divIcon({
  className: "custom-client-marker",
  html: `<div style="
    background: hsl(var(--accent, 220 90% 50%));
    width: 28px; height: 28px; border-radius: 50%;
    border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    display:flex; align-items:center; justify-content:center;
    color: white; font-weight: bold; font-size: 12px;">C</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

interface ProviderTrackingMapProps {
  solicitacaoId: string;
  clientLat?: number;
  clientLng?: number;
  providerName?: string;
}

const RecenterOnUpdate = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [lat, lng, map]);
  return null;
};

export const ProviderTrackingMap = ({
  solicitacaoId,
  clientLat,
  clientLng,
  providerName = "Prestador",
}: ProviderTrackingMapProps) => {
  const { location, loading } = useProviderLocation(solicitacaoId);

  const distanceMeters = useMemo(() => {
    if (!location || clientLat == null || clientLng == null) return null;
    return calculateDistance(location.latitude, location.longitude, clientLat, clientLng);
  }, [location, clientLat, clientLng]);

  // Fallback: centro de Salvador se nada disponível
  const center: [number, number] = location
    ? [location.latitude, location.longitude]
    : clientLat != null && clientLng != null
    ? [clientLat, clientLng]
    : [-12.9714, -38.5014];

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Carregando rastreamento...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Navigation className="h-4 w-4 text-primary" />
          Acompanhamento ao vivo
        </CardTitle>
        {location ? (
          <Badge variant="secondary" className="gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Online
          </Badge>
        ) : (
          <Badge variant="outline">Aguardando prestador</Badge>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div className="h-[360px] w-full">
          <MapContainer
            center={center}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{y}/{x}.png"
            />
            {location && (
              <>
                <Marker
                  position={[location.latitude, location.longitude]}
                  icon={providerIcon}
                >
                  <Popup>
                    <strong>{providerName}</strong>
                    <br />
                    Atualizado:{" "}
                    {new Date(location.updated_at).toLocaleTimeString("pt-BR")}
                  </Popup>
                </Marker>
                <RecenterOnUpdate lat={location.latitude} lng={location.longitude} />
              </>
            )}
            {clientLat != null && clientLng != null && (
              <Marker position={[clientLat, clientLng]} icon={clientIcon}>
                <Popup>Seu endereço</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4 border-t">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Distância</p>
              <p className="font-semibold">
                {distanceMeters != null
                  ? formatDistance(distanceMeters)
                  : "—"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Navigation className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Última atualização</p>
              <p className="font-semibold text-sm">
                {location
                  ? new Date(location.updated_at).toLocaleTimeString("pt-BR")
                  : "—"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
