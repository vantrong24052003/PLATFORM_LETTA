# Hướng dẫn Hiệu ứng Đồ họa Chuyển động (Motion Graphics Reference)

> Các kỹ thuật hiệu ứng nâng cao cho trải nghiệm web cao cấp - Lottie, GSAP, SVG, 3D, Particles.
> **Học hỏi các nguyên tắc, tạo ra các hiệu ứng mang tính đột phá (WOW effects).**

---

## 1. Hiệu ứng Lottie (Lottie Animations)

### Lottie là gì?

```
Các hiệu ứng dạng vector dựa trên JSON:
├── Xuất từ After Effects qua plugin Bodymovin
├── Nhẹ (kích thước nhỏ hơn GIF/video)
├── Có thể mở rộng (dạng vector, không bị vỡ hình)
├── Có tính tương tác (điều khiển phát lại, phân đoạn)
└── Đa nền tảng (web, iOS, Android, React Native)
```

### Khi nào nên dùng Lottie

| Trường hợp sử dụng | Tại sao nên dùng Lottie? |
|----------|-------------|
| **Hiệu ứng khi đang tải (Loading)** | Theo thương hiệu, mượt mà, nhẹ |
| **Trạng thái trống (Empty states)** | Các hình minh họa đầy sức hút |
| **Quy trình hướng dẫn (Onboarding)** | Các hiệu ứng phức tạp nhiều bước |
| **Phản hồi Thành công/Lỗi** | Các tương tác nhỏ (micro-interactions) mang lại sự hài lòng |
| **Các icon động** | Nhất quán trên mọi nền tảng |

### Các Nguyên tắc

- Giữ kích thước file dưới 100KB để đảm bảo hiệu năng.
- Sử dụng vòng lặp (loop) một cách tiết chế (tránh gây xao nhãng).
- Cung cấp hình ảnh tĩnh thay thế cho chế độ giảm chuyển động (reduced-motion).
- Tải lười (Lazy load) các file hiệu ứng khi có thể.

### Nguồn tài nguyên

- LottieFiles.com (thư viện miễn phí).
- After Effects + Bodymovin (tùy chỉnh riêng).
- Plugin Figma (xuất trực tiếp từ thiết kế).

---

## 2. GSAP (GreenSock)

### Điều gì làm nên sự khác biệt của GSAP

```
Thư viện hiệu ứng chuyên nghiệp dựa trên dòng thời gian (timeline):
├── Kiểm soát chính xác các chuỗi hiệu ứng
├── ScrollTrigger cho các hiệu ứng dựa trên hành động cuộn
├── MorphSVG cho các chuyển đổi hình dáng
├── Easing dựa trên các quy luật vật lý
└── Hoạt động tốt với bất kỳ phần tử DOM nào
```

### Các Khái niệm Cốt lõi

| Khái niệm | Mục đích |
|---------|---------|
| **Tween** | Một hiệu ứng chuyển động đơn lẻ từ A đến B |
| **Timeline** | Các hiệu ứng được sắp xếp theo trình tự/lồng ghép |
| **ScrollTrigger** | Vị trí cuộn trang điều khiển việc phát hiệu ứng |
| **Stagger** | Hiệu ứng thác nước (cascade) giữa các phần tử |

### Khi nào nên dùng GSAP

- ✅ Các chuỗi hiệu ứng phức tạp được sắp xếp theo trình tự.
- ✅ Các hiệu ứng xuất hiện kích hoạt bởi hành động cuộn.
- ✅ Khi cần kiểm soát thời gian một cách cực kỳ chính xác.
- ✅ Các hiệu ứng biến đổi hình dáng SVG (morphing).
- ❌ Các hiệu ứng hover/focus đơn giản (nên dùng CSS).
- ❌ Trên thiết bị di động yêu cầu hiệu năng cực cao (vì thư viện này khá nặng).

### Các Nguyên tắc

- Sử dụng timeline để điều phối (không nên dùng các tween riêng lẻ).
- Độ trễ Stagger: 0.05-0.15s giữa các mục.
- ScrollTrigger: bắt đầu khi phần tử đi vào khoảng 70-80% khung hình.
- Hủy các hiệu ứng khi component bị unmount (tránh rò rỉ bộ nhớ).

---

## 3. Hiệu ứng SVG (SVG Animations)

### Các loại Hiệu ứng SVG

| Loại | Kỹ thuật | Trường hợp sử dụng |
|------|-----------|----------|
| **Vẽ đường nét (Line Drawing)** | stroke-dashoffset | Xuất hiện logo, chữ ký |
| **Biến đổi hình dạng (Morph)** | Nội suy đường dẫn (Path) | Chuyển đổi giữa các icon |
| **Biến đổi khối (Transform)** | rotate, scale, translate | Các icon có tính tương tác |
| **Màu sắc** | fill/stroke transition | Thay đổi trạng thái |

