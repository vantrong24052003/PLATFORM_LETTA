<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import * as Icon from '@/components/ui/icon'
import { useNavigation } from '@/composables/common/useNavigation'
import { useScrollReveal } from '@/composables/animations/useScrollReveal'

const { t } = useI18n()
const { navigateTo } = useNavigation()

const SCOPE = 'tools.grid'

const { target: headerRef } = useScrollReveal({ threshold: 0.1, animation: 'fade' })
const { target: gridRef } = useScrollReveal({ threshold: 0.1, animation: 'slide', direction: 'up' })
</script>

<template>
  <section
    class="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-muted to-background relative overflow-hidden"
  >
    <div class="absolute top-0 left-0 w-full h-full">
      <div
        class="absolute top-10 right-10 w-16 h-16 sm:w-20 sm:h-20 bg-primary/5 rounded-full blur-xl"
      ></div>
      <div
        class="absolute bottom-10 sm:bottom-20 left-10 w-24 h-24 sm:w-32 sm:h-32 bg-primary/5 rounded-full blur-2xl"
      ></div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 relative z-10">
      <div ref="headerRef" class="text-center mb-10 sm:mb-12 md:mb-16">
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-4 sm:mb-6 px-2">
          {{ t(`${SCOPE}.titlePrefix`) }}
          <span class="text-primary">{{ t(`${SCOPE}.titlePrimary`) }}</span>
          {{ t(`${SCOPE}.titleSuffix`) }}
        </h2>
        <p
          class="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4"
        >
          {{ t('tools.grid.subtitle') }}
        </p>
      </div>

      <div ref="gridRef" class="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        <Card
          v-for="i in [0, 1, 2]"
          :key="i"
          class="relative overflow-hidden border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02] will-change-transform"
        >
          <!-- Coming Soon Badge -->
          <div
            v-if="t(`${SCOPE}.items.${i}.status`) === 'coming-soon'"
            class="absolute top-2 sm:top-4 right-2 sm:right-4 bg-orange-500 text-white text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full z-10"
          >
            {{ t('tools.grid.badgeComing') }}
          </div>

          <CardHeader class="p-4 sm:p-6">
            <!-- Icon -->
            <div class="flex items-center mb-3 sm:mb-4">
              <div
                class="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0"
              >
                <span class="text-xl sm:text-2xl text-white">{{
                  t(`${SCOPE}.items.${i}.icon`)
                }}</span>
              </div>
            </div>

            <CardTitle class="text-lg sm:text-xl font-bold text-foreground">
              {{ t(`${SCOPE}.items.${i}.title`) }}
            </CardTitle>

            <CardDescription class="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {{ t(`${SCOPE}.items.${i}.desc`) }}
            </CardDescription>
          </CardHeader>

          <CardContent class="p-4 sm:p-6 pt-0">
            <!-- Key Features -->
            <div class="mb-4 sm:mb-6">
              <div class="flex items-center mb-2 sm:mb-3">
                <Icon.Lightbulb class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500 mr-1.5 sm:mr-2 flex-shrink-0" />
                <h4 class="text-xs sm:text-sm font-semibold text-foreground">
                  {{ t(`${SCOPE}.featuresHeading`) }}
                </h4>
              </div>
              <ul class="space-y-1">
                <li
                  v-for="f in [0, 1, 2, 3, 4]"
                  :key="f"
                  class="text-xs text-muted-foreground flex items-start"
                >
                  <Icon.Circle class="w-1.5 h-1.5 sm:w-2 sm:h-2 text-muted-foreground mr-1.5 sm:mr-2 mt-1.5 flex-shrink-0 fill-current" />
                  <span>{{ t(`${SCOPE}.items.${i}.features.${f}`) }}</span>
                </li>
              </ul>
            </div>

            <!-- Button -->
            <div class="mt-auto">
              <NuxtLink
                v-if="t(`${SCOPE}.items.${i}.status`) === 'available'"
                :to="navigateTo(t(`${SCOPE}.items.${i}.to`))"
                class="block"
              >
                <Button class="w-full py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base font-medium flex items-center justify-center">
                  {{ t(`${SCOPE}.button.useNow`) }}
                </Button>
              </NuxtLink>
              <Button
                v-else
                disabled
                variant="secondary"
                class="w-full py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base font-medium cursor-not-allowed flex items-center justify-center"
              >
                <Icon.Clock class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                {{ t(`${SCOPE}.button.coming`) }}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>
