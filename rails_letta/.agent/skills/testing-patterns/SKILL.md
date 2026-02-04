---
name: testing-patterns
description: Các pattern và nguyên tắc kiểm thử. Unit, integration, chiến lược mocking.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Các Pattern Kiểm thử (Testing Patterns)

> Các nguyên tắc để xây dựng bộ test suite đáng tin cậy.

---

## 1. Kim tự tháp Kiểm thử

```
        /\          E2E (Ít)
       /  \         Các luồng quan trọng
      /----\
     /      \       Integration (Vừa phải)
    /--------\      API, Truy vấn DB
   /          \
  /------------\    Unit (Nhiều)
                    Functions, classes
```

---

## 2. Mô hình AAA

| Bước | Mục đích |
|------|---------|
| **Arrange** | Thiết lập dữ liệu kiểm thử (Setup) |
| **Act** | Thực thi phần code cần kiểm thử |
| **Assert** | Xác minh kết quả (Verify) |

---

## 3. Lựa chọn Loại Test

| Loại | Tốt nhất cho | Tốc độ |
|------|--------------|--------|
| **Unit** | Hàm thuần túy, logic nghiệp vụ | Rất nhanh (<50ms) |
| **Integration** | API, DB, services | Trung bình |
| **E2E** | Luồng người dùng quan trọng | Chậm |

---

## 4. Nguyên tắc Unit Test

- **Nhanh**: < 100ms mỗi test.
- **Cô lập**: Không phụ thuộc vào các module bên ngoài.
- **Có thể lặp lại**: Luôn cho cùng một kết quả.
- **Tự kiểm tra**: Không cần xác minh thủ công.

---

## 5. Nguyên tắc Mocking

| Nên Mock | KHÔNG nên Mock |
|----------|---------------|
| Các API bên ngoài | Mã nguồn đang được kiểm thử |
| Cơ sở dữ liệu (trong unit test) | Các phụ thuộc đơn giản |
| Thời gian/Giá trị ngẫu nhiên | Các hàm thuần túy (pure functions) |

---

## 6. Tổ chức Kiểm thử

### Đặt tên theo hành vi
- "Nên trả về lỗi khi..." (Should return error when...)
- "Khi không tìm thấy người dùng..." (When user not found...)

### Nhóm lại (Grouping)
- **describe**: Nhóm các test liên quan.
- **it / test**: Một trường hợp kiểm thử cụ thể.
- **beforeEach**: Thiết lập chung cho các test trong nhóm.

---

## 7. Dữ liệu Kiểm thử

- **Factories**: Sử dụng FactoryBot (Rails) để tạo dữ liệu linh hoạt.
- **Fixtures**: Bộ dữ liệu cố định (dùng khi cần dữ liệu tĩnh lớn).
- **Nguyên tắc**: Sử dụng dữ liệu thực tế, giữ dữ liệu ở mức tối thiểu cần thiết.

---

## 8. Thực hành tốt nhất

✅ Một Assert cho mỗi test để dễ xác định nguyên nhân lỗi.
✅ Các test phải độc lập (không phụ thuộc vào thứ tự chạy).
✅ Tên test phải mang tính tài liệu hóa code.
✅ Luôn reset trạng thái (Cleanup) sau mỗi test.

❌ Đừng kiểm thử cách triển khai (implementation), hãy kiểm thử hành vi (behavior).
❌ Đừng bỏ qua các test bị chập chờn (flaky tests).

---

> **Ghi nhớ:** Test chính là tài liệu. Nếu ai đó không thể hiểu code làm gì thông qua việc đọc test, hãy viết lại chúng.
