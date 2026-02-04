# Hệ thống Typography (Typography System Reference)

> Các nguyên tắc và quy trình ra quyết định về Typography - học cách tư duy, không phải học thuộc lòng.
> **Không có tên font hay kích thước cố định - hãy hiểu toàn bộ hệ thống.**

---

## 1. Các Nguyên tắc về Thang tỉ lệ (Modular Scale)

### Thang tỉ lệ Modular Scale là gì?

```
Một mối quan hệ toán học giữa các kích thước font:
├── Chọn một kích thước CƠ SỞ (BASE) (thường là văn bản nội dung)
├── Chọn một TỈ LỆ (RATIO) (hệ số nhân)
└── Tạo ra tất cả các kích thước bằng công thức: base × ratio^n
```

### Các Tỉ lệ Phổ biến và Khi nào nên dùng

| Tỉ lệ | Giá trị | Cảm giác | Tốt nhất cho |
|-------|-------|---------|----------|
| Minor Second | 1.067 | Rất tinh tế | UI dày đặc, màn hình nhỏ |
| Major Second | 1.125 | Tinh tế | Giao diện thu gọn (compact) |
| Minor Third | 1.2 | Thoải mái | Ứng dụng di động, các dạng thẻ (cards) |
| Major Third | 1.25 | Cân bằng | Web thông dụng (phổ biến nhất) |
| Perfect Fourth | 1.333 | Dễ nhận thấy | Trang nội dung, blog |
| Perfect Fifth | 1.5 | Kịch tính | Tiêu đề lớn, marketing |
| Golden Ratio | 1.618 | Tác động tối đa | Các phần Hero, hiển thị nổi bật |

### Tạo Thang tỉ lệ của bạn

```
Giả sử: base = KÍCH_THƯỚC_CƠ_SỞ, ratio = TỈ_LỆ_CỦA_BẠN

Thang đo:
├── xs:  base ÷ ratio²
├── sm:  base ÷ ratio
├── base: KÍCH_THƯỚC_CƠ_SỞ
├── lg:  base × ratio
├── xl:  base × ratio²
├── 2xl: base × ratio³
├── 3xl: base × ratio⁴
└── ... tiếp tục nếu cần
```

### Lựa chọn Kích thước Cơ sở

| Ngữ cảnh | Khoảng kích thước cơ sở | Tại sao |
|---------|-----------------|-----|
| Ưu tiên di động | 16-18px | Khả năng đọc trên màn hình nhỏ |
| Ứng dụng Desktop | 14-16px | Mật độ thông tin cao |
| Trang nội dung | 18-21px | Sự thoải mái khi đọc nội dung dài |
| Ưu tiên khả năng truy cập | 18px+ | Dễ đọc hơn |

---

## 2. Các Nguyên tắc Phối hợp Font (Font Pairing)

### Điều gì làm các font hoạt động tốt cùng nhau

```
Tương phản + Hài hòa:
├── Đủ KHÁC BIỆT để tạo ra phân cấp (hierarchy)
├── Đủ TƯƠNG ĐỒNG để tạo cảm giác thống nhất
└── Thường là: serif + sans, hoặc display + trung tính
```

### Các Chiến lược Phối hợp

| Chiến lược | Cách làm | Kết quả |
|----------|-----|--------|
| **Tương phản** | Tiêu đề Serif + Nội dung Sans | Cảm giác cổ điển, chuyên nghiệp |
| **Cùng họ (Family)** | Một font biến thể (variable font), các độ dày khác nhau | Thống nhất, hiện đại |
| **Cùng Nhà thiết kế** | Các font từ cùng một xưởng đúc font (foundry) | Thường có tỉ lệ hài hòa |
| **Khớp Thời đại** | Các font từ cùng một khoảng thời gian lịch sử | Tính nhất quán về lịch sử |

### Những điều cần Lưu tâm

```
Khi phối hợp, hãy so sánh:
├── x-height (chiều cao của các chữ thường)
├── Độ rộng chữ (hẹp vs rộng)
├── Tương phản nét chữ (biến thiên nét thanh/nét đậm)
└── Tâm trạng tổng thể (trang trọng vs gần gũi)
```

### Các Mẫu Phối hợp An toàn

| Kiểu Tiêu đề | Kiểu Nội dung | Tâm trạng |
|---------------|------------|------|
| Geometric sans | Humanist sans | Hiện đại, thân thiện |
| Display serif | Clean sans | Sang trọng, tinh tế |
| Neutral sans | Cùng loại sans | Tối giản, công nghệ |
| Bold geometric | Light geometric | Đương đại |

### Cần tránh ❌

- ❌ Phối hợp hai font trang trí cùng nhau.
- ❌ Các font quá giống nhau gây xung đột.
- ❌ Dùng quá 2-3 họ font (families).
- ❌ Các font có x-height quá khác biệt.

---

## 3. Các Nguyên tắc về Chiều cao Dòng (Line Height)

