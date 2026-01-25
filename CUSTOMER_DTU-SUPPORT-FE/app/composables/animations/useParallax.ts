import { ref, onMounted, onUnmounted } from 'vue'
import { useWindowScroll } from '@vueuse/core'
import type { ParallaxOptions } from '~/types/animations'
import { shouldSkipAnimation } from './helpers'

export function useParallax(options?: ParallaxOptions) {
  const offset = ref(0)
  const { y, x } = useWindowScroll()
  const speed = options?.speed ?? 0.5
  const direction = options?.direction ?? 'vertical'

  const update = () => {
    if (shouldSkipAnimation(options?.respectReducedMotion)) {
      offset.value = 0
      return
    }

    if (direction === 'horizontal') {
      offset.value = x.value * speed
    } else {
      offset.value = y.value * speed
    }
  }

  onMounted(() => {
    update()
    window.addEventListener('scroll', update, { passive: true })
  })
  onUnmounted(() => { window.removeEventListener('scroll', update) })

  return { offset }
}
