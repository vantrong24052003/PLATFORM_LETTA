import { z } from 'zod'

export const creditDistributionSchema = z.object({
  id: z.string(),
  credits: z.coerce.number().int().min(1),
  gradeValue: z.string(),
})

export const simulationSchemaBase = z.object({
  completedCredits: z.coerce.number().int().min(0),
  currentGpa: z.coerce.number().min(0).max(4),
  remainingCredits: z.coerce.number().int().min(1),
  creditDistributions: z.array(creditDistributionSchema).min(1),
})

export type SimulationValues = z.infer<typeof simulationSchemaBase>
export type CreditDistributionValues = z.infer<typeof creditDistributionSchema>

export const createSimulationSchema = (t: (key: string) => string) => {
  const SCOPE = 'tools.gpa'
  return simulationSchemaBase.extend({
    completedCredits: z.coerce
      .number({ message: t(`${SCOPE}.simulation.validation.completedCredits.invalid`) })
      .int(t(`${SCOPE}.simulation.validation.completedCredits.invalid`))
      .min(0, t(`${SCOPE}.simulation.validation.completedCredits.invalid`)),
    currentGpa: z.coerce
      .number({ message: t(`${SCOPE}.simulation.validation.currentGpa.invalid`) })
      .min(0, t(`${SCOPE}.simulation.validation.currentGpa.min`))
      .max(4, t(`${SCOPE}.simulation.validation.currentGpa.max`)),
    remainingCredits: z.coerce
      .number({ message: t(`${SCOPE}.simulation.validation.remainingCredits.invalid`) })
      .int(t(`${SCOPE}.simulation.validation.remainingCredits.invalid`))
      .min(1, t(`${SCOPE}.simulation.validation.remainingCredits.min`)),
    creditDistributions: z
      .array(creditDistributionSchema)
      .min(1, t(`${SCOPE}.simulation.validation.creditDistributions.min`)),
  })
}
