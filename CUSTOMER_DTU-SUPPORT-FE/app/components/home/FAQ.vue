<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Accordion from '@/components/ui/accordion/Accordion.vue'
import AccordionContent from '@/components/ui/accordion/AccordionContent.vue'
import AccordionItem from '@/components/ui/accordion/AccordionItem.vue'
import AccordionTrigger from '@/components/ui/accordion/AccordionTrigger.vue'
import { useScrollReveal } from '@/composables/animations/useScrollReveal'

const { t } = useI18n()

const SCOPE = 'home.faq'

const { target: headerRef } = useScrollReveal({ threshold: 0.1, animation: 'fade' })
const { target: accordionRef } = useScrollReveal({ threshold: 0.1, animation: 'slide', direction: 'up' })
</script>

<template>
  <section
    id="faq"
    class="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-muted to-background relative overflow-hidden"
  >
    <div class="absolute top-0 left-0 w-full h-full">
      <div
        class="absolute top-10 sm:top-20 right-10 sm:right-20 w-16 h-16 sm:w-24 sm:h-24 bg-primary/5 rounded-full blur-xl"
      ></div>
      <div
        class="absolute bottom-10 sm:bottom-20 left-10 sm:left-20 w-24 h-24 sm:w-32 sm:h-32 bg-primary/5 rounded-full blur-2xl"
      ></div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 relative z-10">
      <div ref="headerRef" class="text-center mb-10 sm:mb-12 md:mb-16">
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-4 sm:mb-6 px-2">
          {{ t(`${SCOPE}.title`) }}
        </h2>
        <p
          class="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4"
        >
          {{ t(`${SCOPE}.subtitle`) }}
        </p>
      </div>

      <div ref="accordionRef" class="max-w-4xl mx-auto">
        <Accordion type="single" collapsible class="space-y-3 sm:space-y-4">
          <AccordionItem
            v-for="index in [0, 1, 2, 3, 4]"
            :key="index"
            :value="`item-${index}`"
            class="bg-card rounded-xl sm:rounded-2xl shadow-lg border border-border overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <AccordionTrigger
              class="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 text-left hover:bg-muted transition-colors duration-300 [&[data-state=open]>svg]:rotate-180"
            >
              <h3
                class="text-sm sm:text-base md:text-lg font-bold text-card-foreground pr-3 sm:pr-4 group-hover:text-primary transition-colors duration-300"
              >
                {{ t(`${SCOPE}.items.${index}.question`) }}
              </h3>
            </AccordionTrigger>
            <AccordionContent class="px-4 sm:px-6 md:px-8 pb-4 sm:pb-5 md:pb-6 border-t border-border">
              <div class="pt-3 sm:pt-4">
                <p class="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  👉 {{ t(`${SCOPE}.items.${index}.answer`) }}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  </section>
</template>
