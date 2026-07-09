import { ref } from 'vue'

export interface Project {
  id: number
  name: string
  description?: string
  area?: string | number
  createdAt: string
  modified: string
}

export type ProjectDraft = {
  name: string
  description?: string
  area?: string | number
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
    project.modified = formatDate(new Date())
  }

  const deleteProject = (id: number) => {
    const index = projects.value.findIndex((p) => p.id === id)
    if (index !== -1) projects.value.splice(index, 1)
  }

  return { projects, getProject, addProject, updateProject, deleteProject }
}
