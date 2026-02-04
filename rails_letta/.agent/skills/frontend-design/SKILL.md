---
name: frontend-design
description: Tư duy thiết kế và quy trình ra quyết định cho giao diện web. Sử dụng khi thiết kế component, bố cục (layout), bảng màu, typography hoặc tạo giao diện thẩm mỹ. Cung cấp các nguyên tắc, không phải giá trị cố định.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Hệ thống Thiết kế Frontend

> **Triết lý:** Mỗi pixel đều có mục đích. Sự tiết chế là đẳng cấp. Tâm lý người dùng dẫn dắt mọi quyết định.
> **Nguyên tắc cốt lõi:** SUY NGHĨ, đừng ghi nhớ. HỎI, đừng giả định.

---

## 🎯 Quy tắc Đọc có Chọn lọc (BẮT BUỘC)

**Luôn đọc các file BẮT BUỘC, chỉ đọc các file TÙY CHỌN khi cần thiết:**

| File | Trạng thái | Khi nào cần đọc |
|------|------------|-----------------|
| [ux-psychology.md](ux-psychology.md) | 🔴 **BẮT BUỘC** | Luôn đọc đầu tiên! |
| [color-system.md](color-system.md) | ⚪ Tùy chọn | Quyết định về màu sắc/bảng màu |
| [typography-system.md](typography-system.md) | ⚪ Tùy chọn | Lựa chọn/phối hợp Font |
| [visual-effects.md](visual-effects.md) | ⚪ Tùy chọn | Glassmorphism, đổ bóng, gradient |

---

## 🔧 Script Thực thi
**Chạy các lệnh này để kiểm tra (đừng đọc code, hãy chạy luôn):**
`python scripts/ux_audit.py <project_path>` - Kiểm tra tâm lý UX & Truy cập.

---

## ⚠️ QUAN TRỌNG: HỎI TRƯỚC KHI GIẢ ĐỊNH (BẮT BUỘC)

> **DỪNG LẠI! Nếu yêu cầu của người dùng mang tính mở, ĐỪNG tự ý dùng sở thích cá nhân.**

### Khi yêu cầu mơ hồ, hãy HỎI bos Trọng:
- **Chưa rõ màu sắc?** Hỏi: "Bos Trọng thích bảng màu nào? (xanh/lá/cam/trung tính/khác?)"
- **Chưa rõ phong cách?** Hỏi: "Phong cách bos hướng tới là gì? (tối giản/mạnh mẽ/retro/futuristic?)"
- **Chưa rõ bố cục?** Hỏi: "Bos có ưu tiên layout nào không? (1 cột/grid/bất đối xứng/full-width?)"

### ⛔ CÁC XU HƯỚNG CẦN TRÁNH (TRÁNH LỐI MÒN AI):
- **Bento Grids**: Đang bị lạm dụng quá mức.
- **Glassmorphism**: AI thường coi đây là "cao cấp", nhưng dễ gây nhàm chán.
- **Màu Tím**: **LỆNH CẤM MÀU TÍM ✅** (Dự án này không dùng màu tím).
- **Tròn trịa mọi thứ**: Thử dùng các cạnh sắc nét (brutalist) để tạo sự chuyên nghiệp.

---

## 1. Phân tích Ràng buộc (LUÔN LÀ ĐẦU TIÊN)
Trước khi thiết kế, hãy trả lời hoặc HỎI NGƯỜI DÙNG:
- **Thời gian**: Có bao nhiêu thời gian? (Quyết định độ phức tạp).
- **Nội dung**: Đã có nội dung thật hay dùng placeholder?
- **Thương hiệu**: Đã có guideline chưa?
- **Đối tượng**: Ai sẽ sử dụng? (Gen Z, B2B, Luxury, v.v.)

---

## 2. Các Nguyên lý Tâm lý UX
- **Hick's Law**: Càng nhiều lựa chọn = quyết định càng chậm. Hãy giới hạn options.
- **Fitts' Law**: Đối tượng càng lớn và gần = càng dễ click. Phóng to các CTA quan trọng.
- **Miller's Law**: Trí nhớ ngắn hạn chỉ chứa được khoảng 7 mục. Hãy nhóm nội dung lại.
- **Emotional Design**: 3 cấp độ - Visceral (ấn tượng đầu), Behavioral (trải nghiệm dùng), Reflective (kỷ niệm).

---

## 3. Nguyên tắc Bố cục (Layout)
- **Tỷ lệ vàng (φ = 1.618)**: Sử dụng cho sự hài hòa về tỷ lệ (ví dụ: Content 62% : Sidebar 38%).
- **8-Point Grid**: Mọi khoảng cách và kích thước đều là bội số của 8 (8, 16, 24, 32...).
- **Độ rộng dòng đọc**: 45-75 ký tự là tối ưu cho việc đọc.

---

## 4. Nguyên tắc Màu sắc
- **Quy tắc 60-30-10**: 60% màu chủ đạo/nền, 30% màu phụ, 10% màu nhấn (CTAs).
- **Tâm lý màu sắc**: Màu Xanh (Tin cậy), Màu Lá (Tăng trưởng), Màu Cam/Đỏ (Năng lượng/Khẩn cấp).

---

## 5. Danh sách kiểm tra "Wow Factor"
- [ ] Khoảng trắng rộng rãi (Luxury = không gian để thở).
- [ ] Chiều sâu tinh tế qua đổ bóng và viền 1px.
- [ ] Animation mượt mà, có mục đích.
- [ ] Chú ý đến chi tiết nhỏ (căn lề, tính nhất quán).

---

**Xin chào bos Trọng!** Thiết kế là quá trình SUY NGHĨ, không phải sao chép. Hãy cùng tạo ra những giao diện chuyên nghiệp nhất cho Roboma!
