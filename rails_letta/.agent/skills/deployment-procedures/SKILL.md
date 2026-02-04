---
name: deployment-procedures
description: Các nguyên tắc triển khai (deployment) và ra quyết định trên production. Quy trình triển khai an toàn, chiến lược rollback và xác minh. Dạy tư duy, không phải dạy script.
allowed-tools: Read, Glob, Grep, Bash
---

# Quy trình Triển khai (Deployment Procedures)

> Các nguyên tắc triển khai và ra quyết định để phát hành phiên bản production một cách an toàn.
> **Hãy học cách TƯ DUY, đừng chỉ học thuộc lòng các câu lệnh.**

---

## ⚠️ Cách Sử dụng Kỹ năng này

Kỹ năng này dạy **các nguyên tắc triển khai**, không phải các script bash để sao chép.

- Mỗi lần triển khai là duy nhất.
- Phải hiểu lý do (TẠI SAO) đằng sau mỗi bước.
- Điều chỉnh quy trình cho phù hợp với nền tảng (platform) của bạn.

---

## 1. Lựa chọn Nền tảng (Platform)

### Cây Quyết định

```
Bạn đang triển khai cái gì?
│
├── Trang tĩnh (Static site) / JAMstack
│   └── Vercel, Netlify, Cloudflare Pages
│
├── Ứng dụng web đơn giản
│   ├── Được quản lý (Managed) → Railway, Render, Fly.io
│   └── Tự kiểm soát (Control) → VPS + PM2/Docker
│
├── Microservices
│   └── Điều phối container (Container orchestration)
│
└── Không máy chủ (Serverless)
    └── Edge functions, Lambda
```

### Mỗi nền tảng có các quy trình khác nhau

| Nền tảng | Phương thức triển khai |
|----------|------------------|
| **Vercel/Netlify** | Git push, tự động triển khai |
| **Railway/Render** | Git push hoặc sử dụng CLI |
| **VPS + PM2** | SSH + các bước thủ công |
| **Docker** | Push Image + điều phối (orchestration) |
| **Kubernetes** | Sử dụng lệnh `kubectl apply` |

---

## 2. Các Nguyên tắc Trước khi Triển khai (Pre-Deployment)

### 4 Danh mục Xác minh

| Danh mục | Cần kiểm tra gì |
|----------|--------------|
| **Chất lượng Code** | Test đã pass, lint sạch sẽ, đã được review |
| **Bản Build** | Bản build production hoạt động, không có cảnh báo |
| **Môi trường** | Các biến môi trường (Env vars) đã đặt, secrets đủ |
| **An toàn** | Đã sao lưu (backup), kế hoạch rollback đã sẵn sàng |

### Danh sách kiểm tra Trước triển khai

- [ ] Tất cả các bài test đã vượt qua.
- [ ] Code đã được review và phê duyệt.
- [ ] Build production thành công.
- [ ] Các biến môi trường đã được xác minh.
- [ ] Các migration database đã sẵn sàng (nếu có).
- [ ] Kế hoạch rollback đã được tài liệu hóa.
- [ ] Đã thông báo cho đội ngũ.
- [ ] Hệ thống giám sát (monitoring) đã sẵn sàng.

---

## 3. Các Nguyên tắc Quy trình Triển khai (Workflow)

### Quy trình 5 Giai đoạn

```
1. CHUẨN BỊ (PREPARE)
   └── Xác minh code, bản build, biến môi trường

2. SAO LƯU (BACKUP)
   └── Lưu lại trạng thái hiện tại trước khi thay đổi

3. TRIỂN KHAI (DEPLOY)
   └── Thực hiện và mở hệ thống giám sát

4. XÁC MINH (VERIFY)
   └── Kiểm tra sức khỏe hệ thống (health check), log, các luồng chính

5. XÁC NHẬN hoặc ROLLBACK
   └── Mọi thứ ổn? Xác nhận. Có vấn đề? Rollback ngay.
```

### Các nguyên tắc trong từng Giai đoạn

| Giai đoạn | Nguyên tắc |
|-------|-----------|
| **Chuẩn bị** | Không bao giờ triển khai code chưa được test |
| **Sao lưu** | Không thể rollback nếu không có bản sao lưu |
| **Triển khai** | Theo dõi sát sao, đừng bỏ đi nơi khác |
| **Xác minh** | Tin tưởng nhưng vẫn phải kiểm chứng |
| **Xác nhận** | Luôn chuẩn bị sẵn nút kích hoạt rollback |

---

## 4. Xác minh Sau khi Triển khai (Post-Deployment)

### Cần xác minh những gì

| Kiểm tra | Tại sao |
|-------|-----|
| **Endpoint sức khỏe** | Dịch vụ đang thực sự chạy |
| **Log lỗi** | Không có lỗi mới phát sinh |
| **Luồng người dùng chính** | Các tính năng quan trọng hoạt động tốt |
| **Hiệu năng** | Thời gian phản hồi nằm trong mức chấp nhận được |

### Khung thời gian Xác minh

