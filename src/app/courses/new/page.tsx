import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createCourse } from "@/lib/actions";
import { ProtectedShell } from "@/components/protected-shell";

export default async function NewCoursePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; programId?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error, programId } = await searchParams;

  const { data: programs } = await supabase
    .from("programs")
    .select("id, title")
    .order("title");

  const defaultProgramId =
    programId ?? (programs?.length ? programs[0].id : "");

  return (
    <ProtectedShell userEmail={user.email ?? null}>
      <div className="max-w-3xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            Create
          </p>
          <h1 className="text-3xl font-semibold">New Course</h1>
          <p className="text-sm text-[var(--muted)]">
            Attach the course to an existing program.
          </p>
        </header>

        {error ? (
          <div className="rounded-lg border border-[var(--danger)]/30 bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--danger)]">
            {error}
          </div>
        ) : null}

        {!programs?.length ? (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] p-6 text-sm text-[var(--muted)]">
            No programs exist yet. Create a program before adding courses.
            <div className="mt-3">
              <Link href="/programs/new" className="text-sm font-semibold">
                Create program
              </Link>
            </div>
          </div>
        ) : (
          <form action={createCourse} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                Program
              </label>
              <select
                name="programId"
                defaultValue={defaultProgramId}
                className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
              >
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                Course Title
              </label>
              <input
                name="title"
                required
                className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
              />
            </div>

            <label className="flex items-center gap-3 text-sm text-[var(--muted)]">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked
                className="h-4 w-4 rounded border border-[var(--border)]"
              />
              Mark course as active
            </label>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="rounded-md border border-[var(--accent)] bg-[var(--accent)] px-4 py-2 text-sm text-white"
              >
                Save Course
              </button>
              <Link
                href="/dashboard"
                className="text-sm text-[var(--muted)]"
              >
                Cancel
              </Link>
            </div>
          </form>
        )}
      </div>
    </ProtectedShell>
  );
}
