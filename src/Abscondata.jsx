import { useState, useEffect } from "react";

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

const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

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
  navCta: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    fontWeight: 500,
    color: COLORS.navy,
    textDecoration: "none",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    borderBottom: `1px solid ${COLORS.navy}`,
    paddingBottom: "2px",
    cursor: "pointer",
  },
  hero: {
    maxWidth: "780px",
    margin: "0 auto",
    padding: "100px 48px 80px",
    textAlign: "center",
  },
  heroHeading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "52px",
    fontWeight: 500,
    color: COLORS.navy,
    lineHeight: 1.15,
    marginBottom: "28px",
    letterSpacing: "-0.5px",
  },
  heroSub: {
    fontSize: "17px",
    color: COLORS.warmGray,
    lineHeight: 1.8,
    maxWidth: "560px",
    margin: "0 auto 40px",
    fontWeight: 300,
  },
  ctaButton: {
    display: "inline-block",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: COLORS.white,
    backgroundColor: COLORS.navy,
    padding: "16px 44px",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    transition: "background-color 0.3s ease",
  },
  dividerLine: {
    width: "60px",
    height: "1px",
    backgroundColor: COLORS.gold,
    margin: "0 auto",
  },
  section: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "80px 48px",
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
    lineHeight: 1.8,
    maxWidth: "620px",
    fontWeight: 300,
  },
  modulesGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "0",
    marginTop: "48px",
  },
  moduleCard: {
    padding: "40px 0",
    borderBottom: `1px solid ${COLORS.divider}`,
  },
  moduleTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "24px",
    fontWeight: 600,
    color: COLORS.navy,
    marginBottom: "20px",
  },
  serviceList: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px 40px",
  },
  serviceItem: {
    fontSize: "14px",
    color: COLORS.warmGray,
    fontWeight: 400,
    lineHeight: 1.6,
    paddingLeft: "14px",
    position: "relative",
  },
  serviceItemBefore: {
    position: "absolute",
    left: "0",
    top: "10px",
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    backgroundColor: COLORS.goldLight,
  },
  navSection: {
    backgroundColor: COLORS.white,
  },
  processSection: {
    backgroundColor: COLORS.white,
  },
  processSteps: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "40px",
    marginTop: "48px",
  },
  stepNumber: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "42px",
    fontWeight: 300,
    color: COLORS.divider,
    marginBottom: "12px",
    lineHeight: 1,
  },
  stepTitle: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "14px",
    fontWeight: 600,
    color: COLORS.navy,
    marginBottom: "10px",
    letterSpacing: "0.3px",
  },
  stepBody: {
    fontSize: "14px",
    color: COLORS.warmGray,
    lineHeight: 1.7,
    fontWeight: 300,
  },
  termsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "32px",
    marginTop: "40px",
  },
  termItem: {
    padding: "0",
  },
  termLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    color: COLORS.navy,
    marginBottom: "6px",
    letterSpacing: "0.3px",
  },
  termValue: {
    fontSize: "14px",
    color: COLORS.warmGray,
    lineHeight: 1.7,
    fontWeight: 300,
  },
  clientSection: {
    backgroundColor: COLORS.navy,
    color: COLORS.white,
  },
  clientInner: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "80px 48px",
  },
  clientHeading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "36px",
    fontWeight: 500,
    color: COLORS.white,
    lineHeight: 1.25,
    marginBottom: "24px",
  },
  clientBody: {
    fontSize: "15px",
    color: "rgba(255,255,255,0.7)",
    lineHeight: 1.8,
    maxWidth: "620px",
    fontWeight: 300,
    marginBottom: "40px",
  },
  ctaButtonLight: {
    display: "inline-block",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: COLORS.navy,
    backgroundColor: COLORS.white,
    padding: "16px 44px",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
  },
  footer: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "40px 48px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13px",
    color: COLORS.warmGray,
    fontWeight: 300,
  },
  footerLinks: {
    display: "flex",
    gap: "24px",
    fontSize: "13px",
    color: COLORS.warmGray,
  },
  footerLink: {
    color: COLORS.warmGray,
    textDecoration: "none",
  },
};

const CALENDLY_URL = "https://calendly.com/abscondata";

const ServiceItem = ({ text }) => (
  <div style={styles.serviceItem}>
    <div style={styles.serviceItemBefore} />
    {text}
  </div>
);

