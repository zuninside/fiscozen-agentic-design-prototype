<script setup lang="ts">
import { useRouter } from 'vue-router'
import { FzIcon } from '@fiscozen/icons'
import { FzButton, FzIconButton } from '@fiscozen/button'
import { FzDivider } from '@fiscozen/divider'

// Layout-only skeleton: structural regions of the Backoffice
// "Registrazione contabile" page. Content is intentionally left as
// placeholders — this defines the shell, not the data.
const railIcons = ['briefcase', 'folder', 'credit-card', 'cart-shopping', 'calendar', 'circle-check', 'gear']

const router = useRouter()
const goHome = () => router.push({ name: 'progetti' })
</script>

<template>
  <div class="bo-layout">
    <!-- Left icon rail -->
    <nav class="bo-rail">
      <div class="bo-rail__logo">
        <FzIcon name="bars-staggered" size="lg" />
      </div>
      <button v-for="icon in railIcons" :key="icon" class="bo-rail__item" type="button">
        <FzIcon :name="icon" size="lg" />
      </button>
    </nav>

    <div class="bo-main">
      <!-- Header -->
      <header class="bo-header">
        <div class="bo-header__left">
          <FzIconButton iconName="chevron-left" variant="invisible" aria-label="Indietro" @click="goHome" />
          <h1 class="bo-header__title">Registrazione contabile</h1>
          <span class="bo-pill">Mario Rossi</span>
        </div>
        <div class="bo-header__actions">
          <FzButton label="Rifiuta" iconName="circle-xmark" variant="danger" environment="backoffice" />
          <FzButton label="Registra" iconName="circle-check" variant="success" environment="backoffice" />
        </div>
      </header>

      <!-- Three-column content -->
      <div class="bo-content">
        <!-- Column 1: list -->
        <section class="bo-list">
          <div class="bo-list__head">
            <span class="bo-list__title">Lista</span>
            <FzIconButton iconName="angles-left" variant="invisible" aria-label="Comprimi lista" />
          </div>
          <div class="bo-placeholder bo-placeholder--search">Ricerca</div>
          <div class="bo-tabs">
            <span class="bo-tabs__item bo-tabs__item--active">Da registrare</span>
            <span class="bo-tabs__item">Registrate</span>
            <span class="bo-tabs__item">Rifiutate</span>
          </div>
          <div class="bo-list__items">
            <div
              v-for="n in 5"
              :key="n"
              class="bo-list__card"
              :class="{ 'bo-list__card--active': n === 1 }"
            >
              <div class="bo-list__card-title">Elemento {{ n }}</div>
              <div class="bo-list__card-sub">Sottotitolo</div>
            </div>
          </div>
        </section>

        <!-- Column 2: document preview -->
        <section class="bo-doc">
          <div class="bo-doc__sheet">
            <FzIcon name="file-lines" size="xl" />
            <p>Anteprima documento</p>
          </div>
        </section>

        <!-- Column 3: form panel -->
        <aside class="bo-form">
          <div class="bo-placeholder bo-placeholder--banner">Registrazione automatica</div>
          <div class="bo-form__section">
            <div class="bo-form__section-title">Cliente</div>
            <div class="bo-placeholder">Dettaglio cliente</div>
          </div>
          <FzDivider />
          <div class="bo-form__section">
            <div class="bo-form__section-title">Fornitore</div>
            <div class="bo-placeholder">Dettaglio fornitore</div>
          </div>
          <FzDivider />
          <div class="bo-form__section">
            <div class="bo-form__section-title">Documento</div>
            <div class="bo-form__grid">
              <div v-for="n in 6" :key="n" class="bo-form__field">
                <div class="bo-form__label">Campo {{ n }}</div>
                <div class="bo-placeholder bo-placeholder--field">Valore</div>
              </div>
            </div>
          </div>
          <FzDivider />
          <div class="bo-form__section">
            <div class="bo-form__section-title">Voci di costo</div>
            <div class="bo-placeholder bo-placeholder--card">Voce di costo</div>
          </div>
        </aside>
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
  background: #ffffff;
}

/* Rail */
.bo-rail {
  width: 56px;
  flex-shrink: 0;
  border-right: 1px solid #e9edf0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
}
.bo-rail__logo {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5a6eff;
  margin-bottom: 8px;
}
.bo-rail__item {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 8px;
  color: #6e777e;
  cursor: pointer;
}
.bo-rail__item:hover {
  background: #ecf2fc;
  color: #5a6eff;
}

/* Main */
.bo-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
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
.bo-pill {
  font-size: 14px;
  color: #596167;
  background: #f7f6f3;
  border: 1px solid #e9edf0;
  border-radius: 999px;
  padding: 4px 12px;
}

/* Content */
.bo-content {
  flex: 1;
  display: flex;
  min-height: 0;
}

/* List column */
.bo-list {
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  overflow: hidden;
  border-right: 1px solid #e9edf0;
}
.bo-list__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.bo-list__title {
  font-size: 17px;
  font-weight: 600;
}
.bo-tabs {
  display: flex;
  gap: 16px;
  border-bottom: 1px solid #e9edf0;
}
.bo-tabs__item {
  font-size: 14px;
  color: #6e777e;
  padding-bottom: 8px;
  cursor: pointer;
}
.bo-tabs__item--active {
  color: #5a6eff;
  font-weight: 600;
  box-shadow: inset 0 -2px 0 #5a6eff;
}
.bo-list__items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}
.bo-list__card {
  border: 1px solid #e9edf0;
  border-radius: 8px;
  padding: 12px;
}
.bo-list__card--active {
  border-color: #5a6eff;
  box-shadow: 0 0 0 1px #5a6eff;
}
.bo-list__card-title {
  font-size: 16px;
  font-weight: 600;
}
.bo-list__card-sub {
  font-size: 14px;
  color: #6e777e;
}

/* Document column */
.bo-doc {
  flex: 1;
  min-width: 0;
  background: #f7f6f3;
  padding: 24px;
  overflow: auto;
  display: flex;
  justify-content: center;
}
.bo-doc__sheet {
  width: 100%;
  max-width: 720px;
  background: #ffffff;
  border: 1px solid #e9edf0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #9da9b2;
}

/* Form column */
.bo-form {
  width: 480px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  overflow-y: auto;
  border-left: 1px solid #e9edf0;
}
.bo-form__section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.bo-form__section-title {
  font-size: 16px;
  font-weight: 600;
}
.bo-form__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.bo-form__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.bo-form__label {
  font-size: 14px;
  color: #6e777e;
}

/* Placeholders */
.bo-placeholder {
  border: 1px dashed #d1dde6;
  border-radius: 8px;
  padding: 12px;
  color: #9da9b2;
  font-size: 14px;
  background: #ffffff;
}
.bo-placeholder--search {
  background: #f7f6f3;
}
.bo-placeholder--field {
  padding: 10px 12px;
}
.bo-placeholder--banner {
  background: #f8f4ff;
  border-color: #9074cc;
  color: #9074cc;
  padding: 16px;
}
.bo-placeholder--card {
  padding: 24px 12px;
}
</style>
