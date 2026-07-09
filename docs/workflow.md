# Designer → Claude Code → Engineer Workflow

This repository is primarily a **tool for designers** to create, validate and share pre-production UI/UX designs on feature branches, and then merge them into `main` so the repo becomes a **living catalogue of approved Fiscozen designs**. Every design in this repo is built exclusively out of `@fiscozen/*` design-system components — there are no custom components, no custom HTML, and no custom styles.

```
┌─────────────────────────┐    ┌──────────────────────────┐    ┌──────────────────────────┐    ┌────────────────────────┐
│ 1. Designer creates a   │    │ 2. Hand-off link from    │    │ 3. Claude Code in this   │    │ 4. Implementation in   │
│    design in Claude     │ →  │    Claude Design         │ →  │    repo: Jira key →      │ →  │    Vue using only      │
│    Design (claude.ai)   │    │    "hand off to          │    │    branch design/<KEY>,  │    │    @fiscozen/*         │
│                         │    │    Claude Code"          │    │    team → packages/<…>   │    │    components          │
└─────────────────────────┘    └──────────────────────────┘    └──────────────────────────┘    └────────────────────────┘
                                                                                                            │
                                                                                                            ▼
                                                                ┌──────────────────────────┐    ┌────────────────────────┐
                                                                │ 6. Reject (discard       │    │ 5. Auto-push to        │
                                                                │    branch) or approve    │ ←  │    design/<KEY>,       │
                                                                │    (merge into main)     │    │    open PR via gh      │
                                                                └──────────────────────────┘    └────────────────────────┘
```

## 1. Designer creates the design in Claude Design

**Who:** designer (non-tech).

