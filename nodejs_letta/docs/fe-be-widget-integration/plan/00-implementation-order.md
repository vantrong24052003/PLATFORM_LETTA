# Implementation Order - Thứ Tự Thực Thi A-Z

Document này define **ĐÚNG THỨ TỰ** và **CHECKLIST** chi tiết từng bước để hoàn thành widget platform.

---

## Phase 0: Database Migration

### Mục Đích
Tạo 2 bảng `bot_templates` và `agent_mappings` trong Letta PostgreSQL.

### Checklist

#### Task 0.1: Chạy Migration
- [ ] Kiểm tra Letta container đang chạy: `docker ps | grep letta`
- [ ] Chạy migration: `cat migrations/create_bot_tables.sql | docker exec -i letta_server psql -U letta -d letta`
- [ ] Kiểm tra bảng `bot_templates`: `docker exec letta_server psql -U letta -d letta -c "\d letta.bot_templates"`
- [ ] Kiểm tra bảng `agent_mappings`: `docker exec letta_server psql -U letta -d letta -c "\d letta.agent_mappings"`
- [ ] Kiểm tra sample data: `docker exec letta_server psql -U letta -d letta -c "SELECT * FROM letta.bot_templates;"`

#### Task 0.2: Cấu Hình Kết Nối DB
- [ ] Install pg client: `npm install pg`
- [ ] Install types: `npm install @types/pg --save-dev`
- [ ] Tạo DB config với connection pool
- [ ] Export pool instance
- [ ] Test kết nối

### Chi Tiết Thực Hiện

```bash
# 1. Kiểm tra Letta đang chạy
docker ps | grep letta_server

# 2. Chạy migration
cat migrations/create_bot_tables.sql | docker exec -i letta_server psql -U letta -d letta

# 3. Verify
docker exec letta_server psql -U letta -d letta -c "\d letta.bot_templates"
docker exec letta_server psql -U letta -d letta -c "\d letta.agent_mappings"
docker exec letta_server psql -U letta -d letta -c "SELECT * FROM letta.bot_templates;"
```

**Output mong đợi**:
- Bảng `bot_templates` với 11 columns
- Bảng `agent_mappings` với 6 columns
- 1 row sample data trong `bot_templates`

**Tham khảo**: `migrations/README.md`

---

## Phase 1: Backend - Bot Template System

### Mục Đích
Implement CRUD operations cho bot_templates và agent_mappings, expose REST APIs.

### Checklist

#### Task 1.1: Setup Database Connection

**File**: `src/config/database.config.ts` (tạo mới)

- [ ] Import Pool từ pg
- [ ] Tạo pool instance với connection string
- [ ] Export pool
- [ ] Thêm các biến env vào `.env`:
  - [ ] `LETTA_DB_HOST=localhost`
  - [ ] `LETTA_DB_PORT=5433`
  - [ ] `LETTA_DB_USER=letta`
  - [ ] `LETTA_DB_PASSWORD=letta`
  - [ ] `LETTA_DB_NAME=letta`

#### Task 1.2: Thêm TypeScript Types

**File**: `src/types/index.ts`

- [ ] Thêm interface `BotTemplate`
- [ ] Thêm interface `AgentMapping`
- [ ] Thêm interface `BotCreateInput`
- [ ] Thêm interface `BotUpdateInput`

#### Task 1.3: Tạo BotService

**File**: `src/services/letta/bot.service.ts`

- [ ] Tạo class `BotService`
- [ ] Import database pool
- [ ] Import letta service
- [ ] Implement `createBot()` - INSERT vào bot_templates
- [ ] Implement `getBot()` - SELECT từ bot_templates WHERE id
- [ ] Implement `listBots()` - SELECT * FROM bot_templates
- [ ] Implement `updateBot()` - UPDATE bot_templates SET ... WHERE id
- [ ] Implement `deleteBot()` - DELETE FROM bot_templates WHERE id
- [ ] Implement `getOrCreateAgent()`:
  - [ ] Kiểm tra agent_mappings: SELECT WHERE chatbot_id AND user_id
  - [ ] Nếu có → trả về agent_id
  - [ ] Nếu chưa có:
    - [ ] Load bot config: SELECT FROM bot_templates
    - [ ] Gọi Letta API: createAgent với config
    - [ ] Lưu mapping: INSERT INTO agent_mappings
    - [ ] Trả về agent_id
