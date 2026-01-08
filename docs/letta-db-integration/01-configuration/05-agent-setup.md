# Phase 2: Configure Agent (Project 1)

## Mục tiêu
Cấu hình Agent trên Letta Server (P1) để nó biết sử dụng tool vừa tạo từ Project 2.

**Thực hiện tại:** Project 1 (Dashboard hoặc API).

## Gắn Tool vào Agent

Bạn cần Add tool `query_local_db` vào Block Tools của Agent.

## System Prompting

Sửa Agent Instructions để nó hiểu quy tắc ứng xử:

```text
You are a sales assistant.
You do NOT have a database.
Whenever a user asks about products (prices, stock, types), you MUST use the `query_local_db` tool.
Do not guess data. Wait for the tool result.
```

## Checkpoint

Test chat trực tiếp trên Dashboard của Project 1 (Server):

**User**: "Có laptop nào rẻ không?"

**Agent (Response)**:
- Agent KHÔNG được trả lời bằng text ngay.
- Agent phải sinh ra một **Tool Call Message** (hoặc trạng thái request approval).
- Nội dung: `query_local_db({ category: 'laptop' })`.

Nếu thấy trạng thái này -> **PASS**. Agent đã biết ủy quyền cho Client App.
