import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const AUDIO_EXTS = new Set([".mp3", ".aac", ".m4a", ".mp4", ".ogg", ".wav", ".flac", ".webm", ".opus"]);

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public", "music");
    let files: string[] = [];
    try {
      files = fs.readdirSync(dir);
    } catch {
      return NextResponse.json({ tracks: [] });
    }

    // map number -> best matching filename (prefer .mp3 if multiple)
    const byNumber = new Map<number, string>();
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (!AUDIO_EXTS.has(ext)) continue;
      const base = path.basename(file, ext);
      if (!/^\d+$/.test(base)) continue;
      const num = parseInt(base, 10);
      if (num <= 0) continue;
      const prev = byNumber.get(num);
      if (!prev) {
        byNumber.set(num, file);
      } else {
        // prefer mp3 over others if duplicates
        const prevExt = path.extname(prev).toLowerCase();
        if (ext === ".mp3" && prevExt !== ".mp3") byNumber.set(num, file);
      }
    }

    const tracks: { id: string; name: string; src: string }[] = [];
    const nums = Array.from(byNumber.keys()).sort((a, b) => a - b);
    for (const n of nums) {
      const file = byNumber.get(n)!;
      tracks.push({ id: String(n), name: `Track ${n}`, src: `/music/${file}` });
    }

    return NextResponse.json({ tracks });
  } catch {
    return NextResponse.json({ tracks: [] });
  }
}
