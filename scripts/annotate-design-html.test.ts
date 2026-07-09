import { describe, expect, it } from 'vitest'
import { annotate } from './annotate-design-html'

describe('annotate', () => {
  it('annotates a plain input as FzInput', () => {
    expect(annotate('<input placeholder="x" />').counts).toEqual({ FzInput: 1 })
  })

  it('annotates a date input as FzDatepicker', () => {
    expect(annotate('<input type="date" />').counts).toEqual({ FzDatepicker: 1 })
    expect(annotate('<input type="datetime-local" />').counts).toEqual({
      FzDatepicker: 1
    })
    expect(annotate('<input type="month" />').counts).toEqual({ FzDatepicker: 1 })
  })

  it('skips hidden and file inputs', () => {
    expect(annotate('<input type="hidden" /><input type="file" /><input />').counts).toEqual({
      FzInput: 1
    })
  })

  it('annotates textarea / select / table / dialog', () => {
    expect(
      annotate('<textarea></textarea><select></select><table></table><dialog></dialog>').counts
    ).toEqual({
      FzTextarea: 1,
      FzSelect: 1,
      FzSimpleTable: 1,
      FzDialog: 1
    })
  })

  it('annotates a button with text as FzButton', () => {
    expect(annotate('<button>Save</button>').counts).toEqual({ FzButton: 1 })
  })

  it('annotates a button with only an icon child as FzIconButton', () => {
    expect(annotate('<button><svg></svg></button>').counts).toEqual({ FzIconButton: 1 })
    expect(annotate('<button><i class="fa-trash"></i></button>').counts).toEqual({
      FzIconButton: 1
    })
  })

  it('treats button with text + icon as FzButton (not icon-only)', () => {
    expect(annotate('<button><svg></svg>Save</button>').counts).toEqual({ FzButton: 1 })
  })

  it('preserves an existing data-fz-component attribute', () => {
    const input = '<input data-fz-component="FzCurrencyInput" />'
    const result = annotate(input)
    expect(result.counts).toEqual({})
    expect(result.html).toContain('FzCurrencyInput')
  })

  it('is idempotent — re-running on the output adds nothing', () => {
    const html = `
      <form>
        <input type="text" />
        <input type="date" />
        <button>Save</button>
        <button><svg></svg></button>
      </form>
    `
    const first = annotate(html)
    const second = annotate(first.html)
    expect(second.counts).toEqual({})
  })

  it('handles a real-world snippet (form with mixed primitives)', () => {
    const html = `
      <form>
        <input type="text" name="cliente" />
        <input type="date" name="data" />
        <select><option>A</option></select>
        <textarea></textarea>
        <button type="submit">Salva</button>
        <button aria-label="Elimina"><svg></svg></button>
      </form>
    `
    expect(annotate(html).counts).toEqual({
      FzInput: 1,
      FzDatepicker: 1,
      FzSelect: 1,
      FzTextarea: 1,
      FzButton: 1,
      FzIconButton: 1
    })
  })

  it('does not annotate non-target tags (div, form, span, a, table cells)', () => {
    const html =
      '<div><form><span></span><a href="#">link</a><table><tr><td></td></tr></table></form></div>'
    const { counts } = annotate(html)
    // table is annotated; div/form/span/a/tr/td are not
    expect(counts).toEqual({ FzSimpleTable: 1 })
  })
})
