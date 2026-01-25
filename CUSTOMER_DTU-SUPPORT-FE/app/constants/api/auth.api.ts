export const AUTH_API = {
  googleRedirect: (returnUrl?: string) => {
    const baseUrl = '/oauth/google/redirect'
    if (returnUrl) {
      return `${baseUrl}?return_url=${encodeURIComponent(returnUrl)}`
    }
    return baseUrl
  },
  logout: () => '/oauth/logout',
} as const
