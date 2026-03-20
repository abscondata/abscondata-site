import { useState } from "react";

export default function Abscondata() {
  const CALENDLY = "https://calendly.com/abscondata";
  const EMAIL = "abscondata@gmail.com";
  const PHONE = "(772) 486-8112";

  const [open, setOpen] = useState(null);
  const toggle = (i) => setOpen(open === i ? null : i);

  const modules = [
    {
      name: "Revenue Capture Control",
      short:
        "Make sure you actually get paid for the work you've already done.",
      tasks: [
        "Following up on outstanding invoices before they age out",
        "Tracking every quote sent and nudging the ones that went quiet",
        "Making sure new leads get a response within hours, not days",
        "Checking what actually came in against what should have",
        "Flagging jobs completed but never invoiced",
      ],
      outcome:
        "Less money slipping through the cracks. More of what you earned actually collected.",
    },
    {
      name: "Operations Control",
      short:
        "Keep the day-to-day running without you holding every thread.",
      tasks: [
        "Managing scheduling so nothing double-books or gets missed",
        "Coordinating handoffs between team members cleanly",
        "Flagging unanswered client messages before they go stale",
        "Making sure recurring tasks actually happen on schedule",
        "Handling vendor coordination and follow-up",
      ],
      outcome:
        "The business runs the same whether you're watching it or not.",
    },
    {
      name: "Risk & Records Control",
      short: "Stay organized in the ways that protect the business.",
      tasks: [
        "Keeping contracts, agreements, and key documents filed and findable",
        "Tracking renewal dates so nothing expires without warning",
        "Keeping receipts, statements, and financial docs organized so tax season isn't a disaster",
        "Organizing operational records by client, project, or vendor",
        "Making sure nothing important is only in someone's inbox",
      ],
      outcome: "Nothing expires, disappears, or catches you off guard.",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 font-sans antialiased">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-sm border-b border-neutral-800/50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-semibold tracking-tight text-white">
            Abscondata
          </span>
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-400 text-neutral-950 text-sm font-semibold px-4 py-2 rounded hover:bg-amber-300 transition-all duration-300 ease-in-out"
          >
            Book a Call
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-28 sm:pt-36 pb-32 sm:pb-40">
        <h1 className="text-5xl sm:text-6xl font-bold leading-[1.08] tracking-tight text-neutral-100">
          You're still chasing every
          <br />
          email, invoice, and
          <br />
          follow-up.
        </h1>
        <p className="mt-8 text-lg sm:text-xl text-neutral-400 max-w-xl leading-relaxed">
          Abscondata handles the recurring admin and operational work so you
          stop being your own back office.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-5">
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-amber-400 text-neutral-950 font-semibold px-8 py-3.5 rounded text-center hover:bg-amber-300 hover:scale-105 transition-all duration-300 ease-in-out"
          >
            Book a Call
          </a>
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <a
              href={`mailto:${EMAIL}`}
              className="hover:text-neutral-300 transition-all duration-300 ease-in-out"
            >
              {EMAIL}
            </a>
            <span>·</span>
            <a
              href={`tel:${PHONE.replace(/\D/g, "")}`}
              className="hover:text-neutral-300 transition-all duration-300 ease-in-out"
            >
              {PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="bg-neutral-900/40">
        <div className="max-w-5xl mx-auto px-6 py-20 sm:py-28">
          <h2 className="text-sm font-medium tracking-widest uppercase text-neutral-500 mb-10 sm:mb-12">
            Sound familiar?
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
            {[
              {
                title: "You're the one chasing every follow-up.",
                body: "Leads go cold because nobody has time to check.",
              },
              {
                title: "Scheduling lives in your head.",
                body: "And three different apps that don't talk to each other.",
              },
              {
                title: "Growth is creating more work, not more freedom.",
                body: "Every new client means more admin you weren't hired to do.",
              },
              {
                title: "The stuff that should just happen... doesn't.",
                body: "Invoices, emails, filing — it all waits until you get to it.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-neutral-900/60 border border-neutral-800 rounded-lg p-6"
              >
                <p className="text-white font-medium leading-snug">
                  {card.title}
                </p>
                <p className="text-neutral-400 text-sm mt-2">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What it is */}
      <section className="py-24 sm:py-28">
        <div className="text-center max-w-2xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-100 tracking-tight leading-snug">
            A system for your operations.
            <br />
            Not a hire. Not a consultant.
          </h2>
          <p className="mt-5 text-neutral-400 max-w-lg mx-auto">
            You don't manage us like staff. You don't brief us like a
            consultant. We plug into how your business already works and make it
            run consistently.
          </p>
        </div>
      </section>

      {/* Modules */}
      <section className="bg-neutral-900/40">
        <div className="max-w-3xl mx-auto px-6 py-20 sm:py-28">
          <p className="text-2xl sm:text-3xl font-semibold text-neutral-100 tracking-tight">
            One system. Three layers.
          </p>
          <p className="text-neutral-400 mt-3 mb-10 sm:mb-12">
            Click to see what's inside each one.
          </p>
          <div className="space-y-3">
            {modules.map((mod, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={mod.name}
                  className={`border rounded-lg transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "border-neutral-700 bg-neutral-800/50"
                      : "border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  <button
                    onClick={() => toggle(i)}
                    className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
                  >
                    <div className="pr-4">
                      <h3 className="text-lg font-medium text-white">
                        {mod.name}
                      </h3>
                      <p className="text-sm text-neutral-400 mt-1">
                        {mod.short}
                      </p>
                    </div>
                    <span
                      className={`text-neutral-500 text-2xl leading-none shrink-0 transition-all duration-300 ease-in-out select-none ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6">
                        <div className="border-t border-neutral-800 pt-5">
                          <ul className="space-y-2.5 mb-5">
                            {mod.tasks.map((t) => (
                              <li
                                key={t}
                                className="flex items-start gap-3 text-sm text-neutral-300"
                              >
                                <span className="mt-1.5 block h-1 w-1 rounded-full bg-neutral-600 shrink-0" />
                                {t}
                              </li>
                            ))}
                          </ul>
                          <p className="text-sm text-amber-400">
                            {mod.outcome}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it starts */}
      <section className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-100 tracking-tight mb-12">
            How we start.
          </h2>
          <div className="grid sm:grid-cols-3 gap-10 sm:gap-8">
            {[
              {
                n: "1",
                title: "Book a call",
                body: "We learn where you're losing time and what's not working.",
              },
              {
                n: "2",
                title: "We scope the support",
                body: "Based on your actual operations — not a generic package.",
              },
              {
                n: "3",
                title: "Monthly service begins",
                body: "Month-to-month. Built around how your business runs.",
              },
            ].map((step) => (
              <div key={step.n}>
                <p className="text-amber-400 text-4xl font-bold mb-3">
                  {step.n}
                </p>
                <h3 className="text-white font-medium mb-2">{step.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="bg-neutral-900/40">
        <div className="max-w-2xl mx-auto px-6 py-20 sm:py-24 text-center">
          <p className="text-xs font-medium tracking-widest uppercase text-neutral-500 mb-5">
            Who this is for
          </p>
          <p className="text-neutral-400 leading-relaxed">
            Owner-operated service businesses with 1–20 employees. Med spas,
            landscapers, cleaning companies, home service pros, bookkeeping
            firms, small professional-service shops. The common thread: growing
            faster than the systems behind it.
          </p>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20 sm:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs font-medium tracking-widest uppercase text-neutral-500 mb-4">
            Behind the company
          </p>
          <p className="text-white font-medium">Robin</p>
          <p className="text-neutral-400 mt-2 max-w-lg">
            Building the back-office support that small businesses need
            but can't easily hire for.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-neutral-900/40">
        <div className="max-w-3xl mx-auto px-6 py-28 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-neutral-100 tracking-tight">
            Let's talk about your operations.
          </h2>
          <p className="mt-4 text-neutral-400">
            Start with a call. We'll figure out the rest from there.
          </p>
          <div className="mt-10">
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-amber-400 text-neutral-950 font-semibold px-10 py-4 text-base rounded hover:bg-amber-300 transition-all duration-300 ease-in-out"
            >
              Book a Call
            </a>
          </div>
          <div className="mt-8 flex items-center justify-center gap-3 text-sm text-neutral-500">
            <a
              href={`mailto:${EMAIL}`}
              className="hover:text-neutral-300 transition-all duration-300 ease-in-out"
            >
              {EMAIL}
            </a>
            <span>·</span>
            <a
              href={`tel:${PHONE.replace(/\D/g, "")}`}
              className="hover:text-neutral-300 transition-all duration-300 ease-in-out"
            >
              {PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-8">
        <p className="text-xs text-neutral-600">
          &copy; {new Date().getFullYear()} Abscondata
        </p>
      </footer>
    </div>
  );
}
