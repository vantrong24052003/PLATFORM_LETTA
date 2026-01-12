# Phase 2: Widget Auto-Init & Agent Lifecycle

## Mục tiêu
Widget tự động init khi load, đọc `data-assistant-id` từ script tag, và expose API để customer quyết định logic agent.

**Thực hiện tại**: `src/index.js` và `src/agent.js`.

---

## Widget Flow

```
1. Script tag có data-assistant-id:
   <script src="embed.js" data-assistant-id="chatbot-123"></script>

2. Widget tự động load → đọc chatbotId từ data-assistant-id

3. Widget gọi BE → GET /api/bots/chatbot-123 (lấy config)

4. Widget render bubble icon (với theme từ config)

5. CHƯA tạo agent (chờ customer quyết định)

6. Widget expose API:
   - ChatbotWidget.setAgent(agentId)
   - ChatbotWidget.createAgent()
   - ChatbotWidget.onBubbleClick(callback)
   - ...
```

---

## 1. Auto-Init Entry Point

```javascript
// src/index.js
import { loadBotConfig } from './bot.js';
import { renderBubble } from './ui.js';
import './styles.css';

let chatbotId = null;
let botConfig = null;
let agentId = null;

// Auto-init when script loads
(async function autoInit() {
  try {
    // Step 1: Read data-assistant-id from script tag
    const scriptTag = document.currentScript;
    chatbotId = scriptTag?.getAttribute('data-assistant-id');

    if (!chatbotId) {
      console.error('[Widget] Missing data-assistant-id attribute');
      return;
    }

    console.log('[Widget] Auto-init with chatbotId:', chatbotId);

    // Step 2: Load bot config from BE
    botConfig = await loadBotConfig(chatbotId);

    // Step 3: Render bubble (không tạo agent)
    renderBubble(botConfig.theme);

    console.log('[Widget] Initialized. Waiting for user interaction.');
  } catch (error) {
    console.error('[Widget] Auto-init failed:', error);
  }
})();

// Expose global API
window.ChatbotWidget = {
  setAgent,
  createAgent,
  openChat,
  closeChat,
  sendMessage,
  onBubbleClick
};
```

---

## 2. Bot Config Loader

```javascript
// src/bot.js
const API_BASE = 'http://localhost:3000/api/letta';

export async function loadBotConfig(chatbotId) {
  const response = await fetch(`${API_BASE}/bots/${chatbotId}`);

  if (!response.ok) {
    throw new Error(`Bot ${chatbotId} not found`);
  }

  const { data } = await response.json();
  return data.bot; // { id, name, system, tools, theme }
}
```

---

## 3. Agent Lifecycle APIs

```javascript
// src/agent.js
const API_BASE = 'http://localhost:3000/api/letta';

/**
 * Set agent hiện tại (customer truyền agentId vào)
 */
export function setAgent(agentIdParam) {
  agentId = agentIdParam;
  console.log('[Agent] Set agentId:', agentId);
}

/**
 * Tạo agent mới cho chatbot hiện tại
 * @param {string} userId - Optional userId để map
 * @returns {Promise<string>} agentId
 */
export async function createAgent(userId = null) {
  const payload = userId ? { userId } : {};

  const response = await fetch(
    `${API_BASE}/bots/${chatbotId}/agents`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create agent');
  }

  const { data } = await response.json();
  const newAgentId = data.mapping.agentId;

  // Auto-set agent
  setAgent(newAgentId);

  console.log('[Agent] Created:', newAgentId);
  return newAgentId;
}

/**
 * Get agent by userId (check if exists)
 */
export async function getAgentByUserId(userId) {
  const response = await fetch(
    `${API_BASE}/bots/${chatbotId}/agents?userId=${userId}`
  );

  if (response.ok) {
    const { data } = await response.json();
    return data.mapping.agentId;
  }

  return null; // Not found
}
```

---

## 4. Customer Usage Examples

### Example A: Tự động tạo agent khi click bubble (Simplest)

```html
<!-- Customer chỉ cần paste script -->
<script src="embed.js" data-assistant-id="chatbot-123"></script>

<script>
  // Widget tự động tạo agent khi user click bubble lần đầu
  ChatbotWidget.onBubbleClick(async () => {
    // Check if agent already set
    if (!ChatbotWidget.hasAgent()) {
      await ChatbotWidget.createAgent();
    }
    ChatbotWidget.openChat();
  });
</script>
```

---

### Example B: Check login trước khi chat

```html
<script src="embed.js" data-assistant-id="chatbot-123"></script>

<script>
  ChatbotWidget.onBubbleClick(async () => {
    const user = getCurrentUser();

    if (!user) {
      alert('Please login to chat');
      return false; // Block
    }

    // Get or create agent for this user
    let agentId = await myBackend.getAgentId(user.id);

    if (!agentId) {
      agentId = await ChatbotWidget.createAgent(user.id);
      await myBackend.saveAgentId(user.id, agentId);
    }

    ChatbotWidget.setAgent(agentId);
    ChatbotWidget.openChat();
  });
</script>
```

