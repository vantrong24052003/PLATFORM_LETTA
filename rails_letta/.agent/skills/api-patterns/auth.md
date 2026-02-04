# Các Mẫu Xác thực (Authentication Patterns)

> Lựa chọn mẫu xác thực dựa trên mục đích sử dụng.

## Hướng dẫn Lựa chọn

| Mẫu | Tốt nhất cho |
|---------|----------|
| **JWT** | Không lưu trạng thái (Stateless), microservices |
| **Session** | Web truyền thống, các dự án đơn giản |
| **OAuth 2.0** | Tích hợp với bên thứ ba |
| **API Keys** | Kết nối server-to-server, các API công khai |
| **Passkey** | Đăng nhập không mật khẩu hiện đại (2025+) |

## Các Nguyên tắc JWT (JWT Principles)

```
Quan trọng:
├── Luôn xác thực chữ ký
├── Kiểm tra thời gian hết hạn (expiration)
├── Chỉ bao gồm các thông tin tối thiểu (claims)
├── Sử dụng thời hạn ngắn + refresh tokens
└── Tuyệt đối không lưu dữ liệu nhạy cảm trong JWT
```
