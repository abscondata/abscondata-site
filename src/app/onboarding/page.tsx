"use client";

import { useState } from "react";
import Link from "next/link";
import { submitOnboarding } from "./actions";

const SERVICE_OPTIONS = [
  { key: "invoice_ops", label: "Invoice Operations", desc: "Invoice creation, tracking, and status management" },
  { key: "payment_followup", label: "Payment Follow-Up", desc: "Overdue account follow-up and collections support" },
  { key: "review_requests", label: "Review Requests", desc: "Post-service review request queueing and tracking" },
  { key: "weekly_summary", label: "Weekly Business Summary", desc: "Management reporting across all services" },
  { key: "lead_intake", label: "Lead & Intake Admin", desc: "New inquiry response and intake processing" },
];

const PLATFORM_OPTIONS = [
  { key: "quickbooks", label: "QuickBooks" },
  { key: "jobber", label: "Jobber" },
  { key: "servicetitan", label: "ServiceTitan" },
  { key: "housecall_pro", label: "Housecall Pro" },
  { key: "google_workspace", label: "Google Workspace" },
  { key: "outlook_365", label: "Outlook / Office 365" },
  { key: "other", label: "Other" },
];

const ACCESS_METHODS = [
  { value: "share_credentials", label: "I'll share login credentials" },
  { value: "create_account", label: "I'll create a user account for you" },
  { value: "discuss", label: "Let's discuss on a call" },
];

export default function OnboardingPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [company, setCompany] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [industry, setIndustry] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [platformAccess, setPlatformAccess] = useState<Record<string, string>>({});
  const [otherPlatform, setOtherPlatform] = useState("");
  const [notes, setNotes] = useState("");

  function toggleService(key: string) {
    setSelectedServices((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  }

  function togglePlatform(key: string) {
    setSelectedPlatforms((prev) => {
      if (prev.includes(key)) {
        const next = prev.filter((p) => p !== key);
        const accessCopy = { ...platformAccess };
        delete accessCopy[key];
        setPlatformAccess(accessCopy);
        return next;
      }
      return [...prev, key];
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const payload = {
      company,
      contact_name: contactName,
      email,
      phone,
      industry,
      employee_count: employeeCount,
      service_area: serviceArea,
      services: selectedServices,
      platforms: selectedPlatforms.map((key) => ({
        key,
        access_method: platformAccess[key] || "pending",
        ...(key === "other" ? { name: otherPlatform } : {}),
      })),
      notes,
    };

    try {
      await submitOnboarding(payload);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-6">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-medium text-[#1B2A4A]">Thank you</h1>
          <p className="mt-4 text-base font-light leading-relaxed text-[#6B6560]">
            We&apos;ll review your submission and reach out within 24 hours.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block text-sm text-[#6B6560] underline underline-offset-4 hover:text-[var(--text)]"
          >
            Back to homepage
          </Link>
        </div>
      </div>
    );
  }

  const inputClasses =
    "w-full rounded-sm border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] placeholder-[#6B6560]/50 focus:border-[#1B2A4A] focus:outline-none";

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Nav */}
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-7">
        <Link href="/" className="text-xl font-semibold tracking-tight text-[#1B2A4A]">
          Abscondata
        </Link>
        <Link href="/login" className="text-sm text-[#6B6560] hover:text-[var(--text)]">
          Sign In
        </Link>
      </nav>

      <div className="mx-auto max-w-2xl px-6 pb-24 pt-12">
        <h1 className="text-3xl font-medium text-[#1B2A4A]">Start Onboarding</h1>
        <p className="mt-3 text-base font-light text-[#6B6560]">
          Tell us about your business and what you need handled. We&apos;ll review and reach out within 24 hours.
        </p>

        {error && (
          <div className="mt-6 rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-10 space-y-12">
          {/* Section 1: Business Info */}
          <fieldset>
            <legend className="mb-6 text-[11px] font-medium uppercase tracking-[0.25em] text-[#B8956A]">
              Business Information
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-[var(--text)]">Company Name *</label>
                <input required value={company} onChange={(e) => setCompany(e.target.value)} className={inputClasses} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--text)]">Contact Name *</label>
                <input required value={contactName} onChange={(e) => setContactName(e.target.value)} className={inputClasses} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--text)]">Email *</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--text)]">Phone</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClasses} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--text)]">Business Type / Industry</label>
                <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. HVAC, plumbing, facilities" className={inputClasses} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--text)]">Approximate Employee Count</label>
                <input value={employeeCount} onChange={(e) => setEmployeeCount(e.target.value)} placeholder="e.g. 5-10" className={inputClasses} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--text)]">Service Area / Location</label>
                <input value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} placeholder="e.g. South Florida" className={inputClasses} />
              </div>
            </div>
          </fieldset>

          {/* Section 2: Services */}
          <fieldset>
            <legend className="mb-6 text-[11px] font-medium uppercase tracking-[0.25em] text-[#B8956A]">
              Select Services
            </legend>
            <div className="space-y-3">
              {SERVICE_OPTIONS.map((s) => (
                <label key={s.key} className="flex cursor-pointer items-start gap-3 rounded-sm border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-[#1B2A4A]/30">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(s.key)}
                    onChange={() => toggleService(s.key)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#1B2A4A]"
                  />
                  <div>
                    <span className="text-sm font-medium text-[var(--text)]">{s.label}</span>
                    <p className="mt-0.5 text-xs text-[#6B6560]">{s.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Section 3: Platforms */}
          <fieldset>
            <legend className="mb-6 text-[11px] font-medium uppercase tracking-[0.25em] text-[#B8956A]">
              Your Current Tools
            </legend>
            <div className="space-y-3">
              {PLATFORM_OPTIONS.map((p) => (
                <div key={p.key}>
                  <label className="flex cursor-pointer items-center gap-3 rounded-sm border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-[#1B2A4A]/30">
                    <input
                      type="checkbox"
                      checked={selectedPlatforms.includes(p.key)}
                      onChange={() => togglePlatform(p.key)}
                      className="h-4 w-4 shrink-0 accent-[#1B2A4A]"
                    />
                    <span className="text-sm font-medium text-[var(--text)]">{p.label}</span>
                  </label>
                  {selectedPlatforms.includes(p.key) && (
                    <div className="ml-7 mt-2 space-y-2">
                      {p.key === "other" && (
                        <input
                          value={otherPlatform}
                          onChange={(e) => setOtherPlatform(e.target.value)}
                          placeholder="Platform name"
                          className={inputClasses}
                        />
                      )}
                      <select
                        value={platformAccess[p.key] || ""}
                        onChange={(e) => setPlatformAccess({ ...platformAccess, [p.key]: e.target.value })}
                        className={inputClasses}
                      >
                        <option value="">How should we get access?</option>
                        {ACCESS_METHODS.map((m) => (
                          <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </fieldset>

          {/* Section 4: Notes */}
          <fieldset>
            <legend className="mb-6 text-[11px] font-medium uppercase tracking-[0.25em] text-[#B8956A]">
              Additional Notes
            </legend>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Anything else we should know? Special requirements, current pain points, preferred schedule?"
              className={inputClasses}
            />
          </fieldset>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#1B2A4A] px-6 py-3 text-sm font-medium uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#2a3d66] disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
