import { useState } from "react";

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
  success: "#276749",
};

// Replace with your Formspree form ID after creating one at formspree.io
const FORMSPREE_ID = "YOUR_FORM_ID";
const CALENDLY_URL = "https://calendly.com/abscondata";

const IntakeForm = () => {
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    industry: "",
    industryOther: "",
    employees: "",
    revenue: "",
    jobsPerWeek: "",
    invoicing: "",
    invoicingOther: "",
    scheduling: "",
    schedulingOther: "",
    tools: [],
    toolsOther: "",
    hasAdmin: "",
    painPoints: [],
    adminHours: "",
    lostRevenue: "",
    goal: "",
    goalOther: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const requiredFields = [
    "companyName",
    "contactName",
    "contactEmail",
    "industry",
    "employees",
    "revenue",
    "invoicing",
    "scheduling",
    "hasAdmin",
    "goal",
  ];

  const validate = () => {
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!form[field]) newErrors[field] = true;
    });
    if (form.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
      newErrors.contactEmail = true;
    }
    if (form.industry === "Other" && !form.industryOther) newErrors.industryOther = true;
    if (form.invoicing === "Other" && !form.invoicingOther) newErrors.invoicingOther = true;
    if (form.scheduling === "Other" && !form.schedulingOther) newErrors.schedulingOther = true;
    if (form.goal === "Other" && !form.goalOther) newErrors.goalOther = true;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstError = document.querySelector('[data-error="true"]');
      if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setStatus("submitting");

    const payload = {
      "Company Name": form.companyName,
      "Contact Name": form.contactName,
      "Email": form.contactEmail,
      "Phone": form.contactPhone || "Not provided",
      "Industry": form.industry === "Other" ? form.industryOther : form.industry,
      "Employees": form.employees,
      "Annual Revenue": form.revenue,
      "Jobs Per Week": form.jobsPerWeek || "Not specified",
      "Invoicing Method": form.invoicing === "Other" ? form.invoicingOther : form.invoicing,
      "Scheduling Method": form.scheduling === "Other" ? form.schedulingOther : form.scheduling,
      "Tools Used": form.tools.length ? form.tools.join(", ") + (form.toolsOther ? `, ${form.toolsOther}` : "") : form.toolsOther || "None specified",
      "Has Admin Help": form.hasAdmin,
      "Pain Points": form.painPoints.length ? form.painPoints.join(", ") : "None selected",
      "Admin Hours Per Week": form.adminHours || "Not specified",
      "Lost Revenue From Admin": form.lostRevenue || "Not specified",
      "Primary Goal": form.goal === "Other" ? form.goalOther : form.goal,
      "Additional Notes": form.notes || "None",
      "_subject": `Consultation Request — ${form.companyName}`,
    };

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
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

  const toggleArray = (field, value) => {
    const arr = form[field];
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    setForm({ ...form, [field]: next });
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
      fontWeight: 500,
      color: COLORS.navy,
      textDecoration: "none",
      letterSpacing: "1.5px",
      textTransform: "uppercase",
    },
    navBar: {
      backgroundColor: COLORS.white,
      borderBottom: `1px solid ${COLORS.divider}`,
    },
    header: {
      maxWidth: "680px",
      margin: "0 auto",
      padding: "80px 48px 40px",
      textAlign: "center",
    },
    heading: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: "42px",
      fontWeight: 500,
      color: COLORS.navy,
      lineHeight: 1.2,
      marginBottom: "20px",
    },
    subhead: {
      fontSize: "16px",
      color: COLORS.warmGray,
      lineHeight: 1.8,
      fontWeight: 300,
      maxWidth: "520px",
      margin: "0 auto",
    },
    formWrap: {
      maxWidth: "640px",
      margin: "0 auto",
      padding: "40px 48px 100px",
    },
    section: { marginBottom: "56px" },
    sectionLabel: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "11px",
      fontWeight: 500,
      letterSpacing: "3px",
      textTransform: "uppercase",
      color: COLORS.gold,
      marginBottom: "32px",
    },
    divider: {
      width: "60px",
      height: "1px",
      backgroundColor: COLORS.gold,
      margin: "0 auto 56px",
    },
    fieldGroup: { marginBottom: "28px" },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: 500,
      color: COLORS.navy,
      marginBottom: "8px",
      letterSpacing: "0.2px",
    },
    required: { color: COLORS.gold, marginLeft: "4px" },
    input: {
      width: "100%",
      padding: "14px 16px",
      fontSize: "15px",
      fontFamily: "'DM Sans', sans-serif",
      color: COLORS.charcoal,
      backgroundColor: COLORS.white,
      border: `1px solid ${COLORS.divider}`,
      borderRadius: "4px",
      outline: "none",
      transition: "border-color 0.2s ease",
      boxSizing: "border-box",
    },
    inputError: { borderColor: COLORS.error, backgroundColor: COLORS.errorLight },
    select: {
      width: "100%",
      padding: "14px 16px",
      fontSize: "15px",
      fontFamily: "'DM Sans', sans-serif",
      color: COLORS.charcoal,
      backgroundColor: COLORS.white,
      border: `1px solid ${COLORS.divider}`,
      borderRadius: "4px",
      outline: "none",
      appearance: "none",
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%236B6560' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 16px center",
      cursor: "pointer",
      boxSizing: "border-box",
    },
    radioGroup: { display: "flex", flexDirection: "column", gap: "10px" },
    radioOption: (selected) => ({
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "14px 16px",
      backgroundColor: selected ? COLORS.white : "transparent",
      border: `1px solid ${selected ? COLORS.navy : COLORS.divider}`,
      borderRadius: "4px",
      cursor: "pointer",
      transition: "all 0.2s ease",
    }),
    radioDot: (selected) => ({
      width: "18px",
      height: "18px",
      borderRadius: "50%",
      border: `2px solid ${selected ? COLORS.navy : COLORS.divider}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }),
    radioDotInner: {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      backgroundColor: COLORS.navy,
    },
    radioText: { fontSize: "14px", color: COLORS.charcoal, fontWeight: 400 },
    checkGroup: { display: "grid", gap: "10px" },
    checkOption: (selected) => ({
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "14px 16px",
      backgroundColor: selected ? COLORS.white : "transparent",
      border: `1px solid ${selected ? COLORS.navy : COLORS.divider}`,
      borderRadius: "4px",
      cursor: "pointer",
      transition: "all 0.2s ease",
    }),
    checkBox: (selected) => ({
      width: "18px",
      height: "18px",
      borderRadius: "3px",
      border: `2px solid ${selected ? COLORS.navy : COLORS.divider}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      backgroundColor: selected ? COLORS.navy : "transparent",
    }),
    checkMark: { color: COLORS.white, fontSize: "11px", fontWeight: 700, lineHeight: 1 },
    textarea: {
      width: "100%",
      padding: "14px 16px",
      fontSize: "15px",
      fontFamily: "'DM Sans', sans-serif",
      color: COLORS.charcoal,
      backgroundColor: COLORS.white,
      border: `1px solid ${COLORS.divider}`,
      borderRadius: "4px",
      outline: "none",
      resize: "vertical",
      minHeight: "100px",
      boxSizing: "border-box",
    },
    submitBtn: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: "2px",
      textTransform: "uppercase",
      color: COLORS.white,
      backgroundColor: COLORS.navy,
      padding: "18px 56px",
      border: "none",
      cursor: "pointer",
      width: "100%",
      marginTop: "20px",
      transition: "background-color 0.3s ease",
    },
    submitBtnDisabled: {
      backgroundColor: COLORS.warmGray,
      cursor: "not-allowed",
    },
    errorMsg: { fontSize: "12px", color: COLORS.error, marginTop: "6px", fontWeight: 400 },
    successPage: {
      maxWidth: "600px",
      margin: "0 auto",
      padding: "120px 48px",
      textAlign: "center",
    },
    successCheck: {
      width: "64px",
      height: "64px",
      borderRadius: "50%",
      backgroundColor: COLORS.navy,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 32px",
      fontSize: "28px",
      color: COLORS.white,
    },
    footer: {
      maxWidth: "640px",
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

  const RadioGroup = ({ field, options, error }) => (
    <div>
      <div style={s.radioGroup}>
        {options.map((opt) => (
          <div
            key={opt}
            style={s.radioOption(form[field] === opt)}
            onClick={() => {
              setForm({ ...form, [field]: opt });
              if (errors[field]) setErrors({ ...errors, [field]: false });
            }}
            data-error={errors[field] ? "true" : undefined}
          >
            <div style={s.radioDot(form[field] === opt)}>
              {form[field] === opt && <div style={s.radioDotInner} />}
            </div>
            <span style={s.radioText}>{opt}</span>
          </div>
        ))}
      </div>
      {error && <div style={s.errorMsg}>Please select an option</div>}
    </div>
  );

  const CheckGroup = ({ field, options, columns = 1 }) => (
    <div style={{ ...s.checkGroup, gridTemplateColumns: columns > 1 ? `repeat(${columns}, 1fr)` : "1fr" }}>
      {options.map((opt) => {
        const selected = form[field].includes(opt);
        return (
          <div key={opt} style={s.checkOption(selected)} onClick={() => toggleArray(field, opt)}>
            <div style={s.checkBox(selected)}>
              {selected && <span style={s.checkMark}>✓</span>}
            </div>
            <span style={s.radioText}>{opt}</span>
          </div>
        );
      })}
    </div>
  );

  const Label = ({ text, req }) => (
    <label style={s.label}>
      {text}
      {req && <span style={s.required}>*</span>}
    </label>
  );

  if (status === "success") {
    return (
      <div style={s.page}>
        <div style={s.navBar}>
          <nav style={s.nav}>
            <a href="/" style={s.logo}>Abscondata</a>
          </nav>
        </div>
        <div style={s.successPage}>
          <div style={s.successCheck}>✓</div>
          <h1 style={{ ...s.heading, marginBottom: "24px" }}>Received.</h1>
          <p style={{ ...s.subhead, marginBottom: "16px" }}>
            Your information has been submitted. We'll review everything before your
            consultation so the call is focused and productive.
          </p>
          <p style={{ ...s.subhead, marginBottom: "48px" }}>
            If you haven't booked your consultation yet, schedule one below.
          </p>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...s.submitBtn,
              display: "inline-block",
              width: "auto",
              textDecoration: "none",
              padding: "18px 48px",
            }}
          >
            Schedule a Consultation
          </a>
          <div style={{ marginTop: "20px" }}>
            <a href="/" style={{ color: COLORS.warmGray, fontSize: "14px", textDecoration: "none" }}>
              Return to home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.navBar}>
        <nav style={s.nav}>
          <a href="/" style={s.logo}>Abscondata</a>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" style={s.navLink}>
            Schedule a Call
          </a>
        </nav>
      </div>

      <div style={s.header}>
        <h1 style={s.heading}>Pre-Consultation Questionnaire</h1>
        <p style={s.subhead}>
          Complete this form before your consultation. Your answers help us
          evaluate fit and prepare a relevant scope of work.
        </p>
      </div>

      <div style={s.divider} />

      <div style={s.formWrap}>
        <div style={s.section}>
          <div style={s.sectionLabel}>Business Overview</div>

          <div style={s.fieldGroup}>
            <Label text="Company name" req />
            <input style={{ ...s.input, ...(errors.companyName ? s.inputError : {}) }} value={form.companyName} onChange={set("companyName")} placeholder="e.g., Sunshine Facilities LLC" data-error={errors.companyName ? "true" : undefined} />
            {errors.companyName && <div style={s.errorMsg}>Required</div>}
          </div>

          <div style={s.fieldGroup}>
            <Label text="Your name" req />
            <input style={{ ...s.input, ...(errors.contactName ? s.inputError : {}) }} value={form.contactName} onChange={set("contactName")} placeholder="First and last name" data-error={errors.contactName ? "true" : undefined} />
            {errors.contactName && <div style={s.errorMsg}>Required</div>}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "28px" }}>
            <div>
              <Label text="Email" req />
              <input style={{ ...s.input, ...(errors.contactEmail ? s.inputError : {}) }} value={form.contactEmail} onChange={set("contactEmail")} placeholder="you@company.com" type="email" data-error={errors.contactEmail ? "true" : undefined} />
              {errors.contactEmail && <div style={s.errorMsg}>Valid email required</div>}
            </div>
            <div>
              <Label text="Phone" />
              <input style={s.input} value={form.contactPhone} onChange={set("contactPhone")} placeholder="(555) 555-5555" type="tel" />
            </div>
          </div>

          <div style={s.fieldGroup}>
            <Label text="Industry" req />
            <select
              style={{ ...s.select, ...(errors.industry ? s.inputError : {}), color: form.industry ? COLORS.charcoal : COLORS.warmGray }}
              value={form.industry}
              onChange={set("industry")}
              data-error={errors.industry ? "true" : undefined}
            >
              <option value="" disabled>Select your industry</option>
              <option>General Contracting</option>
              <option>HVAC</option>
              <option>Plumbing</option>
              <option>Electrical</option>
              <option>Landscaping</option>
              <option>Facilities Maintenance</option>
              <option>Commercial Cleaning</option>
              <option>Residential Cleaning</option>
              <option>Roofing</option>
              <option>Painting</option>
              <option>Pest Control</option>
              <option>Pool Service</option>
              <option>Home Inspection</option>
              <option>Health & Wellness</option>
              <option>Professional Services</option>
              <option>Other</option>
            </select>
            {errors.industry && <div style={s.errorMsg}>Required</div>}
            {form.industry === "Other" && (
              <input style={{ ...s.input, marginTop: "10px", ...(errors.industryOther ? s.inputError : {}) }} value={form.industryOther} onChange={set("industryOther")} placeholder="Specify your industry" />
            )}
          </div>

          <div style={s.fieldGroup}>
            <Label text="Number of employees (including yourself)" req />
            <RadioGroup field="employees" options={["Just me", "2–5", "6–10", "11–20", "20+"]} error={errors.employees} />
          </div>

          <div style={s.fieldGroup}>
            <Label text="Approximate annual revenue" req />
            <RadioGroup field="revenue" options={["Under $250K", "$250K – $500K", "$500K – $1M", "$1M – $3M", "$3M+"]} error={errors.revenue} />
          </div>

          <div style={s.fieldGroup}>
            <Label text="Approximate jobs or appointments per week" />
            <input style={s.input} value={form.jobsPerWeek} onChange={set("jobsPerWeek")} placeholder="e.g., 15" />
          </div>
        </div>

        <div style={s.section}>
          <div style={s.sectionLabel}>Current Operations</div>

          <div style={s.fieldGroup}>
            <Label text="How do you currently handle invoicing?" req />
            <RadioGroup field="invoicing" options={["QuickBooks", "FreshBooks", "Wave", "Spreadsheet", "Paper or handwritten", "Don't invoice regularly", "Other"]} error={errors.invoicing} />
            {form.invoicing === "Other" && (
              <input style={{ ...s.input, marginTop: "10px", ...(errors.invoicingOther ? s.inputError : {}) }} value={form.invoicingOther} onChange={set("invoicingOther")} placeholder="Specify" />
            )}
          </div>

          <div style={s.fieldGroup}>
            <Label text="How do customers book or request appointments?" req />
            <RadioGroup field="scheduling" options={["Phone calls", "Text messages", "Email", "Online booking tool", "They don't — I schedule everything", "Other"]} error={errors.scheduling} />
            {form.scheduling === "Other" && (
              <input style={{ ...s.input, marginTop: "10px", ...(errors.schedulingOther ? s.inputError : {}) }} value={form.schedulingOther} onChange={set("schedulingOther")} placeholder="Specify" />
            )}
          </div>

          <div style={s.fieldGroup}>
            <Label text="What tools or software do you currently use?" />
            <CheckGroup field="tools" options={["QuickBooks", "FreshBooks", "Google Workspace", "Microsoft 365", "Jobber", "ServiceTitan", "Housecall Pro", "Square"]} columns={2} />
            <input style={{ ...s.input, marginTop: "10px" }} value={form.toolsOther} onChange={set("toolsOther")} placeholder="Other tools (optional)" />
          </div>

          <div style={s.fieldGroup}>
            <Label text="Do you have anyone helping with admin work?" req />
            <RadioGroup field="hasAdmin" options={["No — I handle everything myself", "Family member helps occasionally", "Part-time employee", "Full-time employee"]} error={errors.hasAdmin} />
          </div>
        </div>

        <div style={s.section}>
          <div style={s.sectionLabel}>Where Time Is Lost</div>

          <div style={s.fieldGroup}>
            <Label text="Which of these take up the most of your time?" />
            <CheckGroup field="painPoints" options={["Invoicing and payment follow-up", "Scheduling and confirmations", "Responding to customer inquiries", "Tracking quotes and estimates", "Organizing documents and records", "Preparing info for accountant"]} />
          </div>

          <div style={s.fieldGroup}>
            <Label text="Hours per week spent on admin work" />
            <select style={{ ...s.select, color: form.adminHours ? COLORS.charcoal : COLORS.warmGray }} value={form.adminHours} onChange={set("adminHours")}>
              <option value="" disabled>Select</option>
              <option>Less than 5 hours</option>
              <option>5–10 hours</option>
              <option>10–20 hours</option>
              <option>20+ hours</option>
              <option>Not sure</option>
            </select>
          </div>

          <div style={s.fieldGroup}>
            <Label text="Have you lost revenue because admin tasks weren't done on time?" />
            <RadioGroup field="lostRevenue" options={["Yes", "No", "Not sure"]} />
          </div>
        </div>

        <div style={s.section}>
          <div style={s.sectionLabel}>Goals</div>

          <div style={s.fieldGroup}>
            <Label text="Primary goal in outsourcing operations" req />
            <RadioGroup field="goal" options={["Free up time for revenue-generating work", "Stop missing invoices and late payments", "Improve scheduling reliability", "Get organized and stop losing track of things", "Other"]} error={errors.goal} />
            {form.goal === "Other" && (
              <input style={{ ...s.input, marginTop: "10px", ...(errors.goalOther ? s.inputError : {}) }} value={form.goalOther} onChange={set("goalOther")} placeholder="Specify your primary goal" />
            )}
          </div>

          <div style={s.fieldGroup}>
            <Label text="Anything else we should know before the consultation?" />
            <textarea style={s.textarea} value={form.notes} onChange={set("notes")} placeholder="Current challenges, specific needs, questions — anything relevant." />
          </div>
        </div>

        {status === "error" && (
          <div style={{ padding: "16px 20px", backgroundColor: COLORS.errorLight, border: `1px solid ${COLORS.error}`, borderRadius: "4px", marginBottom: "20px", fontSize: "14px", color: COLORS.error }}>
            Something went wrong. Please try again or email your responses directly to robin@abscondata.com.
          </div>
        )}

        <button
          style={{ ...s.submitBtn, ...(status === "submitting" ? s.submitBtnDisabled : {}) }}
          onClick={handleSubmit}
          disabled={status === "submitting"}
          onMouseEnter={(e) => { if (status !== "submitting") e.target.style.backgroundColor = COLORS.navyLight; }}
          onMouseLeave={(e) => { if (status !== "submitting") e.target.style.backgroundColor = COLORS.navy; }}
        >
          {status === "submitting" ? "Submitting..." : "Submit Questionnaire"}
        </button>
      </div>

      <footer style={s.footer}>
        <div>© 2026 Abscondata</div>
        <a href="mailto:robin@abscondata.com" style={{ color: COLORS.warmGray, textDecoration: "none" }}>robin@abscondata.com</a>
      </footer>
    </div>
  );
};

export default IntakeForm;
