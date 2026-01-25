<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import * as Icon from '@/components/ui/icon'
import FieldControl from '@/components/common/FieldControl.vue'
import { useTargetCalculator } from '@/composables/gpa/useTargetCalculator'
import { cn } from '@/lib/utils'
import { getBadgeClasses, type BadgeColor } from '@/lib/ui'

const { t } = useI18n()
const SCOPE = 'tools.gpa'

const { targetResult, onTargetSubmit, isSubmitting } = useTargetCalculator()
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
    <div class="relative rounded-2xl sm:rounded-3xl border border-border/30 bg-gradient-to-br from-card via-card/95 to-card/90 text-card-foreground p-6 sm:p-7 md:p-8 shadow-xl backdrop-blur-md overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="absolute top-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div class="relative z-10">
        <div class="mb-5 sm:mb-6">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/20">
              <Icon.Target class="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div>
              <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-foreground">{{ t(`${SCOPE}.target.inputTitle`) }}</h2>
              <p class="text-xs sm:text-sm text-muted-foreground mt-0.5">{{ t(`${SCOPE}.target.inputSubtitle`) }}</p>
            </div>
          </div>
        </div>
        <div class="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent p-4 mb-5">
          <div class="flex items-start gap-3">
            <Icon.Info class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div class="flex-1 space-y-1">
              <p class="text-sm font-semibold text-foreground">{{ t(`${SCOPE}.target.info.title`) }}</p>
              <p class="text-xs text-muted-foreground leading-relaxed">{{ t(`${SCOPE}.target.info.description`) }}</p>
            </div>
          </div>
        </div>
      <form @submit="onTargetSubmit" class="space-y-4 sm:space-y-5">
        <div class="space-y-2">
          <FieldControl
            name="completedCredits"
            :label="t(`${SCOPE}.target.fields.completedCredits`)"
            type="number"
            step="1"
            :placeholder="t(`${SCOPE}.target.placeholders.completedCredits`)"
            required
          />
          <p class="text-xs text-muted-foreground ml-1">{{ t(`${SCOPE}.target.helpers.completedCredits`) }}</p>
        </div>
        <div class="space-y-2">
          <FieldControl
            name="currentGpa"
            :label="t(`${SCOPE}.target.fields.currentGpa`)"
            type="number"
            step="0.01"
            :placeholder="t(`${SCOPE}.target.placeholders.currentGpa`)"
            required
          />
          <p class="text-xs text-muted-foreground ml-1">{{ t(`${SCOPE}.target.helpers.currentGpa`) }}</p>
        </div>
        <div class="space-y-2">
          <FieldControl
            name="targetGpa"
            :label="t(`${SCOPE}.target.fields.targetGpa`)"
            type="number"
            step="0.01"
            :placeholder="t(`${SCOPE}.target.placeholders.targetGpa`)"
            required
          />
          <p class="text-xs text-muted-foreground ml-1">{{ t(`${SCOPE}.target.helpers.targetGpa`) }}</p>
        </div>
        <div class="space-y-2">
          <FieldControl
            name="remainingCredits"
            :label="t(`${SCOPE}.target.fields.remainingCredits`)"
            type="number"
            step="1"
            :placeholder="t(`${SCOPE}.target.placeholders.remainingCredits`)"
            required
          />
          <p class="text-xs text-muted-foreground ml-1">{{ t(`${SCOPE}.target.helpers.remainingCredits`) }}</p>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 pt-3">
          <Button type="submit" :disabled="isSubmitting" size="lg" class="flex-1 sm:flex-none">
            <Icon.Calculator />
            {{ isSubmitting ? t(`${SCOPE}.target.buttons.calculating`) : t(`${SCOPE}.target.buttons.calculate`) }}
          </Button>
          <Button type="reset" variant="outline" size="lg" class="flex-1 sm:flex-none border-2 hover:bg-muted/50 transition-all duration-300">
            <Icon.RotateCcw />
            {{ t(`${SCOPE}.target.buttons.reset`) }}
          </Button>
        </div>
      </form>
      </div>
    </div>

    <div class="relative rounded-2xl sm:rounded-3xl border border-border/30 bg-gradient-to-br from-card via-card/95 to-card/90 text-card-foreground p-6 sm:p-7 md:p-8 shadow-xl backdrop-blur-md min-h-[250px] sm:min-h-[300px] flex items-center justify-center overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div v-if="targetResult.maxGpaWithAllA === null" class="relative w-full flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-muted/40 via-muted/20 to-muted/10 border border-border/30 text-center px-4 sm:px-6 py-8 sm:py-10 transition-all duration-300 backdrop-blur-sm">
        <div class="relative mb-3 sm:mb-4">
          <div class="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
          <Icon.Target class="w-10 h-10 sm:w-12 sm:h-12 text-primary/60 relative z-10" />
        </div>
        <h3 class="text-base sm:text-lg font-bold text-foreground mb-1.5 px-2">{{ t(`${SCOPE}.target.empty.title`) }}</h3>
        <p class="text-xs text-muted-foreground max-w-sm px-2">{{ t(`${SCOPE}.target.empty.description`) }}</p>
      </div>
      <div v-else class="w-full space-y-3 sm:space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        <div class="text-center mb-3 sm:mb-4">
          <h3 class="text-base sm:text-lg md:text-xl font-bold text-foreground mb-1">{{ t(`${SCOPE}.target.results.title`) }}</h3>
          <p class="text-xs text-muted-foreground">{{ t(`${SCOPE}.target.results.subtitle`) }}</p>
        </div>

        <div class="relative w-full">
          <div class="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/30 to-primary/20 rounded-2xl blur-3xl animate-pulse"></div>
          <div class="relative bg-gradient-to-br from-card via-card/90 to-card/80 rounded-2xl sm:rounded-3xl border-2 border-primary/30 p-6 sm:p-7 md:p-8 shadow-2xl backdrop-blur-md">
            <div class="flex flex-col items-center justify-center">
              <div class="mb-3 sm:mb-4">
                <div class="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary mb-1 tracking-tight">
                  {{ targetResult.maxGpaWithAllA.toFixed(3) }}
                </div>
                <div class="text-xs text-muted-foreground text-center mt-1 mb-2">{{ t(`${SCOPE}.target.results.scale`) }}</div>
                <div v-if="targetResult.graduationClassification" :class="getBadgeClasses(targetResult.graduationClassification.badgeColor as BadgeColor)">
                  <component :is="Icon[targetResult.graduationClassification.iconName as keyof typeof Icon]" class="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{{ t(`${SCOPE}.target.classifications.${targetResult.graduationClassification.rankKey}`) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div :class="[
          'rounded-lg sm:rounded-xl border p-3 sm:p-4 transition-all duration-300',
          targetResult.canReachTargetWithAllA
            ? 'bg-primary/5 border-primary/30'
            : 'bg-accent/5 border-accent/30'
        ]">
          <div class="flex items-start gap-2 sm:gap-3">
            <div :class="[
              'flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center',
              targetResult.canReachTargetWithAllA
                ? 'bg-primary/20 text-primary'
                : 'bg-accent/20 text-accent'
            ]">
              <Icon.CheckCircle v-if="targetResult.canReachTargetWithAllA" class="w-4 h-4 sm:w-5 sm:h-5" />
              <Icon.AlertTriangle v-else class="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div class="flex-1 min-w-0">
              <h4 :class="[
                'text-xs sm:text-sm font-semibold mb-1',
                targetResult.canReachTargetWithAllA ? 'text-primary' : 'text-accent'
              ]">
                {{ targetResult.canReachTargetWithAllA ? t(`${SCOPE}.target.results.success.title`) : t(`${SCOPE}.target.results.warning.title`) }}
              </h4>
              <p class="text-xs text-muted-foreground leading-relaxed">
                {{ targetResult.canReachTargetWithAllA
                  ? t(`${SCOPE}.target.results.success.message`, { gpa: targetResult.maxGpaWithAllA.toFixed(3) })
                  : t(`${SCOPE}.target.results.warning.message`, { gpa: targetResult.maxGpaWithAllA.toFixed(3) })
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
