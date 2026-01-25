---
phase: implementation
title: Animation Composables Documentation
description: Complete guide to using animation composables in the DTU Support FE project
---

# Animation Composables Documentation

## Overview

This document provides comprehensive documentation for all animation composables available in the DTU Support FE project. These composables provide reusable, performant, and accessible animation utilities built on top of `animejs` and Vue 3 Composition API.

## Table of Contents

- [useFadeIn](#usefadein)
- [useSlideIn](#useslidein)
- [useParallax](#useparallax)
- [useHoverEffect](#usehovereffect)
- [useScrollReveal](#usescrollreveal)
- [useAnimationPerformance](#useanimationperformance)
- [Common Patterns](#common-patterns)
- [Best Practices](#best-practices)

---

## useFadeIn

Fades in an element with optional vertical translation.

### Usage

```vue
<script setup lang="ts">
import { useFadeIn } from '@/composables/animations/useFadeIn'

const { elementRef, isVisible, isAnimating, start, stop } = useFadeIn({
  duration: 800,
  easing: 'easeOutCubic',
  delay: 0,
  respectReducedMotion: true,
})
</script>

<template>
  <div ref="elementRef">
    Content that fades in
  </div>
</template>
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `duration` | `number` | `800` | Animation duration in milliseconds |
| `easing` | `string` | `'easeOutCubic'` | Easing function (animejs easing) |
| `delay` | `number` | `0` | Delay before animation starts (ms) |
| `respectReducedMotion` | `boolean` | `true` | Respect `prefers-reduced-motion` |

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `elementRef` | `Ref<HTMLElement>` | Template ref to attach to element |
| `isVisible` | `Ref<boolean>` | Whether element is visible after animation |
| `isAnimating` | `Ref<boolean>` | Whether animation is currently running |
| `start` | `() => void` | Manually start animation |
| `stop` | `() => void` | Stop and revert animation |

### Example

```vue
<script setup lang="ts">
const { elementRef } = useFadeIn({ delay: 200 })
</script>

<template>
  <h1 ref="elementRef">Welcome</h1>
</template>
```

---

## useSlideIn

Slides an element in from a specified direction.

### Usage

```vue
<script setup lang="ts">
import { useSlideIn } from '@/composables/animations/useSlideIn'

const { elementRef, isVisible, isAnimating, start, stop } = useSlideIn({
  direction: 'bottom',
  distance: 50,
  duration: 800,
  easing: 'easeOutCubic',
  delay: 0,
  respectReducedMotion: true,
})
</script>

<template>
  <div ref="elementRef">
    Content that slides in
  </div>
</template>
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `direction` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'bottom'` | Slide direction |
| `distance` | `number` | `50` | Distance to slide (px) |
| `duration` | `number` | `800` | Animation duration (ms) |
| `easing` | `string` | `'easeOutCubic'` | Easing function |
| `delay` | `number` | `0` | Delay before animation (ms) |
| `respectReducedMotion` | `boolean` | `true` | Respect reduced motion |

### Returns

Same as `useFadeIn` (elementRef, isVisible, isAnimating, start, stop)

### Example

```vue
<script setup lang="ts">
const { elementRef } = useSlideIn({ direction: 'left', distance: 100 })
</script>

<template>
  <div ref="elementRef" class="card">
    Card slides in from left
  </div>
</template>
```

---

## useParallax

Creates a parallax scrolling effect.

### Usage

```vue
<script setup lang="ts">
import { useParallax } from '@/composables/animations/useParallax'

const { offset } = useParallax({
  speed: 0.5,
  direction: 'vertical',
  respectReducedMotion: true,
})
</script>

<template>
  <div :style="{ transform: `translateY(${offset}px)` }">
    Parallax background
  </div>
</template>
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `speed` | `number` | `0.5` | Parallax speed multiplier (0-1) |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | Parallax direction |
| `respectReducedMotion` | `boolean` | `true` | Respect reduced motion |

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `offset` | `Ref<number>` | Current parallax offset in pixels |

### Example

```vue
<script setup lang="ts">
const { offset } = useParallax({ speed: 0.3 })
</script>

<template>
  <section class="hero">
    <div 
      class="hero-background"
      :style="{ transform: `translateY(${offset}px)` }"
    >
      Background with parallax
    </div>
  </section>
</template>
```

---

## useHoverEffect

Adds smooth hover animations to elements.

### Usage

```vue
<script setup lang="ts">
import { useHoverEffect } from '@/composables/animations/useHoverEffect'

const { elementRef, isHovered, isAnimating } = useHoverEffect({
  scale: 1.05,
  translateY: -5,
  translateX: 0,
  rotate: 0,
  duration: 300,
  easing: 'easeOutCubic',
  respectReducedMotion: true,
})
</script>

<template>
  <div ref="elementRef" class="card">
    Hover me
  </div>
</template>
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `scale` | `number` | `1.05` | Scale multiplier on hover |
| `translateY` | `number` | `-5` | Vertical translation on hover (px) |
| `translateX` | `number` | `0` | Horizontal translation on hover (px) |
| `rotate` | `number` | `0` | Rotation on hover (degrees) |
| `duration` | `number` | `300` | Animation duration (ms) |
| `easing` | `string` | `'easeOutCubic'` | Easing function |
| `respectReducedMotion` | `boolean` | `true` | Respect reduced motion |

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `elementRef` | `Ref<HTMLElement>` | Template ref to attach to element |
| `isHovered` | `Ref<boolean>` | Whether element is currently hovered |
| `isAnimating` | `Ref<boolean>` | Whether animation is running |

### Example

```vue
<script setup lang="ts">
const { elementRef } = useHoverEffect({ 
  scale: 1.1, 
  translateY: -10 
})
</script>

<template>
  <Card ref="elementRef">
    Hover to see effect
  </Card>
</template>
```

---

## useScrollReveal

Reveals elements when they enter the viewport.

### Usage

```vue
<script setup lang="ts">
import { useScrollReveal } from '@/composables/animations/useScrollReveal'

const { target, isVisible, isAnimating } = useScrollReveal({
  threshold: 0.1,
  rootMargin: '0px',
  animation: 'fade',
  direction: 'up',
  duration: 800,
  easing: 'easeOutCubic',
  delay: 0,
  respectReducedMotion: true,
})
</script>

<template>
  <div ref="target">
    Reveals when scrolled into view
  </div>
</template>
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `threshold` | `number` | `0.1` | Intersection threshold (0-1) |
| `rootMargin` | `string` | `'0px'` | Root margin for intersection observer |
| `animation` | `'fade' \| 'slide' \| 'scale'` | `'fade'` | Animation type |
| `direction` | `'up' \| 'down' \| 'left' \| 'right'` | `'up'` | Slide direction (if animation is 'slide') |
| `duration` | `number` | `800` | Animation duration (ms) |
| `easing` | `string` | `'easeOutCubic'` | Easing function |
| `delay` | `number` | `0` | Delay before animation (ms) |
| `respectReducedMotion` | `boolean` | `true` | Respect reduced motion |

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `target` | `Ref<HTMLElement>` | Template ref to attach to element |
| `isVisible` | `Ref<boolean>` | Whether element is visible |
| `isAnimating` | `Ref<boolean>` | Whether animation is running |

### Example

```vue
<script setup lang="ts">
const { target } = useScrollReveal({ 
  animation: 'slide', 
  direction: 'up',
  threshold: 0.2 
})
</script>

<template>
  <section ref="target">
    Content reveals on scroll
  </section>
</template>
```

---

## useAnimationPerformance

Monitors animation performance and frame rates.

### Usage

```vue
<script setup lang="ts">
import { useAnimationPerformance } from '@/composables/animations/useAnimationPerformance'

const { metrics, isMonitoring, start, stop } = useAnimationPerformance({
  enabled: true,
  warningThreshold: 30,
  onWarning: (metrics) => {
    console.warn('Low frame rate:', metrics)
  },
})
</script>

<template>
  <div>
    Frame Rate: {{ metrics.frameRate }} fps
    Average Frame Time: {{ metrics.averageFrameTime }} ms
    Dropped Frames: {{ metrics.droppedFrames }}
  </div>
</template>
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enable performance monitoring |
| `warningThreshold` | `number` | `30` | Frame rate threshold for warnings (fps) |
| `onWarning` | `(metrics: PerformanceMetrics) => void` | `undefined` | Callback when frame rate drops below threshold |

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `metrics` | `Readonly<Ref<PerformanceMetrics>>` | Current performance metrics |
| `isMonitoring` | `Readonly<Ref<boolean>>` | Whether monitoring is active |
| `start` | `() => void` | Start monitoring |
| `stop` | `() => void` | Stop monitoring |

### PerformanceMetrics

```typescript
interface PerformanceMetrics {
  frameRate: number        // Current frame rate (fps)
  averageFrameTime: number // Average frame time (ms)
  droppedFrames: number    // Number of dropped frames
}
```

### Example

```vue
<script setup lang="ts">
const { metrics, start } = useAnimationPerformance({
  enabled: import.meta.dev,
  warningThreshold: 30,
  onWarning: (m) => {
    if (import.meta.dev) {
      console.warn('[Performance] Low FPS:', m.frameRate)
    }
  },
})

onMounted(() => {
  if (import.meta.dev) {
    start()
  }
})
</script>
```

---

## Common Patterns

### Combining Multiple Animations

```vue
<script setup lang="ts">
import { useFadeIn } from '@/composables/animations/useFadeIn'
import { useScrollReveal } from '@/composables/animations/useScrollReveal'
import { useHoverEffect } from '@/composables/animations/useHoverEffect'

const { elementRef: titleRef } = useFadeIn({ delay: 0 })
const { elementRef: subtitleRef } = useFadeIn({ delay: 200 })
const { target: cardRef } = useScrollReveal({ animation: 'slide', direction: 'up' })
const { elementRef: hoverRef } = useHoverEffect({ scale: 1.05 })
</script>

<template>
  <div>
    <h1 ref="titleRef">Title</h1>
    <p ref="subtitleRef">Subtitle</p>
    <div ref="cardRef" class="card">
      <div ref="hoverRef">Hover me</div>
    </div>
  </div>
</template>
```

### Conditional Animations

```vue
<script setup lang="ts">
const shouldAnimate = ref(true)
const { elementRef } = useFadeIn({
  duration: shouldAnimate.value ? 800 : 0,
})
</script>
```

### Manual Control

```vue
<script setup lang="ts">
const { elementRef, start, stop } = useFadeIn()

const handleClick = () => {
  stop()
  setTimeout(() => {
    start()
  }, 100)
}
</script>
```

---

## Best Practices

### 1. Accessibility

Always respect `prefers-reduced-motion`:

```vue
<script setup lang="ts">
const { elementRef } = useFadeIn({
  respectReducedMotion: true, // Default: true
})
</script>
```

### 2. Performance

- Use GPU-accelerated properties (`transform`, `opacity`)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change-transform` sparingly
- Clean up animations on unmount

### 3. Timing

- Keep animation durations reasonable (200-800ms)
- Use appropriate easing functions
- Stagger animations for better UX

### 4. Code Organization

- Keep animation logic in composables
- Use TypeScript for type safety
- Document animation configs
- Create reusable presets

### 5. Testing

- Test with `prefers-reduced-motion` enabled
- Test on low-end devices
- Monitor frame rates during development
- Test in different browsers

---

## Troubleshooting

### Animation not working

1. Check that `elementRef` is properly attached
2. Verify element is mounted before animation starts
3. Check browser console for errors
4. Verify `animejs` is properly imported

### Performance issues

1. Use `useAnimationPerformance` to monitor frame rates
2. Reduce animation complexity
3. Use CSS animations for simple effects
4. Optimize for GPU acceleration

### Accessibility issues

1. Ensure `respectReducedMotion` is enabled
2. Test with screen readers
3. Verify keyboard navigation works
4. Check color contrast during animations

---

## Related Documentation

- [Implementation Guide](./refactor-ui.md)
- [Design Decisions](../design/refactor-ui.md)
- [Testing Guide](../testing/refactor-ui.md)
- [Planning Document](../planning/refactor-ui.md)
