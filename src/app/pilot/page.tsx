import type { Metadata } from "next";

const COLORS = {
  cream: "#F3F1EC",
  ink: "#151515",
  muted: "#5A5751",
  rule: "#D7D2C7",
  panel: "#E8E3D9",
};

const CALENDLY_URL = "https://calendly.com/abscondata";

const tasks = [
  "Lead follow-up",
  "Estimate follow-up",
  "Invoice follow-up",
  "Review requests",
  "Customer follow-up lists",
  "Weekly backlog reporting",
];

const sections = [
  {
    title: "How the pilot works",
    body: [
      "Week 1: Choose one task. Define rules. Review the source list. Agree on what we send versus what you approve first.",
      "Weeks 2-4: We work the list weekly, draft or send actions based on the approval rules, log every touch, flag exceptions, and send a weekly summary.",
      "End of pilot: Keep it, expand it, or stop.",
    ],
  },
  {
    title: "What you provide",
    body: [
      "Whatever you already have: a spreadsheet, a CRM export, or an aging report works. Approved rules. One point of contact. A weekly check-in.",
    ],
  },
  {
    title: "What we deliver",
    body: [
      "A worked list. An action log. Exceptions flagged. A weekly summary every Friday.",
    ],
  },
  {
    title: "Price",
    body: [
      "$750 for 30 days.",
      "$1,500/month after, for one recurring task.",
      "No contract.",
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
      <main>
        <header
          style={{
            maxWidth: "1120px",
            width: "100%",
            margin: "0 auto",
            padding: "96px 48px 74px",
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
              Abscondata
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
              We run one recurring office task off your team's plate for 30
              days.
            </p>
          </div>
          <div style={{ borderTop: `1px solid ${COLORS.ink}`, paddingTop: "22px" }}>
            <p style={{ margin: "0 0 28px", color: COLORS.muted, lineHeight: 1.7 }}>
              We work inside the systems you already use. No new platform
              required.
            </p>
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
              }}
            >
              Request the pilot outline
            </a>
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
              gridTemplateColumns: "minmax(220px, 300px) minmax(0, 1fr)",
              gap: "56px",
            }}
          >
            <SectionTitle>What we can run</SectionTitle>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
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
                gridTemplateColumns: "minmax(220px, 300px) minmax(0, 1fr)",
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
          We work inside the systems you already use. No new platform required.
        </div>
      </footer>
    </div>
  );
}
