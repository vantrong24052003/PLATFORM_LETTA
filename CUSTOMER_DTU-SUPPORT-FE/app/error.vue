<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { useNavigation } from '@/composables/common/useNavigation'
import { useRouter } from 'vue-router'
import logoDtu from '@/assets/images/logo-dtu.png'
import { useThemeLogic } from '@/composables/common/useThemeLogic'

const { t } = useI18n()
const { navigateTo } = useNavigation()
const router = useRouter()
const { setHtmlAttributes } = useThemeLogic()

setHtmlAttributes()

const popularLinks = [
  { key: 'tools', to: '/tools', label: t('common.header.menu.tools') },
  { key: 'marketplace', to: '/marketplace', label: t('common.header.menu.marketplace') },
  { key: 'services', to: '/services', label: t('common.header.menu.services') },
]

const handleGoHome = () => {
  const homeLink = navigateTo('/')
  router.push(homeLink)
}

const handleLinkClick = (path: string) => {
  const link = navigateTo(path)
  router.push(link)
}
</script>

<template>
  <div class="min-h-dvh bg-background text-foreground flex items-center justify-center px-4">
    <div class="max-w-2xl mx-auto text-center">
      <div class="mb-8 flex justify-center">
        <div class="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center border-0">
          <img :src="logoDtu" alt="DTU Logo" class="w-16 h-16 object-contain" />
        </div>
      </div>

      <h1 class="text-4xl sm:text-5xl font-black text-foreground mb-4">
        {{ t('common.brand.titleFull') }}
      </h1>
      <p class="text-lg sm:text-xl text-muted-foreground mb-8">
        {{ t('common.error.subtitle') }}
      </p>

      <div class="mb-8">
        <p class="text-sm text-muted-foreground mb-4">{{ t('common.error.suggestions') }}</p>
        <div class="flex flex-wrap justify-center gap-3">
          <Button
            v-for="link in popularLinks"
            :key="link.key"
            variant="outline"
            @click="handleLinkClick(link.to)"
          >
            {{ link.label }}
          </Button>
        </div>
      </div>

      <Button @click="handleGoHome">
        {{ t('common.error.backHome') }}
      </Button>
    </div>
  </div>
</template>
