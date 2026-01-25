<script setup lang="ts">
import logoDTU from '@/assets/images/logo-dtu.png'
import { useFadeIn } from '@/composables/animations/useFadeIn'

interface Props {
  isLoading: boolean
  progress?: number
}

withDefaults(defineProps<Props>(), {
  progress: 0
})

const { t } = useI18n()

const dotDelays = [0, 150, 300]
const { elementRef: logoRef } = useFadeIn({ delay: 100 })
const { elementRef: textRef } = useFadeIn({ delay: 200 })
const { elementRef: progressRef } = useFadeIn({ delay: 300 })
</script>

<template>
  <div v-if="isLoading"
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-sm">
    <div class="flex flex-col items-center space-y-6 p-8">
      <div ref="logoRef" class="relative">
        <div class="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
          <img :src="logoDTU" alt="DTU Logo" class="w-12 h-12 object-contain filter brightness-0 invert" />
        </div>
        <div class="absolute inset-0 w-20 h-20 border-2 border-primary/30 rounded-2xl animate-spin"></div>
        <div class="absolute inset-0 w-20 h-20 border-2 border-transparent border-t-primary rounded-2xl animate-spin"
          style="animation-duration: 0.8s;"></div>
      </div>

      <div ref="textRef" class="text-center space-y-2">
        <h2 class="text-2xl font-bold text-foreground">
          {{ t('common.loading.title') }}
        </h2>
        <p class="text-sm text-muted-foreground">
          {{ t('common.loading.subtitle') }}
        </p>
      </div>

      <div ref="progressRef" class="w-64 space-y-3">
        <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div class="h-full bg-primary rounded-full transition-all duration-500 ease-out will-change-transform"
            :style="{ width: `${progress}%` }"></div>
        </div>
        <div class="text-center">
          <span class="text-sm font-medium text-muted-foreground">
            {{ progress }}%
          </span>
        </div>
      </div>

      <div class="flex space-x-2">
        <div v-for="(delay, index) in dotDelays" :key="index" class="w-2 h-2 bg-primary rounded-full animate-bounce"
          :style="{ animationDelay: `${delay}ms` }"></div>
      </div>
    </div>
  </div>
</template>
