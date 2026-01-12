# Phase 4: Chat Handler

## Mục tiêu
Implement logic gửi message lên BE và parse response (text hoặc tool call).

**Thực hiện tại**: `src/chat.js`.

---

## 1. Chat Service

```javascript
// src/chat.js
const API_BASE = 'http://localhost:3000/api/letta';

export async function sendMessage(agentId, message) {
  const response = await fetch(`${API_BASE}/agents/${agentId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  const { data } = await response.json();
  return data.response;
}

export function parseResponse(response) {
  const messages = response.messages || [];
  const lastMsg = messages[messages.length - 1];

  // Check for tool call
  if (lastMsg.message_type === 'tool_call_message') {
    return {
      type: 'TOOL_CALL',
      toolCalls: lastMsg.tool_calls,
      approvalRequests: response.approval_requests || []
    };
  }

  // Regular text message
  return {
    type: 'TEXT',
    content: lastMsg.content || lastMsg.text || ''
  };
}

export async function approveToolCall(agentId, requestId) {
  const response = await fetch(`${API_BASE}/agents/${agentId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      approve: true,
      approval_request_id: requestId
    })
  });

  if (!response.ok) {
    throw new Error('Failed to approve tool call');
  }

  return await response.json();
}

export async function submitToolResult(agentId, result) {
  const response = await fetch(`${API_BASE}/agents/${agentId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      role: 'system',
      message: JSON.stringify(result)
    })
  });

  if (!response.ok) {
    throw new Error('Failed to submit tool result');
  }

  const { data } = await response.json();
  return data.response;
}
```

---

## 2. Update UI Handler

```javascript
// src/ui.js (update handleSendMessage)
import { sendMessage, parseResponse } from './chat.js';

let currentAgentId = null;

export function setAgentId(agentId) {
  currentAgentId = agentId;
}

async function handleSendMessage() {
  const input = document.getElementById('chatbot-input');
  const message = input.value.trim();

  if (!message || !currentAgentId) return;

  // Display user message
  appendMessage('user', message);
  input.value = '';

  // Show loading
  const loadingId = appendMessage('assistant', 'Typing...');

  try {
    // Send to BE
    const response = await sendMessage(currentAgentId, message);

    // Remove loading
    removeMessage(loadingId);

    // Parse response
    const parsed = parseResponse(response);

    if (parsed.type === 'TEXT') {
      // Display text
      appendMessage('assistant', parsed.content);
    } else if (parsed.type === 'TOOL_CALL') {
      // Handle tool call (Phase 5)
      await handleToolCall(parsed);
    }

  } catch (error) {
    removeMessage(loadingId);
    appendMessage('assistant', 'Error: ' + error.message);
  }
}

export function appendMessage(role, content) {
  const messagesDiv = document.getElementById('chatbot-messages');
  const msgDiv = document.createElement('div');
  msgDiv.className = `message message-${role}`;
  msgDiv.textContent = content;
  msgDiv.dataset.id = Date.now();
  messagesDiv.appendChild(msgDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  return msgDiv.dataset.id;
}

function removeMessage(id) {
  const msg = document.querySelector(`[data-id="${id}"]`);
  if (msg) msg.remove();
}

// Placeholder for Phase 5
async function handleToolCall(parsed) {
  appendMessage('assistant', 'Tool call requested (implementation in Phase 5)');
}
```

---

## 3. Integration

```javascript
// src/index.js
import { getOrCreateAgent } from './agent.js';
import { renderUI, setAgentId } from './ui.js';

export async function init(userConfig) {
  // ... (previous code)

  agentId = await getOrCreateAgent(config);

  // Pass agentId to UI
  setAgentId(agentId);

  renderUI();
  config.onReady({ agentId });
}
```

---

## 4. Test

```html
<script src="chatbot-widget.js"></script>
<script>
  ChatbotWidget.init({
    userId: "test_user_123",
    onReady: () => console.log('Ready!')
  });
</script>
```

**Test Cases**:
1. Type: "Hello" → AI responds with text.
2. Type: "Find Nike shoes" (nếu tool đã đăng ký) → See "Tool call requested" (Phase 5 sẽ xử lý).

---

## Checkpoint

- ✅ User message được gửi lên BE.
- ✅ Text response được hiển thị.
- ✅ Tool call được detect (chưa xử lý).

---

Tiếp theo: [Phase 5: Tool Execution](./05-tool-execution.md)
