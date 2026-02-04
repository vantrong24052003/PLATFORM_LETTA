---
name: clean-code
description: Tiêu chuẩn lập trình thực dụng - ngắn gọn, trực tiếp, không over-engineering, không comment thừa.
allowed-tools: Read, Write, Edit
version: 2.0
priority: CRITICAL
---

# Clean Code - Tiêu chuẩn Lập trình AI Thực dụng

> **KỸ NĂNG QUAN TRỌNG** - Hãy **ngắn gọn, trực tiếp và tập trung vào giải pháp**.

---

## Các nguyên tắc cốt lõi

| Nguyên tắc | Quy tắc |
|------------|---------|
| **SRP** | Single Responsibility - mỗi function/class chỉ làm MỘT việc |
| **DRY** | Don't Repeat Yourself - trích xuất code trùng lặp, tái sử dụng |
| **KISS** | Keep It Simple - giải pháp đơn giản nhất mà vẫn hiệu quả |
| **YAGNI** | You Aren't Gonna Need It - đừng xây dựng những tính năng chưa dùng tới |
| **Boy Scout** | Để lại code sạch hơn lúc bạn tìm thấy nó |

---

## Quy tắc đặt tên

| Thành phần | Quy ước |
|------------|---------|
| **Variables** | Rõ ràng ý định: `userCount` thay vì `n` |
| **Functions** | Động từ + Danh từ: `getUserById()` thay vì `user()` |
| **Booleans** | Dạng câu hỏi: `isActive`, `hasPermission`, `canEdit` |
| **Constants** | SCREAMING_SNAKE: `MAX_RETRY_COUNT` |

> **Quy tắc:** Nếu bạn cần một comment để giải thích một cái tên, hãy đổi tên nó.
> **Ngôn ngữ:** Viết mã nguồn và comment bằng **tiếng Anh**. Sử dụng **tiếng Việt** cho mọi tài liệu quy ước và trao đổi.

---

## Quy tắc cho Function

| Quy tắc | Mô tả |
|---------|-------|
| **Nhỏ** | Tối đa 20 dòng, lý tưởng là 5-10 dòng |
| **Một việc** | Làm đúng một việc và làm thật tốt |
| **Một cấp độ** | Chỉ một cấp độ trừu tượng cho mỗi function |
| **Ít đối số** | Tối đa 3 đối số, ưu tiên 0-2 |
| **Không Side Effects** | Không thay đổi input một cách bất ngờ |

---

## Cấu trúc Code

| Pattern | Áp dụng |
|---------|---------|
| **Guard Clauses** | Return sớm cho các trường hợp biên/lỗi |
| **Flat > Nested** | Tránh lồng ghép sâu (tối đa 2 cấp) |
| **Composition** | Các function nhỏ được kết hợp với nhau |
| **Colocation** | Giữ mã liên quan ở gần nhau |

---

## Phong cách Lập trình AI

| Tình huống | Hành động |
|------------|-----------|
| Người dùng yêu cầu tính năng | Viết trực tiếp |
| Người dùng báo lỗi | Sửa lỗi ngay, đừng giải thích dài dòng |
| Không rõ yêu cầu | Hỏi, không được giả định |

---

## Các Anti-Patterns (CẦN TRÁNH)

- Comment mọi dòng code → Hãy xóa các comment hiển nhiên.
- Viết helper cho một dòng code → Hãy viết trực tiếp (inline).
- God functions (Hàm quá lớn) → Hãy chia nhỏ theo trách nhiệm.
- "Đầu tiên chúng ta import..." → Đừng nói meta, hãy viết code luôn.

---

## 🔴 Trước khi sửa bất kỳ file nào (HÃY SUY NGHĨ!)

**Trước khi thay đổi một file, hãy tự hỏi:**
1. **File nào import file này?** Chúng có thể bị lỗi.
2. **File này import những gì?** Các thay đổi về interface.
3. **Những test nào bao phủ phần này?** Test có thể bị fail.

> 🔴 **Quy tắc:** Sửa file + tất cả các file phụ thuộc trong CÙNG một task.

---

## Tóm tắt

| Nên | Không nên |
|-----|-----------|
| Viết code trực tiếp | Viết bài hướng dẫn |
| Code tự tường minh | Thêm comment hiển nhiên |
| Sửa bug ngay lập tức | Giải thích cách sửa trước |
| Đặt tên rõ ràng | Sử dụng từ viết tắt |

---

## 🔴 Tự kiểm tra trước khi hoàn tất (BẮT BUỘC)

**Trước khi nói "nhiệm vụ hoàn thành", hãy xác nhận:**
- ✅ **Mục tiêu đã đạt?** Tôi đã làm chính xác những gì người dùng yêu cầu chưa?
- ✅ **Code hoạt động?** Tôi đã test/xác minh thay đổi chưa?
- ✅ **Không có lỗi?** Lint và TypeScript/Ruby pass chưa?

> 🔴 **Quy tắc:** Nếu BẤT KỲ kiểm tra nào thất bại, hãy sửa trước khi hoàn tất.

---

## Script Xác minh (BẮT BUỘC)

> 🔴 **QUAN TRỌNG:** Mỗi agent CHỈ chạy các script thuộc skill của mình sau khi hoàn thành công việc.

### Xử lý kết quả Script (ĐỌC → TÓM TẮT → HỎI)

1. **Chạy script** và lấy TOÀN BỘ output.
2. **Phân tích output** - xác định lỗi, cảnh báo và các phần đã pass.
3. **Tóm tắt cho người dùng** theo định dạng: Lỗi (X mục), Cảnh báo (Y mục), Đã pass (Z mục).
4. **Hỏi: "Tôi có nên sửa X lỗi này không?"**
5. **Đợi xác nhận** trước khi sửa.

> 🔴 **VI PHẠM:** Chạy script và phớt lờ output = Nhiệm vụ THẤT BẠI.
