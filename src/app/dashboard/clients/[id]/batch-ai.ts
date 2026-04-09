"use server";

import { createClient } from "@/lib/supabase/server";
import { generateAiDraft } from "../../queue/ai-draft";
import { revalidatePath } from "next/cache";

export async function batchGenerateDrafts(
  clientId: number
): Promise<{ success: boolean; message: string; generated: number; failed: number }> {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return { success: false, message: "AI drafts not configured. Add ANTHROPIC_API_KEY to environment variables.", generated: 0, failed: 0 };
    }

    const supabase = await createClient();

    const { data: tasks } = await supabase
      .from("tasks")
      .select("id, service_key")
      .eq("client_id", clientId)
      .eq("status", "NEW")
      .is("ai_draft", null);

    if (!tasks || tasks.length === 0) {
      return { success: true, message: "No tasks need drafts", generated: 0, failed: 0 };
    }

    // Filter out weekly_summary tasks
    const eligible = tasks.filter((t) => t.service_key !== "weekly_summary");

    let generated = 0;
    let failed = 0;
    const failedTasks: Array<{ taskId: number; reason: string }> = [];

    for (const task of eligible) {
      const result = await generateAiDraft(task.id);
      if (result.success) {
        generated++;
      } else {
        failed++;
        failedTasks.push({ taskId: task.id, reason: result.message });
        console.error("[batchGenerateDrafts] task failed", { taskId: task.id, reason: result.message });
      }
      // 500ms delay between calls to avoid rate limits
      if (generated + failed < eligible.length) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    revalidatePath(`/dashboard/clients/${clientId}`);
    revalidatePath("/dashboard/queue");

    let message = `Generated ${generated} drafts`;
    if (failed > 0) {
      const failedIds = failedTasks.slice(0, 5).map((f) => `#${f.taskId}`).join(", ");
      const truncated = failedTasks.length > 5 ? ` (+${failedTasks.length - 5} more)` : "";
      message += `. ${failed} failed: ${failedIds}${truncated}`;
    }

    return {
      success: true,
      message,
      generated,
      failed,
    };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Batch generation failed", generated: 0, failed: 0 };
  }
}
