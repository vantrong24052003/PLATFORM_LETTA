---
name: database-design
description: Các nguyên tắc thiết kế cơ sở dữ liệu và quy trình ra quyết định. Thiết kế schema, chiến lược đánh index, lựa chọn ORM.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Thiết kế Cơ sở dữ liệu

> **Học cách TƯ DUY, không chỉ sao chép các mẫu SQL.**

---

## 🎯 Quy tắc Đọc có Chọn lọc

**Chỉ đọc các phần liên quan đến yêu cầu!** Tìm những gì bạn cần trong bản đồ nội dung dưới đây.

| Phần | Mô tả | Khi nào cần đọc |
|------|-------|-----------------|
| `schema-design.md` | Chuẩn hóa, Khóa chính, Quan hệ | Khi thiết kế schema |
| `indexing.md` | Các loại index, index tổng hợp | Khi tối ưu hiệu năng |
| `optimization.md` | N+1, EXPLAIN | Khi tối ưu truy vấn |
| `migrations.md` | Migration an toàn (Ridgepole) | Khi thay đổi schema |

---

## ⚠️ Nguyên tắc cốt lõi

- LUÔN HỎI bos Trọng về sở thích DB nếu chưa rõ.
- **Dự án hiện tại**: Sử dụng **MySQL** và **Ridgepole**.
- Chọn Database/ORM dựa trên BỐI CẢNH thực tế.

---

## Checklist Quyết định

Trước khi thiết kế schema:
- [ ] Đã hỏi bos Trọng về yêu cầu DB chưa?
- [ ] Đã xác định môi trường triển khai (Production/Docker)?
- [ ] Đã lập kế hoạch chiến lược đánh index?
- [ ] Đã xác định rõ các quan hệ giữa các bảng?

---

## Các Anti-Patterns (Cần tránh)

❌ Mặc định dùng PostgreSQL cho mọi thứ (Dự án này dùng MySQL).
❌ Bỏ qua việc đánh index.
❌ Sử dụng `SELECT *` trong production.
❌ Lưu trữ JSON khi dữ liệu có cấu trúc rõ ràng sẽ tốt hơn.
❌ Phớt lờ các truy vấn N+1.

**Xin chào bos Trọng!** Hãy luôn tuân thủ các chuẩn mực này để dữ liệu luôn an toàn và nhanh chóng.
