---
name: templates
description: Các template khởi tạo dự án cho ứng dụng mới. Sử dụng khi tạo dự án mới từ đầu. Bao gồm 12 template cho các bộ công nghệ (tech stacks) khác nhau.
allowed-tools: Read, Glob, Grep
---

# Các Template Dự án (Project Templates)

> Các template khởi động nhanh để tạo cấu trúc cho dự án mới.

---

## 🎯 Quy tắc Đọc có Chọn lọc

**Chỉ đọc bản template khớp với loại dự án của người dùng!**

| Template | Bộ công nghệ | Khi nào nên dùng |
|----------|------------|-------------|
| [nextjs-fullstack](nextjs-fullstack/TEMPLATE.md) | Next.js + Prisma | Ứng dụng web full-stack |
| [nextjs-saas](nextjs-saas/TEMPLATE.md) | Next.js + Stripe | Sản phẩm SaaS |
| [nextjs-static](nextjs-static/TEMPLATE.md) | Next.js + Framer | Trang Landing page |
| [express-api](express-api/TEMPLATE.md) | Express + JWT | REST API |
| [python-fastapi](python-fastapi/TEMPLATE.md) | FastAPI | Python API |
| [react-native-app](react-native-app/TEMPLATE.md) | Expo + Zustand | Ứng dụng di động |
| [flutter-app](flutter-app/TEMPLATE.md) | Flutter + Riverpod | Đa nền tảng |
| [electron-desktop](electron-desktop/TEMPLATE.md) | Electron + React | Ứng dụng máy tính |
| [chrome-extension](chrome-extension/TEMPLATE.md) | Chrome MV3 | Tiện ích trình duyệt |
| [cli-tool](cli-tool/TEMPLATE.md) | Node.js + Commander | Ứng dụng CLI |
| [monorepo-turborepo](monorepo-turborepo/TEMPLATE.md) | Turborepo + pnpm | Monorepo |
| [astro-static](astro-static/TEMPLATE.md) | Astro + MDX | Blog / Tài liệu |

---

## Cách sử dụng

1. Người dùng nói "tạo ứng dụng [loại]"
2. Khớp với template phù hợp.
3. CHỈ đọc file `TEMPLATE.md` của template đó.
4. Tuân thủ bộ công nghệ và cấu trúc của nó.
