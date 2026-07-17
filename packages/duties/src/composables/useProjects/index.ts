import { ref } from 'vue'

export interface TemaOption {
  value: string | number
  label: string
}

/** Catalogue of project themes — reactive so new themes added from the "Nuovo
 *  progetto" dialog appear everywhere (dialog, list filter, table column). */
const projectTemaOptions = ref<TemaOption[]>([
  { value: 'dichiarazione', label: 'Dichiarazione dei Redditi' },
  { value: 'tasse', label: 'Tasse' },
  { value: 'fatture', label: 'Fatture' },
  { value: 'adempimenti', label: 'Adempimenti' },
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'servizio-extra', label: 'Servizio Extra' }
])

export interface Project {
  id: number
  name: string
  description?: string
  area?: string | number
  tema?: string | number
  createdAt: string
  modified: string
}

export type ProjectDraft = {
  name: string
  description?: string
  area?: string | number
  tema?: string | number
}

const projects = ref<Project[]>([])

const formatDate = (date: Date) =>
  date.toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })

export function useProjects() {
  const getProject = (id: number) => projects.value.find((p) => p.id === id)

  const addProject = (data: ProjectDraft) => {
    const id = projects.value.length ? Math.max(...projects.value.map((p) => p.id)) + 1 : 1
    const today = formatDate(new Date())
    projects.value.push({
      id,
      name: data.name,
      description: data.description,
      area: data.area,
      tema: data.tema,
      createdAt: today,
      modified: today
    })
    return id
  }

  const updateProject = (id: number, data: ProjectDraft) => {
    const project = getProject(id)
    if (!project) return
    project.name = data.name
    project.description = data.description
    project.area = data.area
    project.tema = data.tema
    project.modified = formatDate(new Date())
  }

  const deleteProject = (id: number) => {
    const index = projects.value.findIndex((p) => p.id === id)
    if (index !== -1) projects.value.splice(index, 1)
  }

  /** Add a custom theme to the catalogue (or reuse it if the label already
   *  exists). Returns the value to assign to the project. */
  const addProjectTema = (label: string) => {
    const trimmed = label.trim()
    if (!trimmed) return undefined
    const existing = projectTemaOptions.value.find(
      (o) => o.label.toLowerCase() === trimmed.toLowerCase()
    )
    if (existing) return existing.value
    const value = `custom-${trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`
    projectTemaOptions.value.push({ value, label: trimmed })
    return value
  }

  return {
    projects,
    getProject,
    addProject,
    updateProject,
    deleteProject,
    projectTemaOptions,
    addProjectTema
  }
}
