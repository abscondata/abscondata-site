import Link from "next/link";

const services = [
  {
    title: "Invoice Operations",
    description:
      "We create, send, and track invoices inside your existing system. Target same-day sending when job data is complete.",
    key: "invoice_ops",
  },
  {
    title: "Payment Follow-Up",
    description:
      "Overdue accounts get followed up on a set schedule. Each touch documented, outcomes logged until the balance is resolved.",
    key: "payment_followup",
  },
  {
    title: "Review Requests",
    description:
      "After completed jobs, review requests are queued, sent, and tracked consistently — so they stop getting forgotten.",
    key: "review_requests",
  },
  {
    title: "Weekly Business Summary",
    description:
      "Every Monday: invoices sent, payments collected, reviews received, tasks completed. Full visibility into what happened and what needs attention.",
    key: "weekly_summary",
  },
];

const process_steps = [
  {
    number: "01",
    title: "You create a separate login for our team",
    description:
      "In the systems you already use — QuickBooks, Jobber, ServiceTitan, Google Workspace. No new software. No migration.",
  },
  {
    number: "02",
    title: "We operate on a weekly schedule",
    description:
      "Our team logs in, pulls data, drafts communications, and executes tasks. Where needed, drafts are held for your review before anything goes out.",
  },
  {
    number: "03",
    title: "You see everything we did",
    description:
      "Weekly report every Monday. Every action documented. What was completed, what's outstanding, what needs your input.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Navigation */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <Link href="/" className="text-[22px] font-semibold tracking-[-0.02em] text-[#0F1A2E]" style={{ fontFamily: "var(--font-serif)" }}>
          Abscondata
        </Link>
        <div className="flex items-center gap-6 sm:gap-8">
          <Link href="/onboarding" className="text-[13px] font-medium text-[#5A564F] transition-colors hover:text-[#0F1A2E]">
            Get In Touch
          </Link>
          <Link href="/login" className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#0F1A2E] border-b border-[#0F1A2E]/30 pb-[2px] hover:border-[#0F1A2E]">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero */}
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
              Abscondata runs invoicing, payment follow-up, review requests, and
              weekly reporting for small service businesses — inside the systems
              you already use.
            </p>
            <p className="mt-4 max-w-lg text-[15px] leading-[1.7] text-[#8A8680]">
              We work inside the tools you already have, so you don&apos;t need to
              change your workflow or learn new software. You keep doing the
              work. We keep the operational side moving.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center bg-[#0F1A2E] px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-white transition-all hover:bg-[#1a2d4d] sm:px-10"
              >
                Tell Us About Your Business
              </Link>
              <span className="text-[13px] text-[#8A8680]">
                Initial review within 24 hours. Service launch within one week.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-y border-[#E5E2DC] bg-[#F4F3F0]">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-12 lg:px-12">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
            {[
              "No new software to learn",
              "Work done inside your tools",
              "Weekly reporting every Monday",
              "Month-to-month engagement",
              "Separate access for our team",
              "Sensitive actions held for approval",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <span className="mt-[5px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#B8956A]" />
                <p className="text-[13px] leading-[1.45] text-[#5A564F]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="flex flex-col gap-16 lg:flex-row lg:gap-20">
          <div className="lg:w-64 lg:shrink-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B8956A]">
              What We Handle
            </p>
            <p className="mt-4 text-[15px] leading-[1.7] text-[#8A8680] lg:max-w-[220px]">
              Four core services. Each runs on a repeatable weekly cycle inside
              your existing tools.
            </p>
          </div>
          <div className="flex-1">
            {services.map((s, i) => (
              <div
                key={s.key}
                className={`flex flex-col gap-1 py-7 sm:flex-row sm:items-baseline sm:gap-8 ${
                  i < services.length - 1 ? "border-b border-[#E5E2DC]" : ""
                }`}
              >
                <h3 className="text-[16px] font-semibold text-[#0F1A2E] sm:w-56 sm:shrink-0">
                  {s.title}
                </h3>
                <p className="text-[14px] leading-[1.65] text-[#6B6762]">
                  {s.description}
                </p>
              </div>
            ))}
            <div className="mt-6 rounded border border-dashed border-[#D6D3CD] px-6 py-5">
              <div className="flex items-center gap-3">
                <h3 className="text-[14px] font-medium text-[#8A8680]">
                  Lead &amp; Intake Admin
                </h3>
                <span className="rounded-full border border-[#D6D3CD] px-2 py-[1px] text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8A8680]">
                  Optional add-on
                </span>
              </div>
              <p className="mt-2 text-[13px] leading-[1.6] text-[#A09D97]">
                New inquiry response and intake processing. Available when core
                services are running smoothly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <div className="h-px bg-[#D6D3CD]" />
      </div>

      {/* How It Works */}
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

      {/* How Access Works */}
      <section className="border-y border-[#E5E2DC] bg-[#F4F3F0]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-20">
            <div className="lg:w-64 lg:shrink-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B8956A]">
                How Access Works
              </p>
            </div>
            <div className="max-w-2xl flex-1">
              <p className="text-[16px] font-semibold leading-[1.5] text-[#0F1A2E]">
                You create a separate user or login for our team in the systems
                you already use.
              </p>
              <p className="mt-4 text-[14px] leading-[1.7] text-[#6B6762]">
                We work inside your existing tools — not our own platform.
                Every action is documented. Sensitive operations like sending
                invoices or customer communications can be held for your review
                before anything goes out. You keep full control.
              </p>
              <p className="mt-4 text-[14px] leading-[1.7] text-[#6B6762]">
                Access can be revoked at any time. No long-term contracts, no lock-in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Work With */}
      <section className="bg-[#0F1A2E]">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-20">
            <div className="lg:w-64 lg:shrink-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4B896]">
                Who We Work With
              </p>
            </div>
            <div className="max-w-2xl flex-1">
              <h2
                className="text-[28px] font-medium leading-[1.25] text-white sm:text-[36px]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Built for service businesses where admin keeps getting pushed to
                the end of the day.
              </h2>
              <p className="mt-6 text-[15px] leading-[1.75] text-white/55">
                Trades, construction, facilities, and home services across
                Florida and the Southeast. Companies with 2–50 employees where
                invoicing, payment follow-up, and reporting are too important to
                keep doing ad hoc at night.
              </p>
              <p className="mt-4 text-[15px] leading-[1.75] text-white/55">
                When those tasks keep getting pushed, cash slows down, reviews
                get missed, and the owner ends up doing admin at 9 PM because
                there&apos;s no one else to do it. We put that work on a repeatable
                operating rhythm so it stops falling through.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Abscondata */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="flex flex-col gap-16 lg:flex-row lg:gap-20">
          <div className="lg:w-64 lg:shrink-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B8956A]">
              Why Abscondata
            </p>
          </div>
          <div className="max-w-2xl flex-1">
            <h2
              className="text-[24px] font-medium leading-[1.3] text-[#0F1A2E] sm:text-[28px]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Not a VA you have to train. Not software you have to learn.
            </h2>
            <p className="mt-5 text-[14px] leading-[1.7] text-[#6B6762]">
              Hiring a virtual assistant means writing instructions, managing
              quality, answering questions, and hoping things get done
              consistently. Abscondata is a managed service — the process is
              built in. You get repeatable execution, structured reporting, and
              controlled access to your systems without training anyone.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <div className="h-px bg-[#D6D3CD]" />
      </div>

      {/* Terms */}
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
                { label: "Pricing", value: "Flat monthly rate based on scope" },
                { label: "Commitment", value: "Month-to-month. 30-day cancellation." },
                { label: "Onboarding", value: "Services begin within one week" },
                { label: "Reporting", value: "Weekly summary every Monday" },
              ].map((t) => (
                <div key={t.label}>
                  <p className="text-[13px] font-semibold text-[#0F1A2E]">{t.label}</p>
                  <p className="mt-2 text-[14px] leading-[1.6] text-[#6B6762]">{t.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <div className="h-px bg-[#D6D3CD]" />
      </div>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className="text-[28px] font-medium leading-[1.2] tracking-[-0.02em] text-[#0F1A2E] sm:text-[36px]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Ready to get invoicing, follow-up, and reporting off your plate?
          </h2>
          <p className="mt-5 text-[15px] leading-[1.7] text-[#8A8680]">
            Tell us what tools you use, what work you want off your plate, and
            where the bottlenecks are. We review every submission personally
            and respond within 24 hours.
          </p>
          <Link
            href="/onboarding"
            className="mt-8 inline-flex items-center justify-center bg-[#0F1A2E] px-10 py-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-white transition-all hover:bg-[#1a2d4d]"
          >
            Start Onboarding
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E2DC]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row sm:px-8 lg:px-12">
          <span className="text-[13px] text-[#8A8680]">&copy; 2026 Abscondata</span>
          <div className="flex items-center gap-5 text-[13px] text-[#8A8680]">
            <a href="mailto:robin@abscondata.com" className="transition-colors hover:text-[#0F1A2E]">
              robin@abscondata.com
            </a>
            <span className="text-[#D6D3CD]">&middot;</span>
            <a href="tel:+17724868112" className="transition-colors hover:text-[#0F1A2E]">
              (772) 486-8112
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
