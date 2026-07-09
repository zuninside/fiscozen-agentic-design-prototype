<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { FzIcon } from '@fiscozen/icons'
import { FzButton, FzIconButton } from '@fiscozen/button'
import { FzNavbar } from '@fiscozen/navbar'
import { FzAvatar } from '@fiscozen/avatar'
import { FzInput } from '@fiscozen/input'
import { FzTextarea } from '@fiscozen/textarea'
import { FzSelect } from '@fiscozen/select'
import { FzTable } from '@fiscozen/table'
import { FzColumn } from '@fiscozen/simple-table'
import { FzConfirmDialog } from '@fiscozen/dialog'
import { FzDivider } from '@fiscozen/divider'
import { useProjects, type Project } from '../../composables/useProjects'

const router = useRouter()

const search = ref('')

const sortBy = ref<string | number | undefined>('created')
const sortOptions = [
  { value: 'created', label: 'Data di creazione' },
  { value: 'updated', label: 'Ultima modifica' },
  { value: 'name', label: 'Nome (A-Z)' }
]

const railIcons = ['suitcase', 'folder-open', 'credit-card', 'cart-shopping', 'calendar', 'file', 'gear']

const { projects, addProject, updateProject, deleteProject } = useProjects()

const filteredProjects = computed({
  get() {
    const query = search.value.trim().toLowerCase()
    let list = projects.value.filter((p) => !query || p.name.toLowerCase().includes(query))
    if (sortBy.value === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy.value === 'updated') {
      list = [...list].sort((a, b) => b.id - a.id)
    } else {
      list = [...list].sort((a, b) => a.id - b.id)
    }
    return list
  },
  set() {}
})

const rowActions = {
  items: [
    { type: 'action' as const, label: 'Apri' },
    { type: 'action' as const, label: 'Modifica' },
    { type: 'action' as const, label: 'Elimina' }
  ]
}

const openProject = (project: Project) =>
  router.push({ name: 'progetto', params: { projectId: String(project.id) } })

// Create / edit dialog
const editDialog = ref<InstanceType<typeof FzConfirmDialog>>()
const editingId = ref<number | null>(null)
const formName = ref('')
const formDescription = ref('')

const dialogTitle = computed(() =>
  editingId.value ? 'Modifica progetto' : 'Nuovo progetto'
)

const openCreate = () => {
  editingId.value = null
  formName.value = ''
  formDescription.value = ''
  editDialog.value?.show()
}

const openEdit = (project: Project) => {
  editingId.value = project.id
  formName.value = project.name
  formDescription.value = project.description ?? ''
  editDialog.value?.show()
}

const confirmEdit = () => {
  const data = {
    name: formName.value.trim() || 'Nuovo progetto',
    description: formDescription.value.trim() || undefined
  }
  if (editingId.value) {
    updateProject(editingId.value, data)
    editingId.value = null
  } else {
    const newId = addProject(data)
    editingId.value = null
    router.push({ name: 'progetto', params: { projectId: String(newId) } })
  }
}

// Delete dialog
const deleteDialog = ref<InstanceType<typeof FzConfirmDialog>>()
const projectToDelete = ref<Project | null>(null)

const askDeleteProject = (project: Project) => {
  projectToDelete.value = project
  deleteDialog.value?.show()
}

const confirmDeleteProject = () => {
  if (projectToDelete.value) deleteProject(projectToDelete.value.id)
  projectToDelete.value = null
}

const cancelDeleteProject = () => {
  projectToDelete.value = null
}

const onRowAction = (
  _index: number,
  action: { label?: string },
  rowData?: Project
) => {
  if (!rowData) return
  if (action.label === 'Apri') openProject(rowData)
  else if (action.label === 'Modifica') openEdit(rowData)
  else if (action.label === 'Elimina') askDeleteProject(rowData)
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
      </template>
      <template #user-menu>
        <FzAvatar first-name="Mario" last-name="Rossi" environment="backoffice" />
      </template>
    </FzNavbar>

    <div class="bo-main">
      <div class="bo-content-card">
      <!-- Header -->
      <header class="bo-header">
        <h1 class="bo-header__title">Guide</h1>
        <div class="bo-header__actions">
          <FzButton
            label="Nuovo progetto"
            iconName="plus"
            variant="primary"
            environment="backoffice"
            @click="openCreate"
          />
        </div>
      </header>

      <!-- Body -->
      <div class="bo-body">
        <!-- Left filter sidebar -->
        <aside class="bo-sidebar">
          <FzInput
            v-model="search"
            leftIcon="magnifying-glass"
            placeholder="Cerca un progetto..."
            environment="backoffice"
          />
          <FzSelect
            v-model="sortBy"
            label="Ordina per"
            :options="sortOptions"
            environment="backoffice"
          />
        </aside>

        <!-- Vertical divider -->
        <FzDivider class="bo-sidebar__divider" />

        <!-- Content column -->
        <div class="bo-content">
          <!-- Empty state -->
          <div v-if="!filteredProjects.length" class="bo-empty">
            <p class="bo-empty__text">
              {{
                projects.length
                  ? 'Nessun progetto corrisponde alla ricerca.'
                  : 'Non sono ancora stati creati dei progetti.'
              }}
            </p>
          </div>

          <!-- List view -->
          <FzTable
            v-else
            v-model="filteredProjects"
            :actions="rowActions"
            @fztable:rowactionclick="onRowAction"
          >
            <FzColumn field="name" header="Nome progetto" />
            <FzColumn field="description" header="Descrizione" />
            <FzColumn field="modified" header="Modificato il" />
          </FzTable>
        </div>
      </div>
      </div>
    </div>

    <FzConfirmDialog
      ref="editDialog"
      size="md"
      :title="dialogTitle"
      confirmLabel="Salva"
      cancelLabel="Annulla"
      confirmButtonVariant="primary"
      @fzmodal:confirm="confirmEdit"
    >
      <template #body>
        <div class="bo-form">
          <FzInput
            v-model="formName"
            label="Nome del progetto"
            placeholder="Scrivi il nome del progetto"
            environment="backoffice"
          />
          <FzTextarea
            v-model="formDescription"
            label="Descrizione"
            placeholder="Descrivi brevemente il progetto"
            :rows="3"
          />
        </div>
      </template>
      <template #footer>
        <div class="bo-dialog-footer">
          <FzButton
            variant="invisible"
            environment="backoffice"
            label="Annulla"
            @click="editDialog?.handleCancel()"
          />
          <FzButton
            variant="primary"
            environment="backoffice"
            label="Salva"
            @click="editDialog?.handleConfirm()"
          />
        </div>
      </template>
    </FzConfirmDialog>

    <FzConfirmDialog
      ref="deleteDialog"
      size="sm"
      title="Elimina progetto"
      confirmLabel="Elimina"
      cancelLabel="Annulla"
      confirmButtonVariant="danger"
      @fzmodal:confirm="confirmDeleteProject"
      @fzmodal:cancel="cancelDeleteProject"
    >
      <template #body>
        <p>
          Vuoi davvero eliminare il progetto
          <strong>{{ projectToDelete?.name }}</strong
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
.bo-header__search {
  width: 260px;
  flex-shrink: 0;
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

/* Dialog form */
.bo-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