- [ ] Implement `getAgentByUser()` - SELECT FROM agent_mappings
- [ ] Export singleton instance

#### Task 1.4: Tạo BotController

**File**: `src/controllers/letta/bot.controller.ts`

- [ ] Implement `createBot()` - handler cho POST /bots
- [ ] Implement `getBot()` - handler cho GET /bots/:id
- [ ] Implement `listBots()` - handler cho GET /bots
- [ ] Implement `updateBot()` - handler cho PUT /bots/:id
- [ ] Implement `deleteBot()` - handler cho DELETE /bots/:id
- [ ] Implement `createAgentForBot()` - handler cho POST /bots/:id/agents
- [ ] Implement `getAgentByUser()` - handler cho GET /bots/:id/agents

#### Task 1.5: Thêm Routes

**File**: `src/routes/letta/bot.routes.ts`

- [ ] Tạo file mới
- [ ] Thêm route `POST /`
- [ ] Thêm route `GET /`
- [ ] Thêm route `GET /:chatbotId`
- [ ] Thêm route `PUT /:chatbotId`
- [ ] Thêm route `DELETE /:chatbotId`
- [ ] Thêm route `POST /:chatbotId/agents`
- [ ] Thêm route `GET /:chatbotId/agents`
- [ ] Export router

**File**: `src/routes/letta/index.ts`

- [ ] Import bot routes
- [ ] Thêm `router.use('/bots', botRoutes)`

#### Task 1.6: Cấu Hình CORS

**File**: `src/app.ts`

- [ ] Install `cors` package: `npm install cors @types/cors`
- [ ] Import cors middleware
- [ ] Cấu hình CORS origins (localhost + production domains)
- [ ] Apply cors middleware

#### Task 1.7: Test Backend APIs

- [ ] Test POST /api/letta/bots (tạo bot)
  - [ ] Kiểm tra: SELECT * FROM letta.bot_templates WHERE id=?
- [ ] Test GET /api/letta/bots (list tất cả bots)
  - [ ] Kiểm tra: Response chứa bots từ DB
- [ ] Test GET /api/letta/bots/:id (lấy 1 bot)
  - [ ] Kiểm tra: Response có đúng bot data
- [ ] Test PUT /api/letta/bots/:id (update bot)
  - [ ] Kiểm tra: SELECT FROM bot_templates → data đã update
- [ ] Test DELETE /api/letta/bots/:id (xóa bot)
  - [ ] Kiểm tra: SELECT FROM bot_templates → không còn record
- [ ] Test POST /api/letta/bots/:id/agents (tạo agent mapping)
  - [ ] Kiểm tra: Letta agent được tạo
  - [ ] Kiểm tra: SELECT FROM agent_mappings → có mapping
- [ ] Test GET /api/letta/bots/:id/agents?userId=xxx (lấy agent mapping)
  - [ ] Kiểm tra: Trả về đúng agent_id
- [ ] Test lại với cùng userId → agent được tái sử dụng (không tạo mới)

### Chi Tiết Code

#### 1.1. Database Config

**File**: `src/config/database.config.ts`

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.LETTA_DB_HOST || 'localhost',
  port: parseInt(process.env.LETTA_DB_PORT || '5433'),
  user: process.env.LETTA_DB_USER || 'letta',
  password: process.env.LETTA_DB_PASSWORD || 'letta',
  database: process.env.LETTA_DB_NAME || 'letta',
});

