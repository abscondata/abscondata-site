import Link from "next/link";

const COLORS = {
  cream: "#F7F5F0",
  navy: "#1B2A4A",
  gold: "#B8956A",
  goldLight: "#D4B896",
  charcoal: "#2C2C2C",
  warmGray: "#6B6560",
  divider: "#E0DCD5",
  white: "#FFFFFF",
};

const CALENDLY_URL = "https://calendly.com/abscondata";

const modules = [
  {
    title: "Revenue Operations",
    services: [
      "Invoice cycle management",
      "Accounts receivable follow-up",
      "Quote and estimate tracking",
      "Accounts receivable reporting",
    ],
  },
  {
    title: "Scheduling & Coordination",
    services: [
      "Appointment coordination",
      "Confirmation and reminder management",
      "Reschedule and cancellation handling",
      "Post-service follow-up and review generation",
    ],
  },
  {
    title: "Records & Reporting",
    services: [
      "Document management",
      "Contract and renewal tracking",
      "Weekly and monthly reporting",
    ],
  },
];

export default function Home() {
  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        backgroundColor: COLORS.cream,
        color: COLORS.charcoal,
        minHeight: "100vh",
        lineHeight: 1.7,
        fontWeight: 400,
        fontSize: "15px",
      }}
    >
      {/* Nav */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "28px 48px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "22px",
            fontWeight: 600,
            color: COLORS.navy,
            letterSpacing: "0.5px",
          }}
        >
          Abscondata
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "13px",
              color: COLORS.warmGray,
              textDecoration: "none",
            }}
          >
            Schedule a Call
          </a>
          <Link
            href="/login"
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: COLORS.navy,
              textDecoration: "none",
              letterSpacing: "1.8px",
              textTransform: "uppercase" as const,
              borderBottom: `1px solid ${COLORS.navy}`,
              paddingBottom: "2px",
            }}
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "120px 48px 100px",
          textAlign: "center" as const,
        }}
      >
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "50px",
            fontWeight: 500,
            color: COLORS.navy,
            lineHeight: 1.18,
            marginBottom: "32px",
          }}
        >
          Managed Back-Office Operations
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: COLORS.warmGray,
            lineHeight: 1.85,
            maxWidth: "580px",
            margin: "0 auto 48px",
            fontWeight: 300,
          }}
        >
          Abscondata provides retained operational support for service
          companies. Invoicing, scheduling, coordination, records, and
          reporting, handled on your behalf.
        </p>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            fontSize: "12px",
            fontWeight: 500,
            letterSpacing: "2px",
            textTransform: "uppercase" as const,
            color: COLORS.white,
            backgroundColor: COLORS.navy,
            padding: "16px 40px",
            textDecoration: "none",
          }}
        >
          Schedule a Call
        </a>
      </header>

      <div
        style={{
          width: "60px",
          height: "1px",
          backgroundColor: COLORS.gold,
          margin: "0 auto",
        }}
      />

      {/* Services */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "96px 48px",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "3px",
            textTransform: "uppercase" as const,
            color: COLORS.gold,
            marginBottom: "20px",
          }}
        >
          Services
        </p>
        <div style={{ marginTop: "56px" }}>
          {modules.map((m, i) => (
            <div
              key={i}
              style={{
                padding: "48px 0",
                borderBottom:
                  i < modules.length - 1
                    ? `1px solid ${COLORS.divider}`
                    : "none",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "26px",
                  fontWeight: 600,
                  color: COLORS.navy,
                  marginBottom: "12px",
                }}
              >
                {m.title}
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px 48px",
                }}
              >
                {m.services.map((s, j) => (
                  <div
                    key={j}
                    style={{
                      fontSize: "14px",
                      color: COLORS.charcoal,
                      lineHeight: 1.6,
                      paddingLeft: "16px",
                      position: "relative" as const,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute" as const,
                        left: 0,
                        top: "10px",
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        backgroundColor: COLORS.goldLight,
                      }}
                    />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div
        style={{
          width: "60px",
          height: "1px",
          backgroundColor: COLORS.gold,
          margin: "0 auto",
        }}
      />

      {/* About */}
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "96px 48px",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "3px",
            textTransform: "uppercase" as const,
            color: COLORS.gold,
            marginBottom: "20px",
          }}
        >
          About
        </p>
        <p
          style={{
            fontSize: "15px",
            color: COLORS.warmGray,
            lineHeight: 1.85,
            maxWidth: "620px",
            fontWeight: 300,
          }}
        >
          Abscondata is a managed operations firm providing retained back-office
          support to service businesses. Engagements are scoped during an initial
          consultation, executed on a fixed weekly schedule, and documented
          through weekly reporting. All work is performed inside the client's
          existing tools and systems.
        </p>
      </section>

      <div
        style={{
          width: "60px",
          height: "1px",
          backgroundColor: COLORS.gold,
          margin: "0 auto",
        }}
      />

      {/* Terms */}
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "96px 48px",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "3px",
            textTransform: "uppercase" as const,
            color: COLORS.gold,
            marginBottom: "20px",
          }}
        >
          Engagement Terms
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: "32px",
            marginTop: "24px",
          }}
        >
          {[
            { label: "Pricing", value: "Flat monthly rate based on scope." },
            { label: "Commitment", value: "Month to month. 30-day cancellation." },
            { label: "Onboarding", value: "Services begin within one week." },
            { label: "Reporting", value: "Weekly summary of completed work." },
          ].map((term) => (
            <div key={term.label}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: COLORS.navy,
                  marginBottom: "8px",
                }}
              >
                {term.label}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: COLORS.warmGray,
                  lineHeight: 1.75,
                  fontWeight: 300,
                }}
              >
                {term.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Who We Work With */}
      <section style={{ backgroundColor: COLORS.navy }}>
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "96px 48px",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "3px",
              textTransform: "uppercase" as const,
              color: COLORS.goldLight,
              marginBottom: "20px",
            }}
          >
            Who We Work With
          </p>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "36px",
              fontWeight: 500,
              color: COLORS.white,
              lineHeight: 1.25,
              marginBottom: "24px",
            }}
          >
            Service businesses where operational tasks
            <br />
            compete with billable work.
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.85,
              maxWidth: "620px",
              fontWeight: 300,
            }}
          >
            Trades, construction, facilities, home services, health and wellness
            — companies where the people doing the work are also managing the
            invoicing, scheduling, and records. Abscondata handles the
            operational load so revenue-generating time stays protected.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${COLORS.divider}` }}>
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "32px 48px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "13px",
            fontWeight: 300,
          }}
        >
          <div style={{ color: COLORS.warmGray }}>© 2026 Abscondata</div>
          <div
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "center",
            }}
          >
            <a
              href="mailto:info@abscondata.com"
              style={{ color: COLORS.warmGray, textDecoration: "none" }}
            >
              info@abscondata.com
            </a>
            <span style={{ color: COLORS.divider }}>·</span>
            <a
              href="tel:+17724868112"
              style={{ color: COLORS.warmGray, textDecoration: "none" }}
            >
              (772) 486-8112
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
