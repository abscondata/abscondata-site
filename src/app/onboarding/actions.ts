"use server";

import { createClient } from "@supabase/supabase-js";

export async function submitOnboarding(payload: Record<string, unknown>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error("Missing Supabase env vars");

  // Use raw supabase-js with anon key (no auth context needed for public insert)
  const supabase = createClient(url, anonKey);

  const { error } = await supabase
    .from("onboarding_submissions")
    .insert({ payload_json: payload, status: "pending" });

  if (error) throw new Error(error.message);
  return { success: true };
}
