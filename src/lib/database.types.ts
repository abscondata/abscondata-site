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
        Row: {
          id: string;
          email: string;
          role: "owner" | "va";
        };
        Insert: {
          id: string;
          email: string;
          role?: "owner" | "va";
        };
        Update: {
          id?: string;
          email?: string;
          role?: "owner" | "va";
        };
        Relationships: [];
      };
      clients: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          niche: string | null;
          status: string | null;
          primary_contact_name: string | null;
          primary_contact_email: string | null;
          primary_contact_phone: string | null;
          notes: string | null;
          employee_count: number | null;
          backoffice_tasks: string | null;
          pain_point: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          niche?: string | null;
          status?: string | null;
          primary_contact_name?: string | null;
          primary_contact_email?: string | null;
          primary_contact_phone?: string | null;
          notes?: string | null;
          employee_count?: number | null;
          backoffice_tasks?: string | null;
          pain_point?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          niche?: string | null;
          status?: string | null;
          primary_contact_name?: string | null;
          primary_contact_email?: string | null;
          primary_contact_phone?: string | null;
          notes?: string | null;
          employee_count?: number | null;
          backoffice_tasks?: string | null;
          pain_point?: string | null;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          created_at: string;
          client_id: string | null;
          title: string;
          task_type: string | null;
          status: string | null;
          priority: string | null;
          due_at: string | null;
          sop_link: string | null;
          client_system_link: string | null;
          notes: string | null;
          escalation_required: boolean | null;
          assigned_va: string | null;
          ai_draft: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          client_id?: string | null;
          title: string;
          task_type?: string | null;
          status?: string | null;
          priority?: string | null;
          due_at?: string | null;
          sop_link?: string | null;
          client_system_link?: string | null;
          notes?: string | null;
          escalation_required?: boolean | null;
          assigned_va?: string | null;
          ai_draft?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          client_id?: string | null;
          title?: string;
          task_type?: string | null;
          status?: string | null;
          priority?: string | null;
          due_at?: string | null;
          sop_link?: string | null;
          client_system_link?: string | null;
          notes?: string | null;
          escalation_required?: boolean | null;
          assigned_va?: string | null;
          ai_draft?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      exceptions: {
        Row: {
          id: string;
          created_at: string;
          client_id: string | null;
          task_id: string | null;
          issue_type: string | null;
          severity: string | null;
          description: string | null;
          resolution_status: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          client_id?: string | null;
          task_id?: string | null;
          issue_type?: string | null;
          severity?: string | null;
          description?: string | null;
          resolution_status?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          client_id?: string | null;
          task_id?: string | null;
          issue_type?: string | null;
          severity?: string | null;
          description?: string | null;
          resolution_status?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "exceptions_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "exceptions_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "tasks";
            referencedColumns: ["id"];
          },
        ];
      };
      files: {
        Row: {
          id: string;
          created_at: string;
          client_id: string | null;
          file_name: string | null;
          file_url: string | null;
          file_type: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          client_id?: string | null;
          file_name?: string | null;
          file_url?: string | null;
          file_type?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          client_id?: string | null;
          file_name?: string | null;
          file_url?: string | null;
          file_type?: string | null;
          notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "files_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      sops: {
        Row: {
          id: string;
          created_at: string;
          client_id: string | null;
          title: string;
          trigger: string | null;
          steps: string | null;
          escalation_rule: string | null;
          active: boolean | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          client_id?: string | null;
          title: string;
          trigger?: string | null;
          steps?: string | null;
          escalation_rule?: string | null;
          active?: boolean | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          client_id?: string | null;
          title?: string;
          trigger?: string | null;
          steps?: string | null;
          escalation_rule?: string | null;
          active?: boolean | null;
        };
        Relationships: [
          {
            foreignKeyName: "sops_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
      task_logs: {
        Row: {
          id: string;
          created_at: string;
          task_id: string | null;
          log_type: string | null;
          message: string | null;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          task_id?: string | null;
          log_type?: string | null;
          message?: string | null;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          task_id?: string | null;
          log_type?: string | null;
          message?: string | null;
          created_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "task_logs_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "tasks";
            referencedColumns: ["id"];
          },
        ];
      };
      weekly_reports: {
        Row: {
          id: string;
          created_at: string;
          client_id: string | null;
          week_start: string | null;
          summary: string | null;
          open_issues: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          client_id?: string | null;
          week_start?: string | null;
          summary?: string | null;
          open_issues?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          client_id?: string | null;
          week_start?: string | null;
          summary?: string | null;
          open_issues?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "weekly_reports_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}
