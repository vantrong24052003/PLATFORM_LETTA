import type { RouterScrollBehavior } from 'vue-router'

export default {
  scrollBehavior: ((to, from, savedPosition) => {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return false
  }) as RouterScrollBehavior,
}
