import { reactive } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useI18n } from 'vue-i18n'
import { createPeSchema, type PeValues } from '@/schemas/gpa/pe'
import { useAuthStore } from '@/stores/auth'
import type { PeResult } from '@/types/gpa'

export const usePeCalculator = () => {
  const { t } = useI18n()

  const peSchema = createPeSchema(t)
  const peResult = reactive<PeResult>({ average: null, isPass: null, inputs: null })

  const { handleSubmit, isSubmitting, resetForm, values } = useForm<PeValues>({
    validationSchema: toTypedSchema(peSchema),
    validateOnMount: false,
    initialValues: { pe1: 0, pe2: 0, pe3: 0 },
  })

  const onPeSubmit = handleSubmit((values: PeValues) => {
    const auth = useAuthStore()
    const route = useRoute()
    if (!auth.user) {
      const redirect = encodeURIComponent(route.fullPath)
      navigateTo(`/login?redirect=${redirect}`)
      return
    }
    const sum = values.pe1 + values.pe2 + values.pe3
    const avg = sum / 3
    const rounded = Math.round(avg * 1000) / 1000
    peResult.average = rounded
    peResult.isPass = rounded >= 2
    peResult.inputs = { pe1: values.pe1, pe2: values.pe2, pe3: values.pe3 }
  })

  const onPeReset = () => {
    resetForm()
    peResult.average = null
    peResult.isPass = null
    peResult.inputs = null
  }

  return { peResult, onPeSubmit, onPeReset, isSubmitting, values }
}
