# Esempio: soluzione che rispetta i principi

## Contesto

**Funzionalità:** form di creazione fattura nel FO.
**Richiesta:** il designer propone di mostrare i campi essenziali subito visibili, con i campi avanzati (note, riferimento ordine) in espansione. La CTA "Invia fattura" è `aria-disabled` finché i campi obbligatori non sono compilati. Su mobile è affiancata da un button ghost "3 campi da completare".

---

## Review: Form creazione fattura
**Surface:** FO

Nessuna violazione rilevata.

### Segnalazioni microcopy

- CTA "Invia fattura": corretta — verbo + oggetto specifico.

### Suggerimenti

- Verificare che il testo "N campi da completare" si aggiorni dinamicamente man mano che l'utente compila.
- Il click sulla CTA `aria-disabled` deve attivare lo stato Highlight sui campi mancanti, oltre al click sul button ghost.
- Se il form si apre da un flusso lungo (es. creazione rapida da dashboard), mantenere lo stato salvato al back.

**Esito:** Approvato.
