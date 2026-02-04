---
name: lint-and-validate
description: Các quy trình kiểm soát chất lượng tự động, linting và phân tích tĩnh. Sử dụng sau mỗi lần sửa đổi code để đảm bảo đúng cú pháp và tiêu chuẩn dự án. Kích hoạt khi có từ khóa: lint, format, check, validate, types, static analysis.
allowed-tools: Read, Glob, Grep, Bash
---

# Kỹ năng Lint và Kiểm tra (Validate)

> **BẮT BUỘC:** Chạy các công cụ xác thực phù hợp sau MỖI lần thay đổi code. Không kết thúc nhiệm vụ cho đến khi code không còn lỗi.

#### Ruby on Rails (Bên trong Docker)
1. **Lint/Sửa (Fix):** `docker exec -it senri-web-1 bundle exec rubocop -A <path>`
2. **Schema:** `docker exec -it senri-web-1 bundle exec ridgepole -c config/database.yml --apply -f db/schemas/Schemafile --dry-run`

#### React / JavaScript (Bên trong Docker)
1. **Format:** `docker exec -it senri-web-1 yarn prettier --check app/javascript/src`

---

## Vòng lặp Chất lượng
1. **Viết/Sửa Code**
2. **Chạy Audit:** Đối với backend, sử dụng `rubocop`. Đối với frontend, sử dụng `lint` (ESLint).
3. **Phân tích Báo cáo:** Sửa các lỗi nghiêm trọng (blockers) trước.
4. **Sửa & Lặp lại:** KHÔNG ĐƯỢC PHÉP báo cáo hoàn thành khi code vẫn còn lỗi kiểm tra.

## Xử lý lỗi
- Nếu `rubocop` thất bại: Sửa các vấn đề về style hoặc độ phức tạp.
- Nếu `ridgepole` thất bại: Kiểm tra cú pháp trong file `db/schemas/Schemafile`.

---
**Quy tắc Nghiêm ngặt:** Không có code nào được coi là "xong" mà không vượt qua các kiểm tra này.
**Xin chào bos Trọng!** Hãy luôn ghi nhớ điều này.
