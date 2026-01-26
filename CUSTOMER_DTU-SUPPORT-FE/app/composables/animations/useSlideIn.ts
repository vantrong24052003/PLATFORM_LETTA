import { ref, onMounted, onUnmounted } from 'vue'
import { animate } from 'animejs'
import type { SlideInOptions, SlideDirection } from '~/types/animations'
import { shouldSkipAnimation, getDefaultAnimationConfig } from './helpers'

const getSlidePosition = (direction: SlideDirection, distance: number) => {
  switch (direction) {
    case 'left':
      return { translateX: [-distance, 0], translateY: 0 }
    case 'right':
      return { translateX: [distance, 0], translateY: 0 }
    case 'top':
      return { translateX: 0, translateY: [-distance, 0] }
    case 'bottom':
    default:
      return { translateX: 0, translateY: [distance, 0] }
  }
}

export function useSlideIn(options?: SlideInOptions) {
  const elementRef = ref<HTMLElement>()
  const isVisible = ref(false)
  const isAnimating = ref(false)
  let currentAnimation: ReturnType<typeof animate> | null = null

  const config = getDefaultAnimationConfig()
  const duration = options?.duration ?? config.duration
  const easing = options?.easing ?? config.easing
  const delay = options?.delay ?? config.delay
  const direction = options?.direction ?? 'bottom'
  const distance = options?.distance ?? 50

  const start = () => {
    if (shouldSkipAnimation(options?.respectReducedMotion)) {
      isVisible.value = true
      return
    }

    if (!elementRef.value) return

    isAnimating.value = true

    if (currentAnimation) {
      currentAnimation.revert()
    }

    const position = getSlidePosition(direction, distance)
    currentAnimation = animate(elementRef.value, {
      opacity: [0, 1],
      ...position,
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

  onMounted(() => {
    start()
  })

  onUnmounted(() => {
    stop()
  })

  return { elementRef, isVisible, isAnimating, start, stop }
}
