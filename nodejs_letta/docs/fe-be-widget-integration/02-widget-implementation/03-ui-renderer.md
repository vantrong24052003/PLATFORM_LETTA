# Phase 3: UI Renderer

## Mục tiêu
Render chatbox UI: bubble icon + chat window.

**Thực hiện tại**: `src/ui.js` và `src/styles.css`.

---

## 1. UI HTML Structure

```javascript
// src/ui.js
export function renderUI() {
  // Create container
  const container = document.createElement('div');
  container.id = 'chatbot-widget-container';

  container.innerHTML = `
    <div id="chatbot-bubble">
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l5.71-.97C9 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" fill="white"/>
      </svg>
    </div>
    
    <div id="chatbot-window" class="hidden">
      <div id="chatbot-header">
        <span>Chat Assistant</span>
        <button id="chatbot-close">×</button>
      </div>
      
      <div id="chatbot-messages"></div>
      
      <div id="chatbot-input-area">
        <input type="text" id="chatbot-input" placeholder="Type your message..." />
        <button id="chatbot-send">Send</button>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  // Attach event listeners
  attachEventListeners();
}

function attachEventListeners() {
  const bubble = document.getElementById('chatbot-bubble');
  const chatWindow = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('chatbot-close');
  const sendBtn = document.getElementById('chatbot-send');
  const input = document.getElementById('chatbot-input');

  // Toggle chat window
  bubble.addEventListener('click', () => {
    chatWindow.classList.toggle('hidden');
  });

  closeBtn.addEventListener('click', () => {
    chatWindow.classList.add('hidden');
  });

  // Send message
  sendBtn.addEventListener('click', handleSendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendMessage();
  });
}

async function handleSendMessage() {
  const input = document.getElementById('chatbot-input');
  const message = input.value.trim();

  if (!message) return;

  // Display user message
  appendMessage('user', message);
  input.value = '';

  // Send to BE (Phase 4)
  // await sendMessage(message);
}

export function appendMessage(role, content) {
  const messagesDiv = document.getElementById('chatbot-messages');
  const msgDiv = document.createElement('div');
  msgDiv.className = `message message-${role}`;
  msgDiv.textContent = content;
  messagesDiv.appendChild(msgDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
```

---

## 2. CSS Styles

```css
/* src/styles.css */
#chatbot-widget-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
}

#chatbot-bubble {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: transform 0.2s;
}

#chatbot-bubble:hover {
  transform: scale(1.1);
}

#chatbot-window {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

#chatbot-window.hidden {
  display: none;
}

#chatbot-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#chatbot-close {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

#chatbot-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  padding: 10px 14px;
  border-radius: 12px;
  max-width: 80%;
  word-wrap: break-word;
}

.message-user {
  align-self: flex-end;
  background: #667eea;
  color: white;
}

.message-assistant {
  align-self: flex-start;
  background: #f1f3f5;
  color: #212529;
}

#chatbot-input-area {
  display: flex;
  padding: 12px;
  border-top: 1px solid #e9ecef;
  gap: 8px;
}

#chatbot-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  outline: none;
}

#chatbot-input:focus {
  border-color: #667eea;
}

#chatbot-send {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

#chatbot-send:hover {
  background: #5568d3;
}
```

---

## 3. Integration

```javascript
// src/index.js
import { getOrCreateAgent } from './agent.js';
import { renderUI } from './ui.js';
import './styles.css';

export async function init(userConfig) {
  // ... (agent logic from Phase 2)

  agentId = await getOrCreateAgent(config);

  // Render UI
  renderUI();

  config.onReady({ agentId });
}
```

---

## 4. Test

Build và mở `http://localhost:9000`:

**Expected**:
- ✅ Bubble icon hiển thị góc dưới phải.
- ✅ Click bubble → chat window mở.
- ✅ Type message → hiển thị trong UI.
- ⏸️ Chưa gửi lên BE (Phase 4).

---

Tiếp theo: [Phase 4: Chat Handler](./04-chat-handler.md)
