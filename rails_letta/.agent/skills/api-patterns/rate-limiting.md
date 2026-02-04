# Các Nguyên tắc Giới hạn Tốc độ (Rate Limiting Principles)

> Bảo vệ API của bạn khỏi việc lạm dụng và quá tải.

## Tại sao cần Giới hạn Tốc độ

```
Phòng chống:
├── Các cuộc tấn công brute force
├── Sự cạn kiệt tài nguyên
├── Chi phí vượt mức (nếu trả phí theo mức sử dụng)
└── Việc sử dụng không công bằng
```

## Lựa chọn Chiến lược

| Loại | Cách thức | Khi nào dùng |
|------|-----|------|
| **Token bucket** | Cho phép đột biến (burst), nạp lại theo thời gian | Hầu hết các API |
| **Sliding window** | Phân phối mượt mà | Các giới hạn nghiêm ngặt |
| **Fixed window** | Bộ đếm đơn giản cho mỗi khung thời gian | Các nhu cầu cơ bản |

## Các Header Phản hồi

```
Nên bao gồm trong headers:
├── X-RateLimit-Limit (số lượng yêu cầu tối đa)
├── X-RateLimit-Remaining (số lượng yêu cầu còn lại)
├── X-RateLimit-Reset (thời điểm giới hạn được đặt lại)
└── Trả về mã 429 khi vượt quá giới hạn
```
