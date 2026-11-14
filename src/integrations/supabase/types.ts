export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      avaliacoes: {
        Row: {
          cliente_id: string
          comentario: string | null
          created_at: string
          id: string
          nota: number
          prestador_id: string
          solicitacao_id: string | null
        }
        Insert: {
          cliente_id: string
          comentario?: string | null
          created_at?: string
          id?: string
          nota: number
          prestador_id: string
          solicitacao_id?: string | null
        }
        Update: {
          cliente_id?: string
          comentario?: string | null
          created_at?: string
          id?: string
          nota?: number
          prestador_id?: string
          solicitacao_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_solicitacao_id_fkey"
            columns: ["solicitacao_id"]
            isOneToOne: false
            referencedRelation: "solicitacoes_servico"
            referencedColumns: ["id"]
          },
        ]
      }
      localizacoes_prestador: {
        Row: {
          accuracy: number | null
          heading: number | null
          id: string
          latitude: number
          longitude: number
          prestador_id: string
          solicitacao_id: string
          speed: number | null
          updated_at: string
        }
        Insert: {
          accuracy?: number | null
          heading?: number | null
          id?: string
          latitude: number
          longitude: number
          prestador_id: string
          solicitacao_id: string
          speed?: number | null
          updated_at?: string
        }
        Update: {
          accuracy?: number | null
          heading?: number | null
          id?: string
          latitude?: number
          longitude?: number
          prestador_id?: string
          solicitacao_id?: string
          speed?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      market_insights: {
        Row: {
          bairro: string
          categoria: string | null
          cidade: string
          demanda_estimada: number | null
          id: string
          insights_json: Json | null
          preco_medio: number | null
          total_prestadores: number
          updated_at: string
        }
        Insert: {
          bairro: string
          categoria?: string | null
          cidade: string
          demanda_estimada?: number | null
          id?: string
          insights_json?: Json | null
          preco_medio?: number | null
          total_prestadores?: number
          updated_at?: string
        }
        Update: {
          bairro?: string
          categoria?: string | null
          cidade?: string
          demanda_estimada?: number | null
          id?: string
          insights_json?: Json | null
          preco_medio?: number | null
          total_prestadores?: number
          updated_at?: string
        }
        Relationships: []
      }
      servicos: {
        Row: {
          ativo: boolean
          categoria: string
          created_at: string
          descricao: string
          id: string
          preco_por_hora: number | null
          preco_unico: number | null
          prestador_id: string
          titulo_servico: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          categoria: string
          created_at?: string
          descricao?: string
          id?: string
          preco_por_hora?: number | null
          preco_unico?: number | null
          prestador_id: string
          titulo_servico: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          categoria?: string
          created_at?: string
          descricao?: string
          id?: string
          preco_por_hora?: number | null
          preco_unico?: number | null
          prestador_id?: string
          titulo_servico?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "servicos_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitacoes_servico: {
        Row: {
          checkin_at: string | null
          checkout_at: string | null
          cliente_id: string
          criado_at: string
          data_proposta_prestador: string | null
          datas_solicitadas: string | null
          id: string
          mensagem_prestador: string | null
          metodo_pagamento: string
          prestador_id: string
          proof_of_service_url: string | null
          servico_id: string
          status: string
          status_pagamento: string
          updated_at: string
          valor_acordado: number | null
        }
        Insert: {
          checkin_at?: string | null
          checkout_at?: string | null
          cliente_id: string
          criado_at?: string
          data_proposta_prestador?: string | null
          datas_solicitadas?: string | null
          id?: string
          mensagem_prestador?: string | null
          metodo_pagamento?: string
          prestador_id: string
          proof_of_service_url?: string | null
          servico_id: string
          status?: string
          status_pagamento?: string
          updated_at?: string
          valor_acordado?: number | null
        }
        Update: {
          checkin_at?: string | null
          checkout_at?: string | null
          cliente_id?: string
          criado_at?: string
          data_proposta_prestador?: string | null
          datas_solicitadas?: string | null
          id?: string
          mensagem_prestador?: string | null
          metodo_pagamento?: string
          prestador_id?: string
          proof_of_service_url?: string | null
          servico_id?: string
          status?: string
          status_pagamento?: string
          updated_at?: string
          valor_acordado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "solicitacoes_servico_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_servico_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_servico_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          contato_telefone: string | null
          created_at: string
          email: string
          endereco_bairro: string
          endereco_cidade: string
          foto_perfil_url: string | null
          id: string
          nome_completo: string
          tipo_usuario: string
          updated_at: string
        }
        Insert: {
          contato_telefone?: string | null
          created_at?: string
          email: string
          endereco_bairro?: string
          endereco_cidade?: string
          foto_perfil_url?: string | null
          id: string
          nome_completo?: string
          tipo_usuario: string
          updated_at?: string
        }
        Update: {
          contato_telefone?: string | null
          created_at?: string
          email?: string
          endereco_bairro?: string
          endereco_cidade?: string
          foto_perfil_url?: string | null
          id?: string
          nome_completo?: string
          tipo_usuario?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
