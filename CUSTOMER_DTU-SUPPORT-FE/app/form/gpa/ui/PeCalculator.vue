<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import * as Icon from '@/components/ui/icon'
import FieldControl from '@/components/common/FieldControl.vue'
import { usePeCalculator } from '@/composables/gpa/usePeCalculator'

const { t } = useI18n()
const SCOPE = 'tools.gpa'

const { peResult, onPeSubmit, onPeReset, isSubmitting, values } = usePeCalculator()
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
              <Icon.Dumbbell class="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div>
              <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-foreground">{{ t(`${SCOPE}.pe.inputTitle`) }}</h2>
              <p class="text-xs sm:text-sm text-muted-foreground mt-0.5">{{ t(`${SCOPE}.pe.inputSubtitle`) }}</p>
            </div>
          </div>
        </div>
        <div class="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent p-4 mb-5">
          <div class="flex items-start gap-3">
            <Icon.Info class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div class="flex-1 space-y-2">
              <p class="text-sm font-semibold text-foreground">{{ t(`${SCOPE}.pe.info.title`) }}</p>
              <div class="text-xs text-muted-foreground leading-relaxed space-y-1">
                <p>{{ t(`${SCOPE}.pe.rules.line1`) }}</p>
                <p>{{ t(`${SCOPE}.pe.rules.line2`) }}</p>
                <p>{{ t(`${SCOPE}.pe.rules.line3`) }}</p>
              </div>
            </div>
          </div>
        </div>
      <form @submit="onPeSubmit" class="space-y-4 sm:space-y-5">
        <div class="space-y-2">
          <FieldControl
            name="pe1"
            :label="t(`${SCOPE}.pe.fields.pe1`)"
            type="number"
            step="0.01"
            :placeholder="t(`${SCOPE}.pe.placeholders.pe1`)"
            required
          />
          <p class="text-xs text-muted-foreground ml-1">{{ t(`${SCOPE}.pe.helpers.pe1`) }}</p>
        </div>
        <div class="space-y-2">
          <FieldControl
            name="pe2"
            :label="t(`${SCOPE}.pe.fields.pe2`)"
            type="number"
            step="0.01"
            :placeholder="t(`${SCOPE}.pe.placeholders.pe2`)"
            required
          />
          <p class="text-xs text-muted-foreground ml-1">{{ t(`${SCOPE}.pe.helpers.pe2`) }}</p>
        </div>
        <div class="space-y-2">
          <FieldControl
            name="pe3"
            :label="t(`${SCOPE}.pe.fields.pe3`)"
            type="number"
            step="0.01"
            :placeholder="t(`${SCOPE}.pe.placeholders.pe3`)"
            required
          />
          <p class="text-xs text-muted-foreground ml-1">{{ t(`${SCOPE}.pe.helpers.pe3`) }}</p>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 pt-3">
          <Button type="submit" :disabled="isSubmitting" size="lg" class="flex-1 sm:flex-none">
            <Icon.Calculator />
            {{ isSubmitting ? t(`${SCOPE}.pe.buttons.calculating`) : t(`${SCOPE}.pe.buttons.calculate`) }}
          </Button>
          <Button type="button" variant="outline" size="lg" class="flex-1 sm:flex-none border-2 hover:bg-muted/50 transition-all duration-300" @click="onPeReset">
            <Icon.RotateCcw />
            {{ t(`${SCOPE}.pe.buttons.reset`) }}
          </Button>
        </div>
      </form>
      </div>
    </div>

    <div class="relative rounded-2xl sm:rounded-3xl border border-border/30 bg-gradient-to-br from-card via-card/95 to-card/90 text-card-foreground p-6 sm:p-7 md:p-8 shadow-xl backdrop-blur-md min-h-[220px] sm:min-h-[280px] flex items-center justify-center overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div v-if="peResult.average === null" class="relative w-full flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-muted/40 via-muted/20 to-muted/10 border border-border/30 text-center px-4 sm:px-6 py-8 sm:py-10 backdrop-blur-sm">
        <div class="relative mb-3 sm:mb-4">
          <div class="absolute inset-0 bg-accent/10 rounded-full blur-xl"></div>
          <Icon.Dumbbell class="w-10 h-10 sm:w-12 sm:h-12 text-accent/60 relative z-10" />
        </div>
        <h3 class="text-base sm:text-lg font-bold text-foreground mb-1.5 px-2">{{ t(`${SCOPE}.pe.empty.title`) }}</h3>
        <p class="text-xs text-muted-foreground max-w-sm px-2">{{ t(`${SCOPE}.pe.empty.description`) }}</p>
      </div>
      <div v-else class="relative w-full space-y-4 sm:space-y-5 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        <div class="relative rounded-2xl sm:rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 p-6 sm:p-7 md:p-8 text-center shadow-xl backdrop-blur-sm overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl blur-2xl opacity-50"></div>
          <div class="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/15 text-primary mb-3">
            <Icon.ClipboardCheck v-if="peResult.isPass" class="w-5 h-5 sm:w-6 sm:h-6" />
            <Icon.AlertTriangle v-else class="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div :class="[
            'text-2xl sm:text-3xl font-extrabold tracking-tight',
            peResult.isPass ? 'text-primary' : 'text-accent'
          ]">
            {{ peResult.isPass ? t(`${SCOPE}.pe.results.headline.pass`) : t(`${SCOPE}.pe.results.headline.fail`) }}
          </div>
        </div>

        <div class="rounded-xl sm:rounded-2xl border border-primary/20 bg-card p-5 sm:p-6 text-center">
          <div class="text-xs text-muted-foreground mb-1">{{ t(`${SCOPE}.pe.results.subtitle`) }}</div>
          <div class="text-4xl sm:text-5xl font-extrabold text-primary leading-none">{{ peResult.average.toFixed(2) }}</div>
          <div class="text-xs text-muted-foreground mt-1 mb-3">{{ t(`${SCOPE}.pe.results.scale`) }}</div>
          <div :class="[
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border',
            peResult.isPass ? 'bg-primary/10 text-primary border-primary/20' : 'bg-destructive/10 text-destructive border-destructive/20'
          ]">
            <Icon.CheckCircle v-if="peResult.isPass" class="w-4 h-4" />
            <Icon.XCircle v-else class="w-4 h-4" />
            <span>{{ peResult.isPass ? t(`${SCOPE}.pe.results.pass`) : t(`${SCOPE}.pe.results.fail`) }}</span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="rounded-xl border border-border/30 bg-muted/10 p-4 text-center">
            <div class="text-xs text-muted-foreground mb-1">{{ t(`${SCOPE}.pe.results.courses.c1`) }}</div>
            <div class="text-lg font-bold text-foreground">{{ (values.pe1 ?? 0).toString() }}</div>
          </div>
          <div class="rounded-xl border border-border/30 bg-muted/10 p-4 text-center">
            <div class="text-xs text-muted-foreground mb-1">{{ t(`${SCOPE}.pe.results.courses.c2`) }}</div>
            <div class="text-lg font-bold text-foreground">{{ (values.pe2 ?? 0).toString() }}</div>
          </div>
          <div class="rounded-xl border border-border/30 bg-muted/10 p-4 text-center">
            <div class="text-xs text-muted-foreground mb-1">{{ t(`${SCOPE}.pe.results.courses.c3`) }}</div>
            <div class="text-lg font-bold text-foreground">{{ (values.pe3 ?? 0).toString() }}</div>
          </div>
        </div>

        <div class="rounded-xl border border-border/30 bg-primary/5 p-4">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/15 text-primary grid place-items-center">
              <Icon.Lightbulb class="w-4 h-4" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-semibold text-foreground mb-1">{{ t(`${SCOPE}.pe.results.analysis.title`) }}</div>
              <div class="text-xs text-muted-foreground">
                {{ peResult.isPass ? t(`${SCOPE}.pe.results.analysis.pass`, { gpa: peResult.average.toFixed(2) }) : t(`${SCOPE}.pe.results.analysis.fail`, { gpa: peResult.average.toFixed(2) }) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
