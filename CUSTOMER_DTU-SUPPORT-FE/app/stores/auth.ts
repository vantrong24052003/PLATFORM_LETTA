import type { User } from '@/types/common'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const hasSessionChecked = ref(false)

  const setUser = (u: User | null) => { user.value = u }

  const setHasSessionChecked = (v: boolean) => { hasSessionChecked.value = v }

  return {
    user,
    hasSessionChecked,
    setUser,
    setHasSessionChecked,
  }
})
