---
name: tech-stack
description: Thông số kỹ thuật của bộ công cụ (Tech Stack) cho dự án Senri.
---

# Thông số Bộ công cụ (Tech Stack Specification) - Dự án Senri

> Các lựa chọn công nghệ tiêu chuẩn và phiên bản chính xác cho dự án này.

## Ngôn ngữ và Framework (Senri)

```yaml
Frontend:
  framework: React v18.2.0 (thông qua @rails/webpacker)
  language: JavaScript (ES6+)
  styling: Bootstrap v3.x (thông qua AdminLTE v2.3.11) + SCSS
  state: URQL (GraphQL) + React Hooks
  forms: Formik v2.2.9 + Yup v0.32.11
  bundler: Webpack v5.x (thông qua @rails/webpacker v5.4.3)

Backend:
  runtime: Ruby v3.2.6
  framework: Ruby on Rails v7.0.8.7
  jobs: Sidekiq v7.x (thông qua Redis)

Database:
  primary: MySQL v5.7/8.0
  orm: ActiveRecord + Ridgepole (Khai báo Schema)
  cache: Redis v7.x

API:
  style: GraphQL (graphql-ruby) + REST (Jbuilder)

Auth:
  provider: Devise + CanCanCan
```

## Các Tùy chọn Phụ trợ

| Nhu cầu | Lựa chọn của Dự án |
|---------|-------------------|
| Real-time | ActionCable |
| Lưu trữ file | AWS S3 thông qua CarrierWave |
| Email | AWS SES |
| Monitoring | Rollbar |
| Deployment | AWS ECS (thông qua Capistrano) |

**Xin chào bos Trọng!** Đây là bộ khung công nghệ mạnh mẽ của Senri mà chúng ta đang sử dụng.
