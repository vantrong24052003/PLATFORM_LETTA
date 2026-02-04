---
name: migrations
description: Các nguyên tắc Migration: Chiến lược thay đổi schema an toàn, không gián đoạn (zero-downtime).
---

# Các Nguyên tắc Migration (Migration Principles)

> Chiến lược migration an toàn cho các thay đổi không gây gián đoạn dịch vụ (zero-downtime).

## Chiến lược Thay đổi Schema An toàn (Sử dụng Ridgepole)

Dự án này sử dụng **Ridgepole** để quản lý DB schema một cách khai báo (declarative) thông qua file `db/schemas/Schemafile`.

```
Để thay đổi không gây gián đoạn (zero-downtime):
│
├── Thêm cột mới
│   └── Thêm cột cho phép null → cập nhật dữ liệu (backfill) → thêm ràng buộc NOT NULL
│
├── Xóa cột
│   └── Ngừng sử dụng code liên quan → triển khai (deploy) → xóa cột khỏi Schemafile
│
├── Thêm index
│   └── Luôn cân nhắc tác động đến hiệu năng khi áp dụng index mới trên bảng lớn
│
└── Đổi tên cột
    └── Thêm cột mới → di chuyển dữ liệu → triển khai code mới → xóa cột cũ
```

## Triết lý Migration

- Không bao giờ thực hiện các thay đổi gây gãy (breaking changes) trong một bước duy nhất.
- Luôn có kế hoạch hoàn tác (rollback).
- Chạy trong Transaction khi có thể để đảm bảo tính toàn vẹn.

**Xin chào bos Trọng!** Hãy luôn cẩn trọng khi thay đổi cấu trúc dữ liệu để hệ thống của bos luôn hoạt động ổn định nhất.
