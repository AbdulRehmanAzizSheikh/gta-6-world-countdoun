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

    const tracks = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return AUDIO_EXTS.has(ext);
      })
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
      .map((file) => {
        const ext = path.extname(file);
        const base = path.basename(file, ext);
        return {
          id: file,
          name: base,
          src: `/music/${encodeURIComponent(file)}`,
        };
      });

    return NextResponse.json({ tracks });
  } catch {
    return NextResponse.json({ tracks: [] });
  }
}
