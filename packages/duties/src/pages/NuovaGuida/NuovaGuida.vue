<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { FzIcon } from '@fiscozen/icons'
import { FzButton, FzIconButton } from '@fiscozen/button'
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
import { FzTabs, FzTab } from '@fiscozen/tab'
import { useGuides, guideTemaOptions, type GuideStep, type GuideStepDomanda, type GuideStepDocumento } from '../../composables/useGuides'
import { useImportiCatalog } from '../../composables/useImportiCatalog'

const router = useRouter()
const route = useRoute()
const projectId = computed(() => Number(route.params.projectId))
const goHome = () =>
  router.push({ name: 'progetto', params: { projectId: String(projectId.value) } })
const { addGuide, updateGuide, getGuide, getLiveVersion } = useGuides()

const editingId = computed(() =>
  route.params.id ? Number(route.params.id) : undefined
)
const pageTitle = computed(() => (editingId.value ? 'Modifica guida' : 'Nuova guida'))
const isPublished = computed(
  () => !!editingId.value && getGuide(editingId.value)?.status === 'published'
)
const publishLabel = computed(() => (isPublished.value ? 'Aggiorna' : 'Pubblica'))

const toastQueue = ref<Toast[]>([])

const railIcons = ['suitcase', 'folder-open', 'credit-card', 'cart-shopping', 'calendar', 'file', 'gear']

const steps = ref<GuideStep[]>([])
const selection = ref('settings')
const isSettings = computed(() => selection.value === 'settings')
const currentStep = computed(() => steps.value.find((s) => `step-${s.id}` === selection.value))
const isLastStep = computed(() => {
  const last = steps.value[steps.value.length - 1]
  return !!currentStep.value && !!last && currentStep.value.id === last.id
})

const confirmToClose = ref(false)
const confirmSelection = ref<(string | number)[]>([])

const guideName = ref('')

const tema = ref<string | number | undefined>(undefined)

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

// Two alternative layouts for the settings "FrontOffice task" area.
// Switchable from the bottom of the sidebar so the previous version isn't lost.
const settingsVariant = ref<'radio' | 'existing'>('radio')
const settingsVariantOptions = [
  { value: 'radio', label: 'Collegamento (radio)' },
  { value: 'existing', label: 'FO Task esistente (radio)' }
]
const guideLink = ref<'adempimento' | 'fotask'>('adempimento')

// "Un adempimento" branch: pick one of Fiscozen's adempimenti.
const adempimento = ref<string | number | undefined>()
const adempimentoOptions = [
  { value: 'certificazione_unica', label: 'Certificazione Unica' },
  { value: 'dichiarazione_redditi', label: 'Dichiarazione dei Redditi' },
  { value: 'dichiarazione_iva', label: 'Dichiarazione IVA' },
  { value: 'modello_770', label: 'Modello 770' },
  { value: 'modello_irap', label: 'Modello IRAP' },
  { value: 'lipe', label: 'Liquidazione periodica IVA (LIPE)' },
  { value: 'esterometro', label: 'Esterometro' },
  { value: 'intrastat', label: 'Intrastat' },
  { value: 'comunicazione_reddituale', label: 'Comunicazione Reddituale' },
  { value: 'f24', label: 'F24' }
]

// "Un nuovo FO Task" branch: define a brand new frontoffice task.
const foTaskIdentifier = ref('')
const foTaskTitle = ref('')
const foTaskQueryTarget = ref<string | number | undefined>()
const foTaskQueryTargetOptions = [
  { value: 'active_users', label: 'Utenti attivi' },
  { value: 'users_with_vat', label: 'Utenti con partita IVA' },
  { value: 'forfettari', label: 'Utenti in regime forfettario' },
  { value: 'missing_declaration', label: 'Dichiarazione non ancora inviata' },
  { value: 'overdue_f24', label: 'F24 in scadenza o scaduti' },
  { value: 'incomplete_profile', label: 'Profilo incompleto' },
  { value: 'welfare_pending', label: 'Contributi previdenziali da versare' }
]
const foTaskHasDeadline = ref(false)
const foTaskDeadline = ref('')

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

