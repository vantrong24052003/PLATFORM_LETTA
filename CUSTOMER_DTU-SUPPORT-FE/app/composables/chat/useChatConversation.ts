import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Message, ToolResult, ChatMessage } from '@/types/chat'
import { useChatApi } from './useChatApi'
import { CHAT_SYSTEM_MESSAGE } from '@/constants/gpa/chat'

export const useChatConversation = () => {
  const { sendChatMessage, isSending, apiError } = useChatApi()
  const messages = ref<Message[]>([])
  const isLoading = isSending
  const { t } = useI18n()

  const addMessage = (
    role: 'user' | 'assistant',
    content: string,
    toolResult?: ToolResult
  ) => {
    messages.value.push({
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      role,
      content,
      timestamp: new Date(),
      toolResult,
    })
  }

  const sendUserMessage = async (content: string, tone?: string) => {
    if (!content.trim() || isLoading.value) return

    addMessage('user', content)

    try {
      const chatMessages: ChatMessage[] = [
        {
          role: 'system',
          content: CHAT_SYSTEM_MESSAGE,
        },
        ...messages.value.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ]

      const response = await sendChatMessage(chatMessages, tone)

      addMessage('assistant', response.content, response.toolResult)
    } catch (err) {
      addMessage('assistant', t('chat.error.message'))
    } finally {
    }
  }

  return { messages, isLoading, error: apiError, sendUserMessage }
}
