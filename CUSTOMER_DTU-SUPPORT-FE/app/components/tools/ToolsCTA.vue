<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useScrollReveal } from '@/composables/animations/useScrollReveal'

const { t } = useI18n()

const { target: ctaRef } = useScrollReveal({ threshold: 0.1, animation: 'scale' })
</script>

<template>
  <section class="py-16 sm:py-20 md:py-24 bg-background">
    <div class="container mx-auto px-4 sm:px-6">
      <div class="max-w-4xl mx-auto">
        <div
          ref="ctaRef"
          class="bg-gradient-to-r from-primary to-primary rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 lg:p-16 text-center text-primary-foreground relative overflow-hidden hover:shadow-2xl transition-all duration-300"
        >
          <div class="absolute top-0 left-0 w-full h-full opacity-10">
            <div
              class="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"
            ></div>
            <div
              class="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"
              style="animation-delay: 1s"
            ></div>
          </div>
          <div class="relative z-10">
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 px-2">
              {{ t('tools.cta.title') }}
            </h2>
            <p class="text-base sm:text-lg md:text-xl lg:text-2xl opacity-90 max-w-2xl mx-auto px-4">
              {{ t('tools.cta.subtitle') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
