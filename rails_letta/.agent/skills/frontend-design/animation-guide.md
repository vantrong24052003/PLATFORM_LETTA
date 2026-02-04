# Hướng dẫn Hiệu ứng Chuyển động (Animation Guidelines Reference)

> Các nguyên tắc về hiệu ứng chuyển động và tâm lý học về thời gian - học cách ra quyết định, không phải sao chép.
> **Không có khoảng thời gian cố định - hãy hiểu các yếu tố ảnh hưởng đến thời gian.**

---

## 1. Các Nguyên tắc về Thời lượng (Duration)

### Những yếu tố ảnh hưởng đến Thời gian

```
Các yếu tố xác định tốc độ hiệu ứng:
├── KHOẢNG CÁCH: Di chuyển càng xa = thời lượng càng dài
├── KÍCH THƯỚC: Phần tử càng lớn = hiệu ứng càng chậm
├── ĐỘ PHỨC TẠP: Càng phức tạp = càng cần nhiều thời gian để xử lý
├── TẦM QUAN TRỌNG: Các hành động quan trọng = phản hồi rõ ràng
└── NGỮ CẢNH: Khẩn cấp = nhanh, Sang trọng = chậm
```

### Các Khoảng thời lượng theo Mục đích

| Mục đích | Khoảng thời gian | Tại sao |
|---------|-------|-----|
| Phản hồi tức thì | 50-100ms | Dưới ngưỡng nhận thức |
| Các tương tác nhỏ (Micro-interactions) | 100-200ms | Nhanh nhưng vẫn nhận thấy được |
| Các chuyển đổi tiêu chuẩn | 200-300ms | Tốc độ thoải mái |
| Các hiệu ứng phức tạp | 300-500ms | Có thời gian để dõi theo |
| Chuyển đổi trang | 400-600ms | Chuyển tiếp mượt mà |
| **Hiệu ứng Wow/Cao cấp** | 800ms+ | Kịch tính, dựa trên lò xo (spring-based) tự nhiên, nhiều lớp |

### Cách chọn Thời lượng

Hãy tự hỏi:
1. Phần tử đang di chuyển bao xa?
2. Việc nhận thấy sự thay đổi này quan trọng đến mức nào?
3. Người dùng đang chờ đợi, hay đây chỉ là hiệu ứng nền?

---

## 2. Các Nguyên tắc về Easing

### Vai trò của Easing

```
Easing = tốc độ thay đổi như thế nào theo thời gian
├── Linear (Tuyến tính): tốc độ không đổi (máy móc, robot)
├── Ease-out: bắt đầu nhanh, kết thúc chậm (vào cuộc tự nhiên)
├── Ease-in: bắt đầu chậm, kết thúc nhanh (thoát ra tự nhiên)
└── Ease-in-out: chậm ở cả hai đầu (mượt mà, có chủ đích)
```

### Khi nào nên sử dụng loại nào

| Easing | Tốt nhất cho | Cảm giác |
|--------|----------|------------|
| **Ease-out** | Các phần tử đi vào | Đang đến, đang ổn định |
| **Ease-in** | Các phần tử đi ra | Đang rời đi, đang thoát ra |
| **Ease-in-out** | Sự nhấn mạnh, vòng lặp | Có chủ đích, mượt mà |
| **Linear** | Các chuyển động liên tục | Máy móc, hằng số |
| **Bounce/Elastic** | UI vui tươi | Vui vẻ, năng động |

### Các Mẫu áp dụng

```css
/* Đi vào khung nhìn = ease-out (giảm tốc) */
.enter {
  animation-timing-function: ease-out;
}

/* Rời khỏi khung nhìn = ease-in (tăng tốc) */
.exit {
  animation-timing-function: ease-in;
}

/* Liên tục = ease-in-out */
.continuous {
  animation-timing-function: ease-in-out;
}
```

---

## 3. Các Nguyên tắc về Tương tác nhỏ (Micro-Interaction)

### Điều gì tạo nên một Micro-Interaction tốt

```
Mục đích của micro-interactions:
├── PHẢN HỒI (FEEDBACK): Xác nhận hành động đã xảy ra
├── HƯỚNG DẪN (GUIDANCE): Chỉ ra những gì có thể thực hiện
├── TRẠNG THÁI (STATUS): Chỉ định trạng thái hiện tại
└── NIỀM VUI (DELIGHT): Những khoảnh khắc vui vẻ nhỏ bé
```

### Các Trạng thái của Nút bấm (Button States)

