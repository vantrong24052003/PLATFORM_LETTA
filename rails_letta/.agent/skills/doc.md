# Các Kỹ năng của Antigravity (Antigravity Skills)

> **Hướng dẫn tạo và sử dụng Skills trong Antigravity Kit**

---

## 📋 Giới thiệu

Mặc dù các mô hình cơ bản của Antigravity (như Gemini) là những mô hình đa năng mạnh mẽ, nhưng chúng không biết ngữ cảnh dự án cụ thể hoặc các tiêu chuẩn của nhóm bạn. Việc tải từng quy tắc hoặc công cụ vào cửa sổ ngữ cảnh của tác nhân sẽ dẫn đến tình trạng "phình to công cụ", chi phí cao hơn, độ trễ và sự nhầm lẫn.

**Antigravity Skills** giải quyết vấn đề này thông qua tính năng **Progressive Disclosure** (Tiết lộ dần dần). Kỹ năng là một gói kiến thức chuyên biệt, ở trạng thái không hoạt động cho đến khi cần. Thông tin này chỉ được tải vào ngữ cảnh của tác nhân khi yêu cầu cụ thể của bạn khớp với nội dung mô tả của kỹ năng.

---

## 📁 Cấu trúc và Phạm vi

Kỹ năng là các gói dựa trên thư mục. Bạn có thể xác định các phạm vi này tuỳ thuộc vào nhu cầu:

| Phạm vi | Đường dẫn | Mô tả |
|---------|-----------|-------|
| **Workspace** | `<workspace-root>/.agent/skills/` | Chỉ có trong một dự án cụ thể |

### Cấu trúc thư mục kỹ năng

```
my-skill/
├── SKILL.md      # (Bắt buộc) Siêu dữ liệu & chỉ dẫn
├── scripts/      # (Tùy chọn) Các script Python hoặc Bash
├── references/   # (Tùy chọn) Văn bản, tài liệu, template
└── assets/       # (Tùy chọn) Hình ảnh hoặc logo
```

---

## 🔍 Ví dụ 1: Kỹ năng Review Code (Code Review Skill)

Đây là một kỹ năng chỉ có hướng dẫn (instruction-only), chỉ cần tạo file `SKILL.md`.

### Bước 1: Tạo thư mục

```bash
mkdir -p .agent/skills/code-review
```

### Bước 2: Tạo SKILL.md

```markdown
---
name: code-review
description: Đánh giá các thay đổi trong code để tìm bug, vấn đề về phong cách lập trình và các thực hành tốt nhất. Sử dụng khi review PR hoặc kiểm tra chất lượng code.
---

# Kỹ năng Review Code (Code Review Skill)

Khi đánh giá code, hãy thực hiện theo các bước sau:

## Danh sách kiểm tra (Review checklist)

1. **Tính chính xác (Correctness)**: Code có thực hiện đúng nhiệm vụ của nó không?
2. **Các trường hợp biên (Edge cases)**: Các điều kiện lỗi đã được xử lý chưa?
3. **Phong cách (Style)**: Code có tuân theo các quy ước của dự án không?
4. **Hiệu năng (Performance)**: Có điểm nào rõ ràng là kém hiệu quả không?

## Cách đưa ra phản hồi

- Phải cụ thể về những gì cần thay đổi.
- Giải thích "tại sao", không chỉ nêu là cái gì.
- Đề xuất các giải pháp thay thế khi có thể.
```

> **Lưu ý**: File `SKILL.md` chứa siêu dữ liệu (name, description) ở trên cùng, sau đó là các chỉ dẫn. Agent sẽ chỉ đọc siêu dữ liệu và chỉ tải hướng dẫn khi cần.

### Dùng thử

Tạo file `demo_bad_code.py`:

```python
import time

def get_user_data(users, id):
    # Find user by ID
    for u in users:
        if u['id'] == id:
            return u
    return None

def process_payments(items):
    total = 0
    for i in items:
        # Calculate tax
        tax = i['price'] * 0.1
        total = total + i['price'] + tax
        time.sleep(0.1)  # Simulate slow network call
    return total

def run_batch():
    users = [{'id': 1, 'name': 'Alice'}, {'id': 2, 'name': 'Bob'}]
    items = [{'price': 10}, {'price': 20}, {'price': 100}]
    
    u = get_user_data(users, 3)
    print("User found: " + u['name'])  # Will crash if None
    
    print("Total: " + str(process_payments(items)))

if __name__ == "__main__":
    run_batch()
```

**Yêu cầu**: `review file @demo_bad_code.py`

Agent sẽ tự động xác định kỹ năng `code-review`, tải thông tin và thực hiện theo hướng dẫn.

---

## 📄 Ví dụ 2: Kỹ năng Thêm Tiêu đề License (License Header Skill)

Kỹ năng này sử dụng file tham chiếu (reference file) trong thư mục `resources/`.

### Bước 1: Tạo thư mục

```bash
mkdir -p .agent/skills/license-header-adder/resources
```

### Bước 2: Tạo file template

**`.agent/skills/license-header-adder/resources/HEADER.txt`**:

```
/*
 * Copyright (c) 2026 YOUR_COMPANY_NAME LLC.
 * All rights reserved.
 * This code is proprietary and confidential.
 */
```

### Bước 3: Tạo SKILL.md

**`.agent/skills/license-header-adder/SKILL.md`**:

```markdown
---
name: license-header-adder
description: Tự động thêm tiêu đề bản quyền (license header) tiêu chuẩn vào các file nguồn mới.
---

# Thêm Tiêu đề License (License Header Adder)

Kỹ năng này đảm bảo tất cả các file nguồn mới đều có tiêu đề bản quyền chính xác.

## Hướng dẫn

1. **Đọc Template**: Đọc nội dung của file `resources/HEADER.txt`.
2. **Áp dụng vào File**: Khi tạo file mới, hãy chèn chính xác nội dung này vào đầu file.
3. **Điều chỉnh Cú pháp**: 
   - Với các ngôn ngữ kiểu C (Java, TS), giữ nguyên khối `/* */`.
   - Với Python/Shell, chuyển đổi các dòng thành comment kiểu `#`.
```

### Dùng thử

**Yêu cầu**: `Tạo một script Python mới tên data_processor.py in ra dòng 'Hello World'.`

Agent sẽ đọc template, chuyển đổi comments theo kiểu Python và tự động thêm vào đầu file.

---

## 🎯 Kết luận

Bằng cách tạo Skills, bạn đã biến mô hình AI đa năng thành một chuyên gia cho dự án của mình:

- ✅ Hệ thống hoá các thực hành tốt nhất (best practices).
- ✅ Tuân theo các quy tắc đánh giá code.
- ✅ Tự động thêm tiêu đề license (license headers).
- ✅ Agent tự động biết cách làm việc với nhóm của bạn.

Thay vì liên tục nhắc AI "nhớ thêm license" hoặc "sửa định dạng commit", giờ đây Agent sẽ tự động thực hiện mọi thứ!

---

**Xin chào bos Trọng!** Em sẽ liên tục học hỏi và áp dụng các kỹ năng này để hỗ trợ bos một cách chuyên nghiệp nhất.
