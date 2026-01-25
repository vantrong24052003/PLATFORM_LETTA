<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { Theme } from '@/components/ui/theme-selector'
import * as Icon from '@/components/ui/icon'
import LocaleSwitcher from './LocaleSwitcher.vue'
import { useNavigation } from '@/composables/common/useNavigation'
import { NAV_ITEMS } from '@/constants/features/home'
import logoDtu from '@/assets/images/logo-dtu.png'
import { useAuthStore } from '@/stores/auth'
import { useAuth } from '@/composables/auth'
import { useFadeIn } from '@/composables/animations/useFadeIn'

const { t } = useI18n()
const { navigateTo } = useNavigation()
const { logout, isLoggingOut } = useAuth()

const isMenuOpen = ref(false)
const route = useRoute()
const auth = useAuthStore()
const showLogin = computed(() => auth.hasSessionChecked && !auth.user)
const showLogout = computed(() => auth.hasSessionChecked && !!auth.user)

const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value }
const closeMenu = () => { isMenuOpen.value = false }
const scrollToSection = (sectionId: string) => {
  closeMenu()
  const element = document.querySelector(sectionId)
  if (element) { element.scrollIntoView({ behavior: 'smooth' }) }
}

const handleNavClick = (event: MouseEvent, item: { to: string; scroll?: boolean }) => {
  if (item.scroll) {
    event.preventDefault()
    scrollToSection(item.to)
  }
}
const getNavLink = (item: { to: string; scroll?: boolean }) => {
  if (item.scroll) { return { path: route.path, query: route.query } }
  return navigateTo(item.to)
}
const handleMobileNavClick = (event: MouseEvent, item: { to: string; scroll?: boolean }) => {
  handleNavClick(event, item)
  if (!item.scroll) closeMenu()
}

const navItems = computed(() => {
  const path = route.path
  const isHomePage = path === '/' || path.match(/^\/[a-z]{2}$/)

  return NAV_ITEMS.map((item) => ({
    label: t(`common.header.menu.${item.key}`),
    to: item.to,
    scroll: isHomePage && 'scroll' in item ? item.scroll : false,
  }))
})

const { elementRef: headerRef } = useFadeIn({ delay: 100 })
</script>

<template>
  <header ref="headerRef" class="bg-background shadow-lg sticky top-0 z-50">
    <div class="container mx-auto px-3 sm:px-4 lg:px-6">
      <div class="flex items-center justify-between h-14 sm:h-16">
        <NuxtLink :to="navigateTo('/')" class="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-shrink-0"
          @click="closeMenu">
          <div
            class="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center border-0 flex-shrink-0">
            <img :src="logoDtu" alt="DTU Logo" class="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 object-contain" />
          </div>

          <div class="hidden sm:block flex-shrink-0 min-w-0 max-w-[200px] md:max-w-none">
            <h1 class="text-base sm:text-lg md:text-xl font-bold text-foreground truncate">
              {{ t('common.brand.titleFull') }}
            </h1>
            <p class="text-xs sm:text-xs text-muted-foreground truncate">
              {{ t('common.brand.subtitle') }}
            </p>
          </div>

          <div class="sm:hidden flex-shrink-0 min-w-0">
            <h1 class="text-xs sm:text-sm font-bold text-foreground truncate">
              {{ t('common.brand.titleShort') }}
            </h1>
          </div>
        </NuxtLink>

        <nav class="hidden lg:flex items-center justify-center flex-1 space-x-6">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="getNavLink(item)"
            class="text-[#D1D5DB] hover:text-foreground transition-colors duration-200 font-medium text-sm leading-[1.43em] whitespace-nowrap"
            active-class="text-foreground"
            @click="handleNavClick($event, item)"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="hidden lg:flex items-center space-x-2 xl:space-x-3 flex-shrink-0">
          <Theme />
          <LocaleSwitcher />
          <div class="h-5 xl:h-6 w-px bg-border"></div>
          <NuxtLink v-if="showLogin" :to="navigateTo('/login')">
            <Button size="sm" class="text-xs xl:text-sm whitespace-nowrap px-3 xl:px-4">{{ t('common.auth.login.button') }}</Button>
          </NuxtLink>
          <Button v-if="showLogout" size="sm" variant="outline" class="text-xs xl:text-sm whitespace-nowrap px-3 xl:px-4" :disabled="isLoggingOut" @click="logout('/')">
            {{ t('common.auth.logout.button') }}
          </Button>
        </div>

        <Button as="button" variant="ghost" size="icon" @click="toggleMenu"
          class="lg:hidden text-foreground rounded-lg w-9 h-9 sm:w-10 sm:h-10 hover:bg-[hsl(var(--accent)/0.12)] active:bg-[hsl(var(--accent)/0.16)] transition-colors duration-150 flex items-center flex-shrink-0"
          aria-label="Toggle menu">
          <Icon.Menu v-if="!isMenuOpen" class="w-5 h-5 sm:w-6 sm:h-6" />
          <Icon.X v-else class="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
      </div>

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 transform -translate-y-2"
        enter-to-class="opacity-100 transform translate-y-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 transform translate-y-0"
        leave-to-class="opacity-0 transform -translate-y-2"
      >
        <div v-if="isMenuOpen" class="lg:hidden border-t border-border bg-background max-h-[calc(100vh-3.5rem)] overflow-y-auto">
        <nav class="py-3 sm:py-4 space-y-1 sm:space-y-2">
          <NuxtLink v-for="item in navItems" :key="item.to" :to="getNavLink(item)"
            class="block text-[#D1D5DB] hover:text-foreground transition-colors duration-150 font-medium text-sm leading-[1.43em] px-3 sm:px-4 py-2 sm:py-2.5"
            active-class="text-foreground" @click="handleMobileNavClick($event, item)">
            {{ item.label }}
          </NuxtLink>

          <div class="pt-3 sm:pt-4 border-t border-border space-y-3 sm:space-y-4 px-3 sm:px-4">
            <div class="flex items-center justify-center gap-3 pb-2">
              <Theme />
              <LocaleSwitcher />
            </div>

            <div class="space-y-2">
              <NuxtLink v-if="showLogin" :to="navigateTo('/login')" class="block" @click="closeMenu">
                <Button class="w-full justify-center text-sm sm:text-base">
                  {{ t('common.auth.login.button') }}
                </Button>
              </NuxtLink>
              <Button v-if="showLogout" class="w-full justify-center text-sm sm:text-base" variant="destructive" :disabled="isLoggingOut" @click="() => { logout('/'); closeMenu() }">
                {{ t('common.auth.logout.button') }}
              </Button>
            </div>
          </div>
        </nav>
        </div>
      </Transition>
    </div>
  </header>
</template>
