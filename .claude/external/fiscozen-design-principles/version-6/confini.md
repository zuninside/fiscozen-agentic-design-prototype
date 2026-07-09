# Confini non negoziabili

Queste non sono linee guida — sono cose che non si fanno, mai. Nessuna eccezione, nessuna ragione di business le giustifica.

---

## Dark pattern — vietati senza eccezioni

**Regola di riconoscimento:** se un elemento funziona meglio perché l'utente non ha capito cosa stava facendo, è un dark pattern.

**Base legale:** DSA e Direttiva UE 2019/2161 classificano i dark pattern come pratiche commerciali scorrette nell'UE. Sanzioni fino al 4% del fatturato annuo globale.

| Pattern | Descrizione | Esempio da evitare |
|---|---|---|
| Interfaccia ingannevole | Elemento marketing con lo stesso peso visivo di un'attività obbligatoria | "Invita un amico" con lo stesso stile di una scadenza F24 |
| Falsa urgenza | Countdown su azioni senza scadenza reale | Timer "Offerta valida per 2 ore" su un piano annuale |
| Confirm shaming | Testo che fa sentire in colpa per rifiutare | "No grazie, preferisco pagare più tasse" |
| Opt-out nascosto | Consensi pre-selezionati o difficili da revocare | Checkbox "Ricevi comunicazioni commerciali" già spuntata |
| Costi nascosti | Prezzi mostrati solo alla fine del flusso | Costo aggiuntivo che appare solo all'ultimo step |

---

## Accessibilità — obiettivo strutturale

**Regola transitoria (operativa da subito):** ogni nuovo componente del DS deve rispettare WCAG 2.1 AA. Nessuna nuova aggiunta introduce regressioni.

### Contrasto e colore

| Standard | Requisito |
|---|---|
| Contrasto testo normale | Rapporto minimo 4.5:1 |
| Contrasto testo grande (18px+) | Rapporto minimo 3:1 |
| Contrasto elementi interattivi e bordi | Rapporto minimo 3:1 |
| **Colore come unico vettore** | **Vietato** — ogni informazione veicolata dal colore deve avere un equivalente testuale o iconico |

Esempio: uno stato di errore non può essere comunicato solo con un bordo rosso. Deve esserci anche un'icona o un helptext.

### Testo e contenuto

| Standard | Requisito |
|---|---|
| Testo alternativo | Tutte le immagini con contenuto informativo |
| Scalabilità del testo | Leggibile al 200% senza perdita di contenuto |
| Lingua della pagina | Attributo `lang` corretto sul documento |

### Navigazione e focus

| Standard | Requisito |
|---|---|
| Navigazione da tastiera | Tutti gli elementi interattivi raggiungibili con Tab |
| Focus visibile | Indicatore di focus sempre visibile — mai `outline: none` senza sostituto |
| Ordine del focus | Segue l'ordine visivo logico da sinistra a destra, dall'alto in basso |
| **Focus trap nei modal/drawer** | Il focus rimane all'interno del modal mentre è aperto; alla chiusura torna all'elemento che lo ha aperto |
| Touch target | Minimo 44×44px per elementi interattivi |

### ARIA e semantica

| Standard | Requisito |
|---|---|
| Landmark regions | Usare `<main>`, `<nav>`, `<header>`, `<footer>` per strutturare il documento |
| ARIA label | `aria-label` su tutti gli elementi interattivi senza testo visibile (es. icon button) |
| ARIA live regions | `aria-live="polite"` per aggiornamenti dinamici non urgenti (es. contatore campi mancanti) |
| ARIA live urgente | `aria-live="assertive"` solo per errori critici che richiedono attenzione immediata |
| Ruoli semantici | Non usare `div` o `span` per elementi interattivi — usare elementi nativi (`button`, `a`, `input`) |

### Animazioni e movimento

| Standard | Requisito |
|---|---|
| `prefers-reduced-motion` | Tutte le animazioni devono essere disabilitate o ridotte a dissolvenza quando l'utente ha attivato questa preferenza |
| Movimento continuo | Nessuna animazione in loop nell'area di contenuto principale |

Vedi `motion.md` per le linee guida complete sulle animazioni.
