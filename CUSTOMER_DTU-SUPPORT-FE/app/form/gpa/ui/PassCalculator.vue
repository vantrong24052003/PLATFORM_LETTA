<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import * as Icon from '@/components/ui/icon'
import FieldControl from '@/components/common/FieldControl.vue'
import { usePassCalculator } from '@/composables/gpa/usePassCalculator'
import { cn } from '@/lib/utils'
import { getBadgeClasses } from '@/lib/ui'

const { t } = useI18n()
const SCOPE = 'tools.pass'

const {
  passResult,
  scoreComponents,
  totalWeight,
  addScoreComponent,
  removeScoreComponent,
  updateScoreComponent,
  onPassSubmit,
  calculatePrediction,
  resetForm,
  isSubmitting,
  values,
} = usePassCalculator()

const predictedScoreInput = ref<number | undefined>(undefined)

const updateComponentField = (id: string, field: 'name' | 'weight' | 'score', value: string | number) => {
  switch (field) {
    case 'name':
      updateScoreComponent(id, { name: String(value) })
      break
    case 'weight':
      updateScoreComponent(id, { weight: Number(value) })
      break
    case 'score':
      updateScoreComponent(id, { score: Number(value) })
      break
  }
}

const calculatePredictedScore = () => {
  if (predictedScoreInput.value !== undefined) {
    calculatePrediction(predictedScoreInput.value)
  }
}

