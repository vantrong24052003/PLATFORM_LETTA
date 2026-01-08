# API Contract Specification

Tài liệu này định nghĩa giao thức giao tiếp giữa **Project 1 (Letta Server)** và **Project 2 (Client App)**.
Developer của Project 2 (dù dùng Rails, Go, Python, Java...) cần tuân thủ đúng định dạng JSON này.

**Base URL (Project 1)**: `http://localhost:4000/api`

---

## 1. Gửi Tin Nhắn (Chat Request)

Client App gọi API này khi End-User chat một câu mới.

- **Endpoint**: `POST /agents/{agentId}/messages`
- **Headers**: `Content-Type: application/json`

### Request Payload (Client -> Server)

```json
{
  "message": "Tìm cho tôi iPhone 15 giá rẻ nhất",
  "role": "user"
}
```

---

## 2. Phản Hồi Từ Server (Response Pattern)

Server sẽ trả về JSON chứa danh sách các messages. Client App cần parse field `message_type` để quyết định làm gì tiếp theo.

### Trường hợp A: Text Trả Lời (No Tool Call)

Nếu Server chỉ trả lời bằng lời nói.

```json
{
  "messages": [
    {
      "id": "msg-123",
      "role": "assistant",
      "message_type": "login_message", 
      "content": "Chào bạn, tôi có thể giúp gì?"
    }
  ]
}
```

**Hành động Client**: Hiển thị `content` lên UI cho User.

### Trường hợp B: Yêu Cầu Gọi Tool (Tool Call Request)

Nếu Server cần lấy dữ liệu từ DB của bạn.

```json
{
  "messages": [
    {
      "id": "msg-tool-call-123",
      "role": "assistant",
      "message_type": "tool_call_message",
      "tool_calls": [
        {
          "id": "call_abc123",
          "function": {
            "name": "query_db_products",
            "arguments": "{\"keyword\": \"iPhone 15\", \"sort\": \"cheap\", \"limit\": 5}"
          }
        }
      ]
    }
  ]
}
```

**Hành động Client**:
1. Detect `message_type == "tool_call_message"`.
2. Lấy `tool_calls[0].function.name` (ví dụ: `query_db_products`).
3. Parse `arguments` (JSON string) thành Object.
4. Thực thi hàm tương ứng trong code của bạn (ví dụ: `ProductService.search(...)`).

---

## 3. Gửi Kết Quả Tool (Submit Tool Output)

Sau khi Client App chạy xong query DB local, cần gửi kết quả ngược lại Server.

- **Endpoint**: `POST /agents/{agentId}/messages`

### Request Payload (Client -> Server)

```json
{
  "messages": [
    {
      "role": "tool",
      "tool_call_id": "call_abc123", 
      "content": "[{\"name\": \"iPhone 15 128GB\", \"price\": 18000000}, {\"name\": \"iPhone 15 Pro\", \"price\": 24000000}]"
    }
  ]
}
```

- **`tool_call_id`**: Phải trùng khớp với ID nhận được ở bước 2.
- **`content`**: Phải là String (JSON Stringified array/object).

---

## 4. Phản Hồi Cuối Cùng (Final Answer)

Server nhận tool output -> Tổng hợp -> Trả về câu trả lời cuối cùng cho User.

```json
{
  "messages": [
    {
      "id": "msg-final-456",
      "role": "assistant",
      "message_type": "login_message",
      "content": "Tôi tìm thấy 2 sản phẩm iPhone 15 giá tốt nhất là..."
    }
  ]
}
```

**Hành động Client**: Hiển thị `content` lên UI.

---

## Flow Mapping (Cho Rails/Go/Python)

| Bước | Project 1 (API) | Project 2 (Logic của bạn) |
|------|-----------------|---------------------------|
| 1    | Nhận `POST /messages` | Dùng HTTP Client (Faraday/Axios) gửi request |
| 2    | Trả về `tool_call` | Parse JSON, Switch-Case tên function |
| 3    | Chờ kết quả | Query DB (ActiveRecord/Gorm), JSON.dump kết quả |
| 4    | Nhận `POST /messages` | Gửi kết quả về lại Project 1 |
