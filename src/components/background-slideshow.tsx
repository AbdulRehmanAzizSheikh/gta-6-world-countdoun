"use client";

import { useEffect, useState } from "react";

const DESKTOP_IMAGES = [
  "/gta6/jason-lucia-01-landscape.jpg",
  "/gta6/lock-and-load.jpg",
  "/gta6/cover-art.jpg",
  "/gta6/beach.jpg",
];

const MOBILE_IMAGES = [
  "/gta6/cover-art.jpg",
  "/gta6/lock-and-load.jpg",
  "/gta6/beach.jpg",
  "/gta6/jason-lucia-01-landscape.jpg",
];

export default function BackgroundSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % DESKTOP_IMAGES.length);
    }, 6500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden" aria-hidden="true">
      {DESKTOP_IMAGES.map((src, i) => (
        <img
          key={`desktop-${src}`}
          src={src}
          alt=""
          className="hidden sm:block absolute inset-0 h-full w-full object-cover scale-[1.06] transition-all duration-[1800ms] ease-out"
          style={{
            opacity: i === index ? 1 : 0,
            transform: i === index ? "scale(1)" : "scale(1.08)",
          }}
        />
      ))}
      {MOBILE_IMAGES.map((src, i) => (
        <img
          key={`mobile-${src}`}
          src={src}
          alt=""
          className="sm:hidden absolute inset-0 h-full w-full object-cover object-[50%_18%] scale-[1.06] transition-all duration-[1800ms] ease-out"
          style={{
            opacity: i === index ? 1 : 0,
            transform: i === index ? "scale(1)" : "scale(1.08)",
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#0b1020]/66 to-[#04050a]/92" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.32),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.42),transparent_40%)]" />
      <div className="absolute bottom-4 right-4 hidden sm:flex gap-1.5 z-10">
        {DESKTOP_IMAGES.map((_, i) => (
          <span
            key={i}
            className="h-1.5 w-5 rounded-full transition-all duration-500"
            style={{
              background: i === index ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.28)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
