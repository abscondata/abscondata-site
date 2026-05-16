import Link from "next/link";

const COLORS = {
  cream: "#F3F1EC",
  ink: "#151515",
  muted: "#5A5751",
  rule: "#D7D2C7",
  panel: "#E8E3D9",
};

const CALENDLY_URL = "https://calendly.com/abscondata";

const coverage = [
  {
    title: "Lead response",
    body: "New inquiries reviewed, drafted, and routed before they sit untouched.",
  },
  {
    title: "Invoice generation",
    body: "Completed work turned into invoice drafts from the records already available.",
  },
  {
    title: "Payment follow-up",
    body: "Open invoices worked through approved follow-up rules and logged status.",
  },
  {
    title: "Review requests",
    body: "Completed jobs prepared for review outreach when the timing is right.",
  },
  {
    title: "Weekly summary",
    body: "Completed work, open items, held exceptions, and owner decisions reported back.",
  },
];

const model = [
  "Validate the source.",
  "Draft the action.",
  "Hold for approval.",
  "Send through the approved channel.",
  "Log the result.",
  "Report the week.",
];

const goodFit = [
  "Digital records",
  "Email-based workflows",
  "Recurring invoice or lead volume",
  "Owner willing to approve rules",
  "Work that can be standardized",
];

const notFit = [
  "Phone-only operations",
  "No process discipline",
  "Custom everything",
  "No usable records",
  "Financial books, calendar dispatching, supplier coordination, or cost accounting needs",
];

const terms = [
  { label: "Scope", value: "Fixed monthly scope." },
  { label: "Cadence", value: "Weekly operating cycle." },
  { label: "Control", value: "Sensitive actions held for approval." },
  {
    label: "Visibility",
    value: "Weekly summary of work completed, open items, and decisions needed.",
  },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        margin: 0,
        fontFamily: "var(--font-serif)",
        fontSize: "34px",
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
          width: "100%",
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
          width: "100%",
          margin: "0 auto",
          padding: "86px 48px 74px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 360px)",
          gap: "58px",
          alignItems: "end",
        }}
      >
        <div>
          <p
            style={{
              margin: "0 0 18px",
              color: COLORS.muted,
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "2.2px",
              textTransform: "uppercase" as const,
            }}
          >
            Client operations
          </p>
          <h1
            style={{
              margin: "0 0 28px",
              maxWidth: "780px",
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(44px, 7vw, 82px)",
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: "0",
            }}
          >
            We run one office task off your team's plate while you hire.
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: "700px",
              color: COLORS.muted,
              fontSize: "18px",
              lineHeight: 1.68,
            }}
          >
            One recurring task: lead follow-up, invoice follow-up, review
            requests, or weekly backlog reporting, handled by us inside the
            tools you already use. Weekly summary every Friday.
          </p>
        </div>
        <div style={{ borderTop: `1px solid ${COLORS.ink}`, paddingTop: "22px" }}>
          <p style={{ margin: "0 0 28px", color: COLORS.muted, lineHeight: 1.7 }}>
            Built for companies adding admin or operations help but still
            dealing with work that slips during the week.
          </p>
          <Link
            href="/pilot"
            style={{
              color: COLORS.ink,
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "1.8px",
              textTransform: "uppercase" as const,
              borderBottom: `1px solid ${COLORS.ink}`,
              paddingBottom: "3px",
            }}
          >
            See the 30-day pilot
          </Link>
        </div>
      </header>

      <main>
        <section
          style={{
            maxWidth: "1120px",
            width: "100%",
            margin: "0 auto",
            padding: "66px 48px",
            borderTop: `1px solid ${COLORS.rule}`,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(220px, 300px) minmax(0, 1fr)",
              gap: "56px",
            }}
          >
            <SectionTitle>Coverage</SectionTitle>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                borderTop: `1px solid ${COLORS.rule}`,
                borderLeft: `1px solid ${COLORS.rule}`,
              }}
            >
              {coverage.map((item) => (
                <div
                  key={item.title}
                  style={{
                    minHeight: "186px",
                    padding: "22px",
                    borderRight: `1px solid ${COLORS.rule}`,
                    borderBottom: `1px solid ${COLORS.rule}`,
                    backgroundColor: "rgba(255,255,255,0.18)",
                  }}
                >
                  <h3 style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: 600 }}>
                    {item.title}
                  </h3>
                  <p style={{ margin: 0, color: COLORS.muted, lineHeight: 1.62 }}>
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
              width: "100%",
              margin: "0 auto",
              padding: "60px 48px",
              display: "grid",
              gridTemplateColumns: "minmax(220px, 300px) minmax(0, 1fr)",
              gap: "56px",
              alignItems: "start",
            }}
          >
            <SectionTitle>Operating model</SectionTitle>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                borderTop: `1px solid ${COLORS.rule}`,
                borderLeft: `1px solid ${COLORS.rule}`,
              }}
            >
              {model.map((step) => (
                <div
                  key={step}
                  style={{
                    minHeight: "94px",
                    padding: "18px",
                    borderRight: `1px solid ${COLORS.rule}`,
                    borderBottom: `1px solid ${COLORS.rule}`,
                    fontSize: "14px",
                    fontWeight: 600,
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
            width: "100%",
            margin: "0 auto",
            padding: "62px 48px",
            display: "grid",
            gridTemplateColumns: "minmax(220px, 300px) minmax(0, 1fr)",
            gap: "56px",
            borderBottom: `1px solid ${COLORS.rule}`,
          }}
        >
          <SectionTitle>Inside existing systems</SectionTitle>
          <p
            style={{
              margin: 0,
              maxWidth: "720px",
              color: COLORS.muted,
              fontSize: "17px",
              lineHeight: 1.7,
            }}
          >
            Abscondata does not require a new platform. Work is performed inside
            the client&apos;s existing inboxes, invoicing tools, CRMs,
            field-service systems, spreadsheets, and shared records.
          </p>
        </section>

        <section
          style={{
            maxWidth: "1120px",
            width: "100%",
            margin: "0 auto",
            padding: "66px 48px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(220px, 300px) minmax(0, 1fr)",
              gap: "56px",
            }}
          >
            <SectionTitle>Fit</SectionTitle>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                borderTop: `1px solid ${COLORS.rule}`,
                borderLeft: `1px solid ${COLORS.rule}`,
              }}
            >
              {[
                { title: "Good fit", items: goodFit },
                { title: "Not a fit", items: notFit },
              ].map((group) => (
                <div
                  key={group.title}
                  style={{
                    padding: "24px",
                    borderRight: `1px solid ${COLORS.rule}`,
                    borderBottom: `1px solid ${COLORS.rule}`,
                    minHeight: "228px",
                  }}
                >
                  <h3 style={{ margin: "0 0 18px", fontSize: "16px", fontWeight: 600 }}>
                    {group.title}
                  </h3>
                  <div style={{ display: "grid", gap: "8px", color: COLORS.muted }}>
                    {group.items.map((item) => (
                      <div key={item}>{item}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          style={{
            maxWidth: "1120px",
            width: "100%",
            margin: "0 auto",
            padding: "0 48px 72px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(220px, 300px) minmax(0, 1fr)",
              gap: "56px",
            }}
          >
            <SectionTitle>Terms</SectionTitle>
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
                    minHeight: "132px",
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
            width: "100%",
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
