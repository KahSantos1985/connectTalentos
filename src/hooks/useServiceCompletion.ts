import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

interface CompletionParams {
  requestId: string;
  providerId: string;
}

export const useServiceCompletion = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, providerId }: CompletionParams) => {
      // Solicitar permissões e tirar foto
      const permissions = await Camera.checkPermissions();
      
      if (permissions.camera !== 'granted' || permissions.photos !== 'granted') {
        const request = await Camera.requestPermissions({
          permissions: ['camera', 'photos']
        });
        if (request.camera !== 'granted' || request.photos !== 'granted') {
          throw new Error('Permissão de câmera negada');
        }
      }

      // Capturar foto
      const photo = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        promptLabelHeader: 'Prova de Serviço',
        promptLabelPhoto: 'Tirar Foto',
        promptLabelPicture: 'Escolher da Galeria',
      });

      if (!photo.base64String) {
        throw new Error('Erro ao capturar foto');
      }

      // Validar formato da imagem
      const allowedFormats = ['jpeg', 'jpg', 'png', 'webp'];
      const format = photo.format?.toLowerCase();
      if (!format || !allowedFormats.includes(format)) {
        throw new Error('Formato de imagem não permitido. Use JPEG, PNG ou WEBP.');
      }

      // Converter base64 para blob
      const base64Response = await fetch(`data:image/${format};base64,${photo.base64String}`);
      const blob = await base64Response.blob();

      // Validar tamanho do arquivo (máximo 5MB)
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (blob.size > MAX_FILE_SIZE) {
        throw new Error('Imagem muito grande. Tamanho máximo: 5MB');
      }

      // Fazer upload para Supabase Storage com nome UUID
      const uuid = crypto.randomUUID();
      const fileName = `${providerId}/${uuid}.${format}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('proofs-of-service')
        .upload(fileName, blob, {
          contentType: `image/${format}`,
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Obter URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from('proofs-of-service')
        .getPublicUrl(fileName);

      const proofUrl = urlData.publicUrl;

      // Atualizar solicitação para status 'concluido'
      const { error: updateError } = await supabase
        .from('solicitacoes_servico')
        .update({
          status: 'concluido',
          proof_of_service_url: proofUrl,
        })
        .eq('id', requestId);

      if (updateError) {
        throw updateError;
      }

      return { proofUrl };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests'] });
      toast({
        title: "Serviço concluído!",
        description: "Prova de serviço anexada com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao concluir serviço",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
