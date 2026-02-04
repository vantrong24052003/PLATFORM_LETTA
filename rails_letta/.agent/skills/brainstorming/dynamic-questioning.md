---
name: dynamic-questioning
description: Giao thức tạo câu hỏi năng động để làm rõ các yêu cầu kiến trúc và nghiệp vụ.
---

# Tạo Câu hỏi Năng động (Dynamic Question Generation)

> **NGUYÊN TẮC:** Câu hỏi không phải để thu thập dữ liệu—mà là để **làm rõ các hệ quả về kiến trúc**.
>
> Mỗi câu hỏi phải kết nối với một quyết định triển khai cụ thể ảnh hưởng đến chi phí, độ phức tạp hoặc thời gian hoàn thành.

---

## 🧠 Các Nguyên tắc Cốt lõi

### 1. Câu hỏi Tiết lộ Hệ quả
Một câu hỏi tốt không phải là "Bạn muốn màu gì?" mà là:
- "Bạn muốn đăng nhập bằng Email/Mật khẩu hay qua Mạng xã hội?"
- **Hệ quả**: Email/Pass cần hệ thống reset mật khẩu, hashing, 2FA. Social cần OAuth providers, ánh xạ profile.
- **Sự đánh đổi**: Bảo mật vs Thời gian phát triển vs Sự tiện lợi của người dùng.

### 2. Ngữ cảnh trước Nội dung
- **Dự án mới (Greenfield)**: Quyết định nền tảng (stack, hosting, quy mô).
- **Thêm tính năng**: Điểm tích hợp, các mẫu hiện có, thay đổi gây gãy (breaking changes).
- **Refactor**: Tại sao cần refactor? Hiệu năng? Khả năng bảo trì?
- **Debug**: Triệu chứng → Nguyên nhân gốc rễ → Luồng tái hiện.

### 3. Câu hỏi Tối giản có Giá trị (Minimum Viable Questions)
Mỗi câu hỏi phải giúp loại bỏ một ngã rẽ trong lộ trình triển khai. Nếu câu hỏi không giúp thu hẹp phạm vi triển khai → **HÃY XÓA NÓ**.

---

## 📋 Thuật toán Tạo Câu hỏi

1. **Phân tích Yêu cầu**: Trích xuất domain (e-commerce, auth...), tính năng và quy mô.
2. **Xác định các Điểm Quyết định**: Cái gì BẮT BUỘC phải quyết định trước khi code? Cái gì ảnh hưởng lớn đến KIẾN TRÚC?
3. **Tạo Câu hỏi (Theo thứ tự ưu tiên)**:
   - **P0**: Quyết định gây chặn (không thể tiến hành nếu thiếu câu trả lời).
   - **P1**: Ảnh hưởng lớn (chiếm >30% khối lượng triển khai).
   - **P2**: Ảnh hưởng trung bình (tính năng cụ thể).
4. **Định dạng mỗi Câu hỏi**:
   - Cái gì: Câu hỏi rõ ràng.
   - Tại sao: Ảnh hưởng đến việc triển khai.
   - Các lựa chọn: Sự đánh đổi (Pro/Con).
   - Mặc định: Điều gì xảy ra nếu người dùng không trả lời.

---

## 📐 Template Câu hỏi Năng động

```markdown
Dựa trên yêu cầu của bos về [DOMAIN] [TÍNH NĂNG]:

## 🔴 CỰC KỲ QUAN TRỌNG (Quyết định gây chặn)

### 1. **[ĐIỂM QUYẾT ĐỊNH]**
**Câu hỏi:** [Câu hỏi cụ thể, rõ ràng]
**Tại sao điều này quan trọng:** [Giải thích hệ quả kiến trúc]
**Các lựa chọn:** [Bảng so sánh Pro/Con]
**Nếu không được chỉ định:** [Lựa chọn mặc định + lý do]
```

---

## 🎯 Nhắc lại các Nguyên tắc

1. **Mỗi câu hỏi = Một quyết định Kiến trúc**.
2. **Chỉ ra sự đánh đổi** → Để người dùng hiểu hệ quả.
3. **Ưu tiên các quyết định gây chặn**.
4. **Cung cấp lựa chọn mặc định** → Để vẫn có thể tiến hành nếu người dùng chưa trả lời.
5. **Phù hợp với Domain** → Câu hỏi về E-commerce ≠ Câu hỏi về Xác thực.

**Xin chào bos Trọng!** Em sẽ đặt những câu hỏi then chốt nhất để đảm bảo dự án của bos đi đúng hướng ngay từ đầu.
