# Kiểm thử Bảo mật API (API Security Testing)

> Các nguyên tắc kiểm thử bảo mật API. OWASP API Top 10, kiểm thử xác thực và phân quyền.

---

## OWASP API Security Top 10

| Lỗ hổng | Trọng tâm Kiểm thử |
|---------------|------------|
| **API1: BOLA** | Truy cập tài nguyên của người dùng khác |
| **API2: Broken Auth** | JWT, session, thông tin đăng nhập |
| **API3: Property Auth** | Mass assignment, lộ dữ liệu |
| **API4: Resource Consumption** | Giới hạn tốc độ (Rate limiting), DoS |
| **API5: Function Auth** | Các endpoint admin, vượt quyền hạn |
| **API6: Business Flow** | Lạm dụng logic nghiệp vụ, tự động hóa |
| **API7: SSRF** | Truy cập mạng nội bộ |
| **API8: Misconfiguration** | Các endpoint debug, CORS |
| **API9: Inventory** | Các API ẩn (Shadow APIs), phiên bản cũ |
| **API10: Unsafe Consumption** | Sự tin tưởng vào API bên thứ ba |

---

## Kiểm thử Xác thực (Authentication Testing)

### Kiểm thử JWT

| Kiểm tra | Cần kiểm thử gì |
|-------|--------------|
| Thuật toán | Thuật toán "None", nhầm lẫn thuật toán |
| Secret | Secret yếu, tấn công brute force |
| Claims | Thời gian hết hạn, người phát hành (issuer), đối tượng (audience) |
| Chữ ký | Việc giả mạo, chèn khóa (key injection) |

### Kiểm thử Session

| Kiểm tra | Cần kiểm thử gì |
|-------|--------------|
| Khởi tạo | Tính khả đoán |
| Lưu trữ | Bảo mật phía client |
| Hết hạn | Việc thực thi timeout |
| Hủy bỏ | Hiệu quả của việc đăng xuất (logout) |

---

## Kiểm thử Phân quyền (Authorization Testing)

| Loại kiểm thử | Cách tiếp cận |
|-----------|----------|
| **Ngang (Horizontal)** | Truy cập dữ liệu của người dùng cùng cấp |
| **Dọc (Vertical)** | Truy cập các chức năng có đặc quyền cao hơn |
| **Ngữ cảnh (Context)** | Truy cập ngoài phạm vi được phép |

### Kiểm thử BOLA/IDOR

1. Xác định ID tài nguyên trong các yêu cầu (requests).
2. Chặn yêu cầu bằng session của người dùng A.
3. Chạy lại yêu cầu đó bằng session của người dùng B.
4. Kiểm tra xem có truy cập được trái phép không.

---

## Kiểm thử Xác thực Đầu vào (Input Validation Testing)

| Loại Injection | Trọng tâm Kiểm thử |
|----------------|------------|
| SQL | Giả mạo câu truy vấn |
| NoSQL | Truy vấn tài liệu |
| Command | Các lệnh hệ thống |
| LDAP | Truy vấn thư mục |

**Cách tiếp cận:** Kiểm thử tất cả các tham số, thử ép kiểu dữ liệu, kiểm thử các trường hợp biên, kiểm tra các thông báo lỗi.

---

## Kiểm thử Giới hạn Tốc độ (Rate Limiting Testing)

| Khía cạnh | Kiểm tra |
|--------|-------|
| Sự tồn tại | Có bất kỳ giới hạn nào không? |
| Vượt rào (Bypass) | Header, thay đổi IP |
| Phạm vi | Theo người dùng, theo IP, toàn cục |

**Kỹ thuật vượt rào:** X-Forwarded-For, sử dụng các phương thức HTTP khác nhau, thay đổi kiểu chữ, đánh số phiên bản API.

---

## Bảo mật GraphQL

| Kiểm thử | Trọng tâm |
|------|-------|
| Soi chiếu (Introspection) | Tiết lộ Schema |
| Batching | Tấn công DoS qua truy vấn |
| Lồng ghép | DoS dựa trên độ sâu |
| Phân quyền | Truy cập ở cấp độ trường (field) |

---

## Danh sách Kiểm tra Bảo mật (Security Testing Checklist)

**Xác thực (Authentication):**
- [ ] Kiểm thử việc vượt rào xác thực.
- [ ] Kiểm tra độ mạnh của thông tin đăng nhập.
- [ ] Xác minh tính bảo mật của token.

**Phân quyền (Authorization):**
- [ ] Kiểm thử BOLA/IDOR.
- [ ] Kiểm tra việc leo thang đặc quyền.
- [ ] Xác minh quyền truy cập chức năng.

**Đầu vào (Input):**
- [ ] Kiểm thử tất cả các tham số.
- [ ] Kiểm tra các lỗi injection.

**Cấu hình (Config):**
- [ ] Kiểm tra CORS.
- [ ] Xác minh các header.
- [ ] Kiểm thử việc xử lý lỗi.

---

> **Ghi nhớ:** API là xương sống của các ứng dụng hiện đại. Hãy kiểm thử chúng như cách mà những kẻ tấn công sẽ làm.
