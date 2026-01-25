export const getPrefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const shouldSkipAnimation = (respectReducedMotion?: boolean): boolean => {
  if (respectReducedMotion === false) return false
  return getPrefersReducedMotion()
}

export const getDefaultAnimationConfig = () => ({
  duration: 800,
  easing: 'easeOutCubic',
  delay: 0,
})
