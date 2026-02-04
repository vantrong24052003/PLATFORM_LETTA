---
description: Lệnh giúp debug. Kích hoạt chế độ DEBUG để điều tra vấn đề một cách có hệ thống.
---

# /debug - Điều tra vấn đề có hệ thống

$ARGUMENTS

---

## Mục đích

Lệnh này kích hoạt chế độ DEBUG để điều tra các sự cố, lỗi hoặc hành vi không mong muốn một cách có hệ thống.

---

## Hành vi

Khi `/debug` được kích hoạt:

1. **Thu thập thông tin**
   - Thông báo lỗi
   - Các bước tái hiện
   - Hành vi mong muốn so với thực tế
   - Các thay đổi gần đây

2. **Đưa ra giả thuyết**
   - Liệt kê các nguyên nhân có thể xảy ra
   - Sắp xếp theo mức độ khả thi

3. **Điều tra có hệ thống**
   - Kiểm tra từng giả thuyết
   - Kiểm tra log, luồng dữ liệu
   - Sử dụng phương pháp loại trừ

4. **Sửa lỗi và phòng ngừa**
   - Áp dụng bản sửa lỗi
   - Giải thích nguyên nhân gốc rễ
   - Thêm các biện pháp phòng ngừa

---

## Định dạng đầu ra

```markdown
## 🔍 Debug: [Vấn đề]

### 1. Triệu chứng
[Chuyện gì đang xảy ra]

### 2. Thông tin thu thập được
- Lỗi: `[thông báo lỗi]`
- File: `[đường dẫn file]`
- Dòng: [số dòng]

### 3. Các giả thuyết
1. ❓ [Nguyên nhân khả thi nhất]
2. ❓ [Khả năng thứ hai]
3. ❓ [Nguyên nhân ít khả năng hơn]

### 4. Quá trình điều tra

**Kiểm tra giả thuyết 1:**
[Tôi đã kiểm tra những gì] → [Kết quả]

**Kiểm tra giả thuyết 2:**
[Tôi đã kiểm tra những gì] → [Kết quả]

### 5. Nguyên nhân gốc rễ
🎯 **[Giải thích lý do tại sao vấn đề này xảy ra]**

### 6. Cách khắc phục
```[ngôn ngữ]
// Trước
[code bị lỗi]

// Sau
[code đã sửa]
```

### 7. Phòng ngừa
🛡️ [Cách ngăn chặn vấn đề này trong tương lai]
```

---

## Ví dụ

```
/debug đăng nhập không hoạt động
/debug API trả về lỗi 500
/debug form không gửi được dữ liệu
/debug dữ liệu không lưu được
```

---

## Các nguyên tắc chính

- **Hỏi trước khi giả định** - lấy đầy đủ ngữ cảnh lỗi
- **Kiểm tra giả thuyết** - không đoán mò
- **Giải thích lý do** - không chỉ đưa ra cách sửa
- **Ngăn chặn tái diễn** - thêm kiểm thử, xác thực
