---
description: Lệnh tạo và chạy kiểm thử (test). Tạo và thực thi các bài kiểm thử cho mã nguồn.
---

# /test - Tạo và Thực thi Kiểm thử

$ARGUMENTS

---

## Mục đích

Lệnh này dùng để tạo test mới, chạy các test hiện có hoặc kiểm tra độ bao phủ (coverage) của test.

---

## Các lệnh con

```
/test                - Chạy tất cả các test
/test [file/feature] - Tạo test cho một file hoặc tính năng cụ thể
/test coverage       - Hiển thị báo cáo độ bao phủ của test
/test watch          - Chạy test ở chế độ theo dõi thay đổi (watch mode)
```

---

## Hành vi

### Tạo Kiểm thử (Generate Tests)

Khi được yêu cầu test một file hoặc tính năng:

1. **Phân tích code**
   - Xác định các function và method.
   - Tìm các trường hợp biên (edge cases).
   - Phát hiện các phụ thuộc cần mock.

2. **Tạo các kịch bản test (test cases)**
   - Kịch bản thành công (Happy path).
   - Các trường hợp lỗi (Error cases).
   - Các trường hợp biên (Edge cases).
   - Test tích hợp (Integration tests) nếu cần.

3. **Viết test**
   - Sử dụng framework của dự án (RSpec cho Backend, Jest/Vitest cho Frontend).
   - Tuân thủ các pattern test hiện có.
   - Mock các phụ thuộc bên ngoài.

---

## Định dạng Đầu ra

### Khi tạo Test

```markdown
## 🧪 Kiểm thử cho: [Đối tượng]

### Kế hoạch Kiểm thử
| Trường hợp test | Loại | Phạm vi |
|-----------------|------|---------|
| Nên tạo user mới | Unit | Thành công |
| Nên từ chối email không hợp lệ | Unit | Validate |
| Nên xử lý lỗi DB | Unit | Trường hợp lỗi |

### Code đã tạo

`spec/models/[file]_spec.rb` hoặc `src/__tests__/[file].test.ts`

[Khối code chứa các đoạn test]

---

Chạy lệnh: `docker exec -it senri-web-1 bundle exec rspec <path>` (Backend) hoặc `yarn test` (Frontend)
```

---

## Các nguyên tắc chính

- **Kiểm thử hành vi, không kiểm thử cách triển khai** (Test behavior, not implementation).
- **Mô hình AAA**: Arrange (Sắp xếp), Act (Thực thi), Assert (Xác minh).
- **Tên test mang tính mô tả cao**.
- **Mock các API bên ngoài** (Sử dụng VCR/WebMock cho Rails).

**Xin chào bos Trọng!** Code không có test là code không an toàn. Hãy để tôi giúp bos gia cố hệ thống!
