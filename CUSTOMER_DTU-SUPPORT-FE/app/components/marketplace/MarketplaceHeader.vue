<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const SCOPE = 'marketplace'
</script>

<template>
  <div class="mb-6 sm:mb-8">
    <h1 class="text-2xl sm:text-3xl md:text-[32px] font-black text-foreground mb-2 sm:mb-3 leading-[1.25em] tracking-[-0.015em]">
      {{ t(`${SCOPE}.header.title`) }}
    </h1>
    <p class="text-base sm:text-lg text-muted-foreground leading-[1.56em]">
      {{ t(`${SCOPE}.header.subtitle`) }}
    </p>
  </div>
</template>
