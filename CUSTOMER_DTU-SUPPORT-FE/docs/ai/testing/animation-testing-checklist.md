---
phase: testing
title: Animation Testing Checklist
description: Comprehensive testing checklist for animations in DTU Support FE
---

# Animation Testing Checklist

## Overview

This checklist provides a comprehensive guide for testing animations across different devices, browsers, and accessibility scenarios.

## Table of Contents

- [Device Testing](#device-testing)
- [Browser Testing](#browser-testing)
- [Performance Testing](#performance-testing)
- [Accessibility Testing](#accessibility-testing)
- [Visual Testing](#visual-testing)
- [Functional Testing](#functional-testing)

---

## Device Testing

### Low-End Devices

**Test on:**
- [ ] Android mid-range devices (e.g., Samsung Galaxy A series)
- [ ] Older iPhones (iPhone 8, iPhone SE)
- [ ] Tablets with lower specs
- [ ] Devices with 2GB RAM or less

**Check:**
- [ ] Animations run smoothly (30fps minimum)
- [ ] No jank or stuttering
- [ ] Page load time acceptable (< 3s)
- [ ] No memory leaks
- [ ] Battery usage acceptable
- [ ] Animations respect `prefers-reduced-motion`

**Test Scenarios:**
1. Navigate through all pages
2. Trigger all hover effects
3. Scroll through long pages
4. Open/close modals and accordions
5. Test parallax effects

### High-End Devices

**Test on:**
- [ ] Latest iPhones (iPhone 14/15)
- [ ] High-end Android devices (Samsung Galaxy S series)
- [ ] Desktop computers
- [ ] Tablets with high specs

**Check:**
- [ ] Animations run at 60fps
- [ ] Smooth transitions
- [ ] No performance issues
- [ ] All animations work as expected

---

## Browser Testing

### Chrome (Desktop & Mobile)

**Version:** Latest stable

**Test:**
- [ ] All animations work correctly
- [ ] Hover effects function properly
- [ ] Scroll reveals trigger correctly
- [ ] Parallax effects work smoothly
- [ ] Performance is acceptable
- [ ] No console errors

**Check:**
- [ ] DevTools Performance tab shows good metrics
- [ ] No memory leaks
- [ ] GPU acceleration working

### Firefox (Desktop & Mobile)

**Version:** Latest stable

**Test:**
- [ ] All animations work correctly
- [ ] CSS animations render properly
- [ ] JavaScript animations function
- [ ] Performance is acceptable
- [ ] No console errors

**Check:**
- [ ] Performance profiler shows good metrics
- [ ] No layout issues

### Safari (Desktop & iOS)

**Version:** Latest stable

**Test:**
- [ ] All animations work correctly
- [ ] CSS animations render properly
- [ ] JavaScript animations function
- [ ] Performance is acceptable
- [ ] No console errors
- [ ] Touch interactions work

**Check:**
- [ ] Web Inspector shows good metrics
- [ ] No iOS-specific issues

### Edge (Desktop)

**Version:** Latest stable

**Test:**
- [ ] All animations work correctly
- [ ] Performance is acceptable
- [ ] No console errors

---

## Performance Testing

### Lighthouse Audit

**Run Lighthouse audit and check:**

**Performance Score:**
- [ ] Score > 90
- [ ] First Contentful Paint (FCP) < 1.8s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] Time to Interactive (TTI) < 3.8s
- [ ] Total Blocking Time (TBT) < 200ms
- [ ] Speed Index < 3.4s

**Best Practices:**
- [ ] No console errors
- [ ] Images properly optimized
- [ ] No unused CSS
- [ ] No render-blocking resources

**Accessibility:**
- [ ] Score > 90
- [ ] Color contrast ratios meet WCAG AA
- [ ] ARIA labels present
- [ ] Keyboard navigation works

**SEO:**
- [ ] Score > 90
- [ ] Meta tags present
- [ ] Semantic HTML used

### Frame Rate Monitoring

**Use `useAnimationPerformance` composable:**

```typescript
const { metrics, start } = useAnimationPerformance({
  enabled: true,
  warningThreshold: 30,
  onWarning: (metrics) => {
    console.warn('Low FPS:', metrics)
  },
})
```

**Check:**
- [ ] Frame rate stays above 30fps on low-end devices
- [ ] Frame rate stays above 60fps on high-end devices
- [ ] No dropped frames during critical animations
- [ ] Average frame time < 16.67ms (60fps)

### Network Testing

**Test with different network conditions:**
- [ ] Fast 3G: Animations load and work
- [ ] Slow 3G: Animations still functional
- [ ] Offline: Graceful degradation

---

## Accessibility Testing

### Screen Readers

**Test with:**
- [ ] NVDA (Windows)
- [ ] JAWS (Windows)
- [ ] VoiceOver (macOS/iOS)
- [ ] TalkBack (Android)

**Check:**
- [ ] All content is announced
- [ ] Animations don't interfere with announcements
- [ ] State changes are announced
- [ ] Focus management works correctly
- [ ] Keyboard navigation works

### Keyboard Navigation

**Test:**
- [ ] Tab navigation works
- [ ] Focus indicators are visible
- [ ] Animations don't block keyboard events
- [ ] Enter/Space activate buttons
- [ ] Escape closes modals
- [ ] Arrow keys work in menus

### Prefers Reduced Motion

**Test:**
- [ ] Animations respect `prefers-reduced-motion: reduce`
- [ ] Content still accessible without animations
- [ ] State changes are instant
- [ ] No motion sickness triggers

**How to test:**
1. Enable reduced motion in OS settings
2. Refresh page
3. Verify animations are disabled or minimal
4. Verify all functionality still works

### Color Contrast

**Check:**
- [ ] Text meets WCAG AA contrast ratios (4.5:1)
- [ ] Large text meets WCAG AA (3:1)
- [ ] Interactive elements have sufficient contrast
- [ ] Focus indicators are visible

---

## Visual Testing

### Animation Timing

**Check:**
- [ ] Animations complete in expected time
- [ ] No animations are too fast or too slow
- [ ] Staggered animations have appropriate delays
- [ ] Transitions feel natural

### Animation Easing

**Check:**
- [ ] Easing functions feel natural
- [ ] No jarring starts or stops
- [ ] Animations feel smooth
- [ ] Consistent easing across similar animations

### Visual Consistency

**Check:**
- [ ] Similar animations use similar timing
- [ ] Consistent visual language
- [ ] No conflicting animations
- [ ] Animations enhance, not distract

### Responsive Design

**Test on:**
- [ ] Mobile (320px - 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (1024px+)
- [ ] Large screens (1920px+)

**Check:**
- [ ] Animations work on all screen sizes
- [ ] No layout shifts during animations
- [ ] Touch interactions work on mobile
- [ ] Hover effects work on desktop

---

## Functional Testing

### Component Animations

**Button Component:**
- [ ] Hover effect works
- [ ] Active state animation works
- [ ] Loading spinner animates
- [ ] Disabled state prevents animations

**Card Component:**
- [ ] Hover effect works
- [ ] Scale animation smooth
- [ ] Shadow enhancement works

**Accordion Component:**
- [ ] Expand/collapse animation smooth
- [ ] Icon rotation works
- [ ] Hover effect works
- [ ] Keyboard navigation works

**Input Component:**
- [ ] Focus animation works
- [ ] Scale animation smooth
- [ ] Ring animation works

### Page Animations

**Homepage:**
- [ ] Hero parallax works
- [ ] Fade-in animations trigger
- [ ] Scroll reveals work
- [ ] Hover effects work

**Tools Page:**
- [ ] Card animations work
- [ ] Scroll reveals work
- [ ] Hover effects work

### Common Components

**Header:**
- [ ] Fade-in on load works
- [ ] Menu transitions smooth
- [ ] Hover effects work

**Footer:**
- [ ] Fade-in on scroll works
- [ ] Hover effects work

**LoadingScreen:**
- [ ] Progress bar animates
- [ ] Fade transitions work

**ScrollToTop:**
- [ ] Smooth scroll works
- [ ] Hover effect works
- [ ] Fade-in on scroll works

---

## Test Scripts

### Automated Testing

**Create test scripts for:**
- [ ] Animation composables unit tests
- [ ] Component animation integration tests
- [ ] Performance monitoring tests
- [ ] Accessibility tests

### Manual Testing Checklist

**Print this checklist and test manually:**
1. [ ] Test all animations on low-end device
2. [ ] Test all animations on high-end device
3. [ ] Test in Chrome, Firefox, Safari, Edge
4. [ ] Test with screen reader
5. [ ] Test keyboard navigation
6. [ ] Test with reduced motion enabled
7. [ ] Run Lighthouse audit
8. [ ] Check frame rates
9. [ ] Test on different screen sizes
10. [ ] Verify all functionality works

---

## Performance Benchmarks

### Target Metrics

**Desktop:**
- Frame rate: 60fps
- FCP: < 1.8s
- LCP: < 2.5s
- CLS: < 0.1
- TTI: < 3.8s

**Mobile:**
- Frame rate: 30fps minimum
- FCP: < 2.5s
- LCP: < 3.0s
- CLS: < 0.1
- TTI: < 4.5s

### Monitoring

**Use:**
- [ ] Chrome DevTools Performance tab
- [ ] Lighthouse audit
- [ ] `useAnimationPerformance` composable
- [ ] Real User Monitoring (if available)

---

## Issue Tracking

### Bug Severity

**Critical:**
- Animation breaks page functionality
- Performance issues on all devices
- Accessibility violations

**High:**
- Performance issues on specific devices
- Animation doesn't work in specific browser
- Visual glitches

**Medium:**
- Animation timing feels off
- Minor visual inconsistencies
- Edge case issues

**Low:**
- Minor polish issues
- Preference-based improvements

### Reporting

**When reporting issues, include:**
- [ ] Device/browser information
- [ ] Steps to reproduce
- [ ] Expected behavior
- [ ] Actual behavior
- [ ] Screenshots/videos
- [ ] Performance metrics
- [ ] Console errors

---

## Related Documentation

- [Animation Composables Documentation](../implementation/animation-composables.md)
- [Component Animation Documentation](../implementation/component-animations.md)
- [Animation Style Guide](../implementation/animation-style-guide.md)
- [Testing Guide](./refactor-ui.md)
