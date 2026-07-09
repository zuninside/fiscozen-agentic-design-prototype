# Fiscozen Design Principles — Vendored Snapshot

This directory contains a **vendored snapshot** of the third-party design-principles skill maintained by the design team. It is consumed by `.claude/agents/fiscozen-design-principles-reviewer.md` as part of this hub's automated design review.

## Source

- **Repository:** [`darw5n/fiscozen-design-principles`](https://github.com/darw5n/fiscozen-design-principles) (private)
- **Branch:** `version-6` (default)
- **Commit:** `910278fd3ce1c7cdc70c5d9605bd0af4eb0a1e29` (2026-05-12)
- **Imported on:** 2026-05-18
- **Imported by:** Marco Munari (`marco.munari@fiscozen.it`)

Files were copied verbatim into `version-6/`, minus the `.git/` directory. No content was rewritten.

## How this is wired in

- `.claude/agents/fiscozen-design-principles-reviewer.md` is the agent that consumes these files. It runs in **REVIEW mode only** (see `SKILL.md` Step 1 in this folder) — never in CREAZIONE mode. Implementation in this hub is owned by `/implement-design` and the atomic-design rules; this skill only evaluates a finished implementation against the design principles.
- `/implement-design` invokes the reviewer after Playwright visual verification, before opening the PR (see `.claude/skills/implement-design.md`).
- The reviewer reads the principle files in `version-6/principles/`, `version-6/microcopy.md`, `version-6/confini.md`, `version-6/stati.md`, `version-6/motion.md`, `version-6/context.md`, `version-6/design-system.md`, `version-6/riferimenti.md`, and `version-6/examples/`. Everything else in `version-6/` is dormant in this hub (see "Disabled in this hub" below).

## Disabled in this hub

The upstream skill ships two side-effecting mechanisms that we **deliberately do not run** in this repository's automated flow. The files are still vendored for fidelity with upstream, but no code path here invokes them:

| Upstream feature | Files | Why disabled here |
| ---------------- | ----- | ----------------- |
| Auto-update from GitHub on every invocation (Step 0 of upstream `SKILL.md`) | `version-6/scripts/check-update.sh`, the `Step 0 — Controllo aggiornamenti` section of `version-6/SKILL.md` | We vendor a pinned snapshot. Updates happen by re-syncing this folder explicitly (see "How to re-sync" below), not by network calls during a review. |
| Slack-webhook learnings ("Manutenzione della skill" in upstream `SKILL.md`) | `version-6/learnings.md`, `version-6/learnings-config.md`, the curl-to-Slack instructions in `SKILL.md` | Posting to a personal Slack webhook from this hub's review flow is out of scope. Designer feedback against principles is captured in the PR conversation instead. |
| CREAZIONE mode of upstream `SKILL.md` | `SKILL.md` Step 4 → CREAZIONE — comportamento and downstream | Implementation in this hub is driven by `/implement-design` + atomic-design rules. We use only the REVIEW half of this skill. |
| Upstream `implementation.md` | `version-6/implementation.md` | Describes a different Vue/playground setup; **superseded by this repo's `CLAUDE.md` + `docs/atomic-design.md`** when there's a conflict. The reviewer agent is instructed to defer to the hub's atomic-design rules over `implementation.md`. |

The reviewer agent (`.claude/agents/fiscozen-design-principles-reviewer.md`) explicitly tells the model not to invoke any of the above.

## How to re-sync to a newer upstream version

When the design team publishes a new minor revision on `version-6` (or a new major branch like `version-7`):

1. Clone the upstream repo to a tmp dir:
   ```bash
   git clone --depth 1 --branch <branch> git@github.com:darw5n/fiscozen-design-principles.git /tmp/fdp-new
   ```
2. Replace the snapshot directory:
   ```bash
   rm -rf .claude/external/fiscozen-design-principles/<branch>
   cp -R /tmp/fdp-new .claude/external/fiscozen-design-principles/<branch>
   rm -rf .claude/external/fiscozen-design-principles/<branch>/.git
   ```
3. Update the **Source** block at the top of this file (branch, commit, imported date) and add an entry to the "Change log" section below.
4. Re-read this `PROVENANCE.md` end-to-end to confirm the **Disabled in this hub** table is still accurate against the new upstream `SKILL.md` (the upstream may add new side-effecting features that also need to be disabled here).
5. Update the path references in `.claude/agents/fiscozen-design-principles-reviewer.md` if the directory name changed (e.g., from `version-6` to `version-7`).

## How to remove this skill entirely

Removal is intentionally scoped — delete two paths and three references:

1. `rm -rf .claude/external/fiscozen-design-principles/`
2. `rm .claude/agents/fiscozen-design-principles-reviewer.md`
3. Remove the reviewer invocation step from `.claude/skills/implement-design.md` (search for `fiscozen-design-principles-reviewer`).
4. Remove the one-line reference from `CLAUDE.md` (search for `fiscozen-design-principles`).

After those four edits, no part of the hub depends on the design principles ruleset.

## Change log

| Date | Branch | Commit | Note |
| ---- | ------ | ------ | ---- |
| 2026-05-18 | `version-6` | `910278f` | Initial vendoring. |
