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
            Schedule a Call
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-[1140px] mx-auto px-6 sm:px-10 pt-24 sm:pt-36 pb-20 sm:pb-28">
        <div className="max-w-[720px]">
          <h1 className="font-serif text-[2.75rem] sm:text-[3.75rem] font-medium leading-[1.1] tracking-tight text-navy">
            Operational support for service businesses.
          </h1>
          <p className="mt-8 text-lg sm:text-xl leading-relaxed text-gray max-w-[540px]">
            Recurring back-office management. Monthly engagement. No long-term commitment.
          </p>
          <div className="mt-12">
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-navy text-cream text-sm font-medium tracking-wide px-8 py-3.5 hover:bg-charcoal-light transition-colors duration-200"
            >
              Schedule a Call
            </a>
          </div>
        </div>
      </section>

      <hr className="border-rule max-w-[1140px] mx-auto" />

      {/* Services */}
      <section className="max-w-[1140px] mx-auto px-6 sm:px-10 py-20 sm:py-28">
        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-navy mb-6">
          Services
        </h2>
        <p className="text-gray leading-relaxed mb-16 sm:mb-20 max-w-[680px]">
          Abscondata provides operational support across three areas,
          engaged individually or in combination.
        </p>

        <div className="grid sm:grid-cols-[280px_1fr] gap-6 sm:gap-20 pb-14 sm:pb-16 border-b border-rule">
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-charcoal leading-snug">
            Revenue Operations
          </h3>
          <p className="text-gray leading-relaxed">
            Invoicing and accounts receivable management. Payment follow-up
            on outstanding balances. Quote and estimate tracking. Revenue
            reporting.
          </p>
        </div>

        <div className="grid sm:grid-cols-[280px_1fr] gap-6 sm:gap-20 py-14 sm:py-16 border-b border-rule">
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-charcoal leading-snug">
            Scheduling and Coordination
          </h3>
          <p className="text-gray leading-relaxed">
            Appointment and job scheduling. Confirmation and reminder
            communication. Vendor and supplier coordination. Customer
            follow-up after completed work.
          </p>
        </div>

        <div className="grid sm:grid-cols-[280px_1fr] gap-6 sm:gap-20 pt-14 sm:pt-16 mb-16 sm:mb-20">
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-charcoal leading-snug">
            Records and Reporting
          </h3>
          <p className="text-gray leading-relaxed">
            Document organization and filing. Contract and renewal tracking.
            Operational reporting on a weekly or monthly basis. Financial
            record preparation for tax and accounting purposes.
          </p>
        </div>

        <p className="text-gray leading-relaxed">
          Scope and pricing are determined during an initial consultation.
        </p>
      </section>

      <hr className="border-rule max-w-[1140px] mx-auto" />

      {/* Engagement */}
      <section className="max-w-[1140px] mx-auto px-6 sm:px-10 py-20 sm:py-28">
        <div className="grid sm:grid-cols-[280px_1fr] gap-12 sm:gap-20">
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-navy leading-snug">
            Engagement
          </h2>
          <div>
            <p className="text-gray leading-relaxed">
              An initial consultation determines the scope of support. Services
              begin within one week of agreement. Engagements are month-to-month
              with 30 days notice to cancel. Pricing is a flat monthly rate
              based on scope.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-rule max-w-[1140px] mx-auto" />

      {/* Clients */}
      <section className="max-w-[1140px] mx-auto px-6 sm:px-10 py-20 sm:py-28">
        <div className="grid sm:grid-cols-[280px_1fr] gap-12 sm:gap-20">
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-navy leading-snug">
            Clients
          </h2>
          <div>
            <p className="text-gray leading-relaxed">
              Owner-operated service businesses with one to twenty employees
              across trades, home services, health and wellness, and
              professional services.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-rule max-w-[1140px] mx-auto" />

      {/* Bottom CTA */}
      <section className="max-w-[1140px] mx-auto px-6 sm:px-10 py-24 sm:py-32">
        <div className="max-w-[600px]">
          <p className="text-gray leading-relaxed text-lg">
            To discuss an engagement, schedule a call.
          </p>
          <div className="mt-8">
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-navy text-cream text-sm font-medium tracking-wide px-8 py-3.5 hover:bg-charcoal-light transition-colors duration-200"
            >
              Schedule a Call
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-rule">
        <div className="max-w-[1140px] mx-auto px-6 sm:px-10 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-gray-light tracking-wide">
            &copy; {new Date().getFullYear()} Abscondata
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-light">
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
      </footer>
    </div>
  );
}
