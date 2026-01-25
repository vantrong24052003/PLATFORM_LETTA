import { z } from 'zod'

export const scoreComponentSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  weight: z.coerce.number().min(0).max(100),
  score: z.coerce.number().min(0).max(10),
})

export const passSubjectSchemaBase = z.object({
  components: z.array(scoreComponentSchema).min(1),
  finalExamWeight: z.coerce.number().min(0).max(100),
  minPassingScore: z.coerce.number().min(0).max(10),
  finalExamScore: z.coerce.number().min(0).max(10).optional(),
})

export type PassValues = z.infer<typeof passSubjectSchemaBase>
export type ScoreComponentValues = z.infer<typeof scoreComponentSchema>

export const createPassSchema = (t: (key: string) => string) => {
  const SCOPE = 'tools.pass'
  return passSubjectSchemaBase.extend({
    components: z
      .array(scoreComponentSchema)
      .min(1, t(`${SCOPE}.validation.components.min`)),
    finalExamWeight: z.coerce
      .number({ message: t(`${SCOPE}.validation.finalExamWeight.invalid`) })
      .min(0, t(`${SCOPE}.validation.finalExamWeight.min`))
      .max(100, t(`${SCOPE}.validation.finalExamWeight.max`)),
    minPassingScore: z.coerce
      .number({ message: t(`${SCOPE}.validation.minPassingScore.invalid`) })
      .min(0, t(`${SCOPE}.validation.minPassingScore.min`))
      .max(10, t(`${SCOPE}.validation.minPassingScore.max`)),
    finalExamScore: z.coerce
      .number({ message: t(`${SCOPE}.validation.finalExamScore.invalid`) })
      .min(0, t(`${SCOPE}.validation.finalExamScore.min`))
      .max(10, t(`${SCOPE}.validation.finalExamScore.max`))
      .optional(),
  })
}
