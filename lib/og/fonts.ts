import { readFile } from "node:fs/promises";
import { join } from "node:path";

const FONT_DIR = join(process.cwd(), "lib/og/assets");

const FONT_FILES = {
  regular: "Inter-Regular.ttf",
  bold: "Inter-Bold.ttf",
} as const;

const FONT_CDN = {
  regular:
    "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf",
  bold: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf",
} as const;

let fontsPromise: Promise<
  Array<{
    name: string;
    data: ArrayBuffer;
    weight: 400 | 700;
    style: "normal";
  }>
> | null = null;

async function loadFontBytes(filename: string, fallbackUrl: string): Promise<ArrayBuffer> {
  try {
    const file = await readFile(join(FONT_DIR, filename));
    return file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength);
  } catch {
    const response = await fetch(fallbackUrl, {
      headers: { "User-Agent": "cried.bio-og/1.0" },
    });
    if (!response.ok) {
      throw new Error(`Failed to load font ${filename}: ${response.status}`);
    }
    return response.arrayBuffer();
  }
}

export async function getOgFonts() {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      loadFontBytes(FONT_FILES.regular, FONT_CDN.regular),
      loadFontBytes(FONT_FILES.bold, FONT_CDN.bold),
    ]).then(([regular, bold]) => [
      { name: "Inter", data: regular, weight: 400 as const, style: "normal" as const },
      { name: "Inter", data: bold, weight: 700 as const, style: "normal" as const },
    ]);
  }

  return fontsPromise;
}
