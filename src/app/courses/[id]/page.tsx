import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { reorderModule } from "@/lib/actions";
import { ProtectedShell } from "@/components/protected-shell";

const COMPLETED_READING_STATUSES = new Set(["complete", "skipped"]);

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: course } = await supabase
    .from("courses")
    .select(
      "id, title, description, code, department_or_domain, credits_or_weight, level, learning_outcomes, syllabus, status, program:programs(id, title), domain:domains(id, title, code)"
    )
    .eq("id", id)
    .single();

  if (!course) {
    notFound();
  }

  const { data: prerequisites } = await supabase
    .from("course_prerequisites")
    .select("prerequisite:prerequisite_course_id(id, title, code)")
    .eq("course_id", id);

  const prerequisiteCourses = (prerequisites ?? [])
    .map((item) => item.prerequisite)
    .filter(Boolean);

  const { data: modules } = await supabase
    .from("modules")
    .select("id, title, overview, position")
    .eq("course_id", id)
    .order("position", { ascending: true });

  const moduleIds = modules?.map((module) => module.id) ?? [];

  const { data: readings } = moduleIds.length
    ? await supabase
        .from("readings")
        .select("id, module_id, status, estimated_hours, position")
        .in("module_id", moduleIds)
    : { data: [] };

  const { data: assignments } = moduleIds.length
    ? await supabase
        .from("assignments")
        .select("id, module_id")
        .in("module_id", moduleIds)
    : { data: [] };

  const { data: finalSubmissions } = assignments?.length
    ? await supabase
        .from("submissions")
        .select("assignment_id")
        .eq("user_id", user.id)
        .eq("is_final", true)
    : { data: [] };

  const finalSet = new Set(finalSubmissions?.map((item) => item.assignment_id));

  const readingsByModule = new Map<string, typeof readings>();
  readings?.forEach((reading) => {
    const list = readingsByModule.get(reading.module_id) ?? [];
    list.push(reading);
    readingsByModule.set(reading.module_id, list);
  });

  const assignmentsByModule = new Map<string, typeof assignments>();
  assignments?.forEach((assignment) => {
    const list = assignmentsByModule.get(assignment.module_id) ?? [];
    list.push(assignment);
    assignmentsByModule.set(assignment.module_id, list);
  });

  const moduleSummaries = (modules ?? []).map((module, index) => {
    const moduleReadings = readingsByModule.get(module.id) ?? [];
    const moduleAssignments = assignmentsByModule.get(module.id) ?? [];
    const completedReadings = moduleReadings.filter((reading) =>
      COMPLETED_READING_STATUSES.has(reading.status)
    ).length;
    const completedAssignments = moduleAssignments.filter((assignment) =>
      finalSet.has(assignment.id)
    ).length;
    const totalTasks = moduleReadings.length + moduleAssignments.length;
    const completedTasks = completedReadings + completedAssignments;
    const estimatedHours = moduleReadings.reduce(
      (sum, reading) => sum + (reading.estimated_hours ?? 0),
      0
    );

    return {
      ...module,
      totalTasks,
      completedTasks,
      estimatedHours,
      isFirst: index === 0,
      isLast: index === (modules?.length ?? 0) - 1,
    };
  });

  const totalTasks = moduleSummaries.reduce(
    (sum, module) => sum + module.totalTasks,
    0
  );
  const completedTasks = moduleSummaries.reduce(
    (sum, module) => sum + module.completedTasks,
    0
  );
  const totalHours = moduleSummaries.reduce(
    (sum, module) => sum + module.estimatedHours,
    0
  );

  return (
    <ProtectedShell userEmail={user.email ?? null}>
      <div className="space-y-10">
        <header className="space-y-3">
          <Link
            href="/dashboard"
            className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]"
          >
            Dashboard
          </Link>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              {course.program?.title ?? "Program"}
            </p>
            <h1 className="text-3xl font-semibold">{course.title}</h1>
            <p className="text-sm text-[var(--muted)]">
              {course.description ?? "No course description yet."}
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            <span>
              Progress {completedTasks}/{totalTasks || 0}
            </span>
            <span>
              Estimated reading hours {totalHours ? totalHours.toFixed(1) : "0"}
            </span>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Course Profile</h2>
                <Link
                  href={`/courses/${course.id}/edit`}
                  className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]"
                >
                  Edit
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-2 text-sm text-[var(--muted)]">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em]">Code</p>
                  <p>{course.code ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em]">Status</p>
                  <p>{course.status}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em]">Domain</p>
                  <p>
                    {course.domain
                      ? `${course.domain.code ? `${course.domain.code} — ` : ""}${course.domain.title}`
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em]">Department or Domain</p>
                  <p>{course.department_or_domain ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em]">Level</p>
                  <p>{course.level ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em]">Credits or Weight</p>
                  <p>{course.credits_or_weight ?? "—"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
              <h2 className="text-lg font-semibold">Prerequisites</h2>
              {prerequisiteCourses.length ? (
                <ul className="space-y-2 text-sm text-[var(--muted)]">
                  {prerequisiteCourses.map((prereq) => (
                    <li key={prereq.id}>
                      {prereq.code ? `${prereq.code} — ` : ""}
                      {prereq.title}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[var(--muted)]">No prerequisites.</p>
              )}
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
              <h2 className="text-lg font-semibold">Learning Outcomes</h2>
              <p className="text-sm text-[var(--muted)] whitespace-pre-wrap">
                {course.learning_outcomes ?? "No learning outcomes recorded."}
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
              <h2 className="text-lg font-semibold">Syllabus</h2>
              <p className="text-sm text-[var(--muted)] whitespace-pre-wrap">
                {course.syllabus ?? "No syllabus recorded."}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
              <h2 className="text-lg font-semibold">Academic Links</h2>
              <div className="flex flex-col gap-2 text-sm">
                <Link href="/domains/new" className="text-[var(--muted)]">
                  Create domain
                </Link>
                <Link href="/concepts/new" className="text-[var(--muted)]">
                  Add concept
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Modules</h2>
            <Link
              href={`/modules/new?courseId=${course.id}`}
              className="text-sm text-[var(--muted)]"
            >
              Add module
            </Link>
          </div>

          {moduleSummaries.length ? (
            <div className="space-y-4">
              {moduleSummaries.map((module) => (
                <div
                  key={module.id}
                  className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                      Module {module.position + 1}
                    </p>
                    <Link
                      href={`/modules/${module.id}`}
                      className="text-lg font-semibold"
                    >
                      {module.title}
                    </Link>
                    <p className="text-sm text-[var(--muted)]">
                      {module.overview ?? "No overview provided."}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                      <span>
                        Progress {module.completedTasks}/{module.totalTasks}
                      </span>
                      <span>
                        Reading hours {module.estimatedHours ? module.estimatedHours.toFixed(1) : "0"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <form action={reorderModule}>
                      <input type="hidden" name="moduleId" value={module.id} />
                      <input type="hidden" name="direction" value="up" />
                      <button
                        type="submit"
                        disabled={module.isFirst}
                        className="rounded-md border border-[var(--border)] px-3 py-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)] disabled:opacity-40"
                      >
                        Up
                      </button>
                    </form>
                    <form action={reorderModule}>
                      <input type="hidden" name="moduleId" value={module.id} />
                      <input type="hidden" name="direction" value="down" />
                      <button
                        type="submit"
                        disabled={module.isLast}
                        className="rounded-md border border-[var(--border)] px-3 py-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)] disabled:opacity-40"
                      >
                        Down
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] p-6 text-sm text-[var(--muted)]">
              No modules added yet for this course.
            </div>
          )}
        </section>
      </div>
    </ProtectedShell>
  );
}