```
Hover → thay đổi hình ảnh nhẹ (nhấc lên, đổi màu, co giãn)
Active → cảm giác bị nhấn xuống (thu nhỏ, đổi bóng đổ)
Focus → chỉ báo rõ ràng (đường viền, vòng tròn bao quanh)
Loading → chỉ báo tiến trình (spinner, skeleton)
Success → xác nhận (dấu kiểm, đổi màu)
```

### Các Nguyên tắc

1. **Phản hồi ngay lập tức** (dưới ngưỡng nhận thức 100ms).
2. **Khớp với hành động** (nhấn = `scale(0.95)`, hover = `translateY(-4px) + tỏa sáng`).
3. **Mạnh mẽ nhưng mượt mà** (Tạo cảm giác như được làm bởi nghệ nhân).
4. **Nhất quán** (cùng hành động = cùng phản hồi).

---

## 4. Các Nguyên tắc về Trạng thái Tải (Loading States)

### Các loại theo Ngữ cảnh

| Tình huống | Cách tiếp cận |
|-----------|----------|
| Tải nhanh (<1s) | Không cần chỉ báo |
| Trung bình (1-3s) | Spinner hoặc hiệu ứng đơn giản |
| Dài (3s+) | Thanh tiến trình hoặc skeleton |
| Thời lượng không xác định | Chỉ báo không xác định (indeterminate) |

### Skeleton Screens

```
Mục đích: Giảm thời gian chờ đợi cảm nhận được
├── Hiển thị hình dáng bố cục ngay lập tức
├── Hiệu ứng nhẹ nhàng (shimmer, pulse)
├── Thay thế bằng nội dung khi sẵn sàng
└── Cảm giác nhanh hơn so với dùng spinner
```

### Chỉ báo Tiến trình (Progress Indicators)

```
Khi nào nên hiển thị tiến trình:
├── Hành động do người dùng khởi xướng
├── Tải lên/Tải xuống tập tin
├── Các quy trình nhiều bước
└── Các thao tác kéo dài

Khi nào KHÔNG cần thiết:
├── Các thao tác diễn ra cực nhanh
├── Các tác vụ chạy nền
├── Lần tải trang đầu tiên (dùng skeleton tốt hơn)
```

---

## 5. Các Nguyên tắc về Chuyển đổi Trang (Page Transitions)

### Chiến lược Chuyển đổi

```
Quy tắc đơn giản: thoát nhanh, vào chậm hơn
├── Nội dung đi ra mờ dần nhanh chóng
├── Nội dung đi vào có hiệu ứng rõ rệt
└── Tránh cảm giác "mọi thứ chuyển động cùng lúc"
```

### Các Mẫu Phổ biến

| Mẫu | Khi nào nên dùng |
|---------|-------------|
| **Fade** | Lựa chọn an toàn, hoạt động tốt ở mọi nơi |
| **Slide** | Điều hướng tuần tự (trước/sau) |
| **Scale** | Mở/đóng các modal |
| **Shared element** | Duy trì tính liên tục của hình ảnh |

### Khớp với Hướng điều hướng

```
Hướng điều hướng = Hướng hiệu ứng
├── Tiếp tục → trượt từ bên phải sang
├── Quay lại → trượt từ bên trái sang
├── Đi sâu vào → phóng to từ trung tâm
├── Quay trở ra → thu nhỏ lại
```

---

## 6. Các Nguyên tắc về Hiệu ứng khi Cuộn (Scroll Animation)

### Tiết lộ Dần dần (Progressive Reveal)

```
Nội dung xuất hiện khi người dùng cuộn:
├── Giảm tải nhận thức ban đầu
├── Khuyến khích việc khám phá
├── Không được tạo cảm giác chậm chạp
└── Phải có tùy chọn để tắt (khả năng truy cập)
```

### Các Điểm Kích hoạt (Trigger Points)

| Khi nào kích hoạt | Hiệu ứng |
|-----------------|--------|
| Vừa đi vào khung nhìn | Tiết lộ tiêu chuẩn |
| Căn giữa trong khung nhìn | Để nhấn mạnh |
| Hiển thị một phần | Tiết lộ sớm hơn |
| Hiển thị hoàn toàn | Kích hoạt muộn |

### Thuộc tính Hiệu ứng

- Hiện dần (opacity)
- Trượt lên (transform)
- Co giãn (transform)
- Kết hợp các thuộc tính trên

### Hiệu năng (Performance)

- Sử dụng Intersection Observer.
- Chỉ tạo hiệu ứng cho transform/opacity.
- Giảm bớt trên di động nếu cần thiết.

---

## 7. Các Nguyên tắc về Hiệu ứng Hover

### Khớp Hiệu ứng với Hành động

