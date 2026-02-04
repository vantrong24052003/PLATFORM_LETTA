---
name: app-builder
description: Điều phối chính việc xây dựng ứng dụng. Tạo các ứng dụng full-stack từ yêu cầu ngôn ngữ tự nhiên. Xác định loại dự án, chọn tech stack, điều phối các agent.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Agent
---

# App Builder - Điều phối Xây dựng Ứng dụng

> Phân tích yêu cầu của người dùng, xác định tech stack, lập kế hoạch cấu trúc và điều phối các agent.

---

## 🎯 Quy tắc Đọc có Chọn lọc

**Chỉ đọc các file liên quan đến yêu cầu!** Kiểm tra bản đồ nội dung để tìm những gì bạn cần.

| File | Mô tả | Khi nào cần đọc |
|------|-------|-----------------|
| `project-detection.md` | Ma trận từ khóa, phát hiện loại dự án | Khi bắt đầu dự án mới |
| `tech-stack.md` | Stack mặc định 2026, các lựa chọn thay thế | Khi chọn công nghệ |
| `agent-coordination.md` | Luồng agent, thứ tự thực thi | Điều phối công việc đa agent |
| `scaffolding.md` | Cấu trúc thư mục, các file cốt lõi | Tạo cấu trúc dự án |
| `feature-building.md` | Phân tích tính năng, xử lý lỗi | Thêm tính năng vào dự án hiện có |

---

## 📦 Các mẫu Template (13)

Khởi tạo cấu trúc nhanh cho dự án mới. **Chỉ đọc template phù hợp nhất!**

| Template | Tech Stack | Khi nào dùng |
|----------|------------|--------------|
| [nextjs-fullstack](templates/nextjs-fullstack/TEMPLATE.md) | Next.js + Prisma | App web full-stack |
| [nextjs-saas](templates/nextjs-saas/TEMPLATE.md) | Next.js + Stripe | Sản phẩm SaaS |
| [nextjs-static](templates/nextjs-static/TEMPLATE.md) | Next.js + Framer | Trang Landing page |
| [nuxt-app](templates/nuxt-app/TEMPLATE.md) | Nuxt 3 + Pinia | App Vue full-stack |
| [express-api](templates/express-api/TEMPLATE.md) | Express + JWT | REST API |
| [python-fastapi](templates/python-fastapi/TEMPLATE.md) | FastAPI | Python API |
| [react-native-app](templates/react-native-app/TEMPLATE.md) | Expo + Zustand | App di động |
| [flutter-app](templates/flutter-app/TEMPLATE.md) | Flutter + Riverpod | App di động đa nền tảng |
| [electron-desktop](templates/electron-desktop/TEMPLATE.md) | Electron + React | App máy tính (Desktop) |
| [chrome-extension](templates/chrome-extension/TEMPLATE.md) | Chrome MV3 | Tiện ích trình duyệt |
| [cli-tool](templates/cli-tool/TEMPLATE.md) | Node.js + Commander | Ứng dụng CLI |

---

## 🔗 Các Agent Liên quan

| Agent | Vai trò |
|-------|---------|
| `project-planner` | Chia nhỏ nhiệm vụ, sơ đồ phụ thuộc |
| `frontend-specialist` | UI components, trang web |
| `backend-specialist` | API, logic nghiệp vụ |
| `database-architect` | Schema, migrations |
| `devops-engineer` | Triển khai, xem trước (preview) |

---

## Ví dụ Sử dụng

```
User: "Tạo một bản sao Instagram có tính năng chia sẻ ảnh và like"

Quy trình của App Builder:
1. Loại dự án: Social Media App
2. Tech stack: Next.js + Prisma + Cloudinary + Clerk
3. Lập kế hoạch:
   ├─ Database schema (users, posts, likes, follows)
   ├─ API routes (12 endpoints)
   ├─ Pages (feed, profile, upload)
   └─ Components (PostCard, Feed, LikeButton)
4. Điều phối các agent
5. Báo cáo tiến độ
6. Chạy preview
```

**Xin chào bos Trọng!** Hãy để tôi giúp bos xây dựng những ứng dụng tuyệt vời nhất.