if (editingId.value) {
  const guide = getGuide(editingId.value)
  if (guide) {
    guideName.value = guide.title
    tema.value = guide.tema
    frontofficeTask.value = guide.frontofficeTask
    taskYear.value = guide.taskYear
    steps.value = mapSteps(guide.steps)
  }
} else {
  steps.value.push({ id: 1, title: '', description: '', media: [], alert: null, importi: [], documenti: [], domande: [] })
}

// --- Version tabs (Bozza / Live) ---------------------------------------------
// A published guide that has since been edited & saved as a draft has two
// distinct versions: the read-only published "Live" snapshot and the editable
// working "Bozza". The tabs let the author switch between them.
type EditorState = {
  guideName: string
  tema: string | number | undefined
  frontofficeTask: string | number | undefined
  taskYear: string | number | undefined
  steps: GuideStep[]
}

const captureState = (): EditorState => ({
  guideName: guideName.value,
  tema: tema.value,
  frontofficeTask: frontofficeTask.value,
  taskYear: taskYear.value,
  steps: steps.value
})

const applyState = (s: EditorState) => {
  guideName.value = s.guideName
  tema.value = s.tema
  frontofficeTask.value = s.frontofficeTask
  taskYear.value = s.taskYear
  steps.value = mapSteps(s.steps)
  selection.value = 'settings'
}

const activeVersion = ref<'bozza' | 'live'>('bozza')
const editingGuide = computed(() => (editingId.value ? getGuide(editingId.value) : undefined))
// Tabs appear only when both a Live snapshot and a divergent Bozza exist.
const hasVersions = computed(
  () => !!editingGuide.value?.published && !!editingGuide.value?.hasDraftChanges
)
const isViewingLive = computed(() => hasVersions.value && activeVersion.value === 'live')

// Holds unsaved Bozza edits while the read-only Live version is on screen.
let bozzaBackup: EditorState | null = null

const onVersionChange = (title: string) => {
  const next: 'bozza' | 'live' = title === 'Live' ? 'live' : 'bozza'
  if (next === activeVersion.value) return
  if (next === 'live') {
    bozzaBackup = captureState()
    const live = editingId.value ? getLiveVersion(editingId.value) : undefined
    if (live) {
      applyState({
        guideName: live.title,
        tema: live.tema,
        frontofficeTask: live.frontofficeTask,
        taskYear: live.taskYear,
        steps: live.steps
      })
    }
  } else if (bozzaBackup) {
    applyState(bozzaBackup)
    bozzaBackup = null
  }
  activeVersion.value = next
}

// When the tabs disappear (e.g. after publishing merges Bozza into Live) fall
// back to the editable Bozza.
watch(hasVersions, (has) => {
  if (!has) activeVersion.value = 'bozza'
})

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

// Only one of Importi / Documenti / Domanda can be added per step
// (Alert is always available).
const hasExclusiveContent = computed(() => {
  const s = currentStep.value
  if (!s) return false
  return s.importi.length > 0 || s.documenti.length > 0 || s.domande.length > 0
})

const addImporto = () => {
  if (!currentStep.value || hasExclusiveContent.value) return
  currentStep.value.importi.push({ fonte: '' })
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
  { value: 'yesno', label: 'Sì / No' }
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
    tema: tema.value,
    frontofficeTask: frontofficeTask.value,
    taskYear: isWelfareDeclarationTask.value ? taskYear.value : undefined,
    projectId: projectId.value,
    steps: steps.value
  }
  if (editingId.value) {
    updateGuide(editingId.value, draft, status)
  } else {
    const id = addGuide(draft, status)
    router.replace({
      name: 'nuova-guida',
      params: { projectId: String(projectId.value), id: String(id) }
    })
  }
}

