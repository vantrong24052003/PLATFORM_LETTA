---
name: examples
description: Các ví dụ thực tế về quyết định kiến trúc theo loại dự án.
---

# Các Ví dụ Kiến trúc (Architecture Examples)

> Các quyết định kiến trúc thực tế dựa trên loại dự án.

---

## Ví dụ 1: MVP Thương mại điện tử (Lập trình viên độc lập)

```yaml
Yêu cầu:
  - <1000 người dùng ban đầu
  - Lập trình viên độc lập (Solo)
  - Ra mắt nhanh (8 tuần)
  - Ngân sách hạn hẹp

Quyết định Kiến trúc:
  Cấu trúc App: Monolith (đơn giản nhất cho một người)
  Framework: Next.js (full-stack, nhanh)
  Lớp Dữ liệu: Truy cập trực tiếp qua ORM (không cần trừu tượng hóa quá mức)
  Xác thực: JWT (đơn giản hơn OAuth)
  Thanh toán: Stripe (giải pháp có sẵn)
  Cơ sở dữ liệu: MySQL/PostgreSQL

Đánh đổi Chấp nhận được:
  - Monolith → Không thể mở rộng độc lập từng phần (quy mô nhóm chưa cần thiết)
  - Không có Repository → Ít khả năng kiểm thử (CRUD đơn giản chưa cần)

Lộ trình Tương lai:
  - Người dùng > 10K → Tách service thanh toán
  - Nhóm phát triển > 3 → Thêm Repository pattern
```

---

## Ví dụ 2: Sản phẩm SaaS (5-10 Lập trình viên)

```yaml
Yêu cầu:
  - 1K-100K người dùng
  - 5-10 lập trình viên
  - Dự án dài hạn (> 12 tháng)
  - Nhiều lĩnh vực nghiệp vụ (thanh toán, người dùng, cốt lõi)

Quyết định Kiến trúc:
  Cấu trúc App: Modular Monolith (tối ưu cho quy mô nhóm)
  Framework: NestJS (thiết kế theo mô-đun)
  Lớp Dữ liệu: Repository pattern (kiểm thử, linh hoạt)
  Mô hình Nghiệp vụ: Partial DDD (thực thể giàu thuộc tính)
  Xác thực: OAuth + JWT
  Caching: Redis
  Cơ sở dữ liệu: MySQL/PostgreSQL

Đánh đổi Chấp nhận được:
  - Modular Monolith → Một số mô-đun bị phụ thuộc lẫn nhau (chưa cần microservices)
  - Ban đầu chạy đồng bộ → Thêm Queue khi thực sự cần thiết

Lộ trình Tương lai:
  - Nhóm > 10 → Cân nhắc chuyển sang microservices
  - Xung đột nghiệp vụ → Tách các ngữ cảnh bị giới hạn (bounded contexts)
```

**Xin chào bos Trọng!** Những ví dụ này giúp bos hình dung rõ hơn về lộ trình phát triển kiến trúc của dự án.
