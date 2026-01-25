import { ref, readonly, onMounted, onUnmounted } from 'vue'
import type { PerformanceMetrics, PerformanceOptions } from '~/types/animations'

export function useAnimationPerformance(options?: PerformanceOptions) {
  const metrics = ref<PerformanceMetrics>({ frameRate: 0, averageFrameTime: 0, droppedFrames: 0 })
  const isMonitoring = ref(false)
  const enabled = options?.enabled ?? true
  const warningThreshold = options?.warningThreshold ?? 30

  let frameCount = 0
  let lastTime = performance.now()
  let frameTimes: number[] = []
  let animationFrameId: number | null = null

  const measureFrame = (currentTime: number) => {
    if (!isMonitoring.value) return

    frameCount++
    const deltaTime = currentTime - lastTime
    frameTimes.push(deltaTime)

    if (frameTimes.length > 60) {
      frameTimes.shift()
    }

    const averageFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length
    const frameRate = 1000 / averageFrameTime
    const droppedFrames = frameTimes.filter((time) => time > 20).length

    metrics.value = { frameRate: Math.round(frameRate), averageFrameTime: Math.round(averageFrameTime * 100) / 100, droppedFrames }

    if (frameRate < warningThreshold && options?.onWarning) {
      options.onWarning(metrics.value)
    }

    lastTime = currentTime
    animationFrameId = requestAnimationFrame(measureFrame)
  }

  const start = () => {
    if (!enabled || isMonitoring.value) return

    isMonitoring.value = true
    frameCount = 0
    lastTime = performance.now()
    frameTimes = []
    animationFrameId = requestAnimationFrame(measureFrame)
  }

  const stop = () => {
    isMonitoring.value = false
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
  }

  onMounted(() => {
    if (enabled) {
      start()
    }
  })

  onUnmounted(() => {
    stop()
  })

  return { metrics: readonly(metrics), isMonitoring: readonly(isMonitoring), start, stop }
}
