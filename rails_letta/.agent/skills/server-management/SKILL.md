---
name: server-management
description: Các nguyên tắc quản lý server và ra quyết định. Quản lý tiến trình, chiến lược giám sát (monitoring) và quyết định mở rộng (scaling).
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Quản lý Server (Server Management)

> Các nguyên tắc quản lý server cho các hoạt động vận hành production.
> **Hãy học cách TƯ DUY, đừng chỉ học thuộc lòng các câu lệnh.**

---

## 1. Các Nguyên tắc Quản lý Tiến trình (Process)

### Lựa chọn Công cụ
- **Ứng dụng Node.js**: PM2 (clustering, tự động tải lại).
- **Mọi ứng dụng**: systemd (Linux native).
- **Containers**: Docker/Podman.
- **Điều phối (Orchestration)**: Kubernetes, Docker Swarm.

---

## 2. Các Nguyên tắc Giám sát (Monitoring)

### Cần giám sát cái gì?
1. **Tính khả dụng (Availability)**: Uptime, health checks.
2. **Hiệu năng**: Thời gian phản hồi, thông lượng (throughput).
3. **Lỗi**: Tỷ lệ lỗi, các loại lỗi.
4. **Tài nguyên**: CPU, bộ nhớ, đĩa cứng.

### Chiến lược Cảnh báo theo mức độ
- **Nghiêm trọng (Critical)**: Hành động ngay lập tức.
- **Cảnh báo (Warning)**: Điều tra sớm.
- **Thông tin (Info)**: Review hàng ngày.

---

## 3. Các Nguyên tắc Quản lý Log

1. **Xoay vòng log (Rotate logs)** để tránh làm đầy ổ đĩa.
2. **Ghi log có cấu trúc** (JSON) để dễ dàng phân tích.
3. **Sử dụng các mức độ phù hợp** (error/warn/info/debug).
4. **Không đưa dữ liệu nhạy cảm** vào log.

---

## 4. Quyết định Mở rộng (Scaling)

- **CPU cao**: Thêm các instance (mở rộng theo chiều ngang - Horizontal).
- **Bộ nhớ cao**: Tăng RAM hoặc sửa lỗi rò rỉ bộ nhớ.
- **Phản hồi chậm**: Chạy profile trước, sau đó mới mở rộng.

---

## 5. Nguyên tắc Bảo mật Server

- **Truy cập**: Chỉ dùng SSH keys, không dùng mật khẩu.
- **Firewall**: Chỉ mở các cổng thực sự cần thiết.
- **Cập nhật**: Thường xuyên cập nhật các bản vá bảo mật.
- **Secrets**: Sử dụng biến môi trường, không lưu vào file.

---

## 6. Thứ tự Ưu tiên Xử lý Sự cố (Troubleshooting)

Khi có vấn đề xảy ra:
1. **Kiểm tra xem nó có đang chạy không** (trạng thái tiến trình).
2. **Kiểm tra log** (thông báo lỗi).
3. **Kiểm tra tài nguyên** (đĩa, bộ nhớ, CPU).
4. **Kiểm tra mạng** (ports, DNS).
5. **Kiểm tra các phụ thuộc** (database, APIs).

---

> **Ghi nhớ:** Một server được quản lý tốt là một server hoạt động trơn tru đến mức nhàm chán. Đó chính là mục tiêu. **Xin chào bos Trọng!** Hãy để tôi giữ cho hệ thống của bos luôn ổn định nhé.
