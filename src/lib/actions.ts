"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function encodeMessage(message: string) {
  return encodeURIComponent(message);
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeMessage(error.message)}`);
  }

  redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeMessage(error.message)}`);
  }

  redirect(
    "/login?message=" +
      encodeMessage(
        "Check your email to confirm your account before signing in."
      )
  );
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// Stubs: these exist only so Devine academic pages (which live in a separate
// project but share this repo) can import without breaking the build.
// They are never called from Abscondata code.
/* eslint-disable @typescript-eslint/no-unused-vars */
export async function createProgram(_f: FormData) { redirect("/dashboard"); }
export async function createDomain(_f: FormData) { redirect("/dashboard"); }
export async function createCourse(_f: FormData) { redirect("/dashboard"); }
export async function updateCourse(_f: FormData) { redirect("/dashboard"); }
export async function createModule(_f: FormData) { redirect("/dashboard"); }
export async function reorderModule(_f: FormData) { redirect("/dashboard"); }
export async function createAssignment(_f: FormData) { redirect("/dashboard"); }
export async function createConcept(_f: FormData) { redirect("/dashboard"); }
export async function createReading(_f: FormData) { redirect("/dashboard"); }
export async function updateReadingStatus(_f: FormData) { redirect("/dashboard"); }
export async function submitAssignment(_f: FormData) { redirect("/dashboard"); }
export async function setFinalSubmission(_f: FormData) { redirect("/dashboard"); }
export async function runCritique(_f: FormData) { redirect("/dashboard"); }
