# Empatia

> Progettiamo con empatia: ci immedesimiamo nell'utente, preveniamo gli errori e lo proteggiamo dai danni fiscali. L'interfaccia perdona, l'utente resta sempre in controllo.

## Cosa significa

Nel contesto fiscale gli errori hanno conseguenze reali. Una fattura con dati sbagliati, un'anagrafica incompleta, un'aliquota IVA errata possono generare problemi operativi per il commercialista e, nei casi più gravi, conseguenze legali per l'utente. Ma il contesto fiscale è anche un contesto **emotivamente carico**: scadenze con sanzioni, importi da versare, normative complesse generano ansia a prescindere da quanto bene sia progettato il prodotto. Il design può ridurre questa ansia o amplificarla — non può essere neutrale.

Empatia significa due cose allo stesso tempo. La prima è **proteggere l'utente dagli errori fiscali irreversibili** — prevenirli quando possibile, intercettarli nel momento in cui si verificano, fornire sempre una via d'uscita. La seconda è **non far sentire l'utente in colpa per gli errori che commette** — perché un utente in colpa si blocca, mentre un utente rassicurato corregge e continua.

Queste due dimensioni sono inseparabili. I pattern di validazione più eleganti diventano ostili se il messaggio che accompagna l'errore drammatizza. Il tono più caldo del mondo è inutile se il form ti sbatte in faccia dieci errori tutti insieme al submit finale. Empatia è la somma: **proteggere con rigore, comunicare con calma**.

Il principio fondamentale della protezione è che **la risposta è proporzionale alla certezza del sistema**.

- Quando il sistema sa con certezza che un dato è errato — codice fiscale non valido, combinazione di valori impossibile — blocca e segnala immediatamente.
- Quando il sistema ha un'opinione sulla scelta migliore ma non certezza assoluta — aliquota IVA consigliata in base al codice ATECO — suggerisce e pre-filtra, ma lascia libertà di scelta. Proteggere non significa togliere autonomia.
- Quando un'azione è irreversibile, chiede conferma esplicita con descrizione delle conseguenze reali.

### Validazione contestuale

Ogni campo viene validato nel momento giusto, non tutti al submit finale. Il submit che sputa fuori dieci errori contemporaneamente è l'anti-pattern che questo principio esiste per evitare — è il momento in cui l'utente si sente stupido, mentre era il prodotto a doversi comportare meglio.

| Tipo di errore | Quando segnalarlo | Come veicolarlo |
|---|---|---|
| Errore oggettivo su singolo campo (formato CF, lunghezza P.IVA) | On blur — appena l'utente esce dal campo senza compilarlo correttamente | Helptext inline sotto il campo, stato `/error`, testo: problema + soluzione |
| Campo obbligatorio non ancora toccato | Mai — stato neutro finché l'utente non interagisce | Nessun segnale negativo; l'orientamento è affidato al button ghost (vedi sotto) |
| Combinazione di valori impossibile (select a cascata) | Non permessa in primo luogo — le opzioni incompatibili non sono selezionabili | Il campo dipendente mostra solo le opzioni valide per la selezione precedente |

Per il tono esatto degli helptext e degli stati di errore, vedi `microcopy.md` — il principio qui definisce *perché* si comunica in un certo modo, le regole operative di wording stanno lì.

### CTA e orientamento sui campi mancanti

La CTA principale usa `aria-disabled` — visivamente disabilitata ma tecnicamente raggiungibile da tastiera e screen reader, a differenza dell'attributo HTML `disabled` che esclude l'elemento dalla navigazione accessibile.

Su form con alta densità o carico cognitivo elevato, è consigliabile affiancare alla CTA un button ghost con etichetta dinamica **"N campi da completare"**, aggiornato in tempo reale mentre l'utente compila. Al click attiva lo stato Highlight su tutti i campi obbligatori non ancora compilati, rendendo immediatamente visibile cosa manca **senza usare il linguaggio dell'errore** — i campi non sono sbagliati, sono semplicemente incompleti. È la differenza tra "stai sbagliando" e "ti manca ancora questo".

Su form semplici con pochi campi visibili il button ghost può essere omesso.

### Adattamento contestuale del form

Il form mostra solo i campi necessari in base alle scelte già fatte dall'utente, e ne introduce di nuovi quando una selezione lo richiede. Se l'utente classifica una spesa come cespite, appare il campo categoria cespite (che non era visibile prima perché non rilevante). Se l'utente cambia classificazione, quel campo scompare. Il principio vale in entrambe le direzioni: non mostrare campi irrilevanti riduce la confusione, non omettere campi necessari previene errori a valle.

### Campi dipendenti da backend

Alcuni campi si popolano dinamicamente tramite chiamata al backend — per esempio un dropdown di comuni che dipende dalla provincia selezionata, o una lista di casse previdenziali che dipende dalla professione. Questi campi hanno quattro stati da gestire esplicitamente:

- **Loading** — il campo mostra attività durante la chiamata, l'utente non pensa che sia rotto.
- **Success** — le opzioni si popolano, il campo diventa selezionabile.
- **Reset valore** — quando l'utente cambia la selezione precedente, il valore del campo dipendente va azzerato. Un valore silenziosamente non valido è peggio di nessun valore.
- **Error** — la chiamata è fallita, mostrare un messaggio con via d'uscita (retry, campo manuale, contatto supporto).

Per il framework completo degli stati vedi `stati.md`.

### Toast vs helptext inline vs dialog di conferma

