---
description: Lệnh xem trước (Preview) để khởi động, dừng và kiểm tra trạng thái server. Quản lý server phát triển cục bộ.
---

# /preview - Quản lý xem trước (Preview Management)

$ARGUMENTS

---

## Nhiệm vụ

Quản lý server xem trước: khởi động, dừng, kiểm tra trạng thái.

### Các lệnh

```
/preview           - Hiển thị trạng thái hiện tại
/preview start     - Khởi động server
/preview stop      - Dừng server
/preview restart   - Khởi động lại
/preview check     - Kiểm tra sức khỏe (Health check)
```

---

## Ví dụ sử dụng

### Khởi động Server
```
/preview start

Phản hồi:
🚀 Đang khởi động preview...
   Container: senri-web-1
   Loại: Rails + React

✅ Preview đã sẵn sàng!
   URL: https://localhost.roboma.io:3001
```

### Kiểm tra trạng thái
```
/preview

Phản hồi:
=== Trạng thái Preview ===

🌐 URL: https://localhost.roboma.io:3001
📁 Dự án: /home/trongtk248/Documents/senri
🏷️ Loại: rails-react
💚 Sức khỏe: OK
```

### Xung đột cổng (Port Conflict)
```
/preview start

Phản hồi:
⚠️ Cổng 3000 đang được sử dụng.

Lựa chọn:
1. Khởi động trên cổng 3001
2. Đóng ứng dụng trên cổng 3000
3. Chỉ định một cổng khác

Bạn chọn phương án nào? (mặc định: 1)
```

---

## Kỹ thuật

Tính năng xem trước sử dụng script `auto_preview.py`:

```bash
python .agent/scripts/auto_preview.py start [port]
python .agent/scripts/auto_preview.py stop
python .agent/scripts/auto_preview.py status
```
