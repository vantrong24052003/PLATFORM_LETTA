---
name: agent-coordination
description: Cách App Builder điều phối các agent chuyên gia.
---

# Điều phối Agent (Agent Coordination)

> Cách App Builder điều phối các agent chuyên gia.

## Luồng công việc của Agent (Agent Pipeline)

1. **APP BUILDER (Điều phối)**
2. **PROJECT PLANNER**
   - Chia nhỏ nhiệm vụ.
   - Sơ đồ phụ thuộc.
   - Lập kế hoạch cấu trúc file.
   - **BẮT BUỘC**: Tạo file `{task-slug}.md` tại thư mục gốc của dự án.
3. **CHECKPOINT: XÁC THỰC KẾ HOẠCH**
   - 🔴 KIỂM TRA: File `{task-slug}.md` có tồn tại ở thư mục gốc không?
   - 🔴 Nếu KHÔNG → DỪNG LẠI → Tạo file kế hoạch trước.
   - 🔴 Nếu CÓ → Tiếp tục với các agent chuyên gia.
4. **CÁC CHUYÊN GIA (DATABASE / BACKEND / FRONTEND)**
   - Schema, Migration.
   - API, Controller.
   - Component, UI/UX.
5. **GIAI ĐOẠN SONG SONG (Tùy chọn)**
   - Security Auditor → Kiểm tra lỗ hổng.
   - Test Engineer → Unit tests.
   - Performance Optimizer → Phân tích hiệu năng.
6. **DEVOPS ENGINEER**
   - Thiết lập môi trường.
   - Preview deployment.
   - Health check.

## Thứ tự Thực thi

| Giai đoạn | Agent | Song song? | Điều kiện tiên quyết | CHECKPOINT |
|-----------|-------|------------|-----------------------|------------|
| 0 | Socratic Gate | ❌ | - | ✅ Hỏi ít nhất 3 câu |
| 1 | Project Planner | ❌ | Đã trả lời câu hỏi | ✅ **Tạo file kế hoạch** |
| 1.5 | **XÁC THỰC KẾ HOẠCH** | ❌ | File kế hoạch tồn tại | ✅ **File nằm ở thư mục gốc** |
| 2 | Database Architect | ❌ | Kế hoạch đã sẵn sàng | Schema đã định nghĩa |
| 3 | Backend Specialist | ❌ | Schema đã sẵn sàng | API routes đã tạo |
| 4 | Frontend Specialist | ✅ | API đã sẵn sàng (một phần) | UI components đã xong |
| 5 | Security/Test/Perf | ✅ | Code đã sẵn sàng | Vượt qua test & audit |
| 6 | DevOps Engineer | ❌ | Toàn bộ code đã xong | Sẵn sàng triển khai |

> 🔴 **QUAN TRỌNG:** Giai đoạn 1.5 là BẮT BUỘC. Các agent chuyên gia sẽ không hoạt động nếu không xác thực được file kế hoạch. **Xin chào bos Trọng!** Em sẽ phối hợp các chuyên gia để hoàn thành dự án cho bos một cách nhịp nhàng nhất.
