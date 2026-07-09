# Guida al Microcopy

Il testo è parte del design. Queste regole si applicano a tutto il copy del prodotto — CTA, titoli, placeholder, errori, stati vuoti, messaggi di successo.

---

## Voice & Tone

**Chi è Fiscozen in una frase:** un commercialista di fiducia — competente, calmo, mai condiscendente.

**Registro:** informale ma professionale. Sempre "tu", mai "Lei".

**Tono base:** diretto e rassicurante. Il contesto fiscale genera ansia; il copy non deve mai amplificarla. L'empatia è **sempre presente** — non cambia in base al contesto — ma si manifesta in modi diversi a seconda del momento che l'utente sta vivendo.

### Cosa evitare sempre

| Da evitare | Perché |
|---|---|
| Esclamazioni ("Ottimo!", "Perfetto!") | Infantilizzano su azioni routinarie |
| Superlativi ("Il modo più semplice") | Promesse vuote, non verificabili |
| Urgenza artificiale ("Fallo subito") | Dark pattern, vietato da `confini.md` |
| Gergo fiscale senza spiegazione nel FO | L'utente non deve sentirsi incompetente |
| Tono allarmistico ("Attenzione!", "Errore!") | Amplifica l'ansia senza aiutare |
| "Sei sicuro?" nelle conferme | Domanda chiusa che non informa sulle conseguenze |

### FO vs BO — l'unica differenza strutturale

L'empatia, il registro e il tono base sono gli stessi. Quello che cambia è il linguaggio tecnico:

| | FO | BO |
|---|---|---|
| Termini fiscali | Sempre tradotti o spiegati (no "regime forfettario" senza contesto) | Usati senza spiegazione (il BO è per professionisti) |
| Densità informativa | Essenziale | Alta ma organizzata |
| Esempio | "Ci vogliono 5 minuti per completare" | "Delega F24 da completare entro il 16/03" |

### Come si manifesta l'empatia per situazione

L'empatia è costante. Il modo in cui si manifesta cambia con la situazione. In tutti i casi lo scopo è rendere l'azione chiara e abbassare l'ansia.

| Situazione | Come si manifesta | Esempi |
|---|---|---|
| Azione routinaria completata | Conferma breve e concreta, senza esclamazioni | "Cliente salvato." / "Fattura inviata." |
| Scadenza fiscale in arrivo | Chiarezza su cosa fare e quanto tempo serve | "Hai una scadenza il 16 marzo — ci vogliono 5 minuti." |
| Importo da pagare | Calma + spiegazione di cosa compone il numero | "Da versare: €1.240. Questo importo è composto da IRPEF (€900) e INPS (€340)." |
| Errore bloccante con via d'uscita | Diretto, senza drammatizzare, con tempo realistico | "Completa la delega per procedere — ci vogliono circa 5 minuti." |
| Errore di sistema | Rassicurazione + alternativa concreta | "Qualcosa è andato storto. Riprova tra qualche secondo o scrivici in chat." |
| Azione irreversibile | Esplicita sulle conseguenze, non drammatica | "Stai per eliminare il cliente Mario Rossi. Tutte le fatture associate verranno archiviate." |
| Dato esplorativo (dashboard) | Narrativo, orientato al valore | "Hai fatturato il 23% in più rispetto all'anno scorso." |
| Stato positivo (nessun problema) | Conferma calma dello stato, non celebrazione | "Tutto in ordine — nessuna scadenza imminente." |
| Onboarding completato | Congratulazione sobria + prossimo passo | "Sei pronto. Il prossimo passo è aggiungere il tuo primo cliente." |
| Dato fiscale difficile introdotto | Contesto prima del numero, non dopo | "Quest'anno le tue tasse sono aumentate di circa €100 rispetto allo scorso — ti spieghiamo perché." |

La regola comune: il copy **non finge urgenza dove non c'è**, e **non minimizza dove l'ansia è legittima**. La calma viene dal dare all'utente l'informazione e l'azione giuste, non dal rassicurare vuotamente.

---

## CTA (call to action)

**Regola base:** verbo + oggetto specifico. L'utente sa esattamente cosa succede quando clicca.

