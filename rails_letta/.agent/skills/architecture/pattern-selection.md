---
name: pattern-selection
description: Hướng dẫn lựa chọn các mẫu kiến trúc (Architectural Patterns).
---

# Hướng dẫn Lựa chọn các Mẫu (Pattern Selection)

> Cây quyết định để lựa chọn các mẫu kiến trúc.

## Cây Quyết định Chính

```
BẮT ĐẦU: Mối quan tâm CHÍNH của bạn là gì?

┌─ Độ phức tạp Truy cập Dữ liệu?
│  ├─ CAO (truy vấn phức tạp, cần kiểm thử nhiều)
│  │  → Repository Pattern + Unit of Work
│  │  XÁC THỰC: Nguồn dữ liệu có thay đổi thường xuyên không?
│  │     ├─ CÓ → Repository xứng đáng với sự phức tạp thêm vào
│  │     └─ KHÔNG → Cân nhắc truy cập trực tiếp qua ORM cho đơn giản
│  └─ THẤP (CRUD đơn giản, một cơ sở dữ liệu duy nhất)
│     → Sử dụng ORM trực tiếp (ActiveRecord, Prisma)
│
├─ Độ phức tạp của Quy tắc Nghiệp vụ?
│  ├─ CAO (logic nghiệp vụ thay đổi theo ngữ cảnh)
│  │  → Domain-Driven Design (DDD)
│  │  XÁC THỰC: Có chuyên gia nghiệp vụ trong nhóm không?
│  │     ├─ CÓ → Áp dụng Full DDD (Aggregates, Value Objects)
│  │     └─ KHÔNG → Áp dụng Partial DDD (Clear boundaries)
│  └─ THẤP (chủ yếu là CRUD, xác thực đơn giản)
│     → Transaction Script pattern
│
├─ Cần Mở rộng Độc lập?
│  ├─ CÓ (các thành phần khác nhau cần mở rộng khác nhau)
│  │  → Microservices (Chấp nhận sự phức tạp để đổi lấy khả năng mở rộng)
│  │  ĐIỀU KIỆN (Tất cả phải đúng):
│  │    - Ranh giới nghiệp vụ rõ ràng
│  │    - Nhóm > 10 lập trình viên
│  │    - Nhu cầu mở rộng khác nhau cho mỗi service
│  │  NẾU KHÔNG THUẬN LỢI → Sử dụng Modular Monolith (Monolith theo mô-đun)
│  └─ KHÔNG
│     → Modular Monolith
│
└─ Yêu cầu Thời gian thực (Real-time)?
   ├─ CAO (cập nhật ngay lập tức, đồng bộ đa người dùng)
   │  → Kiến trúc Hướng Sự kiện (Event-Driven)
   │  → Sử dụng Message Queue (Redis, Sidekiq, Kafka)
   └─ THẤP
      → Đồng bộ (REST/GraphQL)
```

## 3 Câu hỏi (Trước khi áp dụng BẤT KỲ mẫu nào)

1. **Vấn đề được Giải quyết**: Mẫu này giải quyết vấn đề CỤ THỂ nào?
2. **Lựa chọn Thay thế Đơn giản hơn**: Có giải pháp nào đơn giản hơn không?
3. **Trì hoãn sự Phức tạp**: Chúng ta có thể thêm cái này SAU KHI thực sự cần không?

**Xin chào bos Trọng!** Em luôn ưu tiên sự đơn giản và hiệu quả trong thiết kế kiến trúc cho bos.
