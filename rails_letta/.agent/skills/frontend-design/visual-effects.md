# Hướng dẫn Hiệu ứng Hình ảnh (Visual Effects Reference)

> Các nguyên tắc và kỹ thuật hiệu ứng CSS hiện đại - học các khái niệm, tạo ra các biến thể.
> **Không sao chép các giá trị cố định - hãy hiểu các khuôn mẫu.**

---

## 1. Các Nguyên tắc về Glassmorphism (Hiệu ứng Kính mờ)

### Điều gì làm nên một Glassmorphism hiệu quả

```
Các thuộc tính then chốt:
├── Nền bán trong suốt (không dùng màu đặc)
├── Làm mờ hậu cảnh (hiệu ứng kính mờ - backdrop blur)
├── Đường viền tinh tế (để định hình khối)
└── Thường kết hợp: bóng đổ nhẹ để tạo độ sâu
```

### Khuôn mẫu áp dụng (Tùy chỉnh các giá trị)

```css
.glass {
  /* Độ trong suốt: điều chỉnh dựa trên khả năng đọc nội dung */
  background: rgba(R, G, B, OPACITY);
  /* OPACITY: 0.1-0.3 cho nền tối, 0.5-0.8 cho nền sáng */
  
  /* Độ mờ: càng cao càng tạo cảm giác "mờ đục" */
  backdrop-filter: blur(AMOUNT);
  /* AMOUNT: 8-12px cho mức tinh tế, 16-24px cho mức mạnh */
  
  /* Đường viền: xác định các cạnh */
  border: 1px solid rgba(255, 255, 255, OPACITY);
  /* OPACITY: thường trong khoảng 0.1-0.3 */
  
  /* Bo góc: khớp với hệ thống thiết kế của bạn */
  border-radius: YOUR_RADIUS;
}
```

### Khi nào nên dùng Glassmorphism
- ✅ Trên các nền nhiều màu sắc hoặc hình ảnh.
- ✅ Cho các modal, lớp phủ (overlays), các thẻ (cards).
- ✅ Các thanh điều hướng (nav bars) có nội dung cuộn bên dưới.
- ❌ Nội dung có quá nhiều chữ (vấn đề về khả năng đọc).
- ❌ Trên các nền màu đặc đơn giản (không có tác dụng).

### Khi nào KHÔNG NÊN dùng
- Các tình huống có độ tương phản thấp.
- Nội dung cực kỳ quan trọng về khả năng truy cập (accessibility).
- Các thiết bị có cấu hình hiệu năng hạn chế.

---

## 2. Các Nguyên tắc về Neomorphism (Hiệu ứng Phù điêu)

### Điều gì làm nên một Neomorphism hiệu quả

```
Khái niệm cốt lõi: Các phần tử mềm mại, nhô lên nhờ bóng đổ KÉP
├── Bóng sáng (từ hướng nguồn sáng)
├── Bóng tối (hướng đối diện)
└── Màu nền khớp với môi trường xung quanh (cùng màu)
```

### Khuôn mẫu áp dụng

```css
.neo-raised {
  /* Nền PHẢI khớp với phần tử cha */
  background: SAME_AS_PARENT;
  
  /* Bóng đổ kép: hướng sáng + hướng tối */
  box-shadow: 
    OFFSET OFFSET BLUR rgba(light-color),
    -OFFSET -OFFSET BLUR rgba(dark-color);
  
  /* OFFSET: thường dùng 6-12px */
  /* BLUR: thường dùng 12-20px */
}

.neo-pressed {
  /* Thuộc tính inset tạo hiệu ứng "nhấn xuống" */
  box-shadow: 
    inset OFFSET OFFSET BLUR rgba(dark-color),
    inset -OFFSET -OFFSET BLUR rgba(light-color);
}
```

### Cảnh báo về Khả năng truy cập
⚠️ **Độ tương phản thấp** - hãy sử dụng một cách tiết chế, đảm bảo các ranh giới rõ ràng.

### Khi nào nên dùng
- Các phần tử mang tính trang trí.
- Các trạng thái tương tác tinh tế.
- UI tối giản với các màu sắc phẳng.

---

## 3. Các Nguyên tắc về Phân cấp Bóng đổ (Shadow Hierarchy)

### Khái niệm: Bóng đổ giúp biểu thị Độ cao (Elevation)

```
Độ cao càng lớn = bóng đổ càng rộng
├── Cấp 0: Không có bóng đổ (phẳng trên bề mặt)
├── Cấp 1: Bóng đổ tinh tế (nhô lên một chút)
├── Cấp 2: Bóng đổ vừa (các thẻ, nút bấm)
├── Cấp 3: Bóng đổ lớn (modal, menu thả xuống)
└── Cấp 4: Bóng đổ sâu (các phần tử nổi bật nhất)
```

### Các thuộc tính Bóng đổ cần Điều chỉnh

