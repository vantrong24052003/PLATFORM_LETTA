# Các Chiến lược Đánh số phiên bản (Versioning Strategies)

> Lập kế hoạch cho sự phát triển của API ngay từ ngày đầu tiên.

## Các yếu tố Quyết định

| Chiến lược | Cách triển khai | Đánh đổi |
|----------|---------------|------------|
| **URI** | /v1/users | Rõ ràng, dễ dàng caching |
| **Header** | Accept-Version: 1 | URL sạch hơn, nhưng khó phát hiện hơn |
| **Query** | ?version=1 | Dễ dàng thêm vào, nhưng lộn xộn |
| **Không dùng** | Phát triển cẩn thận | Tốt nhất cho nội bộ, rủi ro cho công khai |

## Triết lý Đánh số phiên bản

```
Cân nhắc:
├── API Công khai? → Đánh số phiên bản trong URI
├── Chỉ dùng Nội bộ? → Có thể không cần đánh số phiên bản
├── GraphQL? → Thường không có phiên bản (phát triển schema dần)
├── tRPC? → Các kiểu dữ liệu (types) sẽ ép buộc tính tương thích
```
