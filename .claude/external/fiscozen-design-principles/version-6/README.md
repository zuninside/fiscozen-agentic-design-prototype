# Fiscozen Design Principles — Skill per Claude Code

Skill che guida Claude Code a produrre interfacce coerenti con i principi di design Fiscozen: accessibilità WCAG 2.1 AA, microcopy, gestione di tutti gli stati (empty, loading, error, success), pattern del design system.

## Setup (una tantum)

**Prerequisiti**

Devi avere [Claude Code](https://claude.com/claude-code) e [GitHub CLI](https://cli.github.com/) installati. Se ti manca `gh`:

```bash
brew install gh
```

**Autenticazione GitHub**

```bash
gh auth login
```

Segui il prompt: scegli `GitHub.com` → `SSH` come protocollo → segui le istruzioni per generare/caricare la chiave.

**Clone della skill nella cartella di Claude Code**

```bash
git clone git@github.com:darw5n/fiscozen-design-principles.git \
  ~/.claude/skills/fiscozen-design-principles
```

Fatto. La skill è pronta.

## Come usarla

In Claude Code, invoca la skill quando stai progettando o sviluppando un'interfaccia:

```
/fiscozen-design-principles
```

Oppure Claude la attiverà automaticamente quando rileva una richiesta pertinente (es. "crea un form", "che microcopy uso per…", "come gestisco lo stato di errore").

## Aggiornamento automatico

La skill si aggiorna **da sola** a ogni invocazione:

- Verifica se esiste una versione più recente su GitHub
- Se sì, fa `git pull` e ti avvisa di rilanciare la richiesta
- Cache di 24h per non rallentare
- Se sei offline, salta in silenzio senza bloccarti

Non devi fare niente.

## ⚠️ Non modificare i file in locale

Gli aggiornamenti automatici funzionano solo se la tua copia è "pulita". Se modifichi i file dentro `~/.claude/skills/fiscozen-design-principles/`, il `git pull` fallisce in silenzio e la skill smette di aggiornarsi.

**Per proporre cambi:** apri una pull request sul repo. Vedi sotto.

## Proporre miglioramenti

1. Forka il repo (o clona in una cartella diversa da `~/.claude/skills/`)
2. Crea un branch dal branch `version-6`
3. Fai le tue modifiche
4. Apri una PR verso `version-6`

Per cambi che rompono la compatibilità (modifiche strutturali al SKILL.md, riorganizzazione dei file), si aprirà un branch `version-7` e le copie esistenti resteranno su `version-6` finché i colleghi non aggiornano manualmente.

## Versioning

- `version-6` (default) → versione corrente, riceve bug fix
- `version-N` → versione futura con breaking changes

Quando esce una nuova major version, ti verrà comunicato come aggiornare.

## Problemi?

Scrivi a `darwin.vegher@fiscozen.it` o apri una issue sul repo.