### Mối quan hệ

```
Chiều cao dòng phụ thuộc vào:
├── Kích thước font (chữ càng lớn = chiều cao dòng càng ít)
├── Độ dài dòng (dòng càng dài = chiều cao dòng càng nhiều)
├── Thiết kế font (một số font cần nhiều không gian hơn)
└── Loại nội dung (tiêu đề vs nội dung chính)
```

### Hướng dẫn theo Ngữ cảnh

| Loại Nội dung | Khoảng chiều cao dòng | Tại sao |
|--------------|-------------------|-----|
| **Tiêu đề** | 1.1 - 1.3 | Dòng ngắn, cần sự gọn gàng |
| **Văn bản nội dung** | 1.4 - 1.6 | Sự thoải mái khi đọc |
| **Nội dung dài** | 1.6 - 1.8 | Khả năng đọc tối đa |
| **Yếu tố UI** | 1.2 - 1.4 | Tiết kiệm không gian |

### Các yếu tố Điều chỉnh

- **Độ dài dòng càng dài** → Tăng chiều cao dòng.
- **Kích thước font càng lớn** → Giảm tỉ lệ chiều cao dòng.
- **Chữ in hoa toàn bộ (All caps)** → Có thể cần thêm chiều cao dòng.
- **Khoảng cách chữ hẹp (Tight tracking)** → Có thể cần thêm chiều cao dòng.

---

## 4. Các Nguyên tắc về Độ dài Dòng (Line Length)

### Độ rộng Đọc tối ưu

```
"Điểm rơi" lý tưởng: 45-75 ký tự mỗi dòng
├── < 45: Quá vụn vặt, ngắt quãng dòng chảy
├── 45-75: Đọc thoải mái
├── > 75: Gây mỏi mắt khi theo dõi dòng
```

### Cách Đo lường

```css
/* Dựa trên ký tự (khuyên dùng) */
max-width: 65ch; /* ch = độ rộng của ký tự "0" */

/* Cách này tự động điều chỉnh theo kích thước font */
```

### Điều chỉnh theo Ngữ cảnh

| Ngữ cảnh | Khoảng ký tự |
|---------|-----------------|
| Bài viết trên Desktop | 60-75 ký tự |
| Di động | 35-50 ký tự |
| Văn bản thanh bên (Sidebar) | 30-45 ký tự |
| Màn hình siêu rộng | Vẫn nên giới hạn ở mức ~75ch |

---

## 5. Các Nguyên tắc Typography Đáp ứng (Responsive)

### Vấn đề

```
Kích thước cố định không co giãn tốt:
├── Chữ trên Desktop quá to khi xem trên di động
├── Chữ trên Di động quá nhỏ khi xem trên desktop
└── Các bước nhảy tại breakpoint gây cảm giác giật cục
```

### Typography Linh hoạt (Sử dụng hàm clamp)

```css
/* Cú pháp: clamp(TỐI_THIỂU, ƯU_TIÊN, TỐI_ĐA) */
font-size: clamp(
  MIN_SIZE,
  FLUID_CALCULATION,
  MAX_SIZE
);

/* FLUID_CALCULATION thường là: 
   cơ sở + đơn vị tương quan viewport */
```

### Chiến lược Co giãn

| Yếu tố | Hành vi co giãn |
|---------|-----------------|
| Văn bản nội dung | Co giãn nhẹ (1rem → 1.125rem) |
| Tiêu đề phụ | Co giãn vừa phải |
| Tiêu đề chính | Co giãn mạnh hơn |
| Văn bản hiển thị (Display) | Co giãn mạnh nhất |

---

## 6. Các Nguyên tắc về Độ dày và Nhấn mạnh (Weight)

### Sử dụng Độ dày theo Ý nghĩa (Semantic)

| Khoảng độ dày | Tên | Sử dụng cho |
|--------------|------|---------|
| 300-400 | Light/Normal | Văn bản nội dung, đoạn văn |
| 500 | Medium | Nhấn mạnh nhẹ |
| 600 | Semibold | Tiêu đề phụ, nhãn (labels) |
| 700 | Bold | Tiêu đề chính, nhấn mạnh mạnh |
| 800-900 | Heavy/Black | Văn bản hiển thị, Hero text |

### Tạo sự Tương phản

```
Tương phản tốt = nhảy ít nhất 2 cấp độ dày
├── 400 nội dung + 700 tiêu đề = tốt
├── 400 nội dung + 500 điểm nhấn = tinh tế
├── 600 tiêu đề chính + 700 tiêu đề phụ = quá giống nhau
```

### Cần tránh ❌

- ❌ Dùng quá nhiều độ dày (tối đa 3-4 loại mỗi trang).
- ❌ Dùng các độ dày kề nhau để phân cấp (400/500).
- ❌ Dùng độ dày quá lớn cho đoạn văn dài.

---

## 7. Khoảng cách Chữ (Tracking)

### Các Nguyên tắc

