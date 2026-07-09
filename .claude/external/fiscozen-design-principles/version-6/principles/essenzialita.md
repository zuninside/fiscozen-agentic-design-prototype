# Essenzialità

> Il prodotto riduce, anticipa e semplifica: l'utente fa il minimo indispensabile per ottenere il risultato corretto.

## Cosa significa

I nostri utenti nel FO non sono commercialisti. Hanno aperto una partita IVA per fare il loro lavoro — non per imparare la normativa fiscale. Ogni volta che il prodotto chiede loro di sapere qualcosa che il sistema già conosce, o li costringe a capire un concetto fiscale per completare un'azione, stiamo scaricando su di loro un peso che dovremmo portare noi.

Essenzialità è la risposta operativa a questo problema: non "semplificare per chi non capisce", ma **eliminare il superfluo per chiunque**, calibrando il livello di dettaglio sul contesto e sul destinatario. Nel FO significa tradurre la complessità fiscale in azioni comprensibili per chi non ha competenze specifiche. Nel BO significa ridurre il carico operativo per professionisti che lavorano su volumi alti — automazione delle operazioni ripetitive, suggerimenti contestuali, coerenza tra pratiche diverse.

Il principio non è "meno è meglio" in senso assoluto. La complessità necessaria resta: spostarla fuori dall'interfaccia la sposta sull'utente o sul customer support (Legge di Tesler). Essenzialità è l'opposto: **portare la complessità dentro il sistema** perché l'utente non debba gestirla.

Essenzialità si esprime su tre dimensioni: **quante** informazioni richiediamo (livelli di intervento), **quando** le richiediamo (struttura dei flussi), e **con che peso visivo** le mostriamo (gerarchia). Un prodotto può essere essenziale nel cosa chiede ma fallire nel come lo mostra — una dashboard con il giusto numero di elementi ma tutti con lo stesso peso visivo non è essenziale, è piatta.

### I tre livelli di intervento

L'essenzialità si applica con intensità diverse in base a quanto il sistema sa del risultato corretto:

- **Automazione completa** — quando il sistema ha certezza assoluta, lo fa da solo, senza chiedere.
  *Esempio:* una nota di credito si compila automaticamente con i dati della fattura originale. Non c'è motivo di chiedere all'utente di reinserire gli stessi dati.

- **Alleggerimento guidato** — quando il sistema ha un'opinione fondata ma non certezza assoluta, suggerisce e pre-filtra. L'utente può comunque scegliere altro, ma la scelta più probabilmente corretta è già a portata di mano.
  *Esempio:* le aliquote IVA più usate per il codice ATECO dell'utente appaiono in cima alla lista; tutte le altre restano selezionabili.

- **Contestualizzazione umana** — quando il sistema deve chiedere qualcosa di complesso, lo spiega in linguaggio operativo, non fiscale. Non si rinomina un campo: si ristruttura la domanda perché l'utente riconosca la risposta giusta senza conoscere il termine tecnico.
  *Esempio:* invece di un campo secco "Regime contributivo" con una select, una schermata con titolo "Come gestisci i tuoi contributi?" e due opzioni descritte — "Verso i contributi ogni trimestre (gestione separata INPS)" oppure "Ho una cassa professionale, come gli avvocati o gli architetti" — con una riga di spiegazione sotto ciascuna.

### Struttura dei flussi

La stessa logica si applica al modo in cui il prodotto struttura le richieste all'utente:

| Tipo di flusso | Approccio |
|---|---|
| Sequenziale | Un'azione per schermata, progresso visibile |
| Documento componibile | Campi essenziali subito visibili, campi avanzati nascosti o in espansione |

Un flusso sequenziale che spezza più azioni in una sola schermata viola Essenzialità. Un documento componibile con tutti i campi avanzati in primo piano viola Essenzialità. In entrambi i casi il costo è lo stesso: l'utente elabora informazioni che non gli servono *ora*.

### Cosa possiamo togliere davvero

Essenzialità spinge a ridurre. Ma è importante distinguere due tipi di complessità che si comportano in modo molto diverso quando semplifichiamo.

- **Complessità visiva** — va sempre ridotta. Meno rumore, più spazio, gerarchia chiara. Non c'è un valore nel complicare visivamente ciò che può essere presentato in modo lineare.

- **Complessità funzionale** — dipende dal contesto. Rimuovere un'azione dall'interfaccia non elimina il bisogno che la genera: lo sposta al customer support, all'operations, all'help desk. Se togliere una funzione dal prodotto significa che l'utente deve scrivere in chat per fare la stessa cosa, quella funzione deve restare nel prodotto.

La domanda giusta non è "possiamo togliere questa funzione?" ma **"a chi stiamo spostando la complessità se la togliamo?"** È la Legge di Tesler: la complessità non sparisce, si sposta. Essenzialità ci chiede di portarla dentro il sistema, non di scaricarla su utenti o team interni mascherandola da semplificazione.

### Gerarchia visiva

Essenzialità non riguarda solo quanti elementi mostriamo, ma anche il **peso visivo** che assegniamo a ciascuno. Nel prodotto convivono informazioni con conseguenze molto diverse: una scadenza fiscale con sanzione, un'azione operativa da completare, un suggerimento promozionale, una notifica informativa. Se questi elementi hanno lo stesso peso visivo, l'utente non sa dove guardare prima — e nel contesto fiscale questo può avere conseguenze economiche reali.

