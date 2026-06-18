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

const { data, error } = await sb.storage.from("music").download(`${ORPHAN}/track.mp3`);
if (error) {
  console.log("download error", error.message);
  process.exit(1);
}

const buf = Buffer.from(await data.arrayBuffer());
fs.writeFileSync(path.join(outDir, "track.mp3"), buf);
console.log("saved track.mp3", buf.length);

// crude ID3 title scan
const text = buf.toString("latin1");
for (const frame of ["TIT2", "TPE1", "TALB"]) {
  const idx = text.indexOf(frame);
  if (idx >= 0) {
    const slice = text.slice(idx, idx + 120).replace(/[^\x20-\x7E]/g, " ");
    console.log(frame, slice);
  }
}
