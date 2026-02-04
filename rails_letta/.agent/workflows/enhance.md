---
description: Thêm hoặc cập nhật các tính năng trong ứng dụng hiện có. Được sử dụng cho phát triển lặp (iterative development).
---

# /enhance - Cập nhật ứng dụng

$ARGUMENTS

---

## Nhiệm vụ

Lệnh này dùng để thêm các tính năng hoặc thực hiện các cập nhật cho ứng dụng hiện có.

### Các bước:

1. **Hiểu trạng thái hiện tại**
   - Tải trạng thái dự án bằng lệnh `python3 .agent/scripts/session_manager.py info`
   - Hiểu các tính năng hiện có, bộ công nghệ đang dùng

2. **Lập kế hoạch thay đổi**
   - Xác định những gì sẽ được thêm mới hoặc thay đổi
   - Phát hiện các file bị ảnh hưởng
   - Kiểm tra các phần phụ thuộc

3. **Trình bày kế hoạch cho người dùng** (đối với các thay đổi lớn)
   ```
   "Để thêm bảng quản trị:
   - Tôi sẽ tạo 15 file mới
   - Cập nhật 8 file hiện có
   - Dự kiến mất khoảng 10 phút
   
   Tôi có thể bắt đầu không?"
   ```

4. **Triển khai**
   - Gọi các agent liên quan
   - Thực hiện các thay đổi
   - Kiểm thử

5. **Cập nhật Preview**
   - Hot reload hoặc khởi động lại server

---

## Ví dụ sử dụng

```
/enhance thêm chế độ tối (dark mode)
/enhance xây dựng bảng quản trị (admin panel)
/enhance tích hợp hệ thống thanh toán
/enhance thêm tính năng tìm kiếm
/enhance chỉnh sửa trang hồ sơ cá nhân
/enhance làm cho giao diện responsive (đáp ứng)
```

---

## Lưu ý

- Xin ý kiến phê duyệt đối với các thay đổi lớn
- Cảnh báo về các yêu cầu mâu thuẫn (ví dụ: "sử dụng Firebase" trong khi dự án đang dùng PostgreSQL)
- Commit mỗi thay đổi bằng git
