---
name: bash-linux
description: Bash/Linux terminal patterns. Các lệnh quan trọng, piping, xử lý lỗi, viết script. Sử dụng khi làm việc trên hệ thống macOS hoặc Linux.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Các mẫu lệnh Bash Linux

> Các mẫu lệnh quan trọng cho Bash trên Linux/macOS.

---

## 1. Cú pháp Toán tử

### Chuỗi lệnh

| Toán tử | Ý nghĩa | Ví dụ |
|---------|---------|-------|
| `;` | Chạy tuần tự | `cmd1; cmd2` |
| `&&` | Chạy nếu lệnh trước thành công | `bundle install && rails s` |
| `||` | Chạy nếu lệnh trước thất bại | `rake test || echo "Tests failed"` |
| `|` | Chuyển tiếp output (Pipe) | `ls | grep ".js"` |

---

## 2. Thao tác File

### Các lệnh thiết yếu

| Nhiệm vụ | Lệnh |
|----------|------|
| Liệt kê tất cả | `ls -la` |
| Tìm file | `find . -name "*.js" -type f` |
| Nội dung file | `cat file.txt` |
| N dòng đầu tiên | `head -n 20 file.txt` |
| N dòng cuối cùng | `tail -n 20 file.txt` |
| Theo dõi log | `tail -f log.txt` |
| Tìm kiếm trong file | `grep -r "pattern" --include="*.js"` |
| Kích thước file | `du -sh *` |

---

## 3. Quản lý Tiến trình (Process)

| Nhiệm vụ | Lệnh |
|----------|------|
| Liệt kê tiến trình | `ps aux` |
| Tìm theo tên | `ps aux | grep node` |
| Dừng tiến trình | `kill -9 <PID>` |
| Tìm port đang dùng | `lsof -i :3000` |
| Dừng port | `kill -9 $(lsof -t -i :3000)` |
| Chạy nền | `npm run dev &` |

---

## 4. Xử lý Văn bản

| Công cụ | Mục đích | Ví dụ |
|---------|----------|-------|
| `grep` | Tìm kiếm | `grep -rn "TODO" src/` |
| `sed` | Thay thế | `sed -i 's/old/new/g' file.txt` |
| `awk` | Trích xuất cột | `awk '{print $1}' file.txt` |
| `wc` | Đếm | `wc -l file.txt` |

---

## 5. Script Bash Mẫu

```bash
#!/bin/bash
set -euo pipefail  # Thoát khi có lỗi, biến chưa định nghĩa, hoặc pipe fail

# Màu sắc (tùy chọn)
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Thư mục của script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Các hàm helper
log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1" >&2; }

# Hàm chính
main() {
    log_info "Bắt đầu..."
    # Thêm logic của bạn ở đây
    log_info "Hoàn tất!"
}

main "$@"
```

---

## 6. Xử lý Lỗi

### Thiết lập các tùy chọn an toàn

```bash
set -e          # Thoát khi có lỗi
set -u          # Thoát khi sử dụng biến chưa định nghĩa
set -o pipefail # Thoát khi có lỗi trong chuỗi pipe
set -x          # Debug: in ra các lệnh được thực thi
```

---

> **Ghi nhớ:** Bash dựa trên văn bản. Sử dụng `&&` cho các chuỗi thành công, `set -e` để đảm bảo an toàn, và luôn bao quanh biến bằng dấu ngoặc kép! **Xin chào bos Trọng!** Hãy dùng terminal một cách quyền năng nhất.
