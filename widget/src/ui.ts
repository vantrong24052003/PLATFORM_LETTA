import type { BotConfig, ThemeConfig, UIElements } from './types';

let isOpen = false;
let bubbleElement: HTMLDivElement | null = null;
let chatboxElement: HTMLDivElement | null = null;
let messagesContainer: HTMLDivElement | null = null;
let inputElement: HTMLInputElement | null = null;

export function renderBubble(theme: ThemeConfig): void {
  if (bubbleElement) return; // Already rendered
  
  bubbleElement = document.createElement('div');
  bubbleElement.id = 'chatbot-bubble';
  bubbleElement.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: ${theme.primaryColor || '#1677ff'};
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
    z-index: 9998;
    transition: transform 0.2s;
  `;
  
  if (theme.bubbleIconUrl) {
    bubbleElement.innerHTML = `<img src="${theme.bubbleIconUrl}" alt="Chat" style="width: 32px; height: 32px; border-radius: 50%;" />`;
  } else {
    bubbleElement.innerHTML = '💬';
  }
  
  bubbleElement.addEventListener('mouseenter', () => {
    if (bubbleElement) {
      bubbleElement.style.transform = 'scale(1.1)';
    }
  });
  
  bubbleElement.addEventListener('mouseleave', () => {
    if (bubbleElement) {
      bubbleElement.style.transform = 'scale(1)';
    }
  });
  
  document.body.appendChild(bubbleElement);
}

export function renderChatbox(config: BotConfig): UIElements {
  if (chatboxElement && inputElement) {
    // Already rendered, return existing elements
    const closeBtn = chatboxElement.querySelector('#close-btn') as HTMLElement;
    const sendBtn = chatboxElement.querySelector('#send-btn') as HTMLElement;
    return { closeBtn, sendBtn, inputElement };
  }
  
  const theme = config.theme_config || {};
  const primaryColor = theme.primaryColor || '#1677ff';
  
  chatboxElement = document.createElement('div');
  chatboxElement.id = 'chatbot-chatbox';
  chatboxElement.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 20px;
    width: 360px;
    height: 520px;
    border-radius: 12px;
    background-color: white;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    display: none;
    flex-direction: column;
    z-index: 9999;
    overflow: hidden;
  `;
  
  // Header
  const header = document.createElement('div');
  header.style.cssText = `
    background-color: ${primaryColor};
    color: white;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `;
  
  const headerTitle = document.createElement('div');
  headerTitle.style.cssText = `
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
  `;
  
  if (theme.botAvatarUrl) {
    headerTitle.innerHTML = `
      <img src="${theme.botAvatarUrl}" alt="Bot" style="width: 32px; height: 32px; border-radius: 50%;" />
      <span>${config.name}</span>
    `;
  } else {
    headerTitle.innerHTML = `<span>${config.name}</span>`;
  }
  
  const closeBtn = document.createElement('button');
  closeBtn.id = 'close-btn';
  closeBtn.innerHTML = '✕';
  closeBtn.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
  `;
  
  header.appendChild(headerTitle);
  header.appendChild(closeBtn);
  
  // Messages container
  messagesContainer = document.createElement('div');
  messagesContainer.id = 'chatbot-messages';
  messagesContainer.style.cssText = `
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  `;
  
  // Input area
  const inputArea = document.createElement('div');
  inputArea.style.cssText = `
    padding: 16px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    gap: 8px;
  `;
  
  inputElement = document.createElement('input');
  inputElement.type = 'text';
  inputElement.placeholder = 'Type your message...';
  inputElement.style.cssText = `
    flex: 1;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
  `;
  
  const sendBtn = document.createElement('button');
  sendBtn.id = 'send-btn';
  sendBtn.innerHTML = '➤';
  sendBtn.style.cssText = `
    background-color: ${primaryColor};
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 16px;
    font-size: 16px;
    cursor: pointer;
  `;
  
  inputArea.appendChild(inputElement);
  inputArea.appendChild(sendBtn);
  
  // Footer
  if (theme.footerText) {
    const footer = document.createElement('div');
    footer.style.cssText = `
      padding: 8px 16px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    `;
    footer.textContent = theme.footerText;
    chatboxElement.appendChild(footer);
  }
  
  chatboxElement.appendChild(header);
  chatboxElement.appendChild(messagesContainer);
  chatboxElement.appendChild(inputArea);
  
  document.body.appendChild(chatboxElement);
  
  return { closeBtn, sendBtn, inputElement };
}

export function toggleChat(): void {
  isOpen = !isOpen;
  if (chatboxElement) {
    chatboxElement.style.display = isOpen ? 'flex' : 'none';
  }
}

export function openChat(): void {
  isOpen = true;
  if (chatboxElement) {
    chatboxElement.style.display = 'flex';
  }
}

export function closeChat(): void {
  isOpen = false;
  if (chatboxElement) {
    chatboxElement.style.display = 'none';
  }
}

export function addMessage(content: string, role: 'user' | 'assistant'): void {
  if (!messagesContainer) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.style.cssText = `
    padding: 10px 14px;
    border-radius: 12px;
    max-width: 80%;
    word-wrap: break-word;
    ${role === 'user' 
      ? 'background-color: #1677ff; color: white; align-self: flex-end; margin-left: auto;' 
      : 'background-color: #f3f4f6; color: #111827; align-self: flex-start;'}
  `;
  messageDiv.textContent = content;
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

export function showTypingIndicator(): void {
  if (!messagesContainer) return;
  
  const typingDiv = document.createElement('div');
  typingDiv.id = 'typing-indicator';
  typingDiv.style.cssText = `
    padding: 10px 14px;
    border-radius: 12px;
    background-color: #f3f4f6;
    max-width: 80px;
    align-self: flex-start;
  `;
  typingDiv.innerHTML = '<span style="animation: blink 1.4s infinite;">...</span>';
  messagesContainer.appendChild(typingDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

export function hideTypingIndicator(): void {
  const typingDiv = document.getElementById('typing-indicator');
  if (typingDiv) {
    typingDiv.remove();
  }
}

export function getInputElement(): HTMLInputElement | null {
  return inputElement;
}
