<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import * as Icon from '@/components/ui/icon'
import TargetCalculator from './ui/TargetCalculator.vue'
import GraduationInfo from './common/GraduationInfo.vue'
import PeCalculator from './ui/PeCalculator.vue'
import PassCalculator from './ui/PassCalculator.vue'
import GpaCalculator from './ui/GpaCalculator.vue'

const { t } = useI18n()
const SCOPE = 'tools.gpa'
const DEFAULT_TAB = 'target'
</script>

<template>
  <section class="relative bg-gradient-to-b from-background via-background to-muted/20 text-foreground py-12 sm:py-14 md:py-20 overflow-hidden">
    <div class="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl"></div>
    <div class="container mx-auto px-4 sm:px-6 relative z-10">
      <div class="max-w-5xl mx-auto text-center mb-8 sm:mb-12 md:mb-16">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 text-primary ring-2 ring-primary/20 text-xs sm:text-sm mb-4 sm:mb-6 shadow-lg backdrop-blur-sm animate-in fade-in-0 slide-in-from-top-4 duration-500">
          <Icon.Calculator class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span class="font-semibold">{{ t(`${SCOPE}.badge`) }}</span>
        </div>
        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight px-2 mb-4 sm:mb-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
          <span class="text-foreground">{{ t(`${SCOPE}.title`) }}</span>
          <span class="block text-primary font-extrabold">{{ t(`${SCOPE}.titleHighlight`) }}</span>
        </h1>
        <p class="text-foreground/80 mt-3 sm:mt-4 md:mt-6 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4 animate-in fade-in-0 slide-in-from-bottom-6 duration-700 delay-150">
          {{ t(`${SCOPE}.subtitle`) }}
        </p>
      </div>

      <div class="max-w-5xl mx-auto">
        <Tabs :default-value="DEFAULT_TAB" class="block">
          <TabsList class="inline-flex h-auto items-center justify-center rounded-xl bg-gradient-to-r from-card/80 via-card/60 to-card/80 backdrop-blur-md border border-border/30 p-1.5 text-muted-foreground overflow-x-auto shadow-xl w-full sm:w-auto mb-6">
            <TabsTrigger value="target" class="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-all duration-300 hover:text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-lg data-[state=active]:scale-105 flex-shrink-0">
              <Icon.Target class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
              <span class="hidden sm:inline">{{ t(`${SCOPE}.tabs.target`) }}</span>
              <span class="sm:hidden">{{ t(`${SCOPE}.tabs.targetShort`) }}</span>
            </TabsTrigger>
            <TabsTrigger value="gpa" class="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-all duration-300 hover:text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-lg data-[state=active]:scale-105 flex-shrink-0">
              <Icon.Calculator class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
              <span class="hidden sm:inline">{{ t(`${SCOPE}.tabs.gpa`) }}</span>
              <span class="sm:hidden">{{ t(`${SCOPE}.tabs.gpaShort`) }}</span>
            </TabsTrigger>
            <TabsTrigger value="pe" class="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-all duration-300 hover:text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-lg data-[state=active]:scale-105 flex-shrink-0">
              <Icon.Dumbbell class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
              <span class="hidden sm:inline">{{ t(`${SCOPE}.tabs.pe`) }}</span>
              <span class="sm:hidden">{{ t(`${SCOPE}.tabs.peShort`) }}</span>
            </TabsTrigger>
            <TabsTrigger value="pass" class="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-all duration-300 hover:text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-lg data-[state=active]:scale-105 flex-shrink-0">
              <Icon.ClipboardCheck class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
              <span class="hidden sm:inline">{{ t(`${SCOPE}.tabs.pass`) }}</span>
              <span class="sm:hidden">{{ t(`${SCOPE}.tabs.passShort`) }}</span>
            </TabsTrigger>
            <TabsTrigger value="ai" class="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-all duration-300 hover:text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:font-semibold data-[state=active]:shadow-lg data-[state=active]:scale-105 flex-shrink-0">
              <Icon.Bot class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
              <span class="hidden sm:inline">{{ t(`${SCOPE}.tabs.ai`) }}</span>
              <span class="sm:hidden">{{ t(`${SCOPE}.tabs.aiShort`) }}</span>
            </TabsTrigger>
          </TabsList>

          <div class="mt-6 sm:mt-8">
            <TabsContent value="target" class="block">
              <TargetCalculator />
            </TabsContent>

            <TabsContent value="gpa" class="mt-6 sm:mt-8">
              <GpaCalculator />
            </TabsContent>

            <TabsContent value="pe" class="mt-6 sm:mt-8">
              <PeCalculator />
            </TabsContent>

            <TabsContent value="pass" class="mt-6 sm:mt-8">
              <PassCalculator />
            </TabsContent>

            <TabsContent value="ai" class="mt-6 sm:mt-8">
              <div class="relative rounded-2xl sm:rounded-3xl border border-border/30 bg-gradient-to-br from-card via-card/95 to-card/90 text-card-foreground p-8 sm:p-10 md:p-12 shadow-2xl backdrop-blur-md overflow-hidden group hover:shadow-accent/10 transition-all duration-500">
                <div class="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div class="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div class="relative flex flex-col items-center justify-center text-center">
                  <div class="relative mb-4 sm:mb-6">
                    <div class="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-2xl animate-pulse"></div>
                    <div class="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center backdrop-blur-sm border border-accent/20">
                      <Icon.Bot class="w-8 h-8 sm:w-10 sm:h-10 text-accent relative z-10" />
                    </div>
                  </div>
                  <h3 class="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 px-2">{{ t(`${SCOPE}.ai.title`) }}</h3>
                  <p class="text-sm sm:text-base text-muted-foreground max-w-md px-4 leading-relaxed">{{ t(`${SCOPE}.ai.description`) }}</p>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div class="mt-12 sm:mt-16 md:mt-20">
          <GraduationInfo />
        </div>
      </div>
    </div>
  </section>
</template>
