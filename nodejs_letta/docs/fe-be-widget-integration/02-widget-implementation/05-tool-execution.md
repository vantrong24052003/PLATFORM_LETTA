# Phase 5: Tool Execution

## Mục tiêu
Xử lý tool call flow: approval (HITL) → execute tool → submit result.

**Thực hiện tại**: `src/ui.js` và `src/chat.js`.

---

## 1. Tool Execution Logic

```javascript
// src/ui.js (update handleToolCall)
import { approveToolCall, submitToolResult, sendMessage, parseResponse } from './chat.js';

async function handleToolCall(parsed) {
  const { toolCalls, approvalRequests } = parsed;

  if (!toolCalls || toolCalls.length === 0) return;

  const toolCall = toolCalls[0];
  const funcName = toolCall.function.name;
  const args = JSON.parse(toolCall.function.arguments);

  // Step 1: Show approval dialog (HITL)
  if (approvalRequests && approvalRequests.length > 0) {
    const approved = await showApprovalDialog(funcName, args);

    if (!approved) {
      appendMessage('assistant', 'Tool call cancelled by user.');
      return;
    }

    // Step 2: Send approval to BE
    const requestId = approvalRequests[0].id;
    await approveToolCall(currentAgentId, requestId);
    appendMessage('system', `Approved: ${funcName}`);
  }

  // Step 3: Execute tool (call customer webhook)
  appendMessage('assistant', `Executing ${funcName}...`);

  try {
    const result = await executeToolWebhook(funcName, args);

    // Step 4: Submit result back to BE
    const response = await submitToolResult(currentAgentId, result);

    // Step 5: Display final answer
    const parsed = parseResponse(response);
    if (parsed.type === 'TEXT') {
      appendMessage('assistant', parsed.content);
    }

  } catch (error) {
    appendMessage('assistant', `Error executing tool: ${error.message}`);
  }
}
```

---

## 2. Approval Dialog

```javascript
// src/ui.js
function showApprovalDialog(funcName, args) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'approval-overlay';
    overlay.innerHTML = `
      <div class="approval-dialog">
        <h3>Tool Approval Required</h3>
        <p><strong>Function:</strong> ${funcName}</p>
        <p><strong>Arguments:</strong> ${JSON.stringify(args, null, 2)}</p>
        <div class="approval-buttons">
          <button id="approve-btn">Approve</button>
          <button id="reject-btn">Reject</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('approve-btn').addEventListener('click', () => {
      overlay.remove();
      resolve(true);
    });

    document.getElementById('reject-btn').addEventListener('click', () => {
      overlay.remove();
      resolve(false);
    });
  });
}
```

**CSS** (thêm vào `styles.css`):
```css
.approval-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.approval-dialog {
  background: white;
  padding: 24px;
  border-radius: 12px;
  max-width: 400px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.approval-dialog h3 {
  margin-top: 0;
}

.approval-buttons {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.approval-buttons button {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

#approve-btn {
  background: #28a745;
  color: white;
}

#reject-btn {
  background: #dc3545;
  color: white;
}
```

---

## 3. Tool Webhook Executor

```javascript
// src/chat.js
export async function executeToolWebhook(funcName, args) {
  // Get webhook config from init() config
  const webhookConfig = window.chatbotConfig?.toolWebhooks?.[funcName];

  if (!webhookConfig) {
    throw new Error(`No webhook configured for tool: ${funcName}`);
  }

  const response = await fetch(webhookConfig.url, {
    method: webhookConfig.method || 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': webhookConfig.auth ? `Bearer ${webhookConfig.auth.token}` : undefined
    },
    body: JSON.stringify(args)
  });

  if (!response.ok) {
    throw new Error(`Webhook failed: ${response.statusText}`);
  }

  return await response.json();
}
```

---

## 4. Widget Config Update

```javascript
// src/index.js
export async function init(userConfig) {
  config = {
    userId: userConfig.userId || 'anonymous',
    systemPrompt: userConfig.systemPrompt || 'You are helpful.',
    tools: userConfig.tools || [],
    toolWebhooks: userConfig.toolWebhooks || {},  // ← New
    apiBaseURL: userConfig.apiBaseURL || 'http://localhost:3000',
    onReady: userConfig.onReady || (() => {})
  };

  // Store globally for tool execution
  window.chatbotConfig = config;

  // ... rest of init
}
```

---

## 5. Customer Usage Example

```html
<script src="chatbot-widget.js"></script>
<script>
  ChatbotWidget.init({
    userId: "customer_user_123",
    systemPrompt: "You are a product search assistant.",
    tools: ["search_products"],
    toolWebhooks: {
      search_products: {
        url: "https://my-backend.com/chatbot-tools/search-products",
        method: "POST",
        auth: {
          token: "my_secret_token_xyz"
        }
      }
    },
    onReady: () => console.log('Chatbot ready!')
  });
</script>
```

**Customer Backend Endpoint**:
```javascript
// Customer's backend (Express example)
app.post('/chatbot-tools/search-products', async (req, res) => {
  const { query } = req.body;

  // Query customer's DB
  const products = await db.query(
    'SELECT id, name, price FROM products WHERE name LIKE ?',
    [`%${query}%`]
  );

  res.json({ results: products });
});
```

---

## 6. Test Flow

**User**: "Find Nike shoes"

**Expected**:
1. Widget gửi message lên BE.
2. BE trả về tool call request.
3. Widget hiển thị approval dialog: "Approve search_products(query: Nike)?"
4. User click "Approve".
5. Widget gửi approval lên BE.
6. Widget gọi customer webhook: `POST /chatbot-tools/search-products`.
7. Customer backend query DB, trả về products.
8. Widget submit results về BE.
9. BE (AI) tổng hợp: "Found 3 products: Nike Air, Nike Pro...".
10. Widget hiển thị final answer.

---

## Checkpoint

- ✅ Tool call được approve (HITL).
- ✅ Webhook được gọi tới customer backend.
- ✅ Tool result được submit về BE.
- ✅ Final answer được hiển thị.

---

Tiếp theo: [Phase 6: Build & Deploy](./06-build-deploy.md)
