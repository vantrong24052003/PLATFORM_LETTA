---
name: documentation-templates
description: Các mẫu tài liệu và hướng dẫn về cấu trúc. README, tài liệu API, comment code và tài liệu thân thiện với AI (AI-friendly).
allowed-tools: Read, Glob, Grep
---

# Các mẫu Tài liệu (Documentation Templates)

> Các mẫu và hướng dẫn cấu trúc cho các loại tài liệu phổ biến.

---

## 1. Cấu trúc README

### Các phần thiết yếu (Theo thứ tự ưu tiên)
1. **Tiêu đề + Một câu tóm tắt**: Đây là cái gì?
2. **Bắt đầu nhanh (Quick Start)**: Chạy được trong < 5 phút.
3. **Tính năng**: Tôi có thể làm gì?
4. **Cấu hình**: Cách tùy chỉnh.
5. **Tham chiếu API**: Link đến tài liệu chi tiết.
6. **Giấy phép (License)**: Pháp lý.

---

## 2. Cấu trúc Tài liệu API

### Mẫu cho mỗi Endpoint
- **Phương thức + Đường dẫn** (Vd: `GET /users/:id`).
- **Mô tả ngắn gọn**.
- **Tham số**: Tên, Kiểu, Bắt buộc, Mô tả.
- **Phản hồi**: Các mã trạng thái và ý nghĩa.
- **Ví dụ**: Request và Response mẫu.

---

## 3. Hướng dẫn Comment trong Code

### Khi nào nên Comment
- **Tại sao** (Logic nghiệp vụ).
- **Các thuật toán phức tạp**.
- **Hành vi không hiển nhiên**.
- **Hợp đồng API**.

### Khi nào KHÔNG nên Comment
- Cái gì (Đã quá rõ ràng từ code).
- Mọi dòng code.
- Code tự giải thích được (Self-explanatory code).

---

## 4. Tài liệu thân thiện với AI (2025)

### Mẫu file llms.txt
Dành cho người dùng AI và các agent:
- Tên dự án và mục tiêu.
- Các file cốt lõi (Core Files).
- Các khái niệm chính (Key Concepts).

---

## 5. Các Nguyên tắc về Cấu trúc

- **Dễ lướt qua (Scannable)**: Sử dụng tiêu đề, danh sách, bảng biểu.
- **Ví dụ lên hàng đầu**: Hãy chỉ ra (show), đừng chỉ nói (tell).
- **Chi tiết tăng dần**: Từ đơn giản đến phức tạp.
- **Luôn cập nhật**: Tài liệu lỗi thời còn tệ hơn là không có gì.

---

> **Ghi nhớ:** Các mẫu là điểm khởi đầu. Hãy điều chỉnh linh hoạt theo nhu cầu dự án của bos nhé. **Xin chào bos Trọng!** Hãy làm cho tài liệu của bos trở nên chuyên nghiệp và dễ hiểu nhất.