```css
box-shadow: OFFSET-X OFFSET-Y BLUR SPREAD COLOR;

/* Offset: hướng của bóng đổ */
/* Blur: độ mềm (càng lớn càng mềm) */
/* Spread: độ lan rộng của kích thước bóng */
/* Color: thường dùng màu đen với độ mờ thấp */
```

### Các Nguyên tắc để Bóng đổ trông Tự nhiên

1. **Y-offset lớn hơn X-offset** (nguồn sáng thường đến từ phía trên).
2. **Độ mờ thấp** (5-15% cho mức tinh tế, 15-25% cho mức rõ rệt).
3. **Nhiều lớp bóng đổ** để tăng tính thực tế (bóng môi trường + bóng trực tiếp).
4. **Độ mờ tỉ lệ thuận với offset** (offset càng lớn = blur càng lớn).

### Bóng đổ trong Chế độ Tối (Dark Mode)
- Bóng đổ khó nhìn thấy hơn trên nền tối.
- Có thể cần tăng độ mờ (opacity).
- Hoặc sử dụng hiệu ứng tỏa sáng (glow)/highlight thay thế.

---

## 4. Các Nguyên tắc về Gradient (Màu biến thiên)

### Các loại và Khi nào nên dùng

| Loại | Khuôn mẫu | Trường hợp sử dụng |
|------|---------|----------|
| **Linear** | Màu A → Màu B dọc theo một đường | Nền, nút bấm, tiêu đề |
| **Radial** | Từ tâm → tỏa ra ngoài | Hiệu ứng ánh đèn, các điểm hội tụ |
| **Conic** | Theo vòng tròn quanh tâm | Biểu đồ tròn, các hiệu ứng sáng tạo |

### Tạo các Gradient Hài hòa

```
Các quy tắc Gradient tốt:
├── Dùng các màu CẠNH NHAU trên vòng tròn màu (analogous)
├── Hoặc cùng một tông màu với độ sáng khác nhau
├── Tránh dùng các màu bổ túc (có thể trông rất gắt)
└── Thêm các điểm dừng màu ở giữa để chuyển đổi mượt mà hơn
```

### Cấu trúc CSS Gradient

```css
.gradient {
  background: linear-gradient(
    DIRECTION,           /* góc độ hoặc từ khóa 'to-...' */
    COLOR-STOP-1,        /* màu sắc + vị trí tùy chọn */
    COLOR-STOP-2,
    /* ... thêm các điểm dừng khác */
  );
}

/* Các ví dụ về hướng (DIRECTION): */
/* 90deg (90 độ), 135deg, to right (sang phải), to bottom right */
```

### Mesh Gradients (Gradient dạng lưới)

```
Nhiều radial gradients lồng vào nhau:
├── Mỗi cái ở một vị trí khác nhau
├── Mỗi cái có độ trong suốt mờ dần
├── **Bắt buộc để tạo yếu tố "Wow" trong các phần Hero**
└── Tạo ra hiệu ứng rực rỡ, tự nhiên (Tìm kiếm: "Aurora Gradient CSS")
```

---

## 5. Các Nguyên tắc về Hiệu ứng Đường viền (Border Effects)

### Đường viền Gradient

```
Kỹ thuật: Sử dụng phần tử giả (pseudo-element) với nền là gradient
├── Phần tử có padding = độ rộng đường viền
├── Phần tử giả được lấp đầy bằng gradient
└── Sử dụng mask hoặc clip để tạo ra hiệu ứng đường viền
```

### Đường viền Động (Animated Borders)

```
Kỹ thuật: Xoay gradient hoặc conic sweep (quét hình nón)
├── Phần tử giả lớn hơn nội dung
├── Animation xoay gradient đó
└── Sử dụng overflow hidden để cắt theo hình dáng mong muốn
```

### Đường viền Tỏa sáng (Glow Borders)

```css
/* Sử dụng nhiều lớp box-shadow để tạo độ hào quang */
box-shadow:
  0 0 SMALL-BLUR COLOR,
  0 0 MEDIUM-BLUR COLOR,
  0 0 LARGE-BLUR COLOR;

/* Mỗi lớp góp phần vào hiệu ứng tỏa sáng tổng thể */
```

---

## 6. Các Nguyên tắc về Hiệu ứng Tỏa sáng (Glow Effects)

### Chữ Tỏa sáng (Text Glow)

```css
text-shadow: 
  0 0 BLUR-1 COLOR,
  0 0 BLUR-2 COLOR,
  0 0 BLUR-3 COLOR;

/* Nhiều lớp = hào quang mạnh hơn */
/* Blur càng lớn = độ lan rộng càng mềm */
```

### Phần tử Tỏa sáng (Element Glow)

```css
box-shadow:
  0 0 BLUR-1 COLOR,
  0 0 BLUR-2 COLOR;

/* Dùng màu khớp với phần tử để hào quang trông thực tế hơn */
/* Độ mờ thấp cho mức độ tinh tế, độ mờ cao cho phong cách neon */
```

