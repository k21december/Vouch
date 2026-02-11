
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

function createSupabaseClient(): SupabaseClient<Database> | null {
    try {
        if (!supabaseUrl || !supabaseKey || supabaseUrl.startsWith('YOUR_')) return null;
        return createClient<Database>(supabaseUrl, supabaseKey);
    } catch {
        return null;
    }
}

export const supabase = createSupabaseClient();
