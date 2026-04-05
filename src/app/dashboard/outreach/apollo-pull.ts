"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface ApolloResult {
  totalFound: number;
  duplicatesSkipped: number;
  newLeadsSaved: number;
  revealed: number;
  skippedNoEmail: number;
  batchId: string;
}

// Shape returned by api_search (obfuscated)
interface ApolloSearchPerson {
  id?: string;
  first_name?: string;
  title?: string;
  has_email?: boolean;
}

// Shape returned by people/match (full details)
interface ApolloRevealedPerson {
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

const MAX_REVEALS_PER_BATCH = 250;
const REVEAL_DELAY_MS = 200;

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

async function searchApollo(apiKey: string, page: number): Promise<{ people: ApolloSearchPerson[]; totalEntries: number }> {
  const res = await fetch("https://api.apollo.io/v1/mixed_people/api_search", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Api-Key": apiKey },
    body: JSON.stringify({
      page,
      per_page: 100,
      ...DEFAULT_FILTERS,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Apollo search error (${res.status}): ${text}`);
  }

  const data = await res.json();
  return {
    people: data.people || [],
    totalEntries: data.total_entries || 0,
  };
}

async function revealPerson(apiKey: string, personId: string): Promise<ApolloRevealedPerson | null> {
  const res = await fetch("https://api.apollo.io/v1/people/match", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Api-Key": apiKey },
    body: JSON.stringify({
      id: personId,
      reveal_personal_emails: false,
      reveal_phone_number: true,
    }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.person || null;
}

function formatLocation(person: ApolloRevealedPerson): string | null {
  const parts = [person.city, person.state, person.country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}

function formatEmployeeCount(org?: ApolloRevealedPerson["organization"]): string | null {
  if (!org?.estimated_num_employees) return null;
  return String(org.estimated_num_employees);
}

export async function pullFromApollo(): Promise<ApolloResult> {
  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) throw new Error("Apollo API key not configured");

  const supabase = await createClient();
  const now = new Date();
  const batchId = `batch_${now.toISOString().slice(0, 10)}_${now.toTimeString().slice(0, 8).replace(/:/g, "")}`;

  // Step 1: Search for people (pages 1-3, up to 300 candidates)
  const searchResults: ApolloSearchPerson[] = [];
  let totalEntries = 0;

  for (let page = 1; page <= 3; page++) {
    const result = await searchApollo(apiKey, page);
    totalEntries = result.totalEntries;
    searchResults.push(...result.people);
    if (result.people.length < 100) break;
  }

  // Filter to people with IDs (required for reveal)
  const candidates = searchResults.filter((p) => p.id);

  if (candidates.length === 0) {
    throw new Error("No new leads found with current filters");
  }

  // Cap at MAX_REVEALS_PER_BATCH to conserve credits
  const toReveal = candidates.slice(0, MAX_REVEALS_PER_BATCH);

  // Step 2: Reveal each person to get full contact details
  const revealed: ApolloRevealedPerson[] = [];
  let skippedNoEmail = 0;

  for (const candidate of toReveal) {
    const person = await revealPerson(apiKey, candidate.id!);

    if (person && person.email) {
      revealed.push(person);
    } else {
      skippedNoEmail++;
    }

    await new Promise((r) => setTimeout(r, REVEAL_DELAY_MS));
  }

  if (revealed.length === 0) {
    throw new Error("No leads with valid emails found after reveal");
  }

  // Step 3: Dedup against existing leads
  const emails = revealed.map((p) => p.email!);
  const { data: existingRows } = await supabase
    .from("outreach_leads")
    .select("email")
    .in("email", emails);

  const existingEmails = new Set((existingRows ?? []).map((r) => r.email));

  const newLeads = revealed
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

  const duplicatesSkipped = revealed.length - newLeads.length;

  // Step 4: Insert new leads
  if (newLeads.length > 0) {
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
    revealed: revealed.length,
    skippedNoEmail,
    batchId,
  };
}
