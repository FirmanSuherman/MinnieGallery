import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl, 
  supabaseKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    global: {
      // Add default headers for security
      headers: {
        'X-Client-Info': 'MinnieGallery-App',
      },
    },
    db: {
      schema: 'public', // Explicitly specify the schema
    },
  }
);
