<template>
  <div class="min-h-dvh bg-background text-foreground">
    <LoadingScreen :is-loading="isLoading" :progress="progress" />

    <div v-show="!isLoading" class="transition-opacity duration-500">
      <Header />
      <Analytics />
      <NuxtPage />
      <ChatDock />
      <Footer />
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import LoadingScreen from '@/components/common/LoadingScreen.vue'
import ChatDock from '@/components/chat/ChatDock.vue'
import { useLoadingLogic } from '@/composables/common/useLoadingLogic'
import { useAuth } from '@/composables/auth'
import { useAuthStore } from '@/stores/auth'
import { Analytics } from '@vercel/analytics/nuxt'
import { useAnimationPerformance } from '@/composables/animations/useAnimationPerformance'

const { isLoading, progress, initLoading } = useLoadingLogic()

const { metrics, start: startPerformanceMonitoring } = useAnimationPerformance({
  enabled: import.meta.dev,
  warningThreshold: 30,
  onWarning: (metrics) => {
    if (import.meta.dev) {
      console.warn('[Animation Performance] Low frame rate detected:', metrics)
    }
  },
})

onMounted(() => {
  initLoading()
  const { getCurrentUser } = useAuth()
  const auth = useAuthStore()
  if (!(auth as unknown as { hasSessionChecked: boolean }).hasSessionChecked) {
    getCurrentUser()
  }

  if (import.meta.dev) {
    startPerformanceMonitoring()
  }
})
</script>
