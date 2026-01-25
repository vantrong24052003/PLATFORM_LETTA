<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

interface Section {
  id: string
  label: string
}

const props = defineProps<{ sections: Section[] }>()

const refs = {
  activeSection: ref<string>(''),
  isScrolling: ref<boolean>(false),
  scrollTimeout: ref<NodeJS.Timeout | null>(null),
  scrollProgress: ref<{ [key: string]: number }>({})
}

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    refs.isScrolling.value = true

    if (refs.scrollTimeout.value) clearTimeout(refs.scrollTimeout.value)

    const HEADER_HEIGHT = 80
    const elementPosition = element.getBoundingClientRect().top + window.scrollY
    const offsetPosition = elementPosition - HEADER_HEIGHT

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })

    refs.scrollTimeout.value = setTimeout(() => {
      refs.isScrolling.value = false
    }, 1000)
  }
}

const setupSectionObservers = () => {
  props.sections.forEach((section) => {
    const element = document.getElementById(section.id)
    if (!element) return

    useIntersectionObserver(
      element,
      (entries) => {
        if (entries.length > 0) {
          const entry = entries[0]
          if (entry?.isIntersecting && !refs.isScrolling.value) {
            refs.activeSection.value = section.id
          }

          if (entry?.intersectionRatio !== undefined) {
            refs.scrollProgress.value[section.id] = entry.intersectionRatio * 100
          }
        }
      },
      { threshold: Array.from({ length: 101 }, (_, i) => i / 100) }
    )
  })
}

const handleScroll = () => {
  if (refs.isScrolling.value) return

  const SCROLL_POSITION = window.scrollY + window.innerHeight / 2
  let currentSection = ''

  props.sections.forEach((section) => {
    const element = document.getElementById(section.id)
    if (!element) return

    const ELEMENT_RECT = element.getBoundingClientRect()
    const ABSOLUTE_TOP = ELEMENT_RECT.top + window.scrollY
    const ELEMENT_HEIGHT = ELEMENT_RECT.height || 0

    if (SCROLL_POSITION >= ABSOLUTE_TOP && SCROLL_POSITION < ABSOLUTE_TOP + ELEMENT_HEIGHT) {
      currentSection = section.id

      const SECTION_START = ABSOLUTE_TOP
      const SECTION_END = ABSOLUTE_TOP + ELEMENT_HEIGHT
      const CURRENT_SCROLL = window.scrollY + window.innerHeight / 2
      const PROGRESS = Math.max(0, Math.min(100,
        ((CURRENT_SCROLL - SECTION_START) / (SECTION_END - SECTION_START)) * 100
      ))

      refs.scrollProgress.value[section.id] = PROGRESS
    }
  })

  if (currentSection && currentSection !== refs.activeSection.value) {
    refs.activeSection.value = currentSection
  }
}

const getProgressOffset = (sectionId: string) => {
  const progress = refs.scrollProgress.value[sectionId]
  return typeof progress === 'number' ? 88 - (progress * 0.88) : 88
}

onMounted(() => {
  if (props.sections.length > 0 && props.sections[0]) {
    refs.activeSection.value = props.sections[0].id
    props.sections.forEach(section => {
      refs.scrollProgress.value[section.id] = 0
    })
  }
  setupSectionObservers()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (refs.scrollTimeout.value) clearTimeout(refs.scrollTimeout.value)
})
</script>

<template>
  <div class="fixed left-8 top-1/2 z-50 hidden lg:block transform -translate-y-1/2">
    <!-- Enhanced background for better visibility -->
    <div class="relative bg-background/80 backdrop-blur-sm border border-border rounded-xl p-2 shadow-lg">
      <div class="absolute left-1/2 top-0 w-0.5 h-full bg-border transform -translate-x-1/2"></div>

      <div class="flex flex-col space-y-8 relative z-10">
        <button
          v-for="(section, index) in sections"
          :key="section.id"
          @click="scrollToSection(section.id)"
          class="group relative flex items-center justify-center w-8 h-8 transition-all duration-300 rounded-full"
          :class="{
            'scale-125 bg-primary/20 border-2 border-primary/50': refs.activeSection.value === section.id,
            'hover:bg-muted/50': refs.activeSection.value !== section.id
          }"
        >
          <!-- Center dot - always visible -->
          <div
            class="w-2 h-2 rounded-full transition-all duration-300 z-20"
            :class="{
              'bg-primary shadow-lg shadow-primary/30': refs.activeSection.value === section.id,
              'bg-muted hover:bg-primary': refs.activeSection.value !== section.id
            }"
          ></div>

          <!-- Progress ring for active section -->
          <svg
            v-if="refs.activeSection.value === section.id"
            class="absolute inset-0 w-8 h-8 transform -rotate-90"
            viewBox="0 0 32 32"
          >
            <!-- Background circle -->
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="currentColor"
              stroke-width="1"
              fill="none"
              class="text-muted opacity-30"
            ></circle>
            <!-- Progress circle -->
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-dasharray="88"
              :stroke-dashoffset="getProgressOffset(section.id)"
              class="text-primary transition-all duration-300"
              stroke-linecap="round"
            ></circle>
          </svg>

          <!-- Tooltip - always visible for active section -->
          <div
            class="absolute left-full ml-4 px-3 py-1 bg-card border border-border rounded-md text-foreground text-xs font-medium whitespace-nowrap transition-all duration-200 pointer-events-none shadow-sm"
            :class="{
              'opacity-100 scale-110 bg-primary text-primary-foreground border-primary': refs.activeSection.value === section.id,
              'opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100': refs.activeSection.value !== section.id
            }"
          >
            {{ section.label }}
          </div>

          <!-- Active section indicator -->
          <div
            v-if="refs.activeSection.value === section.id"
            class="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-primary rounded-full shadow-lg shadow-primary/50 animate-pulse"
          ></div>
        </button>
      </div>

      <!-- Current section label -->
      <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap shadow-lg">
        {{ sections.find(s => s.id === refs.activeSection.value)?.label || '' }}
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 1 }
  50% { transform: scale(1.2); opacity: 0.7 }
  100% { transform: scale(1); opacity: 1 }
}

.animate-pulse {
  animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.will-change-transform {
  will-change: transform;
}
</style>
