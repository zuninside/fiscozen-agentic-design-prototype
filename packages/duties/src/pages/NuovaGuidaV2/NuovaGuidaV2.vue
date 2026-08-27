<script setup lang="ts">
import { ref, computed, watch, type ComponentPublicInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { FzIcon } from '@fiscozen/icons'
import { FzButton, FzIconButton } from '@fiscozen/button'
import { FzConfirmDialog } from '@fiscozen/dialog'
import { FzNavbar } from '@fiscozen/navbar'
import { FzAvatar } from '@fiscozen/avatar'
import { FzInput } from '@fiscozen/input'
import { FzSelect } from '@fiscozen/select'
import { FzRadioCard, FzRadioGroup } from '@fiscozen/radio'
import { FzDatepicker } from '@fiscozen/datepicker'
import { FzUpload } from '@fiscozen/upload'
import { FzCheckbox, FzCheckboxCard } from '@fiscozen/checkbox'
import { FzTextarea } from '@fiscozen/textarea'
import { FzDivider } from '@fiscozen/divider'
import { FzStepper } from '@fiscozen/stepper'
import { FzAlert } from '@fiscozen/alert'
import { FzCard } from '@fiscozen/card'
import { FzToastQueue, enqueueToast, type Toast } from '@fiscozen/toast'
import { FzFloating, useClickOutside } from '@fiscozen/composables'
import { FzActionList, FzActionSection, FzAction } from '@fiscozen/action'
import { useGuides, type GuideStep, type GuideStepDomanda, type GuideStepDocumento } from '../../composables/useGuides'
import { useImportiCatalog } from '../../composables/useImportiCatalog'

const router = useRouter()
const route = useRoute()
const goHome = () => router.push({ name: 'progetti' })
const { addGuide, updateGuide, getGuide, deleteGuide, unpublishGuide } = useGuides()

// Bottone header: elimina (bozza) oppure annulla pubblicazione (guida pubblicata)
const deleteDialog = ref<InstanceType<typeof FzConfirmDialog>>()
const unpublishDialog = ref<InstanceType<typeof FzConfirmDialog>>()
const askDeleteGuide = () => {
  if (isPublished.value) unpublishDialog.value?.show()
  else deleteDialog.value?.show()
}
const confirmDeleteGuide = () => {
  if (editingId.value) deleteGuide(editingId.value)
  goHome()
}
const confirmUnpublish = () => {
  if (editingId.value) unpublishGuide(editingId.value)
  goHome()
}

// Uscita con modifiche non salvate (intercetta il tasto "back")
const unsavedDialog = ref<InstanceType<typeof FzConfirmDialog>>()
const requestBack = () => {
  if (isDirty.value) unsavedDialog.value?.show()
  else goHome()
}
const exitWithoutSaving = () => goHome()
const saveAndExit = () => {
  persist('draft')
  goHome()
}

// Dialog informativa sul "Punto di partenza"
const startInfoDialog = ref<InstanceType<typeof FzConfirmDialog>>()

// Conferma di pubblicazione: dopo la pubblicazione la guida non è più modificabile
const publishDialog = ref<InstanceType<typeof FzConfirmDialog>>()
const askPublish = () => {
  const invalid = firstInvalidLocation()
  if (invalid) {
    showErrors.value = true
    selection.value = invalid
    enqueueToast(
      { type: 'error', message: 'Compila tutti i campi obbligatori prima di pubblicare' },
      toastQueue
    )
    return
  }
  publishDialog.value?.show()
}

const editingId = computed(() =>
  route.params.id ? Number(route.params.id) : undefined
)
// In modifica mostra il titolo della guida (fallback finché non ne ha uno)
const pageTitle = computed(() => {
  if (!editingId.value) return 'Nuova guida'
  return guideName.value.trim() || 'Guida senza titolo'
})
const isPublished = computed(
  () => !!editingId.value && getGuide(editingId.value)?.status === 'published'
)
// Sola lettura sia per le guide pubblicate sia per quelle con pubblicazione
// annullata: entrambe non sono modificabili né (ri)pubblicabili.
const isReadOnly = computed(() => {
  const status = editingId.value ? getGuide(editingId.value)?.status : undefined
  return status === 'published' || status === 'unpublished'
})
const publishLabel = computed(() => (isPublished.value ? 'Aggiorna' : 'Pubblica'))

const toastQueue = ref<Toast[]>([])

const railIcons = ['suitcase', 'folder-open', 'credit-card', 'cart-shopping', 'calendar', 'file']

// Menu del bottone "gear" (ingranaggio): elenco delle pagine disponibili.
// Costruito con FzFloating per aprirsi a destra dell'icona (non sotto).
const gearOpen = ref(false)
const gearFloating = ref<ComponentPublicInstance>()
const gearFloatingDom = computed(() => gearFloating.value?.$el)
useClickOutside(gearFloatingDom, () => {
  gearOpen.value = false
})
const openGuideClienti = () => {
  gearOpen.value = false
  router.push({ name: 'progetti' })
}

const steps = ref<GuideStep[]>([])
const selection = ref('settings')
const isSettings = computed(() => selection.value === 'settings')
const currentStep = computed(() => steps.value.find((s) => `step-${s.id}` === selection.value))
const isLastStep = computed(() => {
  const last = steps.value[steps.value.length - 1]
  return !!currentStep.value && !!last && currentStep.value.id === last.id
})


const guideName = ref('')

const frontofficeTask = ref<string | number | undefined>(undefined)
const frontofficeTaskOptions = [
  'USER_TAX_DECLARATION_UPDATE_DATA',
  'USER_TAX_DECLARATION_COMPILE_DATA',
  'USER_OLD_ACCOUNTANT_PAYMENT',
  'TAX_STAMP_PAYMENT',
  'STS_FULFILLMENT',
  'SEND_INARCASSA_WELFARE_DECLARATION',
  'SEND_FORENSE_WELFARE_DECLARATION',
  'SEND_ENPAP_WELFARE_DECLARATION',
  'SEND_ENPAPI_WELFARE_DECLARATION',
  'SEND_ENPAM_WELFARE_DECLARATION',
  'SEND_CU',
  'REQUEST_DELEGATION',
  'PAY_USER_F24',
  'PAY_OVERDUE_SUBSCRIPTION_PAYMENTS',
  'PAY_INPS_COM_WELFARE_CONTRIBUTION',
  'PAY_INPS_ART_WELFARE_CONTRIBUTION',
  'PAY_INARCASSA_WELFARE_CONTRIBUTION',
  'PAY_INAIL_WELFARE_CONTRIBUTION',
  'PAY_FORENSE_WELFARE_CONTRIBUTION',
  'PAY_ENPAP_WELFARE_CONTRIBUTION',
  'PAY_ENPAPI_WELFARE_CONTRIBUTION',
  'PAY_ENPAM_WELFARE_CONTRIBUTION',
  'PAY_CHURNED_SUBSCRIPTION',
  'PASSIVE_INVOICE_REGISTRATION',
  'PASSIVE_CREDIT_NOTE_REGISTRATION',
  'INVOICES_MANDATE_RENEWAL',
  'INVOICES_MANDATE_ACTIVATION',
  'INVOICE_PAYMENTS',
  'FISCOZEN_MEETING_REMINDER',
  'ELECTRONIC_INVOICING_ACTIVATION',
  'CUSTOMER_ONBOARDING',
  'CUSTOMER_MEETING_REMINDER',
  'CREDIT_NOTES_ASSOCIATOR',
  'CONFIRM_COLLECTED_DATA',
  'CASH_DRAWER_POS_CONNECTION',
  'CALCOLO_IMU_SALDO',
  'CALCOLO_IMU_ACCONTO',
  'BOOKING_REQUEST_BY_FISCOZEN'
].map((value) => ({ value, label: value }))

const taskYear = ref<string | number | undefined>(undefined)
const isWelfareDeclarationTask = computed(
  () => typeof frontofficeTask.value === 'string' && frontofficeTask.value.endsWith('_WELFARE_DECLARATION')
)
const currentYear = new Date().getFullYear()
const taskYearOptions = Array.from({ length: 6 }, (_, i) => {
  const year = currentYear - i
  return { value: year, label: String(year) }
})

const guideLink = ref<'adempimento' | 'fotask'>('adempimento')

// "Un adempimento" branch: pick one of Fiscozen's adempimenti.
const adempimento = ref<string | number | undefined>()
const adempimentoOptions = [
  { value: 'certificazione_unica', label: 'Certificazione Unica' },
  { value: 'dichiarazione_redditi', label: 'Dichiarazione dei Redditi' },
  { value: 'dichiarazione_iva', label: 'Dichiarazione IVA' },
  { value: 'modello_770', label: 'Modello 770' },
  { value: 'lipe', label: 'Liquidazione periodica IVA (LIPE)' },
  { value: 'intrastat', label: 'Intrastat' },
  { value: 'comunicazione_reddituale_enpam', label: 'Comunicazione reddituale a ENPAM' },
  { value: 'comunicazione_reddituale_enpap', label: 'Comunicazione reddituale a ENPAP' },
  { value: 'comunicazione_reddituale_enpapi', label: 'Comunicazione reddituale a ENPAPI' },
  { value: 'comunicazione_reddituale_inarcassa', label: 'Comunicazione reddituale a Inarcassa' },
  { value: 'comunicazione_reddituale_forense', label: 'Comunicazione reddituale a Cassa forense' },
  { value: 'f24', label: 'F24' }
]

// "Un nuovo FO Task" branch: define a brand new frontoffice task.
const foTaskTitle = ref('')
const foTaskQueryTarget = ref<string | number | undefined>()
const foTaskQueryTargetOptions = [
  { value: 'active_users', label: 'Utenti attivi' },
  { value: 'users_with_vat', label: 'Utenti con partita IVA' },
  { value: 'forfettari', label: 'Utenti in regime forfettario' },
  { value: 'missing_declaration', label: 'Dichiarazione non ancora inviata' },
  { value: 'overdue_f24', label: 'F24 in scadenza o scaduti' },
  { value: 'incomplete_profile', label: 'Profilo incompleto' },
  { value: 'welfare_pending', label: 'Contributi previdenziali da versare' },
  { value: 'architetti_ingegneri', label: 'Utenti architetti e ingegneri' }
]
const foTaskStartDate = ref<Date | null>(null)
// La data di inizio non può essere anteriore a oggi (giorno di creazione).
const taskStartMinDate = new Date(new Date().setHours(0, 0, 0, 0))
const foTaskEndDate = ref<Date | null>(null)
const foTaskHasDeadline = ref(false)
const foTaskDeadline = ref<Date | null>(null)
// Vincoli temporali del FO Task: la fine non può precedere l'inizio e la
// scadenza deve cadere tra inizio e fine (mai prima né dopo).
watch([foTaskStartDate, foTaskEndDate], ([start, end]) => {
  if (start && end && end < start) {
    foTaskEndDate.value = null
  }
  const deadline = foTaskDeadline.value
  if (deadline && ((start && deadline < start) || (end && deadline > end))) {
    foTaskDeadline.value = null
  }
})

// Collegando la guida a un adempimento/task esistente ne mostriamo i dati del
// FO Task (mock), precompilati negli stessi campi del nuovo task e modificabili.
type TaskPreset = {
  title: string
  queryTarget: string
  startDate: Date
  endDate: Date
  hasDeadline: boolean
  deadline: Date | null
}
const adempimentoPresets: Record<string, TaskPreset> = {
  certificazione_unica: { title: 'Invia la Certificazione Unica', queryTarget: 'active_users', startDate: new Date(2026, 0, 7), endDate: new Date(2026, 2, 16), hasDeadline: true, deadline: new Date(2026, 2, 16) },
  dichiarazione_redditi: { title: 'Compila la Dichiarazione dei Redditi', queryTarget: 'users_with_vat', startDate: new Date(2026, 4, 1), endDate: new Date(2026, 8, 30), hasDeadline: true, deadline: new Date(2026, 8, 30) },
  dichiarazione_iva: { title: 'Invia la Dichiarazione IVA', queryTarget: 'users_with_vat', startDate: new Date(2026, 1, 1), endDate: new Date(2026, 3, 30), hasDeadline: true, deadline: new Date(2026, 3, 30) },
  modello_770: { title: 'Invia il Modello 770', queryTarget: 'users_with_vat', startDate: new Date(2026, 8, 1), endDate: new Date(2026, 9, 31), hasDeadline: true, deadline: new Date(2026, 9, 31) },
  lipe: { title: 'Invia la LIPE', queryTarget: 'users_with_vat', startDate: new Date(2026, 0, 1), endDate: new Date(2026, 1, 28), hasDeadline: true, deadline: new Date(2026, 1, 28) },
  intrastat: { title: "Invia l'Intrastat", queryTarget: 'users_with_vat', startDate: new Date(2026, 0, 1), endDate: new Date(2026, 0, 25), hasDeadline: true, deadline: new Date(2026, 0, 25) },
  comunicazione_reddituale_enpam: { title: 'Comunica i tuoi redditi a ENPAM', queryTarget: 'welfare_pending', startDate: new Date(2026, 2, 1), endDate: new Date(2026, 6, 31), hasDeadline: true, deadline: new Date(2026, 6, 31) },
  comunicazione_reddituale_enpap: { title: 'Comunica i tuoi redditi a ENPAP', queryTarget: 'welfare_pending', startDate: new Date(2026, 2, 1), endDate: new Date(2026, 6, 31), hasDeadline: true, deadline: new Date(2026, 6, 31) },
  comunicazione_reddituale_enpapi: { title: 'Comunica i tuoi redditi a ENPAPI', queryTarget: 'welfare_pending', startDate: new Date(2026, 2, 1), endDate: new Date(2026, 6, 31), hasDeadline: true, deadline: new Date(2026, 6, 31) },
  comunicazione_reddituale_inarcassa: { title: 'Comunica i tuoi redditi a Inarcassa', queryTarget: 'architetti_ingegneri', startDate: null, endDate: null, hasDeadline: false, deadline: null },
  comunicazione_reddituale_forense: { title: 'Comunica i tuoi redditi a Cassa forense', queryTarget: 'welfare_pending', startDate: new Date(2026, 2, 1), endDate: new Date(2026, 6, 31), hasDeadline: true, deadline: new Date(2026, 6, 31) },
  f24: { title: 'Paga il tuo F24', queryTarget: 'overdue_f24', startDate: new Date(2026, 0, 1), endDate: new Date(2026, 11, 31), hasDeadline: true, deadline: new Date(2026, 5, 16) }
}

const applyTaskPreset = (preset: TaskPreset | undefined) => {
  if (!preset) return
  foTaskTitle.value = preset.title
  foTaskQueryTarget.value = preset.queryTarget
  foTaskStartDate.value = preset.startDate
  foTaskEndDate.value = preset.endDate
  foTaskHasDeadline.value = preset.hasDeadline
  foTaskDeadline.value = preset.deadline
}
const clearTaskFields = () => {
  foTaskTitle.value = ''
  foTaskQueryTarget.value = undefined
  foTaskStartDate.value = null
  foTaskEndDate.value = null
  foTaskHasDeadline.value = false
  foTaskDeadline.value = null
}
// Selezione di un adempimento: carica i dati del task esistente (modificabili).
const onAdempimentoChange = (value: string | number | undefined) => {
  if (value === undefined || value === null) clearTaskFields()
  else applyTaskPreset(adempimentoPresets[String(value)])
}
// Cambio opzione: "nuovo task" riparte vuoto, "task esistente" ricarica il preset.
const onGuideLinkChange = (value: string | number) => {
  // "A tutti i clienti": nessun dato specifico, si azzera tutto.
  if (value === 'adempimento') {
    adempimento.value = undefined
    clearTaskFields()
    return
  }
  // "Ad alcuni i clienti": ricarica i dati dell'adempimento già scelto.
  if (adempimento.value) applyTaskPreset(adempimentoPresets[String(adempimento.value)])
  else clearTaskFields()
}
// Valori interni: 'adempimento' = "A tutti i clienti", 'fotask' = "Ad alcuni i clienti".
// I dati del task compaiono solo per "Ad alcuni i clienti", una volta scelto l'adempimento.
const showsTaskFields = computed(
  () => guideLink.value === 'fotask' && !!adempimento.value
)

// --- Campi obbligatori -------------------------------------------------------
// Gli errori vengono mostrati solo dopo un tentativo di pubblicazione.
const showErrors = ref(false)
const isBlank = (v: unknown) =>
  v === undefined || v === null || (typeof v === 'string' && v.trim() === '')

const settingsFieldErrors = computed(() => ({
  guideName: isBlank(guideName.value),
  adempimento: guideLink.value === 'fotask' && isBlank(adempimento.value)
}))
const settingsHasErrors = computed(() =>
  Object.values(settingsFieldErrors.value).some(Boolean)
)

const stepFieldErrors = (step: GuideStep) => ({
  title: steps.value.length > 1 && isBlank(step.title),
  description: isBlank(step.description),
  alert: step.alert
    ? { title: isBlank(step.alert.title), text: isBlank(step.alert.text) }
    : null,
  importi: step.importi.map((i) => isBlank(i.fonte)),
  documenti: step.documenti.map((d) => ({
    files: d.fornisci && d.files.length === 0,
    requests: d.richiedi ? d.requests.map((r) => isBlank(r)) : []
  })),
  domande: step.domande.map((q) => ({
    question: isBlank(q.question),
    answers: q.type === 'importi' ? [] : q.answers.map((a) => isBlank(a))
  }))
})
const stepHasErrors = (step: GuideStep) => {
  const e = stepFieldErrors(step)
  return [
    e.title,
    e.description,
    ...(e.alert ? [e.alert.title, e.alert.text] : []),
    ...e.importi,
    ...e.documenti.flatMap((d) => [d.files, ...d.requests]),
    ...e.domande.flatMap((q) => [q.question, ...q.answers])
  ].some(Boolean)
}
// Errori dello step attualmente visibile (per i binding :error nel template)
const currentStepErrors = computed(() =>
  currentStep.value ? stepFieldErrors(currentStep.value) : null
)
// Prima posizione con errori (Impostazioni o uno step), o null se tutto ok
const firstInvalidLocation = () => {
  if (settingsHasErrors.value) return 'settings'
  const bad = steps.value.find((s) => stepHasErrors(s))
  return bad ? `step-${bad.id}` : null
}
// La guida è pubblicabile solo se tutti i campi obbligatori sono compilati
const isGuideValid = computed(
  () => !settingsHasErrors.value && !steps.value.some((s) => stepHasErrors(s))
)

const addStep = () => {
  const id = steps.value.length ? Math.max(...steps.value.map((s) => s.id)) + 1 : 1
  const stayOnCurrent = !!currentStep.value || isSettings.value
  steps.value.push({ id, title: '', description: '', media: [], alert: null, importi: [], documenti: [], domande: [] })
  if (!stayOnCurrent) selection.value = `step-${id}`
}

const mapSteps = (src: GuideStep[]): GuideStep[] =>
  src.map((s) => ({
    ...s,
    alert: s.alert ?? null,
    importi: s.importi ?? [],
    documenti: s.documenti ?? [],
    domande: s.domande ?? []
  }))

// Rilevamento modifiche non salvate: snapshot (JSON) dei campi persistiti
// confrontato con lo stato corrente. I File nelle pagine diventano {} in JSON,
// ma aggiunte/rimozioni sono comunque rilevate dalla lunghezza degli array.
const serializeState = () =>
  JSON.stringify({
    title: guideName.value,
    frontofficeTask: frontofficeTask.value,
    taskYear: taskYear.value,
    guideLink: guideLink.value,
    adempimento: adempimento.value,
    foTaskTitle: foTaskTitle.value,
    foTaskQueryTarget: foTaskQueryTarget.value,
    foTaskStartDate: foTaskStartDate.value,
    foTaskEndDate: foTaskEndDate.value,
    foTaskHasDeadline: foTaskHasDeadline.value,
    foTaskDeadline: foTaskDeadline.value,
    steps: steps.value
  })
const savedState = ref('')
const isDirty = computed(() => serializeState() !== savedState.value)

if (editingId.value) {
  const guide = getGuide(editingId.value)
  if (guide) {
    guideName.value = guide.title
    frontofficeTask.value = guide.frontofficeTask
    taskYear.value = guide.taskYear
    steps.value = mapSteps(guide.steps)
    const sp = guide.startingPoint
    if (sp) {
      guideLink.value = sp.link
      adempimento.value = sp.adempimento
      foTaskTitle.value = sp.foTaskTitle
      foTaskQueryTarget.value = sp.foTaskQueryTarget
      foTaskStartDate.value = sp.foTaskStartDate
      foTaskEndDate.value = sp.foTaskEndDate
      foTaskHasDeadline.value = sp.foTaskHasDeadline
      foTaskDeadline.value = sp.foTaskDeadline
    }
  }
} else {
  steps.value.push({ id: 1, title: '', description: '', media: [], alert: null, importi: [], documenti: [], domande: [] })
}
// Baseline dopo il caricamento: da qui in poi qualsiasi modifica è "non salvata".
savedState.value = serializeState()

// Once a guide is published it becomes read-only: the whole editor is locked
// (see `isPublished`) so a published guide can no longer be modified.

const addAlert = () => {
  if (!currentStep.value || currentStep.value.alert) return
  currentStep.value.alert = { tone: 'info', position: 'before', title: '', text: '' }
}

const removeAlert = () => {
  if (!currentStep.value) return
  currentStep.value.alert = null
}

const alertToneOptions = [
  { value: 'info', label: 'Info' },
  { value: 'error', label: 'Error' },
  { value: 'danger', label: 'Danger' },
  { value: 'warning', label: 'Warning' },
  { value: 'success', label: 'Success' }
]

const alertPositionOptions = [
  { value: 'before', label: 'Prima della descrizione' },
  { value: 'after', label: 'Dopo la descrizione' }
]

const { getFonti, getFonte } = useImportiCatalog()

const fonteOptions = getFonti().map((f) => ({ value: f.key, label: f.label }))

// Se l'adempimento collegato è una comunicazione reddituale, la fonte dei calcoli
// negli Importi è preimpostata e non modificabile (fonte della cassa scelta).
const comunicazioneReddituFonte: Record<string, string> = {
  comunicazione_reddituale_enpam: 'enpam_welfare',
  comunicazione_reddituale_enpap: 'enpap_welfare',
  comunicazione_reddituale_enpapi: 'enpapi_welfare',
  comunicazione_reddituale_inarcassa: 'inarcassa_welfare',
  comunicazione_reddituale_forense: 'forense_welfare'
}
const lockedFonteKey = computed(() =>
  guideLink.value === 'fotask'
    ? comunicazioneReddituFonte[String(adempimento.value)] ?? null
    : null
)
// Quando la fonte è bloccata, allinea tutti gli Importi già presenti.
watch(lockedFonteKey, (key) => {
  if (!key) return
  steps.value.forEach((s) => s.importi.forEach((i) => (i.fonte = key)))
})

// Only one of Importi / Documenti / Domanda can be added per step
// (Alert is always available).
const hasExclusiveContent = computed(() => {
  const s = currentStep.value
  if (!s) return false
  return s.importi.length > 0 || s.documenti.length > 0 || s.domande.length > 0
})

const addImporto = () => {
  if (!currentStep.value || hasExclusiveContent.value) return
  currentStep.value.importi.push({ fonte: lockedFonteKey.value ?? '' })
}

const removeImporto = (index: number) => {
  if (!currentStep.value) return
  currentStep.value.importi.splice(index, 1)
}

const addDocumento = () => {
  if (!currentStep.value || hasExclusiveContent.value) return
  currentStep.value.documenti.push({ fornisci: true, richiedi: false, requests: [''], files: [] })
}

const removeDocumento = (index: number) => {
  if (!currentStep.value) return
  currentStep.value.documenti.splice(index, 1)
}

const addRichiesta = (documento: GuideStepDocumento) => {
  documento.requests.push('')
}

const removeRichiesta = (documento: GuideStepDocumento, index: number) => {
  if (documento.requests.length <= 1) return
  documento.requests.splice(index, 1)
}

const domandaTypeOptions = [
  { value: 'single', label: 'Scelta singola' },
  { value: 'multiple', label: 'Scelta multipla' },
  { value: 'importi', label: 'Importi' }
]

const addDomanda = () => {
  if (!currentStep.value || hasExclusiveContent.value) return
  currentStep.value.domande.push({ type: 'single', question: '', answers: ['', ''] })
}

const removeDomanda = (index: number) => {
  if (!currentStep.value) return
  currentStep.value.domande.splice(index, 1)
}

const addRisposta = (domanda: GuideStepDomanda) => {
  domanda.answers.push('')
}

const removeRisposta = (domanda: GuideStepDomanda, index: number) => {
  if (domanda.answers.length <= 1) return
  domanda.answers.splice(index, 1)
}

const removeStep = () => {
  if (!currentStep.value) return
  const idx = steps.value.findIndex((s) => s.id === currentStep.value!.id)
  if (idx === -1) return
  steps.value.splice(idx, 1)
  const next = steps.value[idx] ?? steps.value[idx - 1]
  selection.value = next ? `step-${next.id}` : 'settings'
}

const persist = (status: 'draft' | 'published') => {
  const task = frontofficeTaskOptions.find((o) => o.value === frontofficeTask.value)
  const draft = {
    title: guideName.value.trim() || task?.label || 'Nuova guida',
    area: '—',
    frontofficeTask: frontofficeTask.value,
    taskYear: isWelfareDeclarationTask.value ? taskYear.value : undefined,
    steps: steps.value,
    startingPoint: {
      link: guideLink.value,
      adempimento: adempimento.value,
      foTaskTitle: foTaskTitle.value,
      foTaskQueryTarget: foTaskQueryTarget.value,
      foTaskStartDate: foTaskStartDate.value,
      foTaskEndDate: foTaskEndDate.value,
      foTaskHasDeadline: foTaskHasDeadline.value,
      foTaskDeadline: foTaskDeadline.value
    }
  }
  let guideId = editingId.value
  if (editingId.value) {
    updateGuide(editingId.value, draft, status)
  } else {
    guideId = addGuide(draft, status)
    router.replace({
      name: 'nuova-guida-v2',
      params: { id: String(guideId) }
    })
  }
  // Allineo la baseline: dopo il salvataggio non ci sono più modifiche pendenti.
  savedState.value = serializeState()
  return guideId
}

const save = () => {
  persist('draft')
  enqueueToast({ type: 'success', message: 'Guida salvata correttamente' }, toastQueue)
}

// Dopo la pubblicazione i campi lasciano il posto, per 10 secondi, a un
// messaggio di conferma centrato (con il link da condividere quando la pagina
// è rivolta a tutti i clienti).
const publishSuccess = ref(false)
const publishedGuideId = ref<number | undefined>()
// L'id arriva dal salvataggio (per una guida nuova la rotta non è ancora aggiornata)
const publishedLink = computed(
  () => `https://fiscozen.it/guide/${editingId.value ?? publishedGuideId.value ?? ''}`
)
const linkCopied = ref(false)
let publishSuccessTimer: ReturnType<typeof setTimeout> | undefined

const copyPublishedLink = async () => {
  const link = publishedLink.value
  try {
    await navigator.clipboard.writeText(link)
  } catch {
    // Fallback per i contesti in cui la Clipboard API è bloccata (es. iframe)
    const el = document.createElement('textarea')
    el.value = link
    el.setAttribute('readonly', '')
    el.style.position = 'fixed'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
  linkCopied.value = true
  setTimeout(() => (linkCopied.value = false), 2000)
}

const publish = () => {
  const message = isPublished.value
    ? 'Guida aggiornata correttamente'
    : 'Guida pubblicata correttamente'
  const guideId = persist('published')
  enqueueToast({ type: 'success', message }, toastQueue)

  publishedGuideId.value = guideId
  linkCopied.value = false
  publishSuccess.value = true
  clearTimeout(publishSuccessTimer)
  publishSuccessTimer = setTimeout(() => (publishSuccess.value = false), 10000)
}

const previewStep = computed(() => currentStep.value ?? steps.value[0])
const previewIndex = computed(() =>
  previewStep.value ? steps.value.findIndex((s) => s.id === previewStep.value!.id) : 0
)
const previewIsLastStep = computed(
  () => steps.value.length > 0 && previewIndex.value === steps.value.length - 1
)
const previewSteps = computed(() =>
  steps.value.map((s, i) => ({
    title: s.title || 'Titolo pagina',
    status: i < previewIndex.value ? ('completed' as const) : undefined,
    hasStepDescription: false
  }))
)
const previewTitleByTask: Record<string, string> = {
  SEND_ENPAM_WELFARE_DECLARATION: 'Comunica i tuoi redditi ad ENPAM'
}
const previewTitle = computed(() => {
  if (guideName.value.trim()) return guideName.value.trim()
  const task = frontofficeTask.value
  if (task != null && previewTitleByTask[String(task)]) {
    return previewTitleByTask[String(task)]
  }
  return frontofficeTaskOptions.find((o) => o.value === task)?.label ?? 'Titolo guida'
})
const previewMediaFile = computed(() => previewStep.value?.media?.[0])
const previewMediaUrl = computed(() =>
  previewMediaFile.value ? URL.createObjectURL(previewMediaFile.value) : ''
)
const previewMediaIsVideo = computed(() =>
  previewMediaFile.value?.type.startsWith('video/') ?? false
)
// L'anteprima del media si adatta al file caricato usando i rapporti consentiti:
// 16:9 o 4:3 per gli orizzontali, 3:4 per i verticali.
const previewMediaAspect = ref('16 / 9')
const pickMediaAspect = (w: number, h: number) => {
  if (!w || !h) return '16 / 9'
  const ratio = w / h
  if (ratio >= 1) {
    return Math.abs(ratio - 16 / 9) <= Math.abs(ratio - 4 / 3) ? '16 / 9' : '4 / 3'
  }
  return '3 / 4'
}
watch(
  [previewMediaUrl, previewMediaIsVideo],
  ([url, isVideo]) => {
    if (!url) {
      previewMediaAspect.value = '16 / 9'
      return
    }
    if (isVideo) {
      const video = document.createElement('video')
      video.onloadedmetadata = () => {
        previewMediaAspect.value = pickMediaAspect(video.videoWidth, video.videoHeight)
      }
      video.src = url
    } else {
      const img = new Image()
      img.onload = () => {
        previewMediaAspect.value = pickMediaAspect(img.naturalWidth, img.naturalHeight)
      }
      img.src = url
    }
  },
  { immediate: true }
)
const sampleImportoValue = '€ 0,00'

// Preview-only answer state for the interactive question mock
const previewSingle = ref<Record<number, string | undefined>>({})
const previewMultiple = ref<Record<number, string[]>>({})
const previewImporto = ref<Record<number, string>>({})
watch(
  () => [previewStep.value?.id, previewStep.value?.domande.length] as const,
  () => {
    const nextMultiple: Record<number, string[]> = {}
    previewStep.value?.domande.forEach((_, i) => {
      nextMultiple[i] = previewMultiple.value[i] ?? []
    })
    previewMultiple.value = nextMultiple
  },
  { immediate: true }
)
watch(
  () => previewStep.value?.id,
  () => {
    previewSingle.value = {}
    previewImporto.value = {}
  }
)

</script>

<template>
  <div class="bo-layout">
    <div class="bo-toasts">
      <FzToastQueue :toasts="toastQueue" />
    </div>

    <FzConfirmDialog
      ref="deleteDialog"
      size="sm"
      title="Elimina guida"
      @fzmodal:confirm="confirmDeleteGuide"
    >
      <template #body>
        <p>
          Una volta eliminata, non sarà più possibile recuperare questa guida.
        </p>
      </template>
      <template #footer>
        <div class="bo-dialog-footer">
          <FzButton
            variant="invisible"
            environment="backoffice"
            label="Annulla"
            @click="deleteDialog?.handleCancel()"
          />
          <FzButton
            variant="danger"
            environment="backoffice"
            label="Elimina"
            @click="deleteDialog?.handleConfirm()"
          />
        </div>
      </template>
    </FzConfirmDialog>

    <FzConfirmDialog
      ref="unpublishDialog"
      size="sm"
      title="Annulla pubblicazione"
      @fzmodal:confirm="confirmUnpublish"
    >
      <template #body>
        <p>Il cliente non avrà più accesso a questa guida.</p>
      </template>
      <template #footer>
        <div class="bo-dialog-footer">
          <FzButton
            variant="invisible"
            environment="backoffice"
            label="Annulla"
            @click="unpublishDialog?.handleCancel()"
          />
          <FzButton
            variant="danger"
            environment="backoffice"
            label="Annulla pubblicazione"
            @click="unpublishDialog?.handleConfirm()"
          />
        </div>
      </template>
    </FzConfirmDialog>

    <FzConfirmDialog ref="startInfoDialog" size="md" title="Tipo di pagina">
      <template #body>
        <p>
          Il <strong>tipo di pagina</strong> definisce a chi è destinata la guida.
          Scegli <strong>Per tutti i clienti</strong> per una pagina da condividere con
          tutti, senza dati specifici; scegli <strong>Per alcuni clienti</strong> quando
          la guida è rivolta solo ad alcuni clienti e mostra i dati di ciascuno.
        </p>
      </template>
      <template #footer>
        <div class="bo-dialog-footer">
          <FzButton
            variant="primary"
            environment="backoffice"
            label="Ho capito"
            @click="startInfoDialog?.handleCancel()"
          />
        </div>
      </template>
    </FzConfirmDialog>

    <FzConfirmDialog ref="publishDialog" size="sm" title="Pubblica guida" @fzmodal:confirm="publish">
      <template #body>
        <p>
          Una volta pubblicata, la guida <strong>non sarà più modificabile</strong>.
        </p>
      </template>
      <template #footer>
        <div class="bo-dialog-footer">
          <FzButton
            variant="invisible"
            environment="backoffice"
            label="Annulla"
            @click="publishDialog?.handleCancel()"
          />
          <FzButton
            variant="primary"
            environment="backoffice"
            label="Pubblica"
            @click="publishDialog?.handleConfirm()"
          />
        </div>
      </template>
    </FzConfirmDialog>

    <FzConfirmDialog ref="unsavedDialog" size="sm" title="Modifiche non salvate">
      <template #body>
        <p>Prima di uscire, vuoi salvare le modifiche che hai appena fatto?</p>
      </template>
      <template #footer>
        <div class="bo-dialog-footer">
          <FzButton
            variant="invisible"
            environment="backoffice"
            label="Esci senza salvare"
            @click="exitWithoutSaving"
          />
          <FzButton
            variant="primary"
            environment="backoffice"
            label="Salva ed esci"
            @click="saveAndExit"
          />
        </div>
      </template>
    </FzConfirmDialog>
    <!-- Left navbar -->
    <FzNavbar variant="vertical" :mobile-breakpoint="0" class="bo-navbar">
      <template #brand-logo>
        <FzIcon name="fiscozen" variant="fak" size="lg" />
      </template>
      <template #navigation>
        <FzIconButton
          v-for="icon in railIcons"
          :key="icon"
          :icon-name="icon"
          variant="invisible"
          size="md"
        />
        <FzFloating
          ref="gearFloating"
          position="right-start"
          :is-open="gearOpen"
          teleport
          content-class="!ml-10 z-60"
        >
          <template #opener>
            <FzIconButton
              iconName="gear"
              variant="invisible"
              size="md"
              aria-label="Pagine disponibili"
              @click="gearOpen = !gearOpen"
            />
          </template>
          <FzActionList list-class="!gap-8">
            <FzActionSection label="Strumenti" environment="backoffice">
              <FzAction type="action" environment="backoffice" label="Archivio Cespiti" />
              <FzAction type="action" environment="backoffice" label="Convertitore di valuta" />
            </FzActionSection>
            <FzActionSection environment="backoffice">
              <FzAction
                type="action"
                environment="backoffice"
                label="Guide clienti"
                @click="openGuideClienti"
              />
            </FzActionSection>
          </FzActionList>
        </FzFloating>
      </template>
      <template #user-menu>
        <FzAvatar first-name="Mario" last-name="Rossi" environment="backoffice" />
      </template>
    </FzNavbar>

    <div class="bo-main">
      <div class="bo-content-card">
      <!-- Header -->
      <header class="bo-header">
        <div class="bo-header__left">
          <FzIconButton iconName="chevron-left" variant="invisible" environment="backoffice" aria-label="Indietro" @click="requestBack" />
          <h1 class="bo-header__title">{{ pageTitle }}</h1>
        </div>
        <div class="bo-header__actions">
          <FzButton :label="isPublished ? 'Annulla pubblicazione' : 'Elimina guida'" :iconName="isPublished ? 'circle-xmark' : 'trash'" variant="danger" environment="backoffice" @click="askDeleteGuide" />
          <FzButton label="Salva" iconName="floppy-disk" variant="secondary" environment="backoffice" :disabled="isReadOnly" @click="save" />
          <FzButton :label="publishLabel" iconName="paper-plane" variant="primary" environment="backoffice" :disabled="isReadOnly || !isGuideValid" @click="askPublish" />
        </div>
      </header>

      <!-- Three-column content -->
      <div class="bo-content">
        <!-- Column 1: steps -->
        <section class="bo-steps">
          <FzRadioCard
            v-model="selection"
            name="guide-nav"
            value="settings"
            label="settings"
            title="Impostazioni"
            orientation="horizontal"
            :has-radio="false"
          />
          <FzDivider />
          <div class="bo-steps__list">
            <FzRadioCard
              v-for="(step, index) in steps"
              :key="step.id"
              v-model="selection"
              name="guide-nav"
              :value="`step-${step.id}`"
              :label="`step-${step.id}`"
              :title="`Pagina ${index + 1}`"
              :subtitle="step.title"
              orientation="horizontal"
              :has-radio="false"
            />
          </div>
          <div class="bo-steps__add">
            <FzIconButton iconName="plus" variant="secondary" environment="backoffice" aria-label="Aggiungi pagina" :disabled="isReadOnly" @click="addStep" />
          </div>
        </section>

        <!-- Column 2: editor -->
        <section class="bo-editor">
          <!-- Version tabs: shown only when a Live snapshot and a divergent Bozza both exist -->
          <div class="bo-editor__content" :class="{ 'bo-editor__content--readonly': isReadOnly && !publishSuccess }">
          <!-- Conferma di pubblicazione: sostituisce i campi per 10 secondi -->
          <div v-if="publishSuccess" class="bo-publish-success">
            <span class="bo-publish-success__icon">
              <FzIcon name="check" size="xl" />
            </span>
            <p class="bo-publish-success__title">Pagina creata correttamente</p>
            <p class="bo-publish-success__desc">
              {{
                guideLink === 'adempimento'
                  ? 'Copia il link e condividila con i clienti:'
                  : "Sarà disponibile a tutti i clienti che dovranno fare l'adempimento scelto."
              }}
            </p>
            <div v-if="guideLink === 'adempimento'" class="bo-publish-success__link">
              <FzInput
                :model-value="publishedLink"
                environment="backoffice"
                :disabled="true"
              />
              <FzIconButton
                :iconName="linkCopied ? 'check' : 'clone'"
                variant="secondary"
                environment="backoffice"
                :aria-label="linkCopied ? 'Link copiato' : 'Copia il link'"
                @click="copyPublishedLink"
              />
            </div>
          </div>
          <template v-else-if="isSettings">
            <div class="bo-section">
              <div class="bo-section__title">
                <FzIcon name="arrow-right" size="md" class="bo-section__icon" />
                <span class="bo-section__heading">Tipo di pagina</span>
                <FzIconButton
                  iconName="circle-question"
                  variant="invisible"
                  size="sm"
                  environment="backoffice"
                  aria-label="Che cos'è il tipo di pagina?"
                  @click="startInfoDialog?.show()"
                />
              </div>
              <div class="bo-section__body">
                <p class="bo-section__desc">A chi è rivolta questa pagina?</p>
                <FzRadioGroup variant="horizontal" name="guide-link" class="bo-link-group">
                  <FzRadioCard
                    v-model="guideLink"
                    name="guide-link"
                    value="adempimento"
                    label="adempimento"
                    title="A tutti i clienti"
                    subtitle="Ideale per pagine da condividere a tutti, senza dati specifici dei clienti"
                    orientation="horizontal"
                    :has-radio="true"
                    :disabled="isReadOnly"
                    @update:model-value="onGuideLinkChange"
                  />
                  <FzRadioCard
                    v-model="guideLink"
                    name="guide-link"
                    value="fotask"
                    label="fotask"
                    title="Ad alcuni i clienti"
                    subtitle="Perfetta per guide da condividere solo ad alcuni clienti e con i dati specifici di ciascuno."
                    orientation="horizontal"
                    :has-radio="true"
                    :disabled="isReadOnly"
                    @update:model-value="onGuideLinkChange"
                  />
                </FzRadioGroup>

                <div v-if="guideLink === 'fotask'" class="bo-link-detail">
                  <p class="bo-link-intro">Scegli l'adempimento per il quale vuoi creare questa pagina.</p>
                  <FzSelect
                    v-model="adempimento"
                    label="Adempimento"
                    :options="adempimentoOptions"
                    filterable
                    environment="backoffice"
                    :error="showErrors && settingsFieldErrors.adempimento"
                    :disabled="isReadOnly"
                    @update:model-value="onAdempimentoChange"
                  />
                </div>
              </div>
            </div>

            <hr class="bo-divider" />

            <div class="bo-section">
              <div class="bo-section__title">
                <FzIcon name="file" size="md" class="bo-section__icon" />
                <span class="bo-section__heading">Guida</span>
              </div>
              <div class="bo-section__body">
                <FzInput
                  v-model="guideName"
                  label="Titolo della guida"
                  placeholder="Scrivi il titolo della guida"
                  environment="backoffice"
                  :error="showErrors && settingsFieldErrors.guideName"
                  :disabled="isReadOnly"
                />
                <div v-if="isPublished && guideLink === 'adempimento'" class="bo-guide-link">
                  <FzInput
                    :model-value="publishedLink"
                    label="Link della pagina"
                    environment="backoffice"
                    :disabled="true"
                  />
                  <FzIconButton
                    :iconName="linkCopied ? 'check' : 'clone'"
                    variant="secondary"
                    environment="backoffice"
                    :aria-label="linkCopied ? 'Link copiato' : 'Copia il link'"
                    @click="copyPublishedLink"
                  />
                </div>
              </div>
            </div>

          </template>
          <template v-else-if="currentStep">
            <!-- Section: Titolo pagina (only with more than one page) -->
            <template v-if="steps.length > 1">
              <div class="bo-section">
                <div class="bo-section__title">
                  <FzIcon name="pencil" size="md" class="bo-section__icon" />
                  <span class="bo-section__heading">Titolo pagina</span>
                </div>
                <div class="bo-section__body">
                  <FzInput
                    :key="currentStep.id"
                    v-model="currentStep.title"
                    placeholder="Scrivi il titolo di questa pagina"
                    environment="backoffice"
                    :error="showErrors && !!currentStepErrors?.title"
                    :disabled="isReadOnly"
                  />
                </div>
              </div>

              <hr class="bo-divider" />
            </template>

            <!-- Section: Media -->
            <div class="bo-section">
              <div class="bo-section__title">
                <FzIcon name="file" size="md" class="bo-section__icon" />
                <span class="bo-section__heading">Media</span>
              </div>
              <div class="bo-section__body">
                <p class="bo-media-hint">
                  I contenuti multimediali devono essere immagini o video e avere un rapporto di
                  16:9, 4:3 per quelli orizzontali, mentre 3:4 per quelli verticali.
                </p>
                <FzUpload
                  :key="currentStep.id"
                  v-model="currentStep.media"
                  multiple
                  buttonLabel="Carica"
                  dragAndDropLabel="o trascina qui"
                />
              </div>
            </div>

            <hr class="bo-divider" />

            <!-- Section: Contenuto principale -->
            <div class="bo-section">
              <div class="bo-section__title">
                <FzIcon name="file" size="md" class="bo-section__icon" />
                <span class="bo-section__heading">Contenuto principale</span>
              </div>
              <div class="bo-section__body">
                <!-- Action buttons -->
                <div class="bo-section__buttons">
                  <FzButton
                    label="Alert"
                    iconName="plus"
                    variant="secondary"
                    environment="backoffice"
                    :disabled="isReadOnly || !!currentStep.alert"
                    @click="addAlert"
                  />
                  <FzButton
                    v-if="lockedFonteKey"
                    label="Importi"
                    iconName="plus"
                    variant="secondary"
                    environment="backoffice"
                    :disabled="isReadOnly || hasExclusiveContent"
                    @click="addImporto"
                  />
                  <FzButton
                    label="Documenti"
                    iconName="plus"
                    variant="secondary"
                    environment="backoffice"
                    :disabled="isReadOnly || hasExclusiveContent"
                    @click="addDocumento"
                  />
                  <FzButton
                    label="Domanda"
                    iconName="plus"
                    variant="secondary"
                    environment="backoffice"
                    :disabled="isReadOnly || hasExclusiveContent"
                    @click="addDomanda"
                  />
                </div>

                <!-- Descrizione block -->
                <div class="bo-block">
                  <p class="bo-block__title">Descrizione</p>
                  <FzTextarea
                    :key="currentStep.id"
                    v-model="currentStep.description"
                    placeholder="Scrivi la descrizione della pagina…"
                    :rows="6"
                    resize="vertical"
                    :error="showErrors && !!currentStepErrors?.description"
                    :disabled="isReadOnly"
                  />
                </div>

                <!-- Alert block -->
                <template v-if="currentStep.alert">
                  <hr class="bo-divider" />
                  <div class="bo-block">
                    <div class="bo-block__header">
                      <p class="bo-block__title">Alert</p>
                      <FzIconButton
                        iconName="trash"
                        variant="invisible"
                        environment="backoffice"
                        aria-label="Rimuovi alert"
                        :disabled="isReadOnly"
                        @click="removeAlert"
                      />
                    </div>
                    <FzSelect
                      v-model="currentStep.alert.tone"
                      label="Tono"
                      placeholder="Seleziona il tono"
                      :options="alertToneOptions"
                      environment="backoffice"
                      :disabled="isReadOnly"
                    />
                    <FzSelect
                      v-model="currentStep.alert.position"
                      label="Posizione"
                      placeholder="Seleziona la posizione"
                      :options="alertPositionOptions"
                      environment="backoffice"
                      :disabled="isReadOnly"
                    />
                    <FzInput
                      v-model="currentStep.alert.title"
                      label="Titolo alert"
                      placeholder="Scrivi il titolo dell'alert"
                      environment="backoffice"
                      :error="showErrors && !!currentStepErrors?.alert?.title"
                      :disabled="isReadOnly"
                    />
                    <FzInput
                      v-model="currentStep.alert.text"
                      label="Testo alert"
                      placeholder="Scrivi il testo dell'alert"
                      environment="backoffice"
                      :error="showErrors && !!currentStepErrors?.alert?.text"
                      :disabled="isReadOnly"
                    />
                  </div>
                </template>

                <!-- Importi block -->
                <template v-if="currentStep.importi.length">
                  <hr class="bo-divider" />
                  <div class="bo-block">
                    <div class="bo-block__header">
                      <p class="bo-block__title">Importi</p>
                      <FzIconButton
                        iconName="trash"
                        variant="invisible"
                        environment="backoffice"
                        aria-label="Rimuovi importi"
                        :disabled="isReadOnly"
                        @click="removeImporto(0)"
                      />
                    </div>
                    <p class="bo-media-hint">Ogni cliente vedrà i propri importi da dichiarare.</p>
                    <div
                      v-for="(importo, index) in currentStep.importi"
                      :key="index"
                      class="bo-importo"
                    >
                      <div class="bo-importo__field">
                        <FzCard
                          v-for="def in getFonte(importo.fonte)?.importi"
                          :key="def.key"
                          color="grey"
                          environment="backoffice"
                          class="bo-importo-card"
                        >
                          {{ def.label }}
                        </FzCard>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- Documenti block -->
                <template v-if="currentStep.documenti.length">
                  <hr class="bo-divider" />
                  <div class="bo-block">
                    <div class="bo-block__header">
                      <p class="bo-block__title">Documenti</p>
                      <FzIconButton
                        iconName="trash"
                        variant="invisible"
                        environment="backoffice"
                        aria-label="Rimuovi documento"
                        :disabled="isReadOnly"
                        @click="removeDocumento(0)"
                      />
                    </div>
                    <div
                      v-for="(documento, index) in currentStep.documenti"
                      :key="index"
                      class="bo-documento"
                    >
                      <div class="bo-documento__field">
                        <div class="bo-documento__option">
                          <FzCheckbox v-model="documento.fornisci" label="Fornisci un documento" :disabled="isReadOnly" />
                          <FzUpload
                            v-if="documento.fornisci"
                            v-model="documento.files"
                            multiple
                            buttonLabel="Carica"
                            dragAndDropLabel="o trascina qui"
                          />
                        </div>
                        <div class="bo-documento__option">
                          <FzCheckbox v-model="documento.richiedi" label="Richiedi un documento" :disabled="isReadOnly" />
                          <template v-if="documento.richiedi">
                            <div
                              v-for="(richiesta, rIndex) in documento.requests"
                              :key="rIndex"
                              class="bo-documento__request"
                            >
                              <FzInput
                                v-model="documento.requests[rIndex]"
                                label="Quale documento vuoi chiedere al cliente?"
                                placeholder="Scrivi la richiesta per il cliente"
                                environment="backoffice"
                                :error="showErrors && !!currentStepErrors?.documenti[index]?.requests[rIndex]"
                                :disabled="isReadOnly"
                              />
                              <FzIconButton
                                iconName="trash"
                                variant="invisible"
                                environment="backoffice"
                                aria-label="Rimuovi richiesta"
                                :disabled="isReadOnly || documento.requests.length <= 1"
                                @click="removeRichiesta(documento, rIndex)"
                              />
                            </div>
                            <FzButton
                              variant="invisible"
                              environment="backoffice"
                              :disabled="isReadOnly"
                              @click="addRichiesta(documento)"
                            >
                              Aggiungi richiesta
                            </FzButton>
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- Domande block -->
                <template v-if="currentStep.domande.length">
                  <hr class="bo-divider" />
                  <div class="bo-block">
                    <div class="bo-block__header">
                      <p class="bo-block__title">Domande</p>
                      <FzIconButton
                        iconName="trash"
                        variant="invisible"
                        environment="backoffice"
                        aria-label="Rimuovi domanda"
                        :disabled="isReadOnly"
                        @click="removeDomanda(0)"
                      />
                    </div>
                    <div
                      v-for="(domanda, index) in currentStep.domande"
                      :key="index"
                      class="bo-domanda"
                    >
                      <div class="bo-domanda__field">
                        <FzSelect
                          v-model="domanda.type"
                          label="Tipo di domanda"
                          placeholder="Seleziona il tipo"
                          :options="domandaTypeOptions"
                          environment="backoffice"
                          :disabled="isReadOnly"
                        />
                        <FzInput
                          v-model="domanda.question"
                          label="Domanda"
                          placeholder="Scrivi la domanda"
                          environment="backoffice"
                          :error="showErrors && !!currentStepErrors?.domande[index]?.question"
                          :disabled="isReadOnly"
                        />
                        <p v-if="domanda.type === 'importi'" class="bo-domanda__hint">
                          L'utente inserirà una cifra in un campo importo.
                        </p>
                        <div v-else class="bo-domanda__answers">
                          <div
                            v-for="(_, aIndex) in domanda.answers"
                            :key="aIndex"
                            class="bo-domanda__answer"
                          >
                            <FzInput
                              v-model="domanda.answers[aIndex]"
                              :placeholder="`Risposta ${aIndex + 1}`"
                              environment="backoffice"
                              :error="showErrors && !!currentStepErrors?.domande[index]?.answers[aIndex]"
                              :disabled="isReadOnly"
                            />
                            <FzIconButton
                              iconName="trash"
                              variant="invisible"
                              environment="backoffice"
                              aria-label="Rimuovi risposta"
                              :disabled="isReadOnly || domanda.answers.length <= 1"
                              @click="removeRisposta(domanda, aIndex)"
                            />
                          </div>
                          <FzButton
                            label="Aggiungi risposta"
                            iconName="plus"
                            variant="invisible"
                            environment="backoffice"
                            :disabled="isReadOnly"
                            @click="addRisposta(domanda)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

              </div>
            </div>
          </template>
          </div>

          <!-- Footer: delete step (solo con più di uno step) -->
          <div v-if="!publishSuccess && currentStep && steps.length > 1" class="bo-editor__footer" :class="{ 'bo-editor__footer--readonly': isReadOnly }">
            <FzButton
              v-if="steps.length > 1"
              label="Elimina pagina"
              iconName="trash"
              variant="danger"
              environment="backoffice"
              :disabled="isReadOnly"
              @click="removeStep"
            />
          </div>
        </section>

        <!-- Column 3: preview -->
        <aside class="bo-preview">
          <div class="bo-preview__stage">
            <div class="bo-frame bo-frame--mobile">
              <div class="bo-phone">
                <!-- Title from frontoffice task -->
                <div class="bo-phone__title">
                  <FzIconButton
                    iconName="chevron-left"
                    variant="invisible"
                    environment="frontoffice"
                    aria-label="Indietro"
                  />
                  <span class="bo-phone__title-text">{{ previewTitle }}</span>
                </div>
                <!-- Stepper (DS component) -->
                <div v-if="steps.length > 1" class="bo-phone__stepper">
                  <FzStepper
                    :steps="previewSteps"
                    :active-step="previewIndex"
                    :has-stepper-list="false"
                    force-mobile
                  />
                </div>

                <template v-if="previewStep">
                  <div class="bo-phone__body">
                    <!-- Media -->
                    <div v-if="previewMediaUrl" class="bo-phone__media" :style="{ aspectRatio: previewMediaAspect }">
                      <video v-if="previewMediaIsVideo" :src="previewMediaUrl" controls />
                      <img v-else :src="previewMediaUrl" alt="" />
                    </div>
                    <!-- Alert before description -->
                    <FzAlert
                      v-if="previewStep.alert && previewStep.alert.position === 'before'"
                      :key="`alert-before-${!!previewStep.alert.text}`"
                      :tone="previewStep.alert.tone"
                      :title="previewStep.alert.title || 'Titolo alert'"
                      variant="background"
                      environment="frontoffice"
                      :show-button-action="false"
                    >
                      <template v-if="previewStep.alert.text" #default>
                        {{ previewStep.alert.text }}
                      </template>
                    </FzAlert>
                    <!-- Main content / description -->
                    <p class="bo-phone__desc">
                      {{ previewStep.description || 'La descrizione della pagina apparirà qui.' }}
                    </p>
                    <!-- Alert after description -->
                    <FzAlert
                      v-if="previewStep.alert && previewStep.alert.position === 'after'"
                      :key="`alert-after-${!!previewStep.alert.text}`"
                      :tone="previewStep.alert.tone"
                      :title="previewStep.alert.title || 'Titolo alert'"
                      variant="background"
                      environment="frontoffice"
                      :show-button-action="false"
                    >
                      <template v-if="previewStep.alert.text" #default>
                        {{ previewStep.alert.text }}
                      </template>
                    </FzAlert>
                    <!-- Importi below description -->
                    <FzCard
                      v-if="previewStep.importi.length"
                      color="default"
                      environment="frontoffice"
                      class="bo-phone__importi-card"
                    >
                      <div class="bo-phone__importi">
                        <template v-for="imp in previewStep.importi" :key="imp.fonte">
                          <div
                            v-for="def in getFonte(imp.fonte)?.importi"
                            :key="def.key"
                            class="bo-phone__importo"
                          >
                            <span class="bo-phone__importo-label">{{ def.label }}</span>
                            <div class="bo-phone__importo-value">
                              <span>{{ sampleImportoValue }}</span>
                              <FzIconButton
                                iconName="clone"
                                variant="invisible"
                                environment="frontoffice"
                                aria-label="Copia importo"
                              />
                            </div>
                          </div>
                        </template>
                      </div>
                    </FzCard>
                    <!-- Documenti below importi -->
                    <div v-if="previewStep.documenti.length" class="bo-phone__documenti">
                      <div
                        v-for="(documento, index) in previewStep.documenti"
                        :key="index"
                        class="bo-phone__documento"
                      >
                        <!-- Fornisci: files the user can download -->
                        <template v-if="documento.fornisci">
                          <FzCard
                            v-for="(file, fileIndex) in documento.files"
                            :key="fileIndex"
                            color="default"
                            environment="frontoffice"
                          >
                            <div class="bo-phone__doc-row">
                              <span class="bo-phone__doc-name">{{ file.name }}</span>
                              <FzIconButton
                                iconName="arrow-down-to-line"
                                variant="invisible"
                                environment="frontoffice"
                                aria-label="Scarica documento"
                              />
                            </div>
                          </FzCard>
                          <FzCard
                            v-if="!documento.files.length"
                            color="default"
                            environment="frontoffice"
                          >
                            <div class="bo-phone__doc-row">
                              <span class="bo-phone__doc-name">Nome documento</span>
                              <FzIconButton
                                iconName="arrow-down-to-line"
                                variant="invisible"
                                environment="frontoffice"
                                aria-label="Scarica documento"
                              />
                            </div>
                          </FzCard>
                        </template>
                        <!-- Richiedi: ask the user to submit one or more documents -->
                        <template v-if="documento.richiedi">
                          <div
                            v-for="(richiesta, rIndex) in documento.requests"
                            :key="rIndex"
                            class="bo-phone__doc-request"
                          >
                            <p class="bo-phone__doc-label">{{ richiesta || 'Carica un documento' }}</p>
                            <FzUpload buttonLabel="Carica" dragAndDropLabel="o trascina qui" />
                          </div>
                        </template>
                      </div>
                    </div>
                    <!-- Domande below documenti -->
                    <div v-if="previewStep.domande.length" class="bo-phone__domande">
                      <div
                        v-for="(domanda, dIndex) in previewStep.domande"
                        :key="dIndex"
                        class="bo-phone__domanda"
                      >
                        <p v-if="domanda.question" class="bo-phone__domanda-question">
                          {{ domanda.question }}
                        </p>
                        <!-- Single choice -->
                        <template v-if="domanda.type === 'single'">
                          <FzRadioCard
                            v-for="(answer, aIndex) in domanda.answers"
                            :key="aIndex"
                            v-model="previewSingle[dIndex]"
                            :name="`preview-domanda-${dIndex}`"
                            :value="`a-${aIndex}`"
                            :label="`a-${aIndex}`"
                            :title="answer || `Risposta ${aIndex + 1}`"
                            orientation="horizontal"
                          />
                        </template>
                        <!-- Multiple choice -->
                        <template v-else-if="domanda.type === 'multiple'">
                          <FzCheckboxCard
                            v-for="(answer, aIndex) in domanda.answers"
                            :key="aIndex"
                            v-model="previewMultiple[dIndex]"
                            :name="`preview-domanda-${dIndex}`"
                            :value="`a-${aIndex}`"
                            :label="`a-${aIndex}`"
                            :title="answer || `Risposta ${aIndex + 1}`"
                            variant="horizontal"
                          />
                        </template>
                        <!-- Importi -->
                        <template v-else-if="domanda.type === 'importi'">
                          <FzInput
                            v-model="previewImporto[dIndex]"
                            type="number"
                            placeholder="€ 0,00"
                            environment="frontoffice"
                          />
                        </template>
                      </div>
                    </div>
                  </div>
                  <!-- Footer -->
                  <div class="bo-phone__footer">
                    <FzButton v-if="steps.length > 1" label="Indietro" variant="secondary" size="sm" environment="frontoffice" />
                    <FzButton :label="previewIsLastStep ? 'Fine' : 'Avanti'" variant="primary" size="sm" environment="frontoffice" />
                  </div>
                </template>
                <div v-else class="bo-phone__empty">
                  Aggiungi una pagina per vedere l'anteprima
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bo-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  font-family: Inter, sans-serif;
  color: #2c282f;
  background: #f4f7f8;
}

/* Navbar */
.bo-navbar {
  --fz-navbar-width: 56px;
  --fz-navbar-padding: 8px;
  --fz-navbar-brand-gap: 16px;
  --fz-navbar-actions-gap: 8px;
  --fz-navbar-bg: #ffffff;
  flex-shrink: 0;
  height: 100vh;
}

/* Main */
.bo-main {
  flex: 1;
  display: flex;
  min-width: 0;
  padding: 8px;
}
.bo-content-card {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #e9edf0;
  border-radius: 8px;
  overflow: hidden;
}

/* Header */
.bo-header {
  height: 64px;
  flex-shrink: 0;
  border-bottom: 1px solid #e9edf0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}
.bo-header__left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.bo-header__title {
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  margin: 0;
}
.bo-header__actions {
  display: flex;
  gap: 8px;
}

/* Content */
.bo-content {
  flex: 1;
  display: flex;
  min-height: 0;
}

/* Steps column */
.bo-steps {
  width: 260px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 16px;
  overflow-y: auto;
  border-right: 1px solid #e9edf0;
}
.bo-steps__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.bo-steps__add {
  align-self: center;
  margin-top: 8px;
}
.bo-link-group :deep([role='radiogroup']) > * {
  flex: 1 1 0;
  min-width: 0;
}
/* Label della card = token "label/normal-emphasized" (Inter SemiBold 16/20) */
.bo-link-group :deep(label p.font-medium) {
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  color: #2c282f;
}
.bo-link-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.bo-dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  width: 100%;
}
/* Conferma di pubblicazione (sostituisce i campi per 10 secondi) */
.bo-publish-success {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: center;
  padding: 24px;
}
.bo-guide-link {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}
.bo-guide-link > :first-child {
  flex: 1;
  min-width: 0;
}
/* il link resta copiabile anche quando la guida è in sola lettura */
.bo-editor__content--readonly .bo-guide-link,
.bo-editor__content--readonly .bo-guide-link :deep(*) {
  pointer-events: auto;
}
.bo-publish-success__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 9999px;
  background: #f2f8f6;
  color: #0fa88c;
  margin-bottom: 16px;
}
.bo-publish-success__icon :deep(svg) {
  width: 40px;
  height: 40px;
}
.bo-publish-success__title {
  /* token "title/normal" (Inter SemiBold 20/28) */
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  color: #2c282f;
}
.bo-publish-success__desc {
  /* token "paragraph/normal" (Inter Regular 16/24) */
  margin: 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #2c282f;
}
.bo-publish-success__link {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 420px;
  margin-top: 8px;
}
.bo-publish-success__link > :first-child {
  flex: 1;
  min-width: 0;
}
.bo-link-intro {
  margin: 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #2c282f;
}
.bo-link-detail--fotask {
  gap: 24px;
}
.bo-date-row {
  display: flex;
  gap: 16px;
}
.bo-date-row > * {
  flex: 1 1 0;
  min-width: 0;
}
.bo-steps :deep(label p) {
  font-weight: 600;
}
.bo-steps :deep(label p.text-grey-500) {
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
}

