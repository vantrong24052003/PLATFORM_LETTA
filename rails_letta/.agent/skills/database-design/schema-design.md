---
name: schema-design
description: Các nguyên tắc thiết kế Schema: Chuẩn hóa, Khóa chính, Quan hệ.
---

# Các Nguyên tắc Thiết kế Schema (Schema Design Principles)

> Chuẩn hóa, Khóa chính, Timestamps, Các mối quan hệ.

## Quyết định Chuẩn hóa

```
Khi nào nên Chuẩn hóa (tách bảng):
├── Dữ liệu bị lặp lại ở nhiều dòng
├── Cần cập nhật nhiều nơi khi có thay đổi
├── Các mối quan hệ đã rõ ràng
└── Có lợi cho các mẫu truy vấn

Khi nào nên Phi chuẩn hóa (nhúng/nhân bản):
├── Hiệu suất đọc là cực kỳ quan trọng
├── Dữ liệu hiếm khi thay đổi
├── Luôn được lấy dữ liệu cùng nhau (Fetch together)
└── Cần các truy vấn đơn giản hơn
```

## Lựa chọn Khóa chính (Primary Key)

| Loại | Khi nào sử dụng |
|------|----------------|
| **UUID** | Hệ thống phân tán, bảo mật |
| **ULID** | UUID + có thể sắp xếp theo thời gian |
| **Auto-increment** | Ứng dụng đơn giản, cơ sở dữ liệu duy nhất |

## Chiến lược Timestamp

```
Cho mọi bảng:
├── created_at → Khi được tạo
├── updated_at → Lần sửa cuối
└── deleted_at → Xóa mềm (nếu cần)

Sử dụng TIMESTAMPTZ (có múi giờ), không phải TIMESTAMP
```

## Các loại Quan hệ

| Loại | Khi nào | Triển khai |
|------|---------|------------|
| **Một - Một (1-1)** | Dữ liệu mở rộng | Bảng riêng với khóa ngoại (FK) |
| **Một - Nhiều (1-n)** | Cha - Con | FK nằm trên bảng Con |
| **Nhiều - Nhiều (n-n)** | Cả hai bên đều có nhiều | Bảng trung gian (Junction table) |

**Xin chào bos Trọng!** Một thiết kế schema tốt là nền tảng cho một hệ thống vững chắc.
