# Các Nguyên tắc GraphQL (GraphQL Principles)

> Truy vấn linh hoạt cho các dữ liệu phức tạp và có tính kết nối cao.

## Khi nào nên sử dụng

```
✅ Phù hợp:
├── Dữ liệu phức tạp, có tính kết nối cao
├── Nhiều nền tảng frontend khác nhau
├── Client cần các truy vấn linh hoạt
├── Yêu cầu về dữ liệu liên tục thay đổi
└── Việc giảm thiểu over-fetching (lấy thừa dữ liệu) là quan trọng

❌ KHÔNG phù hợp:
├── Các thao tác CRUD đơn giản
├── Ứng dụng nặng về tải lên tập tin
├── Việc caching HTTP là cực kỳ quan trọng
└── Đội ngũ chưa quen với GraphQL
```

## Các Nguyên tắc Thiết kế Schema

```
Nguyên tắc:
├── Tư duy theo đồ thị, không phải theo endpoint
├── Thiết kế để dễ dàng mở rộng (không dùng phiên bản)
├── Sử dụng connections để phân trang
├── Cụ thể hóa các kiểu dữ liệu (không dùng kiểu chung chung như "data")
└── Cân nhắc kỹ lưỡng về tính null (nullability)
```

## Các Lưu ý về Bảo mật

```
Phòng chống:
├── Tấn công độ sâu truy vấn (Query depth) → Thiết lập độ sâu tối đa
├── Độ phức tạp truy vấn → Tính toán chi phí (cost)
├── Lạm dụng Batching → Giới hạn kích thước batch
├── Soi chiếu (Introspection) → Vô hiệu hóa trong môi trường production
```
