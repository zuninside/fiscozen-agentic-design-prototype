---
name: fiscozen-design-principles
description: Usa questa skill per valutare (REVIEW) o progettare (CREAZIONE) componenti, schermate e flussi di Fiscozen — app clienti FO (mobile-first) e tool interno BO (desktop-first). Copre cinque principi di design, guida al microcopy, confini non negoziabili, gestione degli stati, animazioni, governance del design system e regole di implementazione in Vue con il DS Fiscozen. Trigger: "rivedi questo design", "valuta se rispetta i principi", "crea la schermata di X", "progetta il flusso di Y".
---

# Fiscozen Design Principles — Skill v6

> **v6 — aggiornato:** (1) learnings automatici su Slack condiviso via incoming webhook. Quando una learning viene accettata, Claude la posta nel canale del team tramite curl — nessuna azione manuale richiesta. Configurazione in `learnings-config.md`. (2) Auto-update della skill da GitHub: a ogni invocazione Claude verifica se esiste una versione più recente e fa `git pull` automatico (cache 24h, fail-silent se offline). Lo Step 0 gestisce il controllo.

Questa skill guida Claude nella valutazione e progettazione di design per Fiscozen.

## File della skill

- `principles/` — i cinque principi di design
- `context.md` — contesto prodotto: utenti FO/BO, flussi principali, calendario fiscale
- `microcopy.md` — voice, tone, regole di scrittura
- `confini.md` — dark pattern e accessibilità, non negoziabili
- `stati.md` — framework stati (vuoto / caricamento / errore / successo)
- `motion.md` — animazioni e micro-interazioni
- `design-system.md` — governance del DS e processo di contribuzione
- `implementation.md` — tecnologia Vue + DS, layout di navigazione FO/BO, regole operative
- `riferimenti.md` — euristiche, leggi UX, principi comportamentali citati
- `examples/` — esempi di review (ok, borderline, violazione) e creazione; vedi `examples/README.md` per lo stato dell'archivio
- `learnings.md` — archivio locale append-only, usato come backup se il webhook non è raggiungibile
- `learnings-config.md` — configurazione webhook Slack: **leggere prima di ogni invio**
- `scripts/check-update.sh` — controllo aggiornamenti da GitHub (chiamato da Step 0)

---

## Step 0 — Controllo aggiornamenti

Prima di procedere con qualsiasi modalità, eseguire una sola volta a inizio invocazione:

```bash
bash ~/.claude/skills/fiscozen-design-principles/scripts/check-update.sh
```

Lo script ha cache 24h e fail-silent se offline — non blocca mai l'esecuzione. Comportamento in base all'output:

- **Output vuoto** → procedere a Step 1 senza dire nulla all'utente.
- **Output `UPDATED`** → la skill è stata aggiornata da GitHub. **Fermarsi immediatamente** (non procedere a Step 1) e dire all'utente:
  > "Skill aggiornata alla versione più recente. Rilancia la richiesta per usare la nuova versione."

Non eseguire lo script più di una volta nella stessa risposta. Se l'utente rilancia dopo l'aggiornamento, lo Step 0 troverà la cache fresca e procederà subito a Step 1.

---

## Step 1 — Rileva la modalità

La modalità dipende dall'**intent della richiesta**, non dal tipo di input. Figma URL, immagine, file Vue e testo sono tipi di input usabili in entrambe le modalità.

| Modalità | Segnali nella richiesta |
|---|---|
| **REVIEW** | "valida", "rivedi", "analizza", "cosa ne pensi", "guarda questo", "rispetta i principi", "è corretto", "feedback su", "ti mando lo screenshot", "non mi convince" |
| **CREAZIONE** | "crea", "costruisci", "prototipa", "progetta", "implementa", "come potrebbe essere", "fai vedere come", "aiutami a disegnare", "come sarebbe" |

### Edge case

