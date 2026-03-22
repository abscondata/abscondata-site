export default function Abscondata() {
  const CALENDLY = "https://calendly.com/abscondata";
  const EMAIL = "abscondata@gmail.com";
  const PHONE = "(772) 486-8112";

  return (
    <div className="min-h-screen bg-cream text-charcoal font-sans">
      {/* Nav */}
      <nav className="border-b border-rule">
        <div className="max-w-[1140px] mx-auto px-6 sm:px-10 py-5 flex items-center justify-between">
          <span className="font-serif text-xl font-semibold tracking-tight text-navy">
            Abscondata
          </span>
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray hover:text-charcoal transition-colors duration-200"
          >
            Schedule a Conversation
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-[1140px] mx-auto px-6 sm:px-10 pt-24 sm:pt-36 pb-20 sm:pb-28">
        <div className="max-w-[720px]">
          <h1 className="font-serif text-[2.75rem] sm:text-[3.75rem] font-medium leading-[1.1] tracking-tight text-navy">
            Your business has outgrown
            <br className="hidden sm:block" />
            {" "}its back office.
          </h1>
          <p className="mt-8 text-lg sm:text-xl leading-relaxed text-gray max-w-[540px]">
            Abscondata provides dedicated operational support — invoicing,
            scheduling, follow-ups, records — so the work that keeps your
            business running actually gets done.
          </p>
          <div className="mt-12">
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-navy text-cream text-sm font-medium tracking-wide px-8 py-3.5 hover:bg-charcoal-light transition-colors duration-200"
            >
              Book a Call
            </a>
          </div>
        </div>
      </section>

      <hr className="border-rule max-w-[1140px] mx-auto" />

      {/* Problem */}
      <section className="max-w-[1140px] mx-auto px-6 sm:px-10 py-20 sm:py-28">
        <div className="grid sm:grid-cols-[280px_1fr] gap-12 sm:gap-20">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-navy leading-snug">
              The gap between
              <br />
              earning and operating
            </h2>
          </div>
          <div className="space-y-8 text-gray leading-relaxed">
            <p>
              You started this business to do the work, not manage the
              paperwork around it. But as the client list grows, so does
              everything else — follow-ups that slip, invoices that age,
              scheduling that lives in your head or across three apps that
              don't talk to each other.
            </p>
            <p>
              Growth creates more admin, not more freedom. Every new client
              means another thread to hold. The work that should just
              happen — doesn't, until you get to it yourself.
            </p>
            <p className="text-charcoal font-medium">
              That's the gap we fill.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-rule max-w-[1140px] mx-auto" />

      {/* What We Do — presented as capabilities */}
      <section className="max-w-[1140px] mx-auto px-6 sm:px-10 py-20 sm:py-28">
        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-navy mb-16 sm:mb-20">
          Three layers of support
        </h2>

        {/* Module 1 */}
        <div className="grid sm:grid-cols-[280px_1fr] gap-6 sm:gap-20 pb-14 sm:pb-16 border-b border-rule">
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-charcoal leading-snug">
            Revenue Capture
          </h3>
          <div>
            <p className="text-gray leading-relaxed mb-6">
              Making sure you actually get paid for the work you've already
              done. We follow up on outstanding invoices before they age out,
              track every quote sent and nudge the ones that went quiet,
              ensure new leads get a response within hours, and flag jobs
              completed but never invoiced.
            </p>
            <p className="text-sm text-copper font-medium">
              Less money slipping through the cracks. More of what you earned
              actually collected.
            </p>
          </div>
        </div>

        {/* Module 2 */}
        <div className="grid sm:grid-cols-[280px_1fr] gap-6 sm:gap-20 py-14 sm:py-16 border-b border-rule">
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-charcoal leading-snug">
            Operations
          </h3>
          <div>
            <p className="text-gray leading-relaxed mb-6">
              Keeping the day-to-day running without you holding every thread.
              We manage scheduling so nothing double-books or gets missed,
              coordinate handoffs between team members, flag unanswered client
              messages before they go stale, and make sure recurring tasks
              actually happen on time.
            </p>
            <p className="text-sm text-copper font-medium">
              The business runs the same whether you're watching it or not.
            </p>
          </div>
        </div>

        {/* Module 3 */}
        <div className="grid sm:grid-cols-[280px_1fr] gap-6 sm:gap-20 pt-14 sm:pt-16">
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-charcoal leading-snug">
            Risk &amp; Records
          </h3>
          <div>
            <p className="text-gray leading-relaxed mb-6">
              Staying organized in the ways that protect the business.
              Contracts, agreements, and key documents — filed and findable.
              Renewal dates tracked so nothing expires without warning.
              Financial records organized so tax season isn't a scramble.
              Nothing important left buried in someone's inbox.
            </p>
            <p className="text-sm text-copper font-medium">
              Nothing expires, disappears, or catches you off guard.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-rule max-w-[1140px] mx-auto" />

      {/* How We Engage */}
      <section className="max-w-[1140px] mx-auto px-6 sm:px-10 py-20 sm:py-28">
        <div className="grid sm:grid-cols-[280px_1fr] gap-12 sm:gap-20">
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-navy leading-snug">
            How we begin
          </h2>
          <div className="space-y-10">
            <div>
              <p className="text-charcoal font-medium mb-2">
                A conversation about your operations
              </p>
              <p className="text-gray leading-relaxed">
                We learn where you're losing time, what's falling through,
                and what consistency would look like for your business.
              </p>
            </div>
            <div>
              <p className="text-charcoal font-medium mb-2">
                We scope the support to fit
              </p>
              <p className="text-gray leading-relaxed">
                Based on your actual workflows — not a generic package.
                What you need handled, how often, and at what level of detail.
              </p>
            </div>
            <div>
              <p className="text-charcoal font-medium mb-2">
                Monthly service, month-to-month
              </p>
              <p className="text-gray leading-relaxed">
                No long-term contracts. Built around how your business
                actually runs. Adjust or cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-rule max-w-[1140px] mx-auto" />

      {/* Who It's For */}
      <section className="max-w-[1140px] mx-auto px-6 sm:px-10 py-20 sm:py-28">
        <div className="grid sm:grid-cols-[280px_1fr] gap-12 sm:gap-20">
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-navy leading-snug">
            Who we work with
          </h2>
          <div>
            <p className="text-gray leading-relaxed">
              Owner-operated service businesses with 1–20 employees.
              Med spas, landscapers, cleaning companies, home service
              professionals, bookkeeping firms, small professional-service
              shops. The common thread: growing faster than the systems
              behind it.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-rule max-w-[1140px] mx-auto" />

      {/* Final CTA */}
      <section className="max-w-[1140px] mx-auto px-6 sm:px-10 py-24 sm:py-32">
        <div className="max-w-[600px]">
          <h2 className="font-serif text-3xl sm:text-[2.5rem] font-medium text-navy leading-tight">
            Let's talk about your operations.
          </h2>
          <p className="mt-5 text-gray leading-relaxed">
            Start with a call. We'll figure out the rest from there.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-6">
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-navy text-cream text-sm font-medium tracking-wide px-8 py-3.5 hover:bg-charcoal-light transition-colors duration-200"
            >
              Book a Call
            </a>
            <div className="flex items-center gap-4 text-sm text-gray-light">
              <a
                href={`mailto:${EMAIL}`}
                className="hover:text-charcoal transition-colors duration-200"
              >
                {EMAIL}
              </a>
              <span className="text-rule">|</span>
              <a
                href={`tel:${PHONE.replace(/\D/g, "")}`}
                className="hover:text-charcoal transition-colors duration-200"
              >
                {PHONE}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-rule">
        <div className="max-w-[1140px] mx-auto px-6 sm:px-10 py-8 flex items-center justify-between">
          <p className="text-xs text-gray-light tracking-wide">
            &copy; {new Date().getFullYear()} Abscondata
          </p>
          <p className="text-xs text-gray-light italic font-serif">
            Operational support for growing businesses
          </p>
        </div>
      </footer>
    </div>
  );
}
