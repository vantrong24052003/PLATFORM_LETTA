---
name: webapp-testing
description: Các nguyên tắc kiểm thử ứng dụng web. E2E, Browser Subagent, và chiến lược audit.
allowed-tools: browser_subagent
---

# Kiểm thử Ứng dụng Web (Webapp Testing)

> Khám phá và kiểm thử mọi thứ. Đừng để bất kỳ route nào không được kiểm thử.

---

## 🔧 Công cụ Chính: Browser Subagent

Thay vì sử dụng các script Python bên ngoài (như Playwright/Selenium), hãy sử dụng **Browser Subagent** tích hợp sẵn của Antigravity. Đây là một agent phụ chuyên biệt có khả năng điều khiển trình duyệt thực tế.

### Khi nào sử dụng?
- **Kiểm thử luồng người dùng (E2E):** Đăng nhập, tạo báo cáo, flow thanh toán.
- **Xác minh trực quan (Visual Verification):** Kiểm tra layout, màu sắc, responsive.
- **Debugging UI:** Khi cần "nhìn" thấy lỗi 404/500 trên trình duyệt.

### Cách sử dụng `browser_subagent`
Khi gọi tool, hãy cung cấp `Task` rõ ràng và chi tiết:

```text
TaskName: "Verify Login Flow"
Task: "Truy cập http://localhost:3000/login. Đăng nhập với user 'demo@example.com' / pass 'password'. Xác minh chuyển hướng đến Dashboard và chụp ảnh màn hình."
RecordingName: "login_verification"
```

---

## 1. Phương pháp Audit Chuyên sâu

### Khám phá trước (Discovery First)
- **Routes**: Quét thư mục `app/`, `pages/`, các file router.
- **API endpoints**: Tìm kiếm các phương thức HTTP.
- **Components**: Tìm các thư mục component.

### Kiểm thử Hệ thống
1. **Map** - Liệt kê tất cả routes/APIs.
2. **Scan** - Xác minh chúng có phản hồi.
3. **Test** - Bao phủ các luồng quan trọng (critical paths) bằng Browser Subagent.

---

## 2. Kim tự tháp Kiểm thử cho Web

- **E2E (Browser Subagent)**: Các luồng người dùng quan trọng.
- **Integration**: API, dòng chảy dữ liệu.
- **Component**: Các thành phần UI riêng lẻ.

---

## 3. Các Nguyên tắc Kiểm thử E2E (với Subagent)

### Những gì cần kiểm thử
1. Các luồng người dùng thành công (Happy path).
2. Các luồng Xác thực (Authentication).
3. Các hành động nghiệp vụ quan trọng.
4. Xử lý lỗi (Error Handling).

### Thực hành tốt nhất (Best Practices)
- **Yêu cầu cụ thể:** Bảo subagent tìm kiếm các text/button cụ thể thay vì selector CSS mơ hồ.
- **Xác minh kết quả:** Luôn yêu cầu subagent báo cáo lại những gì nó *nhìn thấy* (DOM hoặc Screenshot).
- **Ghi hình:** Đặt tên `RecordingName` có ý nghĩa để dễ dàng xem lại.

---

## 4. Những điều cần tránh (Anti-Patterns)

❌ Yêu cầu subagent "kiểm tra trang web" chung chung (hãy cụ thể).
❌ Bỏ qua các lỗi console mà subagent báo cáo.
❌ Không kiểm tra trên mobile viewport nếu ứng dụng hỗ trợ mobile.

---

> **Ghi nhớ:** Browser Subagent là đôi mắt của bạn. Hãy hướng dẫn nó nhìn vào đúng chỗ. **Xin chào bos Trọng!** Hãy cùng đảm bảo chất lượng ứng dụng.
