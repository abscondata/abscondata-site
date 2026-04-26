import Link from "next/link";

const COLORS = {
  cream: "#F3F1EC",
  ink: "#151515",
  muted: "#5A5751",
  rule: "#D7D2C7",
};

const CALENDLY_URL = "https://calendly.com/abscondata";

export default function Home() {
  return (
    <div
      style={{
        backgroundColor: COLORS.cream,
        color: COLORS.ink,
        minHeight: "100vh",
        fontFamily: "var(--font-sans)",
        display: "flex",
        flexDirection: "column",
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

      <main
        style={{
          flex: 1,
          maxWidth: "1120px",
          width: "100%",
          margin: "0 auto",
          padding: "132px 48px 96px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div>
          <h1
            style={{
              margin: "0 0 28px",
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(54px, 8vw, 104px)",
              fontWeight: 500,
              lineHeight: 0.96,
              letterSpacing: "0",
            }}
          >
            Administrative operations.
          </h1>
          <p
            style={{
              margin: "0 0 16px",
              color: COLORS.muted,
              fontSize: "clamp(20px, 2.4vw, 30px)",
              lineHeight: 1.3,
            }}
          >
            Invoices. Scheduling. Intake. Records. Exceptions.
          </p>
          <p
            style={{
              margin: "0 0 36px",
              color: COLORS.muted,
              fontSize: "clamp(20px, 2.4vw, 30px)",
              lineHeight: 1.3,
            }}
          >
            Inside existing systems.
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
            Call
          </a>
        </div>
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
