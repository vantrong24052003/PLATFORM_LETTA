<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useIntersectionObserver } from '@vueuse/core'
import { Star, MessageCircle, ArrowRight } from '@/components/ui/icon'

const { t } = useI18n()
const SCOPE = 'home.about'
const ANIMATION_DELAY = 200, INTERSECTION_THRESHOLD = 0.2

const teamMembers = computed(() => {
  const members = []
  for (let i = 0; i < 8; i++) {
    members.push({
      name: t(`${SCOPE}.teamMembers.${i}.name`),
      role: t(`${SCOPE}.teamMembers.${i}.role`),
      avatar: t(`${SCOPE}.teamMembers.${i}.avatar`),
      description: t(`${SCOPE}.teamMembers.${i}.description`),
    })
  }
  return members
})

const stats = [
  { value: '10K+', label: t(`${SCOPE}.stats.0.label`), color: 'from-primary to-secondary' },
  { value: '4.9', label: t(`${SCOPE}.stats.1.label`), color: 'from-secondary to-primary' },
  { value: '50+', label: t(`${SCOPE}.stats.2.label`), color: 'from-primary to-accent' },
  { value: '24/7', label: t(`${SCOPE}.stats.3.label`), color: 'from-accent to-primary' }
]

const refs = {
  header: ref<HTMLElement>(),
  content: ref<HTMLElement>(),
  stats: ref<HTMLElement>(),
  team: ref<HTMLElement>(),
  teamMember1: ref<HTMLElement>(),
  teamMember2: ref<HTMLElement>(),
  teamMember3: ref<HTMLElement>(),
  teamMember4: ref<HTMLElement>(),
  cta: ref<HTMLElement>()
}

// Header animation
useIntersectionObserver(
  refs.header,
  (entries) => {
    const [entry] = entries
    if (entry?.isIntersecting) {
      refs.header.value?.classList.add('animate-in')
    }
  },
  { threshold: INTERSECTION_THRESHOLD }
)

// Content animation
useIntersectionObserver(
  refs.content,
  (entries) => {
    const [entry] = entries
    if (entry?.isIntersecting) {
      setTimeout(() => {
        refs.content.value?.classList.add('animate-in')
      }, 200)
    }
  },
  { threshold: INTERSECTION_THRESHOLD }
)

// Stats animation
useIntersectionObserver(
  refs.stats,
  (entries) => {
    const [entry] = entries
    if (entry?.isIntersecting) {
      setTimeout(() => {
        refs.stats.value?.classList.add('animate-in')
      }, 400)
    }
  },
  { threshold: INTERSECTION_THRESHOLD }
)

// Team section animation
useIntersectionObserver(
  refs.team,
  (entries) => {
    const [entry] = entries
    if (entry?.isIntersecting) {
      // Animate container first
      refs.team.value?.classList.add('animate-in')

      // Then animate individual team members with stagger
      const teamRefs = [refs.teamMember1, refs.teamMember2, refs.teamMember3, refs.teamMember4]
      teamRefs.forEach((ref, index) => {
        setTimeout(() => {
          ref.value?.classList.add('animate-in')
          ref.value?.classList.remove('opacity-0')
          ref.value?.classList.add('opacity-100')
        }, 600 + (index * 150))
      })
    }
  },
  { threshold: INTERSECTION_THRESHOLD }
)

// CTA animation
useIntersectionObserver(
  refs.cta,
  (entries) => {
    const [entry] = entries
    if (entry?.isIntersecting) {
      setTimeout(() => {
        refs.cta.value?.classList.add('animate-in')
        refs.cta.value?.classList.remove('opacity-0', 'translate-y-10')
        refs.cta.value?.classList.add('opacity-100', 'translate-y-0')
      }, 1200)
    }
  },
  { threshold: INTERSECTION_THRESHOLD }
)
</script>

