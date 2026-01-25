import { validateEnv } from '@/lib/env'

export default defineNuxtPlugin(() => {
  validateEnv()
})
