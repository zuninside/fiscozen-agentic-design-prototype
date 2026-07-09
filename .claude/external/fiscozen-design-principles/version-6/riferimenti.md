# Riferimenti teorici

Leggi, euristiche e principi citati nei design principles di Fiscozen.

---

## Euristiche di Nielsen
Fonte: nngroup.com/articles/ten-usability-heuristics

**1. Visibilità dello stato del sistema**
Il sistema deve sempre tenere gli utenti informati su cosa sta succedendo, attraverso feedback appropriati e in tempi ragionevoli. La comunicazione aperta e continua costruisce fiducia nel prodotto.

**2. Corrispondenza tra sistema e mondo reale**
Il design deve parlare il linguaggio degli utenti — parole, frasi e concetti familiari, non gergo interno. Seguire le convenzioni del mondo reale rende l'interfaccia intuitiva.

**3. Controllo e libertà dell'utente**
Gli utenti compiono spesso azioni per errore. Hanno bisogno di una "uscita di emergenza" chiaramente marcata per abbandonare l'azione indesiderata senza dover seguire un processo lungo. Supportare Undo e Redo.

**4. Consistenza e standard**
Gli utenti non dovrebbero chiedersi se parole, situazioni o azioni diverse significano la stessa cosa. Seguire le convenzioni di piattaforma e di settore. Mantenere consistenza interna (stesso prodotto) ed esterna (ecosistema).

**5. Prevenzione degli errori**
Un design attento previene i problemi prima che si verifichino. Eliminare le condizioni soggette a errori o verificarle e presentare agli utenti un'opzione di conferma prima che si impegnino in un'azione. Due tipi di errori: slip (inconsci, per distrazione) e mistake (consci, per modello mentale errato).

**6. Riconoscimento piuttosto che ricordo**
Minimizzare il carico di memoria dell'utente rendendo visibili elementi, azioni e opzioni. L'utente non dovrebbe dover ricordare informazioni da una parte all'altra dell'interfaccia.

**9. Aiutare gli utenti a riconoscere, diagnosticare e correggere gli errori**
I messaggi di errore devono essere espressi in linguaggio semplice (nessun codice di errore), indicare precisamente il problema e suggerire costruttivamente una soluzione.

---

## Leggi UX
Fonte: lawsofux.com

**Jakob's Law**
Gli utenti passano la maggior parte del tempo su altri siti. Preferiscono che il tuo sito funzioni come tutti gli altri siti che già conoscono. Trasferiranno le aspettative costruite attorno a un prodotto familiare a un altro che sembra simile.

**Legge di Hick**
Il tempo necessario per prendere una decisione aumenta con il numero e la complessità delle scelte. Minimizzare le scelte quando i tempi di risposta sono critici. Suddividere i task complessi in step più piccoli per ridurre il carico cognitivo. Evidenziare le opzioni raccomandate per evitare di sopraffare gli utenti.

**Miller's Law**
La persona media può mantenere solo 7 (più o meno 2) elementi nella propria memoria di lavoro. Organizzare i contenuti in blocchi più piccoli per aiutare gli utenti a elaborare, comprendere e memorizzare più facilmente.

**Legge di Fitts**
Il tempo per acquisire un target è funzione della distanza e della dimensione del target. I touch target devono essere abbastanza grandi da essere selezionati accuratamente, avere spaziatura sufficiente tra loro ed essere posizionati in aree dell'interfaccia facilmente raggiungibili.

**Legge di Tesler — Conservazione della complessità**
Per qualsiasi sistema esiste una certa quantità di complessità che non può essere ridotta. Tutti i processi hanno un nucleo di complessità che non può essere eliminato dal design e deve quindi essere gestito dal sistema o dall'utente. Assicurarsi che il maggior carico possibile sia sollevato dagli utenti durante il design e lo sviluppo.

**Legge di Zeigarnik**
Le persone ricordano meglio i task incompleti o interrotti rispetto a quelli completati. Fornire un progresso artificiale verso un obiettivo aiuta gli utenti a essere più motivati a completare il task. Indicatori chiari di progresso aumentano la probabilità di completamento.

