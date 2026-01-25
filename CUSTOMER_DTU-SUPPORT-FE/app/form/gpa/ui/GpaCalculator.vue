<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import * as Icon from '@/components/ui/icon'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import FieldControl from '@/components/common/FieldControl.vue'
import { useSimulationCalculator } from '@/composables/gpa/useSimulationCalculator'
import { GRADE_OPTIONS, getGradeByValue } from '@/constants/gpa/grades'
import { getBadgeClasses } from '@/lib/ui'

const { t } = useI18n()
const SCOPE = 'tools.gpa'

const {
  simulationResult,
  creditDistributions,
  totalDistributedCredits,
  isDistributionComplete,
  addDistribution,
  removeDistribution,
  updateDistribution,
  onSimulationSubmit,
  isSubmitting,
  values,
} = useSimulationCalculator()


const getGradeLabel = (gradeValue: string) => {
  const grade = getGradeByValue(gradeValue)
  if (!grade) return ''
  return t(`${SCOPE}.simulation.grades.${grade.value}.label`, { point: grade.point })
}

const getGradeCategory = (gradeValue: string) => {
  const grade = getGradeByValue(gradeValue)
  if (!grade) return ''
  return t(`${SCOPE}.simulation.grades.${grade.value}.category`)
}

const handleDistributionCreditChange = (id: string, credits: number) => {
  updateDistribution(id, { credits })
}

const handleDistributionGradeChange = (id: string, gradeValue: string) => {
  updateDistribution(id, { gradeValue })
}

