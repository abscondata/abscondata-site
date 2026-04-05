"use client";

import { useState } from "react";
import { createClientManual } from "./actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SERVICE_OPTIONS = [
  { key: "invoice_ops", label: "Invoice Operations" },
  { key: "payment_followup", label: "Payment Follow-Up" },
  { key: "review_requests", label: "Review Requests" },
  { key: "weekly_summary", label: "Weekly Business Summary" },
  { key: "lead_intake", label: "Lead & Intake Admin" },
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

export default function NewClientPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [name, setName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [industry, setIndustry] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [notes, setNotes] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);

  function toggleList(list: string[], setList: (v: string[]) => void, key: string) {
    setList(list.includes(key) ? list.filter((k) => k !== key) : [...list, key]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await createClientManual({
        name, contact_name: contactName, email, phone,
        industry, employee_count: employeeCount, service_area: serviceArea,
        notes, services, platforms,
      });
      router.push(`/dashboard/clients/${result.clientId}`);
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

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-8">
        {/* Business Info */}
        <div>
          <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Business Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-zinc-700">Company Name *</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClasses} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-700">Contact Name</label>
              <input value={contactName} onChange={(e) => setContactName(e.target.value)} className={inputClasses} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-700">Email</label>
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
        </div>

        {/* Services */}
        <div>
          <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Services</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {SERVICE_OPTIONS.map((s) => (
              <label key={s.key} className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 hover:border-zinc-300 transition-colors">
                <input type="checkbox" checked={services.includes(s.key)} onChange={() => toggleList(services, setServices, s.key)} className="h-4 w-4 accent-zinc-900" />
                <span className="text-sm font-medium text-zinc-900">{s.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Platforms */}
        <div>
          <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Platforms</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {PLATFORM_OPTIONS.map((p) => (
              <label key={p.key} className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 hover:border-zinc-300 transition-colors">
                <input type="checkbox" checked={platforms.includes(p.key)} onChange={() => toggleList(platforms, setPlatforms, p.key)} className="h-4 w-4 accent-zinc-900" />
                <span className="text-sm font-medium text-zinc-900">{p.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !name}
          className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
        >
          {loading ? "Creating..." : "Create Client"}
        </button>
      </form>
    </div>
  );
}
