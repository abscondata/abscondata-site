"use client";

import { useState } from "react";
import { createClientManual } from "./actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "../../components/toast";

const SERVICE_OPTIONS = [
  { key: "invoice_ops", label: "Invoice Operations", desc: "We send invoices to your customers from your tools" },
  { key: "payment_followup", label: "Payment Follow-Up", desc: "We chase overdue invoices on a schedule" },
  { key: "review_requests", label: "Review Requests", desc: "We ask happy customers for Google reviews" },
  { key: "lead_intake", label: "Lead & Intake Admin", desc: "We respond to new leads within 1 hour" },
  { key: "weekly_summary", label: "Weekly Summary", desc: "Weekly report of everything we did" },
];

const PLATFORM_OPTIONS = [
  { key: "quickbooks", label: "QuickBooks" },
  { key: "xero", label: "Xero" },
  { key: "freshbooks", label: "FreshBooks" },
  { key: "jobber", label: "Jobber" },
  { key: "housecall_pro", label: "Housecall Pro" },
  { key: "servicetitan", label: "ServiceTitan" },
  { key: "google_workspace", label: "Google Business Profile" },
  { key: "yelp", label: "Yelp" },
];

interface PlatformEntry { key: string; label: string; url: string }

export default function NewClientPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  // Step 1
  const [name, setName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [industry, setIndustry] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [notes, setNotes] = useState("");

  // Step 2
  const [services, setServices] = useState<string[]>([]);

  // Step 3
  const [platforms, setPlatforms] = useState<PlatformEntry[]>([]);
  const [customPlatform, setCustomPlatform] = useState("");

  function toggleService(key: string) {
    setServices((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
  }

  function togglePlatform(key: string, label: string) {
    setPlatforms((prev) => {
      const exists = prev.find((p) => p.key === key);
      if (exists) return prev.filter((p) => p.key !== key);
      return [...prev, { key, label, url: "" }];
    });
  }

  function setPlatformUrl(key: string, url: string) {
    setPlatforms((prev) => prev.map((p) => p.key === key ? { ...p, url } : p));
  }

  function addCustomPlatform() {
    if (!customPlatform.trim()) return;
    const key = customPlatform.toLowerCase().replace(/\s+/g, "_");
    if (!platforms.find((p) => p.key === key)) {
      setPlatforms((prev) => [...prev, { key, label: customPlatform.trim(), url: "" }]);
    }
    setCustomPlatform("");
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const step1Valid = name.length >= 2 && EMAIL_RE.test(email);
  const step2Valid = services.length > 0;

  async function handleSubmit() {
    setError("");
    setLoading(true);
    try {
      const result = await createClientManual({
        name, contact_name: contactName, email, phone,
        industry, employee_count: employeeCount, service_area: serviceArea,
        notes, services, platforms: platforms.map((p) => ({ key: p.key, url: p.url })),
      });
      if (result.success && result.clientId) {
        toast("Client created", "success");
        router.push(`/dashboard/clients/${result.clientId}`);
      } else {
        setError(result.message);
        setLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create client");
      setLoading(false);
    }
  }

  const inputClasses = "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none";

  return (
    <div>
      <Link href="/dashboard/clients" className="text-xs text-zinc-400 hover:text-zinc-700">
        &larr; Back to Clients
      </Link>
      <h2 className="mt-3 text-lg font-semibold text-zinc-900">Add Client</h2>

      {/* Progress */}
      <div className="mt-4 mb-6 flex items-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
              step === s ? "bg-zinc-900 text-white" : step > s ? "bg-emerald-500 text-white" : "bg-zinc-200 text-zinc-500"
            }`}>{step > s ? "✓" : s}</span>
            <span className={`text-xs font-medium ${step === s ? "text-zinc-900" : "text-zinc-400"}`}>
              {s === 1 ? "Info" : s === 2 ? "Services" : s === 3 ? "Platforms" : "Review"}
            </span>
            {s < 4 && <span className="mx-1 h-px w-6 bg-zinc-200" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{error}</div>
      )}

      {/* Step 1: Business Info */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Business Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-zinc-700">Company Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputClasses} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-700">Contact Name</label>
              <input value={contactName} onChange={(e) => setContactName(e.target.value)} className={inputClasses} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-700">Email *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-700">Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClasses} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-700">Industry</label>
              <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. HVAC, plumbing" className={inputClasses} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-700">Employee Count</label>
              <input value={employeeCount} onChange={(e) => setEmployeeCount(e.target.value)} placeholder="e.g. 5-10" className={inputClasses} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-700">Service Area</label>
              <input value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} placeholder="e.g. South Florida" className={inputClasses} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-zinc-700">Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={inputClasses} />
            </div>
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!step1Valid}
            className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
          >
            Next: Services
          </button>
        </div>
      )}

      {/* Step 2: Services */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Select Services *</h3>
          <div className="space-y-2">
            {SERVICE_OPTIONS.map((s) => (
              <label key={s.key} className={`flex cursor-pointer items-start gap-3 rounded-lg border bg-white px-4 py-3 transition-colors ${services.includes(s.key) ? "border-zinc-400" : "border-zinc-200 hover:border-zinc-300"}`}>
                <input type="checkbox" checked={services.includes(s.key)} onChange={() => toggleService(s.key)} className="mt-0.5 h-4 w-4 accent-zinc-900" />
                <div>
                  <span className="text-sm font-medium text-zinc-900">{s.label}</span>
                  <p className="text-xs text-zinc-500">{s.desc}</p>
                </div>
              </label>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setStep(1)} className="text-xs text-zinc-400 hover:text-zinc-700">Back</button>
            <button
              onClick={() => setStep(3)}
              disabled={!step2Valid}
              className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
            >
              Next: Platforms
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Platforms */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Platforms (optional)</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {PLATFORM_OPTIONS.map((p) => {
              const selected = platforms.find((x) => x.key === p.key);
              return (
                <div key={p.key} className={`rounded-lg border bg-white px-4 py-3 transition-colors ${selected ? "border-zinc-400" : "border-zinc-200"}`}>
                  <label className="flex cursor-pointer items-center gap-3">
                    <input type="checkbox" checked={!!selected} onChange={() => togglePlatform(p.key, p.label)} className="h-4 w-4 accent-zinc-900" />
                    <span className="text-sm font-medium text-zinc-900">{p.label}</span>
                  </label>
                  {selected && (
                    <input
                      value={selected.url}
                      onChange={(e) => setPlatformUrl(p.key, e.target.value)}
                      placeholder="Login URL (optional)"
                      className="mt-2 w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-700 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <input
              value={customPlatform}
              onChange={(e) => setCustomPlatform(e.target.value)}
              placeholder="Other platform name..."
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomPlatform(); } }}
            />
            <button onClick={addCustomPlatform} disabled={!customPlatform.trim()} className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 transition-colors">Add</button>
          </div>
          {/* Show custom platforms */}
          {platforms.filter((p) => !PLATFORM_OPTIONS.find((o) => o.key === p.key)).map((p) => (
            <div key={p.key} className="flex items-center gap-3 rounded-lg border border-zinc-400 bg-white px-4 py-3">
              <span className="text-sm font-medium text-zinc-900">{p.label}</span>
              <input
                value={p.url}
                onChange={(e) => setPlatformUrl(p.key, e.target.value)}
                placeholder="Login URL (optional)"
                className="flex-1 rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-700 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
              />
            </div>
          ))}
          <div className="flex items-center gap-3">
            <button onClick={() => setStep(2)} className="text-xs text-zinc-400 hover:text-zinc-700">Back</button>
            <button
              onClick={() => setStep(4)}
              className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors"
            >
              Next: Review
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <div className="space-y-6">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Review</h3>
          <div className="rounded-lg border border-zinc-200 bg-white p-5 space-y-4">
            <div>
              <p className="text-lg font-semibold text-zinc-900">{name}</p>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-zinc-600">
                {contactName && <span className="font-medium text-zinc-900">{contactName}</span>}
                {email && <span>{email}</span>}
                {phone && <span>{phone}</span>}
              </div>
              {industry && <p className="mt-1 text-xs text-zinc-400">{industry}{employeeCount ? ` · ${employeeCount} employees` : ""}{serviceArea ? ` · ${serviceArea}` : ""}</p>}
              {notes && <p className="mt-1 text-xs italic text-zinc-500">{notes}</p>}
            </div>
            <div className="border-t border-zinc-200 pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">Services</p>
              <div className="flex flex-wrap gap-1.5">
                {services.map((key) => {
                  const opt = SERVICE_OPTIONS.find((s) => s.key === key);
                  return (
                    <span key={key} className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
                      {opt?.label || key}
                    </span>
                  );
                })}
              </div>
            </div>
            {platforms.length > 0 && (
              <div className="border-t border-zinc-200 pt-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">Platforms</p>
                <div className="space-y-1">
                  {platforms.map((p) => (
                    <div key={p.key} className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-zinc-900">{p.label}</span>
                      {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline truncate">{p.url}</a>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setStep(3)} className="text-xs text-zinc-400 hover:text-zinc-700">Back</button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
            >
              {loading && <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
              {loading ? "Creating..." : "Create Client"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