- **5 phút đầu**: Giám sát tích cực.
- **15 phút**: Xác nhận hệ thống ổn định.
- **1 giờ**: Xác minh lần cuối.
- **Ngày tiếp theo**: Đánh giá lại các chỉ số (metrics).

---

## 5. Các Nguyên tắc Rollback

### Khi nào cần Rollback

| Triệu chứng | Hành động |
|---------|--------|
| Dịch vụ sập (Down) | Rollback ngay lập tức |
| Lỗi nghiêm trọng | Rollback |
| Hiệu năng giảm >50% | Xem xét việc rollback |
| Lỗi nhỏ | Sửa lỗi trực tiếp (Fix forward) nếu nhanh |

### Chiến lược Rollback theo Nền tảng

| Nền tảng | Phương thức Rollback |
|----------|----------------|
| **Vercel/Netlify** | Triển khai lại commit trước đó |
| **Railway/Render** | Rollback trong bảng điều khiển (dashboard) |
| **VPS + PM2** | Khôi phục bản sao lưu, khởi động lại |
| **Docker** | Sử dụng tag image trước đó |
| **K8s** | `kubectl rollout undo` |

### Các nguyên tắc Rollback

1. **Tốc độ quan trọng hơn sự hoàn hảo**: Rollback trước, debug sau.
2. **Đừng làm lỗi chồng lỗi**: Thực hiện một lần rollback, không thay đổi quá nhiều thứ.
3. **Giao tiếp**: Thông báo cho đội ngũ về chuyện gì đang xảy ra.
4. **Họa sau sự (Post-mortem)**: Tìm hiểu lý do sau khi hệ thống đã ổn định.

---

## 6. Triển khai Không gián đoạn (Zero-Downtime)

### Các chiến lược

| Chiến lược | Cách thức hoạt động |
|----------|--------------|
| **Rolling** | Thay thế từng instance một |
| **Blue-Green** | Chuyển đổi lưu lượng giữa hai môi trường |
| **Canary** | Chuyển đổi lưu lượng dần dần |

### Nguyên tắc lựa chọn

| Kịch bản | Chiến lược |
|----------|----------|
| Phát hành thông thường | Rolling |
| Thay đổi rủi ro cao | Blue-green (dễ dàng rollback) |
| Cần xác thực thực tế | Canary (test với lưu lượng thật) |

---

## 7. Quy trình Khẩn cấp (Emergency)

### Ưu tiên khi Dịch vụ Sập

1. **Đánh giá**: Triệu chứng là gì?
2. **Sửa nhanh**: Khởi động lại nếu chưa rõ nguyên nhân.
3. **Rollback**: Nếu khởi động lại không có tác dụng.
4. **Điều tra**: Sau khi hệ thống đã ổn định.

### Thứ tự Điều tra

| Kiểm tra | Các vấn đề thường gặp |
|-------|--------------|
| **Log** | Lỗi, ngoại lệ (exceptions) |
| **Tài nguyên** | Đầy ổ đĩa, hết bộ nhớ |
| **Mạng** | DNS, firewall |
| **Phụ thuộc** | Database, các API bên ngoài |

---

## 8. Các Các phản mẫu (Anti-Patterns)

| ❌ KHÔNG NÊN | ✅ NÊN |
|----------|-------|
| Triển khai vào thứ Sáu | Triển khai vào đầu tuần |
| Triển khai vội vã | Tuân thủ quy trình |
| Bỏ qua môi trường staging | Luôn test trước khi lên production |
| Triển khai không sao lưu | Sao lưu trước khi triển khai |
| Bỏ đi ngay sau khi triển khai | Giám sát ít nhất 15 phút |
| Thay đổi nhiều thứ cùng lúc | Thực hiện từng thay đổi một |

---

## 9. Danh sách kiểm tra Quyết định

Trước khi triển khai:

- [ ] **Quy trình có phù hợp với nền tảng không?**
- [ ] **Chiến lược sao lưu đã sẵn sàng chưa?**
- [ ] **Kế hoạch rollback đã được ghi lại chưa?**
- [ ] **Hệ thống giám sát đã được cấu hình chưa?**
- [ ] **Đội ngũ đã được thông báo chưa?**
- [ ] **Có đủ thời gian để theo dõi sau triển khai không?**

---

## 10. Các Thực hành Tốt nhất

1. **Triển khai nhỏ, thường xuyên** thay vì các bản phát hành khổng lồ.
2. **Sử dụng Feature flags** cho các thay đổi nhiều rủi ro.
3. **Tự động hóa** các bước lặp đi lặp lại.
4. **Tài liệu hóa** mọi lần triển khai.
5. **Review** lại những gì đã xảy ra sau khi gặp sự cố.
6. **Kiểm tra việc rollback** trước khi bạn thực sự cần đến nó.

---

**Xin chào bos Trọng!** Mỗi lần triển khai đều tiềm ẩn rủi ro. Hãy giảm thiểu rủi ro thông qua sự chuẩn bị kỹ lưỡng, chứ không phải bằng tốc độ.
