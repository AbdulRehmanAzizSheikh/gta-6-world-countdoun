// Public "vanity" display numbers. The real counts live in MongoDB and are
// only ever shown in the /admin panel. The public site shows base + real.
export const PUBLIC_BASE = {
  visits: 1_284_317,
  likes: 482_913,
  dislikes: 2_317,
} as const;

export function withPublicBase(real: { visits?: number; likes?: number; dislikes?: number }) {
  return {
    visits: PUBLIC_BASE.visits + (real.visits ?? 0),
    likes: PUBLIC_BASE.likes + (real.likes ?? 0),
    dislikes: PUBLIC_BASE.dislikes + (real.dislikes ?? 0),
  };
}
