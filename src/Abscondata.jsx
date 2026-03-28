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
      description:
        "End-to-end management of the billing cycle, from invoice generation through payment collection, quote tracking, and accounts receivable reporting.",
      services: [
        "Invoice generation and delivery",
        "Payment follow-up on outstanding balances",
        "Quote and estimate tracking",
        "Accounts receivable reporting",
      ],
    },
    {
      title: "Scheduling & Coordination",
      description:
        "Systematic handling of appointments, confirmations, and customer communication so nothing falls through the cracks.",
      services: [
        "Appointment and job scheduling",
        "Confirmation and reminder messages",
        "Reschedule and cancellation handling",
        "Post-completion follow-up and review requests",
      ],
    },
    {
      title: "Records & Reporting",
      description:
        "Structured document management, contract oversight, and regular operational reporting that gives you full visibility into your business.",
      services: [
        "Document organization and filing",
        "Contract and renewal tracking",
        "Weekly and monthly operational reporting",
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
        <p style={styles.heroLabel}>Managed Back-Office Operations</p>
        <h1 style={styles.heroHeading}>
          Everything an office manager would do.
          <br />
          Without the hire.
        </h1>
        <p style={styles.heroSub}>
          Dedicated operational support for service businesses — invoicing,
          scheduling, records, and reporting.
        </p>
        <div style={styles.heroCtas}>
          <Link to="/intake" style={styles.ctaButton}>
            Start Intake
          </Link>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.ctaSecondary}
          >
            Schedule a Consultation
          </a>
        </div>
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
              <p style={styles.moduleDesc}>{m.description}</p>
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
            Abscondata is a managed operations firm based in Florida. We
            provide dedicated back-office support to service businesses on a
            retained basis.
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
                value: "Flat monthly rate based on scope, not hours.",
              },
              {
                label: "Commitment",
                value: "Month-to-month. 30 days notice to cancel.",
              },
              {
                label: "Onboarding",
                value: "Services begin within one week of agreement.",
              },
              {
                label: "Reporting",
                value: "Weekly summary of completed and flagged items.",
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

      {/* CTA Band */}
      <section style={styles.ctaBand}>
        <div style={styles.ctaBandInner}>
          <p style={{ ...styles.sectionLabel, color: COLORS.goldLight }}>
            Get Started
          </p>
          <h2 style={styles.ctaBandHeading}>
            Owner-operators spending hours on work
            <br />
            that isn't earning revenue.
          </h2>
          <p style={styles.ctaBandBody}>
            Abscondata works with service businesses — trades, construction,
            facilities, home services, health and wellness — where the owner
            handles operations because hiring office staff doesn't make sense
            yet. If you're running a company of one to twenty people and admin
            work is costing you billable hours, this is built for you.
          </p>
          <div style={styles.heroCtas}>
            <Link
              to="/intake"
              style={{
                ...styles.ctaButton,
                backgroundColor: COLORS.white,
                color: COLORS.navy,
              }}
            >
              Start Intake
            </Link>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...styles.ctaSecondary,
                color: "rgba(255,255,255,0.6)",
                borderBottomColor: "rgba(255,255,255,0.3)",
              }}
            >
              Schedule a Consultation
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={{ color: COLORS.warmGray }}>© 2026 Abscondata</div>
          <div style={styles.footerLinks}>
            <a
              href="mailto:robin@abscondata.com"
              style={styles.footerLink}
            >
              robin@abscondata.com
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
  heroLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: COLORS.gold,
    marginBottom: "28px",
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
  moduleDesc: {
    fontSize: "15px",
    color: COLORS.warmGray,
    lineHeight: 1.8,
    fontWeight: 300,
    maxWidth: "600px",
    marginBottom: "24px",
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
