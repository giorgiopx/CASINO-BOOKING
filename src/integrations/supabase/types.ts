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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      enquiries: {
        Row: {
          created_at: string
          casino_name: string | null
          company_name: string | null
          services: string[]
          trip_preferences: Json
          customer_type: string
          destination: string
          email: string
          end_date: string
          id: string
          message: string
          name: string
          party: number
          phone: string
          preference: string
          ref: string
          request_type: string
          residence: string
          start_date: string
          status: string
          surname: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          casino_name?: string | null
          company_name?: string | null
          services?: string[]
          trip_preferences?: Json
          customer_type: string
          destination: string
          email: string
          end_date: string
          id?: string
          message?: string
          name: string
          party: number
          phone: string
          preference: string
          ref: string
          request_type: string
          residence: string
          start_date: string
          status?: string
          surname: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          casino_name?: string | null
          company_name?: string | null
          services?: string[]
          trip_preferences?: Json
          customer_type?: string
          destination?: string
          email?: string
          end_date?: string
          id?: string
          message?: string
          name?: string
          party?: number
          phone?: string
          preference?: string
          ref?: string
          request_type?: string
          residence?: string
          start_date?: string
          status?: string
          surname?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      crm_notes: {
        Row: { id: string; enquiry_id: string; author_id: string; body: string; created_at: string }
        Insert: { id?: string; enquiry_id: string; author_id: string; body: string; created_at?: string }
        Update: { id?: string; enquiry_id?: string; author_id?: string; body?: string; created_at?: string }
        Relationships: []
      }
      crm_tasks: {
        Row: { id: string; enquiry_id: string; title: string; assigned_to: string | null; due_date: string | null; status: string; created_by: string; created_at: string }
        Insert: { id?: string; enquiry_id: string; title: string; assigned_to?: string | null; due_date?: string | null; status?: string; created_by?: string; created_at?: string }
        Update: { id?: string; enquiry_id?: string; title?: string; assigned_to?: string | null; due_date?: string | null; status?: string; created_by?: string; created_at?: string }
        Relationships: []
      }
      itinerary_segments: {
        Row: { id: string; enquiry_id: string; service_kind: string; summary: string; details: Json; status: string; created_at: string; updated_at: string }
        Insert: { id?: string; enquiry_id: string; service_kind: string; summary: string; details?: Json; status?: string; created_at?: string; updated_at?: string }
        Update: { id?: string; enquiry_id?: string; service_kind?: string; summary?: string; details?: Json; status?: string; created_at?: string; updated_at?: string }
        Relationships: []
      }
      enquiry_status_events: {
        Row: { id: string; enquiry_id: string; customer_id: string; actor_id: string | null; old_status: string | null; new_status: string; changed_at: string }
        Insert: { id?: string; enquiry_id: string; customer_id: string; actor_id?: string | null; old_status?: string | null; new_status: string; changed_at?: string }
        Update: { id?: string; enquiry_id?: string; customer_id?: string; actor_id?: string | null; old_status?: string | null; new_status?: string; changed_at?: string }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          customer_ref: string
          full_name: string | null
          phone: string | null
          residence: string | null
          customer_type: string | null
          company_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          customer_ref?: string
          full_name?: string | null
          phone?: string | null
          residence?: string | null
          customer_type?: string | null
          company_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          customer_ref?: string
          full_name?: string | null
          phone?: string | null
          residence?: string | null
          customer_type?: string | null
          company_name?: string | null
          id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const