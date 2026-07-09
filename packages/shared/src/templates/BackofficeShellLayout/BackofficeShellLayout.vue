<script setup lang="ts">
import { FzContainer } from '@fiscozen/container'
</script>

<template>
  <FzContainer gap="base" :main="true">
    <FzContainer v-if="$slots.header" tag="header">
      <slot name="header" />
    </FzContainer>

    <FzContainer alignItems="stretch" gap="base" horizontal layout="expand-last" :main="true">
      <FzContainer tag="aside">
        <slot name="sidebar" />
      </FzContainer>

      <FzContainer tag="main">
        <FzContainer v-if="$slots.breadcrumbs" tag="nav">
          <slot name="breadcrumbs" />
        </FzContainer>

        <slot />
      </FzContainer>
    </FzContainer>
  </FzContainer>
</template>