**Where:** [claude.ai](https://claude.ai) — Claude Design, using the Fiscozen design system (`fiscozen/design_system`) as context.

**Output:** an interactive design artefact in Claude Design.

## 2. Hand-off via "hand off to Claude Code"

The designer uses Claude Design's **"hand off to Claude Code"** feature, which produces a shareable link to the design.

**Output:** a hand-off link (URL) the designer will paste into Claude Code in this repo.

## 3. Designer prompts Claude Code in this repo

The designer opens a Claude Code session in `tool.fiscozen.agentic-design/` and pastes the hand-off link with a request like *"implement this design"*.

Before writing any code, Claude Code must collect two pieces of information from the designer:

1. **Jira card key** — required. Claude Code asks: *"What's the Jira key for this design? (e.g., FZ-1234)"*. The key is used verbatim to create the branch:

   ```
   design/<JIRA-KEY>     # e.g., design/FZ-1234
   ```

   The branch is created from `main` and checked out automatically before any file is written.

2. **Team / domain** — required. Claude Code asks: *"Which team owns this design?"* and offers the current `packages/` subfolders (`accounting`, `customers`, `duties`, `shared`). The chosen folder is where the design will be scaffolded. (For now, *team* and *domain* are synonymous.)

3. **Layout** — required. Every design renders inside one of the two shared layouts in `packages/shared/src/templates/`:

   - **`FrontofficeLayout`** — FO surface (app clienti, mobile-first). Slots: `#sidebar` (left navigation), default (main content), optional `#chat` (right). Composed of `FzContainer` only.
   - **`BackofficeLayout`** — BO surface (tool team interno, desktop-first). Slots: `#sidebar` (left), default (main content). Composed of `FzContainer` only.

   If the layout is unambiguous from the hand-off (e.g., the design clearly shows the FO three-region shell or the BO desktop shell), Claude Code picks it and announces the pick. If not, it asks the designer explicitly. The two layouts are treated as valid DS components — never re-implemented per design.

If the designer doesn't know any of these values, Claude Code stops and asks them to obtain it from the engineer rather than guessing.

## 4. Claude Code implements the design

Claude Code implements the design in Vue using **only** components from `@fiscozen/*` (see [`fiscozen/design_system`](https://github.com/fiscozen/design_system) and the auto-refreshed [`.claude/design-system-inventory.md`](../.claude/design-system-inventory.md)), and wraps the page in the shared layout chosen in step 3.

### 4.1 Fail first when no DS component matches

If a part of the design has no `@fiscozen/*` component that matches it visually **and** functionally, Claude Code **stops and reports a DS gap**. It does **not** build a custom molecule, it does **not** approximate with raw HTML, and it does **not** add a `TODO`. The output to the designer is:

> *"Design system gap: `<element in the design>` has no matching `@fiscozen/*` component. Required behaviour: `<…>`. Cannot proceed — please review with the engineer."*

The branch is left as-is so the engineer can pick it up, file a `@fiscozen/<package>` ticket, and unblock the design once the missing component ships.

### 4.2 Propose design changes (never component changes)

When a `@fiscozen/*` component is *close* to what the design needs but requires small visual or functional adjustments to fit, Claude Code proposes **adjusting the design**, never the component. Example:

> *"`FzBadge` matches the badge in the design except it doesn't support an outlined variant. The design system will not be changed. Proposed design change: use the filled `info` variant instead. OK to proceed?"*

The designer accepts the design change, picks an alternative, or escalates to the engineer. No code is written until the designer agrees.

### 4.3 No custom anything

For **no reason ever** will Claude Code:

- create custom Vue components,
- write raw HTML where a `@fiscozen/*` component exists,
- add `class` / `:class` / `style` / `:style` / `<style>` blocks anywhere,
- use Tailwind utilities for layout or typography.

The **only** raw HTML allowed is **bare semantic text tags** (`<p>`, `<pre>`, `<strong>`, `<em>`, `<code>`, etc.). When such a tag needs any visual styling (bold, colour, weight, …), the styling must come from the `@fiscozen/style` directives (`v-bold`, `v-color:<token>`, …), not from a class or inline style.

```vue
<!-- ✅ Allowed: bare semantic tag, default browser styling only -->
<p>Some descriptive copy.</p>

<!-- ✅ Allowed: styled via DS directives, no class/style -->
<p v-bold v-color:semantic-error-300>Important notice</p>

<!-- ❌ Forbidden: custom class / Tailwind utility -->
<p class="font-semibold text-red-500">Important notice</p>
```

For layout, use [`FzContainer`](../.cache/design_system/packages/container/src/) — never a `<div class="flex …">`.

## 5. Auto-push to the branch and open a PR

Once the design renders correctly **and** Playwright visual verification has passed, Claude Code:

1. Commits the changes on `design/<JIRA-KEY>`.
2. Pushes the branch to the remote.
3. Opens a **non-draft** Pull Request against `main` using `gh pr create`. The PR title is the Jira key + design summary; the PR body contains the hand-off link, the team/domain, screenshots from the Playwright verification, and any DS gaps surfaced under §4.2.

If `gh` (the GitHub CLI) is not installed or not authenticated, Claude Code prompts the designer step-by-step to install and authenticate it (`brew install gh`, then `gh auth login`) before retrying. Designers are non-technical, so the instructions must be copy-pasteable and verified after each step.

If a push is rejected because of conflicts with the remote branch, Claude Code walks the designer through resolution — reading the conflicting files, explaining the change in plain language, applying the resolution, and re-running the push. The designer is never expected to use `git` from the terminal themselves.

## 6. Reject or approve

The PR is reviewed (typically by an engineer or product stakeholder). The two outcomes are:

- **Approve → merge into `main`.** The design becomes part of the living catalogue. From this point on, anyone browsing the domain app sees the approved design alongside all other approved ones.
- **Reject → discard the branch.** The PR is closed and `design/<JIRA-KEY>` is deleted.

Both actions can be performed in the GitHub UI. If the designer prefers, Claude Code can drive them from the CLI:

```bash
gh pr merge <PR-NUMBER> --merge --delete-branch    # approve
gh pr close  <PR-NUMBER> --delete-branch           # reject
```

Claude Code confirms the action in plain language before running it and reports the result.

## DS gaps and round-trip

When step 4.1 produces a DS gap, the engineer files a ticket on [`fiscozen/design_system`](https://github.com/fiscozen/design_system) for the missing component. Once a new `@fiscozen/*` release lands and is bumped here, the blocked design can be re-attempted — same Jira key, same `design/<KEY>` branch, now unblocked.

This is the loop the hub is built for. The design system never changes to fit a single design; designs change to fit the system, or the system grows deliberately via tickets.
