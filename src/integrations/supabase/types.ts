export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_prompts: {
        Row: {
          created_at: string
          description: string
          field_name: string
          id: string
          prompt_text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          field_name: string
          id?: string
          prompt_text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          field_name?: string
          id?: string
          prompt_text?: string
          updated_at?: string
        }
        Relationships: []
      }
      dashboard_layouts: {
        Row: {
          created_at: string
          id: string
          layout: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          layout: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          layout?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      meters: {
        Row: {
          brand: string | null
          created_at: string
          id: string
          install_date: string | null
          last_reading: string | null
          latitude: number | null
          location: string
          longitude: number | null
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          brand?: string | null
          created_at?: string
          id: string
          install_date?: string | null
          last_reading?: string | null
          latitude?: number | null
          location: string
          longitude?: number | null
          status: string
          type: string
          updated_at?: string
        }
        Update: {
          brand?: string | null
          created_at?: string
          id?: string
          install_date?: string | null
          last_reading?: string | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          is_validated: boolean | null
          organization_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_validated?: boolean | null
          organization_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_validated?: boolean | null
          organization_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          is_completed: boolean | null
          labels: string[] | null
          parent_id: string | null
          priority: string | null
          status: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean | null
          labels?: string[] | null
          parent_id?: string | null
          priority?: string | null
          status: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_completed?: boolean | null
          labels?: string[] | null
          parent_id?: string | null
          priority?: string | null
          status?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      ted_tenders: {
        Row: {
          buyer_country: string | null
          buyer_name: string | null
          cpv_codes: string[] | null
          created_at: string | null
          description: string | null
          id: number
          last_sync_attempt: string | null
          original_url: string | null
          publication_date: string
          reference_number: string | null
          sync_status: string | null
          title: string
          type: Database["public"]["Enums"]["ted_tender_type"]
          updated_at: string | null
          value_amount: number | null
          value_currency: string | null
          xml_data: Json | null
        }
        Insert: {
          buyer_country?: string | null
          buyer_name?: string | null
          cpv_codes?: string[] | null
          created_at?: string | null
          description?: string | null
          id: number
          last_sync_attempt?: string | null
          original_url?: string | null
          publication_date: string
          reference_number?: string | null
          sync_status?: string | null
          title: string
          type: Database["public"]["Enums"]["ted_tender_type"]
          updated_at?: string | null
          value_amount?: number | null
          value_currency?: string | null
          xml_data?: Json | null
        }
        Update: {
          buyer_country?: string | null
          buyer_name?: string | null
          cpv_codes?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: number
          last_sync_attempt?: string | null
          original_url?: string | null
          publication_date?: string
          reference_number?: string | null
          sync_status?: string | null
          title?: string
          type?: Database["public"]["Enums"]["ted_tender_type"]
          updated_at?: string | null
          value_amount?: number | null
          value_currency?: string | null
          xml_data?: Json | null
        }
        Relationships: []
      }
      tenders: {
        Row: {
          approval_authority: string | null
          budget: number | null
          category: string | null
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          contract_duration: string | null
          created_at: string
          deadline: string | null
          description: string | null
          eligibility_criteria: string | null
          evaluation_criteria: string[] | null
          id: string
          is_public: boolean | null
          issue_date: string | null
          objective: string | null
          organization_id: string | null
          questions_deadline: string | null
          reference_number: string | null
          required_documents: string[] | null
          scope_of_work: string | null
          site_visit_date: string | null
          site_visit_location: string | null
          site_visit_required: boolean | null
          status: string
          submission_format: string | null
          tender_opening_date: string | null
          tender_opening_type: string | null
          title: string
          updated_at: string
        }
        Insert: {
          approval_authority?: string | null
          budget?: number | null
          category?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          contract_duration?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          eligibility_criteria?: string | null
          evaluation_criteria?: string[] | null
          id?: string
          is_public?: boolean | null
          issue_date?: string | null
          objective?: string | null
          organization_id?: string | null
          questions_deadline?: string | null
          reference_number?: string | null
          required_documents?: string[] | null
          scope_of_work?: string | null
          site_visit_date?: string | null
          site_visit_location?: string | null
          site_visit_required?: boolean | null
          status?: string
          submission_format?: string | null
          tender_opening_date?: string | null
          tender_opening_type?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          approval_authority?: string | null
          budget?: number | null
          category?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          contract_duration?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          eligibility_criteria?: string | null
          evaluation_criteria?: string[] | null
          id?: string
          is_public?: boolean | null
          issue_date?: string | null
          objective?: string | null
          organization_id?: string | null
          questions_deadline?: string | null
          reference_number?: string | null
          required_documents?: string[] | null
          scope_of_work?: string | null
          site_visit_date?: string | null
          site_visit_location?: string | null
          site_visit_required?: boolean | null
          status?: string
          submission_format?: string | null
          tender_opening_date?: string | null
          tender_opening_type?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      ted_tender_type:
        | "contract_notice"
        | "contract_award"
        | "prior_information"
        | "modification"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
