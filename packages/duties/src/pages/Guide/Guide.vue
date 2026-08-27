<script setup lang="ts">
import { ref, computed, type ComponentPublicInstance } from 'vue'
import { useRouter } from 'vue-router'
import { FzIcon } from '@fiscozen/icons'
import { FzButton, FzIconButton } from '@fiscozen/button'
import { FzNavbar } from '@fiscozen/navbar'
import { FzAvatar } from '@fiscozen/avatar'
import { FzInput } from '@fiscozen/input'
import { FzSelect } from '@fiscozen/select'
import { FzBadge } from '@fiscozen/badge'
import { FzTable } from '@fiscozen/table'
import { FzColumn } from '@fiscozen/simple-table'
import { FzConfirmDialog } from '@fiscozen/dialog'
import { FzDivider } from '@fiscozen/divider'
import { FzFloating, useClickOutside } from '@fiscozen/composables'
import { FzActionList, FzActionSection, FzAction } from '@fiscozen/action'
import { useGuides, type Guide } from '../../composables/useGuides'

const router = useRouter()

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

const search = ref('')

const sortBy = ref<string | number | undefined>('created')
const sortOptions = [
  { value: 'created', label: 'Data di creazione' },
  { value: 'updated', label: 'Ultima modifica' },
  { value: 'title', label: 'Titolo (A-Z)' }
]

const annualita = ref<string | number | undefined>('all')

const authorFilter = ref<string | number | undefined>('all')

const guideName = (guide: Guide) =>
  guide.taskYear ? `${guide.title} ${guide.taskYear}` : guide.title

const railIcons = ['suitcase', 'folder-open', 'credit-card', 'cart-shopping', 'calendar', 'file']

const { guides, deleteGuide, duplicateGuide, unpublishGuide } = useGuides()

const annualitaOptions = computed(() => {
  const years = Array.from(
    new Set(guides.value.map((g) => g.taskYear).filter((y): y is string | number => y != null))
  ).sort((a, b) => Number(b) - Number(a))
  return [{ value: 'all', label: 'Tutte' }, ...years.map((y) => ({ value: y, label: String(y) }))]
})

// Solo i creatori che hanno effettivamente creato almeno una guida
const authorOptions = computed(() => {
  const authors = Array.from(
    new Set(guides.value.map((g) => g.author).filter((a): a is string => !!a))
  ).sort((a, b) => a.localeCompare(b))
  return [{ value: 'all', label: 'Tutti' }, ...authors.map((a) => ({ value: a, label: a }))]
})

const deleteDialog = ref<InstanceType<typeof FzConfirmDialog>>()
const guideToDelete = ref<Guide | null>(null)
const unpublishDialog = ref<InstanceType<typeof FzConfirmDialog>>()
const guideToUnpublish = ref<Guide | null>(null)

const filteredGuides = computed({
  get() {
    const query = search.value.trim().toLowerCase()
    let list = guides.value.filter((g) => {
      const annoOk = annualita.value === 'all' || g.taskYear === annualita.value
      const authorOk = authorFilter.value === 'all' || g.author === authorFilter.value
      const searchOk = !query || g.title.toLowerCase().includes(query)
      return annoOk && authorOk && searchOk
    })
    if (sortBy.value === 'title') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy.value === 'updated') {
      list = [...list].sort((a, b) => b.id - a.id)
    } else {
      list = [...list].sort((a, b) => a.id - b.id)
    }
    return list
  },
  set() {}
})

// Actions are computed per-row so "Elimina" can be disabled on published guides
const rowActions = (guide: Guide) => {
  const items = [
    { type: 'action' as const, label: 'Apri' },
    { type: 'action' as const, label: 'Duplica' }
  ]
  // Pubblicata -> "Annulla pubblicazione"; bozza -> "Elimina"; annullata -> nessuna azione distruttiva
  if (guide.status === 'published') {
    items.push({ type: 'action' as const, label: 'Annulla pubblicazione' })
  } else if (guide.status !== 'unpublished') {
    items.push({ type: 'action' as const, label: 'Elimina' })
  }
  return { items }
}

// Menu "Nuova guida": scelta della versione dell'editor (V1 / V2)
const newGuideOpen = ref(false)
const newGuideFloating = ref<ComponentPublicInstance>()
const newGuideFloatingDom = computed(() => newGuideFloating.value?.$el)
useClickOutside(newGuideFloatingDom, () => {
  newGuideOpen.value = false
})
const openEditor = () => {
  newGuideOpen.value = false
  router.push({ name: 'nuova-guida' })
}
const openEditorV2 = () => {
  newGuideOpen.value = false
  router.push({ name: 'nuova-guida-v2' })
}
const editGuide = (guide: Guide) =>
  router.push({ name: 'nuova-guida', params: { id: String(guide.id) } })

const askDeleteGuide = (guide: Guide) => {
  guideToDelete.value = guide
  deleteDialog.value?.show()
}

const confirmDeleteGuide = () => {
  if (guideToDelete.value) deleteGuide(guideToDelete.value.id)
  guideToDelete.value = null
}

const cancelDeleteGuide = () => {
  guideToDelete.value = null
}

const askUnpublishGuide = (guide: Guide) => {
  guideToUnpublish.value = guide
  unpublishDialog.value?.show()
}

const confirmUnpublishGuide = () => {
  if (guideToUnpublish.value) unpublishGuide(guideToUnpublish.value.id)
  guideToUnpublish.value = null
}

