# Kế Hoạch Implementation

Document này định nghĩa **chi tiết từng bước** để implement các gaps đã xác định.

---

## Phase 1: Backend - Bot Template System

### Mục Tiêu
Implement Bot Template storage, CRUD operations, và Agent Mapping APIs.

### Thời Gian Ước Tính
4-6 giờ

---

### Task 1.1: Thêm Type Definitions

**File**: `src/types/index.ts`

**Thay đổi**:
```typescript
export interface BotTemplate {
  id: string;
  name: string;
  system: string;
  greeting: string;
  tools: string[];
  toolWebhooks?: {
    [toolName: string]: {
      url: string;
      method: 'GET' | 'POST';
      auth?: {
        type: 'bearer' | 'basic';
        token: string;
      }
    }
  };
  theme: {
    primaryColor: string;
    botAvatarUrl: string;
    bubbleIconUrl: string;
    footerText: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AgentMapping {
  chatbotId: string;
  userId: string | null;
  agentId: string;
  createdAt: string;
}
```

**Validation**: TypeScript compilation thành công

---

### Task 1.2: Tạo BotService

**File**: `src/services/letta/bot.service.ts`

**Implementation**:
```typescript
import { BotTemplate, AgentMapping } from '@/types/index.js';
import lettaService from './letta.service.js';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const BOTS_FILE = path.join(DATA_DIR, 'bot_templates.json');
const MAPPINGS_FILE = path.join(DATA_DIR, 'agent_mappings.json');

class BotService {
  private bots: Map<string, BotTemplate> = new Map();
  private mappings: Map<string, AgentMapping> = new Map();

  constructor() {
    this.ensureDataDir();
    this.loadBotsFromFile();
    this.loadMappingsFromFile();
  }

  private ensureDataDir(): void {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  // Bot Template CRUD

  createBot(data: Omit<BotTemplate, 'id' | 'createdAt' | 'updatedAt'>): BotTemplate {
    Đầu vào: Bot data không có id và timestamps
    Xử lý:
      const id = randomUUID();
      const now = new Date().toISOString();
      const bot: BotTemplate = { ...data, id, createdAt: now, updatedAt: now };
      this.bots.set(id, bot);
      this.saveBotsToFile();
    Đầu ra: BotTemplate đầy đủ với id được generate
  }

  getBot(chatbotId: string): BotTemplate | undefined {
    Đầu vào: chatbotId
    Đầu ra: BotTemplate nếu tìm thấy, undefined nếu không
  }

  updateBot(chatbotId: string, updates: Partial<BotTemplate>): void {
    Đầu vào: chatbotId + partial updates
    Xử lý:
      const bot = this.bots.get(chatbotId);
      if (!bot) throw new Error('Bot not found');
      const updated = { ...bot, ...updates, updatedAt: new Date().toISOString() };
      this.bots.set(chatbotId, updated);
      this.saveBotsToFile();
    Tác động: Cập nhật file storage
  }

  deleteBot(chatbotId: string): void {
    Đầu vào: chatbotId
    Xử lý:
      const deleted = this.bots.delete(chatbotId);
      if (!deleted) throw new Error('Bot not found');
      this.saveBotsToFile();
    Tác động: Cập nhật file storage
  }

  // Agent Mapping

  async getOrCreateAgent(chatbotId: string, userId?: string): Promise<AgentMapping> {
    Đầu vào: chatbotId + userId (optional)
    Xử lý:
      1. Generate mapping key: `${chatbotId}_${userId || 'anonymous'}`
      2. Kiểm tra mapping đã tồn tại
      3. Nếu có: trả về mapping hiện có
      4. Nếu không:
         a. Load bot template
         b. Tạo Letta agent với bot config
         c. Lưu mapping
         d. Trả về mapping mới
    Đầu ra: AgentMapping object
  }

  getAgentByUser(chatbotId: string, userId?: string): AgentMapping | undefined {
    Đầu vào: chatbotId + userId (optional)
    Đầu ra: AgentMapping nếu tìm thấy, undefined nếu không
  }

  // File Persistence

  private loadBotsFromFile(): void {
    if (fs.existsSync(BOTS_FILE)) {
      const data = JSON.parse(fs.readFileSync(BOTS_FILE, 'utf-8'));
      data.forEach(bot => this.bots.set(bot.id, bot));
    }
  }

  private saveBotsToFile(): void {
    const data = Array.from(this.bots.values());
    fs.writeFileSync(BOTS_FILE, JSON.stringify(data, null, 2));
  }

  private loadMappingsFromFile(): void {
    if (fs.existsSync(MAPPINGS_FILE)) {
      const data = JSON.parse(fs.readFileSync(MAPPINGS_FILE, 'utf-8'));
      data.forEach(mapping => {
        const key = `${mapping.chatbotId}_${mapping.userId || 'anonymous'}`;
        this.mappings.set(key, mapping);
      });
    }
  }

  private saveMappingsToFile(): void {
    const data = Array.from(this.mappings.values());
    fs.writeFileSync(MAPPINGS_FILE, JSON.stringify(data, null, 2));
  }
}

export default new BotService();
```

