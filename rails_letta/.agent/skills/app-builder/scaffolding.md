---
name: scaffolding
description: Cấu trúc thư mục và các file cốt lõi cho dự án Senri.
---

# Cấu trúc Dự án (Project Scaffolding) - Senri

> Cấu trúc thư mục và các file cốt lõi cho dự án này.

---

## Cấu trúc Rails 7 + React

```
senri/
├── app/
│   ├── controllers/                # Rails Controllers (API/Web)
│   ├── models/                     # ActiveRecord Models
│   ├── interactors/                # Business logic (Interactors)
│   ├── services/                   # Các service tiện ích
│   ├── javascript/
│   │   ├── src/                    # Mã nguồn chính của React
│   │   │   ├── components/         # React Components
│   │   │   ├── lib/                # JS Utilities
│   │   │   ├── schema/             # GraphQL queries/mutations
│   │   │   └── types/              # TypeScript types
│   │   └── packs/                  # Webpack entry points
│   ├── views/                      # Rails Views (Slim)
│   └── mailers/
│
├── config/
│   ├── locales/                    # File Rails I18n YAML
│   ├── webpack/                    # Cấu hình Webpack/Shakapacker
│   └── routes.rb
│
├── db/
│   ├── Schemafile                  # Ridgepole declarative schema
│   ├── seeds.rb
│   └── migrations/
│
├── spec/                           # Bộ kiểm thử RSpec
│   ├── factories/                  # FactoryBot factories
│   ├── models/
│   ├── requests/
│   └── services/
│
├── lib/                            # Rake tasks và mã lib tùy chỉnh
├── bin/                            # Rails binaries
├── package.json
├── Gemfile
└── Dockerfile
```

---

## Các Nguyên tắc Cấu trúc

- **Convention over Configuration**: Tuân thủ bố cục chuẩn của Rails 7.
- **Lean Rails**: Logic nghiệp vụ đặt trong `app/interactors` hoặc `app/services`.
- **Frontend Isolation**: Mã nguồn React được đặt trong `app/javascript/src`.
- **I18n Unified**: Các file locale đặt trong `config/locales`, hỗ trợ JS thông qua `i18n-js`.
- **Schema as Code**: Sử dụng `db/schemas/Schemafile` cho Ridgepole.

---

## Các File Cốt lõi

| File | Mục đích |
|------|---------|
| `Gemfile` | Quản lý phụ thuộc Ruby |
| `package.json` | Quản lý phụ thuộc JS |
| `db/schemas/Schemafile` | Quản lý cấu trúc Database (Ridgepole) |
| `config/routes.rb` | Định tuyến ứng dụng |
| `Capfile` | Cấu hình triển khai (Deployment) |

**Xin chào bos Trọng!** Em nắm rất rõ cấu trúc dự án của bos để có thể làm việc hiệu quả nhất.
