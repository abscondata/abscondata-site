import type { Metadata } from "next";
import Link from "next/link";

const COLORS = {
  cream: "#F3F1EC",
  ink: "#151515",
  muted: "#5A5751",
  rule: "#D7D2C7",
  panel: "#E8E3D9",
};

const CALENDLY_URL = "https://calendly.com/abscondata";

const tasks = [
  "Lead response and follow-up",
  "Invoice generation from completed work",
  "Payment follow-up on open invoices",
  "Review request preparation",
  "Customer follow-up",
  "Weekly backlog reporting",
];

const sections = [
  {
    title: "How the pilot works",
    body: [
      "We agree on the task and the rules together. The work runs inside the tools you already use, with anything sensitive held for your approval before going out. Every action gets logged. Anything unusual gets flagged. A summary lands in your inbox every Friday. After thirty days you decide whether to keep it going.",
    ],
  },
  {
    title: "What you provide",
    body: [
      "A source list or report you already have. Approved rules for follow-up. One point of contact. A weekly check-in.",
    ],
  },
  {
    title: "What we deliver",
    body: [
      "A worked list. An action log. A weekly summary every Friday. Exceptions flagged before they become problems.",
    ],
  },
];

export const metadata: Metadata = {
  title: "30-Day Pilot - Abscondata",
};

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

export default function PilotPage() {
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
        <Link
          href="/"
          style={{
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "2.4px",
            textTransform: "uppercase" as const,
          }}
        >
          Abscondata
        </Link>
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
        </div>
      </nav>

      <main>
        <header
          style={{
            maxWidth: "1120px",
            width: "100%",
            margin: "0 auto",
            padding: "96px 48px 74px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
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
              30-Day Pilot
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
              One recurring task off your team's plate for 30 days, run inside
              the tools you already use.
            </p>
          </div>
        </header>

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
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              gap: "56px",
            }}
          >
            <SectionTitle>What we can run</SectionTitle>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
                borderTop: `1px solid ${COLORS.rule}`,
                borderLeft: `1px solid ${COLORS.rule}`,
              }}
            >
              {tasks.map((task) => (
                <div
                  key={task}
                  style={{
                    minHeight: "92px",
                    padding: "20px",
                    borderRight: `1px solid ${COLORS.rule}`,
                    borderBottom: `1px solid ${COLORS.rule}`,
                    backgroundColor: "rgba(255,255,255,0.18)",
                    fontSize: "15px",
                    fontWeight: 600,
                    lineHeight: 1.45,
                  }}
                >
                  {task}
                </div>
              ))}
            </div>
          </div>
        </section>

        {sections.map((section, index) => (
          <section
            key={section.title}
            style={{
              backgroundColor: index === 0 ? COLORS.panel : COLORS.cream,
              borderTop: index === 0 ? "none" : `1px solid ${COLORS.rule}`,
            }}
          >
            <div
              style={{
                maxWidth: "1120px",
                width: "100%",
                margin: "0 auto",
                padding: "60px 48px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
                gap: "56px",
              }}
            >
              <SectionTitle>{section.title}</SectionTitle>
              <div style={{ display: "grid", gap: "16px" }}>
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    style={{
                      margin: 0,
                      maxWidth: "720px",
                      color: COLORS.muted,
                      fontSize: "17px",
                      lineHeight: 1.7,
                    }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </section>
        ))}

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
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              gap: "56px",
              paddingTop: "62px",
            }}
          >
            <div />
            <div style={{ display: "grid", gap: "16px" }}>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
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
              </a>
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
            color: COLORS.muted,
            fontSize: "13px",
          }}
        >
          We work inside the systems you already use. Nothing new gets
          installed.
        </div>
      </footer>
    </div>
  );
}
