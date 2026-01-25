<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogIn, Lock } from '@/components/ui/icon'
import { useAuth } from '@/composables/auth'

const { t } = useI18n()
const { redirectToGoogleLogin, isRedirecting } = useAuth()
const SCOPE = 'common.auth.login'

definePageMeta({
  middleware: 'guest',
})
</script>

<template>
  <section class="bg-background text-foreground min-h-screen flex items-center justify-center py-12 sm:py-14 md:py-20">
    <div class="container mx-auto px-4 sm:px-6 w-full">
      <div class="max-w-md mx-auto">
        <div class="text-center mb-6 sm:mb-8">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent ring-1 ring-accent/20 text-xs sm:text-sm mb-3 sm:mb-4">
            <LogIn class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{{ t('common.auth.login.button') }}</span>
          </div>
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight px-2">
            <span class="text-foreground">{{ t(`${SCOPE}.title`) }}</span>
          </h1>
          <p class="text-foreground/80 mt-3 sm:mt-3 md:mt-4 text-sm sm:text-base md:text-lg max-w-xl mx-auto px-4">
            {{ t(`${SCOPE}.subtitle`) }}
          </p>
        </div>

        <Card class="rounded-xl sm:rounded-2xl border border-border/20 bg-card text-card-foreground shadow-md backdrop-blur-sm">
          <CardHeader class="p-4 sm:p-5 md:p-6">
            <CardTitle class="text-base sm:text-lg md:text-xl font-bold text-foreground mb-1.5 flex items-center gap-2">
              <Lock class="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              {{ t(`${SCOPE}.title`) }}
            </CardTitle>
            <CardDescription class="text-xs sm:text-sm text-muted-foreground">
              {{ t(`${SCOPE}.subtitle`) }}
            </CardDescription>
          </CardHeader>
          <CardContent class="p-4 sm:p-5 md:p-6 pt-0">
            <div class="flex flex-col gap-4">
              <Button size="lg" class="w-full" type="button" :disabled="isRedirecting" @click="redirectToGoogleLogin">
                <LogIn class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {{ t(`${SCOPE}.buttons.google`) }}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>