### Nguyên tắc Vẽ đường nét

```
Cách vẽ bằng stroke-dashoffset hoạt động:
├── Thiết lập dasharray bằng với độ dài của path
├── Thiết lập dashoffset bằng với dasharray (phần tử bị ẩn)
├── Tạo hiệu ứng giảm dashoffset về 0 (phần tử hiện ra)
└── Tạo ra hiệu ứng "đang vẽ"
```

### Khi nào nên dùng Hiệu ứng SVG

- ✅ Xuất hiện logo, các khoảnh khắc thương hiệu.
- ✅ Chuyển đổi trạng thái icon (ví dụ: menu hamburger ↔ dấu X).
- ✅ Đồ họa thông tin (Infographics), trực quan hóa dữ liệu.
- ✅ Các hình minh họa có tính tương tác.
- ❌ Nội dung ảnh thực tế (nên dùng video).
- ❌ Các cảnh quay cực kỳ phức tạp (ảnh hưởng hiệu năng).

### Các Nguyên tắc

- Lấy độ dài path một cách động để đảm bảo tính chính xác.
- Thời lượng: 1-3s cho các hình vẽ đầy đủ.
- Easing: dùng ease-out để tạo cảm giác tự nhiên.
- Màu tô (fills) đơn giản nên bổ trợ, không nên lấn át đường nét.

---

## 4. Biến đổi 3D CSS (3D CSS Transforms)

### Các Thuộc tính Cốt lõi

```
Không gian 3D trong CSS:
├── perspective: độ sâu của trường 3D (thường dùng 500-1500px)
├── transform-style: preserve-3d (cho phép các phần tử con nằm trong 3D)
├── rotateX/Y/Z: xoay theo từng trục
├── translateZ: di chuyển lại gần hoặc ra xa người xem
└── backface-visibility: hiển thị hoặc ẩn mặt sau
```

### Các Mẫu 3D Phổ biến

| Mẫu | Trường hợp sử dụng |
|---------|----------|
| **Lật thẻ (Card flip)** | Tiết lộ thông tin, thẻ ghi nhớ, xem sản phẩm |
| **Nghiêng khi hover** | Các thẻ có tính tương tác, tạo độ sâu 3D |
| **Các lớp thị sai (Parallax)** | Các phần Hero, hành động cuộn nhập vai |
| **Vòng xoay 3D (Carousel)** | Thư viện hình ảnh, các bộ trượt |

### Các Nguyên tắc

- Perspective: 800-1200px cho mức tinh tế, 400-600px cho mức kịch tính.
- Giữ các biến đổi đơn giản (xoay + di chuyển).
- Đảm bảo `backface-visibility: hidden` cho các hiệu ứng lật.
- Kiểm tra trên trình duyệt Safari (vì cách dựng hình có thể khác biệt).

---

## 5. Hiệu ứng Hạt (Particle Effects)

### Các loại Hệ thống Hạt

| Loại | Cảm giác | Trường hợp sử dụng |
|------|------|----------|
| **Hình học (Geometric)** | Công nghệ, mạng lưới | SaaS, các trang web công nghệ |
| **Pháo giấy (Confetti)** | Ăn mừng | Các khoảnh khắc thành công |
| **Tuyết/Mưa** | Không khí | Theo mùa, theo tâm trạng |
| **Bụi/Bokeh** | Mơ mộng | Nhiếp ảnh, sự sang trọng |
| **Đom đóm** | Kỳ ảo | Game, phong cách huyền bí |

### Các Thư viện

| Thư viện | Tốt nhất cho |
|---------|----------|
| **tsParticles** | Khả năng cấu hình cao, nhẹ |
| **particles.js** | Các nền đơn giản |
| **Canvas API** | Tùy chỉnh riêng, kiểm soát tối đa |
| **Three.js** | Các hệ thống hạt 3D phức tạp |

### Các Nguyên tắc

- Mặc định: 30-50 hạt (đừng để quá nhiều gây ngợp).
- Chuyển động: chậm, tự nhiên (tốc độ 0.5-2).
- Độ mờ (Opacity): 0.3-0.6 (đừng để lấn át nội dung chính).
- Các đường kết nối: dùng các nét mảnh cho cảm giác "mạng lưới".
- ⚠️ Hãy tắt hoặc giảm bớt trên thiết bị di động.

### Khi nào nên dùng

- ✅ Nền cho phần Hero (tạo bầu không khí).
- ✅ Ăn mừng thành công (pháo giấy bùng nổ).
- ✅ Trực quan hóa công nghệ (các nút mạng kết nối).
- ❌ Các trang có quá nhiều nội dung chữ (gây xao nhãng).
- ❌ Các thiết bị cấu hình yếu (gây tốn pin).

---

