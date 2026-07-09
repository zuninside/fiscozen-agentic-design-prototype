# Examples — stato dell'archivio

Questo folder contiene esempi concreti di review e creazione. Alcuni sono **inventati** (creati per dare struttura alla skill al momento del setup), altri sono **reali** (raccolti da sessioni d'uso). L'obiettivo è sostituire progressivamente gli inventati con esempi reali man mano che la skill viene usata.

## Stato attuale

| File | Stato | Origine | Data |
|---|---|---|---|
| `review-ok.md` | Inventato | setup v3 | 2026-04 |
| `review-violation.md` | Inventato | setup v3 | 2026-04 |
| `review-borderline.md` | Inventato | setup v3 | 2026-04 |
| `creation-example.md` | Inventato | setup v3 | 2026-04 |

## Come si aggiunge un esempio

Un esempio viene aggiunto quando una sessione d'uso produce un caso **rappresentativo** — non un'eccezione, ma un caso che probabilmente si ripeterà. Claude può proporre l'aggiunta al termine della sessione; l'inclusione la decidi tu.

Ogni nuovo esempio va registrato in questa tabella con:
- **File:** nome del file (kebab-case, es. `review-onboarding-multistep.md`)
- **Stato:** `Reale` se raccolto da sessione d'uso, `Inventato` se costruito a posteriori
- **Origine:** una riga sul contesto (es. "review flusso onboarding FO, sessione del 15/05/2026")
- **Data:** mese di aggiunta (`YYYY-MM`)

## Quando sostituire un esempio inventato

Un esempio inventato va sostituito quando:
- Un caso reale copre lo stesso scenario in modo più fedele al prodotto.
- Una sessione di consolidamento (da `learnings.md`) rivela che l'esempio inventato è contraddetto dalla pratica.
- Il contesto del prodotto è cambiato (es. nuovo pattern a DS) rendendo l'esempio obsoleto.

In questi casi: il vecchio esempio si archivia o si rimuove, il nuovo prende il suo posto e la tabella sopra viene aggiornata.

## Struttura di un esempio

Ogni file segue il formato documentato in `SKILL.md` (Step 4), adattato al tipo:

- **Review** → intestazione (nome + surface), violazioni (con severity), segnalazioni microcopy, suggerimenti, esito.
- **Creazione** → intestazione, codice Vue o specifica testuale, router (se Vue), sezione finale "Note sul design" che spiega come si applicano i principi.

Gli esempi sono letti da Claude come riferimento, quindi la coerenza di formato con SKILL.md è importante: un esempio che devia dal formato insegna a Claude a deviarne.
