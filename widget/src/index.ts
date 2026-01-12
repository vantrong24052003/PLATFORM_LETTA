import { loadBotConfig } from './bot';
import { createAgent, setAgent, getCurrentAgent } from './agent';
import { renderBubble, renderChatbox, toggleChat, openChat, closeChat, addMessage, getInputElement } from './ui';
import { sendMessage, displayMessages } from './chat';
import type { BotConfig, ThemeConfig, ChatbotWidgetAPI } from './types';

(function(): ChatbotWidgetAPI | undefined {
  let botConfig: BotConfig | null = null;
  let chatbotId: string | null = null;
  let onBubbleClickCallback: (() => void | Promise<void>) | null = null;

  const scripts = document.getElementsByTagName('script');
  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];
    const assistantId = script.getAttribute('data-assistant-id');
    if (assistantId) {
      chatbotId = assistantId;
      break;
    }
  }

  if (!chatbotId) {
    console.error('ChatbotWidget: data-assistant-id not found');
    return undefined;
  }

  async function init(): Promise<void> {
    try {
      if (!chatbotId) return;

      botConfig = await loadBotConfig(chatbotId);

      const theme: ThemeConfig = typeof botConfig.theme_config === 'string'
        ? JSON.parse(botConfig.theme_config)
        : botConfig.theme_config || {};

      renderBubble(theme);
      const { closeBtn, sendBtn, inputElement } = renderChatbox(botConfig);

      // Add greeting message
      setTimeout(() => {
        if (!botConfig) return;
        const greeting = botConfig.greeting || 'Hello! How can I help you?';
        addMessage(greeting, 'assistant');
      }, 500);

      // Event listeners
      const bubble = document.getElementById('chatbot-bubble');
      if (bubble) {
        bubble.addEventListener('click', async () => {
          if (onBubbleClickCallback) {
            await onBubbleClickCallback();
          } else {
            if (!getCurrentAgent() && chatbotId) {
              await createAgent(chatbotId);
            }
            toggleChat();
          }
        });
      }

      closeBtn.addEventListener('click', closeChat);

      sendBtn.addEventListener('click', async () => {
        await handleSendMessage(inputElement);
      });

      inputElement.addEventListener('keypress', async (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          await handleSendMessage(inputElement);
        }
      });

    } catch (error) {
      console.error('ChatbotWidget initialization failed:', error);
    }
  }

  async function handleSendMessage(inputElement: HTMLInputElement): Promise<void> {
    const message = inputElement.value.trim();
    if (!message) return;

    // Add user message to UI
    addMessage(message, 'user');
    inputElement.value = '';

    try {
      // Send to backend
      const response = await sendMessage(message);

      // Display assistant response
      if (response && response.messages) {
        displayMessages(response);
      }
    } catch (error) {
      addMessage('Sorry, something went wrong. Please try again.', 'assistant');
      console.error('Error:', error);
    }
  }

  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Create public API
  const API: ChatbotWidgetAPI = {
    setAgent: (agentId: string) => {
      setAgent(agentId);
    },

    createAgent: async (userId?: string) => {
      if (!chatbotId) throw new Error('Chatbot ID not found');
      return await createAgent(chatbotId, userId);
    },

    getOrCreateAgent: async (userId?: string) => {
      if (!chatbotId) throw new Error('Chatbot ID not found');
      return await createAgent(chatbotId, userId);
    },

    openChat: () => {
      openChat();
    },

    closeChat: () => {
      closeChat();
    },

    sendMessage: async (message: string) => {
      const inputElement = getInputElement();
      if (inputElement) {
        inputElement.value = message;
        await handleSendMessage(inputElement);
      }
    },

    onBubbleClick: (callback: () => void | Promise<void>) => {
      onBubbleClickCallback = callback;
    },
  };

  // Expose to both window and return for webpack
  window.ChatbotWidget = API;
  return API;
})();

// Export for webpack
export default window.ChatbotWidget;