| Phân tử | Hiệu ứng | Mục đích |
|---------|--------|--------|
| **Thẻ có thể nhấn** | Nhấc lên + bóng đổ | "Cái này có thể tương tác" |
| **Nút bấm** | Thay đổi màu sắc/độ sáng | "Hãy nhấn tôi" |
| **Hình ảnh** | Thu phóng (zoom/scale) | "Xem kỹ hơn" |
| **Liên kết** | Gạch chân/màu sắc | "Đi đến đây" |

### Các Nguyên tắc

1. **Báo hiệu tính tương tác** - hover cho thấy nó có thể nhấn được.
2. **Đừng làm quá đà** - các thay đổi tinh tế sẽ hiệu quả hơn.
3. **Khớp với tầm quan trọng** - thay đổi lớn hơn = quan trọng hơn.
4. **Các giải pháp thay thế cho cảm ứng** - hover không hoạt động trên di động.

---

## 8. Các Nguyên tắc về Hiệu ứng Phản hồi (Feedback)

### Các Trạng thái Thành công

```
Ăn mừng một cách phù hợp:
├── Hành động nhỏ → dấu kiểm/màu sắc tinh tế
├── Hành động lớn → hiệu ứng rõ rệt hơn
├── Hoàn thành → hiệu ứng mang tính thỏa mãn
└── Khớp với cá tính thương hiệu
```

### Các Trạng thái Lỗi

```
Thu hút sự chú ý mà không gây hoảng sợ:
├── Thay đổi màu sắc (màu đỏ ngữ nghĩa)
├── Hiệu ứng rung (lắc) (ngắn gọn!)
├── Tập trung vào trường bị lỗi
└── Thông điệp rõ ràng
```

### Thời gian (Timing)

- Thành công: lâu hơn một chút (để tận hưởng khoảnh khắc).
- Lỗi: nhanh (đừng làm gián đoạn hành động).
- Đang tải: liên tục cho đến khi hoàn thành.

---

## 9. Các Nguyên tắc về Hiệu năng (Performance)

### Những gì "Rẻ" để tạo hiệu ứng

```
Được tăng tốc bởi GPU (NHANH):
├── transform: translate, scale, rotate
└── opacity: từ 0 đến 1

Tốn tài nguyên CPU (CHẬM):
├── width, height
├── top, left, right, bottom
├── margin, padding
├── thay đổi border-radius
└── thay đổi box-shadow
```

### Chiến lược Tối ưu hóa

1. **Ưu tiên transform/opacity** bất cứ khi nào có thể.
2. **Tránh kích hoạt tính toán lại bố cục** (thay đổi kích thước/vị trí).
3. **Sử dụng thuộc tính will-change một cách tiết chế** (gợi ý cho trình duyệt).
4. **Kiểm tra trên các thiết bị cấu hình thấp** (không chỉ trên máy của dev).

### Tôn trọng Lựa chọn của Người dùng

```css
@media (prefers-reduced-motion: reduce) {
  /* Tuân thủ lựa chọn này */
  /* Chỉ giữ lại các hiệu ứng thiết yếu */
  /* Giảm bớt hoặc loại bỏ các chuyển động trang trí */
}
```

---

## 10. Danh sách kiểm tra Quyết định Hiệu ứng

Trước khi thêm hiệu ứng chuyển động:

- [ ] **Có mục đích rõ ràng không?** (phản hồi/hướng dẫn/niềm vui)
- [ ] **Thời gian có phù hợp không?** (không quá nhanh/chậm)
- [ ] **Đã chọn đúng easing chưa?** (vào/ra/nhấn mạnh)
- [ ] **Có đảm bảo hiệu năng không?** (chỉ dùng transform/opacity)
- [ ] **Đã kiểm tra chế độ giảm chuyển động?** (khả năng truy cập)
- [ ] **Có nhất quán với các hiệu ứng khác không?** (cảm giác về thời gian đồng nhất)
- [ ] **Không phải là các thiết lập mặc định của bạn?** (kiểm tra tính đa dạng)
- [ ] **Đã hỏi người dùng về phong cách nếu chưa rõ?**

### Các Phản mẫu (Anti-Patterns)

- ❌ Dùng cùng một giá trị thời gian cho mọi dự án.
- ❌ Thêm hiệu ứng chỉ để cho có.
- ❌ Phớt lờ sở thích giảm chuyển động của người dùng.
- ❌ Tạo hiệu ứng cho các thuộc tính tốn kém tài nguyên.
- ❌ Quá nhiều thứ chuyển động cùng một lúc.
- ❌ Sự chậm trễ gây ức chế cho người dùng.

---

**Xin chào bos Trọng!** Hiệu ứng chuyển động là một hình thức giao tiếp. Mọi chuyển động đều nên có ý nghĩa và phục vụ trải nghiệm của người dùng.
