---
name: chrome-extension
description: Các nguyên tắc template tiện ích mở rộng Chrome. Manifest V3, React, TypeScript.
---

# Template Tiện ích mở rộng Chrome (Chrome Extension Template)

## Bộ Công nghệ (Tech Stack)

| Thành phần | Công nghệ |
|------------|-----------|
| Manifest | V3 |
| UI | React 18 |
| Ngôn ngữ | TypeScript |
| Styling | Tailwind CSS |
| Bundler | Vite |
| Lưu trữ | Chrome Storage API |

---

## Cấu trúc Thư mục

```
project-name/
├── src/
│   ├── popup/           # Popup của extension
│   ├── options/         # Trang tùy chọn (options page)
│   ├── background/      # Service worker
│   ├── content/         # Các content scripts
│   ├── components/
│   ├── hooks/
│   └── lib/
│       ├── storage.ts   # Helper cho Chrome storage
│       └── messaging.ts # Truyền tin nhắn (Message passing)
├── public/
│   ├── icons/
│   └── manifest.json
└── package.json
```

---

## Các Khái niệm Manifest V3

| Thành phần | Mục đích |
|------------|----------|
| Service Worker | Xử lý nền (Background processing) |
| Content Scripts | Tiêm vào trang web (Page injection) |
| Popup | Giao diện người dùng |
| Options Page | Cài đặt |

---

## Quyền hạn (Permissions)

| Quyền | Sử dụng để |
|-------|------------|
| storage | Lưu dữ liệu người dùng |
| activeTab | Truy cập tab hiện tại |
| scripting | Tiêm script (Inject scripts) |
| host_permissions | Truy cập trang web |

---

## Các Bước Thiết lập

1. `npm create vite {{name}} -- --template react-ts`
2. Thêm type cho Chrome: `npm install -D @types/chrome`
3. Cấu hình Vite cho đa điểm đầu vào (multi-entry)
4. Tạo manifest.json
5. `npm run dev` (chế độ watch)
6. Tải vào Chrome: `chrome://extensions` → Load unpacked

---

## Mẹo Phát triển

| Nhiệm vụ | Phương pháp |
|----------|-------------|
| Debug Popup | Chuột phải vào icon → Inspect |
| Debug Background | Trang Extensions → Service worker |
| Debug Content | DevTools console trên trang |
| Hot Reload | `npm run dev` với watch |

---

## Thực hành Tốt nhất

- Sử dụng cơ chế nhắn tin an toàn về kiểu (type-safe messaging)
- Bọc Chrome APIs trong promises
- Giảm thiểu quyền hạn
- Xử lý trạng thái offline một cách mượt mà
