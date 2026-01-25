<script setup lang="ts">
import { useAuth } from '@/composables/auth'

const { getCurrentUser } = useAuth()
const route = useRoute()
const router = useRouter()

const isLoading = ref(true)
const error = ref<string | null>(null)
const hasRedirected = ref(false)

onMounted(async () => {
  if (import.meta.client) {
    try {
      const rawReturnUrl = route.query.return_url
      const returnUrl = typeof rawReturnUrl === 'string' && rawReturnUrl.length > 0 ? rawReturnUrl : '/'
      const user = await getCurrentUser()

      if (user) {
        if (hasRedirected.value) return
        hasRedirected.value = true
        window.location.replace(decodeURIComponent(returnUrl))
      } else {
        error.value = 'Authentication failed. Please try again.'
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      }
    } catch (err) {
      error.value = 'An error occurred during authentication.'
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } finally {
      isLoading.value = false
    }
  }
})
</script>

<template>
  <section class="bg-background text-foreground min-h-screen flex items-center justify-center">
    <div class="container mx-auto px-4 text-center">
      <div v-if="isLoading">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        <p class="mt-4 text-muted-foreground">Completing authentication...</p>
      </div>
      <div v-else-if="error" class="text-destructive">
        <p>{{ error }}</p>
        <p class="mt-2 text-sm text-muted-foreground">Redirecting to login...</p>
      </div>
    </div>
  </section>
</template>
