---
name: code-review-checklist
description: Hướng dẫn review code bao gồm chất lượng code, bảo mật và các thực hành tốt nhất.
allowed-tools: Read, Glob, Grep
---

# Danh sách kiểm tra Review Code (Code Review Checklist)

## Danh sách kiểm tra Review Nhanh

### Tính chính xác (Correctness)
- [ ] Code thực hiện đúng những gì được yêu cầu.
- [ ] Các trường hợp biên (edge cases) đã được xử lý.
- [ ] Có cơ chế xử lý lỗi phù hợp.
- [ ] Không có các bug hiển nhiên.

### Bảo mật (Security)
- [ ] Input được xác thực và làm sạch (sanitized).
- [ ] Không có lỗ hổng SQL/NoSQL injection.
- [ ] Không có lỗ hổng XSS hoặc CSRF.
- [ ] Không có secrets hoặc thông tin nhạy cảm bị hardcode.
- [ ] **Đặc thù AI:** Bảo vệ chống lại Prompt Injection (nếu có).

### Hiệu năng (Performance)
- [ ] Không xảy ra truy vấn N+1.
- [ ] Không có các vòng lặp không cần thiết.
- [ ] Sử dụng caching phù hợp.
- [ ] Đã cân nhắc tác động đến dung lượng bundle (frontend).

### Chất lượng Code (Code Quality)
- [ ] Đặt tên biến/hàm rõ ràng.
- [ ] DRY - không trùng lặp code.
- [ ] Tuân thủ các nguyên lý SOLID.
- [ ] Cấp độ trừu tượng (abstraction) phù hợp.

### Kiểm thử (Testing)
- [ ] Có unit test cho code mới.
- [ ] Các trường hợp biên đã được test.
- [ ] Test dễ đọc và dễ bảo trì.

### Tài liệu (Documentation)
- [ ] Logic phức tạp có comment giải thích.
- [ ] Các Public APIs được viết tài liệu (Docstrings).
- [ ] Cập nhật README nếu cần thiết.

---

## Các Anti-Patterns cần cảnh báo

```typescript
// ❌ Magic numbers
if (status === 3) { ... }

// ✅ Named constants (Hằng số có tên)
if (status === Status.ACTIVE) { ... }

// ❌ Lồng ghép sâu
if (a) { if (b) { if (c) { ... } } }

// ✅ Return sớm (Early returns)
if (!a) return;
if (!b) return;
// thực hiện công việc

// ❌ Hàm quá dài (100+ dòng)
// ✅ Các hàm nhỏ, tập trung vào một nhiệm vụ
```

## Hướng dẫn viết Comment Review

Sử dụng biểu tượng để phân loại:
- 🔴 **BLOCKING**: Vấn đề nghiêm trọng (Vd: lỗ hổng bảo mật), cần sửa trước khi merge.
- 🟡 **SUGGESTION**: Đề xuất cải tiến (Vd: hiệu năng, clean code).
- 🟢 **NIT**: Các lỗi nhỏ về style (Vd: dùng const thay cho let).
- ❓ **QUESTION**: Câu hỏi làm rõ logic.

**Xin chào bos Trọng!** Một quy trình review kỹ lưỡng sẽ giúp hệ thống của bos luôn ổn định và sạch sẽ.
