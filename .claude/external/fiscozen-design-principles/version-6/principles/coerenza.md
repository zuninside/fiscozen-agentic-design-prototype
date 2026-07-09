# Coerenza

> Usiamo pattern e componenti familiari. Si cambia solo con una ragione documentata.

## Cosa significa

Gli utenti arrivano sul nostro prodotto con aspettative costruite da anni di utilizzo di altre applicazioni. Ogni interazione — aprire un menu, compilare un form, navigare tra sezioni, selezionare da una lista — attiva un'aspettativa precisa su come le cose dovrebbero funzionare. Rispettare queste aspettative non è una limitazione creativa: è la condizione che permette all'utente di muoversi senza dover imparare ogni volta come funziona il prodotto.

La coerenza riguarda il **comportamento dei componenti** (un dropdown si apre verso il basso, una select permette una scelta, un toggle cambia stato immediatamente) e il loro **posizionamento** (un elemento contestuale — tooltip, dropdown, menu — si apre vicino all'elemento che lo ha triggerato). La distanza tra un'azione e la sua risposta visiva ha un costo reale in termini di tempo e attenzione, soprattutto su mobile dove la precisione del touch è limitata.

La coerenza vale anche **fra sezioni diverse dello stesso prodotto**: la stessa azione deve comportarsi allo stesso modo ovunque. Un pulsante "Elimina" che in una sezione chiede conferma e in un'altra no costringe l'utente a ricostruire il modello mentale ogni volta che cambia contesto.

### Quando innovare sui pattern

Ha senso esplorare alternative a un pattern consolidato solo quando si verifica almeno una di queste condizioni:

- Il problema da risolvere è genuinamente nuovo e nessun pattern esistente lo copre adeguatamente.
- Il contesto d'uso è strutturalmente diverso da quello per cui il pattern standard è stato progettato.
- I dati mostrano che il pattern esistente crea frizione misurabile nel nostro prodotto specifico.

In ogni caso l'innovazione parte da un problema concreto, non da una preferenza estetica, e richiede validazione prima di diventare standard.

### Design system

La coerenza a livello di prodotto si regge sull'uso del design system. Per il processo di contribuzione, validazione e proposta di nuovi componenti vedi `design-system.md`.

## Come si applica

**FO:** i pattern di navigazione e interazione sono quelli che gli utenti già conoscono dall'ecosistema mobile. Le variazioni rispetto agli standard esistono solo dove c'è una ragione funzionale documentata. I pattern innovativi vengono validati prima di diventare standard.

**BO:** i pattern sono coerenti con i tool professionali che gli operatori usano quotidianamente — ERP, gestionali, sistemi di ticketing. La terminologia tecnica è corretta e consistente in tutto il prodotto. Le azioni ripetitive hanno sempre lo stesso comportamento, qualunque sia la sezione in cui vengono eseguite.

## Perché funziona

- **Jakob's Law:** gli utenti si aspettano che il nostro prodotto funzioni come quelli che già conoscono. Reinventare un pattern consolidato forza l'utente a imparare qualcosa di nuovo senza dargli nulla in cambio.
- **Legge di Fitts:** il tempo per raggiungere un elemento dipende dalla sua distanza e dimensione. Posizionare le risposte visive vicino all'elemento che le ha generate riduce il costo motorio e cognitivo — particolarmente su mobile.
- **Euristica di Nielsen n°4 — Consistenza e standard:** elementi dello stesso tipo si comportano allo stesso modo in tutti i contesti, sia rispetto alle convenzioni esterne sia dentro il prodotto.

## Test decisivo

- Esiste già un pattern noto — dentro il prodotto o nell'ecosistema — per risolvere questo problema?
- Se il pattern è nuovo, c'è una ragione funzionale documentata?
- La stessa azione si comporta allo stesso modo in altre sezioni del prodotto?

## Segnale di allarme

Un pattern di interazione è stato reinventato senza una ragione funzionale documentata. Oppure: un elemento contestuale si apre lontano dall'elemento che l'ha triggerato. Oppure: la stessa azione si comporta in modo diverso in sezioni diverse del prodotto.
