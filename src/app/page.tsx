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
    body: "New inquiries reviewed, drafted, and routed before they go cold.",
  },
  {
    title: "Invoice generation",
    body: "Completed work turned into invoice drafts from the records you already keep.",
  },
  {
    title: "Payment follow-up",
    body: "Open invoices worked through approved follow-up rules, every touch logged.",
  },
  {
    title: "Review requests",
    body: "Completed jobs prepared for review outreach when the timing's right.",
  },
  {
    title: "Weekly backlog reporting",
    body: "What got done, what's open, what needs a decision.",
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
            Work is slipping through the cracks. We catch it.
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
            Invoice follow-up, lead response, review requests — the recurring
            tasks that get pushed to "next week" every week. We run one of them
            off your team's plate for 30 days. Inside the tools you already use.
            Weekly summary every Friday.
          </p>
        </div>
        <div style={{ borderTop: `1px solid ${COLORS.ink}`, paddingTop: "22px" }}>
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
            <SectionTitle>What we run</SectionTitle>
            <div style={{ display: "grid", gap: "18px" }}>
              <p style={{ margin: 0, color: COLORS.muted, fontSize: "17px" }}>
                Pick one to start:
              </p>
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
            <SectionTitle>How it works</SectionTitle>
            <div style={{ display: "grid", gap: "16px" }}>
              <p
                style={{
                  margin: 0,
                  maxWidth: "720px",
                  color: COLORS.muted,
                  fontSize: "17px",
                  lineHeight: 1.7,
                }}
              >
                You hand us one task and the records that already exist.
              </p>
              <p
                style={{
                  margin: 0,
                  maxWidth: "720px",
                  color: COLORS.muted,
                  fontSize: "17px",
                  lineHeight: 1.7,
                }}
              >
                We work it weekly, hold anything sensitive for your approval,
                and send you a summary every Friday showing exactly what
                happened.
              </p>
              <p
                style={{
                  margin: 0,
                  maxWidth: "720px",
                  color: COLORS.muted,
                  fontSize: "17px",
                  lineHeight: 1.7,
                }}
              >
                That's it. No new tools. No new login. No new process for your
                team.
              </p>
            </div>
          </div>
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
            <SectionTitle>Who this is for</SectionTitle>
            <div style={{ display: "grid", gap: "16px" }}>
              <p
                style={{
                  margin: 0,
                  maxWidth: "720px",
                  color: COLORS.muted,
                  fontSize: "17px",
                  lineHeight: 1.7,
                }}
              >
                Service businesses with 11-200 employees that are hiring for
                admin or operations help and have work piling up while they
                wait.
              </p>
              <p
                style={{
                  margin: 0,
                  maxWidth: "720px",
                  color: COLORS.muted,
                  fontSize: "17px",
                  lineHeight: 1.7,
                }}
              >
                If your records live in email, a CRM, a spreadsheet, or an
                invoicing tool — we can work inside it.
              </p>
            </div>
          </div>
        </section>

        <section
          style={{
            maxWidth: "1120px",
            width: "100%",
            margin: "0 auto",
            padding: "0 48px 72px",
            borderTop: `1px solid ${COLORS.rule}`,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(220px, 300px) minmax(0, 1fr)",
              gap: "56px",
              paddingTop: "62px",
            }}
          >
            <SectionTitle>The pilot</SectionTitle>
            <div style={{ display: "grid", gap: "16px" }}>
              <p
                style={{
                  margin: 0,
                  maxWidth: "720px",
                  color: COLORS.muted,
                  fontSize: "17px",
                  lineHeight: 1.7,
                }}
              >
                $750 for 30 days. One task.
              </p>
              <p
                style={{
                  margin: 0,
                  maxWidth: "720px",
                  color: COLORS.muted,
                  fontSize: "17px",
                  lineHeight: 1.7,
                }}
              >
                If it works, ongoing coverage is $1,500/month. No contract.
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
                  width: "fit-content",
                }}
              >
                Start the pilot
              </Link>
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
