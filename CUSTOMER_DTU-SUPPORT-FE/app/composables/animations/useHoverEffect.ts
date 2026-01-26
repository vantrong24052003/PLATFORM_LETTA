import { ref, onMounted, onUnmounted } from 'vue'
import { animate } from 'animejs'
import type { HoverEffectOptions } from '~/types/animations'
import { shouldSkipAnimation } from './helpers'

export function useHoverEffect(options?: HoverEffectOptions) {
  const elementRef = ref<HTMLElement>()
  const isHovered = ref(false)
  const isAnimating = ref(false)
  let currentAnimation: ReturnType<typeof animate> | null = null

  const duration = options?.duration ?? 300
  const easing = options?.easing ?? 'easeOutCubic'
  const scale = options?.scale ?? 1.05
  const translateY = options?.translateY ?? -5
  const translateX = options?.translateX ?? 0
  const rotate = options?.rotate ?? 0

  const runAnimation = (props: Record<string, any>) => {
    if (!elementRef.value) return

    isAnimating.value = true

    if (currentAnimation) {
      currentAnimation.revert()
    }

    currentAnimation = animate(elementRef.value, {
      ...props,
      duration,
      easing,
      complete: () => {
        isAnimating.value = false
      },
    })
  }

  const handleMouseEnter = () => {
    if (shouldSkipAnimation(options?.respectReducedMotion)) {
      isHovered.value = true
      return
    }

    isHovered.value = true
    runAnimation({ scale, translateY, translateX, rotate })
  }

  const handleMouseLeave = () => {
    if (shouldSkipAnimation(options?.respectReducedMotion)) {
      isHovered.value = false
      return
    }

    isHovered.value = false
    runAnimation({ scale: 1, translateY: 0, translateX: 0, rotate: 0 })
  }

  onMounted(() => {
    if (elementRef.value) {
      elementRef.value.addEventListener('mouseenter', handleMouseEnter)
      elementRef.value.addEventListener('mouseleave', handleMouseLeave)
    }
  })

  onUnmounted(() => {
    if (elementRef.value) {
      elementRef.value.removeEventListener('mouseenter', handleMouseEnter)
      elementRef.value.removeEventListener('mouseleave', handleMouseLeave)
      if (currentAnimation) {
        currentAnimation.revert()
        currentAnimation = null
      }
    }
  })

  return { elementRef, isHovered, isAnimating }
}
