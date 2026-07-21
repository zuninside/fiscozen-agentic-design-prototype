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

export type GuideStepDomandaType = 'single' | 'multiple' | 'importi'

/** A question shown to the user in the guide step. `answers` is ignored for the
 *  `importi` type (the user enters a numeric amount instead of picking an answer). */
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

/** "Punto di partenza": a cosa è collegata la guida (adempimento esistente o
 *  nuovo FO Task) e la configurazione del task. */
export interface GuideStartingPoint {
  link: 'adempimento' | 'fotask'
  adempimento?: string | number
  foTaskTitle: string
  foTaskQueryTarget?: string | number
  foTaskStartDate: Date | null
  foTaskEndDate: Date | null
  foTaskHasDeadline: boolean
  foTaskDeadline: Date | null
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
  frontofficeTask?: string | number
  taskYear?: string | number
  steps: GuideStep[]
  startingPoint?: GuideStartingPoint
}

export type GuideDraft = {
  title: string
  area: string
  productArea?: string | number
  frontofficeTask?: string | number
  taskYear?: string | number
  steps: GuideStep[]
  startingPoint?: GuideStartingPoint
}

const guides = ref<Guide[]>([])

const formatDate = (date: Date) =>
  date.toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })

export function useGuides() {
  const getGuide = (id: number) => guides.value.find((g) => g.id === id)

  const addGuide = (data: GuideDraft, status: GuideStatus = 'draft') => {
    const id = guides.value.length ? Math.max(...guides.value.map((g) => g.id)) + 1 : 1
    const today = formatDate(new Date())
    guides.value.push({
      id,
      title: data.title,
      area: data.area,
      productArea: data.productArea,
      frontofficeTask: data.frontofficeTask,
      taskYear: data.taskYear,
      steps: data.steps,
      startingPoint: data.startingPoint,
      author: 'Tu',
      status,
      updatedAt: today,
      modified: today
    })
    return id
  }

  const updateGuide = (id: number, data: GuideDraft, status: GuideStatus = 'draft') => {
    const guide = getGuide(id)
    if (!guide) return
    const today = formatDate(new Date())
    guide.title = data.title
    guide.area = data.area
    guide.productArea = data.productArea
    guide.frontofficeTask = data.frontofficeTask
    guide.taskYear = data.taskYear
    guide.steps = data.steps
    guide.startingPoint = data.startingPoint
    guide.modified = today
    // Once published a guide is read-only, so this only ever runs for drafts.
    guide.status = status
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

  return { guides, getGuide, addGuide, updateGuide, deleteGuide, duplicateGuide }
}
