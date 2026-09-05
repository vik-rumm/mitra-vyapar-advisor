-- ========================================================
-- Vyapar-Mitra Supabase PostgreSQL Schema & Security Setup
-- ========================================================

-- 1. Users Table (Profile, Registration & Shop Context)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  auth_method TEXT DEFAULT 'guest',
  category TEXT,
  category_name TEXT,
  idea TEXT,
  capital TEXT,
  location TEXT,
  target_audience TEXT,
  language TEXT DEFAULT 'English',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow public read/write for guest & authenticated micro-entrepreneurs
CREATE POLICY "Allow public select on users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on users" ON public.users FOR UPDATE USING (true);

-- 2. Daily P&L Transactions Table
CREATE TABLE IF NOT EXISTS public.daily_pnl (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  income NUMERIC(12,2) DEFAULT 0,
  materials NUMERIC(12,2) DEFAULT 0,
  utilities NUMERIC(12,2) DEFAULT 0,
  wastage NUMERIC(12,2) DEFAULT 0,
  net_profit NUMERIC(12,2) DEFAULT 0,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_pnl_user ON public.daily_pnl(user_id);
ALTER TABLE public.daily_pnl ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select on daily_pnl" ON public.daily_pnl FOR SELECT USING (true);
CREATE POLICY "Allow public insert on daily_pnl" ON public.daily_pnl FOR INSERT WITH CHECK (true);

-- 3. AI Advisor Conversation History Table
CREATE TABLE IF NOT EXISTS public.ai_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  model_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_chats_user ON public.ai_chats(user_id);
ALTER TABLE public.ai_chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select on ai_chats" ON public.ai_chats FOR SELECT USING (true);
CREATE POLICY "Allow public insert on ai_chats" ON public.ai_chats FOR INSERT WITH CHECK (true);