const cancelUnpublishGuide = () => {
  guideToUnpublish.value = null
}

const onRowAction = (
  _index: number,
  action: { label?: string },
  rowData?: Guide
) => {
  if (!rowData) return
  if (action.label === 'Apri') editGuide(rowData)
  else if (action.label === 'Duplica') duplicateGuide(rowData.id)
  else if (action.label === 'Elimina') askDeleteGuide(rowData)
  else if (action.label === 'Annulla pubblicazione') askUnpublishGuide(rowData)
}
</script>

<template>
  <div class="bo-layout">
    <!-- Left icon rail -->
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
        <h1 class="bo-header__title">Guide clienti</h1>
        <div class="bo-header__actions">
          <FzFloating
            ref="newGuideFloating"
            position="bottom-end"
            :is-open="newGuideOpen"
            teleport
            content-class="!mt-4 z-60"
          >
            <template #opener>
              <FzButton
                label="Nuova guida"
                iconName="plus"
                variant="primary"
                environment="backoffice"
                @click="newGuideOpen = !newGuideOpen"
              />
            </template>
            <FzActionList list-class="!gap-8">
              <FzActionSection environment="backoffice">
                <FzAction
                  type="action"
                  environment="backoffice"
                  label="V1"
                  @click="openEditor"
                />
                <FzAction
                  type="action"
                  environment="backoffice"
                  label="V2"
                  @click="openEditorV2"
                />
              </FzActionSection>
            </FzActionList>
          </FzFloating>
        </div>
      </header>

      <!-- Body -->
      <div class="bo-body">
        <!-- Left filter sidebar -->
        <aside class="bo-sidebar">
          <FzInput
            v-model="search"
            leftIcon="magnifying-glass"
            placeholder="Cerca una guida..."
            environment="backoffice"
          />
          <FzSelect
            v-model="sortBy"
            label="Ordina per"
            :options="sortOptions"
            environment="backoffice"
          />
          <FzSelect
            v-model="annualita"
            label="Anno"
            :options="annualitaOptions"
            environment="backoffice"
          />
          <FzSelect
            v-model="authorFilter"
            label="Creatore"
            :options="authorOptions"
            environment="backoffice"
          />
        </aside>

        <!-- Vertical divider -->
        <FzDivider class="bo-sidebar__divider" />

        <!-- Content column -->
        <div class="bo-content">
          <!-- Empty state -->
          <div v-if="!filteredGuides.length" class="bo-empty">
            <p class="bo-empty__text">
              {{
                guides.length
                  ? 'Nessuna guida corrisponde ai filtri selezionati.'
                  : 'Non sono ancora state create delle guide'
              }}
            </p>
          </div>

          <!-- List view -->
          <FzTable
            v-else
            v-model="filteredGuides"
            :actions="rowActions"
            @fztable:rowactionclick="onRowAction"
          >
            <FzColumn field="title" header="Nome guida">
              <template #default="{ data }">
                {{ guideName(data) }}
              </template>
            </FzColumn>
            <FzColumn field="modified" header="Modificata il" />
            <FzColumn field="author" header="Creata da" />
            <FzColumn field="status" header="Stato">
              <template #default="{ data }">
                <FzBadge
                  variant="text"
                  :tone="data.status === 'published' ? 'success' : data.status === 'unpublished' ? 'error' : 'light'"
                >
                  {{
                    data.status === 'published'
                      ? 'Pubblicato'
                      : data.status === 'unpublished'
                        ? 'Pubblicazione annullata'
                        : 'Bozza'
                  }}
                </FzBadge>
              </template>
            </FzColumn>
          </FzTable>
        </div>
      </div>
      </div>
    </div>

    <FzConfirmDialog
      ref="deleteDialog"
      size="sm"
      title="Elimina guida"
      confirmLabel="Elimina"
      cancelLabel="Annulla"
      confirmButtonVariant="danger"
      @fzmodal:confirm="confirmDeleteGuide"
      @fzmodal:cancel="cancelDeleteGuide"
    >
      <template #body>
        <p>
          Vuoi davvero eliminare la guida
          <strong>{{ guideToDelete?.title }}</strong
          >? L'azione non può essere annullata.
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
      @fzmodal:confirm="confirmUnpublishGuide"
      @fzmodal:cancel="cancelUnpublishGuide"
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

/* Navbar (vertical icon rail) */
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
  padding: 0 24px;
}
.bo-header__title {
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  margin: 0;
}
.bo-header__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Body */
.bo-body {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  padding: 24px;
  display: flex;
  align-items: stretch;
  gap: 24px;
}

/* Filter sidebar */
.bo-sidebar {
  flex-shrink: 0;
  width: 233px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.bo-sidebar :deep(.fz-select),
.bo-sidebar > * {
  max-width: 233px;
}

/* Vertical divider (FzDivider is horizontal-only → make it a full-height rule) */
.bo-sidebar__divider {
  flex-shrink: 0;
  align-self: stretch;
  width: 1px;
  min-width: 1px;
  height: auto;
  border-top: 0;
  border-left: 1px solid #e9edf0;
  margin: 0;
}

/* Content column */
.bo-content {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Empty state */
.bo-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.bo-empty__text {
  margin: 0;
  font-size: 14px;
  line-height: 16px;
  color: #2c282f;
  text-align: center;
}

/* Dialog footer (backoffice buttons) */
.bo-dialog-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
}
</style>
