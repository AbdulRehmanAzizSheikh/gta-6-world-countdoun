import { getDb } from "@/lib/mongodb";

// Two separate datasets in MongoDB:
// - "stats" collection  -> REAL counters (only shown in /admin)
// - "display" collection -> public-facing counters (seeded to look real)
//
// The public site reads/writes "display"; admin reads "stats".

export const DISPLAY_SEED = {
  visits: 1_284_336,
  likes: 482_913,
  dislikes: 2_317,
} as const;

export async function getDisplayStats() {
  const db = await getDb();
  await db
    .collection("display")
    .updateOne(
      { _id: "global" as unknown as never },
      { $setOnInsert: { ...DISPLAY_SEED } },
      { upsert: true },
    );
  const d = await db.collection("display").findOne({ _id: "global" as unknown as never });
  return {
    visits: Math.max(0, d?.visits ?? DISPLAY_SEED.visits),
    likes: Math.max(0, d?.likes ?? DISPLAY_SEED.likes),
    dislikes: Math.max(0, d?.dislikes ?? DISPLAY_SEED.dislikes),
  };
}

export async function bumpDisplay(field: "visits" | "likes" | "dislikes", delta: number) {
  const db = await getDb();
  // Ensure the seeded doc exists first (separate op to avoid $inc/$setOnInsert path conflict)
  await db
    .collection("display")
    .updateOne(
      { _id: "global" as unknown as never },
      { $setOnInsert: { ...DISPLAY_SEED } },
      { upsert: true },
    );
  await db
    .collection("display")
    .updateOne({ _id: "global" as unknown as never }, { $inc: { [field]: delta } });
  // clamp negatives
  await db
    .collection("display")
    .updateOne(
      { _id: "global" as unknown as never, [field]: { $lt: 0 } } as never,
      { $set: { [field]: 0 } },
    );
  return getDisplayStats();
}

// REAL counters — only ever shown in the /admin panel.
export async function bumpReal(field: "visits" | "likes" | "dislikes", delta: number) {
  const db = await getDb();
  await db
    .collection("stats")
    .updateOne({ _id: "global" as unknown as never }, { $inc: { [field]: delta } }, { upsert: true });
  await db
    .collection("stats")
    .updateOne(
      { _id: "global" as unknown as never, [field]: { $lt: 0 } } as never,
      { $set: { [field]: 0 } },
    );
}
