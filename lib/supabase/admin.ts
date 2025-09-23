// lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js';

// This admin client is for server-side use ONLY.
// It uses the service_role key to bypass all RLS policies.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);