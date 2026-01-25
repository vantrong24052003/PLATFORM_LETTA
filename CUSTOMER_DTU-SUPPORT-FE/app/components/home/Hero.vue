<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useNavigation } from '@/composables/common/useNavigation'
import { useIntersectionObserver } from '@vueuse/core'
import { Check, ArrowRight } from '@/components/ui/icon'
import heroImage from '@/assets/images/hero-student.jpg'
import heroBg from '@/assets/images/hero-bg.jpg'

const { t } = useI18n()
const { navigateTo, getLocalePath } = useNavigation()
const SCOPE = 'home.hero'
const ANIMATION_DELAY = 200, INTERSECTION_THRESHOLD = 0.2

const refs = {
  badge: ref<HTMLElement>(),
  title: ref<HTMLElement>(),
  features: ref<HTMLElement>(),
  image: ref<HTMLElement>()
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
  <section class="relative min-h-screen overflow-hidden">
    <!-- Premium background image -->
    <div class="absolute inset-0">
      <img
        :src="heroBg"
        alt="DTU University Background"
        class="w-full h-full object-cover"
      />
      <!-- Dark overlay for text readability -->
      <div class="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
      <!-- DTU brand color overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20"></div>

      <!-- Floating light particles -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-1/4 left-1/3 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
        <div class="absolute top-1/3 right-1/4 w-3 h-3 bg-primary/30 rounded-full animate-pulse" style="animation-delay: 1s;"></div>
        <div class="absolute bottom-1/3 left-1/2 w-2 h-2 bg-secondary/30 rounded-full animate-pulse" style="animation-delay: 2s;"></div>
        <div class="absolute top-1/2 right-1/3 w-4 h-4 bg-white/20 rounded-full animate-pulse" style="animation-delay: 3s;"></div>
      </div>
    </div>

    <div class="relative container mx-auto px-4 sm:px-6 py-20 sm:py-32">
      <div class="max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          <!-- Content -->
          <div class="order-2 lg:order-1 space-y-8">
            <!-- Badge -->
            <div :ref="refs.badge" class="inline-flex items-center gap-3 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-6 py-3 opacity-0 translate-y-4">
              <div class="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span class="text-white font-medium text-sm uppercase tracking-wider">{{ t(`${SCOPE}.badge`) }}</span>
              <div class="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            </div>

            <!-- Title -->
            <div :ref="refs.title" class="space-y-6 opacity-0 translate-y-8">
              <h1 class="text-5xl sm:text-6xl md:text-7xl font-black leading-tight">
                <span class="text-white">
                  {{ t(`${SCOPE}.title`) }}
                </span>
              </h1>
              <p class="text-xl md:text-2xl text-white/90 leading-relaxed max-w-xl">
                {{ t(`${SCOPE}.subtitle`) }}
              </p>
            </div>

            <!-- Features -->
            <div :ref="refs.features" class="space-y-6 opacity-0 translate-y-10">
              <div class="flex items-center space-x-4 group cursor-pointer">
                <div class="relative">
                  <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-all duration-300">
                    <Check class="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                </div>
                <span class="text-white font-medium group-hover:text-primary transition-colors">{{ t(`${SCOPE}.features.0`) }}</span>
              </div>

              <div class="flex items-center space-x-4 group cursor-pointer">
                <div class="relative">
                  <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-all duration-300">
                    <Check class="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                </div>
                <span class="text-white font-medium group-hover:text-primary transition-colors">{{ t(`${SCOPE}.features.1`) }}</span>
              </div>

              <div class="flex items-center space-x-4 group cursor-pointer">
                <div class="relative">
                  <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-all duration-300">
                    <Check class="w-6 h-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                </div>
                <span class="text-white font-medium group-hover:text-primary transition-colors">{{ t(`${SCOPE}.features.2`) }}</span>
              </div>
            </div>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 pt-8">
              <NuxtLink
                :to="getLocalePath('/tools')"
                class="group inline-flex items-center justify-center px-10 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-primary/25 text-lg"
              >
                {{ t(`${SCOPE}.primaryCta`) }}
                <ArrowRight class="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </NuxtLink>

              <NuxtLink
                :to="getLocalePath('/marketplace')"
                class="group inline-flex items-center justify-center px-10 py-4 bg-card/50 backdrop-blur-sm text-card-foreground font-bold rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-105 border border-border text-lg"
              >
                {{ t(`${SCOPE}.secondaryCta`) }}
                <ArrowRight class="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </NuxtLink>
            </div>
          </div>

          <!-- Image -->
          <div :ref="refs.image" class="order-1 lg:order-2 opacity-0 translate-x-8">
            <div class="relative">
              <!-- Glow effect -->
              <div class="absolute -inset-8 bg-primary/20 rounded-3xl blur-2xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>

              <!-- Main image container -->
              <div class="relative">
                <div class="aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl hover:shadow-primary/25 transition-all duration-300">
                  <img
                    :src="heroImage"
                    :alt="t(`${SCOPE}.heroImageAlt`)"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                <!-- Floating stats with enhanced effects -->
                <div class="absolute -top-6 -right-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl group hover:scale-110 transition-all duration-300">
                  <div class="text-3xl font-black text-white mb-2 group-hover:text-primary transition-colors">10K+</div>
                  <div class="text-sm text-white/90 font-medium uppercase tracking-wider">{{ t(`${SCOPE}.stat1Label`) }}</div>
                  <!-- Glowing effect -->
                  <div class="absolute -inset-2 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div class="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl group hover:scale-110 transition-all duration-300">
                  <div class="text-3xl font-black text-white mb-2 group-hover:text-secondary transition-colors">4.9</div>
                  <div class="text-sm text-white/90 font-medium uppercase tracking-wider">{{ t(`${SCOPE}.stat2Label`) }}</div>
                  <!-- Glowing effect -->
                  <div class="absolute -inset-2 bg-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
