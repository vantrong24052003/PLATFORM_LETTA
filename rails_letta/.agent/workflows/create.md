---
description: Lệnh tạo ứng dụng mới. Kích hoạt bộ kỹ năng App Builder và bắt đầu đối thoại tương tác với người dùng.
---

# /create - Tạo ứng dụng

$ARGUMENTS

---

## Nhiệm vụ

Lệnh này bắt đầu quy trình tạo một ứng dụng mới.

### Các bước:

1. **Phân tích yêu cầu**
   - Hiểu những gì người dùng muốn
   - Nếu thiếu thông tin, sử dụng kỹ năng `conversation-manager` để hỏi thêm

2. **Lập kế hoạch dự án**
   - Sử dụng agent `project-planner` để chia nhỏ nhiệm vụ
   - Xác định bộ công nghệ (tech stack)
   - Lập kế hoạch cấu trúc file
   - Tạo file kế hoạch và tiến hành xây dựng

3. **Xây dựng ứng dụng (Sau khi được phê duyệt)**
   - Điều phối bằng kỹ năng `app-builder`
   - Phối hợp với các agent chuyên gia:
     - `database-architect` → Thiết kế Schema
     - `backend-specialist` → Xây dựng API
     - `frontend-specialist` → Xây dựng giao diện UI

4. **Xem trước (Preview)**
   - Bắt đầu với `auto_preview.py` khi hoàn tất
   - Cung cấp URL cho người dùng

---

## Ví dụ sử dụng

```
/create trang web blog
/create ứng dụng thương mại điện tử với danh sách sản phẩm và giỏ hàng
/create ứng dụng todo
/create bản sao Instagram
/create hệ thống crm với quản lý khách hàng
```

---

## Trước khi bắt đầu

Nếu yêu cầu không rõ ràng, hãy đặt các câu hỏi sau:
- Loại ứng dụng gì?
- Các tính năng cơ bản là gì?
- Ai sẽ sử dụng nó?

Sử dụng các giá trị mặc định, bổ sung chi tiết sau.
