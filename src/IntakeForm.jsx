import { useState } from "react";
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
  error: "#9B2C2C",
  errorLight: "#FFF5F5",
};

const FORMSPREE_ID = "xvzvoqgp";
const CALENDLY_URL = "https://calendly.com/abscondata";

const IntakeForm = () => {
  const [form, setForm] = useState({
    companyName: "",
    ownerName: "",
    email: "",
    phone: "",
    serviceType: "",
    employees: "",
    currentTasks: "",
    painPoint: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const validate = () => {
    const newErrors = {};
    if (!form.companyName.trim()) newErrors.companyName = true;
    if (!form.ownerName.trim()) newErrors.ownerName = true;
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = true;
    if (!form.serviceType.trim()) newErrors.serviceType = true;
    if (!form.employees) newErrors.employees = true;
    if (!form.currentTasks.trim()) newErrors.currentTasks = true;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const el = document.querySelector('[data-error="true"]');
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setStatus("submitting");

    const payload = {
      "Company Name": form.companyName,
      "Owner Name": form.ownerName,
      Email: form.email,
      Phone: form.phone || "Not provided",
      "Type of Service Business": form.serviceType,
      "Number of Employees": form.employees,
      "Back-Office Tasks Currently Handled In-House": form.currentTasks,
      "Biggest Operational Pain Point": form.painPoint || "Not specified",
      _subject: `Intake — ${form.companyName}`,
    };

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus("success");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const set = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: false });
  };

  if (status === "success") {
    return (
      <div style={s.page}>
        <div style={s.navBar}>
          <nav style={s.nav}>
            <Link to="/" style={s.logo}>
              Abscondata
            </Link>
          </nav>
        </div>
        <div style={s.successPage}>
          <div style={s.successMark}>Received</div>
          <h1 style={{ ...s.heading, marginBottom: "24px" }}>
            Thank you.
          </h1>
          <p style={s.subhead}>
            Your information has been submitted. We will review everything
            and be in touch within one business day to discuss next steps.
          </p>
          <p
            style={{
              ...s.subhead,
              marginTop: "16px",
              marginBottom: "48px",
            }}
          >
            If you'd like to schedule a consultation now, you can do so
            below.
          </p>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={s.submitBtn}
            >
              Schedule a Consultation
            </a>
            <Link
              to="/"
              style={{
                color: COLORS.warmGray,
                fontSize: "14px",
                textDecoration: "none",
                fontWeight: 300,
              }}
            >
              Return to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.navBar}>
        <nav style={s.nav}>
          <Link to="/" style={s.logo}>
            Abscondata
          </Link>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={s.navLink}
          >
            Schedule a Call
          </a>
        </nav>
      </div>

      <div style={s.header}>
        <p style={s.headerLabel}>Client Intake</p>
        <h1 style={s.heading}>Tell us about your business.</h1>
        <p style={s.subhead}>
          This brief questionnaire helps us understand your operations and
          prepare a relevant scope of work. It should take about two minutes.
        </p>
      </div>

      <div style={s.divider} />

      <div style={s.formWrap}>
        {/* Company & Contact */}
        <div style={s.fieldGroup}>
          <label style={s.label}>
            Company name<span style={s.required}>*</span>
          </label>
          <input
            style={{
              ...s.input,
              ...(errors.companyName ? s.inputError : {}),
            }}
            value={form.companyName}
            onChange={set("companyName")}
            data-error={errors.companyName ? "true" : undefined}
          />
          {errors.companyName && (
            <div style={s.errorMsg}>Required</div>
          )}
        </div>

        <div style={s.fieldGroup}>
          <label style={s.label}>
            Your name<span style={s.required}>*</span>
          </label>
          <input
            style={{
              ...s.input,
              ...(errors.ownerName ? s.inputError : {}),
            }}
            value={form.ownerName}
            onChange={set("ownerName")}
            data-error={errors.ownerName ? "true" : undefined}
          />
          {errors.ownerName && (
            <div style={s.errorMsg}>Required</div>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "36px",
          }}
        >
          <div>
            <label style={s.label}>
              Email<span style={s.required}>*</span>
            </label>
            <input
              style={{
                ...s.input,
                ...(errors.email ? s.inputError : {}),
              }}
              type="email"
              value={form.email}
              onChange={set("email")}
              data-error={errors.email ? "true" : undefined}
            />
            {errors.email && (
              <div style={s.errorMsg}>Valid email required</div>
            )}
          </div>
          <div>
            <label style={s.label}>Phone</label>
            <input
              style={s.input}
              type="tel"
              value={form.phone}
              onChange={set("phone")}
              placeholder="(555) 555-5555"
            />
          </div>
        </div>

        <div style={s.sectionDivider} />

        {/* Business Details */}
        <div style={s.fieldGroup}>
          <label style={s.label}>
            Type of service business<span style={s.required}>*</span>
          </label>
          <p style={s.fieldHint}>
            e.g., HVAC, general contracting, commercial cleaning, landscaping
          </p>
          <input
            style={{
              ...s.input,
              ...(errors.serviceType ? s.inputError : {}),
            }}
            value={form.serviceType}
            onChange={set("serviceType")}
            data-error={errors.serviceType ? "true" : undefined}
          />
          {errors.serviceType && (
            <div style={s.errorMsg}>Required</div>
          )}
        </div>

        <div style={s.fieldGroup}>
          <label style={s.label}>
            Number of employees<span style={s.required}>*</span>
          </label>
          <div style={s.radioGroup}>
            {["Just me", "2-5", "6-10", "11-20", "20+"].map((opt) => (
              <div
                key={opt}
                style={s.radioOption(form.employees === opt)}
                onClick={() => {
                  setForm({ ...form, employees: opt });
                  if (errors.employees)
                    setErrors({ ...errors, employees: false });
                }}
                data-error={errors.employees ? "true" : undefined}
              >
                <div style={s.radioDot(form.employees === opt)}>
                  {form.employees === opt && (
                    <div style={s.radioDotInner} />
                  )}
                </div>
                <span style={s.radioText}>{opt}</span>
              </div>
            ))}
          </div>
          {errors.employees && (
            <div style={s.errorMsg}>Please select an option</div>
          )}
        </div>

        <div style={s.sectionDivider} />

        {/* Operations */}
        <div style={s.fieldGroup}>
          <label style={s.label}>
            What back-office tasks do you currently handle yourself?
            <span style={s.required}>*</span>
          </label>
          <p style={s.fieldHint}>
            Invoicing, scheduling, payment collection, document management,
            reporting, etc.
          </p>
          <textarea
            style={{
              ...s.textarea,
              ...(errors.currentTasks ? s.inputError : {}),
            }}
            value={form.currentTasks}
            onChange={set("currentTasks")}
            data-error={errors.currentTasks ? "true" : undefined}
          />
          {errors.currentTasks && (
            <div style={s.errorMsg}>Required</div>
          )}
        </div>

        <div style={{ marginBottom: "48px" }}>
          <label style={s.label}>
            Biggest operational pain point
          </label>
          <p style={s.fieldHint}>
            What's the one thing that costs you the most time or money?
          </p>
          <textarea
            style={s.textarea}
            value={form.painPoint}
            onChange={set("painPoint")}
          />
        </div>

        {status === "error" && (
          <div style={s.errorBanner}>
            Something went wrong. Please try again or email us directly at{" "}
            <a
              href="mailto:robin@abscondata.com"
              style={{ color: COLORS.error }}
            >
              robin@abscondata.com
            </a>
            .
          </div>
        )}

        <button
          style={{
            ...s.submitBtn,
            ...(status === "submitting" ? s.submitBtnDisabled : {}),
          }}
          onClick={handleSubmit}
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Submitting..." : "Submit"}
        </button>
      </div>

      <footer style={s.footer}>
        <div>© 2026 Abscondata</div>
        <a
          href="mailto:robin@abscondata.com"
          style={{ color: COLORS.warmGray, textDecoration: "none" }}
        >
          robin@abscondata.com
        </a>
      </footer>
    </div>
  );
};

