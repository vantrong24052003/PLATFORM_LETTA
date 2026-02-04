---
name: architecture
description: Khung ra quyết định kiến trúc. Phân tích yêu cầu, đánh giá đánh đổi (trade-off), tài liệu hóa ADR. Sử dụng khi đưa ra quyết định kiến trúc hoặc phân tích thiết kế hệ thống.
allowed-tools: Read, Glob, Grep
---

# Khung Quyết định Kiến trúc

> "Yêu cầu dẫn dắt kiến trúc. Sự đánh đổi chỉ dẫn quyết định. ADR lưu giữ lý do."

---

## 🎯 Quy tắc Đọc có Chọn lọc

**Chỉ đọc các phần liên quan đến yêu cầu!** Kiểm tra bản đồ nội dung để tìm những gì bạn cần.

| Phần | Mô tả | Khi nào cần đọc |
|------|-------|-----------------|
| `context-discovery.md` | Các câu hỏi cần hỏi, phân loại dự án | Khi bắt đầu thiết kế kiến trúc |
| `trade-off-analysis.md` | Mẫu ADR, khung phân tích đánh đổi | Khi tài liệu hóa quyết định |
| `pattern-selection.md` | Sơ đồ cây quyết định, các anti-patterns | Khi chọn các mẫu kiến trúc |
| `examples.md` | Ví dụ về MVP, SaaS, Doanh nghiệp | Tham khảo cách triển khai |
| `patterns-reference.md` | Tra cứu nhanh các mẫu kiến trúc | So sánh các mẫu kiến trúc |

---

## 🔗 Các Kỹ năng Liên quan

| Kỹ năng | Sử dụng cho |
|---------|-------------|
| `skills/database-design` | Thiết kế schema cơ sở dữ liệu |
| `skills/api-patterns` | Các mẫu thiết kế API |
| `skills/deployment-procedures` | Kiến trúc triển khai |

---

## Nguyên tắc cốt lõi

**"Sự đơn giản là tinh hoa của sự tinh tế."**

- Bắt đầu đơn giản.
- CHỈ thêm sự phức tạp khi thực sự cần thiết.
- Bạn luôn có thể thêm các mẫu kiến trúc sau này.
- Loại bỏ sự phức tạp khó hơn NHIỀU so với việc thêm nó.

---

## Checklist Xác thực

Trước khi hoàn tất kiến trúc:

- [ ] Các yêu cầu đã được hiểu rõ.
- [ ] Các ràng buộc đã được xác định.
- [ ] Mỗi quyết định đều có phân tích đánh đổi (trade-off).
- [ ] Đã cân nhắc các giải pháp thay thế đơn giản hơn.
- [ ] ADR đã được viết cho các quyết định quan trọng.
- [ ] Chuyên môn của team phù hợp với các mẫu được chọn.

**Xin chào bos Trọng!** Kiến trúc tốt là nền móng của sự thành công. Hãy cùng xây dựng thật vững chắc!
