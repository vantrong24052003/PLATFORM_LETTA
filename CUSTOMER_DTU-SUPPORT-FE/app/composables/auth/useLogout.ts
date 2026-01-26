import { useApiFetch } from '@/lib/api'
import { AUTH_API } from '@/constants/api/auth.api'
import { useAuthStore } from '@/stores/auth'
import { useNavigation } from '@/composables/common/useNavigation'

export const useLogout = () => {
  const router = useRouter()
  const { navigateTo } = useNavigation()
  const { setUser } = useAuthStore()

  const { pending, error, execute } = useApiFetch<void>(AUTH_API.logout(),
    {
      method: 'POST',
      immediate: false,
    })

  const logout = async (redirectPath: string = '/') => {
    if (pending.value) return false
    try {
      await execute()
      if (error.value) throw error.value
      setUser(null)
      await router.push(navigateTo(redirectPath))
      return true
    } catch {
      return false
    }
  }

  return { isLoggingOut: pending, error, logout }
}
