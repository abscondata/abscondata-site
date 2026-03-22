export default function Abscondata() {
  const CALENDLY = "https://calendly.com/abscondata";
  const EMAIL = "abscondata@gmail.com";
  const PHONE = "(772) 486-8112";

  const services = [
    "Invoicing and accounts receivable management",
    "Scheduling and calendar coordination",
    "Customer communication and follow-up",
    "Document organization and record maintenance",
    "Vendor and supplier coordination",
    "Operational reporting",
  ];

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
        <div className="grid sm:grid-cols-[280px_1fr] gap-12 sm:gap-20">
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-navy leading-snug">
            Services
          </h2>
          <div>
            <p className="text-gray leading-relaxed mb-10">
              Abscondata provides ongoing administrative and operational
              support to small service businesses on a monthly basis.
            </p>
            <div className="space-y-0">
              {services.map((service, i) => (
                <div
                  key={service}
                  className={`py-4 ${i < services.length - 1 ? "border-b border-rule" : ""}`}
                >
                  <p className="text-charcoal">{service}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
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
