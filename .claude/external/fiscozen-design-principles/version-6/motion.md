# Animazioni e micro-interazioni

> **v2 — nuovo file:** linee guida per animazioni, transizioni e rispetto di `prefers-reduced-motion`.

Il movimento deve portare significato, non decorazione.

---

## Principio fondamentale

Un'animazione è giustificata solo se comunica qualcosa che il testo e la struttura non possono comunicare da soli: un cambio di stato, una direzione, un progresso.

Animare per abbellire aumenta il carico cognitivo senza aggiungere valore.

---

## `prefers-reduced-motion`

**Regola non negoziabile (vedi confini.md):** quando l'utente ha attivato la preferenza di sistema per il moto ridotto, tutte le animazioni devono essere disabilitate o sostituite con una transizione di opacità semplice.

```css
@media (prefers-reduced-motion: reduce) {
  /* Sostituire transform/movement con opacity */
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Durate di riferimento

| Tipo | Durata | Esempi |
|---|---|---|
| Micro-interazione | 100–150ms | Hover su button, cambio colore focus |
| Transizione di stato | 150–200ms | Checkbox, toggle, chip selezionata |
| Apertura elemento | 200–300ms | Dropdown, tooltip, popover |
| Transizione di layout | 250–350ms | Modal, drawer, panel laterale |
| Progresso / onboarding | 300–500ms | Progress bar, step completato |

Durare più di 500ms su un'azione utente è quasi sempre sbagliato.

---

## Cosa animare

| Elemento | Tipo di animazione | Motivazione |
|---|---|---|
| Modal / drawer | Slide da basso (mobile), fade+scale (desktop) | Indica provenienza e gerarchia |
| Toast | Slide + fade da angolo | Non distrae dal contenuto principale |
| Progress bar | Fill fluido | Rafforza la Legge di Zeigarnik |
| Skeleton loader | Shimmer (pulse) | Segnala attività senza suggerire progresso falso |
| Stato /error su campo | Shake breve (solo se riduce ambiguità) | Attira l'attenzione su errore specifico |
| Step completato | Check mark con fade | Rinforzo positivo del progresso |

---

## Cosa non animare

- **Scrolling** — mai animare o "snappare" lo scroll in modo che l'utente perda il controllo.
- **Navigazione tra pagine** — transizioni di pagina elaborate rallentano la percezione di velocità.
- **Elementi in loop** — nessuna animazione in loop nell'area di contenuto principale (distrae, non aggiunge valore).
- **Testo in ingresso** — mai animare il testo che appare carattere per carattere.
- **Feedback di errore generico** — lo shake sull'intera schermata è eccessivo; usarlo solo su elementi specifici e con parsimonia.

---

## Checklist motion

- [ ] L'animazione comunica qualcosa che la struttura statica non può?
- [ ] `prefers-reduced-motion` disabilita o sostituisce tutte le transizioni?
- [ ] La durata è entro i range di riferimento?
- [ ] Ci sono animazioni in loop nell'area di contenuto principale?
