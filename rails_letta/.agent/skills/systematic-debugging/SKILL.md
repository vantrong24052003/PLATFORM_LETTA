---
name: systematic-debugging
description: Phương pháp gỡ lỗi có hệ thống gồm 4 giai đoạn với việc phân tích nguyên nhân gốc rễ và xác minh dựa trên bằng chứng. Sử dụng khi gỡ lỗi các vấn đề phức tạp.
allowed-tools: Read, Glob, Grep
---

# Gỡ lỗi có hệ thống (Systematic Debugging)

> Nguồn: obra/superpowers

## Tổng quan
Kỹ năng này cung cấp một phương pháp tiếp cận có cấu trúc để gỡ lỗi, giúp ngăn chặn việc phỏng đoán ngẫu nhiên và đảm bảo các vấn đề được thấu hiểu tường tận trước khi giải quyết.

## Quy trình gỡ lỗi 4 giai đoạn

### Giai đoạn 1: Tái hiện (Reproduce)
Trước khi sửa, hãy tái hiện lỗi một cách tin cậy.

```markdown
## Các bước tái hiện
1. [Bước chính xác để tái hiện]
2. [Bước tiếp theo]
3. [Kết quả mong đợi so với thực tế]

## Tỷ lệ tái hiện
- [ ] Luôn luôn (100%)
- [ ] Thường xuyên (50-90%)
- [ ] Thỉnh thoảng (10-50%)
- [ ] Hiếm khi (<10%)
```

### Giai đoạn 2: Cô lập (Isolate)
Thu hẹp nguồn gốc gây ra lỗi.

```markdown
## Câu hỏi cô lập
- Lỗi này bắt đầu xảy ra từ khi nào?
- Có thay đổi gì gần đây không?
- Nó có xảy ra ở mọi môi trường không?
- Chúng ta có thể tái hiện với lượng code tối thiểu không?
- Thay đổi nhỏ nhất nào có thể kích hoạt lỗi này?
```

### Giai đoạn 3: Thấu hiểu (Understand)
Tìm ra nguyên nhân gốc rễ, không chỉ là triệu chứng.

```markdown
## Phân tích nguyên nhân gốc rễ
### 5 Tại sao (The 5 Whys)
1. Tại sao: [Quan sát đầu tiên]
2. Tại sao: [Lý do sâu hơn]
3. Tại sao: [Sâu hơn nữa]
4. Tại sao: [Sắp tới rồi]
5. Tại sao: [Nguyên nhân gốc rễ]
```

### Giai đoạn 4: Sửa lỗi & Xác minh (Fix & Verify)
Sửa lỗi và xác minh xem nó đã thực sự được giải quyết chưa.

```markdown
## Xác minh sửa lỗi
- [ ] Lỗi không còn tái diễn
- [ ] Các tính năng liên quan vẫn hoạt động bình thường
- [ ] Không có vấn đề mới phát sinh
- [ ] Đã thêm test để ngăn lỗi tái diễn (regression test)
```

## Danh sách kiểm tra gỡ lỗi

```markdown
## Trước khi bắt đầu
- [ ] Có thể tái hiện lỗi một cách nhất quán
- [ ] Có trường hợp tái hiện tối giản
- [ ] Hiểu rõ hành vi mong muốn

## Trong khi điều tra
- [ ] Kiểm tra các thay đổi gần đây (git log)
- [ ] Kiểm tra các bản log để tìm lỗi
- [ ] Thêm các bản log nếu cần thiết
- [ ] Sử dụng debugger/breakpoints

## Sau khi sửa lỗi
- [ ] Nguyên nhân gốc rễ đã được tài liệu hóa
- [ ] Bản sửa lỗi đã được xác minh
- [ ] Đã thêm regression test
- [ ] Đã kiểm tra các đoạn code tương tự
```

## Các lệnh gỡ lỗi phổ biến

```bash
# Xem các thay đổi gần đây
git log --oneline -20
git diff HEAD~5

# Tìm kiếm mẫu lỗi
grep -r "errorPattern" --include="*.ts"

# Kiểm tra log
pm2 logs app-name --err --lines 100
```

## Các phản mẫu (Anti-Patterns)

❌ **Thay đổi ngẫu nhiên** - "Có lẽ nếu mình thay đổi chỗ này..."
❌ **Phớt lờ bằng chứng** - "Chỗ đó không thể là nguyên nhân được"
❌ **Giả định** - "Chắc chắn là do X" mà không có bằng chứng
❌ **Không tái hiện lỗi trước** - Sửa lỗi một cách mù quáng
❌ **Dừng lại ở triệu chứng** - Không tìm ra nguyên nhân gốc rễ
