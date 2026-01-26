import { reactive, ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useI18n } from 'vue-i18n'
import { createPassSchema, type PassValues } from '@/schemas/gpa/pass'
import type { ScoreComponent, PassResult, PassResultPrediction } from '@/types/gpa'
import { useAuthStore } from '@/stores/auth'

const convertScore10ToLetter = (score: number): { letter: string; gpa4: number; badgeColor: string; status: 'pass' | 'fail' } => {
  if (score >= 9.5) return { letter: 'A+', gpa4: 4.0, badgeColor: 'primary', status: 'pass' }
  if (score >= 8.5) return { letter: 'A', gpa4: 4.0, badgeColor: 'primary', status: 'pass' }
  if (score >= 8.0) return { letter: 'A-', gpa4: 3.65, badgeColor: 'accent', status: 'pass' }
  if (score >= 7.5) return { letter: 'B+', gpa4: 3.33, badgeColor: 'accent', status: 'pass' }
  if (score >= 7.0) return { letter: 'B', gpa4: 3.0, badgeColor: 'muted', status: 'pass' }
  if (score >= 6.5) return { letter: 'B-', gpa4: 2.65, badgeColor: 'muted', status: 'pass' }
  if (score >= 6.0) return { letter: 'C+', gpa4: 2.33, badgeColor: 'muted', status: 'pass' }
  if (score >= 5.5) return { letter: 'C', gpa4: 2.0, badgeColor: 'muted', status: 'pass' }
  if (score >= 4.5) return { letter: 'C-', gpa4: 1.65, badgeColor: 'muted', status: 'pass' }
  if (score >= 4.0) return { letter: 'D', gpa4: 1.0, badgeColor: 'muted', status: 'pass' }
  return { letter: 'F', gpa4: 0.0, badgeColor: 'destructive', status: 'fail' }
}

export const usePassCalculator = () => {
  const { t } = useI18n()

  const passSchema = createPassSchema(t)
  const passResult = reactive<PassResult>({
    requiredFinalScore: null,
    canPass: null,
    currentScore: null,
    currentTotalWeight: null,
    remainingWeight: null,
    formula: null,
    predictionResult: null,
  })

  const scoreComponents = ref<ScoreComponent[]>([])
  const totalWeight = ref(0)

  const { handleSubmit, isSubmitting, setFieldValue, values } = useForm<PassValues>({
    validationSchema: toTypedSchema(passSchema),
    validateOnMount: false,
    initialValues: { components: [], finalExamWeight: 50, minPassingScore: 4.0, finalExamScore: undefined },
  })

  const updateTotalWeight = () => {
    totalWeight.value = scoreComponents.value.reduce((sum, comp) => sum + comp.weight, 0)
  }

  const addScoreComponent = () => {
    const newId = `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    scoreComponents.value.push({ id: newId, name: `Cột điểm ${scoreComponents.value.length + 1}`, weight: 10, score: 0 })
    updateTotalWeight()
  }

  const removeScoreComponent = (id: string) => {
    scoreComponents.value = scoreComponents.value.filter((comp) => comp.id !== id)
    updateTotalWeight()
  }

  const updateScoreComponent = (id: string, updates: Partial<ScoreComponent>) => {
    const index = scoreComponents.value.findIndex((comp) => comp.id === id)
    if (index !== -1) {
      const current = scoreComponents.value[index]
      if (current) {
        scoreComponents.value[index] = { id: current.id, name: updates.name ?? current.name, weight: updates.weight ?? current.weight, score: updates.score ?? current.score }
        updateTotalWeight()
      }
    }
  }

  const calculateRequiredScore = (values: PassValues) => {
    const currentScore = values.components.reduce((sum, comp) => sum + (comp.score * comp.weight / 100), 0)
    const currentTotalWeight = values.components.reduce((sum, comp) => sum + comp.weight, 0)
    const remainingWeight = values.finalExamWeight

    passResult.currentScore = Math.round(currentScore * 100) / 100
    passResult.currentTotalWeight = currentTotalWeight
    passResult.remainingWeight = remainingWeight

    const requiredScore = (values.minPassingScore - currentScore) / (remainingWeight / 100)

    if (requiredScore > 10.0) {
      passResult.requiredFinalScore = null
      passResult.canPass = false
      passResult.formula = `(${values.minPassingScore} - ${currentScore.toFixed(2)}) / ${(remainingWeight / 100).toFixed(2)} = ${requiredScore.toFixed(2)} (> 10.0, không thể đậu)`
    } else {
      const requiredFinalScore = Math.max(1.0, Math.min(10.0, requiredScore))
      passResult.requiredFinalScore = Math.round(requiredFinalScore * 100) / 100
      passResult.canPass = true
      passResult.formula = `(${values.minPassingScore} - ${currentScore.toFixed(2)}) / ${(remainingWeight / 100).toFixed(2)} = ${requiredFinalScore.toFixed(2)}`
    }
  }

  const calculatePredictionFromScore = (finalScore: number): PassResultPrediction => {
    const conversion = convertScore10ToLetter(finalScore)
    return {
      finalScore: Math.round(finalScore * 100) / 100,
      letterGrade: conversion.letter,
      gpa4: conversion.gpa4,
      badgeColor: conversion.badgeColor,
      status: conversion.status,
    }
  }

  const onPassSubmit = handleSubmit((values: PassValues) => {
    const auth = useAuthStore()
    const route = useRoute()
    if (!auth.user) {
      const redirect = encodeURIComponent(route.fullPath)
      navigateTo(`/login?redirect=${redirect}`)
      return
    }

    const totalWeight = values.components.reduce((sum, comp) => sum + comp.weight, 0) + values.finalExamWeight
    if (Math.abs(totalWeight - 100) > 0.01) {
      passResult.requiredFinalScore = null
      passResult.canPass = null
      passResult.currentScore = null
      passResult.predictionResult = null
      return
    }

    calculateRequiredScore(values)

    if (values.finalExamScore !== undefined) {
      const currentScore = values.components.reduce((sum, comp) => sum + (comp.score * comp.weight / 100), 0)
      const remainingWeight = values.finalExamWeight
      const finalScore = currentScore + (values.finalExamScore * remainingWeight / 100)
      passResult.predictionResult = calculatePredictionFromScore(finalScore)
    } else {
      passResult.predictionResult = null
    }
  })

  const calculatePrediction = (predictedScore: number) => {
    if (!values.components || values.components.length === 0) return

    const currentScore = values.components.reduce((sum, comp) => sum + (comp.score * comp.weight / 100), 0)
    const remainingWeight = values.finalExamWeight
    const finalScore = currentScore + (predictedScore * remainingWeight / 100)
    passResult.predictionResult = calculatePredictionFromScore(finalScore)
  }

  const resetForm = () => {
    scoreComponents.value = []
    totalWeight.value = 0
    passResult.requiredFinalScore = null
    passResult.canPass = null
    passResult.currentScore = null
    passResult.currentTotalWeight = null
    passResult.remainingWeight = null
    passResult.formula = null
    passResult.predictionResult = null
  }

  watch(
    () => scoreComponents.value,
    () => {
      setFieldValue('components', scoreComponents.value.map((comp) => ({ id: comp.id, name: comp.name, weight: comp.weight, score: comp.score })))
    },
    { deep: true }
  )

  return {
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
  }
}
