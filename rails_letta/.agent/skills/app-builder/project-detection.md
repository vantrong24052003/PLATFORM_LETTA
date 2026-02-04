# Phát hiện Loại Dự án (Project Type Detection)

> Phân tích yêu cầu của người dùng để xác định loại dự án và template phù hợp.

## Ma trận Từ khóa (Keyword Matrix)

| Từ khóa | Loại Dự án | Template |
|----------|--------------|----------|
| blog, bài viết, article | Blog | astro-static |
| e-commerce, thương mại điện tử, sản phẩm, giỏ hàng, thanh toán | E-commerce | nextjs-saas |
| dashboard, trang quản trị, panel, quản lý | Admin Dashboard | nextjs-fullstack |
| api, backend, dịch vụ, rest | API Service | express-api |
| python, fastapi, django | Python API | python-fastapi |
| mobile, di động, android, ios, react native | Mobile App (RN) | react-native-app |
| flutter, dart | Mobile App (Flutter) | flutter-app |
| portfolio, cá nhân, cv | Portfolio | nextjs-static |
| crm, khách hàng, bán hàng | CRM | nextjs-fullstack |
| saas, thuê bao, đăng ký, stripe | SaaS | nextjs-saas |
| landing, giới thiệu, marketing | Landing Page | nextjs-static |
| docs, tài liệu | Documentation | astro-static |
| extension, plugin, tiện ích, chrome | Browser Extension | chrome-extension |
| desktop, máy tính, electron | Desktop App | electron-desktop |
| cli, lệnh, terminal | CLI Tool | cli-tool |
| monorepo, workspace | Monorepo | monorepo-turborepo |

## Quy trình Phát hiện

```
1. Phân tách yêu cầu người dùng
2. Trích xuất từ khóa
3. Xác định loại dự án
4. Phát hiện thông tin còn thiếu → gửi đến conversation-manager
5. Đề xuất bộ công nghệ (tech stack)
```
