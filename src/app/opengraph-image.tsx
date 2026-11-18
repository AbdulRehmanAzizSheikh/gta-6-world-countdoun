import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const alt = "GTA 6 World Countdown — track the Grand Theft Auto VI worldwide launch";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

function readAsset(rel: string) {
  return fs.readFileSync(path.join(process.cwd(), rel));
}

export default async function OpengraphImage() {
  const bg = readAsset("public/gta6/cover-art.jpg");
  const bebas = readAsset("public/fonts/BebasNeue-Regular.ttf");
  const dataUri = `data:image/jpeg;base64,${bg.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          background: "#04050a",
          overflow: "hidden",
        }}
      >
        <img
          src={dataUri}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", inset: 0, objectFit: "cover", objectPosition: "center 20%" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(90deg, rgba(4,5,10,0.92) 0%, rgba(4,5,10,0.75) 42%, rgba(4,5,10,0.15) 75%, rgba(4,5,10,0.55) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(180deg, rgba(4,5,10,0.25) 0%, rgba(4,5,10,0) 40%, rgba(4,5,10,0.85) 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "64px 72px",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.08)",
              borderRadius: 999,
              padding: "8px 20px",
              color: "#ffd9f2",
              fontSize: 22,
              letterSpacing: 5,
              textTransform: "uppercase",
              width: "fit-content",
              fontFamily: "Bebas Neue",
            }}
          >
            Grand Theft Auto VI
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 22,
              fontFamily: "Bebas Neue",
              lineHeight: 0.95,
              letterSpacing: 2,
              fontSize: 138,
              color: "#fff7fb",
              textShadow: "0 8px 48px rgba(255,79,216,0.45)",
            }}
          >
            <span>GTA 6</span>
            <span
              style={{
                background:
                  "linear-gradient(95deg, #ffe29a 0%, #ff8a3d 25%, #ff4fd8 60%, #8b5cf6 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              WORLD COUNTDOWN
            </span>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontFamily: "Bebas Neue",
              fontSize: 30,
              color: "#ffffff",
              letterSpacing: 1,
            }}
          >
            Launch — 19 November 2026 · Midnight local
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 10,
              fontFamily: "Bebas Neue",
              fontSize: 22,
              color: "rgba(255,255,255,0.78)",
            }}
          >
            gta-vi-countdown.supersoftware.agency
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Bebas Neue", data: bebas, style: "normal", weight: 400 }],
    },
  );
}
