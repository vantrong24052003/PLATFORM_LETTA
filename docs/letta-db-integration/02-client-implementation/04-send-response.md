# Phase 4: Submit Tool Result (Trình kết quả)

Khi boss nhận được lỗi `409 PENDING_APPROVAL` hoặc thấy AI gửi yêu cầu `tool_calls`, đây là lúc Project 2 (Rails/Go) thực hiện nhiệm vụ của mình.

---

## 1. Cơ chế Hoạt động
Letta Server (Bộ não) đang tạm dừng. Nó cần boss gửi lại một "tin nhắn đặc biệt" chứa kết quả từ database.

**Lưu ý**: Boss không gọi API "Approve" riêng lẻ, mà gửi kết quả tool chính là một hình thức Approve và cho phép AI chạy tiếp.

---

## 2. Cách gửi kết quả qua Postman

Gửi `POST` đến cùng endpoint chat: `http://localhost:4000/api/agents/{agent_id}/messages`

**Payload (JSON)**:
```json
{
  "messages": [
    {
      "role": "tool",
      "tool_call_id": "call_abc123", 
      "content": "Đây là kết quả từ DB local: 10 bài viết về AI..."
    }
  ]
}
```

### Trong đó:
- **`role`**: Phải là `"tool"`.
- **`tool_call_id`**: Phải khớp chính xác với ID mà AI đã gửi trong `tool_calls` trước đó.
- **`content`**: Chuỗi kết quả (JSON string hoặc văn bản) mà boss muốn AI đọc.

---

## 3. Quy trình tự động cho Project 2

1. **User chat**: "Tìm 10 bài viết".
2. **P2 -> P1**: Gửi tin nhắn.
3. **P1 -> P2**: Trả về `tool_calls` (AI muốn gọi `query_local_db`).
4. **P2 logic**: 
   - Thấy có `tool_calls` -> Dừng flow chat.
   - Query DB Rails -> Có 10 bài viết.
   - **Gửi lại P1**: Gửi payload `role: tool` như trên.
5. **P1 -> P2**: Trả về câu trả lời cuối cùng: "Dựa trên database, tôi tìm thấy 10 bài viết sau...".

---

## 4. Xử lý lỗi 409
Nếu boss nhận được `409`, nghĩa là boss đang cố gửi tin nhắn mới (`role: user`) trong khi AI vẫn đang đợi kết quả tool (`role: tool`). 
-> Hãy gửi kết quả tool trước, AI sẽ thoát khỏi trạng thái Pending!

Tiếp theo: [Triển khai Rails (Thực tế)](../02-client-implementation/04-send-response.md)