const save = () => {
  persist('draft')
  enqueueToast({ type: 'success', message: 'Guida salvata correttamente' }, toastQueue)
}

const publish = () => {
  const message = isPublished.value
    ? 'Guida aggiornata correttamente'
    : 'Guida pubblicata correttamente'
  persist('published')
  enqueueToast({ type: 'success', message }, toastQueue)
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
    title: s.title || 'Titolo passaggio',
    status: i < previewIndex.value ? ('completed' as const) : undefined,
    hasStepDescription: false
  }))
)
const previewTitleByTask: Record<string, string> = {
  SEND_ENPAM_WELFARE_DECLARATION: 'Comunica i tuoi redditi ad ENPAM'
}
const previewTitle = computed(() => {
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
const sampleImportoValue = '€ 12.000,00'

// Preview-only answer state for the interactive question mock
const previewSingle = ref<Record<number, string | undefined>>({})
const previewMultiple = ref<Record<number, string[]>>({})
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
  }
)

</script>

<template>
  <div class="bo-layout">
    <div class="bo-toasts">
      <FzToastQueue :toasts="toastQueue" />
    </div>
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
          <FzIconButton iconName="chevron-left" variant="invisible" environment="backoffice" aria-label="Indietro" @click="goHome" />
          <h1 class="bo-header__title">{{ pageTitle }}</h1>
        </div>
        <div class="bo-header__actions">
          <FzButton label="Elimina guida" iconName="trash" variant="danger" environment="backoffice" />
          <FzButton label="Salva" iconName="floppy-disk" variant="secondary" environment="backoffice" :disabled="isViewingLive" @click="save" />
          <FzButton :label="publishLabel" iconName="paper-plane" variant="primary" environment="backoffice" :disabled="isViewingLive" @click="publish" />
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
              :title="`${index + 1}° passaggio`"
              :subtitle="step.title"
              orientation="horizontal"
              :has-radio="false"
            />
          </div>
          <div class="bo-steps__add">
            <FzIconButton iconName="plus" variant="secondary" environment="backoffice" aria-label="Aggiungi passaggio" :disabled="isViewingLive" @click="addStep" />
          </div>
          <div class="bo-steps__switch">
            <FzSelect
              v-model="settingsVariant"
              label="Versione impostazioni"
              :options="settingsVariantOptions"
              environment="backoffice"
            />
          </div>
        </section>

        <!-- Column 2: editor -->
        <section class="bo-editor">
          <!-- Version tabs: shown only when a Live snapshot and a divergent Bozza both exist -->
          <div v-if="hasVersions" class="bo-editor__header">
            <FzTabs environment="backoffice" tab-style="fullWidth" @change="onVersionChange">
              <FzTab title="Bozza" :initial-selected="activeVersion === 'bozza'" />
              <FzTab title="Live" :initial-selected="activeVersion === 'live'" />
            </FzTabs>
          </div>
          <div class="bo-editor__content" :class="{ 'bo-editor__content--readonly': isViewingLive }">
          <template v-if="isSettings">
            <div class="bo-section">
              <div class="bo-section__title">
                <FzIcon name="file" size="md" class="bo-section__icon" />
                <span class="bo-section__heading">Guida</span>
              </div>
              <div class="bo-section__body">
                <FzInput
                  v-model="guideName"
                  label="Nome della guida"
                  placeholder="Scrivi il nome della guida"
                  environment="backoffice"
                  :disabled="isViewingLive"
                />
                <FzSelect
                  v-model="tema"
                  label="Tema"
                  placeholder="Seleziona un tema"
                  :options="guideTemaOptions"
                  environment="backoffice"
                  :disabled="isViewingLive"
                />
              </div>
            </div>

            <hr class="bo-divider" />

            <div v-if="settingsVariant === 'radio'" class="bo-section">
              <div class="bo-section__title">
                <FzIcon name="arrow-right" size="md" class="bo-section__icon" />
                <span class="bo-section__heading">Punto di partenza</span>
              </div>
              <div class="bo-section__body">
                <p class="bo-section__desc">A cosa vuoi collegare questa guida?</p>
                <FzRadioGroup variant="horizontal" name="guide-link" class="bo-link-group">
                  <FzRadioCard
                    v-model="guideLink"
                    name="guide-link"
                    value="adempimento"
                    label="adempimento"
                    title="Un adempimento"
                    subtitle="Ad esempio: Certificazione Unica, Dichiarazione dei Redditi, Dichiarazione IVA, 770"
                    orientation="vertical"
                    :has-radio="false"
                    :disabled="isViewingLive"
                  />
                  <FzRadioCard
                    v-model="guideLink"
                    name="guide-link"
                    value="fotask"
                    label="fotask"
                    title="Un nuovo FO Task"
                    subtitle="Potrai creare un nuovo task da mostrare all'utente prima di aprire la guida"
                    orientation="vertical"
                    :has-radio="false"
                    :disabled="isViewingLive"
                  />
                </FzRadioGroup>

                <div v-if="guideLink === 'adempimento'" class="bo-link-detail">
                  <FzSelect
                    v-model="adempimento"
                    label="Quale adempimento?"
                    :options="adempimentoOptions"
                    filterable
                    environment="backoffice"
                    :disabled="isViewingLive"
                  />
                </div>

                <div v-else class="bo-link-detail bo-link-detail--fotask">
                  <FzInput
                    v-model="foTaskIdentifier"
                    label="Identificativo"
                    placeholder="USER_TAX_DECLARATION"
                    environment="backoffice"
                    :disabled="isViewingLive"
                  >
                    <template #helpText>Ad esempio: USER_TAX_DECLARATION</template>
                  </FzInput>
                  <FzInput
                    v-model="foTaskTitle"
                    label="Titolo FO Task"
                    placeholder="Scrivi il titolo del task"
                    environment="backoffice"
                    :disabled="isViewingLive"
                  >
                    <template #helpText>È quello che comparirà nella dashboard dell'utente</template>
                  </FzInput>
                  <FzSelect
                    v-model="foTaskQueryTarget"
                    label="Query target"
                    :options="foTaskQueryTargetOptions"
                    filterable
                    environment="backoffice"
                    :disabled="isViewingLive"
                  />
                  <FzCheckbox
                    v-model="foTaskHasDeadline"
                    label="Ha una scadenza"
                    :disabled="isViewingLive"
                  />
                  <FzDatepicker
                    v-if="foTaskHasDeadline"
                    v-model="foTaskDeadline"
                    value-format="dd/MM/yyyy"
                    :input-props="{ label: 'Scadenza', placeholder: 'gg/mm/aaaa' }"
                    :disabled="isViewingLive"
                  />
                </div>
              </div>
            </div>

            <div v-else-if="settingsVariant === 'existing'" class="bo-section">
              <div class="bo-section__title">
                <FzIcon name="arrow-right" size="md" class="bo-section__icon" />
                <span class="bo-section__heading">Punto di partenza</span>
              </div>
              <div class="bo-section__body">
                <p class="bo-section__desc">A cosa vuoi collegare questa guida?</p>
                <FzRadioGroup variant="horizontal" name="guide-link" class="bo-link-group">
                  <FzRadioCard
                    v-model="guideLink"
                    name="guide-link"
                    value="adempimento"
                    label="adempimento"
                    title="Un FO Task esistente"
                    orientation="vertical"
                    :has-radio="false"
                    :disabled="isViewingLive"
                  />
                  <FzRadioCard
                    v-model="guideLink"
                    name="guide-link"
                    value="fotask"
                    label="fotask"
                    title="Un nuovo FO Task"
                    orientation="vertical"
                    :has-radio="false"
                    :disabled="isViewingLive"
                  />
                </FzRadioGroup>

                <div v-if="guideLink === 'adempimento'" class="bo-link-detail">
                  <FzSelect
                    v-model="frontofficeTask"
                    label="Quale FO Task?"
                    placeholder="Seleziona un task"
                    :options="frontofficeTaskOptions"
                    filterable
                    environment="backoffice"
                    :disabled="isViewingLive"
                  />
                  <FzSelect
                    v-if="isWelfareDeclarationTask"
                    v-model="taskYear"
                    label="Anno"
                    placeholder="Seleziona un anno"
                    :options="taskYearOptions"
                    environment="backoffice"
                    :disabled="isViewingLive"
                  />
                </div>

                <div v-else class="bo-link-detail bo-link-detail--fotask">
                  <FzInput
                    v-model="foTaskIdentifier"
                    label="Identificativo"
                    placeholder="USER_TAX_DECLARATION"
                    environment="backoffice"
                    :disabled="isViewingLive"
                  >
                    <template #helpText>Ad esempio: USER_TAX_DECLARATION</template>
                  </FzInput>
                  <FzInput
                    v-model="foTaskTitle"
                    label="Titolo FO Task"
                    placeholder="Scrivi il titolo del task"
                    environment="backoffice"
                    :disabled="isViewingLive"
                  >
                    <template #helpText>È quello che comparirà nella dashboard dell'utente</template>
                  </FzInput>
                  <FzSelect
                    v-model="foTaskQueryTarget"
                    label="Query target"
                    :options="foTaskQueryTargetOptions"
                    filterable
                    environment="backoffice"
                    :disabled="isViewingLive"
                  />
                  <FzCheckbox
                    v-model="foTaskHasDeadline"
                    label="Ha una scadenza"
                    :disabled="isViewingLive"
                  />
                  <FzDatepicker
                    v-if="foTaskHasDeadline"
                    v-model="foTaskDeadline"
                    value-format="dd/MM/yyyy"
                    :input-props="{ label: 'Scadenza', placeholder: 'gg/mm/aaaa' }"
                    :disabled="isViewingLive"
                  />
                </div>
              </div>
            </div>

          </template>
          <template v-else-if="currentStep">
            <!-- Section: Titolo passaggio (only with more than one step) -->
            <template v-if="steps.length > 1">
              <div class="bo-section">
                <div class="bo-section__title">
                  <FzIcon name="pencil" size="md" class="bo-section__icon" />
                  <span class="bo-section__heading">Titolo passaggio</span>
                </div>
                <div class="bo-section__body">
                  <FzInput
                    :key="currentStep.id"
                    v-model="currentStep.title"
                    placeholder="Scrivi il titolo di questo passaggio"
                    environment="backoffice"
                    :disabled="isViewingLive"
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
                    :disabled="isViewingLive || !!currentStep.alert"
                    @click="addAlert"
                  />
                  <FzButton
                    label="Importi"
                    iconName="plus"
                    variant="secondary"
                    environment="backoffice"
                    :disabled="isViewingLive || hasExclusiveContent"
                    @click="addImporto"
                  />
                  <FzButton
                    label="Documenti"
                    iconName="plus"
                    variant="secondary"
                    environment="backoffice"
                    :disabled="isViewingLive || hasExclusiveContent"
                    @click="addDocumento"
                  />
                  <FzButton
                    label="Domanda"
                    iconName="plus"
                    variant="secondary"
                    environment="backoffice"
                    :disabled="isViewingLive || hasExclusiveContent"
                    @click="addDomanda"
                  />
                </div>

                <!-- Descrizione block -->
                <div class="bo-block">
                  <p class="bo-block__title">Descrizione</p>
                  <FzTextarea
                    :key="currentStep.id"
                    v-model="currentStep.description"
                    placeholder="Scrivi la descrizione del passaggio…"
                    :rows="6"
                    resize="vertical"
                    :disabled="isViewingLive"
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
                        :disabled="isViewingLive"
                        @click="removeAlert"
                      />
                    </div>
                    <FzSelect
                      v-model="currentStep.alert.tone"
                      label="Tono"
                      placeholder="Seleziona il tono"
                      :options="alertToneOptions"
                      environment="backoffice"
                      :disabled="isViewingLive"
                    />
                    <FzSelect
                      v-model="currentStep.alert.position"
                      label="Posizione"
                      placeholder="Seleziona la posizione"
                      :options="alertPositionOptions"
                      environment="backoffice"
                      :disabled="isViewingLive"
                    />
                    <FzInput
                      v-model="currentStep.alert.title"
                      label="Titolo alert"
                      placeholder="Scrivi il titolo dell'alert"
                      environment="backoffice"
                      :disabled="isViewingLive"
                    />
                    <FzInput
                      v-model="currentStep.alert.text"
                      label="Testo alert"
                      placeholder="Scrivi il testo dell'alert"
                      environment="backoffice"
                      :disabled="isViewingLive"
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
                        :disabled="isViewingLive"
                        @click="removeImporto(0)"
                      />
                    </div>
                    <div
                      v-for="(importo, index) in currentStep.importi"
                      :key="index"
                      class="bo-importo"
                    >
                      <div class="bo-importo__field">
                        <FzSelect
                          v-model="importo.fonte"
                          label="Fonte dei calcoli"
                          placeholder="Seleziona la fonte"
                          :options="fonteOptions"
                          environment="backoffice"
                          :disabled="isViewingLive"
                        />
                        <div v-if="getFonte(importo.fonte)" class="bo-importo__list">
                          <div
                            v-for="def in getFonte(importo.fonte)?.importi"
                            :key="def.key"
                            class="bo-importo__preview"
                          >
                            <span class="bo-importo__preview-label">{{ def.label }}</span>
                          </div>
                        </div>
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
                        :disabled="isViewingLive"
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
                          <FzCheckbox v-model="documento.fornisci" label="Fornisci un documento" :disabled="isViewingLive" />
                          <FzUpload
                            v-if="documento.fornisci"
                            v-model="documento.files"
                            multiple
                            buttonLabel="Carica"
                            dragAndDropLabel="o trascina qui"
                          />
                        </div>
                        <div class="bo-documento__option">
                          <FzCheckbox v-model="documento.richiedi" label="Richiedi un documento" :disabled="isViewingLive" />
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
                                :disabled="isViewingLive"
                              />
                              <FzIconButton
                                iconName="trash"
                                variant="invisible"
                                environment="backoffice"
                                aria-label="Rimuovi richiesta"
                                :disabled="isViewingLive || documento.requests.length <= 1"
                                @click="removeRichiesta(documento, rIndex)"
                              />
                            </div>
                            <FzButton
                              variant="invisible"
                              environment="backoffice"
                              :disabled="isViewingLive"
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
                        :disabled="isViewingLive"
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
                          :disabled="isViewingLive"
                        />
                        <FzInput
                          v-model="domanda.question"
                          label="Domanda"
                          placeholder="Scrivi la domanda"
                          environment="backoffice"
                          :disabled="isViewingLive"
                        />
                        <p v-if="domanda.type === 'yesno'" class="bo-domanda__hint">
                          Le risposte disponibili saranno "Sì" e "No".
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
                              :disabled="isViewingLive"
                            />
                            <FzIconButton
                              iconName="trash"
                              variant="invisible"
                              environment="backoffice"
                              aria-label="Rimuovi risposta"
                              :disabled="isViewingLive || domanda.answers.length <= 1"
                              @click="removeRisposta(domanda, aIndex)"
                            />
                          </div>
                          <FzButton
                            label="Aggiungi risposta"
                            iconName="plus"
                            variant="invisible"
                            environment="backoffice"
                            :disabled="isViewingLive"
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

          <!-- Footer: confirm-to-close checkbox on the last step + delete step -->
          <div v-if="currentStep" class="bo-editor__footer" :class="{ 'bo-editor__footer--readonly': isViewingLive }">
            <div v-if="isLastStep" class="bo-editor__footer-check">
              <FzCheckbox v-model="confirmToClose" label="Chiedi la conferma per chiudere il task" :disabled="isViewingLive" />
            </div>
            <FzButton
              v-if="steps.length > 1"
              label="Elimina passaggio"
              iconName="trash"
              variant="danger"
              environment="backoffice"
              :disabled="isViewingLive"
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
                    <div v-if="previewMediaUrl" class="bo-phone__media">
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
                      {{ previewStep.description || 'La descrizione del passaggio apparirà qui.' }}
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
                        <p class="bo-phone__domanda-question">
                          {{ domanda.question || 'La tua domanda' }}
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
                        <!-- Yes / No -->
                        <template v-else>
                          <FzRadioCard
                            v-model="previewSingle[dIndex]"
                            :name="`preview-domanda-${dIndex}`"
                            value="yes"
                            label="yes"
                            title="Sì"
                            orientation="horizontal"
                          />
                          <FzRadioCard
                            v-model="previewSingle[dIndex]"
                            :name="`preview-domanda-${dIndex}`"
                            value="no"
                            label="no"
                            title="No"
                            orientation="horizontal"
                          />
                        </template>
                      </div>
                    </div>
                    <!-- Confirm-to-close radiocard on the last step -->
                    <div v-if="confirmToClose && previewIsLastStep" class="bo-phone__confirm">
                      <FzCheckboxCard
                        v-model="confirmSelection"
                        name="guide-confirm-close"
                        value="done"
                        label="done"
                        title="Premi qui per confermare che hai fatto"
                        subtitle="E poter chiudere l'attività"
                        variant="horizontal"
                        :has-checkbox="false"
                      />
                    </div>
                  </div>
                  <!-- Footer -->
                  <div class="bo-phone__footer">
                    <FzButton v-if="steps.length > 1" label="Indietro" variant="secondary" size="sm" environment="frontoffice" />
                    <FzButton :label="previewIsLastStep ? 'Fine' : 'Avanti'" variant="primary" size="sm" environment="frontoffice" />
                  </div>
                </template>
                <div v-else class="bo-phone__empty">
                  Aggiungi un passaggio per vedere l'anteprima
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
.bo-steps__switch {
  margin-top: auto;
  padding-top: 16px;
}
.bo-link-group :deep([role='radiogroup']) > * {
  flex: 1 1 0;
  min-width: 0;
}
.bo-link-group :deep(label p.font-medium) {
  font-weight: 600;
}
.bo-link-group :deep(label > div) {
  margin-top: 0;
}
.bo-link-group :deep(label) {
  padding: 12px;
}
.bo-link-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.bo-link-detail--fotask {
  gap: 24px;
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
  margin: 0 0 -16px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #596167;
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
.bo-editor__footer-check {
  margin-right: auto;
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
  gap: 4px;
}
.bo-importo__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.bo-importo__preview {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #f7f9fa;
  border: 1px solid #e9edf0;
  border-radius: 8px;
}
.bo-importo__preview-label {
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;
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
  gap: 12px;
}
.bo-phone__media {
  flex-shrink: 0;
  height: 180px;
  margin-bottom: 12px;
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
.bo-phone__confirm {
  margin-top: 12px;
}
.bo-phone__desc {
  margin: 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #2c282f;
  white-space: pre-wrap;
}
.bo-phone__importi-card {
  margin-top: 24px;
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
  margin-top: 12px;
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
  margin-top: 12px;
}
.bo-phone__domanda {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.bo-phone__domanda-question {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
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
