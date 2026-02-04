---
name: patterns-reference
description: Tham chiếu nhanh các mẫu kiến trúc và hướng dẫn sử dụng.
---

# Tham chiếu các Mẫu Kiến trúc (Patterns Reference)

> Tra cứu nhanh các mẫu phổ biến kèm hướng dẫn sử dụng.

## Các mẫu Truy cập Dữ liệu

| Mẫu | Khi nào nên dùng | Khi nào KHÔNG nên dùng | Độ phức tạp |
|-----|------------------|------------------------|-------------|
| **Active Record** | CRUD đơn giản, làm nhanh (prototype) | Truy vấn phức tạp, nhiều nguồn dữ liệu | Thấp |
| **Repository** | Cần kiểm thử, nhiều nguồn dữ liệu | CRUD đơn giản, một DB duy nhất | Trung bình |
| **Unit of Work** | Các giao dịch (transactions) phức tạp | Các thao tác đơn giản | Cao |

## Các mẫu Logic Nghiệp vụ

| Mẫu | Khi nào nên dùng | Khi nào KHÔNG nên dùng | Độ phức tạp |
|-----|------------------|------------------------|-------------|
| **Transaction Script** | Cơ bản, theo quy trình | Quy tắc nghiệp vụ phức tạp | Thấp |
| **Domain Model** | Logic nghiệp vụ phức tạp | CRUD đơn giản | Trung bình |
| **DDD (Full)** | Lĩnh vực cực kỳ phức tạp | Lĩnh vực đơn giản | Cao |

## Các mẫu Hệ thống Phân tán

| Mẫu | Khi nào nên dùng | Khi nào KHÔNG nên dùng | Độ phức tạp |
|-----|------------------|------------------------|-------------|
| **Modular Monolith** | Nhóm nhỏ, ranh giới chưa rõ | Ranh giới đã rõ, cần quy mô khác nhau | Trung bình |
| **Microservices** | Quy mô lớn, nhóm lớn | Nhóm nhỏ, lĩnh vực đơn giản | Rất Cao |
| **Event-Driven** | Thời gian thực, ghép nối lỏng | Quy trình đơn giản, cần nhất quán mạnh | Cao |
| **CQRS** | Hiệu suất Đọc/Ghi khác nhau | CRUD đơn giản, cùng một model | Cao |

---

## Nguyên tắc Đơn giản hóa

**"Bắt đầu đơn giản, chỉ thêm sự phức tạp khi thực sự cần thiết."**

- Bạn luôn có thể thêm các mẫu vào sau này.
- Loại bỏ sự phức tạp KHÓ hơn nhiều so với việc thêm nó vào.
- Khi nghi ngờ, hãy chọn phương án đơn giản nhất.

**Xin chào bos Trọng!** Hãy cùng chọn những mẫu thiết kế phù hợp nhất để dự án của bos luôn tinh gọn và hiệu quả.
