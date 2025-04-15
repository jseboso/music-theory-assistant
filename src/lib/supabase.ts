"use client";

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// We'll use this flag to determine if we're in Electron
export const isElectron = typeof window !== 'undefined' && 
  (process.env.NEXT_PUBLIC_IS_ELECTRON === 'true' || 
   window.navigator.userAgent.toLowerCase().indexOf(' electron/') > -1);