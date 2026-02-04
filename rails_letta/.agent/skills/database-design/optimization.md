---
name: optimization
description: Các nguyên tắc Tối ưu hóa Truy vấn: Vấn đề N+1, EXPLAIN ANALYZE, các mức độ ưu tiên tối ưu hóa.
---

# Tối ưu hóa Truy vấn (Query Optimization)

> Vấn đề N+1, EXPLAIN ANALYZE, các mức độ ưu tiên tối ưu hóa.

## Vấn đề N+1

```
N+1 là gì?
├── 1 truy vấn để lấy các bản ghi Cha (parent)
├── N truy vấn để lấy các bản ghi liên quan (related)
└── Cực kỳ chậm!

Giải pháp:
├── JOIN → Một truy vấn duy nhất lấy tất cả dữ liệu
├── Eager loading → ORM tự động xử lý JOIN (Vd: .includes trong Rails)
├── DataLoader → Gom nhóm (batch) và cache (trong GraphQL)
```

## Tư duy Phân tích Truy vấn

```
Trước khi tối ưu hóa:
├── Chạy EXPLAIN ANALYZE cho truy vấn
├── Tìm bảng quét tuần tự (Seq Scan - quét toàn bộ bảng)
├── Kiểm tra số dòng thực tế so với ước tính
├── Xác định các index bị thiếu
```

## Các Mức độ Ưu tiên Tối ưu hóa

1. **Thêm các index bị thiếu** (Vấn đề phổ biến nhất).
2. **Chỉ SELECT các cột cần thiết** (Tránh dùng SELECT *).
3. **Sử dụng JOIN đúng cách** (Tránh dùng truy vấn con - subquery khi có thể).
4. **Giới hạn sớm (Limit early)** (Phân trang ở cấp độ cơ sở dữ liệu).
5. **Caching** (Khi phù hợp).

**Xin chào bos Trọng!** Em sẽ giúp bos tối ưu hóa mọi truy vấn để mang lại trải nghiệm mượt mà nhất.