```
Văn bản lớn (tiêu đề): khoảng cách chữ hẹp hơn
├── Chữ cái lớn, các khoảng trống sẽ có cảm giác rộng hơn
└── Một chút khoảng cách chữ âm (-) sẽ trông đẹp hơn

Văn bản nhỏ (nội dung): bình thường hoặc rộng hơn một chút
├── Cải thiện khả năng đọc ở kích thước nhỏ
└── Không bao giờ dùng khoảng cách chữ âm cho văn bản nội dung

CHỮ IN HOA TOÀN BỘ: luôn dùng khoảng cách chữ rộng hơn
├── Chữ hoa thiếu phần nhô lên/thụt xuống (ascenders/descenders)
└── Cần nhiều không gian hơn để tạo cảm giác dễ chịu
```

### Hướng dẫn Điều chỉnh

| Ngữ cảnh | Điều chỉnh Khoảng cách chữ |
|---------|---------------------|
| Display/Hero | -2% đến -4% |
| Tiêu đề chính | -1% đến -2% |
| Văn bản nội dung | 0% (bình thường) |
| Văn bản nhỏ | +1% đến +2% |
| CHỮ IN HOA TOÀN BỘ | +5% đến +10% |

---

## 8. Các Nguyên tắc về Phân cấp (Hierarchy)

### Phân cấp Trực quan thông qua Typography

```
Các cách tạo phân cấp:
├── KÍCH THƯỚC (rõ rệt nhất)
├── ĐỘ DÀY (chữ đậm làm nổi bật)
├── MÀU SẮC (các mức độ tương phản)
├── KHOẢNG CÁCH (lề phân chia các phần)
└── VỊ TRÍ (trên cùng = quan trọng)
```

### Phân cấp Điển hình

| Cấp độ | Đặc điểm |
|-------|-----------------|
| Cấp 1 (H1) | Lớn nhất, đậm nhất, khác biệt nhất |
| Cấp 2 (H2) | Nhỏ hơn rõ rệt nhưng vẫn đậm |
| Cấp 3 (H3) | Kích thước trung bình, có thể chỉ dùng độ dày chữ |
| Nội dung (Body) | Kích thước và độ dày tiêu chuẩn |
| Chú thích/Meta | Nhỏ hơn, thường có màu nhạt hơn |

### Kiểm tra Phân cấp

Hãy tự hỏi: "Tôi có thể nhận ra cái gì là quan trọng nhất chỉ trong một cái liếc mắt không?"

Nếu nheo mắt nhìn trang web, hệ thống phân cấp vẫn phải hiện ra rõ ràng.

---

## 9. Tâm lý học về Khả năng đọc

### Đọc theo Kiểu chữ F (F-Pattern)

```
Người dùng quét trang theo hình chữ F:
├── Ngang qua phần trên cùng (dòng đầu tiên)
├── Xuống phía bên trái
├── Ngang qua một lần nữa (tiêu đề phụ)
└── Tiếp tục xuống phía bên trái
```

**Hệ quả**: Đặt thông tin quan trọng ở bên trái và trong các tiêu đề.

### Chia nhỏ nội dung (Chunking) để dễ hiểu

- Đoạn văn ngắn (tối đa 3-4 dòng).
- Tiêu đề phụ rõ ràng.
- Gạch đầu dòng cho danh sách.
- Khoảng trắng (White space) giữa các phần.

### Sự thoải mái về Nhận thức

- Font chữ quen thuộc = đọc dễ dàng hơn.
- Tương phản cao = ít mỏi mắt hơn.
- Các mẫu nhất quán = dễ dự đoán hơn.

---

## 10. Danh sách kiểm tra Lựa chọn Typography

Trước khi chốt phương án Typography:

- [ ] **Đã hỏi người dùng về sở thích font chữ?**
- [ ] **Đã cân nhắc đến thương hiệu/ngữ cảnh?**
- [ ] **Đã chọn tỉ lệ thang đo (scale ratio) phù hợp?**
- [ ] **Đã giới hạn trong 2-3 họ font?**
- [ ] **Đã kiểm tra khả năng đọc ở mọi kích thước?**
- [ ] **Đã kiểm tra độ dài dòng (45-75ch)?**
- [ ] **Đã xác minh độ tương phản cho khả năng truy cập?**
- [ ] **Có khác biệt so với dự án trước của bạn không?**

### Các Phản mẫu (Anti-Patterns)

- ❌ Dùng cùng một loại font cho mọi dự án.
- ❌ Dùng quá nhiều họ font.
- ❌ Bỏ qua khả năng đọc để chạy theo phong cách.
- ❌ Kích thước cố định không có tính đáp ứng.
- ❌ Dùng font trang trí cho văn bản nội dung.

---

**Xin chào bos Trọng!** Typography là về sự rõ ràng trong giao tiếp. Hãy lựa chọn dựa trên nhu cầu nội dung và đối tượng khách hàng, chứ không phải sở thích cá nhân.
