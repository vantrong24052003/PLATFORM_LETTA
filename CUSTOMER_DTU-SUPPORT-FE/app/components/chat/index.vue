<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import * as Icon from '@/components/ui/icon'
import { useChatConversation } from '@/composables/chat/useChatConversation'
import { computed } from 'vue'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { cn, sanitizeHtml, handleKey } from '@/lib/utils'
import { CHAT_TONES } from '@/constants/chat/tones'

const { t } = useI18n()
const SCOPE = 'chat'

const { messages, isLoading, error, sendUserMessage } = useChatConversation()
const inputValue = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const selectedTone = ref<string | undefined>(undefined)
const currentToneLabel = computed(() => {
  const found = CHAT_TONES.find(tone => tone.value === selectedTone.value)
  return found ? t(`chat.tones.${found.labelKey}`) : t('chat.tones.button')
})

const handleSend = async () => {
  if (!inputValue.value.trim() || isLoading.value) return
  const content = inputValue.value.trim()
  inputValue.value = ''
  await sendUserMessage(content, selectedTone.value)
}

const handleKeyDown = (event: KeyboardEvent) => {
  handleKey(event, handleSend, {
    key: 'Enter',
    shiftKey: false,
  })
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

watch(messages, () => {
  scrollToBottom()
}, { deep: true })

const emit = defineEmits<{ close: [] }>()
const handleClose = () => {
  emit('close')
}

const getSanitizedHtml = (html: string | undefined): string => {
  if (!html) return ''
  return sanitizeHtml(html)
}

</script>

<template>
  <div class="flex flex-col h-full rounded-xl sm:rounded-2xl border border-border/30 bg-card text-card-foreground shadow-lg backdrop-blur-sm overflow-hidden bg-gradient-to-b from-card to-card/95">
    <div class="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border/30 bg-card/60 backdrop-blur-sm">
      <div class="inline-flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-accent/15 ring-2 ring-accent/20 flex items-center justify-center">
          <Icon.Bot class="w-4.5 h-4.5 text-accent" />
        </div>
        <span class="text-sm font-semibold text-foreground/90">Assistant</span>
      </div>
      <Button variant="secondary" size="sm" class="h-8 px-2.5" @click="handleClose">
        <Icon.X class="w-4 h-4" />
      </Button>
    </div>

    <div class="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent" ref="messagesContainer">
      <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-center px-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        <div class="relative mb-6">
          <div class="absolute inset-0 bg-accent/20 rounded-full blur-2xl animate-pulse"></div>
          <div class="relative bg-accent/10 rounded-full p-4 ring-2 ring-accent/20">
            <Icon.Bot class="w-12 h-12 sm:w-16 sm:h-16 text-accent relative z-10" />
          </div>
        </div>
        <h3 class="text-xl sm:text-2xl font-bold text-foreground mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          {{ t(`${SCOPE}.empty.title`) }}
        </h3>
        <p class="text-sm sm:text-base text-muted-foreground max-w-md leading-relaxed">
          {{ t(`${SCOPE}.empty.description`) }}
        </p>
      </div>

      <TransitionGroup
        tag="div"
        class="space-y-4"
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 transform translate-y-2.5"
        enter-to-class="opacity-100 transform translate-y-0"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="opacity-100 transform translate-y-0"
        leave-to-class="opacity-0 transform -translate-y-2.5"
      >
        <div v-for="msg in messages" :key="msg.id" class="flex flex-col gap-2">
          <div
            :class="cn(
              'flex gap-3 max-w-[82%] sm:max-w-[72%] md:max-w-[68%] transition-all duration-300',
              msg.role === 'user' ? 'ml-auto items-end ' : 'mr-auto items-start'
            )"
          >
            <div
              v-if="msg.role === 'assistant'"
              class="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center ring-2 ring-accent/20 shadow-sm"
            >
              <Icon.Bot class="w-5 h-5 text-accent" />
            </div>

            <div class="flex flex-col gap-2">
              <div
                :class="cn(
                  'rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base shadow-sm transition-all duration-200 leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-sm shadow-primary/20'
                    : 'bg-muted/70 backdrop-blur-sm text-foreground/90 rounded-tl-sm border border-border/30'
                )"
              >
                <p class="whitespace-pre-wrap break-words leading-relaxed">{{ msg.content }}</p>
              </div>

              <div
                v-if="msg.toolResult && msg.toolResult.uiHtml"
                class="max-w-full"
                v-html="getSanitizedHtml(msg.toolResult.uiHtml)"
              />
            </div>

            <div
              v-if="msg.role === 'user'"
              class="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-primary/20 shadow-sm"
            >
              <Icon.MessageCircle class="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>
      </TransitionGroup>

      <Transition
        mode="out-in"
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="isLoading" class="flex gap-3 max-w-[72%] mr-auto items-start">
          <div class="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center ring-2 ring-accent/20 shadow-sm animate-pulse">
            <Icon.Bot class="w-5 h-5 text-accent" />
          </div>
          <div class="bg-muted/80 backdrop-blur-sm text-muted-foreground rounded-2xl rounded-tl-sm px-4 py-3 border border-border/30 shadow-sm">
            <div class="flex gap-1.5">
              <span class="w-2 h-2 bg-accent rounded-full animate-bounce" style="animation-delay: 0s"></span>
              <span class="w-2 h-2 bg-accent rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
              <span class="w-2 h-2 bg-accent rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
            </div>
          </div>
        </div>
      </Transition>

    </div>

    <div class="border-t border-border/30 p-3 sm:p-4 bg-gradient-to-t from-muted/50 to-transparent backdrop-blur-sm">
      <div class="flex gap-2 sm:gap-3 items-center">
        <Input
          v-model="inputValue"
          :placeholder="t(`${SCOPE}.placeholder`)"
          :disabled="isLoading"
          @keydown="handleKeyDown"
          class="flex-1 border-border/30 focus-visible:ring-primary/20 shadow-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="secondary" size="lg" class="shadow-sm">
              <Icon.Palette class="w-4 h-4" />
              <span class="hidden sm:inline ml-2">{{ currentToneLabel }}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="min-w-[10rem] bg-popover text-popover-foreground border border-border/30 shadow-lg rounded-md p-1 z-[60]">
            <DropdownMenuItem
              v-for="tone in CHAT_TONES"
              :key="String(tone.value)"
              @click="selectedTone = tone.value"
              class="rounded-sm px-2 py-1.5 text-sm hover:bg-accent/10 hover:text-foreground focus:bg-accent/20 focus:text-foreground cursor-pointer"
            >
              {{ t(`chat.tones.${tone.labelKey}`) }}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          @click="handleSend"
          :disabled="isLoading || !inputValue.trim()"
          size="lg"
          class="shadow-sm hover:shadow-md transition-shadow"
        >
          <Icon.ChevronRight class="w-4 h-4" />
          <span class="hidden sm:inline ml-2">
            {{ isLoading ? t(`${SCOPE}.sending`) : t(`${SCOPE}.send`) }}
          </span>
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-thin::-webkit-scrollbar { width: 6px; }
.scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
.scrollbar-thin::-webkit-scrollbar-thumb { background-color: hsl(var(--border)); border-radius: 3px; }
.scrollbar-thin::-webkit-scrollbar-thumb:hover { background-color: hsl(var(--border) / 0.8); }
</style>
