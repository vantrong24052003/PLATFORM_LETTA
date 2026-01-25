import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { animate } from 'animejs'
import { splitText } from 'animejs/text'
import type { TextAnimationOptions } from '~/types/animations'
import { shouldSkipAnimation } from './helpers'

const getTextDirectionProps = (direction: string): Record<string, any> => {
  const distance = 30
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

export function useTextAnimation(options?: TextAnimationOptions) {
  const elementRef = ref<HTMLElement>()
  const isVisible = ref(false)
  const isAnimating = ref(false)
  let currentAnimation: ReturnType<typeof animate> | null = null
  let splitResult: ReturnType<typeof splitText> | null = null

  const duration = options?.duration ?? 1000
  const easing = options?.easing ?? 'easeOutExpo'
  const splitBy = options?.splitBy ?? 'words'
  const direction = options?.direction ?? 'up'
  const staggerDelay = options?.stagger ?? 50

  const start = async () => {
    if (shouldSkipAnimation(options?.respectReducedMotion)) {
      isVisible.value = true
      return
    }

    if (!elementRef.value) return

    await nextTick()

    try {
      splitResult = splitText(elementRef.value, { words: splitBy === 'words', chars: splitBy === 'chars' })

      const targets = splitBy === 'words' ? splitResult.words : splitResult.chars

      if (!targets || targets.length === 0) return

      isAnimating.value = true

      const animationProps = { opacity: [0, 1], ...getTextDirectionProps(direction) }

      currentAnimation = animate(targets, {
        ...animationProps,
        duration,
        easing,
        delay: (el: any, i: number) => i * staggerDelay,
        complete: () => {
          isAnimating.value = false
          isVisible.value = true
        },
      })
    } catch (error) {
      console.warn('Text animation failed:', error)
      isVisible.value = true
    }
  }

  const stop = () => {
    if (currentAnimation) {
      currentAnimation.revert()
      currentAnimation = null
    }
    if (splitResult) {
      splitResult.revert()
      splitResult = null
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
