# Hệ thống Màu sắc (Color System Reference)

> Các nguyên tắc lý thuyết màu sắc, quy trình lựa chọn và hướng dẫn ra quyết định.
> **Đừng học thuộc lòng mã hex - hãy học cách TƯ DUY về màu sắc.**

---

## 1. Cơ bản về Lý thuyết Màu sắc

### Vòng tròn Màu sắc (The Color Wheel)

```
                    VÀNG (YELLOW)
                       │
            Vàng-      │    Vàng-
            Lục        │    Cam
               ╲       │       ╱
                ╲      │      ╱
      LỤC (GREEN) ─────────── ● ─────────── CAM (ORANGE)
                ╱      │      ╲
               ╱       │       ╲
            Xanh-      │    Đỏ-
            Lục        │    Cam
                       │
                     ĐỎ (RED)
                       │
                    TÍM (PURPLE)
                   ╱       ╲
              Xanh-         Đỏ-
              Tím           Tím
                   ╲       ╱
                     LAM (BLUE)
```

### Mối quan hệ giữa các Màu sắc

| Hệ màu | Cách tạo | Khi nào nên dùng |
|--------|---------------|-------------|
| **Đơn sắc (Monochromatic)** | Chọn MỘT màu (hue), chỉ thay đổi độ sáng/độ bão hòa | Tối giản, chuyên nghiệp, thống nhất |
| **Tương đồng (Analogous)** | Chọn 2-3 màu CẠNH NHAU trên vòng tròn | Hài hòa, điềm tĩnh, lấy cảm hứng từ thiên nhiên |
| **Bổ túc (Complementary)** | Chọn các màu ĐỐI DIỆN trên vòng tròn | Độ tương phản cao, rực rỡ, thu hút sự chú ý |
| **Bổ túc bộ ba (Split-Complementary)** | Màu nền + 2 màu bên cạnh màu bổ túc | Năng động nhưng vẫn cân bằng |
| **Bộ ba (Triadic)** | 3 màu CÁCH ĐỀU NHAU trên vòng tròn | Rực rỡ, vui tươi, sáng tạo |

### Cách chọn Hệ màu:
1. **Tâm trạng dự án là gì?** Bình yên → Tương đồng. Mạnh mẽ → Bổ túc.
2. **Cần bao nhiêu màu?** Tối giản → Đơn sắc. Phức tạp → Bộ ba.
3. **Đối tượng khách hàng là ai?** Bảo thủ → Đơn sắc. Trẻ trung → Bộ ba.

---

## 2. Quy tắc 60-30-10

### Nguyên tắc Phân bổ
```
┌─────────────────────────────────────────────────┐
│                                                 │
│     60% MÀU CHÍNH (Nền, các khu vực lớn)        │
│     → Nên là màu trung tính hoặc dịu mắt        │
│     → Định hình tông màu tổng thể               │
│                                                 │
├────────────────────────────────────┬────────────┤
│                                    │            │
│   30% MÀU PHỤ                      │ 10% NHẤN   │
│   (Card, các phần, header)         │ (CTA,      │
│   → Hỗ trợ mà không lấn át         │ các điểm   │
│                                    │ nổi bật)   │
│                                    │ → Thu hút  │
│                                    │   sự chú ý │
└────────────────────────────────────┴────────────┘
```

### Cách triển khai
```css
:root {
  /* 60% - Chọn dựa trên chế độ sáng/tối và tâm trạng */
  --color-bg: /* trung tính: trắng, trắng nhạt, hoặc xám đậm */
  --color-surface: /* khác biệt một chút so với nền */
  
  /* 30% - Chọn dựa trên thương hiệu hoặc ngữ cảnh */
  --color-secondary: /* phiên bản nhạt của màu chính hoặc trung tính */
  
  /* 10% - Chọn dựa trên hành động/cảm xúc mong muốn */
  --color-accent: /* rực rỡ, thu hút sự chú ý */
}
```

---

## 3. Tâm lý học Màu sắc - Ý nghĩa & Lựa chọn

### Cách chọn dựa trên Ngữ cảnh

| Nếu Dự án là... | Hãy cân nhắc các màu này | Tại sao |
|------------------|---------------------|-----|
| **Tài chính, Công nghệ, Y tế** | Lam (Blue), Xanh mòng két (Teal) | Tin tưởng, ổn định, bình tâm |
| **Môi trường, Sức khỏe, Thiên nhiên** | Lục (Green), tông màu Đất | Tăng trưởng, sức khỏe, hữu cơ |
| **Thực phẩm, Năng lượng, Giới trẻ** | Cam, Vàng, tông màu Ấm | Kích thích vị giác, hào hứng, ấm áp |
| **Sang trọng, Làm đẹp, Sáng tạo** | Xanh mòng két đậm, Vàng đồng, Đen | Tinh tế, cao cấp |
| **Khẩn cấp, Giảm giá, Cảnh báo** | Đỏ, Cam | Hành động, chú ý, đam mê |

### Liên tưởng Cảm xúc (Để ra quyết định)

