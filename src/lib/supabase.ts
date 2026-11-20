import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/* URL e chave anon são públicas (rodam no navegador). A segurança vem do
   RLS do banco + login no painel. Configure em .env.local (local) e nas
   "Variables" do repositório no GitHub (publicação). */
export const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const supaConfigurado = Boolean(SUPA_URL && SUPA_KEY);

let cliente: SupabaseClient | null = null;
export function supa(): SupabaseClient {
  if (!supaConfigurado) throw new Error('Supabase não configurado (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).');
  if (!cliente) cliente = createClient(SUPA_URL, SUPA_KEY, { auth: { persistSession: true, storageKey: 'seletto-painel' } });
  return cliente;
}
