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
      programs: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id?: string;
          title: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          title?: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      program_members: {
        Row: {
          program_id: string;
          user_id: string;
          role: "owner" | "admin" | "staff" | "member";
          created_at: string;
        };
        Insert: {
          program_id: string;
          user_id: string;
          role?: "owner" | "admin" | "staff" | "member";
          created_at?: string;
        };
        Update: {
          program_id?: string;
          user_id?: string;
          role?: "owner" | "admin" | "staff" | "member";
          created_at?: string;
        };
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          program_id: string;
          created_by: string;
          title: string;
          description: string | null;
          code: string | null;
          department_or_domain: string | null;
          credits_or_weight: number | null;
          level: string | null;
          learning_outcomes: string | null;
          syllabus: string | null;
          status: string;
          domain_id: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          program_id: string;
          created_by?: string;
          title: string;
          description?: string | null;
          code?: string | null;
          department_or_domain?: string | null;
          credits_or_weight?: number | null;
          level?: string | null;
          learning_outcomes?: string | null;
          syllabus?: string | null;
          status?: string;
          domain_id?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          program_id?: string;
          created_by?: string;
          title?: string;
          description?: string | null;
          code?: string | null;
          department_or_domain?: string | null;
          credits_or_weight?: number | null;
          level?: string | null;
          learning_outcomes?: string | null;
          syllabus?: string | null;
          status?: string;
          domain_id?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [{ foreignKeyName: "courses_program_id_fkey"; columns: ["program_id"]; isOneToOne: false; referencedRelation: "programs"; referencedColumns: ["id"] }];
      };
      domains: {
        Row: {
          id: string;
          created_by: string;
          code: string | null;
          title: string;
          description: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          created_by?: string;
          code?: string | null;
          title: string;
          description?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          created_by?: string;
          code?: string | null;
          title?: string;
          description?: string | null;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      course_prerequisites: {
        Row: {
          course_id: string;
          prerequisite_course_id: string;
          created_by: string;
          created_at: string;
        };
        Insert: {
          course_id: string;
          prerequisite_course_id: string;
          created_by?: string;
          created_at?: string;
        };
        Update: {
          course_id?: string;
          prerequisite_course_id?: string;
          created_by?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      modules: {
        Row: {
          id: string;
          course_id: string;
          created_by: string;
          title: string;
          overview: string | null;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          created_by?: string;
          title: string;
          overview?: string | null;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          created_by?: string;
          title?: string;
          overview?: string | null;
          position?: number;
          created_at?: string;
        };
        Relationships: [{ foreignKeyName: "modules_course_id_fkey"; columns: ["course_id"]; isOneToOne: false; referencedRelation: "courses"; referencedColumns: ["id"] }];
      };
      assignments: {
        Row: {
          id: string;
          module_id: string;
          created_by: string;
          title: string;
          instructions: string;
          assignment_type: string;
          due_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          created_by?: string;
          title: string;
          instructions: string;
          assignment_type?: string;
          due_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          module_id?: string;
          created_by?: string;
          title?: string;
          instructions?: string;
          assignment_type?: string;
          due_at?: string | null;
          created_at?: string;
        };
        Relationships: [{ foreignKeyName: "assignments_module_id_fkey"; columns: ["module_id"]; isOneToOne: false; referencedRelation: "modules"; referencedColumns: ["id"] }];
      };
      readings: {
        Row: {
          id: string;
          module_id: string;
          created_by: string;
          title: string;
          author: string | null;
          source_type: string | null;
          primary_or_secondary: string | null;
          tradition_or_era: string | null;
          pages_or_length: string | null;
          estimated_hours: number | null;
          reference_url_or_citation: string | null;
          status: string;
          notes: string | null;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          created_by?: string;
          title: string;
          author?: string | null;
          source_type?: string | null;
          primary_or_secondary?: string | null;
          tradition_or_era?: string | null;
          pages_or_length?: string | null;
          estimated_hours?: number | null;
          reference_url_or_citation?: string | null;
          status?: string;
          notes?: string | null;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          module_id?: string;
          created_by?: string;
          title?: string;
          author?: string | null;
          source_type?: string | null;
          primary_or_secondary?: string | null;
          tradition_or_era?: string | null;
          pages_or_length?: string | null;
          estimated_hours?: number | null;
          reference_url_or_citation?: string | null;
          status?: string;
          notes?: string | null;
          position?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      submissions: {
        Row: {
          id: string;
          assignment_id: string;
          user_id: string;
          content: string;
          version: number;
          is_final: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          assignment_id: string;
          user_id: string;
          content: string;
          version?: number;
          is_final?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          assignment_id?: string;
          user_id?: string;
          content?: string;
          version?: number;
          is_final?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      critiques: {
        Row: {
          id: string;
          submission_id: string;
          submission_version: number;
          model: string | null;
          prompt_version: string | null;
          overall_verdict: string | null;
          thesis_strength: string | null;
          structural_failures: string[];
          unsupported_claims: string[];
          vague_terms: string[];
          strongest_objection: string | null;
          doctrinal_or_historical_imprecision: string[];
          rewrite_priorities: string[];
          score: number | null;
          critique_json: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          submission_id: string;
          submission_version?: number;
          model?: string | null;
          prompt_version?: string | null;
          overall_verdict?: string | null;
          thesis_strength?: string | null;
          structural_failures?: string[];
          unsupported_claims?: string[];
          vague_terms?: string[];
          strongest_objection?: string | null;
          doctrinal_or_historical_imprecision?: string[];
          rewrite_priorities?: string[];
          score?: number | null;
          critique_json: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          submission_id?: string;
          submission_version?: number;
          model?: string | null;
          prompt_version?: string | null;
          overall_verdict?: string | null;
          thesis_strength?: string | null;
          structural_failures?: string[];
          unsupported_claims?: string[];
          vague_terms?: string[];
          strongest_objection?: string | null;
          doctrinal_or_historical_imprecision?: string[];
          rewrite_priorities?: string[];
          score?: number | null;
          critique_json?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      concepts: {
        Row: {
          id: string;
          title: string;
          type: string;
          description: string | null;
          related_course_id: string | null;
          related_module_id: string | null;
          status: string;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          type?: string;
          description?: string | null;
          related_course_id?: string | null;
          related_module_id?: string | null;
          status?: string;
          created_by?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          type?: string;
          description?: string | null;
          related_course_id?: string | null;
          related_module_id?: string | null;
          status?: string;
          created_by?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      // Abscondata operations tables
      profiles: {
        Row: { id: string; email: string; role: "owner" | "va" };
        Insert: { id: string; email: string; role?: "owner" | "va" };
        Update: { id?: string; email?: string; role?: "owner" | "va" };
        Relationships: [];
      };
      clients: {
        Row: {
          id: string; created_at: string; name: string; niche: string | null;
          status: string | null; primary_contact_name: string | null;
          primary_contact_email: string | null; primary_contact_phone: string | null;
          notes: string | null; employee_count: number | null;
          backoffice_tasks: string | null; pain_point: string | null;
        };
        Insert: {
          id?: string; created_at?: string; name: string; niche?: string | null;
          status?: string | null; primary_contact_name?: string | null;
          primary_contact_email?: string | null; primary_contact_phone?: string | null;
          notes?: string | null; employee_count?: number | null;
          backoffice_tasks?: string | null; pain_point?: string | null;
        };
        Update: {
          id?: string; created_at?: string; name?: string; niche?: string | null;
          status?: string | null; primary_contact_name?: string | null;
          primary_contact_email?: string | null; primary_contact_phone?: string | null;
          notes?: string | null; employee_count?: number | null;
          backoffice_tasks?: string | null; pain_point?: string | null;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string; created_at: string; client_id: string | null; title: string;
          task_type: string | null; status: string | null; priority: string | null;
          due_at: string | null; sop_link: string | null; client_system_link: string | null;
          notes: string | null; escalation_required: boolean | null;
          assigned_va: string | null; ai_draft: string | null;
        };
        Insert: {
          id?: string; created_at?: string; client_id?: string | null; title: string;
          task_type?: string | null; status?: string | null; priority?: string | null;
          due_at?: string | null; sop_link?: string | null; client_system_link?: string | null;
          notes?: string | null; escalation_required?: boolean | null;
          assigned_va?: string | null; ai_draft?: string | null;
        };
        Update: {
          id?: string; created_at?: string; client_id?: string | null; title?: string;
          task_type?: string | null; status?: string | null; priority?: string | null;
          due_at?: string | null; sop_link?: string | null; client_system_link?: string | null;
          notes?: string | null; escalation_required?: boolean | null;
          assigned_va?: string | null; ai_draft?: string | null;
        };
        Relationships: [{ foreignKeyName: "tasks_client_id_fkey"; columns: ["client_id"]; isOneToOne: false; referencedRelation: "clients"; referencedColumns: ["id"] }];
      };
      exceptions: {
        Row: {
          id: string; created_at: string; client_id: string | null; task_id: string | null;
          issue_type: string | null; severity: string | null;
          description: string | null; resolution_status: string | null;
        };
        Insert: {
          id?: string; created_at?: string; client_id?: string | null; task_id?: string | null;
          issue_type?: string | null; severity?: string | null;
          description?: string | null; resolution_status?: string | null;
        };
        Update: {
          id?: string; created_at?: string; client_id?: string | null; task_id?: string | null;
          issue_type?: string | null; severity?: string | null;
          description?: string | null; resolution_status?: string | null;
        };
        Relationships: [];
      };
      files: {
        Row: { id: string; created_at: string; client_id: string | null; file_name: string | null; file_url: string | null; file_type: string | null; notes: string | null };
        Insert: { id?: string; created_at?: string; client_id?: string | null; file_name?: string | null; file_url?: string | null; file_type?: string | null; notes?: string | null };
        Update: { id?: string; created_at?: string; client_id?: string | null; file_name?: string | null; file_url?: string | null; file_type?: string | null; notes?: string | null };
        Relationships: [];
      };
      sops: {
        Row: { id: string; created_at: string; client_id: string | null; title: string; trigger: string | null; steps: string | null; escalation_rule: string | null; active: boolean | null };
        Insert: { id?: string; created_at?: string; client_id?: string | null; title: string; trigger?: string | null; steps?: string | null; escalation_rule?: string | null; active?: boolean | null };
        Update: { id?: string; created_at?: string; client_id?: string | null; title?: string; trigger?: string | null; steps?: string | null; escalation_rule?: string | null; active?: boolean | null };
        Relationships: [];
      };
      task_logs: {
        Row: { id: string; created_at: string; task_id: string | null; log_type: string | null; message: string | null; created_by: string | null };
        Insert: { id?: string; created_at?: string; task_id?: string | null; log_type?: string | null; message?: string | null; created_by?: string | null };
        Update: { id?: string; created_at?: string; task_id?: string | null; log_type?: string | null; message?: string | null; created_by?: string | null };
        Relationships: [];
      };
      weekly_reports: {
        Row: { id: string; created_at: string; client_id: string | null; week_start: string | null; summary: string | null; open_issues: string | null };
        Insert: { id?: string; created_at?: string; client_id?: string | null; week_start?: string | null; summary?: string | null; open_issues?: string | null };
        Update: { id?: string; created_at?: string; client_id?: string | null; week_start?: string | null; summary?: string | null; open_issues?: string | null };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}
