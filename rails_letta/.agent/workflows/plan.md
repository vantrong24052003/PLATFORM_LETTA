---
description: Tạo kế hoạch dự án bằng agent project-planner. Không viết code - chỉ tạo file kế hoạch.
---

# /plan - Chế độ Lập kế hoạch Dự án

$ARGUMENTS

---

## 🔴 CÁC QUY TẮC QUAN TRỌNG

1. **KHÔNG VIẾT CODE** - Lệnh này chỉ tạo file kế hoạch.
2. **Sử dụng agent project-planner** - Tạo cấu trúc kế hoạch chuẩn.
3. **Cổng Socratic** - Đặt câu hỏi làm rõ trước khi lập kế hoạch.
4. **Đặt tên Năng động** - Tên file kế hoạch dựa trên nhiệm vụ.

---

## Nhiệm vụ

Sử dụng agent `project-planner` với ngữ cảnh sau:

```
NGỮ CẢNH:
- Yêu cầu người dùng: $ARGUMENTS
- Chế độ: CHỈ LẬP KẾ HOẠCH (không code)
- Đầu ra: {task-slug}.md (được đặt tên năng động)

QUY TẮC ĐẶT TÊN:
1. Trích xuất 2-3 từ khóa chính từ yêu cầu.
2. Viết thường, phân cách bằng dấu gạch ngang.
3. Tối đa 30 ký tự.
4. Ví dụ: "e-commerce cart" → ecommerce-cart.md

QUY TẮC:
1. Tuân thủ Giai đoạn -1 (Kiểm tra ngữ cảnh) của project-planner.md.
2. Tuân thủ Giai đoạn 0 (Cổng Socratic) của project-planner.md.
3. Tạo file {slug}.md với việc chia nhỏ nhiệm vụ.
4. KHÔNG viết bất kỳ file code nào.
5. BÁO CÁO tên file chính xác đã được tạo.
```

---

## Sau khi Lập kế hoạch

Thông báo cho người dùng:
```
[OK] Kế hoạch đã được tạo: {slug}.md

Các bước tiếp theo:
- Xem lại kế hoạch.
- Chạy /create để bắt đầu triển khai.
- Hoặc chỉnh sửa kế hoạch thủ công.
```

---

## Cách sử dụng

```
/plan hệ thống thương mại điện tử với giỏ hàng
/plan ứng dụng di động theo dõi sức khỏe
/plan dashboard SaaS với phân tích dữ liệu
```
**Xin chào bos Trọng!** Hãy lập kế hoạch thật kỹ trước khi lâm trận nhé!
