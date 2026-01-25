import type { LocaleCode } from '@/types/common'
import { LOCALES } from '@/constants/common/ui'

export const useLocaleLogic = () => {
  const { locale, locales } = useI18n()
  const switchLocalePath = useSwitchLocalePath()
  const router = useRouter()

  const localeList = computed(() => {
    return locales.value.map((localeItem) => {
      const localeCode =
        typeof localeItem === 'string' ? localeItem : localeItem.code
      const localeInfo = LOCALES.find((locale) => locale.code === localeCode)
      return { code: localeCode as LocaleCode, name: localeInfo?.name || localeCode.toUpperCase(), label: localeInfo?.name || localeCode.toUpperCase(), englishName: localeInfo?.englishName || localeCode.toUpperCase() }
    })
  })

  const isLocaleActive = (code: string) => locale.value === code

  const handleLocaleSwitch = async (code: LocaleCode) => {
    if (locale.value === code) return
    const currentScrollY = window.scrollY
    const targetPath = switchLocalePath(code)
    await router.push(targetPath)
    requestAnimationFrame(() => {
      window.scrollTo({ top: currentScrollY, behavior: 'auto' })
    })
  }

  return { localeList, isLocaleActive, handleLocaleSwitch }
}
