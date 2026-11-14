import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Geolocation } from '@capacitor/geolocation';

interface CheckinParams {
  requestId: string;
}

export const useServiceCheckin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId }: CheckinParams) => {
      // Solicitar permissões e obter coordenadas
      const permissions = await Geolocation.checkPermissions();
      
      if (permissions.location !== 'granted') {
        const request = await Geolocation.requestPermissions();
        if (request.location !== 'granted') {
          throw new Error('Permissão de localização negada');
        }
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });

      const { latitude, longitude } = position.coords;

      // Validar coordenadas
      if (!latitude || !longitude || 
          latitude < -90 || latitude > 90 || 
          longitude < -180 || longitude > 180) {
        throw new Error('Coordenadas de localização inválidas');
      }

      // Chamar edge function de check-in
      const { data, error } = await supabase.functions.invoke('service-checkin', {
        body: {
          requestId,
          latitude,
          longitude,
        },
      });

      if (error) {
        throw error;
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Erro ao realizar check-in');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      toast({
        title: "Check-in realizado!",
        description: "Serviço iniciado com sucesso. Boa sorte!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro no check-in",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
