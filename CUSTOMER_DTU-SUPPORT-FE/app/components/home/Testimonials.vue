<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import * as Icon from '@/components/ui/icon'
import { useScrollReveal } from '@/composables/animations/useScrollReveal'

const { t } = useI18n()

const testimonials = computed(() => {
  const items = []
  for (let i = 0; i < 4; i++) {
    const ratingValue = t(`home.testimonials.items.${i}.rating`)
    items.push({
      name: t(`home.testimonials.items.${i}.name`),
      major: t(`home.testimonials.items.${i}.major`),
      year: t(`home.testimonials.items.${i}.year`),
      avatar: t(`home.testimonials.items.${i}.avatar`),
      content: t(`home.testimonials.items.${i}.content`),
      rating:
        typeof ratingValue === 'number'
          ? ratingValue
          : parseInt(ratingValue) || 5,
    })
  }
  return items
})

const { target: headerRef } = useScrollReveal({ threshold: 0.1, animation: 'fade' })
const { target: cardsRef } = useScrollReveal({ threshold: 0.1, animation: 'slide', direction: 'up' })
</script>

<template>
  <section
    id="testimonials"
    class="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden"
  >
    <div class="absolute top-0 left-0 w-full h-full">
      <div
        class="absolute top-10 right-10 w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full blur-xl"
      ></div>
      <div
        class="absolute bottom-10 left-10 w-20 h-20 sm:w-24 sm:h-24 bg-primary/10 rounded-full blur-2xl"
      ></div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 relative z-10">
      <div ref="headerRef" class="text-center mb-10 sm:mb-12 md:mb-16">
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-4 sm:mb-6 px-2">
          {{ t('home.testimonials.title') }}
        </h2>
        <p
          class="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4"
        >
          {{ t('home.testimonials.subtitle') }}
        </p>
      </div>

      <div ref="cardsRef" class="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="testimonial in testimonials"
          :key="testimonial.name"
          class="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-border hover:scale-105 will-change-transform"
        >
          <div class="flex items-center mb-3 sm:mb-4">
            <div class="text-2xl sm:text-3xl mr-2 sm:mr-3 flex-shrink-0">{{ testimonial.avatar }}</div>
            <div class="min-w-0 flex-1">
              <h4 class="text-sm sm:text-base font-bold text-card-foreground truncate">
                {{ testimonial.name }}
              </h4>
              <p class="text-xs sm:text-sm text-muted-foreground truncate">
                {{ testimonial.major }} - {{ testimonial.year }}
              </p>
            </div>
          </div>

          <div class="flex mb-2 sm:mb-3">
            <Icon.Star
              v-for="star in testimonial.rating"
              :key="star"
              class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
            />
          </div>

          <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 sm:line-clamp-none">
            "{{ testimonial.content }}"
          </p>
        </div>
      </div>

      <div class="text-center mt-8 sm:mt-10 md:mt-12">
        <div
          class="inline-flex items-center bg-primary/10 text-primary px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base"
        >
          <Icon.MessageCircle class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          <span class="font-semibold">{{
            t('home.testimonials.trustBadge')
          }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
