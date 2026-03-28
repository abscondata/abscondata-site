import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const COLORS = {
  cream: "#F7F5F0",
  navy: "#1B2A4A",
  navyLight: "#2A3D66",
  gold: "#B8956A",
  goldLight: "#D4B896",
  charcoal: "#2C2C2C",
  warmGray: "#6B6560",
  divider: "#E0DCD5",
  white: "#FFFFFF",
};

const CALENDLY_URL = "https://calendly.com/abscondata";

export default function AbscondataLanding() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <div style={styles.page}>
      {/* Navigation */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: scrolled ? COLORS.white : COLORS.cream,
          borderBottom: scrolled
            ? `1px solid ${COLORS.divider}`
            : "1px solid transparent",
          transition: "all 0.3s ease",
        }}
      >
        <nav style={styles.nav}>
          <div style={styles.logo}>Abscondata</div>
          <div style={styles.navRight}>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.navLink}
            >
              Schedule a Call
            </a>
            <Link to="/intake" style={styles.navCta}>
              Begin Intake
            </Link>
          </div>
        </nav>
      </div>

      {/* Hero */}
      <header style={styles.hero}>
        <h1 style={styles.heroHeading}>
          Managed Back-Office Operations
        </h1>
        <p style={styles.heroSub}>
          Abscondata provides retained operational support for service
          companies. Invoicing, scheduling, coordination, records, and
          reporting, handled on your behalf.
        </p>
        <div style={styles.heroCtas}>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.ctaButton}
          >
            Schedule a Call
          </a>
        </div>
        <Link to="/intake" style={{ ...styles.ctaSecondary, marginTop: "16px", display: "inline-block" }}>
          Begin Intake
        </Link>
      </header>

      <div style={styles.dividerLine} />

      {/* Services / Practice Areas */}
      <section style={styles.section}>
        <p style={styles.sectionLabel}>Services</p>

        <div style={styles.modulesGrid}>
          {modules.map((m, i) => (
            <div
              key={i}
              style={{
                ...styles.moduleCard,
                ...(i === modules.length - 1
                  ? { borderBottom: "none", paddingBottom: 0 }
                  : {}),
              }}
            >
              <h3 style={styles.moduleTitle}>{m.title}</h3>
              <div style={styles.serviceList}>
                {m.services.map((s, j) => (
                  <div key={j} style={styles.serviceItem}>
                    <div style={styles.serviceDot} />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={styles.dividerLine} />

      {/* About */}
      <section style={styles.section}>
        <div style={styles.sectionInner}>
          <p style={styles.sectionLabel}>About</p>
          <p style={styles.sectionBody}>
            Abscondata is a managed operations firm providing retained
            back-office support to service businesses. Engagements are scoped
            during an initial consultation, executed on a fixed weekly
            schedule, and documented through weekly reporting. All work is
            performed inside the client's existing tools and systems.
          </p>
        </div>
      </section>

      <div style={styles.dividerLine} />

      {/* Terms */}
      <section style={styles.section}>
        <div style={styles.sectionInner}>
          <p style={styles.sectionLabel}>Engagement Terms</p>
          <div style={styles.termsGrid}>
            {[
              {
                label: "Pricing",
                value: "Flat monthly rate based on scope.",
              },
              {
                label: "Commitment",
                value: "Month to month. 30-day cancellation.",
              },
              {
                label: "Onboarding",
                value: "Services begin within one week.",
              },
              {
                label: "Reporting",
                value: "Weekly summary of completed work.",
              },
            ].map((term) => (
              <div key={term.label}>
                <div style={styles.termLabel}>{term.label}</div>
                <div style={styles.termValue}>{term.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Market */}
      <section style={styles.ctaBand}>
        <div style={styles.ctaBandInner}>
          <p style={{ ...styles.sectionLabel, color: COLORS.goldLight }}>
            Who We Work With
          </p>
          <h2 style={styles.ctaBandHeading}>
            Service businesses where operational tasks
            <br />
            compete with billable work.
          </h2>
          <p style={styles.ctaBandBody}>
            Trades, construction, facilities, home services, health and
            wellness — companies where the people doing the work are also
            managing the invoicing, scheduling, and records. Abscondata
            handles the operational load so revenue-generating time stays
            protected.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={{ color: COLORS.warmGray }}>© 2026 Abscondata</div>
          <div style={styles.footerLinks}>
            <a
              href="mailto:info@abscondata.com"
              style={styles.footerLink}
            >
              info@abscondata.com
            </a>
            <span style={{ color: COLORS.divider }}>·</span>
            <a href="tel:+17724868112" style={styles.footerLink}>
              (772) 486-8112
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'DM Sans', sans-serif",
    backgroundColor: COLORS.cream,
    color: COLORS.charcoal,
    minHeight: "100vh",
    lineHeight: 1.7,
    fontWeight: 400,
    fontSize: "15px",
    WebkitFontSmoothing: "antialiased",
  },

  // Nav
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "28px 48px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  logo: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "22px",
    fontWeight: 600,
    color: COLORS.navy,
    letterSpacing: "0.5px",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "32px",
  },
  navLink: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    fontWeight: 400,
    color: COLORS.warmGray,
    textDecoration: "none",
    letterSpacing: "0.5px",
  },
  navCta: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "12px",
    fontWeight: 500,
    color: COLORS.navy,
    textDecoration: "none",
    letterSpacing: "1.8px",
    textTransform: "uppercase",
    borderBottom: `1px solid ${COLORS.navy}`,
    paddingBottom: "2px",
  },

  // Hero
  hero: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "120px 48px 100px",
    textAlign: "center",
  },
  heroHeading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "50px",
    fontWeight: 500,
    color: COLORS.navy,
    lineHeight: 1.18,
    marginBottom: "32px",
    letterSpacing: "-0.3px",
  },
  heroSub: {
    fontSize: "16px",
    color: COLORS.warmGray,
    lineHeight: 1.85,
    maxWidth: "580px",
    margin: "0 auto 48px",
    fontWeight: 300,
  },
  heroCtas: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "28px",
  },
  ctaButton: {
    display: "inline-block",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: COLORS.white,
    backgroundColor: COLORS.navy,
    padding: "16px 40px",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
  },
  ctaSecondary: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    fontWeight: 400,
    color: COLORS.warmGray,
    textDecoration: "none",
    borderBottom: `1px solid ${COLORS.divider}`,
    paddingBottom: "1px",
  },
  dividerLine: {
    width: "60px",
    height: "1px",
    backgroundColor: COLORS.gold,
    margin: "0 auto",
  },

  // Sections
  section: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "96px 48px",
  },
  sectionInner: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  sectionLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: COLORS.gold,
    marginBottom: "20px",
  },
  sectionHeading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "36px",
    fontWeight: 500,
    color: COLORS.navy,
    lineHeight: 1.25,
    marginBottom: "16px",
  },
  sectionBody: {
    fontSize: "15px",
    color: COLORS.warmGray,
    lineHeight: 1.85,
    maxWidth: "620px",
    fontWeight: 300,
  },

  // Modules / Practice Areas
  modulesGrid: {
    marginTop: "56px",
  },
  moduleCard: {
    padding: "48px 0",
    borderBottom: `1px solid ${COLORS.divider}`,
  },
  moduleTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "26px",
    fontWeight: 600,
    color: COLORS.navy,
    marginBottom: "12px",
  },
  serviceList: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px 48px",
  },
  serviceItem: {
    fontSize: "14px",
    color: COLORS.charcoal,
    fontWeight: 400,
    lineHeight: 1.6,
    paddingLeft: "16px",
    position: "relative",
  },
  serviceDot: {
    position: "absolute",
    left: 0,
    top: "10px",
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    backgroundColor: COLORS.goldLight,
  },

  // Terms
  termsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    gap: "32px",
    marginTop: "24px",
  },
  termLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    color: COLORS.navy,
    marginBottom: "8px",
    letterSpacing: "0.3px",
  },
  termValue: {
    fontSize: "14px",
    color: COLORS.warmGray,
    lineHeight: 1.75,
    fontWeight: 300,
  },

  // CTA Band
  ctaBand: {
    backgroundColor: COLORS.navy,
  },
  ctaBandInner: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "96px 48px",
  },
  ctaBandHeading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "36px",
    fontWeight: 500,
    color: COLORS.white,
    lineHeight: 1.25,
    marginBottom: "24px",
  },
  ctaBandBody: {
    fontSize: "15px",
    color: "rgba(255,255,255,0.6)",
    lineHeight: 1.85,
    maxWidth: "620px",
    fontWeight: 300,
    marginBottom: "48px",
  },

  // Footer
  footer: {
    borderTop: `1px solid ${COLORS.divider}`,
  },
  footerInner: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "32px 48px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13px",
    fontWeight: 300,
  },
  footerLinks: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "13px",
  },
  footerLink: {
    color: COLORS.warmGray,
    textDecoration: "none",
  },
};
