import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { Home } from './pages/Home'
import { ComunicaRedditiInarcassa } from './pages/ComunicaRedditiInarcassa'
import { BackofficeDashboard } from './pages/BackofficeDashboard'
import { RegistrazioneContabile } from './pages/RegistrazioneContabile'
import { Progetti } from './pages/Progetti'
import { Guide } from './pages/Guide'
import { NuovaGuida } from './pages/NuovaGuida'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/comunica-redditi-inarcassa',
    name: 'comunica-redditi-inarcassa',
    component: ComunicaRedditiInarcassa
  },
  {
    path: '/backoffice-dashboard',
    name: 'backoffice-dashboard',
    component: BackofficeDashboard
  },
  {
    path: '/registrazione-contabile',
    name: 'registrazione-contabile',
    component: RegistrazioneContabile
  },
  {
    path: '/progetti',
    name: 'progetti',
    component: Progetti
  },
  {
    path: '/progetti/:projectId',
    name: 'progetto',
    component: Guide
  },
  {
    path: '/progetti/:projectId/nuova-guida/:id?',
    name: 'nuova-guida',
    component: NuovaGuida
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