| Nhóm màu | Liên tưởng Tích cực | Lưu ý |
|------------|----------------------|----------|
| **Lam (Blue)** | Tin tưởng, bình tĩnh, chuyên nghiệp | Có thể tạo cảm giác lạnh lẽo, khô cứng |
| **Lục (Green)** | Tăng trưởng, thiên nhiên, thành công | Có thể gây nhàm chán nếu lạm dụng |
| **Đỏ (Red)** | Đam mê, khẩn cấp, năng lượng | Kích thích mạnh, nên dùng tiết chế |
| **Cam (Orange)** | Ấm áp, thân thiện, sáng tạo | Có thể tạo cảm giác rẻ tiền nếu quá đậm |
| **Tím (Purple)** | ⚠️ **BỊ CẤM** - AI thường lạm dụng! | Dùng Xanh mòng két đậm/Đỏ đô/Xanh lục bảo thay thế |
| **Vàng (Yellow)** | Lạc quan, chú ý, hạnh phúc | Khó đọc, chỉ nên dùng để nhấn |
| **Đen (Black)** | Thanh lịch, quyền lực, hiện đại | Có thể tạo cảm giác nặng nề |
| **Trắng (White)** | Sạch sẽ, tối giản, cởi mở | Có thể tạo cảm giác vô trùng, lạnh lẽo |

### Quy trình lựa chọn:
1. **Ngành nghề nào?** → Thu hẹp còn 2-3 nhóm màu.
2. **Cảm xúc gì?** → Chọn màu chính (hue).
3. **Độ tương phản như thế nào?** → Quyết định chế độ sáng/tối.
4. **HỎI NGƯỜI DÙNG** → Xác nhận trước khi tiến hành.

---

## 4. Nguyên tắc Tạo bảng màu

### Từ một màu duy nhất (Phương pháp HSL)

Thay vì học thuộc mã hex, hãy học cách **điều chỉnh HSL**:

```
HSL = Hue (Màu), Saturation (Độ bão hòa), Lightness (Độ sáng)

Màu - Hue (0-360): Nhóm màu
  0/360 = Đỏ
  60 = Vàng
  120 = Lục
  180 = Xanh lơ (Cyan)
  240 = Lam (Blue)
  300 = Tím

Độ bão hòa - Saturation (0-100%): Cường độ màu
  Thấp = Nhạt, tinh tế
  Cao = Rực rỡ, năng động

Độ sáng - Lightness (0-100%): Độ sáng tối
  0% = Đen
  50% = Màu nguyên bản
  100% = Trắng
```

### Tạo một bảng màu đầy đủ

Từ BẤT KỲ màu nền nào, hãy tạo một thang đo:

```
Thang độ sáng:
  50  (nhạt nhất) → L: 97%
  100            → L: 94%
  200            → L: 86%
  300            → L: 74%
  400            → L: 66%
  500 (gốc)      → L: 50-60%
  600            → L: 48%
  700            → L: 38%
  800            → L: 30%
  900 (đậm nhất) → L: 20%
```

### Điều chỉnh Độ bão hòa

| Ngữ cảnh | Mức độ bão hòa |
|---------|-----------------|
| **Chuyên nghiệp/Doanh nghiệp** | Thấp (40-60%) |
| **Vui tươi/Giới trẻ** | Cao (70-90%) |
| **Chế độ Tối (Dark Mode)** | Giảm 10-20% |
| **Khả năng truy cập (Accessibility)** | Đảm bảo tương phản, có thể cần điều chỉnh |

---

## 5. Hướng dẫn Lựa chọn dựa trên Ngữ cảnh

### Đừng sao chép bảng màu, hãy tuân theo quy trình này:

**Bước 1: Xác định Ngữ cảnh**
```
Loại dự án nào?
├── E-commerce → Cần cân bằng giữa tin tưởng + khẩn cấp
├── SaaS/Dashboard → Cần ít mỏi mắt, tập trung vào dữ liệu
├── Health/Wellness (Sức khỏe) → Cần cảm giác bình yên, tự nhiên
├── Luxury/Premium (Cao cấp) → Cần sự thanh lịch tinh tế
├── Creative/Portfolio (Sáng tạo) → Cần cá tính, dễ nhớ
└── Khác → HÃY HỎI người dùng
```

**Bước 2: Chọn Nhóm màu Chính**
```
Dựa trên ngữ cảnh, chọn MỘT:
- Nhóm Lam (tin tưởng)
- Nhóm Lục (tăng trưởng)
- Nhóm màu Ấm (năng lượng)
- Nhóm Trung tính (thanh lịch)
- HOẶC hỏi sở thích của người dùng
```

**Bước 3: Quyết định Chế độ Sáng/Tối**
```
Cân nhắc:
- Sở thích người dùng?
- Tiêu chuẩn ngành?
- Loại nội dung? (nhiều chữ = nên dùng nền sáng)
- Thời gian sử dụng? (ứng dụng dùng buổi tối = tùy chọn nền tối)
```

