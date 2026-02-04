---
name: cli-tool
description: Các nguyên tắc template công cụ CLI Node.js. Commander.js, interactive prompts.
---

# Template Công cụ CLI (CLI Tool Template)

## Bộ Công nghệ (Tech Stack)

| Thành phần | Công nghệ |
|------------|-----------|
| Runtime | Node.js 20+ |
| Ngôn ngữ | TypeScript |
| CLI Framework | Commander.js |
| Nhập liệu (Prompts) | Inquirer.js |
| Đầu ra (Output) | chalk + ora |
| Cấu hình | cosmiconfig |

---

## Cấu trúc Thư mục

```
project-name/
├── src/
│   ├── index.ts         # Điểm vào (Entry point)
│   ├── cli.ts           # Thiết lập CLI
│   ├── commands/        # Các trình xử lý lệnh (Command handlers)
│   ├── lib/
│   │   ├── config.ts    # Trình tải cấu hình
│   │   └── logger.ts    # Định dạng đầu ra
│   └── types/
├── bin/
│   └── cli.js           # File thực thi
└── package.json
```

---

## Nguyên tắc Thiết kế CLI

| Nguyên tắc | Mô tả |
|------------|-------|
| Subcommands | Nhóm các hành động liên quan |
| Options | Các cờ (Flags) với giá trị mặc định |
| Tương tác (Interactive) | Hiện prompt khi cần thiết |
| Phi tương tác (Non-interactive) | Hỗ trợ cờ --yes |

---

## Các Thành phần Chính

| Thành phần | Mục đích |
|------------|----------|
| Commander | Phân tích cú pháp lệnh |
| Inquirer | Các prompt tương tác |
| Chalk | Đầu ra có màu sắc |
| Ora | Vòng xoay chờ/tải (Spinners) |
| Cosmiconfig | Tự động tìm file cấu hình |

---

## Các Bước Thiết lập

1. Tạo thư mục dự án
2. `npm init -y`
3. Cài đặt các phụ thuộc: `npm install commander @inquirer/prompts chalk ora cosmiconfig`
4. Cấu hình bin trong package.json
5. `npm link` để kiểm thử cục bộ

---

## Xuất bản (Publishing)

```bash
npm login
npm publish
```

---

## Thực hành Tốt nhất

- Cung cấp thông báo lỗi hữu ích
- Hỗ trợ cả chế độ tương tác và phi tương tác
- Sử dụng style đầu ra nhất quán
- Xác thực đầu vào với Zod
- Thoát với mã lỗi phù hợp (0 thành công, 1 lỗi)
