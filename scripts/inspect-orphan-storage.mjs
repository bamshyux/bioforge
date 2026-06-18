import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const env = {};
for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const i = line.indexOf("=");
  if (i <= 0 || line.startsWith("#")) continue;
  const key = line.slice(0, i).trim();
  let value = line.slice(i + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  env[key] = value;
}

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY);

const ORPHAN = "d97fe032-481b-47f2-b8ff-ddce6650f6ac";

async function listRecursive(prefix) {
  const { data, error } = await sb.storage.from("profiles").list(prefix, { limit: 500 });
  if (error) return { error: error.message, items: [] };
  const items = [];
  for (const item of data ?? []) {
    const path = prefix ? `${prefix}/${item.name}` : item.name;
    if (item.id) {
      items.push({ path, ...item });
    } else {
      const nested = await listRecursive(path);
      items.push(...nested.items);
    }
  }
  return { items };
}

const { items } = await listRecursive(ORPHAN);
console.log("orphan files", JSON.stringify(items, null, 2));

for (const f of items.filter((x) => x.path?.match(/\.(jpg|png|webp|gif|mp4|webm)$/i))) {
  const { data } = sb.storage.from("profiles").getPublicUrl(`${ORPHAN}/${f.name}`);
  const url = data?.publicUrl;
  console.log("public url", f.path, url);
}

// Map all profile ids to usernames
const { data: profiles } = await sb.from("profiles").select("id, username, uid, display_name").order("uid");
console.log("\nall profiles", profiles);

const profileIds = new Set((profiles ?? []).map((p) => p.id));
const { data: root } = await sb.storage.from("profiles").list("", { limit: 500 });
for (const folder of root ?? []) {
  if (!profileIds.has(folder.name)) {
    console.log("ORPHAN FOLDER", folder.name);
  }
}
