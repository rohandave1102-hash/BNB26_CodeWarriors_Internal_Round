import { createClient } from '@supabase/supabase-js';

// Read from Vite environment or fall back
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Supabase client instance (or null if unconfigured)
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Local fallback user session for hackathon demo testing
const LOCAL_STORAGE_KEY = 'model_ledger_auth_user';

export async function getCurrentUser() {
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) return user;
  }
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  return cached ? JSON.parse(cached) : null;
}

export async function signIn(email, password) {
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  }
  
  // Resilient local session fallback
  const mockUser = {
    id: 'user_' + Math.random().toString(36).substring(2, 9),
    email: email || 'auditor@model-ledger.io',
    role: 'Cryptographic Auditor',
    user_metadata: { full_name: email.split('@')[0] || 'Lead Auditor', role: 'Verified Attestor' },
    created_at: new Date().toISOString()
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockUser));
  return mockUser;
}

export async function signUp(email, password, metadata = {}) {
  if (supabase) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
    if (error) throw error;
    return data.user;
  }

  const mockUser = {
    id: 'user_' + Math.random().toString(36).substring(2, 9),
    email: email,
    role: metadata.role || 'Content Creator',
    user_metadata: metadata,
    created_at: new Date().toISOString()
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockUser));
  return mockUser;
}

export async function signOut() {
  if (supabase) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}

export function demoLogin(role = 'Verified Platform Oracle') {
  const demoUsers = {
    'Verified Platform Oracle': {
      id: 'oracle_0x7f83b1657f',
      email: 'oracle@model-ledger.io',
      role: 'Platform Oracle Attestor',
      user_metadata: { full_name: 'Dr. Evelyn Vance (Chief AI Trust Lead)', role: 'Verified Platform Oracle', reputation: '99.98%' }
    },
    'Generative Artist': {
      id: 'artist_0x9fa17b4c6e',
      email: 'creator@cyber-renaissance.art',
      role: 'AI Genesis Creator',
      user_metadata: { full_name: 'Kairos Thorne (Digital Synthographer)', role: 'Generative Artist', reputation: '98.5%' }
    },
    'Forensic Auditor': {
      id: 'auditor_0x4a8b2c1d3e',
      email: 'forensics@c2pa-alliance.org',
      role: 'C2PA Standards Inspector',
      user_metadata: { full_name: 'Sarah Chen (Security & ELA Analyst)', role: 'Forensic Auditor', reputation: '100%' }
    }
  };

  const user = demoUsers[role] || demoUsers['Verified Platform Oracle'];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
  return user;
}
