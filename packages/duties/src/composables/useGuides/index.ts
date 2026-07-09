import { ref } from 'vue'

export type GuideStepAlertTone = 'info' | 'error' | 'danger' | 'warning' | 'success'

export type GuideStepAlertPosition = 'before' | 'after'

export interface GuideStepAlert {
  tone: GuideStepAlertTone
  position: GuideStepAlertPosition
  title: string
  text: string
}

export interface GuideStepImporto {
  /** References a calculation source from the importi catalogue; its amounts are resolved at runtime */
  fonte: string
}

/** A document block can be both: the guide author shares files to download (`fornisci`)
 *  and/or asks the user to submit a document — upload field shown in the guide (`richiedi`). */
export interface GuideStepDocumento {
  fornisci: boolean
  richiedi: boolean
  /** One entry per document requested from the client (only used when `richiedi` is true) */
  requests: string[]
  files: File[]
}

export type GuideStepDomandaType = 'single' | 'multiple' | 'yesno'

/** A question shown to the user in the guide step. `answers` is ignored for the
 *  `yesno` type (its options are always "Sì" / "No"). */
export interface GuideStepDomanda {
  type: GuideStepDomandaType
  question: string
  answers: string[]
}

export interface GuideStep {
  id: number
  title: string
  description: string
  media: File[]
  alert: GuideStepAlert | null
  importi: GuideStepImporto[]
  documenti: GuideStepDocumento[]
  domande: GuideStepDomanda[]
}

export type GuideStatus = 'draft' | 'published'

/** Catalogue of guide themes — used in the editor "Prodotto" section and as a list filter. */
export const guideTemaOptions = [
  { value: 'dichiarazione', label: 'Dichiarazione dei Redditi' },
  { value: 'tasse', label: 'Tasse' },
  { value: 'fatture', label: 'Fatture' },
  { value: 'adempimenti', label: 'Adempimenti' },
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'servizio-extra', label: 'Servizio Extra' }
]

/** Snapshot of the editable content of a guide. Used to keep the published
 *  ("Live") version separate from the working ("Bozza") draft once a guide has
 *  been published and then edited. */
export interface GuideVersion {
  title: string
  area: string
  productArea?: string | number
  tema?: string | number
  frontofficeTask?: string | number
  taskYear?: string | number
  steps: GuideStep[]
}

export interface Guide {
  id: number
  title: string
  updatedAt: string
  modified: string
  area: string
  author: string
  status: GuideStatus
  productArea?: string | number
  tema?: string | number
  frontofficeTask?: string | number
  taskYear?: string | number
  projectId?: number
  steps: GuideStep[]
  /** Snapshot of the currently-published (Live) content. Present once the guide
   *  has been published at least once. The top-level fields hold the working
   *  (Bozza) content, which may diverge from this snapshot after edits. */
  published?: GuideVersion
  /** True when the working draft has diverged from the published snapshot
   *  (guide was published, then edited & saved as draft). */
  hasDraftChanges?: boolean
}

export type GuideDraft = {
  title: string
  area: string
  productArea?: string | number
  tema?: string | number
  frontofficeTask?: string | number
  taskYear?: string | number
  projectId?: number
  steps: GuideStep[]
}

const guides = ref<Guide[]>([])

const formatDate = (date: Date) =>
  date.toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })

/** Snapshot the editable content of a draft into a standalone version object. */
const snapshotVersion = (data: GuideDraft): GuideVersion => ({
  title: data.title,
  area: data.area,
  productArea: data.productArea,
  tema: data.tema,
  frontofficeTask: data.frontofficeTask,
  taskYear: data.taskYear,
  steps: data.steps.map((s) => ({ ...s }))
})

export function useGuides() {
  const getGuide = (id: number) => guides.value.find((g) => g.id === id)

  /** The published ("Live") snapshot of a guide, if any. */
  const getLiveVersion = (id: number) => getGuide(id)?.published

  const addGuide = (data: GuideDraft, status: GuideStatus = 'draft') => {
    const id = guides.value.length ? Math.max(...guides.value.map((g) => g.id)) + 1 : 1
    const today = formatDate(new Date())
    guides.value.push({
      id,
      title: data.title,
      area: data.area,
      productArea: data.productArea,
      tema: data.tema,
      frontofficeTask: data.frontofficeTask,
      taskYear: data.taskYear,
      projectId: data.projectId,
      steps: data.steps,
      author: 'Tu',
      status,
      updatedAt: today,
      modified: today,
      published: status === 'published' ? snapshotVersion(data) : undefined,
      hasDraftChanges: false
    })
    return id
  }

  const updateGuide = (id: number, data: GuideDraft, status: GuideStatus = 'draft') => {
    const guide = getGuide(id)
    if (!guide) return
    const today = formatDate(new Date())
    // Working (Bozza) content always reflects the latest edit.
    guide.title = data.title
    guide.area = data.area
    guide.productArea = data.productArea
    guide.tema = data.tema
    guide.frontofficeTask = data.frontofficeTask
    guide.taskYear = data.taskYear
    if (data.projectId !== undefined) guide.projectId = data.projectId
    guide.steps = data.steps
    guide.modified = today

    if (status === 'published') {
      // Publishing (or re-publishing) promotes the working content to Live.
      guide.status = 'published'
      guide.published = snapshotVersion(data)
      guide.hasDraftChanges = false
    } else if (guide.published) {
      // Saving a draft on an already-published guide keeps the Live snapshot
      // intact and records that a divergent Bozza now exists.
      guide.status = 'published'
      guide.hasDraftChanges = true
    } else {
      // Never-published guide: plain draft save.
      guide.status = 'draft'
      guide.hasDraftChanges = false
    }
  }

  const deleteGuide = (id: number) => {
    const index = guides.value.findIndex((g) => g.id === id)
    if (index !== -1) guides.value.splice(index, 1)
  }

  const duplicateGuide = (id: number) => {
    const source = getGuide(id)
    if (!source) return
    const newId = guides.value.length ? Math.max(...guides.value.map((g) => g.id)) + 1 : 1
    const today = formatDate(new Date())
    guides.value.push({
      ...source,
      id: newId,
      title: `${source.title} (copia)`,
      steps: source.steps.map((s) => ({ ...s })),
      status: 'draft',
      author: 'Tu',
      updatedAt: today,
      modified: today
    })
    return newId
  }

  return { guides, getGuide, getLiveVersion, addGuide, updateGuide, deleteGuide, duplicateGuide }
}
