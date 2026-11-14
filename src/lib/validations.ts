import { z } from "zod";

// Common validation rules
const emailSchema = z.string()
  .trim()
  .email({ message: "Email inválido" })
  .max(255, { message: "Email deve ter no máximo 255 caracteres" });

const passwordSchema = z.string()
  .min(6, { message: "Senha deve ter pelo menos 6 caracteres" })
  .max(100, { message: "Senha deve ter no máximo 100 caracteres" });

const nameSchema = z.string()
  .trim()
  .min(3, { message: "Nome deve ter pelo menos 3 caracteres" })
  .max(100, { message: "Nome deve ter no máximo 100 caracteres" });

const phoneSchema = z.string()
  .trim()
  .refine(
    (val) => val === "" || /^\d{11}$/.test(val.replace(/\D/g, "")),
    { message: "Telefone inválido. Informe DDD + 9 dígitos (ex: 11986153373)" }
  )
  .optional()
  .or(z.literal(""));

const citySchema = z.string()
  .trim()
  .min(2, { message: "Cidade deve ter pelo menos 2 caracteres" })
  .max(100, { message: "Cidade deve ter no máximo 100 caracteres" });

const neighborhoodSchema = z.string()
  .trim()
  .min(2, { message: "Bairro deve ter pelo menos 2 caracteres" })
  .max(100, { message: "Bairro deve ter no máximo 100 caracteres" });

// Login validation schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Senha é obrigatória" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Registration validation schema
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  full_name: nameSchema,
  user_type: z.enum(["resident", "provider"], {
    required_error: "Tipo de usuário é obrigatório",
  }),
  contact_phone: phoneSchema,
  address_city: citySchema,
  address_neighborhood: neighborhoodSchema,
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar os Termos de Uso"
  }),
  acceptPrivacy: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar a Política de Privacidade"
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// Service registration validation schema
export const serviceSchema = z.object({
  titulo_servico: z.string()
    .trim()
    .min(5, { message: "Título deve ter pelo menos 5 caracteres" })
    .max(200, { message: "Título deve ter no máximo 200 caracteres" }),
  descricao: z.string()
    .trim()
    .min(20, { message: "Descrição deve ter pelo menos 20 caracteres" })
    .max(2000, { message: "Descrição deve ter no máximo 2000 caracteres" }),
  categoria: z.string()
    .min(1, { message: "Categoria é obrigatória" }),
  preco_unico: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, { message: "Preço inválido. Use formato: 150.00" })
    .optional()
    .or(z.literal("")),
  preco_por_hora: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, { message: "Preço inválido. Use formato: 50.00" })
    .optional()
    .or(z.literal("")),
}).refine((data) => data.preco_unico || data.preco_por_hora, {
  message: "Informe pelo menos um tipo de preço",
  path: ["preco_unico"],
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

// File upload validation
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Formato de imagem não permitido. Use JPEG, PNG ou WEBP.'
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'Imagem muito grande. Tamanho máximo: 5MB'
    };
  }

  return { valid: true };
}

// Coordinate validation
export function validateCoordinates(lat: number, lng: number): { valid: boolean; error?: string } {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return {
      valid: false,
      error: 'Coordenadas devem ser números'
    };
  }

  if (lat < -90 || lat > 90) {
    return {
      valid: false,
      error: 'Latitude deve estar entre -90 e 90'
    };
  }

  if (lng < -180 || lng > 180) {
    return {
      valid: false,
      error: 'Longitude deve estar entre -180 e 180'
    };
  }

  return { valid: true };
}
