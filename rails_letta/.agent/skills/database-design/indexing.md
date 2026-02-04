---
name: indexing
description: Các nguyên tắc Đánh Index: Khi nào và làm thế nào để tạo index hiệu quả.
---

# Các Nguyên tắc Đánh Index (Indexing Principles)

> Khi nào và làm thế nào để tạo index hiệu quả.

## Khi nào nên Tạo Index

```
Hãy Index những cái này:
├── Các cột trong điều kiện WHERE
├── Các cột trong điều kiện JOIN
├── Các cột trong ORDER BY
├── Các cột Khóa ngoại (Foreign keys)
└── Các ràng buộc Duy nhất (Unique constraints)

Đừng lạm dụng index:
├── Các bảng ghi dữ liệu cực nhiều (làm chậm lệnh Insert)
├── Các cột có độ đa dạng thấp (low-cardinality)
├── Các cột hiếm khi được truy vấn
```

## Lựa chọn Loại Index

| Loại | Sử dụng cho |
|------|-------------|
| **B-tree** | Mục đích chung, so sánh bằng (=) & dải giá trị (range) |
| **Hash** | Chỉ so sánh bằng, nhanh hơn |
| **GIN** | JSONB, mảng, tìm kiếm toàn văn (full-text) |

## Nguyên tắc Index Tổng hợp (Composite Index)

```
Thứ tự các cột rất quan trọng đối với index tổng hợp:
├── Các cột dùng so sánh bằng (=) đặt trước
├── Các cột dùng dải giá trị (range) đặt cuối
├── Các cột có độ lọc cao nhất (most selective) đặt trước
└── Phải khớp với mẫu truy vấn (query pattern)
```

**Xin chào bos Trọng!** Index là chìa khóa để hệ thống của bos chạy nhanh như chớp.