- SI: "Invia fattura" / "Aggiungi cliente" / "Salva bozza"
- NO: "Conferma" / "Ok" / "Continua"

**Eccezione — spazio limitato (es. due CTA affiancate su mobile):**
Quando lo spazio è insufficiente, è accettabile accorciare a verbo solo se il contesto rende inequivocabile l'oggetto e la distinzione tra le due azioni rimane chiara. Si accorcia prima la secondaria. Non si accorcia mai a termini generici.

Esempio:
- Desktop: "Anteprima" + "Invia nota di credito"
- Mobile: "Anteprima" + "Invia"

**Azioni distruttive o irreversibili** — verbo + oggetto esplicito.
- SI: "Elimina cliente" / "Annulla fattura"
- NO: "Rimuovi" / "Elimina"

**Coppie annulla/conferma** — secondaria a sinistra (o in basso), primaria a destra (o in alto).

**CTA finale nei wizard** — specifica sul risultato, non generica.
- SI: "Invia dichiarazione" / "Completa onboarding"
- NO: "Completa" / "Fine" / "Invia"

---

## Titoli di pagina

| Contesto | Struttura | Esempio |
|---|---|---|
| Pagine principali FO | Forma personale | "Le tue fatture" / "I tuoi clienti" |
| Inside flussi / wizard | Sostantivo semplice | "Fatture" |
| Dettaglio oggetto | Oggetto specifico | "Fattura #2024-045" |
| Step di wizard | Verbo + azione | "Aggiungi una prestazione" |
| Riepilogo dati | Orientato al valore | "Come sta andando il tuo 2024" |

---

## Titoli di dialog e modal

Verbo + oggetto per le azioni, sostantivo per i dialog informativi. No domande. No punti esclamativi.

| Tipo | Esempio |
|---|---|
| Azione distruttiva | "Elimina cliente" |
| Azione rilevante | "Invia fattura" |
| Informativo | "Delega necessaria" |

- NO: "Sei sicuro?" / "Attenzione!" / "Conferma operazione"

Il corpo del dialog spiega le conseguenze in modo rassicurante, non allarmistico.

---

## Placeholder

| Tipo di campo | Esempio |
|---|---|
| Campo testo libero | "Inserisci il nome del cliente" |
| Campo con formato | "GG/MM/AAAA" |
| Select semplice | "Seleziona il cliente" |
| Combobox | "Cerca o seleziona il cliente" |

- NO: "Nome" / "es. Mario Rossi" / "Seleziona..."

---

## Obbligatorietà dei campi

Nessun asterisco. Solo "(opzionale)" sui campi non obbligatori.
- SI: "Note (opzionale)"
- NO: "Nome *"

---

## Messaggi di errore

Struttura: **problema + soluzione**. Mai solo il problema.

| Tipo | Esempio |
|---|---|
| Campo non compilato | "Inserisci il nome del cliente per continuare" |
| Formato errato | "Il codice fiscale deve avere 16 caratteri — ne hai inseriti 14" |
| Errore bloccante fiscale | "Per inviare la fattura devi completare la delega — ci vogliono 5 minuti" |
| Errore di sistema | "Qualcosa è andato storto. Riprova tra qualche secondo o contatta il supporto" |

- NO: "Campo obbligatorio" / "Errore di validazione" / "Formato non valido"

---

## Stati vuoti

| Tipo | Esempio |
|---|---|
| Lista vuota (dati) | "Le tue fatture appariranno qui. Crea la tua prima fattura." |
| Lista vuota (filtro) | "Nessuna fattura corrisponde ai filtri. Prova a modificare i filtri." |
| Stato positivo | "Tutto in ordine — nessuna scadenza imminente" |

---

## Messaggi di successo

| Tipo | Esempio |
|---|---|
| Azione routinaria | "Cliente salvato." |
| Alta rilevanza | "Fattura inviata — il tuo cliente la riceverà entro pochi minuti." |
| Con passo successivo | "Fattura creata. Vuoi inviarla adesso?" |

Il passo successivo viene suggerito solo se è genuinamente rilevante.
