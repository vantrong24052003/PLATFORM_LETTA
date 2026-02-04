# Xây dựng Tính năng (Feature Building)

> Cách phân tích và triển khai các tính năng mới.

## Phân tích Tính năng

```
Yêu cầu: "thêm hệ thống thanh toán"

Phân tích:
├── Các thay đổi cần thiết:
│   ├── Database: các bảng orders, payments
│   ├── Backend: các endpoint /api/checkout, /api/webhooks/stripe
│   ├── Frontend: các component CheckoutForm, PaymentSuccess
│   └── Cấu hình: Các API keys của Stripe
│
├── Các phụ thuộc:
│   ├── package stripe
│   └── Hệ thống xác thực người dùng hiện có
│
└── Thời gian dự kiến: 15-20 phút
```

## Quy trình Cải tiến Lặp (Iterative Enhancement Process)

```
1. Phân tích dự án hiện có
2. Tạo kế hoạch thay đổi
3. Trình bày kế hoạch cho người dùng
4. Nhận phê duyệt
5. Áp dụng các thay đổi
6. Kiểm thử (Test)
7. Hiển thị bản xem trước (Preview)
```

## Xử lý Lỗi

| Loại lỗi | Chiến lược giải quyết |
|------------|-------------------|
| Lỗi TypeScript | Sửa type, thêm import còn thiếu |
| Thiếu phụ thuộc (Dependency) | Chạy lệnh npm install |
| Xung đột Port | Đề xuất port thay thế |
| Lỗi Database | Kiểm tra migration, xác thực kết nối |

## Chiến lược Phục hồi (Recovery Strategy)

```
1. Phát hiện lỗi
2. Thử sửa lỗi tự động
3. Nếu thất bại, báo cáo cho người dùng
4. Đề xuất giải pháp thay thế
5. Rollback (hoàn tác) nếu cần thiết
```
