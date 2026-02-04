---
name: trade-off-analysis
description: Phân tích sự đánh đổi và ghi chép quyết định kiến trúc (ADR).
---

# Phân tích Đánh đổi & ADR (Trade-off Analysis & ADR)

> Ghi chép mọi quyết định kiến trúc kèm theo các sự đánh đổi.

## Khung Công việc Quyết định (Decision Framework)

Đối với MỖI thành phần kiến trúc, hãy ghi chép lại:

```markdown
## Bản ghi Quyết định Kiến trúc (ADR)

### Ngữ cảnh
- **Vấn đề**: [Vấn đề chúng ta đang cần giải quyết?]
- **Ràng buộc**: [Quy mô nhóm, quy mô hệ thống, thời gian, ngân sách]

### Các phương án đã Cân nhắc

| Phương án | Ưu điểm | Nhược điểm | Độ phức tạp | Khi nào phù hợp |
|-----------|---------|------------|-------------|-----------------|
| Phương án A | Lợi ích 1 | Chi phí 1 | Thấp | [Điều kiện] |
| Phương án B | Lợi ích 2 | Chi phí 2 | Cao | [Điều kiện] |

### Quyết định
**Lựa chọn cuối cùng**: [Phương án B]

### Lý do lựa chọn
1. [Lý do 1 - gắn liền với các ràng buộc]
2. [Lý do 2 - gắn liền với yêu cầu]

### Sự Đánh đổi Chấp nhận được
- [Những gì chúng ta đang từ bỏ]
- [Tại sao điều này có thể chấp nhận được]

### Hệ quả
- **Tích cực**: [Lợi ích đạt được]
- **Tiêu cực**: [Chi phí/Rủi ro chấp nhận]
- **Giải pháp Giảm thiểu**: [Cách chúng ta xử lý hậu quả tiêu cực]
```

## Template ADR

```markdown
# ADR-[XXX]: [Tên Quyết định]

## Trạng thái
Proposed (Đề xuất) | Accepted (Chấp nhận) | Deprecated (Lỗi thời) | Superseded by [ADR-YYY] (Thay thế bởi)

## Ngữ cảnh
[Vấn đề là gì? Có những ràng buộc nào?]

## Quyết định
[Chúng ta đã chọn phương án nào - hãy cụ thể]

## Lý do
[Tại sao - gắn với yêu cầu và ràng buộc]

## Sự Đánh đổi
[Những gì chúng ta phải hy sinh - hãy trung thực]

## Hệ quả
- **Tích cực**: [Lợi ích]
- **Tiêu cực**: [Chi phí/Rủi ro]
- **Giải pháp**: [Cách xử lý]
```

**Xin chào bos Trọng!** Việc ghi chép ADR giúp bos hiểu rõ "tại sao" chúng ta lại chọn hướng đi này.
