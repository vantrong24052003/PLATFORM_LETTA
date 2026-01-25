---
phase: implementation
title: Component Animation Documentation
description: Documentation for animation props and features in UI components
---

# Component Animation Documentation

## Overview

This document describes animation features and props available in UI components enhanced during the UI refactoring phase.

## Table of Contents

- [Button Component](#button-component)
- [Card Component](#card-component)
- [Accordion Component](#accordion-component)
- [Input Component](#input-component)
- [Common Components](#common-components)
- [Homepage Components](#homepage-components)
- [Tools Page Components](#tools-page-components)

---

## Button Component

### Animation Features

The Button component includes hover and active state animations with GPU acceleration.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loading` | `boolean` | `false` | Shows loading spinner with animation |
| `disabled` | `boolean` | `false` | Disables button and animations |

### Animation Behavior

- **Hover**: Scale to 1.02x with shadow enhancement
- **Active**: Scale to 0.98x for tactile feedback
- **Loading**: Spinner animation with `animate-spin`
- **Transition**: `transition-all duration-200`
- **GPU Acceleration**: `will-change-transform`

### Usage

```vue
<template>
  <Button 
    :loading="isLoading"
    :disabled="isDisabled"
    @click="handleClick"
  >
    Submit
  </Button>
</template>
```

### CSS Classes Applied

```css
transition-all duration-200
hover:scale-[1.02] hover:shadow-md
active:scale-[0.98]
will-change-transform
```

---

## Card Component

### Animation Features

The Card component includes subtle hover effects for better interactivity.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `class` | `string` | `undefined` | Additional CSS classes |

### Animation Behavior

- **Hover**: Scale to 1.01x with enhanced shadow
- **Transition**: `transition-all duration-300`
- **GPU Acceleration**: `will-change-transform`

### Usage

```vue
<template>
  <Card class="custom-card">
    <CardHeader>
      <CardTitle>Title</CardTitle>
    </CardHeader>
    <CardContent>
      Content
    </CardContent>
  </Card>
</template>
```

### CSS Classes Applied

```css
transition-all duration-300
hover:shadow-md hover:scale-[1.01]
will-change-transform
```

---

## Accordion Component

### Animation Features

The Accordion component includes smooth expand/collapse animations.

### Props

Standard Accordion props from Radix Vue.

### Animation Behavior

- **Expand/Collapse**: Smooth height transition (0.3s cubic-bezier)
- **Icon Rotation**: Chevron rotates 180° on expand
- **Hover**: Scale to 1.01x with background change
- **Active**: Scale to 0.99x for tactile feedback
- **Transition**: `transition-all duration-200`

### Usage

```vue
<template>
  <Accordion>
    <AccordionItem>
      <AccordionTrigger>
        Question
      </AccordionTrigger>
      <AccordionContent>
        Answer
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
```

### CSS Classes Applied

**AccordionTrigger:**
```css
transition-all duration-200
hover:scale-[1.01] hover:bg-muted/50
active:scale-[0.99]
will-change-transform
```

**AccordionContent:**
```css
data-[state=open]:animate-accordion-down
data-[state=closed]:animate-accordion-up
```

### Keyframes (tailwind.config.js)

```javascript
'accordion-down': 'accordion-down 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
'accordion-up': 'accordion-up 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
```

---

## Input Component

### Animation Features

The Input component includes focus animations for better UX.

### Props

Standard Input props from shadcn-vue.

### Animation Behavior

- **Focus**: Scale to 1.01x with enhanced shadow and ring
- **Transition**: `transition-all duration-200`
- **GPU Acceleration**: `will-change-transform`

### Usage

```vue
<template>
  <Input 
    v-model="value"
    placeholder="Enter text"
    type="text"
  />
</template>
```

### CSS Classes Applied

```css
transition-all duration-200
focus-visible:scale-[1.01] focus-visible:shadow-md
focus-visible:ring-ring/50 focus-visible:ring-[3px]
will-change-transform
```

---

## Common Components

### Header Component

**Animation Features:**
- Fade-in on page load (`useFadeIn`)
- Smooth menu transitions
- Hover effects on navigation items

**Composables Used:**
```typescript
const { elementRef: headerRef } = useFadeIn({ delay: 0 })
const { elementRef: navRef } = useHoverEffect({ scale: 1.05 })
```

### Footer Component

**Animation Features:**
- Fade-in on scroll (`useScrollReveal`)
- Subtle hover effects on links

**Composables Used:**
```typescript
const { target: footerRef } = useScrollReveal({ 
  animation: 'fade',
  threshold: 0.1 
})
```

### LoadingScreen Component

**Animation Features:**
- Progress bar animation
- Smooth fade transitions
- Loading spinner animation

### ScrollToTop Component

**Animation Features:**
- Smooth scroll behavior
- Hover effects
- Fade-in on scroll

**Composables Used:**
```typescript
const { elementRef } = useHoverEffect({ 
  scale: 1.1,
  translateY: -5 
})
```

---

## Homepage Components

### Hero Component

**Animation Features:**
- Parallax background effect (`useParallax`)
- Fade-in and slide-in animations for content (`useFadeIn`, `useSlideIn`)

**Composables Used:**
```typescript
const { offset: parallaxOffset } = useParallax({ speed: 0.3 })
const { elementRef: titleRef } = useFadeIn({ delay: 0 })
const { elementRef: subtitleRef } = useFadeIn({ delay: 200 })
```

### WhatWeDo Component

**Animation Features:**
- Scroll-reveal animations for header and content (`useScrollReveal`)
- Hover effects on cards

**Composables Used:**
```typescript
const { target: headerRef } = useScrollReveal({ 
  threshold: 0.1, 
  animation: 'fade' 
})
const { target: contentRef } = useScrollReveal({ 
  threshold: 0.1, 
  animation: 'slide', 
  direction: 'up' 
})
```

### AboutUs Component

**Animation Features:**
- Fade-in on scroll (`useScrollReveal`)
- Smooth transitions for content sections

**Composables Used:**
```typescript
const { target: aboutRef } = useScrollReveal({ 
  animation: 'fade',
  threshold: 0.2 
})
```

### Testimonials Component

**Animation Features:**
- Carousel/slide animations
- Fade-in animations for testimonial cards

**Composables Used:**
```typescript
const { elementRef: cardRef } = useFadeIn({ delay: 100 })
```

### FAQ Component

**Animation Features:**
- Smooth expand/collapse animations (via Accordion component)
- Enhanced accordion trigger animations

---

## Tools Page Components

### ToolsGrid Component

**Animation Features:**
- Card hover effects
- Scroll-reveal animations for cards

**Composables Used:**
```typescript
const { target: cardRef } = useScrollReveal({ 
  animation: 'slide',
  direction: 'up',
  threshold: 0.1 
})
const { elementRef: hoverRef } = useHoverEffect({ 
  scale: 1.05,
  translateY: -5 
})
```

### BenefitsSection Component

**Animation Features:**
- Fade-in on scroll (`useScrollReveal`)
- Smooth transitions for content

**Composables Used:**
```typescript
const { target: benefitsRef } = useScrollReveal({ 
  animation: 'fade',
  threshold: 0.2 
})
```

### ToolsCTA Component

**Animation Features:**
- Call-to-action animations
- Hover effects on buttons

---

## Animation Best Practices

### 1. Performance

- Use GPU-accelerated properties (`transform`, `opacity`)
- Apply `will-change-transform` sparingly
- Keep animation durations reasonable (200-800ms)
- Use `prefers-reduced-motion` support

### 2. Accessibility

- Always respect `prefers-reduced-motion`
- Ensure animations don't interfere with keyboard navigation
- Test with screen readers
- Provide instant state changes for reduced motion users

### 3. Consistency

- Use consistent animation durations
- Apply similar easing functions
- Maintain visual hierarchy
- Follow design system guidelines

### 4. User Experience

- Provide visual feedback for interactions
- Use subtle animations for better UX
- Avoid excessive animations
- Test on different devices

---

## Troubleshooting

### Animations not working

1. Check that composables are properly imported
2. Verify template refs are attached
3. Check browser console for errors
4. Verify `animejs` is properly installed

### Performance issues

1. Use `useAnimationPerformance` to monitor frame rates
2. Reduce animation complexity
3. Optimize for GPU acceleration
4. Test on low-end devices

### Accessibility issues

1. Ensure `respectReducedMotion` is enabled
2. Test with screen readers
3. Verify keyboard navigation works
4. Check color contrast during animations

---

## Related Documentation

- [Animation Composables Documentation](./animation-composables.md)
- [Implementation Guide](./refactor-ui.md)
- [Design Decisions](../design/refactor-ui.md)
- [Testing Guide](../testing/refactor-ui.md)
