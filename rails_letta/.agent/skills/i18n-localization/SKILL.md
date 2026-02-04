---
name: i18n-localization
description: Các mẫu quốc tế hóa (i18n) và địa phương hóa (L10n). Phát hiện các chuỗi bị hardcode, quản lý bản dịch, file locale, hỗ trợ ngôn ngữ viết từ phải sang trái (RTL).
allowed-tools: Read, Glob, Grep
---

# Quốc tế hóa & Địa phương hóa (i18n & Localization)

> Các thực hành tốt nhất cho Quốc tế hóa (i18n) và Địa phương hóa (L10n).

---

## 1. Các Khái niệm Cơ bản

| Thuật ngữ | Ý nghĩa |
|------|---------|
| **i18n** | Internationalization - làm cho ứng dụng có thể dịch được |
| **L10n** | Localization - việc thực hiện các bản dịch thực tế |
| **Locale** | Ngôn ngữ + Vùng (en-US, vi-VN, tr-TR) |
| **RTL** | Các ngôn ngữ viết từ phải sang trái (Tiếng Ả Rập, Tiếng Do Thái) |

---

## 2. Khi nào nên dùng i18n

| Loại dự án | Có cần i18n không? |
|--------------|--------------|
| Ứng dụng web công cộng | ✅ Có |
| Sản phẩm SaaS | ✅ Có |
| Công cụ nội bộ | ⚠️ Có thể |
| Ứng dụng cho một vùng | ⚠️ Cân nhắc cho tương lai |
| Dự án cá nhân | ❌ Tùy chọn |

---

## 3. Các Mẫu Triển khai

### React (react-i18next)

```tsx
import { useTranslation } from 'react-i18next';

function Welcome() {
  const { t } = useTranslation();
  return <h1>{t('welcome.title')}</h1>;
}
```

### Next.js (next-intl)

```tsx
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('Home');
  return <h1>{t('title')}</h1>;
}
```

### Python (gettext)

```python
from gettext import gettext as _

print(_("Welcome to our app"))
```

---

## 4. Cấu trúc Thư mục

```
locales/
├── vi/          # Tiếng Việt
│   ├── common.json
│   ├── auth.json
│   └── errors.json
├── en/          # Tiếng Anh
│   ├── common.json
│   ├── auth.json
│   └── errors.json
└── ar/          # RTL
    └── ...
```

---

## 5. Các Thực hành Tốt nhất

### NÊN LÀM ✅

- Sử dụng các mã khóa dịch (translation keys), không dùng văn bản thô.
- Phân tách bản dịch theo không gian tên (namespace) dựa trên tính năng.
- Hỗ trợ chia số nhiều (pluralization).
- Xử lý định dạng ngày tháng/con số theo từng locale.
- Lập kế hoạch hỗ trợ RTL ngay từ đầu.
- Sử dụng định dạng tin nhắn ICU cho các chuỗi phức tạp.

### TUYỆT ĐỐI KHÔNG ❌

- Hardcode các chuỗi văn bản trực tiếp trong component.
- Ghép các chuỗi đã dịch lại với nhau (có thể sai ngữ pháp).
- Giả định độ dài của văn bản (Ví dụ: Tiếng Đức thường dài hơn 30%).
- Quên mất bố cục RTL.
- Trộn lẫn nhiều ngôn ngữ trong cùng một file.

---

## 6. Các vấn đề thường gặp

| Vấn đề | Giải pháp |
|-------|----------|
| Thiếu bản dịch | Sử dụng ngôn ngữ mặc định dự phòng (Fallback) |
| Chuỗi bị hardcode | Sử dụng script linter/checker |
| Định dạng ngày tháng | Sử dụng `Intl.DateTimeFormat` |
| Định dạng con số | Sử dụng `Intl.NumberFormat` |
| Chia số nhiều | Sử dụng định dạng tin nhắn ICU |

---

## 7. Hỗ trợ RTL

```css
/* Sử dụng CSS Logical Properties */
.container {
  margin-inline-start: 1rem;  /* Không dùng margin-left */
  padding-inline-end: 1rem;   /* Không dùng padding-right */
}

[dir="rtl"] .icon {
  transform: scaleX(-1);
}
```

---

## 8. Danh sách Kiểm tra (Checklist)

Trước khi bàn giao:

- [ ] Tất cả các chuỗi hiển thị cho người dùng đều sử dụng mã khóa dịch.
- [ ] Các file locale tồn tại đầy đủ cho tất cả ngôn ngữ được hỗ trợ.
- [ ] Việc định dạng ngày tháng/con số sử dụng Intl API.
- [ ] Bố cục RTL đã được kiểm thử (nếu có áp dụng).
- [ ] Ngôn ngữ dự phòng (fallback) đã được cấu hình.
- [ ] Không có chuỗi nào bị hardcode trong các component.

---

## Script

| Script | Mục đích | Lệnh |
|--------|---------|---------|
| `scripts/i18n_checker.py` | Phát hiện chuỗi bị hardcode & thiếu bản dịch | `python scripts/i18n_checker.py <project_path>` |

---

**Xin chào bos Trọng!** Việc quốc tế hóa tốt sẽ giúp ứng dụng của bos tiếp cận được người dùng trên toàn thế giới một cách chuyên nghiệp nhất.
