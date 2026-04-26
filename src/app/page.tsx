import Link from "next/link";

const COLORS = {
  cream: "#F3F1EC",
  ink: "#151515",
  muted: "#5A5751",
  rule: "#D7D2C7",
  panel: "#E9E5DC",
  dark: "#20201D",
  darkMuted: "rgba(255,255,255,0.68)",
  white: "#FFFFFF",
};

const CALENDLY_URL = "https://calendly.com/abscondata";

const queues = [
  {
    title: "Invoice Queue",
    body: "Open invoices, payment follow-up, estimate tracking, and receivables reporting.",
  },
  {
    title: "Scheduling Queue",
    body: "Appointments, confirmations, reminders, reschedules, cancellations, and post-service follow-up.",
  },
  {
    title: "Intake Queue",
    body: "New requests, missing details, service notes, customer records, and handoff items.",
  },
  {
    title: "Records & Reporting",
    body: "Document updates, contract dates, renewal tracking, weekly summaries, and exception logs.",
  },
];

const cycle = [
  "Review open queues.",
  "Assign status and next step.",
  "Work approved items.",
  "Hold exceptions for owner review.",
  "Report completed work and open decisions.",
];

const fitSignals = [
  "jobs are being completed but invoicing drifts",
  "scheduling changes create loose ends",
  "customer intake is inconsistent",
  "follow-up depends on owner memory",
  "reporting happens only when someone asks",
  "exceptions sit unresolved",
];

const terms = [
  {
    label: "Monthly scope",
    value: "Flat monthly rate based on queue volume and operating scope.",
  },
  {
    label: "Cadence",
    value: "Fixed weekly operating cycle.",
  },
  {
    label: "Commitment",
    value: "Month to month. 30-day cancellation.",
  },
  {
    label: "Onboarding",
    value: "Onboarding begins within one week.",
  },
  {
    label: "Visibility",
    value: "Weekly summary of completed work, held items, and owner decisions needed.",
  },
];

