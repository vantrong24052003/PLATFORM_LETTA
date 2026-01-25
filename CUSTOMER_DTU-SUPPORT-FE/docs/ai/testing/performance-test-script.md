---
phase: testing
title: Performance Test Script
description: Scripts and commands for performance testing animations
---

# Performance Test Script

## Overview

This document provides scripts and commands for automated performance testing of animations.

## Lighthouse CLI

### Installation

```bash
npm install -g @lhci/cli
```

### Run Lighthouse Audit

```bash
# Build the project first
npm run build

# Start production server
npm run preview

# In another terminal, run Lighthouse
lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html
```

### Automated Lighthouse CI

Create `.lighthouserc.js`:

```javascript
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
```

Run:

```bash
lhci autorun
```

## Performance Monitoring Script

### Browser DevTools Script

```javascript
// Run in browser console to monitor frame rate
(function() {
  let lastTime = performance.now();
  let frameCount = 0;
  let fps = 0;
  
  function measureFPS() {
    frameCount++;
    const currentTime = performance.now();
    const delta = currentTime - lastTime;
    
    if (delta >= 1000) {
      fps = Math.round((frameCount * 1000) / delta);
      console.log(`FPS: ${fps}`);
      frameCount = 0;
      lastTime = currentTime;
    }
    
    requestAnimationFrame(measureFPS);
  }
  
  measureFPS();
})();
```

### Performance Test Page

Create `app/pages/test-performance.vue`:

```vue
<script setup lang="ts">
import { useAnimationPerformance } from '@/composables/animations/useAnimationPerformance'

const { metrics, start, stop } = useAnimationPerformance({
  enabled: true,
  warningThreshold: 30,
  onWarning: (m) => {
    console.warn('Low FPS detected:', m)
  },
})

onMounted(() => {
  start()
})

onUnmounted(() => {
  stop()
})
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Performance Monitor</h1>
    <div class="space-y-2">
      <div>Frame Rate: {{ metrics.frameRate }} fps</div>
      <div>Average Frame Time: {{ metrics.averageFrameTime }} ms</div>
      <div>Dropped Frames: {{ metrics.droppedFrames }}</div>
    </div>
  </div>
</template>
```

## Network Throttling Test

### Chrome DevTools

1. Open DevTools (F12)
2. Go to Network tab
3. Select throttling:
   - Fast 3G
   - Slow 3G
   - Offline

### Puppeteer Script

```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Throttle network
  await page.emulate({
    name: 'Slow 3G',
    userAgent: 'Mozilla/5.0...',
    viewport: { width: 1920, height: 1080 },
    connection: {
      downloadThroughput: 1.5 * 1024 * 1024 / 8,
      uploadThroughput: 750 * 1024 / 8,
      latency: 562.5,
    },
  });
  
  await page.goto('http://localhost:3000');
  
  // Measure performance
  const metrics = await page.metrics();
  console.log('Performance metrics:', metrics);
  
  await browser.close();
})();
```

## CPU Throttling Test

### Chrome DevTools

1. Open DevTools (F12)
2. Go to Performance tab
3. Click settings (gear icon)
4. Enable CPU throttling:
   - 4x slowdown
   - 6x slowdown

### Puppeteer Script

```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Throttle CPU
  const client = await page.target().createCDPSession();
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  
  await page.goto('http://localhost:3000');
  
  // Measure performance
  const metrics = await page.metrics();
  console.log('Performance metrics:', metrics);
  
  await browser.close();
})();
```

## Bundle Size Analysis

### Analyze Bundle

```bash
# Build with analysis
npm run build -- --analyze

# Or use webpack-bundle-analyzer
npx webpack-bundle-analyzer .output/public/_nuxt/*.js
```

### Check Animation Library Size

```bash
# Check animejs size
npm list animejs
du -sh node_modules/animejs

# Check total bundle size
du -sh .output/public/_nuxt
```

## Memory Leak Detection

### Chrome DevTools

1. Open DevTools (F12)
2. Go to Memory tab
3. Take heap snapshot
4. Interact with animations
5. Take another heap snapshot
6. Compare snapshots

### Puppeteer Script

```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000');
  
  // Take initial heap snapshot
  const initialHeap = await page.evaluate(() => {
    return performance.memory.usedJSHeapSize;
  });
  
  // Interact with animations
  await page.click('button');
  await page.waitForTimeout(1000);
  
  // Take final heap snapshot
  const finalHeap = await page.evaluate(() => {
    return performance.memory.usedJSHeapSize;
  });
  
  const memoryIncrease = finalHeap - initialHeap;
  console.log('Memory increase:', memoryIncrease, 'bytes');
  
  if (memoryIncrease > 10 * 1024 * 1024) {
    console.warn('Potential memory leak detected!');
  }
  
  await browser.close();
})();
```

## Automated Test Suite

### Jest/Vitest Setup

```typescript
// tests/animations/performance.test.ts
import { describe, it, expect } from 'vitest'
import { useAnimationPerformance } from '@/composables/animations/useAnimationPerformance'

describe('Animation Performance', () => {
  it('should maintain 30fps minimum', async () => {
    const { metrics, start } = useAnimationPerformance({
      enabled: true,
      warningThreshold: 30,
    })
    
    start()
    
    // Wait for metrics to stabilize
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    expect(metrics.value.frameRate).toBeGreaterThanOrEqual(30)
  })
})
```

## Related Documentation

- [Animation Testing Checklist](./animation-testing-checklist.md)
- [Testing Guide](./refactor-ui.md)
- [Performance Optimization](../planning/refactor-ui.md#phase-6-performance-optimization--testing)
