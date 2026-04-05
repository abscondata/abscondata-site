"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface ApolloResult {
  totalFound: number;
  duplicatesSkipped: number;
  newLeadsSaved: number;
  batchId: string;
}

interface ApolloPerson {
  id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  title?: string;
  organization?: {
    name?: string;
    industry?: string;
    estimated_num_employees?: number;
    annual_revenue_printed?: string;
  };
  city?: string;
  state?: string;
  country?: string;
  phone_numbers?: Array<{ sanitized_number?: string }>;
  linkedin_url?: string;
}

const DEFAULT_FILTERS = {
  person_titles: ["Owner", "Founder", "President", "CEO", "General Manager"],
  employee_ranges: ["1,10", "11,20", "21,50"],
  person_locations: ["Florida, United States"],
  q_organization_keyword_tags: [
    "construction", "plumbing", "hvac", "electrical", "landscaping",
    "pest control", "cleaning", "home services", "facilities",
    "roofing", "painting", "flooring", "remodeling",
  ],
  contact_email_status: ["verified"],
};

async function fetchApolloPage(apiKey: string, page: number): Promise<{ people: ApolloPerson[]; totalEntries: number }> {
  const res = await fetch("https://api.apollo.io/v1/mixed_people/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      page,
      per_page: 100,
      ...DEFAULT_FILTERS,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Apollo API error (${res.status}): ${text}`);
  }

  const data = await res.json();
  return {
    people: data.people || [],
    totalEntries: data.pagination?.total_entries || 0,
  };
}

function formatLocation(person: ApolloPerson): string | null {
  const parts = [person.city, person.state, person.country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}

function formatEmployeeCount(org?: ApolloPerson["organization"]): string | null {
  if (!org?.estimated_num_employees) return null;
  return String(org.estimated_num_employees);
}

export async function pullFromApollo(): Promise<ApolloResult> {
  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) throw new Error("Apollo API key not configured");

  const supabase = await createClient();
  const now = new Date();
  const batchId = `batch_${now.toISOString().slice(0, 10)}_${now.toTimeString().slice(0, 8).replace(/:/g, "")}`;

  // Pull pages 1-3
  const allPeople: ApolloPerson[] = [];
  let totalEntries = 0;

  for (let page = 1; page <= 3; page++) {
    const result = await fetchApolloPage(apiKey, page);
    totalEntries = result.totalEntries;
    allPeople.push(...result.people);
    if (result.people.length < 100) break;
  }

  if (allPeople.length === 0) {
    throw new Error("No new leads found with current filters");
  }

  // Filter to only people with emails
  const withEmails = allPeople.filter((p) => p.email);

  // Check existing emails in bulk
  const emails = withEmails.map((p) => p.email!);
  const { data: existingRows } = await supabase
    .from("outreach_leads")
    .select("email")
    .in("email", emails);

  const existingEmails = new Set((existingRows ?? []).map((r) => r.email));

  // Prepare new leads
  const newLeads = withEmails
    .filter((p) => !existingEmails.has(p.email!))
    .map((p) => ({
      email: p.email!,
      first_name: p.first_name || null,
      last_name: p.last_name || null,
      company_name: p.organization?.name || null,
      title: p.title || null,
      industry: p.organization?.industry || null,
      employee_count: formatEmployeeCount(p.organization),
      location: formatLocation(p),
      revenue: p.organization?.annual_revenue_printed || null,
      phone: p.phone_numbers?.[0]?.sanitized_number || null,
      linkedin_url: p.linkedin_url || null,
      source: "apollo",
      apollo_id: p.id || null,
      batch_id: batchId,
      status: "new",
    }));

  const duplicatesSkipped = withEmails.length - newLeads.length;

  if (newLeads.length > 0) {
    // Insert in chunks of 50 to avoid payload limits
    for (let i = 0; i < newLeads.length; i += 50) {
      const chunk = newLeads.slice(i, i + 50);
      const { error } = await supabase.from("outreach_leads").insert(chunk);
      if (error) throw new Error(`Insert failed: ${error.message}`);
    }
  }

  revalidatePath("/dashboard/outreach");

  return {
    totalFound: totalEntries,
    duplicatesSkipped,
    newLeadsSaved: newLeads.length,
    batchId,
  };
}