const Module = ({ title, services, isLast }) => (
  <div style={{ ...styles.moduleCard, ...(isLast ? { borderBottom: "none" } : {}) }}>
    <div style={styles.moduleTitle}>{title}</div>
    <div style={styles.serviceList}>
      {services.map((s, i) => (
        <ServiceItem key={i} text={s} />
      ))}
    </div>
  </div>
);

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
        "Invoice generation and delivery",
        "Payment follow-up on outstanding balances",
        "Quote and estimate tracking",
        "Accounts receivable reporting",
      ],
    },
    {
      title: "Scheduling & Coordination",
      services: [
        "Appointment and job scheduling",
        "Confirmation and reminder messages",
        "Reschedule and cancellation handling",
        "Post-completion follow-up and review requests",
      ],
    },
    {
      title: "Records & Reporting",
      services: [
        "Document organization and filing",
        "Contract and renewal tracking",
        "Weekly and monthly operational reporting",
      ],
    },
  ];

  return (
    <div style={styles.page}>
      {/* Nav */}
      <div
        style={{
          ...styles.navSection,
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: scrolled ? COLORS.white : COLORS.cream,
          borderBottom: scrolled ? `1px solid ${COLORS.divider}` : "1px solid transparent",
          transition: "all 0.3s ease",
        }}
      >
        <nav style={styles.nav}>
          <div style={styles.logo}>Abscondata</div>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" style={styles.navCta}>
            Schedule a Call
          </a>
        </nav>
      </div>

      {/* Hero */}
      <header style={styles.hero}>
        <h1 style={styles.heroHeading}>
          Your back office,
          <br />
          handled.
        </h1>
        <p style={styles.heroSub}>
          Abscondata manages the operational work that keeps service businesses running —
          invoicing, scheduling, records, reporting — so owners can focus on the work that
          earns revenue.
        </p>
        <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" style={styles.ctaButton}>
          Schedule a Consultation
        </a>
      </header>

      <div style={styles.dividerLine} />

      {/* How It Works */}
      <div style={styles.processSection}>
        <div style={{ ...styles.section }}>
          <div style={styles.sectionLabel}>How It Works</div>
          <div style={styles.sectionHeading}>Operational support without the overhead</div>
          <p style={styles.sectionBody}>
            No office space. No payroll. No training. No turnover.
            Abscondata operates inside your existing tools and systems on a fixed monthly rate.
          </p>
          <div style={styles.processSteps}>
            <div>
              <div style={styles.stepNumber}>01</div>
              <div style={styles.stepTitle}>Consultation</div>
              <div style={styles.stepBody}>
                A short call to understand your operations, current tools, and where
                time is being lost. We determine scope and fit before anything starts.
              </div>
            </div>
            <div>
              <div style={styles.stepNumber}>02</div>
              <div style={styles.stepTitle}>Onboarding</div>
              <div style={styles.stepBody}>
                We map your workflows, access your existing systems, and build the
                operating procedures specific to your business. Services begin within one week.
              </div>
            </div>
            <div>
              <div style={styles.stepNumber}>03</div>
              <div style={styles.stepTitle}>Execution</div>
              <div style={styles.stepBody}>
                Recurring tasks are handled on a fixed weekly schedule. You receive a
                summary report showing exactly what was completed and what needs your attention.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.dividerLine} />

      {/* Services */}
      <div style={styles.section}>
        <div style={styles.sectionLabel}>Services</div>
        <div style={styles.sectionHeading}>Three modules. Engaged individually or combined.</div>
        <p style={styles.sectionBody}>
          Each module covers a defined set of recurring operational tasks.
          Scope is fixed at the start of every engagement — no ambiguity about what's included.
        </p>
        <div style={styles.modulesGrid}>
          {modules.map((m, i) => (
            <Module key={i} title={m.title} services={m.services} isLast={i === modules.length - 1} />
          ))}
        </div>
      </div>

      <div style={styles.dividerLine} />

      {/* Terms */}
      <div style={styles.processSection}>
        <div style={styles.section}>
          <div style={styles.sectionLabel}>Engagement Terms</div>
          <div style={styles.sectionHeading}>Simple terms. No lock-in.</div>
          <div style={styles.termsGrid}>
            <div style={styles.termItem}>
              <div style={styles.termLabel}>Pricing</div>
              <div style={styles.termValue}>
                Flat monthly rate determined during consultation. Based on scope, not hours.
                No surprise invoices.
              </div>
            </div>
            <div style={styles.termItem}>
              <div style={styles.termLabel}>Commitment</div>
              <div style={styles.termValue}>
                Month-to-month. Cancel with 30 days written notice.
                No long-term contracts required.
              </div>
            </div>
            <div style={styles.termItem}>
              <div style={styles.termLabel}>Onboarding</div>
              <div style={styles.termValue}>
                Services begin within one week of signed agreement. Onboarding includes
                system access, workflow mapping, and procedure documentation.
              </div>
            </div>
            <div style={styles.termItem}>
              <div style={styles.termLabel}>Reporting</div>
              <div style={styles.termValue}>
                Weekly summary of completed tasks and flagged items.
                Full transparency on what's being done and what needs owner input.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA / Clients */}
      <div style={styles.clientSection}>
        <div style={styles.clientInner}>
          <div style={{ ...styles.sectionLabel, color: COLORS.goldLight }}>Built For</div>
          <div style={styles.clientHeading}>
            Owner-operators spending hours on work
            <br />
            that isn't earning revenue.
          </div>
          <p style={styles.clientBody}>
            Abscondata works with service businesses — trades, construction, facilities,
            home services, health and wellness — where the owner handles operations
            because hiring office staff doesn't make sense yet. If you're running a
            company of one to twenty people and admin work is costing you billable hours,
            this is built for you.
          </p>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" style={styles.ctaButtonLight}>
            Schedule a Consultation
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div>© 2026 Abscondata</div>
        <div style={styles.footerLinks}>
          <a href="mailto:robin@abscondata.com" style={styles.footerLink}>
            robin@abscondata.com
          </a>
          <span>·</span>
          <a href="tel:+17724868112" style={styles.footerLink}>
            (772) 486-8112
          </a>
        </div>
      </footer>
    </div>
  );
}
