<script setup lang="ts">
import { FzContainer } from '@fiscozen/container'
</script>

<template>
  <FzContainer gap="base" horizontal :main="true">
    <FzContainer alignItems="center" tag="aside">
      <slot name="sidebar" />
    </FzContainer>

    <FzContainer tag="main">
      <slot />
    </FzContainer>

    <FzContainer v-if="$slots.chat" tag="aside">
      <slot name="chat" />
    </FzContainer>
  </FzContainer>
</template>