| Situazione | Comportamento |
|---|---|
| Figma URL senza verbo esplicito | Chiedere: "Vuoi che valuti questo design o che crei qualcosa partendo da esso?" |
| Immagine / screenshot senza contesto verbale | Chiedere: "Vuoi che valuti questo o che parta da questo per creare qualcosa?" |
| Richiesta con segnali di entrambe le modalità | Chiedere, non assumere |
| "Come sarebbe X?" / "Come potresti fare X?" | CREAZIONE — è una richiesta di proposta progettuale |
| "Questo mi sembra sbagliato" / "Non mi convince" | REVIEW — segnale di valutazione anche senza verbo esplicito |

> Se la richiesta riguarda operazioni dirette nel canvas Figma (creare componenti, disegnare flussi), questa skill definisce il design da realizzare ma l'esecuzione va delegata a `figma:figma-use` + `figma:figma-generate-design`.

---

## Step 2 — Tipi di input

| Tipo | Come gestirlo |
|---|---|
| Testo descrittivo | Usare la descrizione come briefing; chiedere contesto mancante prima di procedere |
| Immagine / screenshot | Analizzare struttura visiva, gerarchia, componenti riconoscibili |
| URL Figma | Workflow: (1) estrai `fileKey` e `nodeId` dall'URL — `figma.com/design/:fileKey/...?node-id=:nodeId`, converti `-` in `:` nel nodeId; (2) chiama `get_design_context` con fileKey + nodeId; (3) in REVIEW: analizza layout, componenti, gerarchia — applica i principi a quello che vedi, non alla descrizione testuale; (4) in CREAZIONE: i Code Connect snippets nell'output sono la fonte di verità per le prop — usali come base, adatta seguendo i principi. Se `get_design_context` restituisce solo un'immagine senza snippet, usa `get_screenshot` e segnala che il Code Connect non è configurato per quel componente. |
| File Vue (path) | Leggere il file prima di qualsiasi valutazione. Non assumere il contenuto dalla descrizione |

---

## Step 3 — Contesto minimo

Prima di produrre output, verificare di avere le informazioni necessarie. Se mancano più punti: elencarli tutti in un unico messaggio. Se manca un solo punto non critico: procedere segnalando l'assunzione fatta.

**Se la surface (FO / BO) non è chiara dal contesto, chiedere esplicitamente prima di procedere** — sia in review che in creazione. La severità di alcune violazioni e il linguaggio dell'output dipendono direttamente dalla surface.

### Per REVIEW

- Cosa stiamo valutando? (componente, schermata, flusso)
- Surface: **FO** o **BO**?
- Qual è il task dell'utente?
- Se non c'è immagine, link o file: struttura/layout almeno descritta

### Per CREAZIONE