I toast non sono strumenti di validazione — sono feedback su eventi già avvenuti. Si usano in due soli casi: errori di sistema imprevisti e conferme di azioni completate. **Non si usano mai per segnalare errori su campi di un form.**

| Strumento | Quando usarlo |
|---|---|
| Helptext inline `/error` | Errore su un campo specifico, on blur |
| Toast errore | Errore di sistema, non legato a un campo specifico |
| Toast successo | Conferma di azione completata |
| Dialog di conferma | Azione irreversibile che richiede consapevolezza esplicita |

### Conferma prima delle azioni irreversibili

Ogni azione che non può essere annullata richiede una dialog con la descrizione esatta delle conseguenze. Non "Sei sicuro?" — domanda chiusa che non informa e fa sentire l'utente sotto interrogatorio — ma "Stai per eliminare il cliente Mario Rossi. Tutte le fatture associate verranno archiviate." La dialog descrive, non interroga.

### La dimensione emotiva

Tutti i pattern sopra servono a un fine emotivo preciso: **far sì che l'utente resti in controllo anche quando sbaglia**. Un utente che si blocca davanti a un errore non è un utente disattento — è un utente a cui il prodotto sta comunicando "hai fatto qualcosa di grave". Empatia chiede il contrario: comunicare "ti manca questo e lo completi in un secondo", oppure "questa cosa non si può fare, vediamo come arrivare a quello che ti serve", oppure semplicemente "riprova, a volte capita".

Il tono non amplifica mai l'ansia che il contesto fiscale già genera. Non usa esclamazioni ("Errore!", "Attenzione!"), non usa superlativi allarmistici ("problema grave", "operazione critica"), non mette in bocca all'utente parole di auto-colpevolizzazione ("ho fatto un errore"). Usa un linguaggio operativo: *problema — soluzione — tempo per risolverlo quando serve*. Per le regole complete di microcopy in situazioni ad alta tensione, vedi `microcopy.md`.

## Come si applica

**FO:** validazione on blur campo per campo. Nessun errore prematuro sui campi non toccati. Il button ghost "N campi da completare" orienta l'utente senza usare il linguaggio dell'errore. I form si adattano alla tipologia di cliente. I campi dipendenti da backend gestiscono esplicitamente loading, success, reset e error. Le azioni irreversibili hanno sempre una dialog di conferma esplicita che descrive le conseguenze. I messaggi di errore indicano problema e soluzione, senza drammatizzare.

**BO:** stessa struttura di validazione, linguaggio più tecnico negli helptext. Su form densi il button ghost è particolarmente utile per dare una visione d'insieme dei campi mancanti. Le azioni che impattano la posizione fiscale di un cliente richiedono sempre conferma esplicita. Il tono è più diretto e denso ma mantiene la stessa logica: proteggere dal rischio fiscale, non far sentire il professionista sotto esame.

## Perché funziona

- **Euristica di Nielsen n°5 — Prevenzione degli errori:** prevenire un errore è sempre preferibile a gestirlo dopo. Nel contesto fiscale alcune azioni non sono reversibili.
- **Euristica di Nielsen n°9 — Aiutare gli utenti a riconoscere, diagnosticare e correggere gli errori:** i messaggi di errore devono indicare il problema *e* suggerire la soluzione. Non "Errore di validazione" ma "Il codice fiscale deve avere 16 caratteri — ne hai inseriti 14."
- **Constraint-based design:** limitare le scelte possibili a quelle valide è più efficace che segnalare l'errore dopo. Le select a cascata che mostrano solo opzioni valide proteggono l'utente senza richiedere attenzione esplicita.
- **Legge di Postel:** accetta input in formati diversi quando possibile — codice fiscale con o senza spazi, P.IVA con o senza prefisso IT — ma produci sempre output nel formato corretto. La tolleranza è empatia applicata al parsing.
- **Affect Heuristic:** lo stato emotivo dell'utente influenza le sue decisioni. Un tono allarmistico amplifica l'ansia e riduce la capacità di agire. Una comunicazione calma con un'azione chiara ha l'effetto opposto.
- **Euristica di Nielsen n°3 — Controllo e libertà dell'utente:** la sensazione di controllo è il primo fattore di fiducia. Poter tornare indietro, correggere, annullare senza danni permanenti è la condizione minima perché l'utente si senta al sicuro.

## Test decisivo

- Un campo compilato in modo errato mostra l'errore nel momento in cui l'utente lo abbandona, non prima e non solo alla fine?
- Un campo mai toccato resta in stato neutro, senza errori prematuri?
- Esiste un'azione irreversibile senza una dialog di conferma che spiega le conseguenze?
- I toast vengono usati per errori su campi di un form, invece dell'helptext inline?
- Il tono dei messaggi di errore indica problema e soluzione, senza drammatizzare o colpevolizzare?

## Segnale di allarme

Un campo obbligatorio non compilato mostra un errore prima che l'utente lo abbia mai toccato. Oppure: un campo dipendente da backend non gestisce il caso di reset del valore precedente — l'utente si ritrova un valore silenziosamente non valido. Oppure: un messaggio di errore dice che c'è un problema senza spiegare come risolverlo. Oppure: i toast vengono usati per segnalare errori su campi di un form invece dell'helptext inline. Oppure: una dialog di conferma chiede "Sei sicuro?" invece di descrivere le conseguenze dell'azione. Oppure: il tono di un messaggio di errore drammatizza ("Errore grave!") o colpevolizza l'utente ("Hai inserito un dato sbagliato").