**Testing**:
```
Test thủ công: Tạo bot → Kiểm tra data/bot_templates.json tồn tại và chứa bot
Test thủ công: Get bot → Trả về đúng bot object
Test thủ công: Update bot → File cập nhật với data mới
Test thủ công: Delete bot → Bot bị xóa khỏi file
```

---

### Task 1.3: Tạo BotController

**File**: `src/controllers/letta/bot.controller.ts`

**Implementation**:
```typescript
import { Request, Response, NextFunction } from 'express';
import botService from '@/services/letta/bot.service.js';
import { renderSuccess, renderError } from '@/utils/response.helper.js';
import { HttpStatus } from '@/constants/http.constants.js';

export const createBot = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  Đầu vào: req.body = { name, system, greeting, tools, theme }
  try {
    const bot = botService.createBot(req.body);
    renderSuccess(res, { bot }, 'Bot template created successfully', HttpStatus.CREATED);
  } catch (error) {
    renderError(res, error as Error);
  }
  Đầu ra: 201 Created với bot object
};

export const getBot = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  Đầu vào: req.params.chatbotId
  try {
    const bot = botService.getBot(req.params.chatbotId);
    if (!bot) {
      throw { statusCode: HttpStatus.NOT_FOUND, message: 'Bot template not found' };
    }
    renderSuccess(res, { bot }, 'Bot template retrieved successfully');
  } catch (error) {
    renderError(res, error as Error);
  }
  Đầu ra: 200 OK với bot object hoặc 404 Not Found
};

export const updateBot = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  Đầu vào: req.params.chatbotId + req.body = Partial<BotTemplate>
  try {
    botService.updateBot(req.params.chatbotId, req.body);
    const bot = botService.getBot(req.params.chatbotId);
    renderSuccess(res, { bot }, 'Bot template updated successfully');
  } catch (error) {
    renderError(res, error as Error);
  }
  Đầu ra: 200 OK với updated bot hoặc 404 Not Found
};

export const deleteBot = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  Đầu vào: req.params.chatbotId
  try {
    botService.deleteBot(req.params.chatbotId);
    renderSuccess(res, { success: true }, 'Bot template deleted successfully');
  } catch (error) {
    renderError(res, error as Error);
  }
  Đầu ra: 200 OK hoặc 404 Not Found
};

export const createAgentForBot = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  Đầu vào: req.params.chatbotId + req.body.userId (optional)
  try {
    const mapping = await botService.getOrCreateAgent(req.params.chatbotId, req.body.userId);
    renderSuccess(res, { mapping }, 'Agent created or retrieved successfully', HttpStatus.CREATED);
  } catch (error) {
    renderError(res, error as Error);
  }
  Đầu ra: 201 Created hoặc 200 OK với AgentMapping
};

export const getAgentByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  Đầu vào: req.params.chatbotId + req.query.userId (optional)
  try {
    const mapping = botService.getAgentByUser(req.params.chatbotId, req.query.userId as string);
    if (!mapping) {
      throw { statusCode: HttpStatus.NOT_FOUND, message: 'Agent mapping not found' };
    }
    renderSuccess(res, { mapping }, 'Agent mapping retrieved successfully');
  } catch (error) {
    renderError(res, error as Error);
  }
  Đầu ra: 200 OK với mapping hoặc 404 Not Found
};
```

