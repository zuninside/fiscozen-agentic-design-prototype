<script setup lang="ts">
import { ref } from 'vue'

import { BackofficeShellLayout } from '@fz-design/shared/templates'
import { FzContainer } from '@fiscozen/container'
import { FzButton, FzIconButton } from '@fiscozen/button'
import { FzCard } from '@fiscozen/card'
import { FzBadge } from '@fiscozen/badge'
import { FzDivider } from '@fiscozen/divider'
import { FzAction } from '@fiscozen/action'
import { FzIcon } from '@fiscozen/icons'

const navItems = [
  { label: 'Dashboard', icon: 'gauge', active: true },
  { label: 'Pratiche', icon: 'folder-open', active: false },
  { label: 'Clienti', icon: 'users', active: false },
  { label: 'Scadenze', icon: 'calendar-days', active: false },
  { label: 'Impostazioni', icon: 'gear', active: false }
]

const activeNav = ref('Dashboard')
const onNavClick = (label: string) => {
  activeNav.value = label
}
</script>

<template>
  <BackofficeShellLayout>
    <template #header>
      <FzContainer alignItems="center" gap="sm" horizontal layout="space-between">
        <FzContainer alignItems="center" gap="sm" horizontal>
          <FzIcon name="building-columns" size="lg" variant="fas" />
          <h1>Fiscozen Backoffice</h1>
        </FzContainer>

        <FzContainer alignItems="center" gap="sm" horizontal>
          <FzIconButton
            aria-label="Notifiche"
            environment="backoffice"
            iconName="bell"
            variant="invisible"
          />
          <FzButton
            environment="backoffice"
            iconName="user"
            label="Mario Rossi"
            variant="secondary"
          />
        </FzContainer>
      </FzContainer>
    </template>

    <template #sidebar>
      <FzContainer gap="xs">
        <FzAction
          v-for="item in navItems"
          :key="item.label"
          environment="backoffice"
          :focused="activeNav === item.label"
          :iconLeftName="item.icon"
          iconLeftVariant="far"
          :label="item.label"
          type="action"
          variant="textLeft"
          @click="onNavClick(item.label)"
        />
      </FzContainer>
    </template>

    <template #breadcrumbs>
      <FzContainer alignItems="center" gap="xs" horizontal>
        <FzIcon name="house" size="sm" variant="far" />
        <p>Backoffice</p>
        <FzIcon name="angle-right" size="sm" variant="far" />
        <p>{{ activeNav }}</p>
      </FzContainer>
    </template>

    <FzContainer gap="base">
      <h2>Panoramica</h2>

      <FzContainer gap="base" horizontal layout="expand-all">
        <FzCard>
          <FzContainer gap="xs">
            <FzContainer alignItems="center" gap="xs" horizontal layout="space-between">
              <p>Pratiche aperte</p>
              <FzBadge tone="info" variant="text">In corso</FzBadge>
            </FzContainer>
            <h3>128</h3>
          </FzContainer>
        </FzCard>

        <FzCard>
          <FzContainer gap="xs">
            <FzContainer alignItems="center" gap="xs" horizontal layout="space-between">
              <p>Scadenze oggi</p>
              <FzBadge tone="warning" variant="text">Attenzione</FzBadge>
            </FzContainer>
            <h3>9</h3>
          </FzContainer>
        </FzCard>

        <FzCard>
          <FzContainer gap="xs">
            <FzContainer alignItems="center" gap="xs" horizontal layout="space-between">
              <p>Completate</p>
              <FzBadge tone="success" variant="text">OK</FzBadge>
            </FzContainer>
            <h3>342</h3>
          </FzContainer>
        </FzCard>
      </FzContainer>

      <FzDivider />

      <FzContainer gap="sm">
        <h2>Attività recenti</h2>
        <FzAction
          environment="backoffice"
          iconLeftName="file-invoice"
          iconLeftVariant="far"
          iconRightName="angle-right"
          iconRightVariant="far"
          label="Dichiarazione redditi · Studio Bianchi"
          subLabel="Aggiornata 10 minuti fa"
          type="action"
          variant="textLeft"
        />
        <FzAction
          environment="backoffice"
          iconLeftName="user-plus"
          iconLeftVariant="far"
          iconRightName="angle-right"
          iconRightVariant="far"
          label="Nuovo cliente · Verdi S.r.l."
          subLabel="Aggiunto 1 ora fa"
          type="action"
          variant="textLeft"
        />
        <FzAction
          environment="backoffice"
          iconLeftName="circle-check"
          iconLeftVariant="far"
          iconRightName="angle-right"
          iconRightVariant="far"
          label="F24 inviato · Neri & Co."
          subLabel="Completata ieri"
          type="action"
          variant="textLeft"
        />
      </FzContainer>
    </FzContainer>
  </BackofficeShellLayout>
</template>
