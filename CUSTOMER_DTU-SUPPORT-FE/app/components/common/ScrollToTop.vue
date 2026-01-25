<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Button } from '@/components/ui/button'
import * as Icon from '@/components/ui/icon'
import { useHoverEffect } from '@/composables/animations/useHoverEffect'

const isVisible = ref(false)
const { elementRef: buttonRef } = useHoverEffect({ scale: 1.1, translateY: -2 })

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

const toggleVisibility = () => {
  if (window.pageYOffset > 300) {
    isVisible.value = true
  } else {
    isVisible.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', toggleVisibility, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', toggleVisibility)
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform scale-0 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-0 opacity-0"
  >
    <Button
      v-if="isVisible"
      ref="buttonRef"
      as="button"
      size="icon"
      @click="scrollToTop"
      class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12"
      aria-label="Scroll to top"
    >
      <Icon.ChevronUp class="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
    </Button>
  </Transition>
</template>
