import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signIn, signUp } from "@/lib/actions";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  const { error, message } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl space-y-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-10 shadow-[0_30px_60px_-50px_rgba(0,0,0,0.35)]">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            Devine
          </p>
          <h1 className="text-3xl font-semibold">Private Academic Access</h1>
          <p className="text-sm text-[var(--muted)]">
            Sign in to continue your coursework and review cycles.
          </p>
        </div>

        {error ? (
          <div className="rounded-lg border border-[var(--danger)]/30 bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--danger)]">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--muted)]">
            {message}
          </div>
        ) : null}

        <div className="grid gap-8 md:grid-cols-2">
          <form action={signIn} className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold">Sign In</p>
              <label className="block text-xs text-[var(--muted)]">Email</label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs text-[var(--muted)]">Password</label>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md border border-[var(--accent)] bg-[var(--accent)] px-3 py-2 text-sm text-white"
            >
              Continue
            </button>
          </form>

          <form action={signUp} className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold">Request Access</p>
              <label className="block text-xs text-[var(--muted)]">Email</label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs text-[var(--muted)]">Password</label>
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm text-[var(--accent)]"
            >
              Create Account
            </button>
          </form>
        </div>

        <div className="text-xs text-[var(--muted)]">
          By continuing you agree to the academic integrity standards of Devine.
          <div className="mt-2">
            <Link href="/">Return to start</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
