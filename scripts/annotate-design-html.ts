#!/usr/bin/env node
/**
 * Deterministic pre-pass that adds `data-fz-component` hints to HTML coming
 * from Claude Design (or any other source) for unambiguous tag-level
 * substitutions. Compound patterns — FzCard, nested FzContainer, FzTab
 * grouping, FzBadge semantics — are intentionally left untouched for a
 * downstream LLM pass.
 *
 * Design constraints:
 *   - Idempotent: re-running on the output is a no-op.
 *   - Non-destructive: existing `data-fz-component` attributes are preserved.
 *   - Conservative: only annotates when the mapping is unambiguous from
 *     `tag` plus a couple of attributes.
 *
 * Usage:
 *   tsx scripts/annotate-design-html.ts <input.html> [-o <output.html>] [--stdout]
 *
 * Tests live in scripts/annotate-design-html.test.ts (run via `pnpm test:scripts`).
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parse, type HTMLElement } from 'node-html-parser'

const MARKER_ATTR = 'data-fz-component'
const SKIP_INPUT_TYPES = new Set(['hidden', 'file'])
const ICON_ONLY_TAGS = new Set(['svg', 'i', 'img', 'use', 'path', 'g', 'span'])

export type AnnotationCounts = Record<string, number>
export interface AnnotateResult {
  html: string
  counts: AnnotationCounts
}

function inferFzForInput(el: HTMLElement): string | null {
  const t = (el.getAttribute('type') ?? '').toLowerCase()
  if (SKIP_INPUT_TYPES.has(t)) return null
  if (t === 'date' || t === 'datetime-local' || t === 'month') return 'FzDatepicker'
  return 'FzInput'
}

function isIconOnlyButton(el: HTMLElement): boolean {
  if ((el.textContent ?? '').trim().length > 0) return false
  const descendants = el.querySelectorAll('*')
  if (descendants.length === 0) return false
  return descendants.every((d) => ICON_ONLY_TAGS.has((d.tagName ?? '').toLowerCase()))
}

function inferFz(el: HTMLElement): string | null {
  switch ((el.tagName ?? '').toLowerCase()) {
    case 'input':
      return inferFzForInput(el)
    case 'textarea':
      return 'FzTextarea'
    case 'select':
      return 'FzSelect'
    case 'button':
      return isIconOnlyButton(el) ? 'FzIconButton' : 'FzButton'
    case 'table':
      return 'FzSimpleTable'
    case 'dialog':
      return 'FzDialog'
    default:
      return null
  }
}

export function annotate(html: string): AnnotateResult {
  const root = parse(html, { comment: true })
  const counts: AnnotationCounts = {}
  for (const el of root.querySelectorAll('*')) {
    if (el.getAttribute(MARKER_ATTR)) continue
    const fz = inferFz(el)
    if (!fz) continue
    el.setAttribute(MARKER_ATTR, fz)
    counts[fz] = (counts[fz] ?? 0) + 1
  }
  return { html: root.toString(), counts }
}

function summary(counts: AnnotationCounts): string {
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  const lines = [`annotated ${total} element(s):`]
  for (const [comp, n] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    lines.push(`  ${comp.padEnd(20)} ${n}`)
  }
  return lines.join('\n') + '\n'
}

function cli(argv: string[]): number {
  if (argv.length === 0 || argv.includes('-h') || argv.includes('--help')) {
    process.stderr.write(
      [
        'Usage: annotate-design-html <input.html> [options]',
        '',
        'Options:',
        '  -o, --out <file>   output path (default: <input>.annotated.html)',
        '  --stdout           write annotated HTML to stdout instead',
        '',
        'Adds data-fz-component hints to HTML for Fz* atom substitution.',
        'Conservative: only annotates unambiguous tag-level mappings.',
        ''
      ].join('\n')
    )
    return argv.length === 0 ? 1 : 0
  }

  const input = argv[0]
  const stdout = argv.includes('--stdout')
  const outIdx = Math.max(argv.indexOf('-o'), argv.indexOf('--out'))
  const out =
    outIdx !== -1 && argv[outIdx + 1]
      ? argv[outIdx + 1]
      : stdout
        ? null
        : input.replace(/\.html?$/i, '') + '.annotated.html'

  const html = readFileSync(input, 'utf8')
  const { html: annotated, counts } = annotate(html)

  if (stdout) process.stdout.write(annotated)
  else if (out) {
    writeFileSync(out, annotated)
    process.stderr.write(`wrote ${out}\n`)
  }
  process.stderr.write(summary(counts))
  return 0
}

if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  process.exit(cli(process.argv.slice(2)))
} else if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exit(cli(process.argv.slice(2)))
}
