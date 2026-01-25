<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import * as Icon from '@/components/ui/icon'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const { t } = useI18n()
const SCOPE = 'tools.gpa.graduation'
</script>

<template>
  <div class="space-y-4 sm:space-y-6">
    <Card class="rounded-xl sm:rounded-2xl border border-border/20 bg-card text-card-foreground shadow-md">
      <CardHeader class="p-4 sm:p-5 md:p-6 pb-3 sm:pb-4">
        <CardTitle class="text-base sm:text-lg md:text-xl font-bold text-foreground mb-1.5 flex items-center gap-2">
          <Icon.GraduationCap class="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
          {{ t(`${SCOPE}.classification.title`) }}
        </CardTitle>
        <CardDescription class="text-xs sm:text-sm text-muted-foreground">
          {{ t(`${SCOPE}.classification.subtitle`) }}
        </CardDescription>
      </CardHeader>
      <CardContent class="p-4 sm:p-5 md:p-6 pt-0">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b border-border">
                <th class="text-left py-2 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-foreground">{{ t(`${SCOPE}.classification.table.rank`) }}</th>
                <th class="text-left py-2 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-foreground">{{ t(`${SCOPE}.classification.table.gpaRange`) }}</th>
                <th class="text-left py-2 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-foreground">{{ t(`${SCOPE}.classification.table.description`) }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr v-for="rank in ['excellent', 'good', 'fair', 'average']" :key="rank" class="hover:bg-muted/50 transition-colors">
                <td class="py-2 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-foreground">{{ t(`${SCOPE}.classification.ranks.${rank}.name`) }}</td>
                <td class="py-2 px-3 sm:px-4 text-xs sm:text-sm text-muted-foreground">{{ t(`${SCOPE}.classification.ranks.${rank}.gpaRange`) }}</td>
                <td class="py-2 px-3 sm:px-4 text-xs sm:text-sm text-muted-foreground">{{ t(`${SCOPE}.classification.ranks.${rank}.description`) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border">
          <p class="text-xs sm:text-sm font-semibold text-foreground mb-2">{{ t(`${SCOPE}.classification.notes.title`) }}</p>
          <ul class="space-y-1.5 text-xs sm:text-sm text-muted-foreground">
            <li class="flex items-start gap-2">
              <span class="text-primary mt-0.5">•</span>
              <span>{{ t(`${SCOPE}.classification.notes.note1`) }}</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary mt-0.5">•</span>
              <span>{{ t(`${SCOPE}.classification.notes.note2`) }}</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>

    <Card class="rounded-xl sm:rounded-2xl border border-border/20 bg-card text-card-foreground shadow-md">
      <CardHeader class="p-4 sm:p-5 md:p-6 pb-3 sm:pb-4">
        <CardTitle class="text-base sm:text-lg md:text-xl font-bold text-foreground mb-1.5 flex items-center gap-2">
          <Icon.Scale class="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
          {{ t(`${SCOPE}.gradingScale.title`) }}
        </CardTitle>
        <CardDescription class="text-xs sm:text-sm text-muted-foreground">
          {{ t(`${SCOPE}.gradingScale.subtitle`) }}
        </CardDescription>
      </CardHeader>
      <CardContent class="p-4 sm:p-5 md:p-6 pt-0">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr class="border-b border-border">
                <th class="text-left py-2 px-2 sm:px-3 text-xs sm:text-sm font-semibold text-foreground">{{ t(`${SCOPE}.gradingScale.table.category`) }}</th>
                <th class="text-left py-2 px-2 sm:px-3 text-xs sm:text-sm font-semibold text-foreground">{{ t(`${SCOPE}.gradingScale.table.scale10`) }}</th>
                <th class="text-left py-2 px-2 sm:px-3 text-xs sm:text-sm font-semibold text-foreground">{{ t(`${SCOPE}.gradingScale.table.letter`) }}</th>
                <th class="text-left py-2 px-2 sm:px-3 text-xs sm:text-sm font-semibold text-foreground">{{ t(`${SCOPE}.gradingScale.table.scale4`) }}</th>
                <th class="text-left py-2 px-2 sm:px-3 text-xs sm:text-sm font-semibold text-foreground">{{ t(`${SCOPE}.gradingScale.table.status`) }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <template v-for="(grade, index) in [
                { category: 'good', scale10: '9.5-10.0', letter: 'A+', scale4: '4.0', status: 'pass', showCategory: true },
                { category: 'good', scale10: '8.5-9.4', letter: 'A', scale4: '4.0', status: 'pass', showCategory: false },
                { category: 'fair', scale10: '8.0-8.4', letter: 'A-', scale4: '3.65', status: 'pass', showCategory: true },
                { category: 'fair', scale10: '7.5-7.9', letter: 'B+', scale4: '3.33', status: 'pass', showCategory: false },
                { category: 'fair', scale10: '7.0-7.4', letter: 'B', scale4: '3.0', status: 'pass', showCategory: false },
                { category: 'average', scale10: '6.5-6.9', letter: 'B-', scale4: '2.65', status: 'pass', showCategory: true },
                { category: 'average', scale10: '6.0-6.4', letter: 'C+', scale4: '2.33', status: 'pass', showCategory: false },
                { category: 'average', scale10: '5.5-5.9', letter: 'C', scale4: '2.0', status: 'pass', showCategory: false },
                { category: 'averageWeak', scale10: '4.5-5.4', letter: 'C-', scale4: '1.65', status: 'pass', showCategory: true },
                { category: 'averageWeak', scale10: '4.0-4.4', letter: 'D', scale4: '1.0', status: 'pass', showCategory: true },
                { category: 'poor', scale10: '0.0-3.9', letter: 'F', scale4: '0.0', status: 'fail', showCategory: true },
              ]" :key="index">
                <tr class="hover:bg-muted/50 transition-colors">
                  <td v-if="grade.showCategory" class="py-2 px-2 sm:px-3 font-semibold text-foreground" :rowspan="grade.category === 'good' ? 2 : (grade.category === 'fair' ? 3 : (grade.category === 'average' ? 3 : 1))">
                    {{ grade.category === 'averageWeak' ? t(`${SCOPE}.gradingScale.categories.averageWeak`) : (grade.category === 'fail' ? t(`${SCOPE}.gradingScale.categories.fail`) : (grade.category === 'poor' ? t(`${SCOPE}.gradingScale.categories.poor`) : t(`${SCOPE}.gradingScale.categories.${grade.category}`))) }}
                  </td>
                  <td class="py-2 px-2 sm:px-3 text-muted-foreground">{{ grade.scale10 }}</td>
                  <td class="py-2 px-2 sm:px-3 text-muted-foreground">{{ grade.letter }}</td>
                  <td class="py-2 px-2 sm:px-3 text-muted-foreground">{{ grade.scale4 }}</td>
                  <td class="py-2 px-2 sm:px-3">
                    <span :class="[
                      'px-2 py-0.5 rounded text-xs font-medium',
                      grade.status === 'pass' ? 'bg-primary/10 text-primary' :
                      grade.status === 'conditional' ? 'bg-accent/10 text-accent' :
                      'bg-destructive/10 text-destructive'
                    ]">
                      {{ t(`${SCOPE}.gradingScale.status.${grade.status}`) }}
                    </span>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div class="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border space-y-3 sm:space-y-4">
          <div>
            <p class="text-xs sm:text-sm font-semibold text-foreground mb-2">{{ t(`${SCOPE}.gradingScale.notes.title1`) }}</p>
            <ul class="space-y-1.5 text-xs sm:text-sm text-muted-foreground ml-4">
              <li class="list-disc">{{ t(`${SCOPE}.gradingScale.notes.point1`) }}</li>
              <li class="list-disc">{{ t(`${SCOPE}.gradingScale.notes.point2`) }}</li>
              <li class="list-disc">{{ t(`${SCOPE}.gradingScale.notes.point3`) }}</li>
            </ul>
          </div>
          <div>
            <p class="text-xs sm:text-sm font-semibold text-foreground mb-2">{{ t(`${SCOPE}.gradingScale.notes.title3`) }}</p>
            <ul class="space-y-1.5 text-xs sm:text-sm text-muted-foreground ml-4">
              <li class="list-disc">{{ t(`${SCOPE}.gradingScale.notes.point6`) }}</li>
              <li class="list-disc">{{ t(`${SCOPE}.gradingScale.notes.point7`) }}</li>
              <li class="list-disc">{{ t(`${SCOPE}.gradingScale.notes.point8`) }}</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
