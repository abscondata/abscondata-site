"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = "You are drafting emails on behalf of a service business. Write as if you ARE the business owner or office manager. First person. Short paragraphs. Friendly but professional. No exclamation marks. No em dashes. No 'I hope this finds you well' or similar filler. Get to the point in the first sentence.";

function formatSourceFields(fields: Record<string, string | null>): string {
  const parts: string[] = [];
  if (fields.customer_name) parts.push(`Customer: ${fields.customer_name}`);
  if (fields.customer_email) parts.push(`Email: ${fields.customer_email}`);
  if (fields.customer_phone) parts.push(`Phone: ${fields.customer_phone}`);
  if (fields.invoice_number) parts.push(`Invoice #${fields.invoice_number}`);
  if (fields.amount) parts.push(`Amount: $${fields.amount}`);
  if (fields.due_date) parts.push(`Due date: ${fields.due_date}`);
  if (fields.days_overdue) parts.push(`Days overdue: ${fields.days_overdue}`);
  if (fields.notes) parts.push(`Notes: ${fields.notes}`);
  return parts.length > 0 ? parts.join("\n") : "No additional details available.";
}

function buildUserPrompt(
  serviceKey: string,
  recipientName: string,
  clientBiz: string,
  sourceFields: Record<string, string | null>
): string | null {
  const details = formatSourceFields(sourceFields);

  switch (serviceKey) {
    case "invoice_ops":
      return `Write an invoice delivery email from ${clientBiz} to ${recipientName}.
Invoice details from source data:
${details}
Keep it under 5 sentences. Include the amount if available. Ask them to reach out with any questions.`;

    case "payment_followup":
      return `Write a payment follow-up email from ${clientBiz} to ${recipientName}.
This is regarding an outstanding balance. Details:
${details}
Tone: firm but polite. Reference the original invoice if details are available. Ask for payment or to discuss a payment plan. Keep under 5 sentences.`;

    case "review_requests":
      return `Write a review request email from ${clientBiz} to ${recipientName}.
They recently received service from ${clientBiz}. Source info:
${details}
Ask them to leave a review. Include a Google review link placeholder: [REVIEW_LINK]. Keep it warm and brief — 3-4 sentences max.`;

    case "lead_intake":
      return `Write a response to a new lead inquiry for ${clientBiz}. The lead is ${recipientName}.
Their inquiry details:
${details}
Respond promptly, reference their specific inquiry, suggest next steps or a call. Keep under 5 sentences.`;

    default:
      return null;
  }
}

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

    const userPrompt = buildUserPrompt(task.service_key || "", recipientName, clientBiz, sourceFields);
    if (!userPrompt) return { success: false, message: `No AI prompt template for service: ${task.service_key}` };

    const fullPrompt = sopContent
      ? `${userPrompt}\n\nFollow these operational guidelines:\n${sopContent}`
      : userPrompt;

    const anthropic = new Anthropic({ apiKey });
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: fullPrompt }],
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