const s = {
  page: {
    fontFamily: "'DM Sans', sans-serif",
    backgroundColor: COLORS.cream,
    color: COLORS.charcoal,
    minHeight: "100vh",
    lineHeight: 1.7,
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
    textDecoration: "none",
  },
  navLink: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    fontWeight: 400,
    color: COLORS.warmGray,
    textDecoration: "none",
    letterSpacing: "0.5px",
  },
  navBar: {
    backgroundColor: COLORS.white,
    borderBottom: `1px solid ${COLORS.divider}`,
  },
  header: {
    maxWidth: "640px",
    margin: "0 auto",
    padding: "80px 48px 40px",
    textAlign: "center",
  },
  headerLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: COLORS.gold,
    marginBottom: "20px",
  },
  heading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "40px",
    fontWeight: 500,
    color: COLORS.navy,
    lineHeight: 1.2,
    marginBottom: "20px",
  },
  subhead: {
    fontSize: "15px",
    color: COLORS.warmGray,
    lineHeight: 1.85,
    fontWeight: 300,
    maxWidth: "480px",
    margin: "0 auto",
  },
  divider: {
    width: "60px",
    height: "1px",
    backgroundColor: COLORS.gold,
    margin: "0 auto 0",
  },
  formWrap: {
    maxWidth: "560px",
    margin: "0 auto",
    padding: "56px 48px 100px",
  },
  fieldGroup: {
    marginBottom: "36px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: 500,
    color: COLORS.navy,
    marginBottom: "8px",
    letterSpacing: "0.2px",
  },
  required: {
    color: COLORS.gold,
    marginLeft: "4px",
  },
  fieldHint: {
    fontSize: "13px",
    color: COLORS.warmGray,
    fontWeight: 300,
    marginBottom: "10px",
    lineHeight: 1.5,
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    fontSize: "15px",
    fontFamily: "'DM Sans', sans-serif",
    color: COLORS.charcoal,
    backgroundColor: COLORS.white,
    border: `1px solid ${COLORS.divider}`,
    borderRadius: "2px",
    outline: "none",
    transition: "border-color 0.2s ease",
    boxSizing: "border-box",
  },
  inputError: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.errorLight,
  },
  textarea: {
    width: "100%",
    padding: "14px 16px",
    fontSize: "15px",
    fontFamily: "'DM Sans', sans-serif",
    color: COLORS.charcoal,
    backgroundColor: COLORS.white,
    border: `1px solid ${COLORS.divider}`,
    borderRadius: "2px",
    outline: "none",
    resize: "vertical",
    minHeight: "100px",
    boxSizing: "border-box",
  },
  radioGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  radioOption: (selected) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 18px",
    backgroundColor: selected ? COLORS.white : "transparent",
    border: `1px solid ${selected ? COLORS.navy : COLORS.divider}`,
    borderRadius: "2px",
    cursor: "pointer",
    transition: "border-color 0.2s ease",
  }),
  radioDot: (selected) => ({
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    border: `2px solid ${selected ? COLORS.navy : COLORS.divider}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  }),
  radioDotInner: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    backgroundColor: COLORS.navy,
  },
  radioText: {
    fontSize: "14px",
    color: COLORS.charcoal,
    fontWeight: 400,
  },
  sectionDivider: {
    width: "100%",
    height: "1px",
    backgroundColor: COLORS.divider,
    margin: "12px 0 40px",
  },
  submitBtn: {
    display: "inline-block",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: COLORS.white,
    backgroundColor: COLORS.navy,
    padding: "16px 48px",
    border: "none",
    cursor: "pointer",
    width: "100%",
    textAlign: "center",
    textDecoration: "none",
    boxSizing: "border-box",
  },
  submitBtnDisabled: {
    backgroundColor: COLORS.warmGray,
    cursor: "not-allowed",
  },
  errorMsg: {
    fontSize: "12px",
    color: COLORS.error,
    marginTop: "6px",
    fontWeight: 400,
  },
  errorBanner: {
    padding: "16px 20px",
    backgroundColor: COLORS.errorLight,
    border: `1px solid ${COLORS.error}`,
    borderRadius: "2px",
    marginBottom: "20px",
    fontSize: "14px",
    color: COLORS.error,
    lineHeight: 1.6,
  },
  successPage: {
    maxWidth: "520px",
    margin: "0 auto",
    padding: "120px 48px",
    textAlign: "center",
  },
  successMark: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: COLORS.gold,
    marginBottom: "24px",
  },
  footer: {
    maxWidth: "560px",
    margin: "0 auto",
    padding: "40px 48px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13px",
    color: COLORS.warmGray,
    fontWeight: 300,
  },
};

export default IntakeForm;
