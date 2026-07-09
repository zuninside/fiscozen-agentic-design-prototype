# Guida

> Il prodotto non sorprende, non spaventa e non abbandona. Accompagna l'utente con il giusto livello di informazione, nel momento in cui serve.

## Cosa significa

Il contesto fiscale genera ansia. I nostri utenti — nel FO spesso privi di competenze specialistiche, nel BO sotto pressione di volumi alti — si trovano davanti a dati complessi, scadenze con conseguenze economiche e decisioni che non sempre capiscono appieno. Il prodotto deve ridurre questa ansia, non amplificarla.

La guida si manifesta nel non lasciare mai l'utente senza un appiglio: in ogni momento deve sapere cosa è appena successo, cosa significa per lui, e cosa può fare dopo. Non si tratta di produrre più testo o più notifiche — si tratta di costruire ciò che serve, quando serve, nel posto dove serve (e solo allora).

La guida **non è tono di voce** — quello vive nel microcopy e nel brand book. La guida è **l'insieme dei pattern di design che mantengono un dialogo continuo tra prodotto e utente**: feedback dopo un'azione, contesto intorno a un dato difficile, via d'uscita quando qualcosa va storto, anticipazione del bisogno informativo prima che diventi un ostacolo, introduzione progressiva dei temi complessi prima che diventino urgenti.

### I quattro momenti di guida

La guida si attiva in quattro situazioni specifiche, ciascuna con la sua logica:

- **Prima che l'errore accada** — la guida più efficace evita all'utente di trovarsi davanti a un problema. I campi mostrano il formato atteso prima della digitazione (placeholder con esempio, helptext sotto al label per i campi non ovvi). Le opzioni sono pre-filtrate e ordinate per rilevanza, in modo che la scelta più probabilmente corretta sia in cima. I dati che richiederanno azione vengono anticipati con il giusto preavviso — una scadenza F24 a venti giorni è guida, la stessa il giorno prima è solo un allarme.

- **Dopo un'azione significativa** — il toast conferma l'azione in modo sintetico. "Fattura inviata." è sufficiente. Il contesto aggiuntivo, quando necessario, viene dato dalla schermata o dallo stato successivo, non dal toast. Un toast troppo lungo non viene letto: la brevità è una condizione, non una limitazione.

- **Dopo un dato difficile da interpretare** — i dati fiscali complessi sono sempre accompagnati da una spiegazione. L'utente non si trova mai solo davanti a un numero senza capire cosa significa, da dove viene, e quando dovrà agire di conseguenza. I dati importanti vengono **introdotti prima che diventino urgenti** — non la prima volta quando c'è già una scadenza imminente.

- **Dopo un errore** — non limitarsi a segnalarlo, indicare la via d'uscita. "Delega mancante" non basta; "Completa la delega per procedere — ci vogliono circa 5 minuti" chiude il loop perché l'utente sa cosa fare subito dopo.

### Tipi di dato

Non tutti i dati si leggono allo stesso modo. La guida adatta il livello di contesto al tipo di dato:

| Tipo | Quando usarlo | Esempio |
|---|---|---|
| Dato puro | Autoesplicativo, nessuna spiegazione necessaria | Fatturato totale: €34.200 |
| Dato con contesto | Ha senso solo con un riferimento comparativo | Fatturato: +23% rispetto all'anno scorso |
| Dato verificabile | Esclusivo BO — il professionista deve poter controllare il calcolo | Imponibile lordo, ritenute, netto da versare con dettaglio del calcolo |

Presentare un dato con contesto come se fosse puro lo rende indecifrabile. Presentare un dato puro con contesto forzato lo svilisce. La scelta del tipo non è estetica: è ciò che determina se il dato serve all'utente o gli aggiunge lavoro.

### Gestione degli stati

La guida vale anche negli stati vuoti, di caricamento e di errore. Uno stato vuoto non è mai solo un contenitore vuoto: deve spiegare perché è vuoto e cosa fare per popolarlo. Uno stato di caricamento deve comunicare attività, non lasciare l'utente incerto. Uno stato di errore deve sempre indicare la via d'uscita. Per il framework completo vedi `stati.md`.

## Come si applica

**FO:** i dati fiscali complessi vengono introdotti prima che diventino urgenti. Ogni dato difficile è accompagnato dal suo contesto. Dopo ogni azione rilevante l'utente riceve un feedback che conferma cosa è successo e, dove necessario, cosa fare dopo. I messaggi di errore indicano sempre la via d'uscita.

**BO:** i commercialisti devono poter verificare i calcoli senza uscire dalla pagina. I dati verificabili mostrano il dettaglio del calcolo — imponibile lordo, ritenute, netto — accessibile inline. Le notifiche critiche sono chiare ma non allarmistiche: il professionista ha bisogno di precisione, non di pressione.

## Perché funziona

- **Peak-End Rule:** le persone giudicano un'esperienza in base al momento più intenso e alla fine. Gestire bene i picchi emotivi — importi dovuti, scadenze vicine, errori bloccanti — determina la percezione complessiva del prodotto.
- **Euristica di Nielsen n°1 — Visibilità dello stato del sistema:** dopo ogni azione l'utente sa cosa è successo e cosa succederà.
- **Affect Heuristic:** lo stato emotivo dell'utente influenza le sue decisioni. Un tono allarmistico amplifica l'ansia e riduce la capacità di agire. Una comunicazione calma con un'azione chiara ha l'effetto opposto.
- **Cognitive Load Theory:** introdurre dati complessi progressivamente rispetta la capacità di elaborazione dell'utente e riduce il rischio di decisioni sbagliate per sovraccarico informativo.

## Test decisivo

- I dati e i contesti necessari sono disponibili *prima* che l'utente li cerchi o ne abbia bisogno?
- Dopo ogni azione rilevante, l'utente sa cosa è successo e cosa fare dopo?
- I dati fiscali complessi sono accompagnati dal contesto necessario per essere interpretati?
- I messaggi di errore indicano il problema *e* la via d'uscita, non solo il problema?
- I dati importanti vengono introdotti prima di diventare urgenti?

## Segnale di allarme

Un dato fiscale importante appare per la prima volta quando c'è già una scadenza imminente. Oppure: un messaggio di errore dice che c'è un problema senza spiegare come risolverlo. Oppure: uno stato vuoto mostra solo un contenitore vuoto, senza indicare cosa fare. Oppure: l'utente arriva a un campo o a un dato senza alcun contesto preliminare e deve dedurre da solo come comportarsi.
