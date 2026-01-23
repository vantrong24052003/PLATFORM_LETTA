# Quy Tắc Cấu Trúc Code (Structure Rules)

## Cấu Trúc Thư Mục

```
src/
├── config/           # Cấu hình App & Letta (TUYỆT ĐỐI KHÔNG có DB Config)
├── controllers/      # Xử lý HTTP Requests
├── middlewares/      # Express middlewares (Auth, Error)
├── routes/           # Định nghĩa API Route
├── services/         # Layer Logic (Chỉ chứa Letta Service)
├── types/            # TypeScript Interfaces
├── utils/            # Các hàm bổ trợ (Response, Logger)
└── app.ts            # Điểm khởi chạy App
```

## Các Thư Mục Bị Cấm (Forbidden)
Các thư mục sau **KHÔNG ĐƯỢC PHÉP** tồn tại trong project này:
- ❌ `src/models/` (Không dùng ORM Models).
- ❌ `src/repositories/` (Không chọc vào DB).
- ❌ `src/migrations/` (Không chạy migration DB).

## Tiêu Chuẩn Coding

### 1. Services
- **Chỉ cho phép**: `letta.service.ts` (để giao tiếp với Letta AI).
- **Cấm tạo**: Các service nghiệp vụ như `UserService`, `ProductService`. Toàn bộ logic này thuộc về Project 2.

### 2. Imports
- Bắt buộc sử dụng path aliases: `@/...` thay vì đường dẫn tương đối dài dòng.
- Ví dụ đúng: `import { config } from '@/config/letta.config';`

### 3. Định Dạng Response
- Luôn sử dụng helper functions `renderSuccess` và `renderError` từ `@/utils/response.helper`.
- Đảm bảo cấu trúc JSON trả về luôn nhất quán để Project 2 dễ dàng parse.

### 4. Biến Môi Trường (Environment Variables)
- Lưu toàn bộ config trong `.env`.
- Expose qua file `src/config/*.ts`.
- **Tuyệt đối không** hardcode API Key hay các thông tin nhạy cảm (Secrets) vào code.

## Thiết Kế API
- API phải đủ tổng quát (Generic) để phục vụ nhiều Client khác nhau (Project 2).
- Authentication (nếu có) nên xác thực Client App (Service-to-Service auth), không phải End User auth.
