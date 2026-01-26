---
phase: implementation
title: Animation Style Guide
description: Style guide for animations in the DTU Support FE project
---

# Animation Style Guide

## Overview

This style guide provides guidelines and best practices for implementing animations in the DTU Support FE project. It covers animation principles, timing, easing, and accessibility considerations.

## Table of Contents

- [Animation Principles](#animation-principles)
- [Timing Guidelines](#timing-guidelines)
- [Easing Functions](#easing-functions)
- [Animation Types](#animation-types)
- [Accessibility](#accessibility)
- [Performance](#performance)
- [Code Standards](#code-standards)
- [Examples](#examples)

---

## Animation Principles

### 1. Purpose-Driven

Every animation should have a clear purpose:
- **Feedback**: Provide visual feedback for user actions
- **Guidance**: Guide user attention to important elements
- **Delight**: Enhance user experience without being distracting
- **Clarity**: Make state changes clear and understandable

### 2. Subtle and Refined

Animations should be subtle and refined:
- Avoid excessive or distracting animations
- Use animations to enhance, not dominate
- Maintain visual hierarchy
- Respect user preferences

### 3. Consistent

Maintain consistency across the application:
- Use consistent timing and easing
- Follow established patterns
- Maintain visual language
- Align with design system

### 4. Accessible

Ensure animations are accessible:
- Respect `prefers-reduced-motion`
- Don't rely solely on animations for information
- Ensure keyboard navigation works
- Test with screen readers

---

## Timing Guidelines

### Duration Standards

| Animation Type | Duration | Use Case |
|---------------|----------|----------|
| **Micro** | 100-200ms | Hover effects, active states, focus states |
| **Standard** | 200-400ms | Button interactions, card hovers, transitions |
| **Moderate** | 400-600ms | Page transitions, modal animations, slide-ins |
| **Extended** | 600-800ms | Complex animations, scroll reveals, fade-ins |

### Delay Guidelines

- **No delay**: Immediate feedback (buttons, hovers)
- **Short delay (100-200ms)**: Staggered animations, sequential reveals
- **Medium delay (200-400ms)**: Content reveals, page transitions
- **Avoid long delays**: Don't delay critical interactions

### Example Durations

```typescript
// Micro interactions
const hoverDuration = 200 // ms
const activeDuration = 150 // ms

// Standard interactions
const buttonTransition = 300 // ms
const cardHover = 300 // ms

// Moderate animations
const pageTransition = 500 // ms
const modalAnimation = 400 // ms

// Extended animations
const fadeIn = 800 // ms
const scrollReveal = 800 // ms
```

---

## Easing Functions

### Standard Easings

| Easing | Use Case | Description |
|--------|----------|-------------|
| `easeOutCubic` | Most animations | Smooth deceleration (default) |
| `easeInOutCubic` | Transitions | Smooth acceleration and deceleration |
| `easeOutQuad` | Quick animations | Fast deceleration |
| `easeInQuad` | Entrances | Fast acceleration |
| `linear` | Progress bars | Constant speed |

### When to Use Each

**easeOutCubic (Default):**
- Fade-ins
- Slide-ins
- Scale animations
- Most UI animations

**easeInOutCubic:**
- Page transitions
- Modal animations
- Complex sequences

**easeOutQuad:**
- Quick feedback
- Hover effects
- Active states

**easeInQuad:**
- Entrances
- Reveals
- Initial animations

**linear:**
- Progress indicators
- Loading animations
- Continuous animations

### Code Examples

```typescript
// Default easing
const { elementRef } = useFadeIn({
  duration: 800,
  easing: 'easeOutCubic', // Default
})

// Quick animation
const { elementRef } = useHoverEffect({
  duration: 200,
  easing: 'easeOutQuad',
})

// Smooth transition
const { elementRef } = useSlideIn({
  duration: 500,
  easing: 'easeInOutCubic',
})
```

---

## Animation Types

### 1. Fade Animations

**Use for:**
- Content reveals
- Page transitions
- Modal appearances
- Loading states

**Implementation:**
```typescript
const { elementRef } = useFadeIn({
  duration: 800,
  easing: 'easeOutCubic',
  delay: 0,
})
```

**CSS Alternative:**
```css
.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}
```

### 2. Slide Animations

**Use for:**
- Content reveals
- Menu transitions
- Card entrances
- List items

**Implementation:**
```typescript
const { elementRef } = useSlideIn({
  direction: 'up',
  distance: 50,
  duration: 800,
  easing: 'easeOutCubic',
})
```

**CSS Alternative:**
```css
.animate-slide-in-up {
  animation: slide-in-up 0.6s ease-out;
}
```

### 3. Scale Animations

**Use for:**
- Hover effects
- Active states
- Button interactions
- Card hovers

**Implementation:**
```typescript
const { elementRef } = useHoverEffect({
  scale: 1.05,
  duration: 300,
  easing: 'easeOutCubic',
})
```

**CSS Alternative:**
```css
.hover\:scale-105:hover {
  transform: scale(1.05);
  transition: transform 0.3s ease-out;
}
```

### 4. Parallax Effects

**Use for:**
- Hero sections
- Background elements
- Depth effects
- Scrolling experiences

**Implementation:**
```typescript
const { offset } = useParallax({
  speed: 0.5,
  direction: 'vertical',
})
```

### 5. Scroll Reveals

**Use for:**
- Content sections
- Cards
- Images
- Text blocks

**Implementation:**
```typescript
const { target } = useScrollReveal({
  animation: 'fade',
  direction: 'up',
  threshold: 0.1,
})
```

---

## Accessibility

### Prefers Reduced Motion

Always respect `prefers-reduced-motion`:

```typescript
const { elementRef } = useFadeIn({
  respectReducedMotion: true, // Default: true
})
```

**CSS Implementation:**
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Keyboard Navigation

Ensure animations don't interfere with keyboard navigation:
- Test with Tab key
- Verify focus states are visible
- Ensure animations don't block keyboard events
- Test with screen readers

### Screen Reader Support

- Don't rely solely on animations for information
- Provide text alternatives
- Ensure state changes are announced
- Test with NVDA, JAWS, VoiceOver

---

## Performance

### GPU Acceleration

Use GPU-accelerated properties:
- ✅ `transform` (translate, scale, rotate)
- ✅ `opacity`
- ❌ `width`, `height` (causes layout reflow)
- ❌ `top`, `left` (causes layout reflow)

**Example:**
```css
/* Good - GPU accelerated */
.element {
  transform: translateY(20px);
  opacity: 0.5;
  will-change: transform;
}

/* Bad - Layout reflow */
.element {
  top: 20px;
  width: 200px;
}
```

### Will-Change

Use `will-change` sparingly:
- Only for elements that will animate
- Remove after animation completes
- Don't apply to many elements

**Example:**
```css
.card {
  will-change: transform;
  transition: transform 0.3s ease-out;
}

.card:hover {
  transform: scale(1.05);
}
```

### Performance Monitoring

Use `useAnimationPerformance` to monitor frame rates:

```typescript
const { metrics, start } = useAnimationPerformance({
  enabled: import.meta.dev,
  warningThreshold: 30,
  onWarning: (metrics) => {
    console.warn('Low FPS:', metrics.frameRate)
  },
})
```

---

## Code Standards

### Naming Conventions

**Composables:**
- `use[AnimationName].ts` (e.g., `useFadeIn.ts`)
- `use[EffectName].ts` (e.g., `useHoverEffect.ts`)

**CSS Classes:**
- `animate-[effect]` (e.g., `animate-fade-in`)
- `hover:[effect]` (e.g., `hover:scale-105`)

**Variables:**
- `elementRef` for template refs
- `isVisible` for visibility state
- `isAnimating` for animation state

### Code Organization

**Composable Structure:**
```typescript
export function useAnimationName(options?: Options) {
  // 1. Refs
  const elementRef = ref<HTMLElement>()
  const isVisible = ref(false)
  const isAnimating = ref(false)
  
  // 2. Prefers reduced motion check
  const prefersReducedMotion = getPrefersReducedMotion()
  
  // 3. Animation logic
  const start = () => {
    // Animation code
  }
  
  // 4. Lifecycle hooks
  onMounted(() => {
    start()
  })
  
  // 5. Return
  return { elementRef, isVisible, isAnimating, start, stop }
}
```

### TypeScript Types

Always use TypeScript types:

```typescript
interface AnimationConfig {
  duration: number
  easing: string
  delay?: number
  respectReducedMotion: boolean
}

export function useFadeIn(options?: Partial<AnimationConfig>) {
  // Implementation
}
```

---

## Examples

### Example 1: Button Hover

```vue
<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <Button class="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
    Click me
  </Button>
</template>
```

### Example 2: Card with Scroll Reveal

```vue
<script setup lang="ts">
import { useScrollReveal } from '@/composables/animations/useScrollReveal'
import { Card } from '@/components/ui/card'

const { target } = useScrollReveal({
  animation: 'slide',
  direction: 'up',
  threshold: 0.1,
})
</script>

<template>
  <Card ref="target">
    Content reveals on scroll
  </Card>
</template>
```

### Example 3: Hero with Parallax

```vue
<script setup lang="ts">
import { useParallax } from '@/composables/animations/useParallax'
import { useFadeIn } from '@/composables/animations/useFadeIn'

const { offset } = useParallax({ speed: 0.3 })
const { elementRef: titleRef } = useFadeIn({ delay: 0 })
const { elementRef: subtitleRef } = useFadeIn({ delay: 200 })
</script>

<template>
  <section class="hero">
    <div 
      class="hero-background"
      :style="{ transform: `translateY(${offset}px)` }"
    />
    <h1 ref="titleRef">Title</h1>
    <p ref="subtitleRef">Subtitle</p>
  </section>
</template>
```

---

## Checklist

### Before Implementing Animation

- [ ] Animation has a clear purpose
- [ ] Timing is appropriate (200-800ms)
- [ ] Easing function is suitable
- [ ] Respects `prefers-reduced-motion`
- [ ] Uses GPU-accelerated properties
- [ ] Performance is acceptable
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

### After Implementing Animation

- [ ] Tested on different devices
- [ ] Tested in different browsers
- [ ] Performance metrics acceptable
- [ ] Accessibility verified
- [ ] Code is documented
- [ ] Follows style guide

---

## Related Documentation

- [Animation Composables Documentation](./animation-composables.md)
- [Component Animation Documentation](./component-animations.md)
- [Implementation Guide](./refactor-ui.md)
- [Design Decisions](../design/refactor-ui.md)
