# Gestione degli stati

Ogni componente interattivo e ogni schermata che carica dati deve gestire questi quattro stati. Non gestirli è una violazione del principio Guida.

---

## I quattro stati

### 1. Vuoto (empty)

Lo stato in cui non ci sono ancora dati — prima del primo utilizzo o dopo aver svuotato una lista.

**Regole:**
- Non mostrare uno spazio bianco senza senso.
- Spiegare perché è vuoto e cosa fare per popolarlo.
- Se c'è un'azione possibile, metterla in evidenza.
- Non usare il copy degli stati di errore.

| Tipo | Copy |
|---|---|
| Prima dell'utilizzo | "Le tue fatture appariranno qui. Crea la tua prima fattura." |
| Dopo filtro senza risultati | "Nessuna fattura corrisponde ai filtri. Prova a modificare i filtri." |
| Stato positivo (nessun problema) | "Tutto in ordine — nessuna scadenza imminente." |

---

### 2. Caricamento (loading)

Lo stato in cui il sistema sta recuperando o elaborando dati.

**Regole:**
- Il componente non è interagibile durante il caricamento.
- Usare skeleton loader per contenuti strutturati (liste, card, tabelle).
- Usare spinner inline per azioni singole (submit di un form, caricamento di un campo dipendente).
- Non bloccare l'intera schermata se solo una sezione sta caricando.
- Rispettare `prefers-reduced-motion` — se attivo, sostituire l'animazione con uno stato statico.

| Contesto | Pattern |
|---|---|
| Lista o tabella | Skeleton loader con struttura coerente al contenuto reale |
| Campo dipendente da backend | Spinner inline + campo non interagibile |
| Submit di un form | Spinner nel button + button disabilitato (aria-disabled) |
| Intera schermata | Skeleton dell'intera struttura |

---

### 3. Errore (error)

Lo stato in cui qualcosa è andato storto — su un campo, su una sezione o sull'intera schermata.

**Regole:**
- Errori su campi specifici → helptext inline /error (mai toast).
- Errori di sistema non legati a un campo → toast errore.
- I messaggi di errore indicano il problema e la via d'uscita (vedi microcopy.md).
- Non mostrare un errore su un campo che l'utente non ha ancora toccato.
- Le azioni irreversibili fallite richiedono una spiegazione e un'alternativa.

| Tipo di errore | Quando | Come |
|---|---|---|
| Campo compilato in modo errato | On blur | Helptext inline /error |
| Campo obbligatorio non compilato | On blur (mai prima) | Helptext inline /error |
| Errore di sistema | Al submit o al caricamento | Toast errore |
| Schermata non caricabile | Al caricamento | Stato errore a schermo con retry |

---

### 4. Successo (success)

Lo stato in cui un'azione è andata a buon fine.

**Regole:**
- Confermare sempre cosa è successo.
- Se c'è un passo successivo rilevante, suggerirlo (non imporlo).
- I toast di successo sono brevi. Il contesto esteso va nella schermata successiva.
- Non celebrare azioni routinarie — riservare il tono positivo a momenti di traguardo reale.

| Tipo | Pattern |
|---|---|
| Azione routinaria | Toast breve: "Cliente salvato." |
| Azione ad alta rilevanza | Toast con contesto: "Fattura inviata — il tuo cliente la riceverà entro pochi minuti." |
| Completamento flusso | Schermata dedicata con riepilogo e passo successivo |

---

## Checklist stati

- [ ] Il componente mostra qualcosa di utile quando è vuoto?
- [ ] Lo stato di caricamento è visivo e non blocca l'intera schermata se non necessario?
- [ ] Gli errori su campi compaiono on blur, non prima?
- [ ] I toast non vengono usati per errori su campi di un form?
- [ ] Il messaggio di successo conferma cosa è successo?
- [ ] `prefers-reduced-motion` disabilita o riduce le animazioni degli stati?
