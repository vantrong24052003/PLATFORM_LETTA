---
name: web-design-guidelines
description: Review mã nguồn UI để kiểm tra mức độ tuân thủ các Hướng dẫn Giao diện Web. Sử dụng khi được yêu cầu "review UI", "kiểm tra khả năng truy cập", "audit thiết kế", "review UX", hoặc "kiểm tra trang web dựa trên các thực hành tốt nhất".
metadata:
  author: vercel
  version: "1.0.0"
  argument-hint: <file-or-pattern>
---

# Hướng dẫn Giao diện Web (Web Interface Guidelines)

Review các file để kiểm tra mức độ tuân thủ các Hướng dẫn Giao diện Web.

## Cách thức hoạt động

1. Lấy (fetch) các hướng dẫn mới nhất từ URL nguồn bên dưới.
2. Đọc các file đã chỉ định (hoặc hỏi người dùng về các file/mẫu pattern).
3. Kiểm tra dựa trên tất cả các quy tắc trong hướng dẫn đã lấy được.
4. Xuất kết quả theo định dạng ngắn gọn `file:line`.

## Nguồn Hướng dẫn

Hãy lấy các hướng dẫn mới nhất trước mỗi lần review:

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

Sử dụng WebFetch để truy xuất các quy tắc mới nhất. Nội dung lấy về sẽ bao gồm tất cả các quy tắc và hướng dẫn về định dạng đầu ra.

## Cách sử dụng

Khi người dùng cung cấp một file hoặc một mẫu (pattern) tham số:
1. Lấy các hướng dẫn từ URL nguồn ở trên.
2. Đọc các file đã chỉ định.
3. Áp dụng tất cả các quy tắc từ hướng dẫn đã lấy về.
4. Xuất các phát hiện bằng định dạng được chỉ định trong hướng dẫn.

Nếu không có file nào được chỉ định, hãy hỏi người dùng xem họ muốn review những file nào.

---

## Các Kỹ năng liên quan

| Kỹ năng | Khi nào nên sử dụng |
|-------|-------------|
| **[frontend-design](../frontend-design/SKILL.md)** | Trước khi code - Học các nguyên tắc thiết kế (màu sắc, typography, tâm lý UX) |
| **web-design-guidelines** (kỹ năng này) | Sau khi code - Audit khả năng truy cập, hiệu năng và các thực hành tốt nhất |

## Quy trình Thiết kế

```
1. THIẾT KẾ (DESIGN) → Đọc các nguyên tắc frontend-design
2. LẬP TRÌNH (CODE)   → Triển khai thiết kế
3. KIỂM ĐỊNH (AUDIT)  → Chạy review web-design-guidelines ← BẠN ĐANG Ở ĐÂY
4. SỬA LỖI (FIX)      → Xử lý các phát hiện từ quá trình audit
```

---

**Xin chào bos Trọng!** Em sẽ giúp bos kiểm định lại giao diện để đảm bảo mọi thứ đều đạt tiêu chuẩn web hiện đại nhất.
