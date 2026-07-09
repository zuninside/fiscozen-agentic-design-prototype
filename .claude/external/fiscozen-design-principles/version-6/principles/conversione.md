# Conversione

> Progettiamo per massimizzare la conversion. Ogni flusso porta l'utente al completamento senza attriti evitabili.

## Cosa significa

Un flusso abbandonato a metà è spesso peggio di uno non iniziato. Una fattura non inviata, una delega non completata, un onboarding interrotto non sono semplici "mancati completamenti": generano problemi operativi reali. La fattura rimasta in bozza non produce reddito dichiarato; la delega incompleta blocca future operazioni; l'onboarding interrotto lascia il cliente senza un'entità fiscale configurata.

Il design ha la responsabilità di portare l'utente al completamento. Non con pressione o urgenza artificiale — mai — ma rimuovendo ogni ostacolo non necessario dal percorso. Il principio non chiede di forzare il completamento: chiede di **non ostacolarlo con attriti evitabili**.

### Le tre leve della conversione

La conversione si costruisce su tre leve complementari:

- **Ridurre la frizione** — ogni campo non necessario in questo step è un motivo in più per abbandonare. Il flusso chiede solo quello che serve *ora*, nel momento in cui serve. I campi necessari a step successivi stanno nei loro step, non anticipati qui.

- **Mantenere il momentum** — l'utente deve sempre sapere a che punto è e quanto manca. Il progresso percepito riduce la probabilità di abbandono (Legge di Zeigarnik) e lo stato salvato automaticamente segnala che il lavoro fatto non andrà perso (Effetto IKEA).

- **Rendere ovvia la prossima azione** — in ogni momento del flusso c'è una sola azione primaria chiara. La presenza di più azioni equipollenti costringe l'utente a decidere cosa fare prima, rallentando il flusso e aumentando la probabilità di abbandono.

### Struttura del progresso

Il modo in cui si mostra il progresso dipende dal tipo di flusso:

| Tipo di flusso | Approccio |
|---|---|
| Multi-step | Progress indicator esplicito con numero di step visibile dall'inizio |
| Documento componibile | CTA finale con `aria-disabled` finché i campi obbligatori non sono compilati |

In entrambi i casi, è sempre possibile tornare indietro senza perdere dati. Un flusso che penalizza chi torna indietro insegna all'utente a non fidarsi del sistema.

## Come si applica

**FO:** ogni step chiede solo le informazioni necessarie per quello step. Nei flussi multi-step l'utente vede tutti gli step dall'inizio. Lo stato viene salvato automaticamente. È sempre possibile tornare indietro senza perdere dati. Per l'orientamento sui campi mancanti nel documento componibile (button ghost "N campi da completare" + stato Highlight), vedi `principles/empatia.md` — è un pattern di protezione prima che di completamento.

**BO:** l'operatore ha tutto il contesto per completare un'operazione senza uscire dalla pagina. I flussi complessi riducono gli errori di completamento su volumi alti mantenendo tutto il necessario a portata di mano.

## Perché funziona

- **Legge di Zeigarnik:** le persone tendono a voler completare i task iniziati. Mostrare "Step 2 di 4" è più efficace di non mostrare nulla.
- **Effetto IKEA:** le persone attribuiscono più valore alle cose a cui hanno già contribuito. Salvare automaticamente il progresso segnala che il lavoro fatto non andrà perso.
- **Legge di Hick:** una sola azione primaria per schermata permette all'utente di muoversi velocemente senza esitazioni.
- **Euristica di Nielsen n°3 — Controllo e libertà dell'utente:** poter tornare indietro senza perdere dati è la condizione minima per far sentire l'utente al sicuro in un flusso lungo.

## Test decisivo

- Ci sono informazioni richieste in questo step che non servono davvero qui?
- L'utente sa quanti step mancano al completamento?
- Tornare allo step precedente fa perdere i dati già inseriti?
- C'è una sola azione primaria chiara in ogni momento del flusso?

## Segnale di allarme

Un flusso chiede informazioni che non servono per completare l'azione corrente. Oppure: l'utente non sa quanti step mancano — il flusso sembra potenzialmente infinito. Oppure: tornare indietro fa perdere i dati già inseriti. Oppure: ci sono più azioni primarie equipollenti nella stessa schermata.