---

### Task 1.4: Tạo Routes

**File**: `src/routes/letta/bot.routes.ts`

**Implementation**:
```typescript
import { Router } from 'express';
import * as botController from '@/controllers/letta/bot.controller.js';

const router = Router();

router.post('/', botController.createBot);
router.get('/:chatbotId', botController.getBot);
router.put('/:chatbotId', botController.updateBot);
router.delete('/:chatbotId', botController.deleteBot);

// Agent mapping sub-routes
router.post('/:chatbotId/agents', botController.createAgentForBot);
router.get('/:chatbotId/agents', botController.getAgentByUser);

export default router;
```

**File**: `src/routes/letta/index.ts` (cập nhật)

**Thay đổi**:
```typescript
import botRoutes from './bot.routes.js';

// Thêm dòng này
router.use('/bots', botRoutes);

// Routes hiện có
router.use('/agents', agentRoutes);
router.use('/tools', toolRoutes);
router.use('/blocks', blockRoutes);
```

---

### Task 1.5: API Testing

**Test Suite**:
```bash
# Test 1: Tạo Bot
curl -X POST http://localhost:3000/api/letta/bots \
  -H "Content-Type: application/json" \
  -d '{
    "name": "E-commerce Bot",
    "system": "You are a helpful shopping assistant",
    "greeting": "Hello! How can I help you today?",
    "tools": [],
    "theme": {
      "primaryColor": "#1677ff",
      "botAvatarUrl": "",
      "bubbleIconUrl": "",
      "footerText": "Powered by AI"
    }
  }'

Kết quả mong đợi:
  Status: 201 Created
  Body: {
    "message": "Bot template created successfully",
    "data": {
      "bot": {
        "id": "<uuid>",
        "name": "E-commerce Bot",
        ...
        "createdAt": "<timestamp>",
        "updatedAt": "<timestamp>"
      }
    }
  }

# Test 2: Lấy Bot
curl http://localhost:3000/api/letta/bots/<chatbotId>

Kết quả mong đợi:
  Status: 200 OK
  Body: { "message": "...", "data": { "bot": {...} } }

# Test 3: Tạo Agent
curl -X POST http://localhost:3000/api/letta/bots/<chatbotId>/agents \
  -H "Content-Type: application/json" \
  -d '{"userId":"user_123"}'

Kết quả mong đợi:
  Status: 201 Created
  Body: {
    "message": "Agent created or retrieved successfully",
    "data": {
      "mapping": {
        "chatbotId": "<uuid>",
        "userId": "user_123",
        "agentId": "<letta-agent-id>",
        "createdAt": "<timestamp>"
      }
    }
  }

# Test 4: Lấy Agent theo User
curl http://localhost:3000/api/letta/bots/<chatbotId>/agents?userId=user_123

Kết quả mong đợi:
  Status: 200 OK
  Body: { "message": "...", "data": { "mapping": {...} } }

# Test 5: Update Bot
curl -X PUT http://localhost:3000/api/letta/bots/<chatbotId> \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Bot Name"}'

Kết quả mong đợi:
  Status: 200 OK
  Body: Bot object đã cập nhật

# Test 6: Xóa Bot
curl -X DELETE http://localhost:3000/api/letta/bots/<chatbotId>

Kết quả mong đợi:
  Status: 200 OK
  Body: { "message": "...", "data": { "success": true } }
```

**Validation Checklist**:
- [ ] Tất cả endpoints trả đúng status codes
- [ ] File data/bot_templates.json được tạo và cập nhật
- [ ] File data/agent_mappings.json được tạo và cập nhật
- [ ] Letta agent thực sự được tạo (verify trên Letta server)
- [ ] Error handling hoạt động (404 cho IDs không tồn tại)

