# Phase 1: Define Tool & Register (Project 2 -> Project 1)

## Mục tiêu
Client App (P2) cần cho Letta Server (P1) biết rằng: "Tôi có capability này, hãy gọi tôi khi cần".

**Thực hiện tại:** Code tại Project 2, nhưng gọi API sang Project 1 để đăng ký.

## Tool Definition

Tool này chỉ là **interface** (vỏ bọc) để Agent nhìn thấy. Agent không chạy code này, code thật nằm ở P2.

```typescript
// project2/src/tools/definitions.ts

export const productToolDef = {
  name: "query_local_db",
  description: "Query product database via client app. Use when user asks about products.",
  parameters: {
    type: "object",
    properties: {
      category: { type: "string" },
      max_price: { type: "number" }
    },
    required: ["category"]
  }
};
```

## Register Script

Client App chạy script này 1 lần để push tool lên Server.

```typescript
// project2/scripts/register-tool.ts
import { LettaClient } from '@letta-ai/letta-client';

const client = new LettaClient({ 
  baseUrl: 'http://project1-letta-server.com', // URL của Project 1
  apiKey: 'p1-api-key' 
});

async function register() {
  await client.tools.upsert({
    name: "query_local_db",
    description: productToolDef.description,
    jsonSchema: { 
      type: "function", 
      function: productToolDef 
    },
    // Source code giả, chỉ để trigger return
    sourceCode: `def query_local_db(**kwargs): return "CLIENT_SIDE_EXECUTION"`,
    // QUAN TRỌNG: Tool này cần approval/client execution
    defaultRequiresApproval: true 
  });
  console.log('Tool registered on Letta Server');
}
```

## Checkpoint

- Login vào Dashboard của Project 1.
- Kiểm tra mục Tools.
- Thấy tool `query_local_db` xuất hiện -> **PASS**.
