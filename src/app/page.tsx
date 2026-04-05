import Link from "next/link";

const services = [
  {
    title: "Invoice Operations",
    description:
      "We create, send, and track invoices inside your existing system. You complete the job — the invoice goes out the same day.",
    key: "invoice_ops",
  },
  {
    title: "Payment Follow-Up",
    description:
      "Overdue accounts get follow-up on a set schedule. Reminders drafted, sent, and logged until you get paid.",
    key: "payment_followup",
  },
  {
    title: "Review Requests",
    description:
      "After every completed job, we send review requests to your customers through the channels that actually get responses.",
    key: "review_requests",
  },
  {
    title: "Weekly Business Summary",
    description:
      "Every Monday you get a report: invoices sent, payments collected, reviews received, tasks completed. Full visibility.",
    key: "weekly_summary",
  },
  {
    title: "Lead & Intake Admin",
    description:
      "New inquiries get a response within hours, not days. We log, qualify, and route so nothing falls through.",
    key: "lead_intake",
    addon: true,
  },
];

const process_steps = [
  {
    number: "01",
    title: "Share access to your tools",
    description:
      "QuickBooks, Jobber, ServiceTitan, Google Workspace — whatever you use. We create a secure login and get to work.",
  },
  {
    number: "02",
    title: "We operate your back office",
    description:
      "On a set weekly schedule, our team logs into your systems, pulls data, drafts communications, and executes every task.",
  },
  {
    number: "03",
    title: "You see everything we did",
    description:
      "Weekly reporting with every action documented. What was completed, what's outstanding, what needs your input.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]" style={{ fontFamily: "var(--font-sans)" }}>
      {/* ───── Navigation ───── */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <Link href="/" className="text-[22px] font-semibold tracking-[-0.02em] text-[#0F1A2E]" style={{ fontFamily: "var(--font-serif)" }}>
          Abscondata
        </Link>
        <div className="flex items-center gap-6 sm:gap-8">
          <Link
            href="/onboarding"
            className="text-[13px] font-medium text-[#5A564F] transition-colors hover:text-[#0F1A2E]"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#0F1A2E] border-b border-[#0F1A2E]/30 pb-[2px] hover:border-[#0F1A2E]"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* ───── Hero ───── */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <div className="pb-20 pt-24 sm:pt-32 lg:pt-40 lg:pb-28">
          <div className="max-w-3xl">
            <h1
              className="text-[36px] font-medium leading-[1.12] tracking-[-0.03em] text-[#0F1A2E] sm:text-[48px] lg:text-[60px]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Your back office,
              <br />
              handled.
            </h1>
            <p className="mt-7 max-w-xl text-[17px] font-light leading-[1.7] text-[#5A564F] sm:text-[18px]">
              Abscondata runs invoicing, collections, review requests, and
              reporting for service businesses. You do the work. We handle
              everything behind it.
            </p>
            <p className="mt-4 max-w-lg text-[15px] leading-[1.7] text-[#8A8680]">
              We&apos;re not a platform you need to learn. We&apos;re a team that
              logs into your systems and executes — so you can stay on the job.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center bg-[#0F1A2E] px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-white transition-all hover:bg-[#1a2d4d] sm:px-10"
              >
                Start Onboarding
              </Link>
              <span className="text-[13px] text-[#8A8680]">
                Services begin within one week
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Thin rule ───── */}
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <div className="h-px bg-[#D6D3CD]" />
      </div>

      {/* ───── Services ───── */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="flex flex-col gap-16 lg:flex-row lg:gap-20">
          {/* Left label */}
          <div className="lg:w-64 lg:shrink-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B8956A]">
              What We Handle
            </p>
            <p className="mt-4 text-[15px] leading-[1.7] text-[#8A8680] lg:max-w-[220px]">
              Five core services. Each one runs on a repeatable weekly cycle
              inside your existing tools.
            </p>
          </div>

          {/* Service list */}
          <div className="flex-1">
            {services.map((s, i) => (
              <div
                key={s.key}
                className={`flex flex-col gap-1 py-7 sm:flex-row sm:items-baseline sm:gap-8 ${
                  i < services.length - 1 ? "border-b border-[#E5E2DC]" : ""
                }`}
              >
                <div className="flex items-center gap-3 sm:w-56 sm:shrink-0">
                  <h3 className="text-[16px] font-semibold text-[#0F1A2E]">
                    {s.title}
                  </h3>
                  {s.addon && (
                    <span className="rounded-full border border-[#B8956A]/30 px-2 py-[2px] text-[10px] font-semibold uppercase tracking-[0.08em] text-[#B8956A]">
                      Add-on
                    </span>
                  )}
                </div>
                <p className="text-[14px] leading-[1.65] text-[#6B6762]">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Thin rule ───── */}
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <div className="h-px bg-[#D6D3CD]" />
      </div>

      {/* ───── How It Works ───── */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="flex flex-col gap-16 lg:flex-row lg:gap-20">
          <div className="lg:w-64 lg:shrink-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B8956A]">
              How It Works
            </p>
          </div>
          <div className="flex-1">
            <div className="grid gap-12 sm:grid-cols-3 sm:gap-8">
              {process_steps.map((step) => (
                <div key={step.number}>
                  <span className="text-[13px] font-semibold text-[#B8956A]">
                    {step.number}
                  </span>
                  <h3 className="mt-3 text-[16px] font-semibold leading-[1.35] text-[#0F1A2E]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.65] text-[#6B6762]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── Who We Work With ───── */}
      <section className="bg-[#0F1A2E]">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-20">
            <div className="lg:w-64 lg:shrink-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4B896]">
                Who We Work With
              </p>
            </div>
            <div className="flex-1 max-w-2xl">
              <h2
                className="text-[28px] font-medium leading-[1.25] text-white sm:text-[36px]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Service businesses where admin work competes with billable hours.
              </h2>
              <p className="mt-6 text-[15px] leading-[1.75] text-white/55">
                Trades, construction, facilities management, home services, health
                and wellness. Companies with 2–50 employees where the owner is
                still doing invoicing at 9 PM because there&apos;s no one else to do it.
              </p>
              <p className="mt-4 text-[15px] leading-[1.75] text-white/55">
                We take that off your plate — permanently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Numbers ───── */}
      <section className="border-b border-[#E5E2DC] bg-[#F4F3F0]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-4">
            {[
              { stat: "< 24hr", label: "From onboarding to execution" },
              { stat: "5", label: "Core operational services" },
              { stat: "100%", label: "Of work documented weekly" },
              { stat: "0", label: "Software for you to learn" },
            ].map((item) => (
              <div key={item.label} className="text-center sm:text-left">
                <p
                  className="text-[32px] font-medium tracking-[-0.02em] text-[#0F1A2E] sm:text-[36px]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {item.stat}
                </p>
                <p className="mt-1 text-[13px] leading-[1.5] text-[#8A8680]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Terms ───── */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="flex flex-col gap-16 lg:flex-row lg:gap-20">
          <div className="lg:w-64 lg:shrink-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B8956A]">
              Engagement Terms
            </p>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-y-10 gap-x-12 sm:grid-cols-4 sm:gap-x-8">
              {[
                {
                  label: "Pricing",
                  value: "Flat monthly rate based on scope",
                },
                {
                  label: "Commitment",
                  value: "Month-to-month. 30-day cancellation.",
                },
                {
                  label: "Onboarding",
                  value: "Services begin within one week",
                },
                {
                  label: "Reporting",
                  value: "Weekly summary of all completed work",
                },
              ].map((t) => (
                <div key={t.label}>
                  <p className="text-[13px] font-semibold text-[#0F1A2E]">
                    {t.label}
                  </p>
                  <p className="mt-2 text-[14px] leading-[1.6] text-[#6B6762]">
                    {t.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── Thin rule ───── */}
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <div className="h-px bg-[#D6D3CD]" />
      </div>

      {/* ───── Bottom CTA ───── */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className="text-[28px] font-medium leading-[1.2] tracking-[-0.02em] text-[#0F1A2E] sm:text-[36px]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Ready to stop doing your own invoicing?
          </h2>
          <p className="mt-5 text-[15px] leading-[1.7] text-[#8A8680]">
            Tell us about your business. We review every submission personally
            and respond within 24 hours with a plan.
          </p>
          <Link
            href="/onboarding"
            className="mt-8 inline-flex items-center justify-center bg-[#0F1A2E] px-10 py-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-white transition-all hover:bg-[#1a2d4d]"
          >
            Start Onboarding
          </Link>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="border-t border-[#E5E2DC]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row sm:px-8 lg:px-12">
          <span className="text-[13px] text-[#8A8680]">
            &copy; 2026 Abscondata
          </span>
          <div className="flex items-center gap-5 text-[13px] text-[#8A8680]">
            <a
              href="mailto:robin@abscondata.com"
              className="transition-colors hover:text-[#0F1A2E]"
            >
              robin@abscondata.com
            </a>
            <span className="text-[#D6D3CD]">&middot;</span>
            <a
              href="tel:+17724868112"
              className="transition-colors hover:text-[#0F1A2E]"
            >
              (772) 486-8112
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
