<script setup lang="ts">
import { ref } from 'vue'

import { FrontofficeLayout } from '@fz-design/shared/templates'
import { FzContainer } from '@fiscozen/container'
import { FzButton, FzIconButton } from '@fiscozen/button'
import { FzStepper } from '@fiscozen/stepper'
import { FzCard } from '@fiscozen/card'
import { FzDivider } from '@fiscozen/divider'
import { FzAction } from '@fiscozen/action'
import { FzIcon } from '@fiscozen/icons'

import type { RedditiStep } from './types'

const steps: RedditiStep[] = [
  { title: 'Accedi a Inarcassa', status: 'completed' },
  { title: 'Apri la dichiarazione redditi', status: 'completed' },
  { title: 'Inserisci i dati anagrafici', status: 'completed' },
  { title: 'Inserisci i redditi professionali', status: 'completed' },
  { title: "Inserisci il volume d'affari", status: 'completed' },
  { title: 'Controlla il riepilogo', status: 'completed' },
  { title: 'Invia la dichiarazione e paga' }
]

const activeStep = ref(steps.length - 1)
const confirmed = ref(false)

const onBack = () => {}
const onConfirm = () => {
  confirmed.value = true
}
const onFinish = () => {}
</script>

<template>
  <FrontofficeLayout>
    <FzContainer gap="base">
      <FzContainer alignItems="center" gap="sm" horizontal>
        <FzIconButton
          aria-label="Torna al passo precedente"
          environment="frontoffice"
          iconName="angle-left"
          variant="invisible"
          @click="onBack"
        />
        <h1>Comunica i tuoi redditi a Inarcassa</h1>
      </FzContainer>

      <FzStepper v-model:activeStep="activeStep" :hasStepperList="false" :steps="steps" />

      <FzCard color="purple">
        <FzContainer alignItems="center">
          <FzIcon name="file-invoice" size="2xl" variant="fas" />
        </FzContainer>
      </FzCard>

      <FzContainer gap="sm">
        <h2>Ancora un passaggio e abbiamo finito!</h2>
        <p>Controlla nel riepilogo che i dati inseriti siano corretti e clicca su “Avanti”.</p>
        <p>Quindi, scorri fino in fondo e clicca su “Conferma i dati e invia dichiarazione”.</p>
        <p>Una volta inviata, torna qui e clicca su “Fatto”.</p>
      </FzContainer>

      <FzDivider />

      <p>
        Entro il 31/12/2025 paga il conguaglio contributivo tramite PagoPA o modello F24.
        Quest’ultimo lo troverai automaticamente nella tua area riservata di Inarcassa.
      </p>

      <FzAction
        environment="frontoffice"
        :iconRightName="confirmed ? 'circle-check' : 'angle-right'"
        :iconRightVariant="confirmed ? 'fas' : 'far'"
        :label="confirmed ? 'Hai confermato l’invio' : 'Premi qui per confermare che hai fatto'"
        :subLabel="confirmed ? 'Ora puoi chiudere l’attività' : 'E poter chiudere l’attività'"
        type="action"
        variant="textLeft"
        @click="onConfirm"
      />

      <FzContainer gap="sm" horizontal layout="expand-all">
        <FzButton environment="frontoffice" label="Indietro" variant="secondary" @click="onBack" />
        <FzButton
          :disabled="!confirmed"
          environment="frontoffice"
          label="Fine"
          variant="primary"
          @click="onFinish"
        />
      </FzContainer>
    </FzContainer>
  </FrontofficeLayout>
</template>
