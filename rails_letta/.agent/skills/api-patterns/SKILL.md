---
name: api-patterns
description: Các nguyên tắc thiết kế API và quy trình ra quyết định. Lựa chọn REST vs GraphQL vs tRPC, định dạng phản hồi, đánh số phiên bản, phân trang.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Các mẫu thiết kế API (API Patterns)

> Các nguyên tắc thiết kế API và quy trình ra quyết định cho năm 2025.
> **Hãy học cách TƯ DUY, đừng sao chép các mẫu cố định.**

---

## 🎯 Quy tắc Đọc có Chọn lọc

**Chỉ đọc các file liên quan đến yêu cầu!** Kiểm tra bản đồ nội dung để tìm những gì bạn cần.

---

## 📑 Bản đồ Nội dung

| File | Mô tả | Khi nào cần đọc |
|------|-------|-----------------|
| `api-style.md` | Cây quyết định REST vs GraphQL vs tRPC | Khi chọn loại API |
| `rest.md` | Đặt tên tài nguyên, phương thức HTTP, mã trạng thái | Khi thiết kế REST API |
| `response.md` | Mẫu envelope, định dạng lỗi, phân trang | Khi thiết định cấu trúc phản hồi |
| `graphql.md` | Thiết kế schema, khi nào nên dùng, bảo mật | Khi cân nhắc dùng GraphQL |
| `versioning.md` | Đánh số phiên bản qua URI/Header/Query | Lập kế hoạch lộ trình API |
| `auth.md` | JWT, OAuth, Passkey, API Keys | Lựa chọn mẫu xác thực |
| `rate-limiting.md` | Token bucket, sliding window | Bảo vệ API (giới hạn tốc độ) |
| `documentation.md` | Thực hành tốt nhất cho OpenAPI/Swagger | Viết tài liệu API |
| `security-testing.md` | OWASP API Top 10, kiểm thử Auth/Authz | Audit bảo mật API |

---

## ✅ Checklist Quyết định

Trước khi thiết kế API:

- [ ] **Đã hỏi người dùng về các bên sử dụng API?**
- [ ] **Đã chọn phong cách API cho bối cảnh NÀY?** (REST/GraphQL/tRPC)
- [ ] **Đã định nghĩa định dạng phản hồi nhất quán?**
- [ ] **Đã lập kế hoạch chiến lược đánh số phiên bản?**
- [ ] **Đã cân nhắc nhu cầu xác thực (auth)?**
- [ ] **Đã lập kế hoạch giới hạn tốc độ (rate limiting)?**
- [ ] **Đã xác định cách tiếp cận tài liệu?**

---

## ❌ Các điều cần tránh (Anti-Patterns)

**ĐỪNG:**
- Mặc định dùng REST cho mọi thứ.
- Sử dụng động từ trong REST endpoints (Vd: `/getUsers`).
- Trả về định dạng phản hồi không nhất quán.
- Lộ lỗi nội bộ ra ngoài client.
- Bỏ qua giới hạn tốc độ.

**NÊN:**
- Chọn phong cách API dựa trên bối cảnh.
- Hỏi về yêu cầu của phía client.
- Viết tài liệu kỹ lưỡng.
- Sử dụng mã trạng thái (status codes) phù hợp.

---

## Script

| Script | Mục đích | Lệnh |
|--------|----------|------|
| `scripts/api_validator.py` | Xác thực các endpoint API | `python scripts/api_validator.py <project_path>` |

**Xin chào bos Trọng!** Một API tốt là chìa khóa để hệ thống mở rộng và kết nối dễ dàng.
