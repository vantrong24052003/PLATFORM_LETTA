---
name: rails-best-practices
description: Các nguyên tắc cốt lõi để phát triển Ruby on Rails chất lượng cao, có khả năng mở rộng. Tập trung vào Lean Models/Controllers, Service Objects, Ridgepole, Sidekiq và RSpec testing.
---

# Rails Best Practices (Tiếng Việt)

## 1. Kiến trúc & Vị trí đặt Logic

### Lean Styles
- **Skinny Controllers**: Chỉ xử lý session, parameters (Strong Params), và render/redirect.
- **Lean Models**: Chỉ xử lý associations, validations, và các scope đơn giản.
- **Service Objects**: Sử dụng cho logic nghiệp vụ liên quan đến nhiều model hoặc quy trình phức tạp.
- **Interactors**: Thay thế cho Service Objects đặc biệt cho các hoạt động theo từng bước (sử dụng `interactor-rails`).

### Decorators & Serializers
- **Draper**: Sử dụng cho logic liên quan đến view (định dạng phức tạp, HTML có điều kiện).
- **ActiveModelSerializers**: Sử dụng cho JSON API responses để tách biệt cấu trúc JSON khỏi logic của model.

## 2. Database & ActiveRecord

### Tối ưu hóa truy vấn (Query Optimization)
- **Tránh N+1**: Luôn sử dụng `.includes`, `.preload`, hoặc `.eager_load`.
- **Bulk Operations**: Sử dụng `activerecord-import` để chèn dữ liệu hàng loạt.
- **Counter Caches**: Sử dụng để tăng hiệu suất khi hiển thị số lượng association.

### Quản lý Schema
- **Ridgepole**: Sử dụng quản lý schema kiểu khai báo. Cập nhật `Schemafile` thay vì tạo nhiều migration nhỏ.
- **Chạy trong Docker**: `docker exec -it senri-web-1 bundle exec ridgepole ...`

## 3. Xử lý nền (Background Processing - Sidekiq)

- **Idempotence**: Các job phải an toàn khi chạy lại (retry).
- **Small Arguments**: Chỉ truyền ID, không truyền object đầy đủ (tránh dữ liệu cũ và làm đầy Redis).
- **Error Handling**: Sử dụng cơ chế retry của Sidekiq; không nuốt (swallow) ngoại lệ.
- **Throttling**: Sử dụng `sidekiq-throttled` cho các giới hạn API bên ngoài.

## 4. Kiểm thử (Testing - RSpec)

- **Request Specs**: Ưu tiên hơn Controller specs để kiểm thử integration và các API endpoint.
- **System Specs**: Sử dụng cho các luồng người dùng quan trọng (Capybara).
- **Factories**: Sử dụng `factory_bot_rails`. Tránh `attributes_for` khi có thể; sử dụng `build` hoặc `create`.
- **Mocking**: Sử dụng `vcr` hoặc `webmock` cho các yêu cầu HTTP bên ngoài.

## 5. Bảo mật (Security)

- **Strong Parameters**: Luôn whitelist các thuộc tính.
- **Phân quyền (Authorization)**: Sử dụng CanCanCan `load_and_authorize_resource` và `ability.rb`.
- **XSS/Injection**: Tin tưởng vào mặc định của Rails nhưng cẩn thận với `html_safe` và `raw`.

## 6. Đa ngôn ngữ (Internationalization - I18n)

- **Không dùng Hardcoded Strings**: Tất cả văn bản hiển thị cho người dùng phải nằm trong `config/locales/`.
- **JS I18n**: Sử dụng `i18n-js` cho các chuỗi cần thiết trong React.