**Legge di Postel**
Sii liberale in ciò che accetti e conservativo in ciò che invii. Essere empatici, flessibili e tolleranti verso le varie azioni che l'utente potrebbe compiere. Accettare input variabili dagli utenti traducendoli nel formato corretto, e fornire feedback chiari sui limiti accettati.

---

## Principi comportamentali

**Peak-End Rule**
Le persone giudicano un'esperienza principalmente in base a come si sono sentite nel momento più intenso e alla fine — non in base alla somma totale o alla media di ogni momento. L'effetto si verifica indipendentemente dal fatto che l'esperienza sia piacevole o spiacevole.
Fonte: en.wikipedia.org/wiki/Peak-end_rule

**Affect Heuristic**
Una scorciatoia mentale in cui l'emozione attuale — paura, piacere, sorpresa — influenza le decisioni. È un processo subconscio che accorcia il processo decisionale. Se i sentimenti verso un'attività sono positivi, le persone tendono a giudicare i rischi come bassi e i benefici come alti, e viceversa.
Fonte: en.wikipedia.org/wiki/Affect_heuristic

**Effetto IKEA**
L'aumento nella valutazione dei prodotti costruiti da sé (Norton, Mochon, Ariely). Le persone attribuiscono più valore agli oggetti a cui hanno contribuito con il proprio tempo ed energie. Le attività non devono essere troppo complesse (rischio di abbandono), le istruzioni devono essere chiare, e vanno inseriti vincoli nella creatività.

**Cognitive Load Theory**
Lo sforzo utilizzato nella memoria di lavoro. La memoria di lavoro è estremamente limitata in capacità e durata. Il design istruttivo può ridurre il carico cognitivo estraneo — quello legato al modo in cui le informazioni sono presentate — liberando risorse per l'elaborazione dei contenuti.
Fonte: en.wikipedia.org/wiki/Cognitive_load

**Cry Wolf Effect**
La tendenza degli utenti a non fidarsi dell'automazione o delle notifiche dopo che si sono ripetutamente rivelate falsi allarmi. Dal racconto del "ragazzo che gridò al lupo": quando tutto sembra urgente, l'utente smette di rispondere anche ai segnali critici reali.

---

## Altri principi

**Progressive Disclosure**
Inizialmente mostrare agli utenti solo poche delle opzioni più importanti. Offrire un insieme più ampio di opzioni specializzate su richiesta. Migliora l'apprendibilità, l'efficienza d'uso e riduce il tasso di errore. Il fatto stesso che qualcosa appaia nella schermata iniziale comunica agli utenti che è importante.
Fonte: nngroup.com/articles/progressive-disclosure

**Signal-to-noise ratio**
Il rapporto tra informazioni rilevanti (segnale) e irrilevanti (rumore) in un'interfaccia. Qualsiasi cosa gli utenti debbano elaborare può essere segnale o rumore. Puntare a un alto rapporto segnale-rumore migliora l'efficienza della comunicazione e aiuta gli utenti a completare i loro task.
Fonte: nngroup.com/articles/signal-noise-ratio

**Plain Language Principles**
Comunicare chiaramente per chiunque, non solo per chi non è esperto. Vantaggi: comunica informazioni in modo succinto ed efficiente, beneficia tutti i tipi di utenti, è facilmente ricercabile. Tecniche principali: conoscere il proprio pubblico, scegliere parole familiari al contesto, usare frasi brevi, supportare la scansione con formattazione appropriata.
Fonte: nngroup.com/articles/plain-language-experts

**Constraint-based Design**
Le capacità di un sistema si comprendono meglio anche dai suoi limiti e vincoli, non solo dalle sue funzionalità. Limitare le scelte possibili a quelle valide è più efficace che segnalare l'errore dopo. Rende i design più semplici, migliora l'esperienza degli sviluppatori e riduce i costi forzando implementazioni in componenti riutilizzabili e robusti.

**Atomic Design (Brad Frost)**
Una metodologia per pensare alle UI come gerarchie ponderate: atomi, molecole, organismi, template, pagine. Ogni livello riusa e combina quello precedente. Aggiungere componenti non validati fuori dal sistema rompe la coerenza a cascata.
Fonte: atomicdesign.bradfrost.com
