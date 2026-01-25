import { z } from 'zod'

export const peSchemaBase = z.object({
  pe1: z.coerce.number().min(0).max(4),
  pe2: z.coerce.number().min(0).max(4),
  pe3: z.coerce.number().min(0).max(4),
})

export type PeValues = z.infer<typeof peSchemaBase>

export const createPeSchema = (t: (key: string) => string) => {
  const SCOPE = 'tools.gpa'
  return peSchemaBase.extend({
    pe1: z.coerce
      .number({ message: t(`${SCOPE}.pe.validation.pe1.invalid`) })
      .min(0, t(`${SCOPE}.pe.validation.pe1.min`))
      .max(4, t(`${SCOPE}.pe.validation.pe1.max`)),
    pe2: z.coerce
      .number({ message: t(`${SCOPE}.pe.validation.pe2.invalid`) })
      .min(0, t(`${SCOPE}.pe.validation.pe2.min`))
      .max(4, t(`${SCOPE}.pe.validation.pe2.max`)),
    pe3: z.coerce
      .number({ message: t(`${SCOPE}.pe.validation.pe3.invalid`) })
      .min(0, t(`${SCOPE}.pe.validation.pe3.min`))
      .max(4, t(`${SCOPE}.pe.validation.pe3.max`)),
  })
}
