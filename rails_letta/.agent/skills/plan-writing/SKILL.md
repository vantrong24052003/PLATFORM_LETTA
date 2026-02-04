---
name: plan-writing
description: Lập kế hoạch nhiệm vụ có cấu trúc với các bảng phân rã rõ ràng, các phụ thuộc và tiêu chí xác thực. Sử dụng khi triển khai các tính năng, refactor hoặc bất kỳ công việc nào có nhiều bước.
allowed-tools: Read, Glob, Grep
---

# Lập Kế hoạch (Plan Writing)

## Tổng quan
Kỹ năng này cung cấp một khung làm việc để chia nhỏ công việc thành các nhiệm vụ rõ ràng, có thể thực hiện được kèm theo tiêu chí xác thực.

## Các Nguyên tắc Phân rã Nhiệm vụ

### 1. Nhiệm vụ Nhỏ và Tập trung
- Mỗi nhiệm vụ nên mất từ 2-5 phút.
- Một kết quả rõ ràng cho mỗi nhiệm vụ.
- Có thể xác thực độc lập.

### 2. Xác thực Rõ ràng
- Làm thế nào bạn biết nó đã hoàn thành?
- Bạn có thể kiểm tra/test cái gì?
- Kết quả mong đợi là gì?

### 3. Sắp xếp Thứ tự Logic
- Xác định các phụ thuộc.
- Làm việc song song nếu có thể.
- Làm nổi bật đường dẫn quan trọng (critical path).
- **Giai đoạn Xác thực luôn là CUỐI CÙNG.**

---

## Các Nguyên tắc Lập kế hoạch (KHÔNG phải Template!)

> 🔴 **KHÔNG dùng template cố định. Mỗi kế hoạch là DUY NHẤT cho từng nhiệm vụ.**

### Nguyên tắc 1: Giữ cho NGẮN GỌN

| ❌ Sai | ✅ Đúng |
|--------|---------|
| 50 nhiệm vụ với các nhiệm vụ con lồng nhau | Tối đa 5-10 nhiệm vụ rõ ràng |
| Liệt kê mọi bước siêu nhỏ | Chỉ liệt kê các mục có thể thực hiện |
| Mô tả dài dòng | Mỗi nhiệm vụ chỉ một dòng |

> **Quy tắc:** Nếu kế hoạch dài hơn 1 trang, nó quá dài. Hãy đơn giản hóa.

---

### Nguyên tắc 2: CỤ THỂ, Không Chung chung

| ❌ Sai | ✅ Đúng |
|--------|---------|
| "Thiết lập dự án" | "Chạy lệnh `npx create-next-app`" |
| "Thêm xác thực" | "Cài đặt next-auth, tạo file `/api/auth/[...nextauth].ts`" |
| "Style giao diện" | "Thêm các class Tailwind vào `Header.tsx`" |

---

### Nguyên tắc 3: Nội dung Linh hoạt theo Loại Dự án

**Cho DỰ ÁN MỚI:**
- Stack công nghệ là gì? (quyết định trước)
- MVP là gì? (các tính năng tối thiểu)
- Cấu trúc file như thế nào?

**Cho VIỆC THÊM TÍNH NĂNG:**
- Những file nào bị ảnh hưởng?
- Cần những phụ thuộc nào?
- Làm sao để xác thực nó hoạt động?

---

### Nguyên tắc 4: Các Script theo đặc thù Dự án

> 🔴 **KHÔNG copy-paste các lệnh script. Hãy chọn dựa trên loại dự án.**

| Loại dự án | Các Script liên quan |
|------------|-----------------------|
| Frontend/React | `ux_audit.py`, `accessibility_checker.py` |
| Backend/API | `api_validator.py`, `security_scan.py` |
| Database | `schema_validator.py` |

---

## Cấu trúc Kế hoạch (Linh hoạt!)

```
# [Tên Nhiệm vụ]

## Mục tiêu
Một câu: Chúng ta đang xây dựng/sửa cái gì?

## Các nhiệm vụ
- [ ] Nhiệm vụ 1: [Hành động cụ thể] → Xác thực: [Cách kiểm tra]
- [ ] Nhiệm vụ 2: [Hành động cụ thể] → Xác thực: [Cách kiểm tra]
- [ ] Nhiệm vụ 3: [Hành động cụ thể] → Xác thực: [Cách kiểm tra]

## Hoàn thành khi
- [ ] [Tiêu chí thành công chính]
```

---

## Các Thực hành Tốt nhất (Tra cứu nhanh)

1. **Bắt đầu với mục tiêu** - Chúng ta đang làm gì?
2. **Tối đa 10 nhiệm vụ** - Nếu nhiều hơn, hãy chia thành nhiều kế hoạch.
3. **Mỗi nhiệm vụ phải xác thực được** - Tiêu chí "xong" rõ ràng.
4. **Cập nhật liên tục** - Đánh dấu `[x]` khi hoàn thành.

---

**Xin chào bos Trọng!** Một kế hoạch tốt là 50% của thành công. Hãy cùng lập kế hoạch thật chuẩn nhé.
