import { AUTH_API } from '@/constants/api/auth.api'

export const useGoogleLogin = () => {
  const config = useRuntimeConfig()
  const isRedirecting = ref(false)

  const redirectToGoogleLogin = () => {
    if (!import.meta.client) return
    if (isRedirecting.value) return
    isRedirecting.value = true

    const route = useRoute()
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    const targetPath = redirect.startsWith('/') ? redirect : '/'
    const returnUrl = `${window.location.origin}${targetPath}`
    const loginUrl = `${config.public.backendUrl}${AUTH_API.googleRedirect(returnUrl)}`
    window.location.replace(loginUrl)
  }

  return {
    isRedirecting,
    redirectToGoogleLogin,
  }
}
