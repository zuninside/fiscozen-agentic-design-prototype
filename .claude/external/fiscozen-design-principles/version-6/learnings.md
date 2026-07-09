# Learnings

> File append-only dove si accumulano osservazioni dalle sessioni d'uso della skill. **Non modifica i principi** — li informa per la sessione di consolidamento successiva.

## Come funziona

Durante le sessioni, Claude può proporre di appendere un'entry quando emerge qualcosa di rilevante — sia in negativo (una severity sbagliata, un principio mal citato, un output che manca qualcosa) sia in positivo (un approccio validato esplicitamente, un formato che ha funzionato bene, una scelta non ovvia confermata dall'utente). Il contenuto lo decidi tu: Claude scrive, la sostanza viene dalla tua osservazione.

Registrare solo le correzioni renderebbe la skill eccessivamente cauta nel tempo. I feedback positivi fissano cosa mantenere — sono calibrazione quanto gli errori.

**Le entries non si cancellano mai.** Si aggiungono. Anche un'osservazione che poi risulta marginale resta in archivio — serve a vedere che è stata considerata e non ritornarci sopra.

Ogni 2-3 mesi (o ogni ~25 sessioni) apri questo file con Claude per una **sessione di consolidamento**: decidete insieme quali osservazioni diventano modifiche effettive ai principi, al microcopy o agli esempi. Le modifiche vanno nei rispettivi file; `learnings.md` resta come archivio storico — non viene riscritto.

## Formato entry

```
## YYYY-MM-DD — [titolo breve]
**Sessione:** [review | creazione | altro] — [descrizione in una riga]
**Tipo:** [severity | principio | microcopy | pattern | conflitto | formato | validazione | altro]
**Osservazione:** [cosa è successo, cosa non ha funzionato, cosa mancava]
**Proposta (opzionale):** [cosa farei al prossimo consolidamento]
```

Il campo **Tipo** è una guida, non una classificazione rigida. Se un'osservazione non ricade in nessun tipo, usa `altro` e descrivi bene nell'osservazione.

### Esempio (fittizio, per illustrare il formato)

```
## 2026-05-10 — Severity bassa su violazione Essenzialità (gerarchia visiva)
**Sessione:** review — dashboard FO con banner upsell premium accanto alla scadenza F24
**Tipo:** severity
**Osservazione:** Claude ha flaggato la violazione della gerarchia visiva in Essenzialità come 🟡 Significativa, ma in questo caso il banner aveva peso visivo identico a quello della scadenza con sanzione — era 🔴 Critica. L'impatto su un utente che perde la scadenza è reale, non teorico.
**Proposta:** aggiungere al file `essenzialita.md` un segnale di allarme specifico: "peso visivo di un elemento promozionale = peso visivo di una scadenza con sanzione → sempre Critica".
```

---

## Archivio entries

*Nessuna entry ancora — verranno aggiunte man mano che la skill viene usata. Append in coda, ordine cronologico (la più recente in fondo).*