- Qual è il task dell'utente?
- Surface: **FO** o **BO**?
- Output: **prototipo Vue** o **specifica testuale**? (default: prototipo Vue — vedi `implementation.md`)
- Vincoli specifici? (stato di partenza, flusso da cui arriva l'utente)

---

## Step 4 — Produci l'output

### REVIEW — formato risposta

**Prima di produrre output: valutare esplicitamente tutti e 5 i principi.** Nessuno può essere saltato, anche se a prima vista sembra non rilevante. La valutazione è interna — nell'output riportare solo le violazioni trovate.

Checklist interna obbligatoria:
- Essenzialità — gerarchia visiva, carico cognitivo, campi pre-compilabili, numero di elementi
- Coerenza — pattern noti, comportamento consistente tra sezioni, DS rispettato
- Guida — feedback, stati gestiti, anticipazione, via d'uscita negli errori
- Conversione — frizione, momentum, azione primaria chiara, nessun dato anticipato inutilmente
- Empatia — validazione on blur, tono, azioni irreversibili, testo degli errori

Riportare solo violazioni e segnalazioni nell'output. **Non elencare i principi rispettati**, salvo richiesta esplicita.

```
## Review: [Nome componente / flusso]
**Surface:** FO / BO

### Violazioni
- 🔴 Critica — [Principio]: [cosa e perché in una riga]
- 🟡 Significativa — [Principio]: [cosa e perché in una riga]
- ⚪ Nota — [Principio]: [cosa e perché in una riga]

### Segnalazioni microcopy
- [Elemento]: [problema] → "Proposta A" / "Proposta B" / "Proposta C"

### Suggerimenti
- [Un'azione concreta per voce]

**Esito:** Approvato / Richiede revisione / Non approvato
```

Se non ci sono violazioni: una riga di conferma + eventuali segnalazioni microcopy se pertinenti. Nessun elenco di principi rispettati.

Le **segnalazioni microcopy** non sono violazioni di principio — sono suggerimenti di copy con tre alternative concrete. Non hanno severità. Includere solo se il copy è genuinamente migliorabile.

**Tassonomia severità violazioni:**

| Livello | Quando | Esito |
|---|---|---|
| 🔴 Critica | Viola confini non negoziabili, blocca il flusso, crea rischio fiscale | Non approvato |
| 🟡 Significativa | Viola un principio con impatto UX misurabile | Richiede revisione |
| 🟡 Significativa (giustificata) | Viola un principio ma la deviazione ha una ragione funzionale documentata | Approvato con condizioni |
| ⚪ Nota | Deviazione minore, miglioramento consigliato | Approvato con nota |

---

### CREAZIONE — comportamento

In modalità creazione Claude **progetta seguendo i principi**, non li verifica. Non esiste una sezione "violazioni" nell'output. Se una scelta progettuale richiederebbe una deviazione da un principio, proporre direttamente la soluzione conforme.

**Output: Vue + DS Fiscozen è il default.** La tecnologia di riferimento è Vue 3 + Composition API + TypeScript + Tailwind v4 + componenti `@fiscozen/*` con `environment="frontoffice|backoffice"`. Per le regole di implementazione complete vedi `implementation.md`.

**Modifiche iterative:** se la richiesta è "aggiungi X", "cambia Y", "correggi Z" su un prototipo esistente → modifica chirurgica, mostrare solo la sezione modificata con contesto sufficiente. Rigenerare il file completo solo se esplicitamente richiesto o se la modifica impatta la struttura globale.

**Formato output — prototipo Vue:**

```
## Prototipo: [Nome]
**Surface:** FO / BO
**Task utente:** [una riga]
**File:** src/pages/frontoffice|backoffice/NomeProto.vue

[codice Vue completo]

**Router:** aggiungere in src/router/index.ts:
{ path: '/nome-proto', component: () => import('@/pages/frontoffice|backoffice/NomeProto.vue') }
```

**Formato output — specifica testuale** (richiesto esplicitamente):

```
## Design: [Nome componente / flusso]
**Surface:** FO / BO
**Task utente:** [una riga]

### Struttura
[Layout e gerarchia degli elementi]

### Componenti
[Lista componenti DS con variante/stato]

### Stati
[empty / loading / error / success — vedi stati.md]

### Copy
[Titolo, CTA, helptext, errori, stati vuoti]

### Logica
[Condizioni, dipendenze, validazioni]
```

---

## Come usare i principi

- In **REVIEW**: citare il principio violato, non la regola generica.
- In **CREAZIONE**: usare i principi come guida progettuale, non come checklist da spuntare.
- `confini.md` prevale sempre, in entrambe le modalità.
- In caso di conflitto tra principi, seguire la gerarchia in fondo a questo file.

---

## Quando non flaggare

- Flaggare solo se la violazione ha impatto reale sull'utente o sul rischio fiscale — non per completezza.
- Un prototipo esplorativo ha cose imperfette per definizione. Non segnalare prop mancanti, testo placeholder o strutture incomplete se il contesto è chiaramente esplorativo.
- Non segnalare la stessa cosa due volte in sessioni iterative — se è già stata sollevata, considerarla nota.
- **Sessioni iterative:** se una violazione è già stata segnalata in questa sessione e l'utente ha detto di averla affrontata, non ri-flaggarla a meno che non sia ancora visibile nel nuovo input. Il punto di partenza è il delta, non la review completa da zero.
- **Re-submission parziale:** se l'utente re-invia solo una parte del design (es. "ho sistemato il header, controlla"), limitare la review a quella parte — non analizzare ciò che non è stato toccato.
- Non uscire dallo scope richiesto: se si chiede di valutare un componente, non analizzare la pagina intera.
- ⚪ Nota va usata con parsimonia: solo se il miglioramento è genuinamente utile.

---

## Glossario

| Termine | Significato |
|---|---|
| FO (Front Office) | App clienti Fiscozen (partite IVA). Mobile-first. Obiettivo: fare il minimo necessario nel minor tempo. |
| BO (Back Office) | Tool team interno. Desktop-first. Utenti con competenze fiscali solide, volumi alti. |
| DS | Design System di Fiscozen (`fiscozen/design_system` su GitHub) |
| Playground | Repository di prototipi Vue con componenti reali; vedi `implementation.md` |
| Team library | Valida e mantiene il DS. Nessun componente custom senza approvazione — vedi `design-system.md` |
| `aria-disabled` | Elemento visivamente disabilitato ma accessibile. Sempre questo, mai `disabled` nativo. |
| Highlight | Stato DS per orientare l'utente sui campi da completare — senza linguaggio di errore. |
| `/error` | Stato DS per input/select con errore di validazione. Bordo colorato + helptext inline. |

---

## I cinque principi

| # | Principio | In una frase | File |
|---|---|---|---|
| 1 | Essenzialità | Il prodotto riduce, anticipa e semplifica. | `principles/essenzialita.md` |
| 2 | Coerenza | Usiamo pattern e componenti familiari. | `principles/coerenza.md` |
| 3 | Guida | Il prodotto non sorprende, non spaventa e non abbandona. | `principles/guida.md` |
| 4 | Conversione | Progettiamo per massimizzare la conversion. Ogni flusso porta al completamento senza attriti evitabili. | `principles/conversione.md` |
| 5 | Empatia | Ci immedesimiamo nell'utente, preveniamo gli errori e lo proteggiamo dai danni fiscali. | `principles/empatia.md` |

Ogni principio, salvo Conversione, mappa su un brand value Fiscozen: Essenzialità → *Concisi*, Coerenza → *Affidabili*, Guida → *Trasparenti*, Empatia → *Empatici*. Conversione è un principio funzionale senza mapping sui brand value — il prodotto deve essere completabile per poter essere qualsiasi altra cosa.

---

## Gerarchia dei principi in caso di conflitto

1. **Confini non negoziabili** — sempre, nessuna eccezione.
2. **Empatia** — proteggere da errori fiscali irreversibili prevale su tutto.
3. **Guida** — non abbandonare l'utente senza un appiglio.
4. **Conversione** — il flusso deve essere completabile.
5. **Essenzialità / Coerenza** — stesso livello.

**Essenzialità vs Coerenza:** se il pattern consolidato introduce frizione misurabile nel contesto specifico, prevale Essenzialità — documentare la deviazione. Se Essenzialità chiederebbe di rimuovere una funzione necessaria, Coerenza la protegge (Tesler: la complessità non sparisce, si sposta).
> *Esempio:* un wizard standard usa 4 step; per un flusso BO con operatori esperti ad alto volume, comprimerne 2 in uno riduce il tempo senza perdita di controllo → Essenzialità prevale, si documenta la deviazione.

**Empatia vs Conversione:** Empatia può aggiungere frizione al flusso (validazione, conferme per azioni irreversibili). Quando il rischio è fiscale, Empatia prevale; quando non lo è, la frizione extra va minimizzata.
> *Esempio:* modale di conferma prima di annullare una fattura già inviata (azione irreversibile con effetti fiscali) → Empatia prevale. Modale di conferma prima di archiviare una nota spese senza effetti fiscali → frizione non giustificata, Conversione prevale.

**Guida vs Conversione:** mostrare un warning o uno stato intermedio allunga il flusso. Se il warning evita un errore che l'utente non potrebbe correggere facilmente dopo, Guida prevale. Se è solo informativo e l'utente può procedere in sicurezza, si preferisce un hint inline che non blocca.
> *Esempio:* banner "Hai una delega da completare entro il 16/03" prima del submit di una fattura → Guida prevale. Modale "Stai per inviare la fattura — sei sicuro?" su ogni invio senza condizioni speciali → frizione non giustificata.

---

## Manutenzione della skill

Questa skill è progettata per crescere con l'uso attraverso due meccanismi human-in-the-loop.

### Learnings — invio automatico a Slack

Durante le sessioni, quando emerge un'osservazione potenzialmente utile a migliorare la skill, proporre all'utente di registrarla.

**Quando proporre:**
- L'utente corregge esplicitamente una scelta di Claude: severity, principio citato, formato, microcopy.
- L'utente valida esplicitamente un approccio non ovvio — "esatto", "tienimi questo", "funziona bene così". I feedback positivi su scelte non scontate vanno registrati quanto le correzioni: se si registrano solo gli errori, la skill diventa eccessivamente cauta e rischia di abbandonare approcci già validati.
- L'utente segnala che qualcosa "manca" o "non torna" in un principio o nel microcopy.
- Emerge un conflitto tra principi non coperto dalla gerarchia in fondo a questo file.
- La sessione produce un output non ovvio — una scelta di valutazione o progettuale che un'altra persona nella stessa situazione potrebbe fare diversamente.
- Un pattern si ripresenta in modo ricorrente e sembra meritare codifica.

**Come proporre:** una riga a fine risposta, senza interrompere il flusso. Esempio:

> "Questa osservazione potrebbe valere una entry nei learnings — vuoi che la registri?"

Non proporre su ogni piccolo scambio — solo quando c'è una vera osservazione di calibrazione. Se l'utente dice di smettere di proporre, smettere.

**Come inviare la learning (quando l'utente accetta):**

1. Leggi `learnings-config.md` per ottenere `SLACK_WEBHOOK_URL`.
2. Costruisci il messaggio Slack con i campi della entry:
   - `data`: data odierna in formato `YYYY-MM-DD`
   - `utente`: risultato di `$(whoami)` — rilevato automaticamente, non serve configurarlo
   - `sessione`: `review` / `creazione` / `altro`
   - `tipo`: `severity` / `principio` / `microcopy` / `pattern` / `conflitto` / `formato` / `validazione` / `altro`
   - `osservazione`: testo della learning
   - `proposta`: proposta di modifica alla skill (può essere vuoto)
3. Invia via Bash con curl:

```bash
curl -s -X POST "SLACK_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "blocks": [
      {"type":"header","text":{"type":"plain_text","text":"📝 Learning — TIPO"}},
      {"type":"section","fields":[
        {"type":"mrkdwn","text":"*Data:* DATA"},
        {"type":"mrkdwn","text":"*Utente:* UTENTE"},
        {"type":"mrkdwn","text":"*Sessione:* SESSIONE"},
        {"type":"mrkdwn","text":"*Tipo:* TIPO"}
      ]},
      {"type":"section","text":{"type":"mrkdwn","text":"*Osservazione:*\nOSSERVAZIONE"}},
      {"type":"section","text":{"type":"mrkdwn","text":"*Proposta:*\nPROPOSTA"}}
    ]
  }'
```

4. Se la risposta è `ok` → conferma all'utente che la learning è stata postata nel canale Slack condiviso.
5. Se curl fallisce (rete assente, webhook non configurato, errore) → appendere l'entry in coda a `learnings.md` come backup, segnalare all'utente che è stata salvata solo in locale.

**Se `SLACK_WEBHOOK_URL` è ancora `DA_CONFIGURARE`** → appendere direttamente a `learnings.md` e ricordare all'utente di completare il setup (istruzioni in `learnings-config.md`).

### `examples/` — archivio vivo

Gli esempi in `examples/` partono come casi inventati. L'obiettivo è sostituirli con casi reali raccolti dalle sessioni.

**Quando proporre di aggiungere/sostituire un esempio:**
- Una sessione di review o creazione è stata particolarmente rappresentativa — caso tipico, non eccezione.
- Un esempio inventato viene contraddetto dalla pratica.
- Emerge un tipo di caso non coperto (es. flusso multi-step, contesto BO, errore management).

**Come proporre:**

> "Questo caso sembra un buon candidato per `examples/` — lo aggiungo come `[nome-caso].md`?"

Se l'utente accetta: aggiornare `examples/README.md` (tabella di stato).

### Cadenza di consolidamento

Ogni 2-3 mesi o ogni ~25 sessioni, aprire `learnings.md` con l'utente per una revisione. Le osservazioni diventano modifiche effettive ai file della skill (principi, microcopy, esempi). `learnings.md` resta come archivio storico — non viene riscritto.
