# Sequence Diagram: Quy trình Truy vấn Database

Để hiểu tại sao có lỗi `409`, boss hãy nhìn vào sơ đồ "3 bên" dưới đây:

```mermaid
sequenceDiagram
    participant U as User (Postman/Web)
    participant R as Project 2 (Rails/Client)
    participant L as Project 1 (Letta/Brain)

    U->>R: 1. "Tìm cho tôi 10 bài viết"
    R->>L: 2. Forward tin nhắn (role: user)
    
    Note over L: Brain quyết định gọi tool: query_local_db
    Note over L: Trạng thái: PENDING_APPROVAL (Đợi duyệt)
    
    L-->>R: 3. Trả về yêu cầu: "Tôi cần gọi tool này" (tool_call)
    
    Note over R: Rails thấy tool_call, tự động chạy DB
    R->>R: 4. Query Database (Có 1034 bài viết)
    
    Note over R: QUAN TRỌNG: Rails gửi kết quả NGƯỢC LẠI
    R->>L: 5. Gửi kết quả (role: tool, content: "Đây là 10 bài...")
    
    Note over L: Brain nhận kết quả, thoát trạng thái PENDING
    L-->>R: 6. Trả về câu trả lời cuối cho User
    R-->>U: 7. "Dưới đây là 10 bài viết..."
```

---

## Giải thích lỗi 409 (PENDING_APPROVAL)

Khi boss gọi lệnh `curl` ở bước **1**, Letta Server đã gửi lại phản hồi ở bước **3** (yêu cầu gọi tool).

**Lỗi xảy ra khi:**
- Boss tiếp tục gửi lệnh `curl` (tin nhắn mới) trong khi Letta vẫn đang ở trạng thái **Đợi duyệt** (giữa bước 3 và 5).
- Letta Server nói: *"Tôi đang đợi boss gửi kết quả database (bước 5), đừng gửi yêu cầu mới!"*

## Cách khắc phục:
1. Team Rails phải đọc JSON ở bước **3**.
2. Lấy cái `tool_call_id`.
3. Gửi một request `POST` với `role: tool` (Bước **5**) để "giải cứu" Letta khỏi trạng thái đợi.

Chi tiết cách gửi Bước 5: [Phase 4: Submit Tool Result](./04-send-response.md)
