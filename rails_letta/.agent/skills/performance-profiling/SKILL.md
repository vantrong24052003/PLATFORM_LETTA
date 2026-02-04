---
name: performance-profiling
description: Các nguyên tắc profiling hiệu năng. Đo lường, phân tích và các kỹ thuật tối ưu hóa.
allowed-tools: Read, Glob, Grep, Bash
---

# Profiling Hiệu năng (Performance Profiling)

> Đo lường, phân tích, tối ưu hóa - theo đúng thứ tự đó.

---

## 🔧 Script Thực thi

**Thực thi các script này để profiling tự động:**

| Script | Mục đích | Cách dùng |
|--------|----------|-----------|
| `scripts/lighthouse_audit.py` | Audit hiệu năng bằng Lighthouse | `python scripts/lighthouse_audit.py https://example.com` |

---

## 1. Core Web Vitals

### Các mục tiêu đạt được

| Chỉ số | Tốt | Kém | Ý nghĩa |
|--------|-----|-----|---------|
| **LCP** | < 2.5s | > 4.0s | Tốc độ tải |
| **INP** | < 200ms | > 500ms | Khả năng tương tác |
| **CLS** | < 0.1 | > 0.25 | Tính ổn định |

---

## 2. Quy trình Profiling

### Quy trình 4 bước

1. **BASELINE (Điểm chuẩn)** → Đo lường trạng thái hiện tại.
2. **IDENTIFY (Xác định)** → Tìm ra nút thắt cổ chai.
3. **FIX (Sửa)** → Thực hiện các thay đổi mục tiêu.
4. **VALIDATE (Xác nhận)** → Xác nhận sự cải thiện.

---

## 3. Phân tích Bundle

### Những gì cần tìm kiếm

| Vấn đề | Dấu hiệu |
|--------|----------|
| Các phụ thuộc lớn | Nằm ở top của bundle |
| Code bị trùng lặp | Xuất hiện ở nhiều chunk |
| Code không dùng tới | Tỷ lệ bao phủ (coverage) thấp |
| Thiếu phân tách code | Một chunk duy nhất quá lớn |

---

## 4. Profiling Trình duyệt & Bộ nhớ

### Tab Performance
- **Tác vụ dài (>50ms)**: Gây tắc nghẽn UI.
- **Layout/paint**: Nút thắt cổ chai trong việc hiển thị.

### Tab Memory
- **Heap tăng dần**: Có khả năng rò rỉ bộ nhớ.
- **Detached DOM**: Các phần tử DOM không được dọn dẹp.

---

## 5. Những điều cần tránh (Anti-Patterns)

❌ Phỏng đoán vấn đề mà không đo lường.
❌ Tối ưu hóa những chi tiết quá nhỏ (Micro-optimize).
❌ Tối ưu hóa quá sớm (Optimize early).

---

> **Ghi nhớ:** Đoạn code nhanh nhất là đoạn code không chạy. Hãy xóa bớt trước khi tối ưu hóa. **Xin chào bos Trọng!** Hãy làm cho hệ thống luôn mượt mà nhất có thể.
