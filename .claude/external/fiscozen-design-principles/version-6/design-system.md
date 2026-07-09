# Design System — Governance

> Processo di contribuzione, validazione e proposta di nuovi componenti al design system di Fiscozen. Questo non è un principio di design — è il processo operativo che tiene insieme la coerenza del prodotto.

## Perché esiste

Fiscozen ha un design system in costruzione e un team library dedicato alla sua evoluzione. Il DS non è una libreria di comodo: è l'infrastruttura che rende possibile la coerenza del prodotto a scala. I developer non implementano componenti custom senza che il team library li abbia validati. Questo non è un vincolo burocratico — è quello che permette al team di muoversi velocemente senza rompere la coerenza.

Aggiungere componenti non validati fuori dal sistema rompe la coerenza a cascata: quello che sembra un'eccezione locale diventa un problema sistemico quando si moltiplica.

---

## Il processo in pratica

### Discovery — libertà totale

In fase esplorativa le soluzioni proposte **non devono** rispettare il DS. Esplorare significa provare, e provare richiede la libertà di uscire dal sistema. Le soluzioni esplorative devono essere **comunicate come tali** per evitare che vengano prese come specifiche definitive.

### Convergenza — prima del handoff

Prima del passaggio allo sviluppo, ogni soluzione viene allineata ai componenti esistenti del DS. Ogni elemento della soluzione deve avere un corrispondente nel DS, oppure essere oggetto di una proposta formale al team library.

Se un elemento non trova un corrispondente, ci sono tre possibilità:

1. **Componente esistente usabile in variante:** si usa quello, documentando la configurazione.
2. **Componente esistente adattabile con un'estensione minima:** si propone l'estensione al team library.
3. **Nuovo componente necessario:** si avvia una proposta formale.

### Proposta al team library

Una proposta formale risponde a tre domande:

- **Quale problema risolve** questo componente?
- **In quali contesti** viene usato? (almeno 2–3 casi d'uso concreti)
- **Perché i componenti esistenti non sono sufficienti?**

Una proposta che non risponde a una di queste tre domande non è pronta.

---

## Ruoli e responsabilità

**Per i designer** — esplorano liberamente in discovery. Prima del handoff, verificano che ogni elemento abbia un corrispondente nel DS. Se manca, coinvolgono il team library con una proposta strutturata.

**Per i developer** — se un componente non è nel DS, non lo implementano senza allineamento con il team library. La velocità a breve termine non vale la frammentazione del sistema a lungo termine.

**Per PM e stakeholder** — la convergenza al DS è un passaggio del processo, non un rallentamento. Se manca un componente, è un'informazione da gestire — non un problema da bypassare.

---

## Perché funziona

- **Atomic Design (Brad Frost):** le UI sono gerarchie di atomi, molecole, organismi. Ogni livello riusa e combina quello precedente. Aggiungere elementi fuori dal sistema rompe la coerenza a cascata.
- **Legge di Tesler — Conservazione della complessità:** la complessità di gestire varianti non documentate si accumula nel tempo come debito di design. Il processo di validazione è il modo per gestirla in modo controllato.
- **Euristica di Nielsen n°4 — Consistenza e standard:** il design system è l'infrastruttura che rende possibile la consistenza a scala.

---

## Test decisivo

- Esiste già un componente DS per questa soluzione?
- Se manca, è stata fatta una proposta al team library con problema + contesti + motivazione?
- Le soluzioni esplorative sono state comunicate come tali al team di sviluppo?
- C'è un componente custom implementato senza passare dal team library?

---

## Segnale di allarme

Un componente custom viene implementato senza passare dal team library. Oppure: una soluzione esplorativa viene trattata come specifica definitiva senza convergenza al DS. Oppure: un nuovo componente viene aggiunto al DS senza rispondere alle tre domande della proposta.