export default pool;
```

**File**: `.env`

```bash
# Thêm vào .env
LETTA_DB_HOST=localhost
LETTA_DB_PORT=5433
LETTA_DB_USER=letta
LETTA_DB_PASSWORD=letta
LETTA_DB_NAME=letta
```

**Test Connection**:

```typescript
// src/scripts/test-db.ts
import pool from '../config/database.config';

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Database connected:', result.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error('✗ Database error:', error);
    process.exit(1);
  }
}

testConnection();
```

```bash
# Test
npx ts-node src/scripts/test-db.ts
```

#### 1.2. TypeScript Types

**File**: `src/types/index.ts`

```typescript
// Thêm vào existing types
export interface BotTemplate {
  id: string;
  name: string;
  greeting: string;
  system: string;
  llm_config?: any;
  tool_rules?: any[];
  theme_config?: any;
  organization_id: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface AgentMapping {
  id: number;
  chatbot_id: string;
  user_id: string | null;
  agent_id: string;
  created_at: Date;
  last_used_at: Date;
}

export interface BotCreateInput {
  id: string;
  name: string;
  greeting: string;
  system: string;
  llm_config?: any;
  tool_rules?: any[];
  theme_config?: any;
  organization_id: string;
}
```

#### 1.3. BotService

**File**: `src/services/letta/bot.service.ts`

```typescript
import pool from '../../config/database.config';
import lettaService from './letta.service';
import { BotTemplate, AgentMapping, BotCreateInput } from '../../types';

class BotService {
  // CREATE bot template
  async createBot(input: BotCreateInput): Promise<BotTemplate> {
    const query = `
      INSERT INTO letta.bot_templates 
        (id, name, greeting, system, llm_config, tool_rules, theme_config, organization_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      input.id,
      input.name,
      input.greeting,
      input.system,
      JSON.stringify(input.llm_config || {}),
      JSON.stringify(input.tool_rules || []),
      JSON.stringify(input.theme_config || {}),
      input.organization_id,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // GET bot template by ID
  async getBot(id: string): Promise<BotTemplate | null> {
    const query = 'SELECT * FROM letta.bot_templates WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // LIST all bot templates
  async listBots(): Promise<BotTemplate[]> {
    const query = 'SELECT * FROM letta.bot_templates ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  // UPDATE bot template
  async updateBot(id: string, updates: Partial<BotTemplate>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.name) {
      fields.push(`name = $${paramIndex++}`);
      values.push(updates.name);
    }
    if (updates.greeting) {
      fields.push(`greeting = $${paramIndex++}`);
      values.push(updates.greeting);
    }
    if (updates.system) {
      fields.push(`system = $${paramIndex++}`);
      values.push(updates.system);
    }
    if (updates.theme_config) {
      fields.push(`theme_config = $${paramIndex++}`);
      values.push(JSON.stringify(updates.theme_config));
    }

    if (fields.length === 0) return;

    values.push(id);
    const query = `
      UPDATE letta.bot_templates 
      SET ${fields.join(', ')}, updated_at = NOW() 
      WHERE id = $${paramIndex}
    `;

    await pool.query(query, values);
  }

  // DELETE bot template
  async deleteBot(id: string): Promise<void> {
    const query = 'DELETE FROM letta.bot_templates WHERE id = $1';
    await pool.query(query, [id]);
  }

  // GET or CREATE agent mapping
  async getOrCreateAgent(chatbotId: string, userId?: string): Promise<string> {
    // 1. Check existing mapping
    const checkQuery = `
      SELECT agent_id FROM letta.agent_mappings 
      WHERE chatbot_id = $1 AND user_id = $2
    `;
    const checkResult = await pool.query(checkQuery, [chatbotId, userId || null]);

    if (checkResult.rows.length > 0) {
      return checkResult.rows[0].agent_id;
    }

    // 2. Load bot config
    const bot = await this.getBot(chatbotId);
    if (!bot) {
      throw new Error(`Bot template not found: ${chatbotId}`);
    }

    // 3. Create agent in Letta
    const agent = await lettaService.createAgent({
      name: `${bot.name} - ${userId || 'anonymous'}`,
      system: bot.system,
      // Parse JSON fields
      ...(bot.llm_config && JSON.parse(bot.llm_config as any)),
    });

    // 4. Save mapping
    const insertQuery = `
      INSERT INTO letta.agent_mappings (chatbot_id, user_id, agent_id)
      VALUES ($1, $2, $3)
      RETURNING agent_id
    `;
    const insertResult = await pool.query(insertQuery, [
      chatbotId,
      userId || null,
      agent.id,
    ]);

    return insertResult.rows[0].agent_id;
  }

  // GET agent by user
  async getAgentByUser(chatbotId: string, userId?: string): Promise<string | null> {
    const query = `
      SELECT agent_id FROM letta.agent_mappings 
      WHERE chatbot_id = $1 AND user_id = $2
    `;
    const result = await pool.query(query, [chatbotId, userId || null]);
    return result.rows[0]?.agent_id || null;
  }
}

export default new BotService();
```

#### 1.4. BotController

**File**: `src/controllers/letta/bot.controller.ts`

```typescript
import { Request, Response } from 'express';
import botService from '../../services/letta/bot.service';
import { renderSuccess, renderError } from '../../utils/response.helper';

export const createBot = async (req: Request, res: Response) => {
  try {
    const bot = await botService.createBot(req.body);
    renderSuccess(res, { bot }, 'Bot created successfully');
  } catch (error) {
    renderError(res, error as Error);
  }
};

export const getBot = async (req: Request, res: Response) => {
  try {
    const bot = await botService.getBot(req.params.id);
    if (!bot) {
      return renderError(res, new Error('Bot not found'));
    }
    renderSuccess(res, { bot });
  } catch (error) {
    renderError(res, error as Error);
  }
};

export const listBots = async (req: Request, res: Response) => {
  try {
    const bots = await botService.listBots();
    renderSuccess(res, { bots });
  } catch (error) {
    renderError(res, error as Error);
  }
};

export const updateBot = async (req: Request, res: Response) => {
  try {
    await botService.updateBot(req.params.id, req.body);
    renderSuccess(res, {}, 'Bot updated successfully');
  } catch (error) {
    renderError(res, error as Error);
  }
};

export const deleteBot = async (req: Request, res: Response) => {
  try {
    await botService.deleteBot(req.params.id);
    renderSuccess(res, {}, 'Bot deleted successfully');
  } catch (error) {
    renderError(res, error as Error);
  }
};

export const getOrCreateAgent = async (req: Request, res: Response) => {
  try {
    const { chatbotId } = req.params;
    const { userId } = req.body;

    const agentId = await botService.getOrCreateAgent(chatbotId, userId);
    renderSuccess(res, { agentId });
  } catch (error) {
    renderError(res, error as Error);
  }
};
```

#### 1.5. Routes

**File**: `src/routes/letta/bot.routes.ts`

```typescript
import { Router } from 'express';
import * as botController from '../../controllers/letta/bot.controller';

const router = Router();

router.post('/', botController.createBot);
router.get('/', botController.listBots);
router.get('/:id', botController.getBot);
router.put('/:id', botController.updateBot);
router.delete('/:id', botController.deleteBot);
router.post('/:chatbotId/agents', botController.getOrCreateAgent);

export default router;
```

**File**: `src/routes/letta/index.ts`

```typescript
// Thêm import
import botRoutes from './bot.routes';

// Thêm vào existing router
router.use('/bots', botRoutes);
```

#### 1.6. Test APIs

```bash
# Start server
npm run dev

# Test CREATE bot
curl -X POST http://localhost:3000/api/letta/bots \
  -H "Content-Type: application/json" \
  -d '{
    "id": "bot_test_123",
    "name": "Test Bot",
    "greeting": "Hello!",
    "system": "You are a test bot",
    "organization_id": "org-00000000-0000-4000-8000-000000000000"
  }'

# Test GET bot
curl http://localhost:3000/api/letta/bots/bot_test_123

# Test LIST bots
curl http://localhost:3000/api/letta/bots

# Test GET or CREATE agent
curl -X POST http://localhost:3000/api/letta/bots/bot_test_123/agents \
  -H "Content-Type: application/json" \
  -d '{"userId": "user_456"}'
```

---

## Phase 2: Widget - Xây Dựng embed.js

### Mục Đích
Build embed.js widget (Vanilla JS) để customer có thể paste vào website.

### Checklist

#### Task 2.1: Khởi Tạo Project
- [ ] Tạo folder `widget/` (ngang hàng với PLATFORM_LETTA, ui_mgpt)
- [ ] Init npm: `npm init -y`
- [ ] Install webpack: `npm install --save-dev webpack webpack-cli`
- [ ] Install babel: `npm install --save-dev babel-loader @babel/core @babel/preset-env`
- [ ] Install loaders: `npm install --save-dev style-loader css-loader`
- [ ] Tạo `webpack.config.js`
- [ ] Cập nhật `package.json` scripts (build, dev)
- [ ] Tạo folder `src/`
- [ ] Tạo folder `dist/`

#### Task 2.2: Tạo Core Files

**File**: `src/config.js`
- [ ] Define API_BASE constant
- [ ] Export configuration

**File**: `src/bot.js`
- [ ] Implement `loadBotConfig(chatbotId)` - gọi GET /bots/:id
- [ ] Export function

**File**: `src/agent.js`
- [ ] Thêm biến `currentAgentId`
- [ ] Implement `createAgent(chatbotId, userId)` - gọi POST /bots/:id/agents
- [ ] Implement `getAgentByUser(chatbotId, userId)` - gọi GET /bots/:id/agents
- [ ] Implement `getCurrentAgent()` - getter
- [ ] Implement `setAgent(agentId)` - setter
- [ ] Export functions

**File**: `src/ui.js`
- [ ] Thêm biến `isOpen`
- [ ] Implement `renderBubble(theme)` - tạo bubble DOM
- [ ] Implement `renderChatbox(config)` - tạo chatbox DOM
- [ ] Implement `toggleChat()` - show/hide chatbox
- [ ] Implement `addMessage(content, role)` - append message
- [ ] Implement `showTypingIndicator()` - loading state
- [ ] Implement `hideTypingIndicator()` - xóa loading
- [ ] Implement `setupEventListeners()` - wire up clicks
- [ ] Export functions

**File**: `src/chat.js`
- [ ] Implement `sendMessage(message)` - gọi POST /agents/:id/messages
- [ ] Implement `parseResponse(messages)` - parse AI response
- [ ] Implement `displayMessages(messages)` - hiển thị trong UI
- [ ] Export functions

**File**: `src/tool-execution.js`
- [ ] Implement `handleToolCall(toolCall)` - xử lý tool calls
- [ ] Implement `executeWebhook(url, method, data)` - gọi customer webhook
- [ ] Implement `handleApproval(requestId, approved)` - HITL approval
- [ ] Export functions

**File**: `src/styles.css`
- [ ] Style cho bubble
- [ ] Style cho chatbox
- [ ] Style cho messages
- [ ] Style cho input
- [ ] Responsive styles

**File**: `src/index.js`
- [ ] Implement auto-init IIFE
- [ ] Đọc chatbotId từ data-assistant-id
- [ ] Load bot config
- [ ] Render bubble và chatbox
- [ ] Expose `window.ChatbotWidget` APIs:
  - [ ] `setAgent(agentId)`
  - [ ] `createAgent(userId)`
  - [ ] `getOrCreateAgent(userId)`
  - [ ] `openChat()`
  - [ ] `closeChat()`
  - [ ] `sendMessage(message)`
  - [ ] `onBubbleClick(callback)`

#### Task 2.3: Cấu Hình Build

**File**: `webpack.config.js`

- [ ] Set mode: 'production'
- [ ] Set entry: './src/index.js'
- [ ] Set output: 'dist/embed.js', library: 'ChatbotWidget', UMD
- [ ] Thêm babel-loader rule
- [ ] Thêm css-loader rule
- [ ] Test build: `npm run build`
- [ ] Kiểm tra `dist/embed.js` được tạo

#### Task 2.4: Test Widget
- [ ] Tạo test HTML file
- [ ] Paste embed script tag
- [ ] Test: Bubble hiển thị
- [ ] Test: Click bubble → chatbox mở
- [ ] Test: Greeting message hiển thị
- [ ] Test: Theme colors đúng
- [ ] Test: Gửi message → AI response
- [ ] Test: Nhiều messages → conversation flow
- [ ] Test: Tool calls (nếu có)

### Chi Tiết Code

**Tham khảo**: `02-widget-implementation/` folder cho full implementation guide.

---

## Phase 3: FE - Thay Đổi Architecture

### Mục Đích
Refactor FE Admin UI để gọi BE APIs thay vì lưu localStorage.

### Checklist

#### Task 3.1: Cập Nhật Storage Utility

**File**: `ui_mgpt/src/utils/storage.ts`

- [ ] Thêm constant `BE_API_BASE`
- [ ] Implement `mapToBotTemplate()` - helper mapping
- [ ] Implement `mapToAIAssistant()` - helper mapping
- [ ] **Xóa** localStorage read/write logic
- [ ] Refactor `addAIAssistant()` - gọi POST /api/letta/bots
- [ ] Refactor `getAIAssistants()` - gọi GET /api/letta/bots
- [ ] Refactor `updateAIAssistant()` - gọi PUT /api/letta/bots/:id
- [ ] Refactor `deleteAIAssistant()` - gọi DELETE /api/letta/bots/:id
- [ ] Thêm error handling
- [ ] Thêm loading states

#### Task 3.2: Cập Nhật React Components

**File**: `ui_mgpt/src/pages/AIAssistantsPage.tsx`

- [ ] Cập nhật `useEffect` - load từ BE thay vì localStorage
- [ ] Cập nhật `handleCreate` - gọi async API
- [ ] Cập nhật `handleUpdate` - gọi async API
- [ ] Cập nhật `handleDelete` - gọi async API
- [ ] Thêm loading spinner
- [ ] Thêm error messages

**File**: `ui_mgpt/src/pages/AIAssistantConfigPage.tsx`

- [ ] Cập nhật form submit - gọi BE API
- [ ] Thêm loading states
- [ ] Thêm success/error notifications

#### Task 3.3: Dọn Dẹp Code
- [ ] Xóa unused localStorage functions
- [ ] Xóa localStorage keys constants
- [ ] Cập nhật types nếu cần

#### Task 3.4: Test FE
- [ ] Test: Tạo assistant → kiểm tra API call
- [ ] Test: List assistants → load từ BE
- [ ] Test: Update assistant → kiểm tra API call
- [ ] Test: Delete assistant → kiểm tra API call
- [ ] Test: Refresh page → data vẫn còn (từ BE)
- [ ] Test: Network tab → đúng APIs được gọi

---

## Phase 4: Integration Testing

### Mục Đích
Test end-to-end flow từ Admin tạo bot → Customer sử dụng widget.

### Checklist

#### Task 4.1: Test End-to-End Flow
- [ ] Admin mở FE UI
- [ ] Admin tạo bot template
- [ ] Kiểm tra: `SELECT * FROM letta.bot_templates` → có record mới
- [ ] Copy embed code
- [ ] Paste vào test HTML
- [ ] Mở test page trong browser
- [ ] Kiểm tra bubble xuất hiện
- [ ] Click bubble
- [ ] Kiểm tra chatbox mở với greeting
- [ ] Gửi message "Hello"
- [ ] Kiểm tra AI response
- [ ] Gửi message thứ 2
- [ ] Kiểm tra conversation context được giữ

#### Task 4.2: Test Agent Mapping
- [ ] Setup: Tạo bot template
- [ ] Test: User A chat (userId="user_1")
- [ ] Kiểm tra: Agent được tạo trong Letta
- [ ] Kiểm tra: `SELECT * FROM letta.agent_mappings` → có mapping
- [ ] Test: User A refresh page, chat lại
- [ ] Kiểm tra: Agent được tái sử dụng (agent_mappings không có record mới)
- [ ] Test: User B chat (userId="user_2")
- [ ] Kiểm tra: Agent mới được tạo
- [ ] Kiểm tra: `SELECT COUNT(*) FROM letta.agent_mappings` → có 2 mappings
- [ ] Kiểm tra: Conversations riêng biệt (check messages trong Letta)

#### Task 4.3: Test Multi-Project
- [ ] Tạo Bot A (chatbotId="bot_A")
- [ ] Tạo Bot B (chatbotId="bot_B")
- [ ] Embed cả 2 trên cùng page
- [ ] Test: Chat với Bot A
- [ ] Test: Chat với Bot B
- [ ] Kiểm tra: Agents riêng biệt
- [ ] Kiểm tra: Conversations không bị trộn lẫn

#### Task 4.4: Test Error Handling
- [ ] Test: Invalid chatbotId → error message
- [ ] Test: BE down → graceful failure
- [ ] Test: Network timeout → retry hoặc error
- [ ] Test: Invalid user input → validation

#### Task 4.5: Test Performance
- [ ] Đo: Page load time với widget
- [ ] Đo: Time to first bubble render
- [ ] Đo: API response time
- [ ] Đo: Chat message latency
- [ ] Tối ưu nếu cần

---

## Phase 5: Deployment (Tùy Chọn)

### Checklist

#### Task 5.1: Deploy Widget
- [ ] Setup CDN (Cloudflare/Vercel/S3)
- [ ] Upload `embed.js` lên CDN
- [ ] Cấu hình cache headers
- [ ] Cập nhật embed URL trong FE

#### Task 5.2: Deploy Backend
- [ ] Setup production environment
- [ ] Cấu hình CORS cho production domains
- [ ] Cấu hình kết nối Letta DB (production credentials)
- [ ] Kiểm tra migration đã chạy trên production DB
- [ ] Cấu hình kết nối Letta API
- [ ] Setup monitoring/logging
- [ ] Setup lịch backup DB

#### Task 5.3: Deploy FE Admin
- [ ] Build production: `npm run build`
- [ ] Deploy lên hosting (Vercel/Netlify)
- [ ] Cập nhật API_BASE thành production URL
- [ ] Test production flow

---

## Additional Tasks (Tùy Chọn)

### Documentation
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Ví dụ sử dụng widget
- [ ] Hướng dẫn tích hợp cho customer
- [ ] Hướng dẫn troubleshooting

### Advanced Features
- [ ] WebSocket support (real-time chat)
- [ ] Upload file trong chat
- [ ] Voice input
- [ ] Analytics tracking
- [ ] A/B testing
- [ ] Multi-language support

### Security
- [ ] Rate limiting
- [ ] API authentication
- [ ] Input sanitization
- [ ] XSS prevention
- [ ] CSRF protection

---

## Summary Thứ Tự

```
Phase 0: Migration        → Tạo 2 bảng trong Letta DB
Phase 1: Backend          → CRUD APIs cho bot_templates + agent_mappings
Phase 2: Widget           → Build embed.js với Vanilla JS
Phase 3: FE Refactor      → Admin UI gọi BE APIs (xóa localStorage)
Phase 4: Testing          → E2E flow testing
Phase 5: Deployment       → Production deployment (tùy chọn)
```

**ĐỌC VÀ THỰC HIỆN THEO THỨ TỰ NÀY!**
