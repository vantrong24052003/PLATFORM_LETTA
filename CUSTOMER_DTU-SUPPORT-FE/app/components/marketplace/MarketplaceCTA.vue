<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import * as Icon from '@/components/ui/icon'

const { t } = useI18n()
const SCOPE = 'marketplace'

const steps = [
  { key: 'upload', icon: Icon.Upload },
  { key: 'review', icon: Icon.CheckCircle },
  { key: 'earn', icon: Icon.DollarSign },
]
</script>

<template>
  <div class="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border rounded-2xl p-6 sm:p-8 md:p-10 mt-8 sm:mt-12">
    <h2 class="text-2xl sm:text-3xl md:text-[30px] font-bold text-foreground mb-3 sm:mb-4 leading-[1.2em] text-center">
      {{ t(`${SCOPE}.cta.title`) }}
    </h2>
    <p class="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 leading-[1.5em] text-center max-w-2xl mx-auto">
      {{ t(`${SCOPE}.cta.description`) }}
    </p>

    <div class="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div
        v-for="(step, index) in steps"
        :key="step.key"
        class="flex flex-col items-center text-center"
      >
        <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/20 flex items-center justify-center mb-3 sm:mb-4">
          <component :is="step.icon" class="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
        </div>
        <h3 class="text-sm sm:text-base font-semibold text-foreground mb-2">
          {{ t(`${SCOPE}.cta.steps.${index}.title`) }}
        </h3>
        <p class="text-xs sm:text-sm text-muted-foreground leading-[1.5em]">
          {{ t(`${SCOPE}.cta.steps.${index}.description`) }}
        </p>
      </div>
    </div>

    <div class="flex justify-center">
      <Button class="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base font-semibold">
        {{ t(`${SCOPE}.cta.button`) }}
      </Button>
    </div>
  </div>
</template>
