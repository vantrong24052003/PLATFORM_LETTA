<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useIntersectionObserver } from '@vueuse/core'
import { Calculator, GraduationCap, BookOpen, HelpCircle, ArrowRight } from '@/components/ui/icon'
import { useNavigation } from '@/composables/common/useNavigation'

const { t } = useI18n()
const { getLocalePath } = useNavigation()
const SCOPE = 'home.whatWeDo'
const ANIMATION_DELAY = 200, INTERSECTION_THRESHOLD = 0.2

const featureIcons = [Calculator, GraduationCap, BookOpen, HelpCircle]
const featureItems = [0, 1, 2, 3]

const refs = {
  header: ref<HTMLElement>(),
  features: ref<HTMLElement>(),
  cta: ref<HTMLElement>()
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
  <section id="what-we-do" class="relative py-20 sm:py-32 overflow-hidden">
    <!-- Premium animated background -->
    <div class="absolute inset-0">
      <div class="absolute inset-0 bg-gradient-to-br from-background via-primary/3 to-background"></div>
      <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,rgba(var(--primary),0.06),transparent_60%)]"></div>
      <div class="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_75%,rgba(var(--secondary),0.04),transparent_50%)]"></div>

      <!-- Floating elements -->
      <div class="absolute top-24 right-16 w-20 h-20 bg-primary/15 rounded-full blur-xl animate-float"></div>
      <div class="absolute bottom-32 left-20 w-28 h-28 bg-secondary/15 rounded-full blur-xl animate-float-delayed"></div>
      <div class="absolute top-1/3 right-1/3 w-16 h-16 bg-accent/10 rounded-full blur-xl animate-float"></div>
    </div>

    <div class="relative container mx-auto px-4 sm:px-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div :ref="refs.header" class="text-center mb-24 opacity-0 translate-y-8">
          <!-- Badge -->
          <div class="inline-flex items-center gap-3 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-6 py-3 mb-8">
            <div class="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span class="text-primary font-medium text-sm uppercase tracking-wider">{{ t(`${SCOPE}.badge`) }}</span>
            <div class="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          </div>

          <!-- Title -->
          <h2 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8">
            <span class="text-primary">
              {{ t(`${SCOPE}.title`) }}
            </span>
          </h2>

          <p class="text-lg sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {{ t(`${SCOPE}.subtitle`) }}
          </p>
        </div>

        <!-- Features Grid -->
        <div :ref="refs.features" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 opacity-0 translate-y-10">
          <div
            v-for="(Icon, i) in featureIcons"
            :key="i"
            class="group cursor-pointer transform transition-all duration-300 hover:scale-105"
            :style="{ animationDelay: `${i * 100}ms` }"
          >
            <div class="relative">
              <!-- Glow effect -->
              <div class="absolute -inset-6 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <!-- Premium Card -->
              <div class="relative bg-card/60 backdrop-blur-sm border border-border rounded-3xl p-8 hover:border-primary/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary/10">
                <!-- Icon Section -->
                <div class="relative mb-8">
                  <!-- Icon background with premium gradient -->
                  <div class="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-all duration-300 border border-border group-hover:border-primary/30">
                    <Icon class="w-12 h-12 text-primary" />
                  </div>

                  <!-- Floating status indicator -->
                  <div class="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center border-4 border-background">
                    <div class="w-2 h-2 bg-background rounded-full"></div>
                  </div>
                </div>

                <!-- Content -->
                <div class="text-center">
                  <h3 class="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {{ t(`${SCOPE}.features.${i}.title`) }}
                  </h3>
                  <p class="text-sm text-muted-foreground leading-relaxed mb-6">
                    {{ t(`${SCOPE}.features.${i}.description`) }}
                  </p>

                  <!-- CTA Link -->
                  <div class="flex items-center justify-center text-primary font-medium group-hover:text-primary/80 transition-colors cursor-pointer">
                    <span class="mr-2">{{ t(`${SCOPE}.learnMore`) }}</span>
                    <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom CTA Section -->
        <div :ref="refs.cta" class="mt-20 text-center opacity-0 translate-y-10">
          <div class="inline-flex items-center gap-6 bg-card/50 backdrop-blur-sm border border-border rounded-full px-8 py-4 group hover:scale-105 transition-transform duration-300">
            <div class="text-left">
              <div class="text-xl font-bold text-primary mb-1">{{ t(`${SCOPE}.readyTitle`) }}</div>
              <div class="text-sm text-muted-foreground">{{ t(`${SCOPE}.readySubtitle`) }}</div>
            </div>
            <NuxtLink
              :to="getLocalePath('/tools')"
              class="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-primary/25"
            >
              {{ t(`${SCOPE}.exploreButton`) }}
              <ArrowRight class="ml-2 w-4 h-4" />
            </NuxtLink>
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

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(1deg);
  }
  50% {
    transform: translateY(0px) rotate(0deg);
  }
  75% {
    transform: translateY(-10px) rotate(-1deg);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-15px) rotate(-1deg);
  }
  50% {
    transform: translateY(0px) rotate(0deg);
  }
  75% {
    transform: translateY(-25px) rotate(1deg);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
}
</style>
