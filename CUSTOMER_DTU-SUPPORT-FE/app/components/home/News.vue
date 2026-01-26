<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useIntersectionObserver } from '@vueuse/core'
import { ArrowRight } from '@/components/ui/icon'
import newsImage1 from '@/assets/images/news-1.jpg'
import newsImage2 from '@/assets/images/news-2.jpg'
import newsImage3 from '@/assets/images/news-3.jpg'

const { t } = useI18n()
const SCOPE = 'home.news'
const ANIMATION_DELAY = 200, INTERSECTION_THRESHOLD = 0.2

const newsImages = [newsImage1, newsImage2, newsImage3]
const newsItems = [0, 1, 2]

const refs = {
  header: ref<HTMLElement>(),
  cards: ref<HTMLElement>()
}

Object.entries(refs).forEach(([key, ref], index) => {
  useIntersectionObserver(
    ref,
    (entries) => {
      const [entry] = entries
      if (entry?.isIntersecting) {
        setTimeout(() => {
          ref.value?.classList.add('animate-in')
        }, index * ANIMATION_DELAY)
      }
    },
    { threshold: INTERSECTION_THRESHOLD }
  )
})

</script>

<template>
  <section id="news" class="relative py-20 sm:py-32 overflow-hidden">
    <!-- Premium animated background -->
    <div class="absolute inset-0">
      <div class="absolute inset-0 bg-gradient-to-br from-background via-muted to-background"></div>
      <div class="absolute top-1/3 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/3 right-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 1.8s;"></div>
    </div>

    <div class="relative container mx-auto px-4 sm:px-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div :ref="refs.header" class="text-center mb-20 opacity-0 translate-y-8">
          <!-- Badge -->
          <div class="inline-flex items-center gap-3 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-6 py-3 mb-8">
            <div class="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span class="text-primary font-medium text-sm uppercase tracking-wider">{{ t(`${SCOPE}.badge`) || 'Latest Updates' }}</span>
            <div class="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          </div>

          <!-- Title -->
          <h2 class="text-4xl sm:text-5xl md:text-6xl font-black mb-6">
            <span class="text-primary">
              {{ t(`${SCOPE}.title`) }}
            </span>
          </h2>
        </div>

        <!-- News Grid -->
        <div :ref="refs.cards" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-0 translate-y-10">
          <div
            v-for="i in newsItems"
            :key="i"
            class="group cursor-pointer"
          >
            <div class="relative">
              <!-- Glow effect on hover -->
              <div class="absolute -inset-4 bg-primary/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <!-- Card -->
              <div class="relative bg-card/50 backdrop-blur-sm border border-border rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-300 group-hover:scale-105">
                <!-- Image container -->
                <div class="relative h-56 overflow-hidden">
                  <img
                    :src="newsImages[i]"
                    :alt="t(`${SCOPE}.items.${i}.title`)"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  <!-- Category badge overlay -->
                  <div class="absolute top-4 left-4">
                    <span class="inline-flex items-center px-4 py-2 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-bold rounded-full">
                      {{ t(`${SCOPE}.categories.${i}`) }}
                    </span>
                  </div>
                </div>

                <!-- Content -->
                <div class="p-8">
                  <h3 class="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-2">
                    {{ t(`${SCOPE}.items.${i}.title`) }}
                  </h3>

                  <p class="text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                    {{ t(`${SCOPE}.items.${i}.description`) }}
                  </p>

                  <!-- Read more link -->
                  <div class="flex items-center text-primary font-medium group">
                    <span class="mr-2">{{ t(`${SCOPE}.readMore`) || 'Read More' }}</span>
                    <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.animate-in {
  animation: dtu-fade-in-up 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes dtu-fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  60% {
    opacity: 0.8;
    transform: translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
