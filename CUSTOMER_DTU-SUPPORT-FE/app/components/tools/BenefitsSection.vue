<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useScrollReveal } from '@/composables/animations/useScrollReveal'

const { t } = useI18n()

const SCOPE = 'tools.benefits'

const { target: headerRef } = useScrollReveal({ threshold: 0.1, animation: 'fade' })
const { target: gridRef } = useScrollReveal({ threshold: 0.1, animation: 'slide', direction: 'up' })
</script>

<template>
  <section class="py-16 sm:py-20 md:py-24 bg-background">
    <div class="container mx-auto px-4 sm:px-6">
      <div ref="headerRef" class="text-center mb-10 sm:mb-12 md:mb-16">
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-4 sm:mb-6 px-2">
          {{ t(`${SCOPE}.titlePrefix`) }}
          <span class="text-primary">{{ t(`${SCOPE}.titlePrimary`) }}</span>
          {{ t(`${SCOPE}.titleSuffix`) }}
        </h2>
        <p
          class="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4"
        >
          {{ t('tools.benefits.subtitle') }}
        </p>
      </div>

      <div ref="gridRef" class="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        <div
          v-for="i in [0, 1, 2, 3, 4, 5]"
          :key="i"
          class="text-center p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-muted to-background hover:from-primary/5 hover:to-primary/10 transition-all duration-300 border border-border shadow-sm hover:shadow-lg hover:scale-[1.02] will-change-transform"
        >
          <div
            class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl bg-gradient-to-br from-primary/10 to-primary/20"
          >
            {{ t(`${SCOPE}.items.${i}.icon`) }}
          </div>
          <h3 class="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">
            {{ t(`${SCOPE}.items.${i}.title`) }}
          </h3>
          <p class="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {{ t(`${SCOPE}.items.${i}.description`) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
