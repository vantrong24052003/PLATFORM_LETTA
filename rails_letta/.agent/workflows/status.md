---
description: Hiển thị trạng thái agent và dự án. Theo dõi tiến độ và bảng trạng thái.
---

# /status - Hiển thị trạng thái

$ARGUMENTS

---

## Nhiệm vụ

Hiển thị trạng thái hiện tại của dự án và các agent.

### Thông tin hiển thị

1. **Thông tin dự án**
   - Tên và đường dẫn dự án
   - Bộ công nghệ (Tech stack)
   - Các tính năng hiện tại

2. **Bảng trạng thái Agent**
   - Những agent nào đang chạy
   - Những nhiệm vụ nào đã hoàn thành
   - Các công việc còn tồn đọng

3. **Thống kê file**
   - Số lượng file đã tạo
   - Số lượng file đã chỉnh sửa

4. **Trạng thái Preview**
   - Server có đang chạy không
   - URL
   - Kiểm tra sức khỏe (Health check)

---

## Ví dụ đầu ra

```
=== Trạng thái Dự án ===

📁 Dự án: senri
📂 Đường dẫn: /home/trongtk248/Documents/senri
🏷️ Loại: rails-react
📊 Trạng thái: đang hoạt động (active)

🔧 Bộ công nghệ:
   Framework: Ruby on Rails 7.x + React 18
   Cơ sở dữ liệu: MySQL 8.0
   Xác thực: Devise + CanCanCan
   Nền tảng: Docker

✅ Tính năng:
   • báo cáo (reports)
   • quản lý chiến dịch (campaigns)
   • xác thực người dùng (auth)

⏳ Đang chờ:
   • tối ưu hóa import dữ liệu

📄 Files: ...

=== Trạng thái Agent ===

✅ backend-specialist → Đã hoàn thành
🔄 frontend-specialist → Đang thực hiện
⏳ test-engineer → Đang chờ

=== Preview ===

🌐 URL: https://localhost.roboma.io:3001
💚 Sức khỏe: OK
```

---

## Kỹ thuật

Lệnh status sử dụng các script:
- `python .agent/scripts/session_manager.py status`
- `python .agent/scripts/auto_preview.py status`
