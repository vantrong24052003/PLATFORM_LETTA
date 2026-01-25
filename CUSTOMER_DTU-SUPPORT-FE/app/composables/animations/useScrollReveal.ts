import { ref, onUnmounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { animate } from 'animejs'
import type { ScrollRevealOptions } from '~/types/animations'
import { shouldSkipAnimation, getDefaultAnimationConfig } from './helpers'

const getSlideAnimationProps = (direction: string) => {
  const distance = 50
  switch (direction) {
    case 'up':
      return { translateY: [distance, 0] }
    case 'down':
      return { translateY: [-distance, 0] }
    case 'left':
      return { translateX: [distance, 0] }
    case 'right':
      return { translateX: [-distance, 0] }
    default:
      return {}
  }
}

const getAnimationProps = (animationType: string, direction: string) => {
  const baseProps = { opacity: [0, 1] }

  if (animationType === 'slide') {
    return { ...baseProps, ...getSlideAnimationProps(direction) }
  }

  if (animationType === 'scale') {
    return { ...baseProps, scale: [0.8, 1] }
  }

  return baseProps
}

export function useScrollReveal(options?: ScrollRevealOptions) {
  const target = ref<HTMLElement>()
  const isVisible = ref(false)
  const isAnimating = ref(false)

  const config = getDefaultAnimationConfig()
  const duration = options?.duration ?? config.duration
  const easing = options?.easing ?? config.easing
  const delay = options?.delay ?? config.delay
  const animationType = options?.animation ?? 'fade'
  const direction = options?.direction ?? 'up'

  const doAnimate = () => {
    if (!target.value) return

    if (shouldSkipAnimation(options?.respectReducedMotion)) {
      isVisible.value = true
      return
    }

    isAnimating.value = true
    const animationProps = getAnimationProps(animationType, direction)

    animate(target.value, {
      ...animationProps,
      duration,
      easing,
      delay,
      complete: () => {
        isAnimating.value = false
        isVisible.value = true
      },
    })
  }

  const { stop } = useIntersectionObserver(
    target,
    (entries) => {
      const entry = entries[0]
      if (entry?.isIntersecting && !isVisible.value) {
        doAnimate()
        stop()
      }
    },
    { threshold: options?.threshold ?? 0.1, rootMargin: options?.rootMargin ?? '0px' }
  )

  onUnmounted(() => {
    stop()
  })

  return { target, isVisible, isAnimating }
}