const handleSelectChange = (id: string, value: unknown) => {
  if (typeof value === 'string') {
    handleDistributionGradeChange(id, value)
  }
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
    <div class="rounded-xl sm:rounded-2xl border border-border/20 bg-card text-card-foreground p-4 sm:p-5 md:p-6 shadow-md backdrop-blur-sm">
      <div class="mb-4 sm:mb-5">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-base sm:text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
            <Icon.Calculator class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
            {{ t(`${SCOPE}.simulation.inputTitle`) }}
          </h2>
          <button
            type="button"
            class="w-8 h-8 rounded-full border border-border/20 bg-background hover:bg-muted/50 flex items-center justify-center transition-colors"
            :title="t(`${SCOPE}.simulation.help`)"
          >
            <Icon.HelpCircle class="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <p class="text-xs sm:text-xs text-muted-foreground">{{ t(`${SCOPE}.simulation.inputSubtitle`) }}</p>
      </div>

      <form @submit="onSimulationSubmit" class="space-y-3 sm:space-y-4">
        <FieldControl
          name="completedCredits"
          :label="t(`${SCOPE}.simulation.fields.completedCredits`)"
          type="number"
          step="1"
          :placeholder="t(`${SCOPE}.simulation.placeholders.completedCredits`)"
          required
        />
        <FieldControl
          name="currentGpa"
          :label="t(`${SCOPE}.simulation.fields.currentGpa`)"
          type="number"
          step="0.01"
          :placeholder="t(`${SCOPE}.simulation.placeholders.currentGpa`)"
          required
        />
        <FieldControl
          name="remainingCredits"
          :label="t(`${SCOPE}.simulation.fields.remainingCredits`)"
          type="number"
          step="1"
          :placeholder="t(`${SCOPE}.simulation.placeholders.remainingCredits`)"
          required
        />

        <div class="pt-2 border-t border-border/20">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
              <Icon.BarChart3 class="w-4 h-4 text-primary" />
              {{ t(`${SCOPE}.simulation.distribution.title`) }}
            </h3>
            <span class="text-xs sm:text-sm text-muted-foreground font-medium">
              {{ totalDistributedCredits }}/{{ values.remainingCredits || 0 }} {{ t(`${SCOPE}.simulation.distribution.credits`) }}
            </span>
          </div>

          <Button
            type="button"
            variant="default"
            size="sm"
            class="mb-3"
            @click="addDistribution"
          >
            <Icon.Plus class="w-4 h-4" />
            {{ t(`${SCOPE}.simulation.distribution.addButton`) }}
          </Button>

          <div
            v-if="isDistributionComplete && values.remainingCredits > 0"
            class="mb-3 rounded-lg bg-primary/10 border border-primary/20 p-3 flex items-start gap-2"
          >
            <Icon.CheckCircle class="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p class="text-xs sm:text-sm text-primary font-medium">
              {{ t(`${SCOPE}.simulation.distribution.successMessage`, { credits: values.remainingCredits }) }}
            </p>
          </div>

          <div v-if="creditDistributions.length === 0" class="text-center py-4 text-xs text-muted-foreground">
            {{ t(`${SCOPE}.simulation.distribution.empty`) }}
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="(dist, index) in creditDistributions"
              :key="dist.id"
              class="rounded-lg border border-border/20 bg-muted/30 p-3 space-y-3"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-muted-foreground">
                  #{{ index + 1 }}
                </span>
                <button
                  type="button"
                  class="w-6 h-6 rounded hover:bg-destructive/10 flex items-center justify-center transition-colors"
                  @click="removeDistribution(dist.id)"
                  :title="t(`${SCOPE}.simulation.distribution.removeButton`)"
                >
                  <Icon.Trash2 class="w-4 h-4 text-destructive" />
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="space-y-2">
                  <label class="text-xs font-medium text-foreground">
                    {{ t(`${SCOPE}.simulation.distribution.creditsLabel`) }}
                  </label>
                  <Input
                    type="number"
                    step="1"
                    min="1"
                    :model-value="dist.credits"
                    @update:model-value="(val: string | number) => handleDistributionCreditChange(dist.id, Number(val))"
                    class="h-11"
                    :placeholder="t(`${SCOPE}.simulation.distribution.creditsPlaceholder`)"
                  />
                </div>

                <div class="space-y-2">
                  <label class="text-xs font-medium text-foreground">
                    {{ t(`${SCOPE}.simulation.distribution.gradeLabel`) }}
                  </label>
                  <Select
                    :model-value="dist.gradeValue"
                    @update:model-value="(val: unknown) => handleSelectChange(dist.id, val)"
                  >
                    <SelectTrigger class="w-full h-11">
                      <SelectValue>
                        <span class="flex items-center gap-2">
                          <span>{{ getGradeLabel(dist.gradeValue) }}</span>
                          <span class="text-muted-foreground">-</span>
                          <span class="text-muted-foreground">{{ getGradeCategory(dist.gradeValue) }}</span>
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="grade in GRADE_OPTIONS"
                        :key="grade.value"
                        :value="grade.value"
                      >
                        <span class="flex items-center gap-2">
                          <span>{{ grade.label }} ({{ grade.point }})</span>
                          <span class="text-muted-foreground">-</span>
                          <span class="text-muted-foreground">{{ t(`${SCOPE}.simulation.grades.${grade.value}.category`) }}</span>
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div v-if="getGradeByValue(dist.gradeValue)" :class="getBadgeClasses(getGradeByValue(dist.gradeValue)!.badgeColor as 'primary'|'accent'|'muted'|'destructive')">
                <span>{{ getGradeByValue(dist.gradeValue)!.label }} ({{ getGradeByValue(dist.gradeValue)!.point }})</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
          <Button type="submit" :disabled="isSubmitting || !isDistributionComplete" size="lg" class="flex-1 sm:flex-none">
            <Icon.Target class="w-4 h-4" />
            {{ isSubmitting ? t(`${SCOPE}.simulation.buttons.calculating`) : t(`${SCOPE}.simulation.buttons.calculate`) }}
          </Button>
          <Button type="reset" variant="outline" size="lg" class="flex-1 sm:flex-none">
            <Icon.RotateCcw class="w-4 h-4" />
            {{ t(`${SCOPE}.simulation.buttons.reset`) }}
          </Button>
        </div>
      </form>
    </div>

    <div class="rounded-xl sm:rounded-2xl border border-border/20 bg-card text-card-foreground p-4 sm:p-5 md:p-6 shadow-md backdrop-blur-sm min-h-[400px] flex items-center justify-center">
      <div v-if="simulationResult.finalGpa === null" class="w-full flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-muted/30 to-muted/10 border border-border/20 text-center px-4 sm:px-6 py-6 sm:py-8 transition-all duration-300">
        <div class="relative mb-3 sm:mb-4">
          <div class="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
          <Icon.Calculator class="w-10 h-10 sm:w-12 sm:h-12 text-primary/60 relative z-10" />
        </div>
        <h3 class="text-base sm:text-lg font-bold text-foreground mb-1.5 px-2">{{ t(`${SCOPE}.simulation.results.empty.title`) }}</h3>
        <p class="text-xs text-muted-foreground max-w-sm px-2">{{ t(`${SCOPE}.simulation.results.empty.description`) }}</p>
      </div>

      <div v-else class="w-full space-y-4 sm:space-y-5 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        <div class="text-center mb-4">
          <h3 class="text-base sm:text-lg md:text-xl font-bold text-foreground mb-1">
            {{ t(`${SCOPE}.simulation.results.title`) }}
          </h3>
        </div>

        <div v-if="simulationResult.isWeakResult" class="rounded-lg border border-destructive/30 bg-destructive/10 p-4 flex flex-col items-center text-center">
          <Icon.AlertCircle class="w-12 h-12 text-destructive mb-3" />
          <p class="text-sm sm:text-base font-bold text-destructive">
            {{ t(`${SCOPE}.simulation.results.warning.title`) }}
          </p>
          <p class="text-xs sm:text-sm text-destructive/80 mt-1">
            {{ t(`${SCOPE}.simulation.results.warning.message`) }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:gap-4">
          <div class="rounded-lg border border-border/20 bg-muted/30 p-3 sm:p-4">
            <p class="text-xs text-muted-foreground mb-1">{{ t(`${SCOPE}.simulation.results.boxes.currentGpa`) }}</p>
            <p class="text-xl sm:text-2xl font-bold text-foreground">{{ values.currentGpa.toFixed(2) }}</p>
          </div>

          <div class="rounded-lg border border-border/20 bg-muted/30 p-3 sm:p-4">
            <p class="text-xs text-muted-foreground mb-1">{{ t(`${SCOPE}.simulation.results.boxes.finalGpa`) }}</p>
            <p class="text-xl sm:text-2xl font-bold text-primary">{{ simulationResult.finalGpa?.toFixed(2) }}</p>
            <p class="text-xs text-muted-foreground mt-1">{{ t(`${SCOPE}.simulation.results.boxes.afterCompletion`) }}</p>
          </div>

          <div class="rounded-lg border border-border/20 bg-muted/30 p-3 sm:p-4">
            <p class="text-xs text-muted-foreground mb-1">{{ t(`${SCOPE}.simulation.results.boxes.additionalCredits`) }}</p>
            <p class="text-xl sm:text-2xl font-bold text-foreground">{{ values.remainingCredits }} {{ t(`${SCOPE}.simulation.distribution.credits`) }}</p>
          </div>

          <div class="rounded-lg border border-border/20 bg-muted/30 p-3 sm:p-4">
            <p class="text-xs text-muted-foreground mb-1">{{ t(`${SCOPE}.simulation.results.boxes.totalCredits`) }}</p>
            <p class="text-xl sm:text-2xl font-bold text-foreground">{{ simulationResult.totalCredits }} {{ t(`${SCOPE}.simulation.distribution.credits`) }}</p>
          </div>
        </div>

        <div class="rounded-lg border border-border/20 bg-muted/30 p-3 sm:p-4">
          <div class="flex items-center gap-2 mb-2">
            <Icon.Lightbulb class="w-4 h-4 text-primary" />
            <h4 class="text-sm font-semibold text-foreground">{{ t(`${SCOPE}.simulation.results.analysis.title`) }}</h4>
          </div>
          <div class="text-xs sm:text-sm text-muted-foreground space-y-1">
            <p v-if="simulationResult.distributionSummary">
              {{ t(`${SCOPE}.simulation.results.summary`, { summary: simulationResult.distributionSummary, gpa: simulationResult.finalGpa.toFixed(3), rank: simulationResult.graduationClassification ? t(`${SCOPE}.target.classifications.${simulationResult.graduationClassification.rankKey}`) : '' }) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