### Hiệu ứng Nhịp điệu Tỏa sáng (Pulsing Glow Animation)

```css
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 SMALL-BLUR COLOR; }
  50% { box-shadow: 0 0 LARGE-BLUR COLOR; }
}

/* Easing (tính toán nhịp) và thời lượng sẽ ảnh hưởng đến cảm xúc của chuyển động */
```

---

## 7. Các Kỹ thuật Lớp phủ (Overlay)

### Lớp phủ Gradient trên Hình ảnh

```
Mục đích: Cải thiện khả năng đọc chữ trên nền ảnh
Khuôn mẫu: Gradient từ trong suốt đến mờ đặc
Vị trí: Nơi chữ sẽ xuất hiện
```

```css
.overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    DIRECTION,
    transparent PERCENTAGE,
    rgba(0,0,0,OPACITY) 100%
  );
}
```

### Lớp phủ Màu sắc (Colored Overlay)

```css
/* Sử dụng chế độ hòa trộn (blend mode) hoặc gradient lồng lớp */
background: 
  linear-gradient(YOUR-COLOR-WITH-OPACITY),
  url('image.jpg');
```

---

## 8. Các Kỹ thuật CSS Hiện đại

### Container Queries (Khái niệm)

```
Thay vì các breakpoint theo viewport (khung hình trình duyệt):
├── Component tự đáp ứng theo vùng chứa (container) của CHÍNH NÓ
├── Các component thực sự mang tính module và có khả năng tái sử dụng cao
└── Cú pháp: @container (điều kiện) { }
```

### Bộ chọn :has() (Khái niệm)

```
Định kiểu cho phần tử cha dựa trên phần tử con:
├── "Phần tử cha có chứa con X"
├── Cho phép thực hiện các khuôn mẫu trước đây được coi là bất khả thi
└── Cách tiếp cận tăng cường dần dần (progressive enhancement)
```

### Hiệu ứng Chuyển động dựa trên Cuộn (Scroll-Driven Animations)

```
Tiến trình của hiệu ứng gắn liền với hành động cuộn:
├── Hiệu ứng xuất hiện/biến mất khi cuộn
├── Hiệu ứng thị sai (parallax)
├── Các chỉ báo tiến trình cuộn
└── Dòng thời gian dựa trên góc nhìn hoặc việc cuộn trang
```

---

## 9. Các Nguyên tắc về Hiệu năng (Performance)

### Các thuộc tính được tăng tốc bởi GPU

```
"RẺ" để tạo hiệu ứng (GPU):
├── transform (translate, scale, rotate)
└── opacity

"ĐẮT" để tạo hiệu ứng (CPU):
├── width, height
├── top, left, right, bottom
├── margin, padding
└── box-shadow (phải tính toán lại lớp bóng)
```

### Cách dùng will-change

```css
/* Chỉ dùng một cách tiết chế cho các hiệu ứng nặng */
.heavy-animation {
  will-change: transform;
}

/* Hãy loại bỏ nó sau khi hiệu ứng kết thúc nếu có thể */
```

### Chế độ Giảm chuyển động (Reduced Motion)

```css
@media (prefers-reduced-motion: reduce) {
  /* Tắt hoặc giảm thiểu tối đa các hiệu ứng chuyển động */
  /* Tôn trọng lựa chọn của người dùng */
}
```

---

## 10. Danh sách kiểm tra Lựa chọn Hiệu ứng

Trước khi áp dụng bất kỳ hiệu ứng nào:

- [ ] **Nó có phục vụ mục đích nào không?** (không chỉ để trang trí)
- [ ] **Nó có phù hợp với ngữ cảnh không?** (thương hiệu, đối tượng khách hàng)
- [ ] **Bạn có tạo ra sự khác biệt so với các dự án trước không?** (tránh lặp lại)
- [ ] **Có đảm bảo khả năng truy cập?** (độ tương phản, độ nhạy với chuyển động)
- [ ] **Có đảm bảo hiệu năng?** (đặc biệt là trên thiết bị di động)
- [ ] **Đã hỏi ý kiến người dùng nếu phong cách mang tính mở?**

### Các Phản mẫu (Anti-Patterns) cần tránh

- ❌ Áp dụng Glassmorphism lên mọi phần tử (gây loãng và mất thẩm mỹ).
- ❌ Mặc định dùng nền Tối + màu Neon (kiểu thiết kế AI lười biếng).
- ❌ **Các thiết kế Tĩnh/Phẳng không có độ sâu (THẤT BẠI)**.
- ❌ Các hiệu ứng gây khó khăn cho việc đọc nội dung.
- ❌ Các hiệu ứng chuyển động vô nghĩa.

---

**Xin chào bos Trọng!** Các hiệu ứng giúp tăng cường ý nghĩa cho thiết kế. Hãy lựa chọn dựa trên mục đích và ngữ cảnh, không phải chỉ vì nó trông "hay ho".
