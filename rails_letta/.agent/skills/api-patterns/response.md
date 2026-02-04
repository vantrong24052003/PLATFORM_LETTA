# Các nguyên tắc về Định dạng Phản hồi (Response Format Principles)

> Tính nhất quán là cốt lõi - hãy chọn một định dạng và tuân thủ nó.

## Các Mẫu Phổ biến

```
Chọn một mẫu:
├── Mẫu Envelope ({ success, data, error })
├── Dữ liệu trực tiếp (chỉ trả về tài nguyên)
└── HAL/JSON:API (đa phương tiện - hypermedia)
```

## Phản hồi Lỗi (Error Response)

```
Nên bao gồm:
├── Mã lỗi (Error code) (để xử lý bằng code)
├── Thông báo cho người dùng (để hiển thị)
├── Chi tiết (để gỡ lỗi, chi tiết lỗi của từng trường)
├── Mã yêu cầu (Request ID) (để hỗ trợ)
└── TUYỆT ĐỐI KHÔNG đưa chi tiết nội bộ (bảo mật!)
```

## Các loại Phân trang

| Loại | Tốt nhất cho | Đánh đổi |
|------|----------|------------|
| **Offset** | Đơn giản, có thể nhảy trang | Hiệu năng kém trên tập dữ liệu lớn |
| **Cursor** | Tập dữ liệu lớn | Không thể nhảy trang bất kỳ |
| **Keyset** | Hiệu năng cực kỳ quan trọng | Yêu cầu khóa có thể sắp xếp |

### Câu hỏi Lựa chọn

1. Tập dữ liệu lớn đến mức nào?
2. Người dùng có cần nhảy đến các trang cụ thể không?
3. Dữ liệu có thay đổi thường xuyên không?
