# Các nguyên tắc REST (REST Principles)

> Thiết kế API dựa trên tài nguyên - sử dụng danh từ, không dùng động từ.

## Quy tắc đặt tên Tài nguyên

```
Nguyên tắc:
├── Sử dụng DANH TỪ, không dùng động từ (tài nguyên, không phải hành động)
├── Sử dụng số NHIỀU (/users thay vì /user)
├── Sử dụng chữ thường kết hợp với dấu gạch ngang (/user-profiles)
├── Lồng ghép cho các mối quan hệ (/users/123/posts)
└── Giữ độ sâu ở mức thấp (tối đa 3 cấp)
```

## Lựa chọn Phương thức HTTP

| Phương thức | Mục đích | Có tính bù trừ (Idempotent)? | Có Body không? |
|--------|---------|-------------|-------|
| **GET** | Đọc tài nguyên | Có | Không |
| **POST** | Tạo tài nguyên mới | Không | Có |
| **PUT** | Thay thế toàn bộ tài nguyên | Có | Có |
| **PATCH** | Cập nhật một phần | Không | Có |
| **DELETE** | Xóa tài nguyên | Có | Không |

## Lựa chọn Mã trạng thái (Status Code)

| Tình huống | Mã | Tại sao |
|-----------|------|-----|
| Thành công (đọc) | 200 | Thành công tiêu chuẩn |
| Đã tạo (Created) | 201 | Tài nguyên mới đã được tạo |
| Không có nội dung | 204 | Thành công, không có gì để trả về |
| Yêu cầu không hợp lệ | 400 | Yêu cầu sai định dạng |
| Chưa xác thực | 401 | Thiếu hoặc sai thông tin xác thực |
| Bị cấm (Forbidden) | 403 | Có xác thực nhưng không có quyền |
| Không tìm thấy | 404 | Tài nguyên không tồn tại |
| Xung đột (Conflict) | 409 | Xung đột trạng thái (trùng lặp) |
| Lỗi dữ liệu | 422 | Cú pháp đúng nhưng dữ liệu không hợp lệ |
| Giới hạn tốc độ | 429 | Quá nhiều yêu cầu |
| Lỗi máy chủ | 500 | Lỗi phía hệ thống |
