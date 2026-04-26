import Link from "next/link";

const COLORS = {
  cream: "#F3F1EC",
  ink: "#151515",
  muted: "#5A5751",
  rule: "#D7D2C7",
  panel: "#E9E5DC",
  white: "#FFFFFF",
};

const CALENDLY_URL = "https://calendly.com/abscondata";

const controls = [
  {
    title: "Invoice queue",
    body: "Open invoices, payment follow-up, estimate tracking, and receivables reporting.",
  },
  {
    title: "Schedule queue",
    body: "Appointments, confirmations, reminders, reschedules, cancellations, and post-service follow-up.",
  },
  {
    title: "Intake queue",
    body: "New requests, missing details, service notes, customer records, and handoff items.",
  },
  {
    title: "Records and exceptions",
    body: "Document updates, contract dates, renewal tracking, weekly summaries, and items requiring owner review.",
  },
];

const method = [
  "Review the open work.",
  "Assign status and owner.",
  "Move routine items.",
  "Hold exceptions.",
  "Report what changed.",
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
    label: "Visibility",
    value: "Weekly summary of completed work, held items, and decisions needed.",
  },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        margin: 0,
        fontFamily: "var(--font-serif)",
        fontSize: "36px",
        fontWeight: 500,
        lineHeight: 1.08,
        letterSpacing: "0",
      }}
    >
      {children}
    </h2>
  );
}

export default function Home() {
  return (
    <div
      style={{
        backgroundColor: COLORS.cream,
        color: COLORS.ink,
        minHeight: "100vh",
        fontFamily: "var(--font-sans)",
        fontSize: "15px",
        lineHeight: 1.62,
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
          padding: "88px 48px 76px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 360px)",
          gap: "56px",
          alignItems: "end",
        }}
      >
        <div>
          <p
            style={{
              margin: "0 0 18px",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase" as const,
              color: COLORS.muted,
            }}
          >
            Service-business operations
          </p>
          <h1
            style={{
              margin: "0 0 26px",
              maxWidth: "720px",
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(44px, 7vw, 78px)",
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: "0",
            }}
          >
            Back-office control for service businesses.
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: "690px",
              fontSize: "18px",
              color: COLORS.muted,
              lineHeight: 1.7,
            }}
          >
            Abscondata works the invoices, scheduling changes, intake details,
            records, and exceptions that drift inside the tools a service
            business already uses.
          </p>
        </div>
        <div style={{ borderTop: `1px solid ${COLORS.ink}`, paddingTop: "22px" }}>
          <p style={{ margin: "0 0 26px", color: COLORS.muted, lineHeight: 1.7 }}>
            Routine items move on a weekly cadence. Exceptions stay visible for
            owner review.
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
            maxWidth: "1120px",
            margin: "0 auto",
            padding: "68px 48px",
            borderTop: `1px solid ${COLORS.rule}`,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(220px, 320px) minmax(0, 1fr)",
              gap: "56px",
            }}
          >
            <SectionTitle>What Abscondata controls</SectionTitle>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                borderTop: `1px solid ${COLORS.rule}`,
                borderLeft: `1px solid ${COLORS.rule}`,
              }}
            >
              {controls.map((item) => (
                <div
                  key={item.title}
                  style={{
                    minHeight: "185px",
                    padding: "24px",
                    borderRight: `1px solid ${COLORS.rule}`,
                    borderBottom: `1px solid ${COLORS.rule}`,
                    backgroundColor: "rgba(255,255,255,0.22)",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 12px",
                      fontSize: "17px",
                      fontWeight: 600,
                      lineHeight: 1.25,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ margin: 0, color: COLORS.muted, lineHeight: 1.65 }}>
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ backgroundColor: COLORS.panel }}>
          <div
            style={{
              maxWidth: "1120px",
              margin: "0 auto",
              padding: "60px 48px",
              display: "grid",
              gridTemplateColumns: "minmax(220px, 320px) minmax(0, 1fr)",
              gap: "56px",
              alignItems: "start",
            }}
          >
            <SectionTitle>Operating method</SectionTitle>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                borderTop: `1px solid ${COLORS.rule}`,
                borderLeft: `1px solid ${COLORS.rule}`,
              }}
            >
              {method.map((step) => (
                <div
                  key={step}
                  style={{
                    minHeight: "90px",
                    padding: "20px",
                    borderRight: `1px solid ${COLORS.rule}`,
                    borderBottom: `1px solid ${COLORS.rule}`,
                    fontWeight: 500,
                    lineHeight: 1.45,
                  }}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            padding: "64px 48px",
            display: "grid",
            gridTemplateColumns: "minmax(220px, 320px) minmax(0, 1fr)",
            gap: "56px",
            borderBottom: `1px solid ${COLORS.rule}`,
          }}
        >
          <SectionTitle>Inside existing systems</SectionTitle>
          <p
            style={{
              margin: 0,
              maxWidth: "720px",
              fontSize: "17px",
              color: COLORS.muted,
              lineHeight: 1.72,
            }}
          >
            Abscondata does not require a new platform. Work is performed inside
            the client&apos;s existing inboxes, calendars, invoicing tools,
            CRMs, spreadsheets, and field-service software.
          </p>
        </section>

        <section
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            padding: "68px 48px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(220px, 320px) minmax(0, 1fr)",
              gap: "56px",
            }}
          >
            <SectionTitle>Engagement terms</SectionTitle>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                borderTop: `1px solid ${COLORS.rule}`,
                borderLeft: `1px solid ${COLORS.rule}`,
              }}
            >
              {terms.map((term) => (
                <div
                  key={term.label}
                  style={{
                    minHeight: "135px",
                    padding: "22px",
                    borderRight: `1px solid ${COLORS.rule}`,
                    borderBottom: `1px solid ${COLORS.rule}`,
                  }}
                >
                  <h3 style={{ margin: "0 0 10px", fontSize: "14px", fontWeight: 600 }}>
                    {term.label}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      color: COLORS.muted,
                      fontSize: "14px",
                      lineHeight: 1.6,
                    }}
                  >
                    {term.value}
                  </p>
                </div>
              ))}
            </div>
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
