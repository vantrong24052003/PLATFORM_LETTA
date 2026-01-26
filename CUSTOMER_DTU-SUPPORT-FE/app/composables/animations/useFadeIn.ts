import { ref, onMounted, onUnmounted } from 'vue'
import { animate } from 'animejs'
import type { AnimationConfig } from '~/types/animations'
import { shouldSkipAnimation, getDefaultAnimationConfig } from './helpers'

export function useFadeIn(options?: Partial<AnimationConfig>) {
  const elementRef = ref<HTMLElement>()
  const isVisible = ref(false)
  const isAnimating = ref(false)
  let currentAnimation: ReturnType<typeof animate> | null = null

  const config = getDefaultAnimationConfig()
  const duration = options?.duration ?? config.duration
  const easing = options?.easing ?? config.easing
  const delay = options?.delay ?? config.delay

  const start = () => {
    if (shouldSkipAnimation(options?.respectReducedMotion)) {
      isVisible.value = true
      return
    }

    if (!elementRef.value) return

    isAnimating.value = true
    currentAnimation = animate(elementRef.value, {
      opacity: [0, 1],
      translateY: [20, 0],
      duration,
      easing,
      delay,
      complete: () => {
        isAnimating.value = false
        isVisible.value = true
      },
    })
  }

  const stop = () => {
    if (currentAnimation) {
      currentAnimation.revert()
      currentAnimation = null
    }
    isAnimating.value = false
  }

  onMounted(() => { start() })
  onUnmounted(() => { stop() })

  return { elementRef, isVisible, isAnimating, start, stop }
}
