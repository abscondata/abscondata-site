export default function Abscondata() {
  const email = "abscondata@gmail.com";
  const phone = "(772) 486-8112";
  const calendly = "https://calendly.com/abscondata";

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans antialiased">
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
        <span className="text-lg font-semibold tracking-tight text-white">
          Abscondata
        </span>
        <a
          href={calendly}
          className="text-sm text-neutral-400 hover:text-white transition-colors"
        >
          Book a Call
        </a>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-24 pb-32">
        <h1 className="text-4xl sm:text-5xl font-semibold leading-tight tracking-tight text-white">
          Administrative infrastructure
          <br />
          for small service businesses.
        </h1>
        <p className="mt-6 text-lg text-neutral-400 max-w-2xl leading-relaxed">
          Abscondata gives owner-operated firms a structured system for
          recurring admin, follow-up, and day-to-day operations — so the
          business stays organized and responsive without building an internal
          back-office from scratch.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4">
          <a
            href={calendly}
            className="inline-block bg-white text-neutral-950 text-sm font-medium px-6 py-3 rounded hover:bg-neutral-200 transition-colors text-center"
          >
            Book a Call
          </a>
          <span className="text-sm text-neutral-500">
            <a href={`mailto:${email}`} className="hover:text-neutral-300 transition-colors">
              {email}
            </a>
            <span className="mx-2">·</span>
            <a href={`tel:${phone.replace(/\D/g, "")}`} className="hover:text-neutral-300 transition-colors">
              {phone}
            </a>
          </span>
        </div>
      </section>

      <hr className="border-neutral-800 max-w-5xl mx-auto" />

      {/* Problem */}
      <section className="max-w-3xl mx-auto px-6 py-28">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          The business is growing. The operations aren't keeping up.
        </h2>
        <div className="mt-10 grid sm:grid-cols-2 gap-x-12 gap-y-6 text-neutral-400 leading-relaxed">
          <p>
            You're still the one answering emails, chasing follow-ups, and
            making sure nothing falls through the cracks. The work gets done,
            but only because you're holding everything together manually.
          </p>
          <p>
            Scheduling is messy. Documents live in six different places. Basic
            recurring tasks — the ones that should just happen — get handled
            differently every time.
          </p>
          <p>
            You've hired for the work that makes money. But the admin layer
            underneath it — the follow-up, the filing, the coordination — is
            still running on willpower.
          </p>
          <p>
            Growth is creating more clutter, not more leverage. Every new
            client, every new employee, every new commitment adds friction to a
            system that was never really built.
          </p>
        </div>
      </section>

      <hr className="border-neutral-800 max-w-5xl mx-auto" />

      {/* What Abscondata Is */}
      <section className="max-w-3xl mx-auto px-6 py-28">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          A structured support system — not a staffing agency, not a consultancy.
        </h2>
        <p className="mt-6 text-neutral-400 leading-relaxed max-w-2xl">
          Abscondata is an administrative infrastructure layer. We handle
          recurring operational work through consistent systems and reliable
          follow-through — organized around how your business actually runs, not
          around a menu of one-off tasks.
        </p>
        <p className="mt-4 text-neutral-400 leading-relaxed max-w-2xl">
          You don't manage us like staff. You don't brief us like consultants.
          We plug into the operations you already have and make them work
          consistently.
        </p>
      </section>

      <hr className="border-neutral-800 max-w-5xl mx-auto" />

      {/* Three Modules */}
      <section className="max-w-3xl mx-auto px-6 py-28">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          One operating system. Three areas of control.
        </h2>
        <p className="mt-6 text-neutral-400 leading-relaxed max-w-2xl">
          Everything we do falls into three connected layers. They work
          together as a single system — not as separate services you pick from.
        </p>

        <div className="mt-14 space-y-14">
          <div>
            <h3 className="text-lg font-medium text-white">
              Revenue Capture Control
            </h3>
            <p className="mt-3 text-neutral-400 leading-relaxed">
              Leads get followed up on. Quotes go out on time. Nothing sits in
              an inbox waiting for someone to remember. This layer makes sure
              the work you've already earned doesn't slip through gaps in your
              admin.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white">
              Operations Control
            </h3>
            <p className="mt-3 text-neutral-400 leading-relaxed">
              Scheduling stays clean. Handoffs between people are clear.
              Recurring tasks happen the same way every time. This is the
              day-to-day operating backbone — the part that keeps the business
              running without you holding every thread.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white">
              Risk &amp; Records Control
            </h3>
            <p className="mt-3 text-neutral-400 leading-relaxed">
              Documents are where they should be. Records are current.
              Contract renewals and filing deadlines don't sneak up on anyone. This
              layer keeps the business organized in the ways that protect it.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-neutral-800 max-w-5xl mx-auto" />

      {/* In Practice */}
      <section className="max-w-3xl mx-auto px-6 py-28">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          What this looks like day to day.
        </h2>
        <p className="mt-6 text-neutral-400 leading-relaxed max-w-2xl">
          The work is real and recurring. Here's what we typically handle:
        </p>
        <ul className="mt-8 grid sm:grid-cols-2 gap-x-12 gap-y-3 text-neutral-400">
          {[
            "Email triage and management",
            "Lead follow-up and response tracking",
            "Scheduling and calendar coordination",
            "CRM updates and pipeline hygiene",
            "Document organization and filing",
            "Status tracking across active projects",
            "Recurring administrative task execution",
            "Handoff coordination between team members",
            "Basic operational support and cleanup",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1.5 block h-1.5 w-1.5 rounded-full bg-neutral-600 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <hr className="border-neutral-800 max-w-5xl mx-auto" />

      {/* Who It's For */}
      <section className="max-w-3xl mx-auto px-6 py-28">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          Built for small service businesses
          <br className="hidden sm:block" />
          that are outgrowing their systems.
        </h2>
        <p className="mt-6 text-neutral-400 leading-relaxed max-w-2xl">
          Owner-operated firms with one to twenty employees. The business is
          working — there are clients, there's revenue, there are people doing
          the work. But the administrative layer underneath hasn't caught up.
        </p>
        <p className="mt-4 text-neutral-400 leading-relaxed max-w-2xl">
          We work with med spas, bookkeeping firms, cleaning companies,
          landscaping businesses, home service providers, and small
          professional-service firms — among others. The common thread isn't the
          industry. It's the stage: growing faster than the operations can
          support.
        </p>
      </section>

      <hr className="border-neutral-800 max-w-5xl mx-auto" />

      {/* Engagement Model */}
      <section className="max-w-3xl mx-auto px-6 py-28">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          How we start.
        </h2>
        <div className="mt-10 space-y-6 text-neutral-400 leading-relaxed max-w-2xl">
          <p>
            It begins with a call. We learn where the business is losing time
            and consistency, identify where structured support would be most
            useful, and determine whether there's a fit for ongoing service.
          </p>
          <p>
            If there is, we build a support layer around your actual operations
            — not a generic package, but a system that reflects how your
            business works. Service is month-to-month and built for the long
            term.
          </p>
          <p>
            No diagnostic theater. No lengthy proposal decks. Just a clear
            conversation about what's not working and what we can take off your
            plate.
          </p>
        </div>
      </section>

      <hr className="border-neutral-800 max-w-5xl mx-auto" />

      {/* Founder */}
      <section className="max-w-3xl mx-auto px-6 py-28">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          Behind the company.
        </h2>
        <p className="mt-6 text-neutral-400 leading-relaxed max-w-2xl">
          Abscondata was founded by Robin after seeing the same pattern across
          dozens of small businesses: capable owners buried in admin they never
          planned for, with no clean solution between &ldquo;do it all
          yourself&rdquo; and &ldquo;hire someone and hope it works.&rdquo;
        </p>
        <p className="mt-4 text-neutral-400 leading-relaxed max-w-2xl">
          The company exists to be that clean solution — structured, reliable,
          and built to last longer than a contractor or a patchwork of tools.
        </p>
      </section>

      <hr className="border-neutral-800 max-w-5xl mx-auto" />

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pt-28 pb-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          Let's talk about your operations.
        </h2>
        <p className="mt-4 text-neutral-400">
          Start with a call. We'll figure out the rest from there.
        </p>
        <div className="mt-10">
          <a
            href={calendly}
            className="inline-block bg-white text-neutral-950 text-sm font-medium px-8 py-3.5 rounded hover:bg-neutral-200 transition-colors"
          >
            Book a Call
          </a>
        </div>
        <div className="mt-8 text-sm text-neutral-500 space-y-1">
          <p>
            <a href={`mailto:${email}`} className="hover:text-neutral-300 transition-colors">
              {email}
            </a>
          </p>
          <p>
            <a href={`tel:${phone.replace(/\D/g, "")}`} className="hover:text-neutral-300 transition-colors">
              {phone}
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-10 border-t border-neutral-800">
        <p className="text-xs text-neutral-600">
          &copy; {new Date().getFullYear()} Abscondata. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
