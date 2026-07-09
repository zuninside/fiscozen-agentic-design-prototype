# Esempio: modalità creazione

> Questo esempio mostra come Claude risponde a una richiesta di creazione di un prototipo Vue nel playground Fiscozen.

## Richiesta

"Crea il form di aggiunta cliente nel FO. L'utente deve inserire i dati anagrafici essenziali del cliente (nome, cognome, codice fiscale) per poterlo poi usare nelle fatture."

## Contesto minimo verificato

- **Cosa:** form di aggiunta cliente nel FO
- **Surface:** FO
- **Task utente:** registrare un nuovo cliente per poterlo selezionare nelle fatture
- **Output:** prototipo Vue nel playground (default per modalità creazione)

---

## Prototipo: AddClient
**Surface:** FO
**Task utente:** registrare un nuovo cliente per poterlo selezionare nelle fatture
**File:** `src/pages/frontoffice/AddClient.vue`

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { FzButton } from '@fiscozen/button'
import { FzInput } from '@fiscozen/input'
import { FzCard } from '@fiscozen/card'

const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const fiscalCode = ref('')

const firstNameTouched = ref(false)
const lastNameTouched = ref(false)
const fiscalCodeTouched = ref(false)

const showHighlight = ref(false)

const firstNameError = computed(() => {
  if (!firstNameTouched.value) return ''
  if (firstName.value.trim().length === 0) return 'Inserisci il nome del cliente per continuare'
  return ''
})

const lastNameError = computed(() => {
  if (!lastNameTouched.value) return ''
  if (lastName.value.trim().length === 0) return 'Inserisci il cognome del cliente per continuare'
  return ''
})

const fiscalCodeError = computed(() => {
  if (!fiscalCodeTouched.value) return ''
  if (fiscalCode.value.length === 0) return 'Inserisci il codice fiscale per continuare'
  if (fiscalCode.value.length !== 16) {
    return `Il codice fiscale deve avere 16 caratteri — ne hai inseriti ${fiscalCode.value.length}`
  }
  return ''
})

const missingFieldsCount = computed(() => {
  let count = 0
  if (firstName.value.trim().length === 0) count++
  if (lastName.value.trim().length === 0) count++
  if (fiscalCode.value.length !== 16) count++
  return count
})

const canSubmit = computed(() => missingFieldsCount.value === 0)

function onSubmit() {
  if (!canSubmit.value) {
    showHighlight.value = true
    firstNameTouched.value = true
    lastNameTouched.value = true
    fiscalCodeTouched.value = true
    return
  }
  // TODO: integrazione con API salvataggio cliente
  router.push('/clients')
}
</script>

<template>
  <div class="max-w-md mx-auto p-4">
    <h1 class="text-2xl font-semibold mb-6">Aggiungi cliente</h1>

    <FzCard environment="frontoffice" class="p-4">
      <div class="space-y-4">
        <FzInput
          v-model="firstName"
          environment="frontoffice"
          label="Nome"
          placeholder="Inserisci il nome del cliente"
          :error="firstNameError"
          :highlight="showHighlight && firstName.trim().length === 0"
          @blur="firstNameTouched = true"
        />
        <FzInput
          v-model="lastName"
          environment="frontoffice"
          label="Cognome"
          placeholder="Inserisci il cognome del cliente"
          :error="lastNameError"
          :highlight="showHighlight && lastName.trim().length === 0"
          @blur="lastNameTouched = true"
        />
        <FzInput
          v-model="fiscalCode"
          environment="frontoffice"
          label="Codice fiscale"
          placeholder="Inserisci il codice fiscale"
          :error="fiscalCodeError"
          :highlight="showHighlight && fiscalCode.length !== 16"
          @blur="fiscalCodeTouched = true"
        />
      </div>
    </FzCard>

    <div class="flex gap-3 mt-6">
      <FzButton
        environment="frontoffice"
        variant="secondary"
        @click="router.back()"
      >
        Indietro
      </FzButton>

      <div class="flex-1 flex items-center gap-2 justify-end">
        <FzButton
          v-if="missingFieldsCount > 0"
          environment="frontoffice"
          variant="ghost"
          @click="showHighlight = true"
        >
          {{ missingFieldsCount }} campi da completare
        </FzButton>

        <FzButton
          environment="frontoffice"
          variant="primary"
          :aria-disabled="!canSubmit"
          @click="onSubmit"
        >
          Salva cliente
        </FzButton>
      </div>
    </div>
  </div>
</template>
```

**Router:** aggiungere in `src/router/index.ts`:

```ts
{ path: '/add-client', component: () => import('@/pages/frontoffice/AddClient.vue') }
```

> **Nota sulle prop dei componenti:** le prop qui usate (`:highlight`, `:error`, `variant`) sono indicative. In un contesto reale vanno verificate via Code Connect (se c'è un URL Figma) o via tipi TypeScript del package installato — vedi `implementation.md`.

---

## Note sul design

Questa soluzione applica i principi nei seguenti modi:

- **Essenzialità:** tre soli campi essenziali per il task base. Eventuali campi opzionali (email, telefono, indirizzo) sarebbero aggiunti in espansione solo se necessari — non tutti visibili subito.
- **Conversione:** CTA `Salva cliente` (verbo + oggetto specifico), con `aria-disabled`, affiancata dal button ghost `N campi da completare` che al click attiva lo stato Highlight sui campi mancanti. Sempre possibile tornare indietro senza perdere dati.
- **Empatia:** validazione on blur campo per campo. I campi non toccati restano in stato neutro. L'helptext di errore segue `microcopy.md` (problema + soluzione). Nessun toast per errori di validazione.
- **Guida:** ogni errore indica cosa fare ("Inserisci il nome del cliente per continuare" / "Il codice fiscale deve avere 16 caratteri — ne hai inseriti N").
- **Coerenza:** uso esclusivo di componenti `@fiscozen/*`; `environment="frontoffice"` su ogni componente; path del file rispetta la struttura `src/pages/frontoffice/`.
