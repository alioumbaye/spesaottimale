import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Client pubblico (usato nel browser e nelle API route in lettura) */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Client con service role (solo nelle API route server-side, mai nel browser) */
export function getServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY non configurata");
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/*
 * SQL per creare la tabella su Supabase (Dashboard → SQL Editor):
 *
 * create table prodotti (
 *   id               bigserial primary key,
 *   nome             text not null,
 *   prezzo           numeric(6,2) not null check (prezzo > 0),
 *   supermercato     text not null,
 *   categoria        text not null default 'Altro',
 *   citta            text not null default '',
 *   cap              text not null default '',
 *   data_rilevazione date not null default current_date,
 *   inserito_da      text not null default 'admin' check (inserito_da in ('admin','community')),
 *   created_at       timestamptz not null default now()
 * );
 *
 * -- Indici per le query più frequenti
 * create index on prodotti (lower(nome));
 * create index on prodotti (cap);
 * create index on prodotti (data_rilevazione desc);
 *
 * -- RLS: tutti possono leggere, tutti possono inserire (utenti community)
 * alter table prodotti enable row level security;
 * create policy "lettura pubblica" on prodotti for select using (true);
 * create policy "inserimento pubblico" on prodotti for insert with check (true);
 * -- update/delete solo via service role (dalla nostra API admin)
 */
