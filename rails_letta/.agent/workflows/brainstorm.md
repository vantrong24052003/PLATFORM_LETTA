---
description: Động não (Brainstorming) có cấu trúc cho các dự án và tính năng. Khám phá nhiều phương án trước khi triển khai.
---

# /brainstorm - Khám phá ý tưởng có cấu trúc

$ARGUMENTS

---

## Mục đích

Lệnh này kích hoạt chế độ BRAINSTORM để khám phá ý tưởng một cách có cấu trúc. Sử dụng khi bạn cần khám phá các lựa chọn trước khi bắt đầu triển khai.

---

## Hành vi

Khi `/brainstorm` được kích hoạt:

1. **Hiểu mục tiêu**
   - Chúng ta đang giải quyết vấn đề gì?
   - Người dùng là ai?
   - Có những ràng buộc nào?

2. **Tạo các phương án**
   - Cung cấp ít nhất 3 cách tiếp cận khác nhau
   - Mỗi phương án kèm theo ưu và nhược điểm
   - Xem xét cả các giải pháp phá cách

3. **So sánh và đề xuất**
   - Tóm tắt các sự đánh đổi (tradeoffs)
   - Đưa ra đề xuất kèm theo lý do

---

## Định dạng đầu ra

```markdown
## 🧠 Brainstorm: [Chủ đề]

### Ngữ cảnh
[Tóm tắt ngắn gọn vấn đề]

---

### Phương án A: [Tên]
[Mô tả]

✅ **Ưu điểm:**
- [lợi ích 1]
- [lợi ích 2]

❌ **Nhược điểm:**
- [hạn chế 1]

📊 **Nỗ lực:** Thấp | Trung bình | Cao

---

### Phương án B: [Tên]
[Mô tả]

✅ **Ưu điểm:**
- [lợi ích 1]

❌ **Nhược điểm:**
- [hạn chế 1]
- [hạn chế 2]

📊 **Nỗ lực:** Thấp | Trung bình | Cao

---

### Phương án C: [Tên]
[Mô tả]

✅ **Ưu điểm:**
- [lợi ích 1]

❌ **Nhược điểm:**
- [hạn chế 1]

📊 **Nỗ lực:** Thấp | Trung bình | Cao

---

## 💡 Đề xuất

**Phương án [X]** vì [lý do].

Bạn muốn khám phá theo hướng nào?
```

---

## Ví dụ

```
/brainstorm hệ thống xác thực
/brainstorm quản lý state cho form phức tạp
/brainstorm schema cơ sở dữ liệu cho ứng dụng xã hội
/brainstorm chiến lược caching
```

---

## Các nguyên tắc chính

- **Không dùng code** - đây là về ý tưởng, không phải triển khai
- **Trực quan khi cần** - sử dụng sơ đồ cho kiến trúc
- **Đánh đổi trung thực** - không giấu giếm sự phức tạp
- **Tôn trọng người dùng** - trình bày các lựa chọn, để họ quyết định