const resetCalculatorForm = () => {
  resetForm()
  predictedScoreInput.value = undefined
}
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
              <Icon.Calculator class="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div>
              <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-foreground">{{ t(`${SCOPE}.inputTitle`) }}</h2>
              <p class="text-xs sm:text-sm text-muted-foreground mt-0.5">{{ t(`${SCOPE}.inputSubtitle`) }}</p>
            </div>
          </div>
        </div>
        <div class="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent p-4 mb-5">
          <div class="flex items-start gap-3">
            <Icon.Info class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div class="flex-1 space-y-1">
              <p class="text-sm font-semibold text-foreground">{{ t(`${SCOPE}.info.title`) }}</p>
              <p class="text-xs text-muted-foreground leading-relaxed">{{ t(`${SCOPE}.info.description`) }}</p>
            </div>
          </div>
        </div>
      <form @submit="onPassSubmit" class="space-y-4 sm:space-y-5">
        <div class="flex items-center justify-between p-4 rounded-xl border-2 border-border/30 bg-gradient-to-br from-muted/30 to-muted/20 shadow-sm">
          <div class="flex items-center gap-2 text-xs sm:text-sm">
            <span class="text-muted-foreground">{{ t(`${SCOPE}.progress.total`) }}:</span>
            <span class="font-semibold text-foreground">{{ (totalWeight + values.finalExamWeight).toFixed(1) }}%</span>
          </div>
          <div class="flex items-center gap-2 text-xs sm:text-sm">
            <span class="text-muted-foreground">{{ t(`${SCOPE}.progress.remaining`) }}:</span>
            <span class="font-semibold text-foreground">{{ (100 - (totalWeight + values.finalExamWeight)).toFixed(1) }}%</span>
          </div>
          <Button type="button" variant="ghost" size="sm" @click="resetCalculatorForm">
            <Icon.RotateCcw class="w-4 h-4" />
            {{ t(`${SCOPE}.buttons.reset`) }}
          </Button>
        </div>

        <div class="pt-2 border-t border-border/20">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
              <Icon.BarChart3 class="w-4 h-4 text-primary" />
              {{ t(`${SCOPE}.components.title`) }}
            </h3>
            <Button
              type="button"
              variant="default"
              size="sm"
              @click="addScoreComponent"
            >
              <Icon.Plus class="w-4 h-4" />
              {{ t(`${SCOPE}.components.addButton`) }}
            </Button>
          </div>

          <div v-if="scoreComponents.length === 0" class="text-center py-4 text-xs text-muted-foreground">
            {{ t(`${SCOPE}.components.empty`) }}
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="(comp, index) in scoreComponents"
              :key="comp.id"
              class="rounded-lg border border-border/20 bg-muted/30 p-3 space-y-3"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-muted-foreground">
                  #{{ index + 1 }}
                </span>
                <button
                  type="button"
                  class="w-6 h-6 rounded hover:bg-destructive/10 flex items-center justify-center transition-colors"
                  @click="removeScoreComponent(comp.id)"
                  :title="t(`${SCOPE}.components.removeButton`)"
                >
                  <Icon.Trash2 class="w-4 h-4 text-destructive" />
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="space-y-2">
                  <label class="text-xs font-medium text-foreground">
                    {{ t(`${SCOPE}.components.nameLabel`) }} *
                  </label>
                  <Input
                    type="text"
                    :model-value="comp.name"
                    @update:model-value="(val: string | number) => updateComponentField(comp.id, 'name', val)"
                    class="h-11 border-2 border-border/40 bg-gradient-to-br from-background to-muted/20 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 focus:ring-offset-1 hover:border-primary/40 hover:bg-gradient-to-br hover:from-background hover:to-muted/30 shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-300"
                    :placeholder="t(`${SCOPE}.components.namePlaceholder`)"
                  />
                </div>

                <div class="space-y-2">
                  <label class="text-xs font-medium text-foreground">
                    {{ t(`${SCOPE}.components.weightLabel`) }} * (%)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    :model-value="comp.weight"
                    @update:model-value="(val: string | number) => updateComponentField(comp.id, 'weight', val)"
                    class="h-11 border-2 border-border/40 bg-gradient-to-br from-background to-muted/20 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 focus:ring-offset-1 hover:border-primary/40 hover:bg-gradient-to-br hover:from-background hover:to-muted/30 shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-300"
                    :placeholder="t(`${SCOPE}.components.weightPlaceholder`)"
                  />
                </div>

                <div class="space-y-2">
                  <label class="text-xs font-medium text-foreground">
                    {{ t(`${SCOPE}.components.scoreLabel`) }} * (0-10)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    :model-value="comp.score"
                    @update:model-value="(val: string | number) => updateComponentField(comp.id, 'score', val)"
                    class="h-11 border-2 border-border/40 bg-gradient-to-br from-background to-muted/20 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 focus:ring-offset-1 hover:border-primary/40 hover:bg-gradient-to-br hover:from-background hover:to-muted/30 shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-300"
                    :placeholder="t(`${SCOPE}.components.scorePlaceholder`)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <FieldControl
            name="finalExamWeight"
            :label="t(`${SCOPE}.fields.finalExamWeight`)"
            type="number"
            step="0.1"
            :placeholder="t(`${SCOPE}.placeholders.finalExamWeight`)"
            required
          />
          <p class="text-xs text-muted-foreground ml-1">{{ t(`${SCOPE}.helpers.finalExamWeight`) }}</p>
        </div>

        <div class="space-y-2">
          <FieldControl
            name="minPassingScore"
            :label="t(`${SCOPE}.fields.minPassingScore`)"
            type="number"
            step="0.1"
            :placeholder="t(`${SCOPE}.placeholders.minPassingScore`)"
            required
          />
          <p class="text-xs text-muted-foreground ml-1">{{ t(`${SCOPE}.helpers.minPassingScore`) }}</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 pt-3">
          <Button type="submit" :disabled="isSubmitting || (totalWeight + values.finalExamWeight) !== 100" size="lg" class="flex-1 sm:flex-none">
            <Icon.Calculator />
            {{ isSubmitting ? t(`${SCOPE}.buttons.calculating`) : t(`${SCOPE}.buttons.calculate`) }}
          </Button>
          <Button type="button" variant="outline" size="lg" class="flex-1 sm:flex-none border-2 hover:bg-muted/50 transition-all duration-300" @click="resetCalculatorForm">
            <Icon.RotateCcw />
            {{ t(`${SCOPE}.buttons.reset`) }}
          </Button>
        </div>
      </form>
      </div>
    </div>

    <div class="relative rounded-2xl sm:rounded-3xl border border-border/30 bg-gradient-to-br from-card via-card/95 to-card/90 text-card-foreground p-6 sm:p-7 md:p-8 shadow-xl backdrop-blur-md min-h-[400px] flex items-center justify-center overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div v-if="passResult.requiredFinalScore === null" class="relative w-full flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-muted/40 via-muted/20 to-muted/10 border border-border/30 text-center px-4 sm:px-6 py-8 sm:py-10 transition-all duration-300 backdrop-blur-sm">
        <div class="relative mb-3 sm:mb-4">
          <div class="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
          <Icon.ClipboardCheck class="w-10 h-10 sm:w-12 sm:h-12 text-primary/60 relative z-10" />
        </div>
        <h3 class="text-base sm:text-lg font-bold text-foreground mb-1.5 px-2">{{ t(`${SCOPE}.empty.title`) }}</h3>
        <p class="text-xs text-muted-foreground max-w-sm px-2">{{ t(`${SCOPE}.empty.description`) }}</p>
      </div>

      <div v-else class="w-full space-y-4 sm:space-y-5 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        <div class="text-center mb-4">
          <h3 class="text-base sm:text-lg md:text-xl font-bold text-foreground mb-1 flex items-center justify-center gap-2">
            <Icon.Target class="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            {{ t(`${SCOPE}.results.title`) }}
          </h3>
        </div>

        <div v-if="!passResult.canPass" class="rounded-lg border border-destructive/30 bg-destructive/10 p-4 flex flex-col items-center text-center">
          <Icon.AlertCircle class="w-12 h-12 text-destructive mb-3" />
          <p class="text-sm sm:text-base font-bold text-destructive">
            {{ t(`${SCOPE}.results.cannotPass.title`) }}
          </p>
          <p class="text-xs sm:text-sm text-destructive/80 mt-1">
            {{ t(`${SCOPE}.results.cannotPass.message`) }}
          </p>
        </div>

        <div v-else class="space-y-4">
          <div :class="[
            'rounded-lg sm:rounded-xl border p-3 sm:p-4 transition-all duration-300',
            passResult.canPass
              ? 'bg-primary/5 border-primary/30'
              : 'bg-destructive/5 border-destructive/30'
          ]">
            <div class="flex items-start gap-2 sm:gap-3">
              <div :class="[
                'flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center',
                passResult.canPass
                  ? 'bg-primary/20 text-primary'
                  : 'bg-destructive/20 text-destructive'
              ]">
                <Icon.CheckCircle v-if="passResult.canPass" class="w-4 h-4 sm:w-5 sm:h-5" />
                <Icon.XCircle v-else class="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm sm:text-base font-semibold text-primary mb-1">
                  {{ t(`${SCOPE}.results.requiredMessage`, {
                    score: passResult.requiredFinalScore?.toFixed(2),
                    weight: passResult.remainingWeight?.toFixed(0)
                  }) }}
                </p>
                <p class="text-xs text-muted-foreground leading-relaxed">
                  {{ t(`${SCOPE}.results.requiredSubMessage`) }}
                </p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="rounded-lg border border-border/20 bg-muted/30 p-3 sm:p-4">
              <div class="flex items-center gap-2 mb-2">
                <Icon.TrendingUp class="w-4 h-4 text-primary" />
                <p class="text-xs text-muted-foreground">{{ t(`${SCOPE}.results.cards.currentScore`) }}</p>
              </div>
              <p class="text-xl sm:text-2xl font-bold text-foreground">
                {{ passResult.currentScore?.toFixed(2) || '0.00' }} / 10.0
              </p>
            </div>

            <div class="rounded-lg border border-border/20 bg-muted/30 p-3 sm:p-4">
              <div class="flex items-center gap-2 mb-2">
                <Icon.Target class="w-4 h-4 text-primary" />
                <p class="text-xs text-muted-foreground">{{ t(`${SCOPE}.results.cards.finalExamContribution`) }}</p>
              </div>
              <p class="text-xl sm:text-2xl font-bold text-foreground">
                ≥{{ ((passResult.requiredFinalScore || 0) * (passResult.remainingWeight || 0) / 100).toFixed(2) }}%
              </p>
            </div>

            <div class="rounded-lg border border-border/20 bg-muted/30 p-3 sm:p-4">
              <div class="flex items-center gap-2 mb-2">
                <Icon.CheckCircle class="w-4 h-4 text-primary" />
                <p class="text-xs text-muted-foreground">{{ t(`${SCOPE}.results.cards.requiredScore`) }}</p>
              </div>
              <p class="text-xl sm:text-2xl font-bold text-foreground">
                ≥{{ passResult.requiredFinalScore?.toFixed(2) || '0.00' }}
              </p>
            </div>
          </div>

          <div class="rounded-lg border border-border/20 bg-muted/30 p-3 sm:p-4">
            <h4 class="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Icon.List class="w-4 h-4 text-primary" />
              {{ t(`${SCOPE}.results.details.title`) }}
            </h4>
            <div class="overflow-x-auto">
              <table class="w-full text-xs sm:text-sm">
                <thead>
                  <tr class="border-b border-border/20">
                    <th class="text-left py-2 px-2 font-semibold text-foreground">{{ t(`${SCOPE}.results.details.table.name`) }}</th>
                    <th class="text-center py-2 px-2 font-semibold text-foreground">{{ t(`${SCOPE}.results.details.table.weight`) }}</th>
                    <th class="text-center py-2 px-2 font-semibold text-foreground">{{ t(`${SCOPE}.results.details.table.score`) }}</th>
                    <th class="text-center py-2 px-2 font-semibold text-foreground">{{ t(`${SCOPE}.results.details.table.contribution`) }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border/20">
                  <tr v-for="comp in scoreComponents" :key="comp.id">
                    <td class="py-2 px-2 text-foreground">{{ comp.name }}</td>
                    <td class="py-2 px-2 text-center text-muted-foreground">{{ comp.weight }}%</td>
                    <td class="py-2 px-2 text-center text-primary">{{ comp.score.toFixed(2) }}/10</td>
                    <td class="py-2 px-2 text-center text-accent">{{ (comp.score * comp.weight / 100).toFixed(2) }}%</td>
                  </tr>
                  <tr class="bg-muted/50">
                    <td class="py-2 px-2 font-semibold text-foreground">{{ t(`${SCOPE}.results.details.table.currentTotal`) }}</td>
                    <td class="py-2 px-2 text-center font-semibold text-foreground">{{ passResult.currentTotalWeight?.toFixed(0) || 0 }}%</td>
                    <td class="py-2 px-2 text-center text-muted-foreground">-</td>
                    <td class="py-2 px-2 text-center font-semibold text-accent">{{ passResult.currentScore?.toFixed(2) || '0.00' }}%</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-2 text-foreground">{{ t(`${SCOPE}.results.details.table.finalExam`) }}</td>
                    <td class="py-2 px-2 text-center text-muted-foreground">{{ passResult.remainingWeight?.toFixed(0) || 0 }}%</td>
                    <td class="py-2 px-2 text-center text-primary">≥{{ passResult.requiredFinalScore?.toFixed(2) || '0.00' }}/10</td>
                    <td class="py-2 px-2 text-center text-accent">≥{{ ((passResult.requiredFinalScore || 0) * (passResult.remainingWeight || 0) / 100).toFixed(2) }}%</td>
                  </tr>
                  <tr class="bg-primary/5 font-semibold">
                    <td class="py-2 px-2 text-foreground">{{ t(`${SCOPE}.results.details.table.grandTotal`) }}</td>
                    <td class="py-2 px-2 text-center text-foreground">100%</td>
                    <td class="py-2 px-2 text-center text-muted-foreground">-</td>
                    <td class="py-2 px-2 text-center text-primary">≥{{ values.minPassingScore?.toFixed(1) || '4.0' }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="rounded-lg border border-border/20 bg-muted/30 p-3 sm:p-4">
            <h4 class="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Icon.Calculator class="w-4 h-4 text-primary" />
              {{ t(`${SCOPE}.prediction.title`) }}
            </h4>
            <div class="flex gap-2">
              <Input
                v-model.number="predictedScoreInput"
                type="number"
                step="0.1"
                min="0"
                max="10"
                class="flex-1 h-11 border-2 border-border/40 bg-gradient-to-br from-background to-muted/20 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 focus:ring-offset-1 hover:border-primary/40 hover:bg-gradient-to-br hover:from-background hover:to-muted/30 shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-300"
                :placeholder="t(`${SCOPE}.prediction.placeholder`)"
              />
              <Button type="button" @click="calculatePredictedScore" :disabled="!predictedScoreInput">
                <Icon.Calculator class="w-4 h-4" />
                {{ t(`${SCOPE}.prediction.button`) }}
              </Button>
            </div>
            <div v-if="passResult.predictionResult" class="mt-3 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs text-muted-foreground">{{ t(`${SCOPE}.prediction.finalScore`) }}:</span>
                <span class="text-sm font-semibold text-foreground">{{ passResult.predictionResult.finalScore?.toFixed(2) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-muted-foreground">{{ t(`${SCOPE}.prediction.gpa4`) }}:</span>
                <span class="text-sm font-semibold text-foreground">{{ passResult.predictionResult.gpa4?.toFixed(2) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-muted-foreground">{{ t(`${SCOPE}.prediction.letterGrade`) }}:</span>
                <span :class="getBadgeClasses((passResult.predictionResult.badgeColor as 'primary'|'accent'|'muted'|'destructive') || 'primary')">
                  {{ passResult.predictionResult.letterGrade }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-muted-foreground">{{ t(`${SCOPE}.prediction.status`) }}:</span>
                <span :class="[
                  'text-xs font-semibold',
                  passResult.predictionResult.status === 'pass' ? 'text-primary' : 'text-destructive'
                ]">
                  <Icon.CheckCircle v-if="passResult.predictionResult.status === 'pass'" class="w-4 h-4 inline" />
                  <Icon.XCircle v-else class="w-4 h-4 inline" />
                  {{ passResult.predictionResult.status === 'pass' ? t(`${SCOPE}.prediction.pass`) : t(`${SCOPE}.prediction.fail`) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
