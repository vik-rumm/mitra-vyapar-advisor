import { createClient } from "@supabase/supabase-js";
import { UserRecord } from "./db";

const SUPABASE_URL =
  (import.meta as unknown as { env: Record<string, string> }).env?.["VITE_SUPABASE_URL"] ||
  "https://xjpqjrtuhrcfnqckdili.supabase.co";

const SUPABASE_ANON_KEY =
  (import.meta as unknown as { env: Record<string, string> }).env?.["VITE_SUPABASE_ANON_KEY"] ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcHFqcnR1aHJjZm5xY2tkaWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1OTM5NzQsImV4cCI6MjEwNDE2OTk3NH0.1ZSAZjaHp8aa4qJueSh7Vt_DBz-DLwkMr0ocpFTrXbc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

/**
 * Sync User Record to Supabase 'users' table
 */
export async function syncUserToSupabase(user: UserRecord): Promise<UserRecord | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from("users")
      .upsert(
        {
          id: user.id,
          full_name: user.fullName,
          phone: user.phone,
          email: user.email,
          auth_method: user.authMethod,
          category: user.category,
          category_name: user.categoryName,
          idea: user.idea,
          capital: user.capital,
          location: user.location,
          target_audience: user.targetAudience,
          language: user.language,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      )
      .select()
      .single();

    if (error) {
      console.warn("Supabase user sync notice:", error.message);
      return null;
    }
    return user;
  } catch (err) {
    console.warn("Supabase user sync error:", err);
    return null;
  }
}

/**
 * Fetch User Record from Supabase 'users' table
 */
export async function fetchUserFromSupabase(userIdOrPhone: string): Promise<UserRecord | null> {
  if (!isSupabaseConfigured() || !userIdOrPhone) return null;

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .or(`id.eq.${userIdOrPhone},phone.eq.${userIdOrPhone}`)
      .limit(1)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      fullName: data.full_name || "",
      phone: data.phone || "",
      email: data.email || "",
      authMethod: data.auth_method || "guest",
      category: data.category || "",
      categoryName: data.category_name || "",
      idea: data.idea || "",
      capital: data.capital || "50,000",
      location: data.location || "India",
      targetAudience: data.target_audience || "",
      language: data.language || "English",
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at || new Date().toISOString(),
    };
  } catch (err) {
    console.warn("Supabase user fetch warning:", err);
    return null;
  }
}

/**
 * Sync Daily P&L Log to Supabase 'daily_pnl' table
 */
export async function syncDailyPnlToSupabase(
  userId: string,
  pnlData: {
    income: number;
    materials: number;
    utilities: number;
    wastage: number;
    netProfit: number;
  },
) {
  if (!isSupabaseConfigured()) return;

  try {
    await supabase.from("daily_pnl").insert({
      user_id: userId,
      income: pnlData.income,
      materials: pnlData.materials,
      utilities: pnlData.utilities,
      wastage: pnlData.wastage,
      net_profit: pnlData.netProfit,
      logged_at: new Date().toISOString(),
    });
  } catch (e) {
    console.warn("Supabase PnL sync warning", e);
  }
}