## 6. Hiệu ứng dựa trên hành động Cuộn (Scroll-Driven Animations)

### CSS Gốc (Hiện đại)

```
Dòng thời gian cuộn trong CSS:
├── animation-timeline: scroll() - cuộn theo tài liệu
├── animation-timeline: view() - khi phần tử nằm trong khung hình
├── animation-range: các ngưỡng bắt đầu/kết thúc
└── Không yêu cầu JavaScript
```

### Các Nguyên tắc

| Điểm kích hoạt | Trường hợp sử dụng |
|---------------|----------|
| **Vào 0%** | Khi phần tử bắt đầu đi vào khung hình |
| **Vào 50%** | Khi đã hiển thị một nửa |
| **Bao phủ 50%** | Khi nằm chính giữa khung hình |
| **Ra 100%** | Khi đã ra khỏi khung hình hoàn toàn |

### Các Thực hành tốt nhất

- Hiệu ứng tiết lộ: bắt đầu khi đi vào khoảng 25%.
- Thị sai (Parallax): tiến triển liên tục theo hành động cuộn.
- Các phần tử dính (Sticky): sử dụng dải bao phủ (cover range).
- Luôn kiểm tra hiệu năng khi cuộn trang.

---

## 7. Các Nguyên tắc về Hiệu năng

### Hiệu ứng GPU so với CPU

```
"RẺ" (tăng tốc bởi GPU):
├── transform (translate, scale, rotate)
├── opacity
└── filter (sử dụng tiết chế)

"ĐẮT" (kích hoạt tính toán lại bố cục):
├── width, height
├── top, left, right, bottom
├── padding, margin
└── bóng đổ (box-shadow) phức tạp
```

### Danh sách kiểm tra Tối ưu hóa

- [ ] Chỉ tạo hiệu ứng cho transform/opacity.
- [ ] Sử dụng `will-change` trước các hiệu ứng nặng (và gỡ bỏ sau đó).
- [ ] Kiểm tra trên các thiết bị cấu hình thấp.
- [ ] Triển khai chế độ `prefers-reduced-motion`.
- [ ] Tải lười (Lazy load) các thư viện hiệu ứng.
- [ ] Giới hạn (Throttle) các tính toán dựa trên hành động cuộn.

---

## 8. Cây Quyết định Hiệu ứng Đồ họa Chuyển động

```
Bạn cần loại hiệu ứng nào?
│
├── Hiệu ứng thương hiệu phức tạp?
│   └── Lottie (xuất từ After Effects)
│
├── Chuỗi hiệu ứng kích hoạt theo hành động cuộn?
│   └── GSAP + ScrollTrigger
│
├── Hiệu ứng logo/icon?
│   └── SVG animation (stroke hoặc morph)
│
├── Hiệu ứng 3D có tính tương tác?
│   └── CSS 3D Transforms (đơn giản) hoặc Three.js (phức tạp)
│
├── Nền tạo bầu không khí?
│   └── tsParticles hoặc Canvas
│
└── Hiệu ứng xuất hiện/hover đơn giản?
    └── CSS @keyframes hoặc Framer Motion
```

---

## 9. Các Phản mẫu (Anti-Patterns)

| ❌ KHÔNG NÊN | ✅ NÊN |
|----------|-------|
| Tạo hiệu ứng cho mọi thứ cùng lúc | Sắp xếp theo trình tự và phân cấp |
| Dùng thư viện nặng cho hiệu ứng đơn giản | Bắt đầu với CSS |
| Phớt lờ chế độ giảm chuyển động | Luôn cung cấp giải pháp thay thế |
| Gây tắc nghẽn luồng chính (main thread) | Tối ưu hóa cho tốc độ 60fps |
| Dùng cùng một loại hạt cho mọi dự án | Khớp với thương hiệu/ngữ cảnh |
| Các hiệu ứng phức tạp trên di động | Kiểm tra tính năng của thiết bị |

---

## 10. Tra cứu Nhanh

| Hiệu ứng | Công cụ | Hiệu năng |
|--------|------|-------------|
| Spinner khi tải | CSS/Lottie | Nhẹ |
| Tiết lộ theo trình tự | GSAP/Framer | Trung bình |
| Vẽ đường nét SVG | CSS stroke | Nhẹ |
| Lật thẻ 3D | CSS transforms | Nhẹ |
| Nền hệ thống hạt | tsParticles | Nặng |
| Thị sai khi cuộn | GSAP ScrollTrigger | Trung bình |
| Biến đổi hình dạng | GSAP MorphSVG | Trung bình |

---

**Xin chào bos Trọng!** Đồ họa chuyển động nên đóng vai trò tăng cường, không phải gây xao nhãng. Mọi hiệu ứng đều phải phục vụ một MỤC ĐÍCH—phản hồi, hướng dẫn, niềm vui, hoặc kể chuyện.
