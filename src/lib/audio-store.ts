// IndexedDB storage for the user's uploaded audio (persists across sessions,
// handles multi-MB files). Falls back to null if unavailable.

const DB_NAME = "gta6-audio";
const STORE = "uploads";
const KEY = "current";

function openDb(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof indexedDB === "undefined") return resolve(null);
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
}

export async function saveUploadedAudio(name: string, blob: Blob): Promise<boolean> {
  const db = await openDb();
  if (!db) return false;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put({ name, blob }, KEY);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

export async function loadUploadedAudio(): Promise<{ name: string; url: string } | null> {
  const db = await openDb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(KEY);
      req.onsuccess = () => {
        const val = req.result as { name: string; blob: Blob } | undefined;
        if (!val?.blob) return resolve(null);
        resolve({ name: val.name, url: URL.createObjectURL(val.blob) });
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}
