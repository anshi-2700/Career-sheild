// Supabase Frontend Configuration & API Client Helper

export const SUPABASE_CONFIG = {
  url: ((import.meta as any).env?.VITE_SUPABASE_URL as string) || "",
  anonKey: ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) || "",
};

export const isSupabaseConfigured = () => {
  return Boolean(SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey);
};
