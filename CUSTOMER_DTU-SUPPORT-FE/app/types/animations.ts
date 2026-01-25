export interface AnimationConfig {
  duration: number
  easing: string
  delay?: number
  direction?: 'normal' | 'reverse' | 'alternate'
  respectReducedMotion: boolean
}

export interface VisualEffectConfig {
  type: 'particles' | 'gradient' | '3d' | 'none'
  intensity: 'low' | 'medium' | 'high'
  performance: 'auto' | 'high' | 'low'
}

export interface PerformanceMetrics {
  frameRate: number
  averageFrameTime: number
  droppedFrames: number
}

export interface PerformanceOptions {
  enabled?: boolean
  warningThreshold?: number
  onWarning?: (metrics: PerformanceMetrics) => void
}

export interface ParallaxOptions {
  speed?: number
  direction?: 'vertical' | 'horizontal'
  respectReducedMotion?: boolean
}

export interface HoverEffectOptions extends Partial<AnimationConfig> {
  scale?: number
  translateY?: number
  translateX?: number
  rotate?: number
}

export interface ScrollRevealOptions extends Omit<Partial<AnimationConfig>, 'direction'> {
  threshold?: number
  rootMargin?: string
  animation?: 'fade' | 'slide' | 'scale'
  direction?: 'up' | 'down' | 'left' | 'right'
}

export interface TextAnimationOptions extends Omit<Partial<AnimationConfig>, 'direction'> {
  splitBy?: 'words' | 'chars'
  stagger?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

export type SlideDirection = 'left' | 'right' | 'top' | 'bottom'

export interface SlideInOptions extends Partial<AnimationConfig> {
  direction?: SlideDirection
  distance?: number
}