---

## Phase 2: Widget - Build embed.js

### Mục Tiêu
Tạo standalone widget tự động khởi tạo và render chatbox.

### Thời Gian Ước Tính
8-12 giờ

---

### Task 2.1: Project Setup

**Tạo Widget Project**:
```bash
mkdir widget
cd widget
npm init -y
```

**Cài Dependencies**:
```bash
npm install --save-dev \
  webpack \
  webpack-cli \
  babel-loader \
  @babel/core \
  @babel/preset-env \
  style-loader \
  css-loader
```

**File**: `webpack.config.js`
```javascript
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'embed.js',
    library: 'ChatbotWidget',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
```

**File**: `package.json` (cập nhật scripts)
```json
{
  "scripts": {
    "build": "webpack",
    "dev": "webpack --watch"
  }
}
```

---

### Task 2.2: Bot Config Loader

**File**: `src/bot.js`

**Implementation**:
```javascript
const API_BASE = 'http://localhost:3000/api/letta';

export async function loadBotConfig(chatbotId) {
  Đầu vào: chatbotId (string)
  Xử lý:
    const response = await fetch(`${API_BASE}/bots/${chatbotId}`);
    if (!response.ok) throw new Error('Failed to load bot config');
    const json = await response.json();
  Đầu ra: json.data.bot (BotTemplate object)
}
```

---

### Task 2.3: Agent Lifecycle

**File**: `src/agent.js`

**Implementation**:
```javascript
const API_BASE = 'http://localhost:3000/api/letta';

let currentAgentId = null;

export async function createAgent(chatbotId, userId) {
  Đầu vào: chatbotId (string), userId (optional string)
  Xử lý:
    const response = await fetch(`${API_BASE}/bots/${chatbotId}/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    const json = await response.json();
    currentAgentId = json.data.mapping.agentId;
  Đầu ra: agentId (string)
  Tác động: Set currentAgentId
}

export async function getAgentByUser(chatbotId, userId) {
  Đầu vào: chatbotId (string), userId (string)
  Xử lý:
    const response = await fetch(`${API_BASE}/bots/${chatbotId}/agents?userId=${userId}`);
    if (response.status === 404) return null;
    const json = await response.json();
  Đầu ra: json.data.mapping hoặc null
}

export function getCurrentAgent() {
  Đầu ra: currentAgentId (string hoặc null)
}

export function setAgent(agentId) {
  Đầu vào: agentId (string)
  Tác động: currentAgentId = agentId
}
```

---

### Task 2.4: UI Renderer

**File**: `src/ui.js`

**Implementation**:
```javascript
import './styles.css';

let isOpen = false;

export function renderBubble(theme) {
  Đầu vào: theme object { primaryColor, bubbleIconUrl }
  Xử lý:
    const bubble = document.createElement('div');
    bubble.id = 'chatbot-bubble';
    bubble.style.backgroundColor = theme.primaryColor;
    if (theme.bubbleIconUrl) {
      bubble.innerHTML = `<img src="${theme.bubbleIconUrl}" />`;
    } else {
      bubble.innerHTML = `<svg>...</svg>`; // Icon mặc định
    }
    bubble.onclick = () => toggleChat();
    document.body.appendChild(bubble);
  Đầu ra: Không
  Tác động: Bubble element được thêm vào DOM
}

export function renderChatbox(config) {
  Đầu vào: config object { name, greeting, theme }
  Xử lý:
    const chatbox = document.createElement('div');
    chatbox.id = 'chatbot-chatbox';
    chatbox.style.display = 'none';
    chatbox.innerHTML = `
      <div class="chatbot-header" style="background: ${config.theme.primaryColor}">
        <span>${config.name}</span>
        <button id="chatbot-close">×</button>
      </div>
      <div class="chatbot-messages">
        <div class="chatbot-message bot">${config.greeting}</div>
      </div>
      <div class="chatbot-input">
        <input type="text" placeholder="Type a message..." />
        <button>Send</button>
      </div>
      <div class="chatbot-footer">${config.theme.footerText}</div>
    `;
    document.body.appendChild(chatbox);
    setupEventListeners();
  Đầu ra: Không
  Tác động: Chatbox element được thêm vào DOM
}

