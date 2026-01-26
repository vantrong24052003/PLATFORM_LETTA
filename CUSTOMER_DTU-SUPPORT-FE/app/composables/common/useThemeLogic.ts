import { THEMES } from '@/constants/common/ui'

export const useThemeLogic = () => {
  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()

  const currentTheme = computed(
    () => (route.query.theme as string) || 'red-light'
  )

  const isShowingLightMode = ref<'light' | 'dark'>('light')

  const themeIconColor = computed(() => {
    const allThemeData = [...THEMES.light, ...THEMES.dark]
    const themeData = allThemeData.find(
      (theme) => theme.value === currentTheme.value
    )
    return themeData!.color
  })

  const handleThemeSwitch = (themeValue: string) => {
    router.push({ query: { ...route.query, theme: themeValue } })
  }

  const getThemeDisplayLabel = (value: string) => {
    const base = value.split('-')[0]
    return t(`common.ui.theme.names.${base}`)
  }

  const setHtmlAttributes = () =>
    useHead(() => ({ htmlAttrs: { 'data-theme': currentTheme.value } }))

  return { currentTheme, isShowingLightMode, themeIconColor, handleThemeSwitch, getThemeDisplayLabel, setHtmlAttributes }
}
