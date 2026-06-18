import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const env = {};
for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const i = line.indexOf("=");
  if (i <= 0 || line.startsWith("#")) continue;
  env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"|"$/g, "");
}

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY);
const ORPHAN = "d97fe032-481b-47f2-b8ff-ddce6650f6ac";
const outDir = path.join("scripts", "recovered-presets");
fs.mkdirSync(outDir, { recursive: true });

const downloads = [
  ["profiles", "avatar.jpg", "avatar.jpg"],
  ["profiles", "cursor.png", "cursor.png"],
  ["profiles", "link-icons/1781565433033.png", "link-icon.png"],
  ["backgrounds", "enter-gate.png", "enter-gate.png"],
];

for (const [bucket, objectPath, filename] of downloads) {
  const { data, error } = await sb.storage.from(bucket).download(`${ORPHAN}/${objectPath}`);
  if (error) {
    console.log("download error", filename, error.message);
    continue;
  }
  fs.writeFileSync(path.join(outDir, filename), Buffer.from(await data.arrayBuffer()));
  console.log("saved", filename, data.size);
}
