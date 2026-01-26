<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import * as Icon from '@/components/ui/icon'
import ChatBox from '@/components/chat/index.vue'
import { handleKey } from '@/lib/utils'

const isOpen = ref(false)
const showButton = ref(true)

watch(isOpen, (newValue) => {
  if (newValue) {
    showButton.value = false
  } else {
    setTimeout(() => { showButton.value = true }, 250)
  }
})

const handleToggle = () => { isOpen.value = !isOpen.value }

const handleKeydown = (e: KeyboardEvent) => {
  handleKey(e, () => { isOpen.value = false }, { key: 'Escape' })
}

onMounted(() => { window.addEventListener('keydown', handleKeydown) })
onBeforeUnmount(() => { window.removeEventListener('keydown', handleKeydown) })
</script>

<template>
  <Teleport to="body">
  <div class="fixed right-4 sm:right-6 md:right-8 z-50" :style="{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 88px)' }">
    <Transition name="dock">
      <div
        v-show="isOpen"
        class="mb-3 w-[92vw] max-w-sm sm:max-w-md md:max-w-md rounded-2xl border border-border/30 bg-card text-card-foreground shadow-2xl overflow-hidden ring-1 ring-border/30"
      >
        <div class="h-[55vh] sm:h-[60vh] min-h-[420px] max-h-[560px] w-full">
          <ChatBox @close="isOpen = false" />
        </div>
      </div>
    </Transition>

    <button
      v-if="showButton && !isOpen"
      type="button"
      aria-label="Toggle AI Chat"
      class="button-fade-in inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-primary/40"
      @click="handleToggle"
    >
      <Icon.Bot class="w-6 h-6" />
    </button>
  </div>
  </Teleport>
</template>

<style scoped>
.dock-enter-active, .dock-leave-active { transition: all 0.2s ease; }
.dock-enter-from, .dock-leave-to { opacity: 0; transform: translateY(8px) scale(0.98); }
.button-fade-in { animation: fadeIn 0.15s ease-out 0.05s forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>
