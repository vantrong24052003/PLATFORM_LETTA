---
name: tdd-workflow
description: Các nguyên tắc của quy trình Phát triển Hướng Kiểm thử (TDD). Chu kỳ ĐỎ-XANH-REFACTOR (RED-GREEN-REFACTOR).
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Quy trình TDD (Test-Driven Development)

> Viết test trước, code sau.

---

## 1. Chu kỳ TDD

```
🔴 ĐỎ (RED) → Viết một bản test thất bại
    ↓
🟢 XANH (GREEN) → Viết lượng code tối thiểu để test pass
    ↓
🔵 REFACTOR → Cải thiện chất lượng code
    ↓
   Lặp lại...
```

---

## 2. Ba Định luật của TDD

1. Chỉ viết code production để làm cho một bản test đang thất bại trở nên thành công.
2. Chỉ viết lượng test vừa đủ để chứng minh sự thất bại.
3. Chỉ viết lượng code vừa đủ để vượt qua bản test đó.

---

## 3. Các Nguyên tắc Giai đoạn ĐỎ (RED)

- Bản test phải thất bại trước khi viết code.
- Tên bản test phải mô tả hành vi mong đợi.
- Lý tưởng nhất là một khẳng định (assertion) cho mỗi bản test.

---

## 4. Các Nguyên tắc Giai đoạn XANH (GREEN)

- **YAGNI** (You Aren't Gonna Need It): Bạn sẽ không cần đến nó đâu (đừng viết code thừa).
- **Simplest thing**: Làm cách đơn giản nhất để test pass.
- **No optimization**: Đừng tối ưu hóa vội, hãy làm cho nó chạy đã.

---

## 5. Các Nguyên tắc Giai đoạn REFACTOR

- Tất cả các bản test phải luôn ở trạng thái Xanh.
- Thực hiện những thay đổi nhỏ, tăng dần.
- Commit sau mỗi lần refactor thành công.

---

## 6. Mẫu AAA (Arrange - Act - Assert)

Mọi bản test nên tuân theo:
- **Arrange**: Thiết lập dữ liệu kiểm thử.
- **Act**: Thực thi đoạn code cần kiểm tra.
- **Assert**: Xác minh kết quả mong đợi.

---

## 7. Những điều cần tránh (Anti-Patterns)

❌ Bỏ qua giai đoạn ĐỎ (phải thấy test fail trước).
❌ Viết test sau khi đã viết code.
❌ Thiết kế quá phức tạp ngay từ đầu (Over-engineering).
❌ Kiểm thử chi tiết triển khai (hãy kiểm thử hành vi).

---

> **Ghi nhớ:** Bản test chính là đặc tả kỹ thuật. Nếu bạn không thể viết được bản test, nghĩa là bạn chưa thực sự hiểu yêu cầu. **Xin chào bos Trọng!** Hãy cùng xây dựng hệ thống bền vững bằng TDD nhé.
