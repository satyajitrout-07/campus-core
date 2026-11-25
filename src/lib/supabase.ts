import { createClient } from '@supabase/supabase-js';

// Retrieve credentials from environment or localStorage for runtime dynamic config
const getStoredSupabaseConfig = () => {
  const customUrl = localStorage.getItem('sms_supabase_url');
  const customKey = localStorage.getItem('sms_supabase_key');

  const supabaseUrl = customUrl || import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
  const supabaseAnonKey = customKey || import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  return { supabaseUrl, supabaseAnonKey };
};

const { supabaseUrl, supabaseAnonKey } = getStoredSupabaseConfig();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const isSupabaseConfigured = (): boolean => {
  const customUrl = localStorage.getItem('sms_supabase_url');
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  return Boolean((customUrl && customUrl !== '') || (envUrl && envUrl !== '' && !envUrl.includes('placeholder')));
};

export const saveSupabaseCredentials = (url: string, key: string) => {
  if (url && key) {
    localStorage.setItem('sms_supabase_url', url);
    localStorage.setItem('sms_supabase_key', key);
    window.location.reload();
  }
};

export const clearSupabaseCredentials = () => {
  localStorage.removeItem('sms_supabase_url');
  localStorage.removeItem('sms_supabase_key');
  window.location.reload();
};