export default function Home() {
  return (
    <div
      style={{
        backgroundColor: COLORS.cream,
        color: COLORS.ink,
        minHeight: "100vh",
        fontFamily: "var(--font-sans)",
        fontSize: "15px",
        lineHeight: 1.65,
      }}
    >
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "24px",
          padding: "24px 48px",
          maxWidth: "1120px",
          margin: "0 auto",
          borderBottom: `1px solid ${COLORS.rule}`,
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "2.4px",
            textTransform: "uppercase" as const,
          }}
        >
          Abscondata
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "1.8px",
              textTransform: "uppercase" as const,
            }}
          >
            Call
          </a>
          <Link
            href="/login"
            style={{
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "1.8px",
              textTransform: "uppercase" as const,
              color: COLORS.muted,
            }}
          >
            Sign In
          </Link>
        </div>
      </nav>

      <header
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
          padding: "96px 48px 88px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 360px)",
          gap: "64px",
          alignItems: "end",
        }}
      >
        <div>
          <p
            style={{
              margin: "0 0 20px",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase" as const,
              color: COLORS.muted,
            }}
          >
            Service-business queue control
          </p>
          <h1
            style={{
              margin: "0 0 28px",
              maxWidth: "760px",
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(44px, 7vw, 82px)",
              fontWeight: 500,
              lineHeight: 0.98,
              letterSpacing: "0",
            }}
          >
            Operating control for service-business administration.
          </h1>
          <p
            style={{
              margin: "0",
              maxWidth: "680px",
              fontSize: "18px",
              color: COLORS.muted,
              lineHeight: 1.7,
            }}
          >
            Abscondata runs the recurring queues that service businesses let
            drift: invoices, scheduling, intake, records, exceptions, and
            weekly reporting.
          </p>
        </div>
        <div
          style={{
            borderTop: `1px solid ${COLORS.ink}`,
            paddingTop: "24px",
          }}
        >
          <p
            style={{
              margin: "0 0 28px",
              color: COLORS.muted,
              lineHeight: 1.75,
            }}
          >
            Work stays inside the systems the business already uses. Open items
            are reviewed, assigned, followed through, and reported on a fixed
            weekly cadence.
          </p>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              backgroundColor: COLORS.ink,
              color: COLORS.white,
              padding: "15px 28px",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "1.8px",
              textTransform: "uppercase" as const,
            }}
          >
            Schedule a Call
          </a>
        </div>
      </header>

      <main>
        <section
          style={{
            borderTop: `1px solid ${COLORS.rule}`,
            borderBottom: `1px solid ${COLORS.rule}`,
          }}
        >
          <div
            style={{
              maxWidth: "1120px",
              margin: "0 auto",
              padding: "72px 48px",
              display: "grid",
              gridTemplateColumns: "minmax(240px, 360px) minmax(0, 1fr)",
              gap: "64px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: "var(--font-serif)",
                fontSize: "38px",
                fontWeight: 500,
                lineHeight: 1.08,
                letterSpacing: "0",
              }}
            >
              The work does not disappear. It waits.
            </h2>
            <div>
              <p
                style={{
                  margin: "0 0 18px",
                  maxWidth: "640px",
                  fontSize: "17px",
                  color: COLORS.muted,
                  lineHeight: 1.75,
                }}
              >
                Invoices wait for follow-up. Appointments move. Intake details
                go missing. Records stay half-updated. Exceptions sit with the
                owner because no one else owns the next step.
              </p>
              <p
                style={{
                  margin: 0,
                  maxWidth: "640px",
                  fontSize: "17px",
                  color: COLORS.ink,
                  lineHeight: 1.75,
                }}
              >
                Abscondata gives those queues a weekly operating owner.
              </p>
            </div>
          </div>
        </section>

        <section
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            padding: "80px 48px",
          }}
        >
          <p
            style={{
              margin: "0 0 24px",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase" as const,
              color: COLORS.muted,
            }}
          >
            What Abscondata controls
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              borderTop: `1px solid ${COLORS.rule}`,
              borderLeft: `1px solid ${COLORS.rule}`,
            }}
          >
            {queues.map((queue) => (
              <div
                key={queue.title}
                style={{
                  minHeight: "210px",
                  padding: "28px",
                  borderRight: `1px solid ${COLORS.rule}`,
                  borderBottom: `1px solid ${COLORS.rule}`,
                  backgroundColor: "rgba(255,255,255,0.22)",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 14px",
                    fontSize: "18px",
                    fontWeight: 600,
                    lineHeight: 1.25,
                  }}
                >
                  {queue.title}
                </h3>
                <p style={{ margin: 0, color: COLORS.muted, lineHeight: 1.7 }}>
                  {queue.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ backgroundColor: COLORS.panel }}>
          <div
            style={{
              maxWidth: "1120px",
              margin: "0 auto",
              padding: "72px 48px",
              display: "grid",
              gridTemplateColumns: "minmax(240px, 360px) minmax(0, 1fr)",
              gap: "64px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: "var(--font-serif)",
                fontSize: "38px",
                fontWeight: 500,
                lineHeight: 1.08,
                letterSpacing: "0",
              }}
            >
              Weekly control cycle
            </h2>
            <ol
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                gap: 0,
                margin: 0,
                padding: 0,
                listStyle: "none",
                borderTop: `1px solid ${COLORS.rule}`,
                borderLeft: `1px solid ${COLORS.rule}`,
              }}
            >
              {cycle.map((step, index) => (
                <li
                  key={step}
                  style={{
                    minHeight: "150px",
                    padding: "22px",
                    borderRight: `1px solid ${COLORS.rule}`,
                    borderBottom: `1px solid ${COLORS.rule}`,
                  }}
                >
                  <div
                    style={{
                      marginBottom: "18px",
                      fontFamily: "var(--font-mono)",
                      fontSize: "12px",
                      color: COLORS.muted,
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div style={{ fontWeight: 500, lineHeight: 1.45 }}>
                    {step}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            padding: "80px 48px",
            display: "grid",
            gridTemplateColumns: "minmax(240px, 360px) minmax(0, 1fr)",
            gap: "64px",
            borderBottom: `1px solid ${COLORS.rule}`,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-serif)",
              fontSize: "38px",
              fontWeight: 500,
              lineHeight: 1.08,
              letterSpacing: "0",
            }}
          >
            Inside the tools already in use.
          </h2>
          <p
            style={{
              margin: 0,
              maxWidth: "720px",
              fontSize: "17px",
              color: COLORS.muted,
              lineHeight: 1.75,
            }}
          >
            Abscondata does not require a new platform. Work is performed inside
            the client's existing systems, inboxes, calendars, invoicing tools,
            CRMs, spreadsheets, and field-service software.
          </p>
        </section>

        <section style={{ backgroundColor: COLORS.dark, color: COLORS.white }}>
          <div
            style={{
              maxWidth: "1120px",
              margin: "0 auto",
              padding: "80px 48px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(260px, 460px) minmax(0, 1fr)",
                gap: "64px",
                alignItems: "start",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: "0 0 24px",
                    fontFamily: "var(--font-serif)",
                    fontSize: "40px",
                    fontWeight: 500,
                    lineHeight: 1.08,
                    letterSpacing: "0",
                  }}
                >
                  For service businesses where operations compete with billable
                  work.
                </h2>
                <p
                  style={{
                    margin: 0,
                    color: COLORS.darkMuted,
                    lineHeight: 1.75,
                  }}
                >
                  Trades, facilities, home services, health and wellness, local
                  operators, and other service businesses where the people doing
                  the work are also managing the queues around the work.
                </p>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 0,
                  borderTop: "1px solid rgba(255,255,255,0.18)",
                  borderLeft: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                {fitSignals.map((signal) => (
                  <div
                    key={signal}
                    style={{
                      minHeight: "106px",
                      padding: "20px",
                      color: COLORS.darkMuted,
                      borderRight: "1px solid rgba(255,255,255,0.18)",
                      borderBottom: "1px solid rgba(255,255,255,0.18)",
                    }}
                  >
                    {signal}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            padding: "80px 48px",
          }}
        >
          <p
            style={{
              margin: "0 0 24px",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase" as const,
              color: COLORS.muted,
            }}
          >
            Engagement terms
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
              borderTop: `1px solid ${COLORS.rule}`,
              borderLeft: `1px solid ${COLORS.rule}`,
            }}
          >
            {terms.map((term) => (
              <div
                key={term.label}
                style={{
                  minHeight: "150px",
                  padding: "22px",
                  borderRight: `1px solid ${COLORS.rule}`,
                  borderBottom: `1px solid ${COLORS.rule}`,
                }}
              >
                <h3
                  style={{
                    margin: "0 0 12px",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  {term.label}
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: COLORS.muted,
                    fontSize: "14px",
                    lineHeight: 1.65,
                  }}
                >
                  {term.value}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer style={{ borderTop: `1px solid ${COLORS.rule}` }}>
        <div
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            padding: "30px 48px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "24px",
            color: COLORS.muted,
            fontSize: "13px",
          }}
        >
          <div>© 2026 Abscondata</div>
          <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
            <a href="mailto:info@abscondata.com">info@abscondata.com</a>
            <span>·</span>
            <a href="tel:+17724868112">(772) 486-8112</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
