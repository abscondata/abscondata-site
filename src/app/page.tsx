import Link from "next/link";

const services = [
  {
    title: "Invoice Operations",
    description: "Invoice creation, tracking, and status management.",
    key: "invoice_ops",
  },
  {
    title: "Payment Follow-Up",
    description: "Overdue account follow-up and collections support.",
    key: "payment_followup",
  },
  {
    title: "Review Requests",
    description: "Post-service review request queueing and tracking.",
    key: "review_requests",
  },
  {
    title: "Weekly Business Summary",
    description: "Management reporting across all services we run.",
    key: "weekly_summary",
  },
  {
    title: "Lead & Intake Admin",
    description: "New inquiry response and intake processing.",
    key: "lead_intake",
    addon: true,
  },
];

const steps = [
  { number: "01", title: "We get access to your tools", description: "You share credentials or create user accounts in the systems you already use." },
  { number: "02", title: "We run your back office on a weekly schedule", description: "Our team logs into your systems, pulls data, drafts communications, and executes tasks on your behalf." },
  { number: "03", title: "You get a weekly report of everything handled", description: "Every action documented. Full visibility into what was done, what's outstanding, and what needs your attention." },
];

const terms = [
  { label: "Pricing", value: "Flat monthly rate based on scope" },
  { label: "Commitment", value: "Month-to-month, 30-day cancel" },
  { label: "Onboarding", value: "Services begin within one week" },
  { label: "Reporting", value: "Weekly summary of completed work" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Nav */}
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-7 md:px-12">
        <span className="font-[var(--font-serif)] text-xl font-semibold tracking-tight text-[#1B2A4A]">
          Abscondata
        </span>
        <div className="flex items-center gap-8">
          <Link
            href="/onboarding"
            className="text-sm text-[#6B6560] transition-colors hover:text-[var(--text)]"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="border-b border-[#1B2A4A] pb-0.5 text-xs font-medium uppercase tracking-[0.15em] text-[#1B2A4A]"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="mx-auto max-w-3xl px-6 pb-24 pt-28 text-center md:px-12">
        <h1 className="text-4xl font-medium leading-tight text-[#1B2A4A] md:text-5xl">
          Your back office, handled.
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-base font-light leading-relaxed text-[#6B6560]">
          Abscondata runs invoicing, collections, review requests, and reporting
          for service businesses. You do the work. We handle the rest.
        </p>
        <Link
          href="/onboarding"
          className="mt-10 inline-block bg-[#1B2A4A] px-10 py-4 text-xs font-medium uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#2a3d66]"
        >
          Start Onboarding
        </Link>
      </header>

      {/* Divider */}
      <div className="mx-auto h-px w-16 bg-[#B8956A]" />

      {/* Services */}
      <section className="mx-auto max-w-5xl px-6 py-24 md:px-12">
        <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.25em] text-[#B8956A]">
          Services
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.key}
              className="rounded-sm border border-[var(--border)] bg-[var(--surface)] p-6"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-medium text-[#1B2A4A]">{s.title}</h3>
                {s.addon && (
                  <span className="shrink-0 rounded-full bg-[#B8956A]/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#B8956A]">
                    Add-on
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm font-light leading-relaxed text-[#6B6560]">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto h-px w-16 bg-[#B8956A]" />

      {/* How It Works */}
      <section className="mx-auto max-w-5xl px-6 py-24 md:px-12">
        <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.25em] text-[#B8956A]">
          How It Works
        </p>
        <div className="mt-12 grid gap-12 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number}>
              <span className="text-sm font-medium text-[#B8956A]">{step.number}</span>
              <h3 className="mt-3 text-lg font-medium text-[#1B2A4A]">{step.title}</h3>
              <p className="mt-2 text-sm font-light leading-relaxed text-[#6B6560]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Who We Work With */}
      <section className="bg-[#1B2A4A]">
        <div className="mx-auto max-w-4xl px-6 py-24 md:px-12">
          <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.25em] text-[#D4B896]">
            Who We Work With
          </p>
          <h2 className="text-3xl font-medium leading-snug text-white md:text-4xl">
            Service businesses where operational tasks compete with billable work.
          </h2>
          <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-white/60">
            Trades, construction, facilities, home services, health and wellness
            — companies with 2-50 employees where the people doing the work are
            also managing the invoicing, scheduling, and records.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto h-px w-16 bg-[#B8956A]" />

      {/* Engagement Terms */}
      <section className="mx-auto max-w-5xl px-6 py-24 md:px-12">
        <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.25em] text-[#B8956A]">
          Engagement Terms
        </p>
        <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-4">
          {terms.map((t) => (
            <div key={t.label}>
              <p className="text-sm font-semibold text-[#1B2A4A]">{t.label}</p>
              <p className="mt-2 text-sm font-light leading-relaxed text-[#6B6560]">
                {t.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-8 text-sm font-light text-[#6B6560] md:px-12">
          <span>&copy; 2026 Abscondata</span>
          <div className="flex items-center gap-5">
            <a href="mailto:robin@abscondata.com">robin@abscondata.com</a>
            <span className="text-[var(--border)]">&middot;</span>
            <a href="tel:+17724868112">(772) 486-8112</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