Il peso visivo deve riflettere le **conseguenze reali per l'utente**, non la visibilità che vorremmo dare a una feature per ragioni di business. Assegnare peso dominante a un banner promozionale accanto a una scadenza con sanzione non è una scelta estetica — è una violazione di Essenzialità. Stiamo diluendo il segnale che l'utente deve vedere con rumore che potrebbe ignorare.

Ogni elemento del prodotto appartiene a uno di tre livelli, definiti dalle conseguenze che genera per l'utente:

| Livello | Tipo | Esempi |
|---|---|---|
| 🔴 Alta | Scadenza di legge con sanzione diretta | F24, invio fattura entro 12 giorni, dichiarazione dei redditi |
| 🟡 Media | Azione operativa senza sanzione diretta | Segnare una fattura come incassata, completare una delega, aggiornare anagrafica cliente |
| ⚪ Bassa | Suggerimento opzionale o elemento promozionale | Nessuna conseguenza se ignorato |

Un elemento 🔴 occupa la posizione dominante, usa pattern visivi forti, è inconfondibile. Un elemento ⚪ è chiaramente subordinato, non compete mai con livelli superiori, e usa pattern visivi distinti in modo che l'utente lo riconosca come secondario a colpo d'occhio.

Quando tutto sembra ugualmente urgente, niente lo è davvero (*cry wolf effect*): se una scadenza F24 e un suggerimento promozionale condividono lo stesso stile visivo, l'utente finisce per ignorarli entrambi. Moltiplicare i 🔴 non aumenta l'attenzione — la diluisce.

## Come si applica

**FO:** i campi pre-compilabili sono già compilati prima che l'utente arrivi alla schermata. Le opzioni più rilevanti per il contesto appaiono in cima o sono pre-selezionate. Nei flussi sequenziali ogni schermata ha una sola azione principale. Nei documenti componibili i campi avanzati sono nascosti o in espansione, non tutti visibili insieme. Il numero di opzioni mostrate è il minimo necessario per completare l'azione. Le attività con conseguenze fiscali occupano la posizione dominante nella schermata; gli elementi promozionali usano pattern visivi chiaramente diversi — colori, tipografia e componenti distinti — da quelli delle attività obbligatorie.

**BO:** stessa logica, applicata ai volumi alti. L'automazione evita di rifare manualmente le stesse operazioni in sequenza. I valori suggeriti riducono il rischio di incoerenze tra una pratica e l'altra. La densità informativa può essere più alta che nel FO, ma resta governata dalla stessa regola: niente di superfluo, solo ciò che serve al task corrente. Dentro una pagina con molti elementi, quelli a priorità alta restano immediatamente individuabili — la densità non autorizza a perdere la gerarchia.

## Perché funziona

- **Legge di Hick:** il tempo per prendere una decisione cresce con il numero di opzioni. Pre-filtrare e suggerire accorcia la decisione senza rimuoverne la libertà.
- **Miller's Law:** la memoria di lavoro gestisce circa 7 elementi (±2). Troppe scelte in una sola schermata superano la capacità dell'utente e aumentano gli errori.
- **Progressive Disclosure:** mostrare prima solo i campi essenziali riduce il carico cognitivo senza sacrificare funzionalità — ciò che serve di rado resta disponibile ma non occupa spazio primario.
- **Recognition over Recall (Euristica n°6):** è più facile riconoscere un'opzione corretta che ricordarla da zero. Suggerire l'aliquota IVA invece di chiederla sfrutta questo principio.
- **Legge di Tesler:** la complessità non sparisce quando la rimuoviamo dall'interfaccia — si sposta sull'utente o sul supporto. Essenzialità la sposta invece sul sistema.
- **Euristica di Nielsen n°1 — Visibilità dello stato del sistema:** le informazioni più critiche devono essere visibili senza che l'utente le cerchi. Assegnare peso visivo in base alle conseguenze reali è l'applicazione diretta di questa euristica.
- **Cry Wolf Effect:** quando tutto sembra urgente, niente lo è davvero. Diluire il segnale con rumore promozionale è un costo, non una neutralità.

## Test decisivo

- C'è una soluzione con meno elementi che ottiene lo stesso risultato?
- L'utente è costretto a sapere qualcosa di fiscale per completare questa azione?
- Ci sono campi che il sistema potrebbe pre-compilare o pre-selezionare e non lo fa?
- Il numero di opzioni mostrate è il minimo necessario per completare questo step?
- Il peso visivo degli elementi riflette le conseguenze reali per l'utente, non l'importanza di business?
- Rimuovere questa funzione sposterebbe il problema al customer support o all'operations?

## Segnale di allarme

L'utente deve conoscere un termine fiscale per completare un'azione, senza che la richiesta venga ristrutturata in linguaggio operativo. Oppure: un flusso sequenziale mostra più azioni contemporaneamente su una schermata. Oppure: un documento componibile presenta tutti i campi avanzati in primo piano, costringendo l'utente a elaborarli per capire cosa lo riguarda. Oppure: un elemento promozionale usa gli stessi pattern visivi di un'attività obbligatoria, diluendo il segnale. Oppure: tutto nella schermata sembra ugualmente importante — non c'è un livello dominante. Oppure: una funzione è stata rimossa dall'interfaccia, ma l'utente deve contattare il supporto per ottenere lo stesso risultato.
