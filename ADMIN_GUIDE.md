# SpesaOttimale — Guida Admin

## Setup iniziale (una volta sola)

### 1. Crea il progetto Supabase
1. Vai su [supabase.com](https://supabase.com) → New project
2. Dashboard → **SQL Editor** → incolla ed esegui:

```sql
create table prodotti (
  id               bigserial primary key,
  nome             text not null,
  prezzo           numeric(6,2) not null check (prezzo > 0),
  supermercato     text not null,
  categoria        text not null default 'Altro',
  citta            text not null default '',
  cap              text not null default '',
  data_rilevazione date not null default current_date,
  inserito_da      text not null default 'admin'
                   check (inserito_da in ('admin','community')),
  created_at       timestamptz not null default now()
);

create index on prodotti (lower(nome));
create index on prodotti (cap);
create index on prodotti (data_rilevazione desc);

alter table prodotti enable row level security;
create policy "lettura pubblica"    on prodotti for select using (true);
create policy "inserimento pubblico" on prodotti for insert with check (true);
```

### 2. Configura le variabili d'ambiente
Copia `.env.local.example` in `.env.local` e compila:

```
NEXT_PUBLIC_SUPABASE_URL=    ← Project Settings → API → Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=  ← Project Settings → API → anon public
SUPABASE_SERVICE_ROLE_KEY=   ← Project Settings → API → service_role (secret!)
ADMIN_PASSWORD=spesa2024     ← cambia con una password sicura
```

### 3. Installa dipendenze e avvia
```bash
npm install
npm run dev
```

---

## Routine settimanale (ogni lunedì o martedì)

### Metodo 1 — Importazione rapida da textarea (consigliato)
1. Vai su `http://localhost:3000/admin`
2. Inserisci la password
3. Clicca **"Importa offerte settimana"**
4. Incolla la lista nel formato:
   ```
   nome, prezzo, supermercato, categoria, città, CAP
   ```
   Esempio:
   ```
   Latte intero 1L, 0.99, Lidl, Latticini, Milano, 20121
   Pasta Barilla 500g, 1.09, Esselunga, Pasta & Riso, Roma, 00100
   Petto di pollo 1kg, 4.59, Eurospin, Carne & Pesce, Torino, 10100
   Mozzarella 125g, 0.79, Eurospin, Latticini
   ```
   > Categoria, Città e CAP sono opzionali. Se ometti il CAP il prezzo sarà trattato come "nazionale".

5. Clicca **Importa** → i prodotti appaiono subito in tabella

### Metodo 2 — Aggiunta singola
Usa il form in cima alla pagina admin per inserire un prodotto alla volta.

### Fonti dati suggerite
- Volantini digitali: **Tiendeo.it**, **Promotons.it**, **Volantinoweb.it**
- App supermercati (Lidl Plus, Esselunga app, Conad app)
- Sito ufficiale di ogni catena → sezione "Offerte della settimana"

---

## Gestire i prezzi

### Modificare un prezzo
1. Trova il prodotto in tabella
2. Passa sopra con il mouse → clicca **✏️ Modifica**
3. Modifica i campi nel form in alto → **Aggiorna prodotto**

### Eliminare un prezzo
- Clicca **🗑️** sulla riga → conferma

### Filtrare la tabella
Usa il campo di ricerca in cima alla tabella: cerca per nome, supermercato o CAP.

---

## Segnalazioni della community

I prezzi segnalati dagli utenti appaiono con il badge **👥 community** in tabella.

Cosa fare ogni settimana:
1. Filtra per "community" per vedere le segnalazioni recenti
2. Verifica che i prezzi siano plausibili
3. Se il prezzo è corretto: lascialo (contribuisce al database)
4. Se è sbagliato: eliminalo con 🗑️

---

## Logica di confronto

L'app usa i dati con questa priorità:
1. **Prezzi nel DB con CAP dell'utente** (ultimi 30 giorni)
2. **Prezzi nazionali nel DB** (se non ci sono dati locali)
3. **Prezzi hardcoded** in `src/lib/supermercati.ts` (fallback sempre disponibile)

L'utente vede sempre un banner che indica la fonte dei dati.

---

## Sicurezza

- La password admin `spesa2024` è in `.env.local` → **cambiala in produzione**
- Il `SUPABASE_SERVICE_ROLE_KEY` non viene mai esposto al browser (solo nelle API route)
- Le API admin richiedono l'header `x-admin-key` — non accessibili dal frontend pubblico
- Le RLS Supabase permettono solo lettura+inserimento agli utenti anonimi

---

## Struttura file chiave

```
src/
├── app/
│   ├── page.tsx              homepage pubblica
│   ├── admin/page.tsx        dashboard admin
│   └── api/
│       ├── confronto/route.ts  GET prezzi per il confronto
│       ├── prodotti/route.ts   CRUD admin (GET/POST/PUT/DELETE)
│       └── segnala/route.ts    POST segnalazioni utenti
├── lib/
│   ├── supabase.ts           client Supabase + schema SQL
│   ├── prezzi.ts             logica query + fallback
│   └── supermercati.ts       costanti + prezzi hardcoded
└── components/
    ├── SegnalaPrezzo.tsx     modal segnalazione utente
    └── RisultatiSpesa.tsx    tabella confronto prezzi
```
