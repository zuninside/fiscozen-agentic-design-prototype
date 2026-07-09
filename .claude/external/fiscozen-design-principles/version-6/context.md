# Contesto Prodotto — Fiscozen

> Riferimento per Claude durante sessioni di review e creazione. Fornisce il contesto necessario per valutare design e prototipi in modo aderente al prodotto reale.

## Il prodotto

Fiscozen è un **partner fiscale** — non un software di contabilità generica, né un sostituto del commercialista tradizionale. È la combinazione di automazione tecnologica (efficienza) e presenza umana (consulenza): il cliente gestisce il business senza il peso della burocrazia.

Il valore percepito dall'utente FO è: controllo e tranquillità, non competenza fiscale. L'utente non vuole diventare un esperto — vuole sapere cosa fare, quando farlo, e sentirsi al sicuro se lo fa.

---

## Utenti FO

**Chi sono:** liberi professionisti, ditte individuali, piccole società. Propensione alla digitalizzazione e all'autonomia operativa. Due macro-segmenti:

| Segmento | Caratteristica principale |
|---|---|
| **Regime Forfettario** | Semplificazione massima — no IVA, flat tax. Minor complessità, più ansia sul "sto facendo tutto giusto?" |
| **Regime Semplificato** | Maggiore complessità IVA, versamenti periodici. Più touchpoint con il prodotto, più punti di potenziale frizione. |

**Livello fiscale:** medio-basso. Non vogliono diventare esperti — cercano "consapevolezza guidata": capire il *perché* di ogni azione in linguaggio operativo, senza sentirsi in balia delle scadenze.

**Le 3 paure:**
1. **Sanzioni** — sbagliare un adempimento, perdere una scadenza
2. **Imprevisti finanziari** — non sapere quanto accantonare per le tasse
3. **Solitudine** — smarrimento nei momenti critici, non sapere a chi rivolgersi

**Implicazione per il design:** il prodotto deve essere trasparente sul "perché" di ogni azione, anticipare le scadenze con preavviso adeguato, e non lasciare mai l'utente senza un appiglio nei momenti di tensione. Il commercialista accessibile via chat è parte integrante dell'esperienza — non un'alternativa al prodotto.

---

## Utenti BO

**Chi usa il BO:** strumento trasversale per più ruoli con competenze diverse:

| Ruolo | Task principale |
|---|---|
| **Sales** | Gestione lead, onboarding nuovi clienti |
| **Customer Success** | Supporto clienti via chat integrata |
| **Commercialisti / Tax Consultant** | Gestione operativa pratiche, collaborazione su casi complessi |
| **Consulenti Partner** | Collaborazione su pratiche specifiche |

**Task più ripetitivi:**
- Riconciliazione eccezioni: spese ambigue, casi non standard che richiedono giudizio umano
- Monitoraggio invii fiscali ricorrenti che richiedono intervento (non automatizzabili)

**Implicazione per il design:** il BO serve professionisti con competenza fiscale solida che lavorano su volumi alti. La terminologia tecnica non va tradotta. La densità informativa alta è accettabile — ma gerarchia e leggibilità devono rimanere solide. Le operazioni ripetitive devono essere veloci e coerenti tra pratiche diverse.

---

## Flussi FO principali

In ordine di frequenza d'uso:

| # | Flusso | Frequenza | Note |
|---|---|---|---|
| 1 | **Fatturazione elettronica** | Giornaliero | Core del prodotto — il flusso più usato in assoluto |
| 2 | **Onboarding** | Una tantum (apertura P.IVA) | Flusso critico — primo contatto con il prodotto, impatta la percezione iniziale |
| 3 | **Invio STS** | Periodico | Solo per professionisti sanitari (codice ATECO sanitario) |
| 4 | **Adempimenti / versamenti IVA / F24** | Mensile, trimestrale, semestrale | Genera più ansia — scadenze con sanzione diretta |
| 5 | **Dichiarazione dei redditi** | Annuale | Momento di massima tensione emotiva — "resa dei conti" percepita |

**Colli di bottiglia noti** (dove gli utenti si bloccano e contattano il supporto):
- **Classificazione spese:** deducibilità incerta — l'utente non sa come categorizzare una spesa
- **Linguaggio fiscale denso** in passaggi di onboarding e adempimenti — genera ricorso al supporto

---

## Calendario fiscale FO

| Periodo | Evento | Peso emotivo |
|---|---|---|
| Mensile (Semplificati) | Versamento IVA mensile | Alto — frequente |
| Trimestrale (Semplificati) | LIPE + IVA trimestrale | Alto |
| Periodico (Sanitari) | Invio STS | Medio |
| **Maggio–Giugno** | **Saldo + 1° acconto IRPEF** | **Molto alto — importo elevato, spesso imprevisto** |
| **Novembre** | **2° acconto IRPEF** | **Alto** |
| Fine anno / inizio anno | Dichiarazione dei redditi | Molto alto — percepita come evento annuale pesante |

**Nota sulla stagionalità:** a maggio-giugno e novembre le scadenze IRPEF hanno priorità assoluta (🔴 alta) e devono occupare posizione dominante nella dashboard FO. Un banner promozionale non dovrebbe mai competere visivamente con queste scadenze nei periodi critici.

---

## F24 e adempimenti — cosa coprono

**F24:** copre tutto — IRPEF, INPS, INAIL, tributi locali. Non è solo "tasse sul reddito".

**"Adempimenti"** nel prodotto include:
- Pagamenti (F24, versamenti IVA)
- Comunicazioni periodiche (LIPE, STS)
- Trasmissione dati a enti fiscali
- Gestione scadenze documentali

**Attenzione al microcopy:** "adempimento" non è sinonimo di pagamento. Nel FO distinguere sempre: "Hai un pagamento da fare" vs "Hai una comunicazione da inviare". Per l'utente FO sono cose con conseguenze diverse.

---

## Glossario fiscale → linguaggio FO

Questi termini vanno tradotti o spiegati nel FO. Nel BO si usano così come sono.

| Termine fiscale | Come tradurlo nel FO |
|---|---|
| F24 | "Pagamento tasse" — specificare cosa: "pagamento IRPEF", "versamento INPS" |
| LIPE | "Comunicazione IVA trimestrale" |
| STS | "Invio dati spese sanitarie" (solo professionisti sanitari) |
| Acconto IRPEF | "Acconto tasse" + importo + spiegazione di cosa compone il numero |
| Saldo IRPEF | "Saldo tasse" — sempre con spiegazione del calcolo |
| Regime forfettario | Non tradurre il nome — spiegare le implicazioni operative ("non addebiti IVA sulle fatture") |
| Regime semplificato | Non tradurre il nome — spiegare le implicazioni operative ("devi versare l'IVA ogni trimestre") |
| Partita IVA | Usabile così — gli utenti conoscono il termine |
| Delega F24 | "Autorizzazione al pagamento automatico delle tasse" |
| Cassa previdenziale | Nel BO: usabile. Nel FO: specificare ("ENPAP per psicologi", "INARCASSA per ingegneri", "gestione separata INPS" per i più) |
| Codice ATECO | Nel BO: usabile. Nel FO: "codice attività" o spiegare il contesto della domanda |
| Regime contributivo | Nel FO: ristrutturare la domanda — "Come gestisci i tuoi contributi?" con opzioni descritte in linguaggio operativo |
