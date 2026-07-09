# Learnings — Configurazione Slack

> Questo file va personalizzato da ogni membro del team che installa la skill.
> Non condividere questo file — contiene l'URL del webhook Slack (che è il segreto).

---

## Configurazione

```
SLACK_WEBHOOK_URL=DA_CONFIGURARE
```

Il nome utente viene rilevato automaticamente da `whoami` — nessuna configurazione necessaria.

---

## Canale condiviso

Le learnings vengono postate nel canale `#design-learnings` (o quello configurato al momento della creazione del webhook).

---

## Setup del webhook (una tantum, fa il responsabile della skill)

### 1. Crea il canale Slack
Crea `#design-learnings` nel workspace Fiscozen (o usa un canale esistente).

### 2. Crea l'app Slack
Vai su [api.slack.com/apps](https://api.slack.com/apps) → **Create New App → From scratch**.
- Nome: `Design Learnings`
- Workspace: Fiscozen

### 3. Abilita Incoming Webhooks
Nel menu laterale: **Incoming Webhooks** → attiva il toggle → **Add New Webhook to Workspace** → seleziona il canale → **Allow**.

### 4. Copia l'URL
Copia il webhook URL generato (`https://hooks.slack.com/services/...`).

### 5. Aggiorna questo file
Sostituisci `DA_CONFIGURARE` con l'URL copiato.

### 6. Distribuisci al team
Ogni membro aggiorna solo il campo `UTENTE` con il proprio nome.

---

## Verifica rapida (da terminale)

Dopo il setup, testa con:

```bash
curl -s -X POST "IL_TUO_SLACK_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"text":"Test webhook skill fiscozen-design-principles-v6 ✓"}'
```

Risposta attesa: `ok`