/* Editor column */
.bo-editor {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.bo-editor__header {
  flex-shrink: 0;
  padding: 16px 24px;
  border-bottom: 1px solid #e9edf0;
}
.bo-editor__content {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  overflow-y: auto;
}
/* Live (published) version is read-only: keep the panel scrollable but make its
   contents non-interactive. */
.bo-editor__content--readonly :deep(*),
.bo-editor__footer--readonly :deep(*) {
  pointer-events: none;
}
.bo-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.bo-section__title {
  display: flex;
  align-items: center;
  gap: 8px;
}
.bo-section__icon {
  color: #5a6eff;
}
.bo-section__heading {
  font-size: 17px;
  font-weight: 600;
  line-height: 24px;
  color: #2c282f;
}
.bo-section__body {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-left: 32px;
}
.bo-section__desc {
  /* token "label/normal" (Inter Regular 16/20) + colore core/black */
  margin: 0 0 -16px;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  color: #2c282f;
}
.bo-media-hint {
  /* Paragraph (16px) + colore core/black, come gli altri testi */
  margin: 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #2c282f;
}
.bo-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.bo-block__title {
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #2c282f;
}
.bo-block__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.bo-section__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.bo-editor__footer {
  flex-shrink: 0;
  padding: 16px 24px;
  border-top: 1px solid #e9edf0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}
.bo-importo {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.bo-importo__field {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.bo-importo-card {
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #2c282f;
}
.bo-documento {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.bo-documento__field {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.bo-documento__option {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.bo-documento__request {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}
.bo-documento__request > :first-child {
  flex: 1;
  min-width: 0;
}
.bo-domanda {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.bo-domanda__field {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.bo-domanda__answers {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.bo-domanda__answer {
  display: flex;
  align-items: center;
  gap: 8px;
}
.bo-domanda__answer > :first-child {
  flex: 1;
  min-width: 0;
}
.bo-domanda__hint {
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #596167;
}
.bo-divider {
  border: none;
  border-top: 1px solid #e9edf0;
  margin: 0;
}
/* Toasts */
.bo-toasts {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 1000;
}

/* Preview column */
.bo-preview {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  overflow-y: auto;
  border-left: 1px solid #e9edf0;
}
.bo-preview__stage {
  flex: 1;
  min-height: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: #f7f6f3;
  border-radius: 8px;
  padding: 24px;
  overflow: auto;
}
.bo-frame {
  background: #ffffff;
  border: 1px solid #e9edf0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
}
.bo-frame--mobile {
  width: 393px;
  height: 874px;
  flex-shrink: 0;
}

/* Phone preview */
.bo-phone {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  text-align: left;
}
.bo-phone__title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 24px 16px 32px;
  color: #2c282f;
}
.bo-phone__title-text {
  flex: 1;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
}
.bo-phone__stepper {
  padding: 0 16px 32px;
}
.bo-phone__stepper :deep(.fz-stepper span.font-medium) {
  font-weight: 600;
}
.bo-phone__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.bo-phone__media {
  flex-shrink: 0;
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 1px solid #e9edf0;
  border-radius: 8px;
  background: #f4f6ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9da9b2;
  font-size: 12px;
  overflow: hidden;
}
.bo-phone__media img,
.bo-phone__media video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.bo-phone__desc {
  margin: 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #2c282f;
  white-space: pre-wrap;
}
.bo-phone__importi {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.bo-phone__importo {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.bo-phone__importo-label {
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #2c282f;
}
.bo-phone__importo-value {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #2c282f;
}
.bo-phone__documenti {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.bo-phone__documento {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.bo-phone__doc-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.bo-phone__doc-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #596167;
}
.bo-phone__doc-label {
  font-size: 14px;
  font-weight: 600;
  color: #2c282f;
}
.bo-phone__doc-request {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.bo-phone__documento .bo-phone__doc-request + .bo-phone__doc-request {
  margin-top: 16px;
}
.bo-phone__domande {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.bo-phone__domanda {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.bo-phone__domanda-question {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #2c282f;
}
.bo-phone__footer {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #e9edf0;
}
.bo-phone__footer > * {
  flex: 1;
}
.bo-phone__empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9da9b2;
  font-size: 13px;
  padding: 24px;
  text-align: center;
}
</style>
