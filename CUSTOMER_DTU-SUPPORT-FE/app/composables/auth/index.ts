import { useAuthStore } from '@/stores/auth'
import { useLogout } from '@/composables/auth/useLogout'
import { useGoogleLogin } from '@/composables/auth/useGoogleLogin'
import { useCurrentUser } from '@/composables/auth/useCurrentUser'

export const useAuth = () => {
  const authStore = useAuthStore()

  const isLoading = ref(false)
  const { isRedirecting, redirectToGoogleLogin } = useGoogleLogin()
  const { isLoggingOut, error, logout } = useLogout()
  const { getCurrentUser } = useCurrentUser()

  const isAuthenticated = computed(() => !!authStore.user)

  return {
    user: authStore.user,
    isLoading,
    isRedirecting,
    isLoggingOut,
    error,
    isAuthenticated,
    redirectToGoogleLogin,
    getCurrentUser,
    logout,
  }
}
