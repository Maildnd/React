import type { SupabaseClient } from '@supabase/supabase-js';

import { createClient } from '@supabase/supabase-js';

// ----------------------------------------------------------------------

// const isSupabase = CONFIG.auth.method === 'supabase';
const isSupabase = true;
//  const supabaseUrl = CONFIG.supabase.url;
//  const supabaseKey = CONFIG.supabase.key;

const supabaseUrl = 'https://hdtnudvyvxpsyyqmqhuo.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkdG51ZHZ5dnhwc3l5cW1xaHVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NTE5OTMsImV4cCI6MjAzODQyNzk5M30.295Ugl0OR8MEhe7F47Sd8-1i3QRAC5CHFVxxEaQyF64';

export const supabase = isSupabase
  ? createClient(supabaseUrl, supabaseKey)
  : ({} as SupabaseClient<any, 'public', any>);
