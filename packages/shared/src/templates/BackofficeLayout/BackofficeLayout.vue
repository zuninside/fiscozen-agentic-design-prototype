<script setup lang="ts">
import { FzContainer } from '@fiscozen/container'
</script>

<template>
  <FzContainer gap="base" horizontal :main="true">
    <FzContainer tag="aside">
      <slot name="sidebar" />
    </FzContainer>

    <FzContainer tag="main">
      <slot />
    </FzContainer>
  </FzContainer>
</template>
