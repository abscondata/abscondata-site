"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import Anthropic from "@anthropic-ai/sdk";

const SERVICE_PROMPTS: Record<string, (recipient: string, clientBiz: string, sourceFields: Record<string, string | null>) => string> = {
  invoice_ops: (r, c, s) =>
    `Draft an invoice delivery email to ${r} from ${c}. Invoice details: ${s.invoice_number ? `Invoice #${s.invoice_number}` : ""}${s.amount ? `, Amount: $${s.amount}` : ""}${s.due_date ? `, Due: ${s.due_date}` : ""}${s.notes ? `. Notes: ${s.notes}` : ""}.`,
  payment_followup: (r, c, s) =>
    `Draft a payment follow-up email to ${r} from ${c}. ${s.amount ? `Amount: $${s.amount}.` : ""}${s.days_overdue ? ` ${s.days_overdue} days overdue.` : ""}${s.notes ? ` Notes: ${s.notes}` : ""}`,
  review_requests: (r, c, s) =>
    `Draft a review request email to ${r} from ${c}. Ask them to leave a review on ${s.notes || "Google"}.`,
  lead_intake: (r, c, s) =>
    `Draft a lead response email to ${r} from ${c}. They inquired about: ${s.notes || "your services"}.`,
};

export async function generateAiDraft(
  taskId: number
): Promise<{ success: boolean; message: string; draft?: string }> {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return { success: false, message: "ANTHROPIC_API_KEY not configured" };

    const supabase = await createClient();

    // Fetch task
    const { data: task } = await supabase
      .from("tasks")
      .select("*, clients(id, name)")
      .eq("id", taskId)
      .single();

    if (!task) return { success: false, message: "Task not found" };
    if (task.service_key === "weekly_summary") return { success: false, message: "Weekly summaries use the template, not AI drafts" };

    // Fetch source data
    const { data: sourceData } = await supabase
      .from("task_source_data")
      .select("normalized_fields_json")
      .eq("task_id", taskId)
      .single();

    const sourceFields = (sourceData?.normalized_fields_json as Record<string, string | null>) || {};

    // Fetch matching SOP (stored in trigger field as service_key)
    const { data: sops } = await supabase
      .from("sops")
      .select("steps")
      .eq("trigger", task.service_key || "")
      .eq("active", true)
      .limit(1);

    const sopContent = sops?.[0]?.steps || null;

    // Build prompt
    const clientBiz = (task.clients as unknown as { name: string } | null)?.name || "the business";
    const recipientName = task.recipient_name || sourceFields.customer_name || "the customer";

    const promptFn = SERVICE_PROMPTS[task.service_key || ""];
    if (!promptFn) return { success: false, message: `No AI prompt template for service: ${task.service_key}` };

    let userPrompt = promptFn(recipientName, clientBiz, sourceFields);
    if (sopContent) {
      userPrompt += `\n\nFollow this SOP for guidance:\n${sopContent}`;
    }

    const anthropic = new Anthropic({ apiKey });
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: "You are a back-office operations assistant for Abscondata. You draft professional emails and messages on behalf of service businesses. Be concise, professional, and warm. No exclamation marks. No em dashes. No AI-sounding language.",
      messages: [{ role: "user", content: userPrompt }],
    });

    const draft = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.type === "text" ? block.text : "")
      .join("\n");

    if (!draft) return { success: false, message: "No draft generated" };

    // Save to task
    const { error } = await supabase
      .from("tasks")
      .update({ ai_draft: draft })
      .eq("id", taskId);

    if (error) return { success: false, message: error.message };

    revalidatePath("/dashboard/queue");
    revalidatePath("/dashboard/clients");
    return { success: true, message: "AI draft generated", draft };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed to generate draft" };
  }
}