**Bước 4: Tạo Bảng màu theo các Nguyên tắc**
- Sử dụng phương pháp điều chỉnh HSL.
- Tuân thủ quy tắc 60-30-10.
- Kiểm tra độ tương phản (WCAG).
- Thử nghiệm với nội dung thực tế.

---

## 6. Nguyên tắc Chế độ Tối (Dark Mode)

### Các Quy tắc Chính (Không dùng mã cố định)

1. **Không bao giờ dùng đen tuyệt đối** → Dùng xám cực đậm pha một chút màu chủ đạo.
2. **Không bao giờ dùng chữ trắng tuyệt đối** → Dùng độ sáng khoảng 87-92%.
3. **Giảm độ bão hòa** → Màu rực rỡ sẽ làm mỏi mắt trong nền tối.
4. **Độ cao = Độ sáng** → Các yếu tố nằm lớp trên nên sáng hơn một chút.

### Độ tương phản trong Chế độ Tối

```
Các lớp nền (đậm hơn → sáng hơn khi lớp tăng lên):
Lớp 0 (gốc)    → Đậm nhất
Lớp 1 (card)   → Sáng hơn một chút
Lớp 2 (modal)  → Sáng hơn nữa
Lớp 3 (popup)  → Sáng nhất trong các tông tối
```

### Điều chỉnh Màu sắc cho Chế độ Tối

| Chế độ Sáng | Điều chỉnh cho Chế độ Tối |
|------------|---------------------|
| Màu nhấn bão hòa cao | Giảm độ bão hòa 10-20% |
| Nền trắng tuyệt đối | Xám đậm pha tông màu thương hiệu |
| Chữ đen | Xám nhạt (không dùng trắng tuyệt đối) |
| Nền nhiều màu sắc | Các phiên bản ít bão hòa và đậm hơn |

---

## 7. Hướng dẫn về Khả năng truy cập (Accessibility)

### Yêu cầu về Tương phản (WCAG)

| Cấp độ | Chữ bình thường | Chữ lớn |
|-------|-------------|------------|
| AA (tối thiểu) | 4.5:1 | 3:1 |
| AAA (nâng cao) | 7:1 | 4.5:1 |

### Cách kiểm tra Độ tương phản

1. **Chuyển đổi màu sắc sang độ chói (luminance)**.
2. **Tính tỷ lệ**: (màu sáng hơn + 0.05) / (màu đậm hơn + 0.05).
3. **Điều chỉnh cho đến khi đạt yêu cầu**.

### Các Mẫu An toàn

| Trường hợp | Hướng dẫn |
|----------|-----------|
| **Chữ trên nền sáng** | Dùng độ sáng 35% hoặc thấp hơn |
| **Chữ trên nền tối** | Dùng độ sáng 85% hoặc cao hơn |
| **Màu chính trên nền trắng** | Đảm bảo biến thể đủ đậm |
| **Các nút bấm (Buttons)** | Tương phản cao giữa nền và chữ |

---

## 8. Danh sách kiểm tra Lựa chọn Màu sắc

Trước khi chốt bất kỳ lựa chọn màu sắc nào, hãy xác nhận:

- [ ] **Đã hỏi sở thích của người dùng?** (nếu chưa được chỉ định)
- [ ] **Khớp với ngữ cảnh dự án?** (ngành nghề, đối tượng)
- [ ] **Tuân thủ quy tắc 60-30-10?** (phân bổ hợp lý)
- [ ] **Đạt chuẩn WCAG?** (đã kiểm tra tương phản)
- [ ] **Hoạt động tốt ở cả hai chế độ?** (nếu cần chế độ tối)
- [ ] **KHÔNG PHẢI là lựa chọn mặc định/yêu thích của bạn?** (kiểm tra tính đa dạng)
- [ ] **Khác biệt so với dự án trước?** (tránh lặp lại)

---

## 9. Các Phản mẫu (Anti-Patterns) cần tránh

### ❌ KHÔNG NÊN:
- Sao chép nguyên mã hex cho mọi dự án.
- Mặc định dùng màu tím/vàng tím (xu hướng của AI).
- Mặc định dùng nền tối + màu neon (xu hướng của AI).
- Dùng nền đen tuyệt đối (#000000).
- Dùng chữ trắng tuyệt đối (#FFFFFF) trên nền tối.
- Phớt lờ ngữ cảnh ngành nghề của người dùng.
- Bỏ qua bước hỏi sở thích người dùng.

### ✅ NÊN:
- Tạo bảng màu mới cho mỗi dự án.
- Hỏi người dùng về sở thích màu sắc.
- Cân nhắc ngành nghề và đối tượng khách hàng.
- Sử dụng HSL để điều chỉnh linh hoạt.
- Kiểm tra độ tương phản và khả năng truy cập.
- Cung cấp cả lựa chọn sáng VÀ tối.

---

**Xin chào bos Trọng!** Màu sắc là sự lựa chọn, không phải mặc định. Mọi dự án đều xứng đáng có một hệ thống màu sắc được cân nhắc kỹ lưỡng dựa trên ngữ cảnh riêng biệt của nó.
