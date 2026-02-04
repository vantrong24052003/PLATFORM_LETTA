# Lựa chọn Phong cách API (2025)

> REST vs GraphQL vs tRPC - Sử dụng cái nào trong trường hợp nào?

## Cây Quyết định

```
Ai là người sử dụng API?
│
├── API Công khai / Đa nền tảng
│   └── REST + OpenAPI (tương thích rộng nhất)
│
├── Nhu cầu dữ liệu phức tạp / Nhiều frontend
│   └── GraphQL (truy vấn linh hoạt)
│
├── Cả Frontend và Backend đều dùng TypeScript (monorepo)
│   └── tRPC (đảm bảo an toàn kiểu dữ liệu từ đầu đến cuối)
│
├── Thời gian thực (Real-time) / Hướng sự kiện (Event-driven)
│   └── WebSocket + AsyncAPI
│
└── Microservices nội bộ
    └── gRPC (hiệu năng) hoặc REST (đơn giản)
```

## So sánh

| Tiêu chí | REST | GraphQL | tRPC |
|--------|------|---------|------|
| **Tốt nhất cho** | API công khai | Ứng dụng phức tạp | TS monorepos |
| **Độ khó (Learning curve)** | Thấp | Trung bình | Thấp (nếu biết TS) |
| **Over/under fetching** | Thường gặp | Đã giải quyết | Đã giải quyết |
| **An toàn kiểu dữ liệu** | Thủ công (OpenAPI) | Dựa trên Schema | Tự động |
| **Caching** | Đặc thù HTTP | Phức tạp | Dựa trên Client |

## Câu hỏi Lựa chọn

1. Ai là người sử dụng API?
2. Frontend có sử dụng TypeScript không?
3. Các mối quan hệ dữ liệu phức tạp đến mức nào?
4. Việc caching có cực kỳ quan trọng không?
5. API là công khai hay nội bộ?
