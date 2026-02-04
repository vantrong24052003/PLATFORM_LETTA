---
description: Lệnh triển khai (deploy) cho các phiên bản production. Kiểm tra trước khi bay và thực thi triển khai.
---

# /deploy - Triển khai Production

$ARGUMENTS

---

## Mục đích

Lệnh này xử lý việc triển khai lên môi trường sản xuất (production) với các bước kiểm tra trước khi triển khai, thực thi triển khai và xác minh.

---

## Các lệnh con

```
/deploy            - Trình hướng dẫn triển khai tương tác
/deploy check      - Chỉ chạy các bước kiểm tra trước triển khai
/deploy preview    - Triển khai lên môi trường preview/staging
/deploy production - Triển khai lên môi trường production
/deploy rollback   - Quay lại phiên bản trước đó
```

---

## Checklist trước khi triển khai

Trước bất kỳ lần triển khai nào:

```markdown
## 🚀 Checklist Trước Khi Triển Khai

### Chất lượng Code
- [ ] Kiểm tra kiểu dữ liệu (PropTypes)
- [ ] ESLint đã thông qua (`npx eslint .`)
- [ ] Tất cả các bài kiểm tra đã thông qua (`npm test`)

### Bảo mật
- [ ] Không có secret nào bị ghi cứng (hardcoded)
- [ ] Các biến môi trường đã được tài liệu hóa
- [ ] Các phụ thuộc đã được kiểm tra (`npm audit`)

### Hiệu năng
- [ ] Kích thước bundle ở mức chấp nhận được
- [ ] Không còn các câu lệnh console.log
- [ ] Hình ảnh đã được tối ưu hóa

### Tài liệu
- [ ] README đã được cập nhật
- [ ] CHANGELOG đã được cập nhật
- [ ] Tài liệu API đã được cập nhật bản mới nhất

### Sẵn sàng triển khai? (y/n)
```

---

## Luồng triển khai

```
┌─────────────────┐
│  /deploy        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Kiểm tra       │
│  trước triển khai│
└────────┬────────┘
         │
    Pass? ──Không──► Sửa lỗi
         │
        Có
         │
         ▼
┌─────────────────┐
│  Build          │
│  ứng dụng       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Triển khai lên │
│  nền tảng       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Kiểm tra sức   │
│  khỏe & xác minh │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ✅ Hoàn tất     │
└─────────────────┘
```

---

## Định dạng đầu ra

### Triển khai thành công

```markdown
## 🚀 Triển khai hoàn tất

### Tóm tắt
- **Phiên bản:** v1.2.3
- **Môi trường:** production
- **Thời gian:** 47 giây
- **Nền tảng:** Vercel

### URLs
- 🌐 Production: https://app.example.com
- 📊 Dashboard: https://vercel.com/project

### Các thay đổi
- Thêm tính năng profile người dùng
- Sửa lỗi đăng nhập
- Cập nhật các thư viện phụ thuộc

### Kiểm tra sức khỏe
✅ API đang phản hồi (200 OK)
✅ Cơ sở dữ liệu đã kết nối
✅ Tất cả các dịch vụ đều ổn định
```

### Triển khai thất bại

```markdown
## ❌ Triển khai thất bại

### Lỗi
Build thất bại tại bước: Minify JavaScript

### Chi tiết
```
Error: Unexpected token...
```

### Cách khắc phục
1. Sửa lỗi SyntaxError trong file `src/services/user.js:45`
2. Chạy `npm run build` tại máy cục bộ để xác minh
3. Thử lại lệnh `/deploy`

### Có thể khôi phục (Rollback)
Phiên bản trước (v1.2.2) vẫn đang hoạt động.
Chạy `/deploy rollback` nếu cần thiết.
```

---

## Hỗ trợ nền tảng

| Nền tảng | Lệnh | Ghi chú |
|----------|---------|-------|
| Vercel | `vercel --prod` | Tự động phát hiện cho Next.js |
| Railway | `railway up` | Cần Railway CLI |
| Fly.io | `fly deploy` | Cần flyctl |
| Docker | `docker compose up -d` | Cho tự vận hành (self-hosted) |

---

## Ví dụ

```
/deploy
/deploy check
/deploy preview
/deploy production --skip-tests
/deploy rollback
```