export function toggleChat() {
  isOpen = !isOpen;
  const chatbox = document.getElementById('chatbot-chatbox');
  chatbox.style.display = isOpen ? 'flex' : 'none';
}

export function addMessage(content, role) {
  Đầu vào: content (string), role ('user' hoặc 'bot')
  Xử lý:
    const messagesContainer = document.querySelector('.chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${role}`;
    messageDiv.textContent = content;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  Đầu ra: Không
  Tác động: Message được append vào chat
}

function setupEventListeners() {
  document.getElementById('chatbot-close').onclick = toggleChat;
  // ... input handler (sẽ kết nối trong chat.js)
}
```

---

### Task 2.5: Chat Handler

**File**: `src/chat.js`

**Implementation**:
```javascript
import { getCurrentAgent } from './agent.js';
import { addMessage } from './ui.js';

const API_BASE = 'http://localhost:3000/api/letta';

export async function sendMessage(message) {
  Đầu vào: message (string)
  Xử lý:
    const agentId = getCurrentAgent();
    if (!agentId) throw new Error('No agent available');

    addMessage(message, 'user');

    const response = await fetch(`${API_BASE}/agents/${agentId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    const json = await response.json();
    const messages = json.data.response.messages;

    messages.forEach(msg => {
      if (msg.message_type === 'internal_monologue') return;
      addMessage(msg.content || msg.function_call, 'bot');
    });
  Đầu ra: Không
  Tác động: Messages được thêm vào UI
}
```

---

### Task 2.6: Entry Point (Auto-Init)

**File**: `src/index.js`

**Implementation**:
```javascript
import { loadBotConfig } from './bot.js';
import { createAgent } from './agent.js';
import { renderBubble, renderChatbox } from './ui.js';
import { sendMessage } from './chat.js';

let chatbotId = null;
let botConfig = null;

(async function autoInit() {
  Đầu vào: <script> tag với data-assistant-id
  Xử lý:
    const scriptTag = document.currentScript;
    chatbotId = scriptTag?.getAttribute('data-assistant-id');

    if (!chatbotId) {
      console.error('[ChatbotWidget] Missing data-assistant-id attribute');
      return;
    }

    console.log('[ChatbotWidget] Initializing with chatbotId:', chatbotId);

    botConfig = await loadBotConfig(chatbotId);
    renderBubble(botConfig.theme);
    renderChatbox(botConfig);

    console.log('[ChatbotWidget] Ready');
  Đầu ra: Không
  Tác động: Widget hiển thị trên page
})();

// API expose ra
window.ChatbotWidget = {
  setAgent: (agentId) => {
    Đầu vào: agentId (string)
    Hành động: Gọi agent.setAgent(agentId)
  },

  createAgent: async (userId) => {
    Đầu vào: userId (optional string)
    Hành động: Gọi agent.createAgent(chatbotId, userId)
    Đầu ra: agentId (string)
  },

  getOrCreateAgent: async (userId) => {
    Đầu vào: userId (string)
    Hành động: Thử getAgentByUser, nếu không tìm thấy thì createAgent
    Đầu ra: agentId (string)
  },

  openChat: () => {
    Hành động: Gọi ui.toggleChat() nếu đang đóng
  },

  closeChat: () => {
    Hành động: Gọi ui.toggleChat() nếu đang mở
  },

  sendMessage: (message) => {
    Đầu vào: message (string)
    Hành động: Gọi chat.sendMessage(message)
  },

  onBubbleClick: (callback) => {
    Đầu vào: callback (function)
    Hành động: Register custom bubble click handler
  }
};
```

---

### Task 2.7: Build và Test

**Build Command**:
```bash
npm run build
```

**Kết quả mong đợi**:
```
File: dist/embed.js
Size: khoảng 50-100KB (minified)
Format: UMD (hoạt động trong browser)
```

**Test HTML**:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Widget Test</title>
</head>
<body>
  <h1>Test Page</h1>

  <!-- Embed widget -->
  <script src="http://localhost:3000/embed.js"
          data-assistant-id="your-chatbot-id-here"></script>

  <!-- Optional: Custom agent logic -->
  <script>
    // Đợi widget khởi tạo
    setTimeout(() => {
      ChatbotWidget.createAgent('user_123');
    }, 1000);
  </script>
</body>
</html>
```

**Test Checklist**:
- [ ] Bubble icon xuất hiện trên page
- [ ] Click bubble mở chatbox
- [ ] Greeting message hiển thị
- [ ] Theme colors được apply đúng
- [ ] Gõ và gửi message hoạt động
- [ ] AI response xuất hiện trong chat
- [ ] Console không có errors

---

## Phase 3: Frontend - Chuyển Sang BE Source of Truth

### Mục Tiêu
Thay đổi FE Admin UI để BE là source of truth. FE chỉ là UI để CRUD bot templates.

### Thời Gian Ước Tính
3-4 giờ

---

### Task 3.1: Thêm BE APIs Endpoints

**File**: `ui_mgpt/src/utils/storage.ts`

**Thêm BE API layer**:
```typescript
const BE_API_BASE = 'http://localhost:3000/api/letta';

// Helper: Map FE format sang BE format
function mapToBotTemplate(assistant: Partial<AIAssistant>) {
  Đầu vào: AIAssistant object (có thể partial)
  Đầu ra: BotTemplate format

  return {
    name: assistant.name,
    system: assistant.systemPrompt || '',
    greeting: assistant.greeting,
    tools: [],
    theme: {
      primaryColor: assistant.primaryColor || '#1677ff',
      botAvatarUrl: assistant.botAvatarUrl || '',
      bubbleIconUrl: assistant.bubbleIconUrl || '',
      footerText: assistant.footerText || 'Powered by AI'
    }
  };
}

// Helper: Map BE format sang FE format
function mapToAIAssistant(bot: BotTemplate): AIAssistant {
  Đầu vào: BotTemplate từ BE
  Đầu ra: AIAssistant format cho FE

  return {
    id: bot.id,
    name: bot.name,
    greeting: bot.greeting,
    status: 'active',
    knowledgeIds: [],
    systemPrompt: bot.system,
    primaryColor: bot.theme.primaryColor,
    botAvatarUrl: bot.theme.botAvatarUrl,
    bubbleIconUrl: bot.theme.bubbleIconUrl,
    footerText: bot.theme.footerText,
    createdAt: bot.createdAt,
    updatedAt: bot.updatedAt
  };
}
```

---

### Task 3.2: Update Storage Functions

**Thay đổi CRUD operations**:
```typescript
// CREATE - Gọi BE API
export const addAIAssistant = async (item: Omit<AIAssistant, 'id' | 'createdAt' | 'updatedAt'>): Promise<AIAssistant> => {
  Đầu vào: Assistant data không có id/timestamps
  Xử lý:
    const payload = mapToBotTemplate(item);

    const response = await fetch(`${BE_API_BASE}/bots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Failed to create bot template');
    }

    const json = await response.json();
    const bot = json.data.bot;

  Đầu ra: AIAssistant object từ BE response
  Tác động: Bot template được tạo trong BE storage
};

// READ - Load từ BE
export const getAIAssistants = async (): Promise<AIAssistant[]> => {
  Đầu vào: Không
  Xử lý:
    const response = await fetch(`${BE_API_BASE}/bots`);

    if (!response.ok) {
      throw new Error('Failed to fetch bot templates');
    }

    const json = await response.json();
    const bots = json.data.bots;

    return bots.map(mapToAIAssistant);
  Đầu ra: Array of assistants từ BE
  Tác động: Không
};

// UPDATE - Gọi BE API
export const updateAIAssistant = async (id: string, updates: Partial<AIAssistant>): Promise<void> => {
  Đầu vào: ID + partial updates
  Xử lý:
    const payload = mapToBotTemplate(updates);

    const response = await fetch(`${BE_API_BASE}/bots/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Failed to update bot template');
    }
  Đầu ra: Không
  Tác động: Bot template được update trong BE storage
};

// DELETE - Gọi BE API
export const deleteAIAssistant = async (id: string): Promise<void> => {
  Đầu vào: ID
  Xử lý:
    const response = await fetch(`${BE_API_BASE}/bots/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete bot template');
    }
  Đầu ra: Không
  Tác động: Bot template bị xóa khỏi BE storage
};
```

---

### Task 3.3: Xóa localStorage Logic

**Loại bỏ localStorage operations**:
```typescript
// XÓA các functions này:
// - saveAIAssistants()
// - loadAIAssistants() từ localStorage

// localStorage chỉ dùng cho cache (nếu cần optimize UX):
// - Cache response để giảm API calls
// - Clear cache khi có thay đổi
// - Không phải source of truth
```

---

### Task 3.4: Update React Components

**File**: `ui_mgpt/src/pages/AIAssistantsPage.tsx`

**Thay đổi**:
```typescript
// Thay vì load từ localStorage:
const [assistants, setAssistants] = useState<AIAssistant[]>([]);

useEffect(() => {
  // Load từ BE
  getAIAssistants().then(setAssistants);
}, []);

// Khi tạo mới:
const handleCreate = async (data) => {
  const newAssistant = await addAIAssistant(data);
  setAssistants([...assistants, newAssistant]);
};

// Khi update:
const handleUpdate = async (id, updates) => {
  await updateAIAssistant(id, updates);
  // Reload từ BE
  const updated = await getAIAssistants();
  setAssistants(updated);
};

// Khi delete:
const handleDelete = async (id) => {
  await deleteAIAssistant(id);
  setAssistants(assistants.filter(a => a.id !== id));
};
```

---

### Task 3.5: Thêm GET /api/letta/bots Endpoint

**Lưu ý**: Phase 1 chỉ tạo POST/GET/:id/PUT/DELETE cho single bot. Cần thêm GET all bots.

**File**: `src/controllers/letta/bot.controller.ts`

**Thêm**:
```typescript
export const listBots = async (req: Request, res: Response): Promise<void> => {
  Đầu vào: Không
  try {
    const bots = botService.listBots();
    renderSuccess(res, { bots }, 'Bots retrieved successfully');
  } catch (error) {
    renderError(res, error as Error);
  }
  Đầu ra: Array of all bot templates
};
```

**File**: `src/services/letta/bot.service.ts`

**Thêm**:
```typescript
listBots(): BotTemplate[] {
  return Array.from(this.bots.values());
}
```

**File**: `src/routes/letta/bot.routes.ts`

**Thêm route**:
```typescript
router.get('/', botController.listBots);
```

---

### Task 3.6: Testing

**Test flow hoàn chỉnh**:
```
1. Xóa localStorage data cũ (để test clean)

2. Mở FE Admin UI
   Verify: Danh sách assistants rỗng (load từ BE)

3. Tạo mới assistant
   Action: Điền form, click save
   Verify: POST /api/letta/bots được gọi
   Verify: data/bot_templates.json có bot mới
   Verify: FE hiển thị assistant mới

4. Refresh page
   Verify: Assistant vẫn hiển thị (load từ BE, không phải localStorage)

5. Update assistant
   Action: Sửa name, click save
   Verify: PUT /api/letta/bots/:id được gọi
   Verify: File BE được update
   Verify: FE hiển thị data mới

6. Xóa assistant
   Action: Click delete
   Verify: DELETE /api/letta/bots/:id được gọi
   Verify: Bot bị xóa khỏi BE file
   Verify: FE không còn hiển thị assistant
```

**Validation Checklist**:
- [ ] localStorage không còn được sử dụng làm source of truth
- [ ] Mọi operations đều qua BE API
- [ ] FE load data từ BE khi mount
- [ ] Refresh page vẫn giữ data (từ BE)
- [ ] Network tab thấy API calls đúng
- [ ] data/bot_templates.json là single source of truth

---

## Phase 4: Integration Testing

### Mục Tiêu
End-to-end testing của toàn bộ luồng.

### Thời Gian Ước Tính
4-6 giờ

---

### Test Case 1: Luồng Hoàn Chỉnh

**Các bước**:
```
1. Admin tạo AIAssistant trong FE
   Đầu vào: Name, greeting, system prompt, theme
   Verify: data/bot_templates.json chứa bot

2. Admin copy embed code
   Đầu ra: <script src="..." data-assistant-id="xxx"></script>

3. Khách hàng paste code vào test HTML
   Đầu vào: Script tag trong HTML file

4. Mở test HTML trong browser
   Verify: Bubble xuất hiện với đúng theme

5. Click bubble
   Verify: Chatbox mở với greeting message

6. User gõ message và gửi
   Đầu vào: "Hello, I need help"
   Verify: Message xuất hiện trong chat
   Verify: POST đến /api/letta/bots/:id/agents (agent được tạo)
   Verify: POST đến /api/letta/agents/:id/messages

7. AI trả lời
   Verify: Response xuất hiện trong chatbox

8. User gửi message khác
   Verify: AgentId giống được reuse (không tạo agent mới)
   Verify: Conversation context được duy trì
```

**Kết quả mong đợi**: Chat flow hoạt động hoàn chỉnh end-to-end

---

### Test Case 2: Custom Agent Mapping

**Các bước**:
```
1. Khách hàng implement custom logic:
   <script>
     setTimeout(() => {
       const userId = getUserIdFromMyDatabase(); // ví dụ: "user_123"
       ChatbotWidget.getOrCreateAgent(userId);
     }, 1000);
   </script>

2. User A (userId=user_123) chat
   Verify: Agent được tạo và mapped
   Verify: data/agent_mappings.json chứa mapping

3. User A đóng và mở lại page
   Verify: Agent giống được reuse
   Verify: Conversation history được duy trì

4. User B (userId=user_456) chat
   Verify: Agent khác được tạo
   Verify: Conversation riêng biệt
```

**Kết quả mong đợi**: User-specific agents hoạt động đúng

---

### Test Case 3: Multi-Project Isolation

**Các bước**:
```
1. Tạo Bot A (chatbotId=bot-aaa)
2. Tạo Bot B (chatbotId=bot-bbb)
3. Embed cả hai trên cùng test page với chatbotIds khác nhau
4. User chat với Bot A
5. User chat với Bot B
   Verify: Agents riêng biệt
   Verify: Conversations riêng biệt
   Verify: Không bị trộn lẫn data
```

**Kết quả mong đợi**: Nhiều bots hoạt động độc lập

---

## Tổng Kết

### Tổng Thời Gian Implementation
```
Phase 1: Backend Bot System     4-6 giờ
Phase 2: Widget Build           8-12 giờ
Phase 3: FE Architecture Change 3-4 giờ
Phase 4: Integration Testing    4-6 giờ
-------------------------------------------
Tổng:                         19-28 giờ
```

### Critical Path
```
1. Backend Bot Template APIs (Phase 1) - PHẢI hoàn thành trước
2. Widget Build (Phase 2) - Phụ thuộc Phase 1 APIs
3. Integration Testing (Phase 4) - Validate mọi thứ hoạt động
```

### Công việc Optional/Parallel
```
- FE Sync (Phase 3) có thể làm song song với Phase 2
- Tool webhook config có thể hoãn lại sau
```

### Minimal Viable Implementation (Quick Start)
```
Thời gian: 6-8 giờ

Tập trung:
1. Backend Bot CRUD (cơ bản, chưa có agent mapping) - 3 giờ
2. Widget cơ bản (anonymous agent only) - 3-4 giờ
3. Integration test đơn giản - 1 giờ

Bỏ qua:
- Agent mapping (luôn tạo agent mới)
- FE sync (tạo bot manual qua API)
- Tool execution
- Tính năng nâng cao

Kết quả: Demo hoạt động - paste script thì chat được
```

---

Documents trước: [Hiện Trạng](./01-current-state.md) | [Phân Tích Gaps](./02-gaps-analysis.md)
