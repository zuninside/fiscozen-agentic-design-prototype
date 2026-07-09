# Esempio: caso borderline con deviazione documentata

> Questo esempio mostra una soluzione che crea tensione con un principio ma può essere approvata se la deviazione è documentata.

## Contesto

**Funzionalità:** form di registrazione documento passivo nel BO.
**Richiesta:** il team propone di mostrare un banner informativo fisso in cima al form con il riepilogo del fornitore (nome, P.IVA, regime IVA) per tutta la durata della compilazione. Il banner usa il componente Alert del DS (sfondo neutro, bordo sottile).

---

## Review: Form registrazione documento passivo
**Surface:** BO

### Violazioni

- 🟡 Significativa — **Essenzialità**: un elemento sempre visibile che non richiede interazione potrebbe essere considerato rumore visivo. La regola base suggerisce di non mostrare informazioni non necessarie al task corrente.

### Perché la deviazione può essere giustificata

Il contesto è BO. L'operatore sta registrando un documento passivo che può avere 5–10 campi dipendenti dai dati del fornitore (regime IVA, split payment, ritenuta d'acconto). Perdere il riferimento al fornitore durante la compilazione significherebbe dover uscire dal form o ricordare a memoria — comportamento che la Legge di Tesler ci chiede di gestire a livello di sistema, non di utente.

Il banner non è decorativo: riduce il carico cognitivo ed elimina il rischio di errori di attribuzione su documenti ad alto impatto fiscale. In questo specifico caso, Essenzialità (rimuovere il superfluo) entra in tensione con Empatia (proteggere da errori di attribuzione con conseguenze fiscali) — e Empatia prevale, come da gerarchia dei principi in `SKILL.md`.

### Suggerimenti

- Il componente usato deve essere Alert del DS, non un custom.
- Il banner deve essere visivamente subordinato ai campi interattivi (gerarchia tipografica inferiore ai label) — in linea con Essenzialità.
- Documentare la ragione funzionale nella specifica: senza documentazione, la deviazione non è riconoscibile e rischia di diventare pattern.

**Esito:** Approvato con condizioni — la deviazione è giustificata e documentata.