---

### Example C: Customer quản lý agentId hoàn toàn

```html
<script src="embed.js" data-assistant-id="chatbot-123"></script>

<script>
  // Customer tự fetch agentId từ backend của họ
  async function initChat() {
    const user = getCurrentUser();

    // Call customer's API
    const response = await fetch(`/my-api/chatbot-agent?userId=${user.id}`);
    const { agentId } = await response.json();

    // Set agent cho widget
    ChatbotWidget.setAgent(agentId);
    ChatbotWidget.openChat();
  }

  // Custom button to open chat
  document.getElementById('open-chat-btn').addEventListener('click', initChat);
</script>
```

---

### Example D: 1 user = nhiều threads (conversations)

```html
<script src="embed.js" data-assistant-id="chatbot-123"></script>

<script>
  // Load conversation list
  async function loadConversations() {
    const user = getCurrentUser();
    const threads = await myBackend.getThreads(user.id);

    // Render list
    threads.forEach(thread => {
      const btn = document.createElement('button');
      btn.textContent = thread.title;
      btn.onclick = () => {
        ChatbotWidget.setAgent(thread.agentId);
        ChatbotWidget.openChat();
      };
      document.getElementById('thread-list').appendChild(btn);
    });
  }

  // New conversation button
  document.getElementById('new-thread-btn').addEventListener('click', async () => {
    const user = getCurrentUser();
    const agentId = await ChatbotWidget.createAgent(user.id);

    // Save to customer's DB
    await myBackend.createThread(user.id, agentId, 'New Chat');

    // Open chat
    ChatbotWidget.setAgent(agentId);
    ChatbotWidget.openChat();
  });
</script>
```

---

### Example E: Guest user (session-based)

```html
<script src="embed.js" data-assistant-id="chatbot-123"></script>

<script>
  ChatbotWidget.onBubbleClick(async () => {
    // Check session storage
    let agentId = sessionStorage.getItem('guestAgentId');

    if (!agentId) {
      // Create new agent for guest
      agentId = await ChatbotWidget.createAgent();
      sessionStorage.setItem('guestAgentId', agentId);
    }

    ChatbotWidget.setAgent(agentId);
    ChatbotWidget.openChat();
  });
</script>
```

---

## 5. Widget API Reference

```typescript
// Exposed global APIs
interface ChatbotWidget {
  /**
   * Set agent hiện tại
   */
  setAgent(agentId: string): void;

  /**
   * Tạo agent mới
   * @param userId - Optional userId để map
   * @returns agentId
   */
  createAgent(userId?: string): Promise<string>;

  /**
   * Check if agent đã được set
   */
  hasAgent(): boolean;

  /**
   * Mở chatbox
   */
  openChat(): void;

  /**
   * Đóng chatbox
   */
  closeChat(): void;

  /**
   * Gửi message
   */
  sendMessage(text: string): Promise<void>;

  /**
   * Custom logic khi click bubble
   */
  onBubbleClick(callback: () => void | Promise<void>): void;

  /**
   * Listen to incoming messages
   */
  onMessage(callback: (message: Message) => void): void;
}
```

---

## 6. Test

### Test HTML
```html
<!DOCTYPE html>
<html>
<head>
  <title>Widget Test</title>
</head>
<body>
  <h1>Test Website</h1>

  <!-- Widget script with chatbotId -->
  <script src="dist/chatbot-widget.js" data-assistant-id="bot_test_123"></script>

  <!-- Test buttons -->
  <button onclick="testCreateAgent()">Create Agent</button>
  <button onclick="testSetAgent()">Set Agent (agent-xyz-789)</button>
  <button onclick="testOpenChat()">Open Chat</button>

  <script>
    async function testCreateAgent() {
      const agentId = await ChatbotWidget.createAgent('test_user_123');
      console.log('Created agent:', agentId);
    }

    function testSetAgent() {
      ChatbotWidget.setAgent('agent-xyz-789');
    }

    function testOpenChat() {
      ChatbotWidget.openChat();
    }
  </script>
</body>
</html>
```

**Expected Console**:
```
[Widget] Auto-init with chatbotId: bot_test_123
[Bot] Loading config for bot_test_123
[Widget] Initialized. Waiting for user interaction.

// Click "Create Agent"
[Agent] Created: agent-abc-123-uuid

// Click "Open Chat"
[UI] Opening chatbox with agent: agent-abc-123-uuid
```

---

## Checkpoint

- ✅ Widget tự động init khi load (đọc `data-assistant-id`)
- ✅ Widget load bot config từ BE
- ✅ Widget render bubble (CHƯA tạo agent)
- ✅ Widget expose APIs: `setAgent`, `createAgent`, `openChat`, etc.
- ✅ Customer quyết định logic agent (5 examples)
- ❌ Widget KHÔNG tự động tạo agent
- ❌ Widget KHÔNG quyết định business logic

---

Tiếp theo: [Phase 3: UI Renderer](./03-ui-renderer.md)
