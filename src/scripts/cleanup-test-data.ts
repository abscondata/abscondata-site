// Run manually: npx tsx src/scripts/cleanup-test-data.ts
// Deletes test clients and all related data from Supabase.

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const envFile = readFileSync(".env.local", "utf8");
const url = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)?.[1]?.trim();
const serviceKey = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim();

if (!url || !serviceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

const TEST_CLIENTS = ["BlueWave Pool Service", "Sunset Dental Studio", "Summit Pest Control"];

async function cleanup() {
  // Get client IDs
  const { data: clients } = await supabase
    .from("clients")
    .select("id, name")
    .in("name", TEST_CLIENTS);

  if (!clients || clients.length === 0) {
    console.log("No test clients found. Nothing to delete.");
    return;
  }

  const clientIds = clients.map((c) => c.id);
  console.log(`Found ${clients.length} test clients:`, clients.map((c) => c.name).join(", "));

  // Get task IDs for these clients
  const { data: tasks } = await supabase
    .from("tasks")
    .select("id")
    .in("client_id", clientIds);
  const taskIds = (tasks ?? []).map((t) => t.id);

  // Delete in order (respecting FK constraints)
  if (taskIds.length > 0) {
    const { count: eventsCount } = await supabase
      .from("task_events")
      .delete({ count: "exact" })
      .in("task_id", taskIds);
    console.log(`Deleted ${eventsCount ?? 0} task_events`);

    const { count: sourceCount } = await supabase
      .from("task_source_data")
      .delete({ count: "exact" })
      .in("task_id", taskIds);
    console.log(`Deleted ${sourceCount ?? 0} task_source_data`);
  }

  const { count: tasksCount } = await supabase
    .from("tasks")
    .delete({ count: "exact" })
    .in("client_id", clientIds);
  console.log(`Deleted ${tasksCount ?? 0} tasks`);

  const { count: servicesCount } = await supabase
    .from("client_services")
    .delete({ count: "exact" })
    .in("client_id", clientIds);
  console.log(`Deleted ${servicesCount ?? 0} client_services`);

  const { count: platformsCount } = await supabase
    .from("client_platforms")
    .delete({ count: "exact" })
    .in("client_id", clientIds);
  console.log(`Deleted ${platformsCount ?? 0} client_platforms`);

  const { count: clientsCount } = await supabase
    .from("clients")
    .delete({ count: "exact" })
    .in("name", TEST_CLIENTS);
  console.log(`Deleted ${clientsCount ?? 0} clients`);

  console.log("Done.");
}

cleanup().catch(console.error);
