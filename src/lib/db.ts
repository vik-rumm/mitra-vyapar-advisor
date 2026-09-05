import { openDB, IDBPDatabase } from "idb";

export interface UserRecord {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  authMethod: "otp" | "google" | "guest";
  category: string;
  categoryName: string;
  idea: string;
  capital: string;
  location: string;
  targetAudience: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

const DB_NAME = "VyaparMitraDB";
const STORE_NAME = "users";
const CURRENT_USER_KEY = "vyapar_active_user_id";

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (typeof window === "undefined") return null;
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex("by_phone", "phone", { unique: false });
          store.createIndex("by_email", "email", { unique: false });
        }
      },
    });
  }
  return dbPromise;
}

import { syncUserToSupabase, fetchUserFromSupabase } from "./supabase";

/**
 * Save or Update a User Record in Database (Hybrid Offline IndexedDB + Supabase Cloud)
 */
export async function saveUserRecord(
  data: Omit<UserRecord, "id" | "createdAt" | "updatedAt"> & {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
  },
): Promise<UserRecord> {
  const now = new Date().toISOString();
  const id = data.id || `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

  const record: UserRecord = {
    ...data,
    id,
    createdAt: data.createdAt || now,
    updatedAt: now,
  };

  // 1. Save to IndexedDB (Instant Local)
  try {
    const db = await getDB();
    if (db) {
      await db.put(STORE_NAME, record);
    }
  } catch (err) {
    console.warn("IndexedDB save warning, fallback to localStorage", err);
  }

  // 2. Backup to LocalStorage
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("vyapar_user_profile", JSON.stringify(record));
      localStorage.setItem(CURRENT_USER_KEY, id);

      const existingUsersStr = localStorage.getItem("vyapar_all_db_users");
      const existingUsers: UserRecord[] = existingUsersStr ? JSON.parse(existingUsersStr) : [];
      const index = existingUsers.findIndex(
        (u) => u.id === id || (u.phone && u.phone === record.phone),
      );
      if (index >= 0) {
        existingUsers[index] = record;
      } else {
        existingUsers.push(record);
      }
      localStorage.setItem("vyapar_all_db_users", JSON.stringify(existingUsers));
    } catch (err) {
      console.error("Failed to save to localStorage", err);
    }
  }

  // 3. Background Cloud Sync to Supabase PostgreSQL
  syncUserToSupabase(record).catch((e) => console.warn("Supabase background sync notice", e));

  return record;
}

/**
 * Fetch Current Active User Record (LocalStorage -> IndexedDB -> Supabase Cloud)
 */
export async function getCurrentUserRecord(): Promise<UserRecord | null> {
  if (typeof window === "undefined") return null;

  // 1. Check LocalStorage Backup first (Instant)
  try {
    const saved = localStorage.getItem("vyapar_user_profile");
    if (saved) {
      const record = JSON.parse(saved) as UserRecord;
      if (record && record.fullName) return record;
    }
  } catch (e) {
    // Ignore parse error
  }

  // 2. Check IndexedDB
  const activeId = localStorage.getItem(CURRENT_USER_KEY);
  try {
    const db = await getDB();
    if (db && activeId) {
      const record = await db.get(STORE_NAME, activeId);
      if (record) return record as UserRecord;
    }
  } catch (err) {
    console.warn("IndexedDB fetch error", err);
  }

  // 3. Fallback: Fetch from Supabase Cloud if local cache is empty
  if (activeId) {
    const cloudUser = await fetchUserFromSupabase(activeId);
    if (cloudUser) {
      // Re-populate local cache
      try {
        localStorage.setItem("vyapar_user_profile", JSON.stringify(cloudUser));
      } catch (e) {}
      return cloudUser;
    }
  }

  return null;
}

/**
 * Fetch All Registered Database Users
 */
export async function getAllUserRecords(): Promise<UserRecord[]> {
  if (typeof window === "undefined") return [];

  try {
    const db = await getDB();
    if (db) {
      const allRecords = await db.getAll(STORE_NAME);
      if (allRecords && allRecords.length > 0) return allRecords as UserRecord[];
    }
  } catch (err) {
    console.warn("IndexedDB getAll error", err);
  }

  try {
    const existingStr = localStorage.getItem("vyapar_all_db_users");
    if (existingStr) {
      return JSON.parse(existingStr) as UserRecord[];
    }
  } catch (e) {
    // Ignore
  }

  return [];
}