<template>
  <section id="about-us" class="relative py-20 sm:py-32 overflow-hidden">
    <!-- Premium gradient background -->
    <div class="absolute inset-0 bg-gradient-to-br from-background via-primary/3 via-secondary/2 to-background"></div>

    <!-- Floating glassmorphism elements -->
    <div class="absolute inset-0">
      <div class="absolute top-20 left-20 w-48 h-48 bg-primary/10 backdrop-blur-md rounded-3xl animate-float"></div>
      <div class="absolute top-40 right-24 w-32 h-32 bg-secondary/10 backdrop-blur-md rounded-2xl animate-float-delayed"></div>
      <div class="absolute bottom-32 left-1/3 w-40 h-40 bg-accent/8 backdrop-blur-md rounded-3xl animate-float"></div>
      <div class="absolute bottom-20 right-1/4 w-36 h-36 bg-primary/8 backdrop-blur-md rounded-2xl animate-float" style="animation-delay: 1s;"></div>
    </div>

    <!-- Subtle geometric pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="w-full h-full" style="background-image: radial-gradient(circle at 25% 25%, rgba(var(--primary),0.08) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(var(--secondary),0.06) 0%, transparent 50%);"></div>
    </div>

    <!-- Light grid pattern -->
    <div class="absolute inset-0 opacity-3">
      <div class="w-full h-full" style="background-image: linear-gradient(rgba(var(--border),0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--border),0.1) 1px, transparent 1px); background-size: 60px 60px;"></div>
    </div>

    <div class="relative container mx-auto px-4 sm:px-6">
      <!-- Header -->
      <div :ref="refs.header" class="text-center mb-24 opacity-0 translate-y-8">
        <div class="inline-flex items-center gap-3 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-6 py-3 mb-8">
          <div class="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span class="text-primary font-medium text-sm uppercase tracking-wider">{{ t(`${SCOPE}.badge`) }}</span>
          <div class="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        </div>

        <h2 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8">
          <span class="text-primary">
            {{ t(`${SCOPE}.title`) }}
          </span>
        </h2>

        <p class="text-lg sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12">
          {{ t(`${SCOPE}.description`) }}
        </p>
      </div>

      <!-- Stats Section -->
      <div :ref="refs.stats" class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20 opacity-0 translate-y-10">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="relative group"
        >
          <div class="absolute -inset-2 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-lg"
               :class="stat.color"></div>
          <div class="relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-all duration-300 group-hover:scale-105">
            <div class="text-4xl lg:text-5xl font-black mb-2 text-primary"
                 >
              {{ stat.value }}
            </div>
            <div class="text-sm text-muted-foreground font-medium uppercase tracking-wider">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>

      <!-- Team Section -->
      <div :ref="refs.team" class="opacity-0 translate-y-10">
        <!-- Featured team members -->
        <div class="text-center mb-16">
          <h3 class="text-3xl lg:text-4xl font-bold mb-4">{{ t(`${SCOPE}.teamTitle`) }}</h3>
          <p class="text-muted-foreground text-lg">{{ t(`${SCOPE}.teamSubtitle`) }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <!-- Lead founders - featured with scroll reveal -->
          <div
            v-for="(member, index) in teamMembers.slice(0, 4)"
            :key="member.name"
            :class="[
              'group cursor-pointer opacity-0 transition-all duration-1000 ease-out',
              `team-member-${index + 1}`
            ]"
            :ref="index === 0 ? refs.teamMember1 : index === 1 ? refs.teamMember2 : index === 2 ? refs.teamMember3 : refs.teamMember4"
          >
            <div class="relative">
              <!-- Glow effect -->
              <div class="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <!-- Member card -->
              <div class="relative bg-card/60 backdrop-blur-sm border border-border rounded-3xl p-8 hover:border-primary/50 transition-all duration-300">
                <!-- Avatar -->
                <div class="relative mb-6 mx-auto w-32 h-32">
                  <div class="w-full h-full rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-border">
                    <span class="text-5xl">{{ member.avatar }}</span>
                  </div>
                  <!-- Status indicator -->
                  <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center border-4 border-background">
                    <div class="w-3 h-3 bg-background rounded-full"></div>
                  </div>
                </div>

                <!-- Member info -->
                <div class="text-center">
                  <h4 class="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {{ member.name }}
                  </h4>
                  <p class="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">
                    {{ member.role }}
                  </p>
                  <p class="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {{ member.description }}
                  </p>
                </div>

                <!-- Social links placeholder -->
                <div class="flex justify-center gap-3 mt-6">
                  <div class="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors cursor-pointer">
                    <Star class="w-4 h-4" />
                  </div>
                  <div class="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors cursor-pointer">
                    <MessageCircle class="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Extended team -->
        <div class="text-center mb-12">
          <h3 class="text-2xl lg:text-3xl font-bold mb-4">{{ t(`${SCOPE}.extendedTeamTitle`) }}</h3>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          <div
            v-for="(member, index) in teamMembers.slice(4)"
            :key="member.name"
            class="group cursor-pointer"
          >
            <div class="relative bg-card/40 backdrop-blur-sm border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 group-hover:scale-105 text-center">
              <div class="w-20 h-20 mx-auto rounded-xl bg-gradient-to-br from-primary/10 to-muted flex items-center justify-center mb-4 group-hover:from-primary/20 group-hover:to-secondary/10 transition-all duration-300">
                <span class="text-3xl">{{ member.avatar }}</span>
              </div>
              <h5 class="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors text-sm">
                {{ member.name }}
              </h5>
              <p class="text-xs text-primary font-medium mb-2">{{ member.role }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div :ref="refs.cta" class="mt-24 text-center opacity-0 translate-y-10">
        <div class="relative inline-flex items-center gap-8 bg-card/60 backdrop-blur-sm border border-border rounded-full px-12 py-8 group hover:scale-105 transition-transform duration-300">
          <div class="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div class="relative text-left">
            <div class="text-3xl font-black text-primary mb-2">
              {{ t(`${SCOPE}.ctaTitle`) }}
            </div>
            <div class="text-lg text-foreground opacity-80">{{ t(`${SCOPE}.ctaSubtitle`) }}</div>
          </div>
          <button class="relative inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-primary/25 text-lg">
            {{ t(`${SCOPE}.ctaButton`) }}
            <ArrowRight class="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.animate-in {
  animation: dtu-fade-in-up 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes dtu-fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  60% {
    opacity: 0.8;
    transform: translateY(-10px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Enhanced animations for team members */
.team-member-1 {
  transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
}

.team-member-1.animate-in {
  animation: slide-in-left 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.team-member-2 {
  transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
}

.team-member-2.animate-in {
  animation: slide-in-up 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.team-member-3 {
  transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
}

.team-member-3.animate-in {
  animation: slide-in-down 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.team-member-4 {
  transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
}

.team-member-4.animate-in {
  animation: slide-in-right 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes slide-in-left {
  0% {
    opacity: 0;
    transform: translateX(-60px) scale(0.9) rotateY(15deg);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1) rotateY(0);
  }
}

@keyframes slide-in-up {
  0% {
    opacity: 0;
    transform: translateY(60px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slide-in-down {
  0% {
    opacity: 0;
    transform: translateY(-60px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slide-in-right {
  0% {
    opacity: 0;
    transform: translateX(60px) scale(0.9) rotateY(-15deg);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1) rotateY(0);
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
