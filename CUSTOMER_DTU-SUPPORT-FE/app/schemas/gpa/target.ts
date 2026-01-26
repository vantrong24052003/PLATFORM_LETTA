import { z } from 'zod'

export const targetSchemaBase = z.object({
  completedCredits: z.coerce.number().int().min(0),
  currentGpa: z.coerce.number().min(0).max(4),
  targetGpa: z.coerce.number().min(0.01).max(4),
  remainingCredits: z.coerce.number().int().min(1),
})

export type TargetValues = z.infer<typeof targetSchemaBase>

export const createTargetSchema = (t: (key: string) => string) => {
  const SCOPE = 'tools.gpa'
  return targetSchemaBase.extend({
    completedCredits: z.coerce
      .number({ message: t(`${SCOPE}.target.validation.completedCredits.invalid`) })
      .int(t(`${SCOPE}.target.validation.completedCredits.invalid`))
      .min(0, t(`${SCOPE}.target.validation.completedCredits.invalid`)),
    currentGpa: z.coerce
      .number({ message: t(`${SCOPE}.target.validation.currentGpa.invalid`) })
      .min(0, t(`${SCOPE}.target.validation.currentGpa.min`))
      .max(4, t(`${SCOPE}.target.validation.currentGpa.max`)),
    targetGpa: z.coerce
      .number({ message: t(`${SCOPE}.target.validation.targetGpa.invalid`) })
      .min(0.01, t(`${SCOPE}.target.validation.targetGpa.min`))
      .max(4, t(`${SCOPE}.target.validation.targetGpa.max`)),
    remainingCredits: z.coerce
      .number({ message: t(`${SCOPE}.target.validation.remainingCredits.invalid`) })
      .int(t(`${SCOPE}.target.validation.remainingCredits.invalid`))
      .min(1, t(`${SCOPE}.target.validation.remainingCredits.min`)),
  })
}
