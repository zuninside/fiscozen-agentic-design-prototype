# Implementation — Vue + DS Fiscozen

> Regole operative per l'implementazione in linguaggio Vue con il design system Fiscozen. Si applica a tutti gli output di modalità CREAZIONE, salvo richiesta esplicita di specifica testuale.

---

## Layout di navigazione — FO e BO

### FO — tre colonne fisse

Layout a tre colonne fisse: sidebar sinistra + area principale + panel chat destro.

- **Sidebar sinistra fissa:** logo Fiscozen, voci principali con sottomenu espandibile (Fatture, Spese, Adempimenti, Profilo), voci piatte (Dashboard, Documenti, Notifiche)
- **Area principale (centro):** contenuto della sezione corrente
- **Panel chat destro fisso:** accesso al commercialista ("Possiamo aiutarti?") — sempre visibile, parte integrante dell'experience, non un elemento opzionale

**In CREAZIONE FO:** progettare nell'area principale. Non reinventare sidebar o chat panel — sono fixture del layout.

---

### BO — icon sidebar + top nav + client view

Layout con icon sidebar collassata a sinistra e area principale che occupa il resto.

- **Icon sidebar sinistra:** collassata di default, icone per area funzionale, nessuna label visibile
- **Top bar:** breadcrumb a sinistra (`Home / Sezione / Elemento`), ricerca utente a destra, CTA contestuale ("Accedi per 30 min")
- **Top navigation:** sotto la top bar, tab orizzontali per area fiscale (Pagamenti, Adempimenti, IVA, Contabilità, Cassetto fiscale, Strumenti) — tutti con dropdown
- **Vista cliente:** area principale strutturata in tre livelli sovrapposti verticalmente: (1) intestazione "Panoramica — [Nome]" con metadata strip orizzontale (ATECO, Regime, Cassa, ruoli assegnati: Sales, CS, Tax Consultant, Tax Intermediary); (2) tab bar orizzontale con tutte le sezioni del cliente (Anagrafica, Partita IVA, Documenti, Clienti, Fornitori, Fatture, Autofatture, Corrispettivi, Note di credito, Spese, Dichiarazioni…); (3) contenuto della tab attiva

**In CREAZIONE BO:** progettare il contenuto della tab attiva (livello 3). I livelli 1 e 2 e tutta la navigazione globale sono fissi — non vanno modificati.

---

## Tecnologia

- **Framework:** Vue 3 + Composition API + TypeScript
- **Styling:** Tailwind CSS v4 (classi inline, mai file CSS separati)
- **Componenti:** solo `@fiscozen/*` — mai HTML/CSS puro per elementi interattivi, mai librerie esterne
- **Environment:** ogni componente `@fiscozen/*` deve avere `environment="frontoffice"` o `environment="backoffice"` a seconda della surface

---

## Componenti disponibili

**Playground** (insieme minimo sempre disponibile):
`@fiscozen/button`, `@fiscozen/input`, `@fiscozen/card`, `@fiscozen/dialog`, `@fiscozen/toast`, `@fiscozen/alert`, `@fiscozen/badge`, `@fiscozen/tab`, `@fiscozen/link`, `@fiscozen/simple-table`, `@fiscozen/container`, `@fiscozen/icons`.

**DS completo** (repo GitHub `fiscozen/design_system`):
aggiunge select, checkbox, dropdown, tooltip, stepper, progress, pagination, typeahead, textarea, datepicker, avatar, breadcrumbs e altri.

---

## Contesto — Repo con il playground Fiscozen

Se l'utente lavora in un repo che ha già il playground Fiscozen configurato (Vue 3 + `@fiscozen/*` installati):

**Regole operative:**
- Usare solo componenti `@fiscozen/*`
- Sempre `environment="frontoffice"` o `environment="backoffice"` sui componenti
- File in `src/pages/frontoffice/NomeProto.vue` o `src/pages/backoffice/NomeProto.vue`
- Aggiungere la rotta in `src/router/index.ts`
- Classi Tailwind inline — mai file CSS separati
- Seguire le regole eventualmente presenti nel `CLAUDE.md` del repo

**Formato output:**

```
## Prototipo: [Nome]
**Surface:** FO / BO
**Task utente:** [una riga]
**File:** src/pages/frontoffice|backoffice/NomeProto.vue

[codice Vue completo]

**Router:** aggiungere in src/router/index.ts:
{ path: '/nome-proto', component: () => import('@/pages/frontoffice|backoffice/NomeProto.vue') }
```

---

## Contesto — Repo senza playground

Se il repo non ha ancora il playground configurato, la tecnologia rimane la stessa: Vue 3 + Composition API + TypeScript + Tailwind v4 + `@fiscozen/*`.

In questo caso:
- Creare la struttura minima: `src/main.ts`, `src/App.vue`, `src/pages/`
- Impostare Vite come bundler di default
- Installare dipendenze: `vue`, `vue-router`, `@fiscozen/*` come da necessità
- Mantenere la separazione `frontoffice` / `backoffice` nei path dei componenti
- L'environment sui componenti `@fiscozen/*` è sempre obbligatorio

Se manca un design system configurato, segnalarlo all'utente prima di procedere — non assumere silenziosamente che `@fiscozen/*` sia disponibile.

---

## Prop dei componenti — fonte di verità

**Non assumere mai le prop a memoria.** Le API dei componenti `@fiscozen/*` evolvono.

In ordine di priorità:

1. **Se è disponibile un URL Figma:** usa `get_design_context` (MCP Figma) — i Code Connect snippets restituiti sono la fonte di verità per le prop esatte.
2. **Se il package è installato nel repo:** leggi i tipi TypeScript dal package (`node_modules/@fiscozen/<nome>/dist/index.d.ts` o equivalente) prima di usare il componente.
3. **Se né Figma né package sono disponibili:** chiedi conferma all'utente sulle prop specifiche prima di scrivere codice che potrebbe essere sbagliato.

Mai inventare prop basandosi su convenzioni generiche di altri DS.

---

## Regole generali di implementazione

- **Stati:** ogni componente e schermata gestisce vuoto / caricamento / errore / successo. Vedi `stati.md`.
- **Accessibilità:** rispettare i requisiti di `confini.md` — focus visibile, `aria-*` corretti, touch target minimo 44×44px, `prefers-reduced-motion`.
- **Microcopy:** ogni stringa di testo (CTA, titoli, errori, placeholder, toast, stati vuoti) segue `microcopy.md`.
- **Animazioni:** durate e tipi come da `motion.md`. Mai animazioni in loop nel contenuto principale.

---

## Modifiche iterative

Se la richiesta è "aggiungi X", "cambia Y", "correggi Z" su un prototipo esistente:

- **Modifica chirurgica:** mostrare solo la sezione modificata con contesto sufficiente per localizzarla.
- **Rigenerare il file completo** solo se esplicitamente richiesto o se la modifica impatta la struttura globale.
- **Non segnalare la stessa cosa due volte** in sessioni iterative.
