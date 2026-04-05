export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; email: string; role: "owner" | "va" };
        Insert: { id: string; email: string; role?: "owner" | "va" };
        Update: { id?: string; email?: string; role?: "owner" | "va" };
        Relationships: [];
      };
      clients: {
        Row: {
          id: number; created_at: string; name: string; niche: string | null;
          status: string | null; primary_contact_name: string | null;
          primary_contact_email: string | null; primary_contact_phone: string | null;
          notes: string | null; employee_count: number | null;
          backoffice_tasks: string | null; pain_point: string | null;
          timezone: string | null; service_area: string | null;
          business_hours: string | null; escalation_email: string | null;
        };
        Insert: {
          id?: number; created_at?: string; name: string; niche?: string | null;
          status?: string | null; primary_contact_name?: string | null;
          primary_contact_email?: string | null; primary_contact_phone?: string | null;
          notes?: string | null; employee_count?: number | null;
          backoffice_tasks?: string | null; pain_point?: string | null;
          timezone?: string | null; service_area?: string | null;
          business_hours?: string | null; escalation_email?: string | null;
        };
        Update: {
          id?: number; created_at?: string; name?: string; niche?: string | null;
          status?: string | null; primary_contact_name?: string | null;
          primary_contact_email?: string | null; primary_contact_phone?: string | null;
          notes?: string | null; employee_count?: number | null;
          backoffice_tasks?: string | null; pain_point?: string | null;
          timezone?: string | null; service_area?: string | null;
          business_hours?: string | null; escalation_email?: string | null;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          id: number; created_at: string; client_id: number | null; title: string;
          task_type: string | null;
          status: Database["public"]["Enums"]["task_status"] | null;
          priority: string | null; due_at: string | null;
          sop_link: string | null; client_system_link: string | null;
          notes: string | null; escalation_required: boolean | null;
          assigned_va: string | null; ai_draft: string | null;
          workflow_type: string | null; source_system: string | null;
          source_record_id: string | null; edited_draft: string | null;
          final_message: string | null; recipient_email: string | null;
          recipient_name: string | null; subject_line: string | null;
          approved_at: string | null; sent_at: string | null;
          failed_at: string | null; rejection_reason: string | null;
          exception_reason_code: string | null; exception_description: string | null;
          updated_at: string | null; service_key: string | null;
        };
        Insert: {
          id?: number; created_at?: string; client_id?: number | null; title: string;
          task_type?: string | null;
          status?: Database["public"]["Enums"]["task_status"] | null;
          priority?: string | null; due_at?: string | null;
          sop_link?: string | null; client_system_link?: string | null;
          notes?: string | null; escalation_required?: boolean | null;
          assigned_va?: string | null; ai_draft?: string | null;
          workflow_type?: string | null; source_system?: string | null;
          source_record_id?: string | null; edited_draft?: string | null;
          final_message?: string | null; recipient_email?: string | null;
          recipient_name?: string | null; subject_line?: string | null;
          approved_at?: string | null; sent_at?: string | null;
          failed_at?: string | null; rejection_reason?: string | null;
          exception_reason_code?: string | null; exception_description?: string | null;
          updated_at?: string | null; service_key?: string | null;
        };
        Update: {
          id?: number; created_at?: string; client_id?: number | null; title?: string;
          task_type?: string | null;
          status?: Database["public"]["Enums"]["task_status"] | null;
          priority?: string | null; due_at?: string | null;
          sop_link?: string | null; client_system_link?: string | null;
          notes?: string | null; escalation_required?: boolean | null;
          assigned_va?: string | null; ai_draft?: string | null;
          workflow_type?: string | null; source_system?: string | null;
          source_record_id?: string | null; edited_draft?: string | null;
          final_message?: string | null; recipient_email?: string | null;
          recipient_name?: string | null; subject_line?: string | null;
          approved_at?: string | null; sent_at?: string | null;
          failed_at?: string | null; rejection_reason?: string | null;
          exception_reason_code?: string | null; exception_description?: string | null;
          updated_at?: string | null; service_key?: string | null;
        };
        Relationships: [{ foreignKeyName: "tasks_client_id_fkey"; columns: ["client_id"]; isOneToOne: false; referencedRelation: "clients"; referencedColumns: ["id"] }];
      };
      exceptions: {
        Row: {
          id: number; created_at: string; client_id: number | null; task_id: number | null;
          issue_type: string | null; severity: string | null;
          description: string | null; resolution_status: string | null;
          resolved_by: string | null; resolved_at: string | null;
        };
        Insert: {
          id?: number; created_at?: string; client_id?: number | null; task_id?: number | null;
          issue_type?: string | null; severity?: string | null;
          description?: string | null; resolution_status?: string | null;
          resolved_by?: string | null; resolved_at?: string | null;
        };
        Update: {
          id?: number; created_at?: string; client_id?: number | null; task_id?: number | null;
          issue_type?: string | null; severity?: string | null;
          description?: string | null; resolution_status?: string | null;
          resolved_by?: string | null; resolved_at?: string | null;
        };
        Relationships: [];
      };
      weekly_reports: {
        Row: { id: number; created_at: string; client_id: number | null; week_start: string | null; summary: string | null; open_issues: string | null };
        Insert: { id?: number; created_at?: string; client_id?: number | null; week_start?: string | null; summary?: string | null; open_issues?: string | null };
        Update: { id?: number; created_at?: string; client_id?: number | null; week_start?: string | null; summary?: string | null; open_issues?: string | null };
        Relationships: [];
      };
      client_configs: {
        Row: {
          id: string; client_id: number | null; workflow_type: string;
          is_enabled: boolean | null; send_window_start: string | null;
          send_window_end: string | null; send_days: string[] | null;
          tone_profile: string | null; exclusion_rules_json: Json | null;
          trigger_rules_json: Json | null; cooldown_rules_json: Json | null;
          escalation_rules_json: Json | null; created_at: string;
        };
        Insert: {
          id?: string; client_id?: number | null; workflow_type: string;
          is_enabled?: boolean | null; send_window_start?: string | null;
          send_window_end?: string | null; send_days?: string[] | null;
          tone_profile?: string | null; exclusion_rules_json?: Json | null;
          trigger_rules_json?: Json | null; cooldown_rules_json?: Json | null;
          escalation_rules_json?: Json | null; created_at?: string;
        };
        Update: {
          id?: string; client_id?: number | null; workflow_type?: string;
          is_enabled?: boolean | null; send_window_start?: string | null;
          send_window_end?: string | null; send_days?: string[] | null;
          tone_profile?: string | null; exclusion_rules_json?: Json | null;
          trigger_rules_json?: Json | null; cooldown_rules_json?: Json | null;
          escalation_rules_json?: Json | null; created_at?: string;
        };
        Relationships: [{ foreignKeyName: "client_configs_client_id_fkey"; columns: ["client_id"]; isOneToOne: false; referencedRelation: "clients"; referencedColumns: ["id"] }];
      };
      task_source_data: {
        Row: { id: string; task_id: number | null; payload_json: Json | null; normalized_fields_json: Json | null; created_at: string };
        Insert: { id?: string; task_id?: number | null; payload_json?: Json | null; normalized_fields_json?: Json | null; created_at?: string };
        Update: { id?: string; task_id?: number | null; payload_json?: Json | null; normalized_fields_json?: Json | null; created_at?: string };
        Relationships: [{ foreignKeyName: "task_source_data_task_id_fkey"; columns: ["task_id"]; isOneToOne: false; referencedRelation: "tasks"; referencedColumns: ["id"] }];
      };
      task_events: {
        Row: { id: string; task_id: number | null; event_type: string; actor_type: string | null; actor_id: string | null; notes: string | null; created_at: string };
        Insert: { id?: string; task_id?: number | null; event_type: string; actor_type?: string | null; actor_id?: string | null; notes?: string | null; created_at?: string };
        Update: { id?: string; task_id?: number | null; event_type?: string; actor_type?: string | null; actor_id?: string | null; notes?: string | null; created_at?: string };
        Relationships: [{ foreignKeyName: "task_events_task_id_fkey"; columns: ["task_id"]; isOneToOne: false; referencedRelation: "tasks"; referencedColumns: ["id"] }];
      };
      send_logs: {
        Row: {
          id: string; task_id: number | null; channel: string | null;
          sender: string | null; recipient: string | null; subject_line: string | null;
          body_snapshot: string | null; delivery_status: string | null;
          external_message_id: string | null; sent_at: string | null;
          error_text: string | null; created_at: string;
        };
        Insert: {
          id?: string; task_id?: number | null; channel?: string | null;
          sender?: string | null; recipient?: string | null; subject_line?: string | null;
          body_snapshot?: string | null; delivery_status?: string | null;
          external_message_id?: string | null; sent_at?: string | null;
          error_text?: string | null; created_at?: string;
        };
        Update: {
          id?: string; task_id?: number | null; channel?: string | null;
          sender?: string | null; recipient?: string | null; subject_line?: string | null;
          body_snapshot?: string | null; delivery_status?: string | null;
          external_message_id?: string | null; sent_at?: string | null;
          error_text?: string | null; created_at?: string;
        };
        Relationships: [{ foreignKeyName: "send_logs_task_id_fkey"; columns: ["task_id"]; isOneToOne: false; referencedRelation: "tasks"; referencedColumns: ["id"] }];
      };
      files: {
        Row: { id: number; created_at: string; client_id: number | null; file_name: string | null; file_url: string | null; file_type: string | null; notes: string | null };
        Insert: { id?: number; created_at?: string; client_id?: number | null; file_name?: string | null; file_url?: string | null; file_type?: string | null; notes?: string | null };
        Update: { id?: number; created_at?: string; client_id?: number | null; file_name?: string | null; file_url?: string | null; file_type?: string | null; notes?: string | null };
        Relationships: [];
      };
      sops: {
        Row: { id: number; created_at: string; client_id: number | null; title: string; trigger: string | null; steps: string | null; escalation_rule: string | null; active: boolean | null };
        Insert: { id?: number; created_at?: string; client_id?: number | null; title: string; trigger?: string | null; steps?: string | null; escalation_rule?: string | null; active?: boolean | null };
        Update: { id?: number; created_at?: string; client_id?: number | null; title?: string; trigger?: string | null; steps?: string | null; escalation_rule?: string | null; active?: boolean | null };
        Relationships: [];
      };
      task_logs: {
        Row: { id: number; created_at: string; task_id: number | null; log_type: string | null; message: string | null; created_by: string | null };
        Insert: { id?: number; created_at?: string; task_id?: number | null; log_type?: string | null; message?: string | null; created_by?: string | null };
        Update: { id?: number; created_at?: string; task_id?: number | null; log_type?: string | null; message?: string | null; created_by?: string | null };
        Relationships: [];
      };
      // ── New tables from 004_abscondata_rebuild ──
      client_services: {
        Row: { id: string; client_id: number; service_key: string; enabled: boolean; config_json: Json; created_at: string };
        Insert: { id?: string; client_id: number; service_key: string; enabled?: boolean; config_json?: Json; created_at?: string };
        Update: { id?: string; client_id?: number; service_key?: string; enabled?: boolean; config_json?: Json; created_at?: string };
        Relationships: [{ foreignKeyName: "client_services_client_id_fkey"; columns: ["client_id"]; isOneToOne: false; referencedRelation: "clients"; referencedColumns: ["id"] }];
      };
      client_platforms: {
        Row: { id: string; client_id: number; platform_key: string; connection_method: string | null; connection_status: string | null; credentials_ref: string | null; notes: string | null; last_sync_at: string | null; created_at: string };
        Insert: { id?: string; client_id: number; platform_key: string; connection_method?: string | null; connection_status?: string | null; credentials_ref?: string | null; notes?: string | null; last_sync_at?: string | null; created_at?: string };
        Update: { id?: string; client_id?: number; platform_key?: string; connection_method?: string | null; connection_status?: string | null; credentials_ref?: string | null; notes?: string | null; last_sync_at?: string | null; created_at?: string };
        Relationships: [{ foreignKeyName: "client_platforms_client_id_fkey"; columns: ["client_id"]; isOneToOne: false; referencedRelation: "clients"; referencedColumns: ["id"] }];
      };
      onboarding_submissions: {
        Row: { id: string; client_id: number | null; payload_json: Json; status: string; created_at: string };
        Insert: { id?: string; client_id?: number | null; payload_json: Json; status?: string; created_at?: string };
        Update: { id?: string; client_id?: number | null; payload_json?: Json; status?: string; created_at?: string };
        Relationships: [{ foreignKeyName: "onboarding_submissions_client_id_fkey"; columns: ["client_id"]; isOneToOne: false; referencedRelation: "clients"; referencedColumns: ["id"] }];
      };
      task_templates: {
        Row: { id: string; service_key: string; title: string; description: string | null; default_status: string | null; requires_review: boolean | null; sort_order: number | null; created_at: string };
        Insert: { id?: string; service_key: string; title: string; description?: string | null; default_status?: string | null; requires_review?: boolean | null; sort_order?: number | null; created_at?: string };
        Update: { id?: string; service_key?: string; title?: string; description?: string | null; default_status?: string | null; requires_review?: boolean | null; sort_order?: number | null; created_at?: string };
        Relationships: [];
      };
      imports: {
        Row: { id: string; client_id: number; import_type: string; source_name: string | null; status: string; storage_key: string | null; summary_json: Json | null; row_count: number | null; created_at: string };
        Insert: { id?: string; client_id: number; import_type: string; source_name?: string | null; status?: string; storage_key?: string | null; summary_json?: Json | null; row_count?: number | null; created_at?: string };
        Update: { id?: string; client_id?: number; import_type?: string; source_name?: string | null; status?: string; storage_key?: string | null; summary_json?: Json | null; row_count?: number | null; created_at?: string };
        Relationships: [{ foreignKeyName: "imports_client_id_fkey"; columns: ["client_id"]; isOneToOne: false; referencedRelation: "clients"; referencedColumns: ["id"] }];
      };
      outreach_leads: {
        Row: {
          id: string; email: string; first_name: string | null; last_name: string | null;
          company_name: string | null; title: string | null; industry: string | null;
          employee_count: string | null; location: string | null; revenue: string | null;
          phone: string | null; linkedin_url: string | null; source: string | null;
          apollo_id: string | null; batch_id: string | null; status: string | null;
          campaign_name: string | null; uploaded_to_instantly: boolean | null;
          uploaded_at: string | null; rejected_reason: string | null; created_at: string;
        };
        Insert: {
          id?: string; email: string; first_name?: string | null; last_name?: string | null;
          company_name?: string | null; title?: string | null; industry?: string | null;
          employee_count?: string | null; location?: string | null; revenue?: string | null;
          phone?: string | null; linkedin_url?: string | null; source?: string | null;
          apollo_id?: string | null; batch_id?: string | null; status?: string | null;
          campaign_name?: string | null; uploaded_to_instantly?: boolean | null;
          uploaded_at?: string | null; rejected_reason?: string | null; created_at?: string;
        };
        Update: {
          id?: string; email?: string; first_name?: string | null; last_name?: string | null;
          company_name?: string | null; title?: string | null; industry?: string | null;
          employee_count?: string | null; location?: string | null; revenue?: string | null;
          phone?: string | null; linkedin_url?: string | null; source?: string | null;
          apollo_id?: string | null; batch_id?: string | null; status?: string | null;
          campaign_name?: string | null; uploaded_to_instantly?: boolean | null;
          uploaded_at?: string | null; rejected_reason?: string | null; created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      task_status: "NEW" | "WAITING_ON_MISSING_DATA" | "READY_FOR_REVIEW" | "EXCEPTION" | "APPROVED" | "SENT" | "FAILED" | "CLOSED";
    };
    CompositeTypes: {};
  };
}
