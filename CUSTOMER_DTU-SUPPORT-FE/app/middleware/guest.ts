import { useAuthStore } from '@/stores/auth'
import { useApiFetch } from '@/lib/api'
import { USER_API } from '@/constants/api/user.api'
import type { User } from '@/types/common'

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()
  if (!auth.user) {
    try {
      const { data, execute } = useApiFetch<User>(USER_API.me(), {
        method: 'GET',
        immediate: false,
      })
      await execute()
      if (data.value?.data) {
        auth.setUser(data.value.data)
      } else {
        auth.setUser(null)
      }
    } catch {
      auth.setUser(null)
    }
  }

  if (auth.user) {
    const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : '/'
    return navigateTo(redirect)
  }
})
