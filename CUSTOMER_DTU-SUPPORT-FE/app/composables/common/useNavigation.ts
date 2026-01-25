import type { LocaleCode } from '@/types/common'

export const useNavigation = () => {
  const route = useRoute()
  const { locale } = useI18n()

  const navigateTo = (path: string) => {
    const currentTheme = route.query.theme as string
    const currentLocale = locale.value as LocaleCode

    const targetPath = currentLocale === 'en' ? path : `/${currentLocale}${path}`
    const query = currentTheme ? { theme: currentTheme } : {}
    return { path: targetPath, query }
  }

  const getLocalePath = (path: string): string => {
    const currentLocale = locale.value as LocaleCode
    return currentLocale === 'en' ? path : `/${currentLocale}${path}`
  }

  return { navigateTo, getLocalePath }
}
