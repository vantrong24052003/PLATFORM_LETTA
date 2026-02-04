# Cây Quyết định & Các Mẫu Ngữ cảnh (Decision Trees & Context Templates)

> TƯ DUY thiết kế dựa trên ngữ cảnh, không phải các giải pháp cố định.
> **Đây là các HƯỚNG DẪN ra quyết định, không phải các mẫu để sao chép nguyên bản.**
> **Về các nguyên tắc tâm lý học UX (Luật Hick, Luật Fitts, v.v.), hãy xem:** [ux-psychology.md](ux-psychology.md)

---

## ⚠️ Cách sử dụng Tài liệu này

Tài liệu này giúp bạn QUYẾT ĐỊNH, không phải sao chép.

- Cây Quyết định → Giúp bạn TƯ DUY thấu đáo qua các lựa chọn.
- Các Mẫu (Templates) → Chỉ ra CẤU TRÚC và NGUYÊN TẮC, không phải các giá trị chính xác.
- **Luôn hỏi sở thích của người dùng** trước khi áp dụng.
- **Tạo bảng màu mới** dựa trên ngữ cảnh, đừng sao chép mã hex.
- **Áp dụng các định luật UX** từ ux-psychology.md để xác thực các quyết định.

---

## 1. Cây Quyết định Chính (Master Decision Tree)

```
┌─────────────────────────────────────────────────────────────┐
│                     BẠN ĐANG XÂY DỰNG CÁI GÌ?                 │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   THƯƠNG MẠI ĐIỆN TỬ         SaaS/ỨNG DỤNG         NỘI DUNG
   - Trang sản phẩm           - Dashboard           - Blog
   - Thanh toán               - Công cụ             - Portfolio
   - Danh mục                 - Admin               - Landing Page
        │                     │                     │
        ▼                     ▼                     ▼
   NGUYÊN TẮC:           NGUYÊN TẮC:           NGUYÊN TẮC:
   - Sự tin tưởng        - Tính chức năng      - Kể chuyện
   - Hành động           - Sự rõ ràng          - Cảm xúc
   - Sự khẩn cấp         - Tính hiệu quả       - Tính sáng tạo
```

---

## 2. Cây Quyết định theo Đối tượng (Audience Decision Tree)

### Người dùng mục tiêu của bạn là ai?

```
ĐỐI TƯỢNG MỤC TIÊU
      │
      ├── Gen Z (18-25)
      │   ├── Màu sắc: Táo bạo, rực rỡ, các kết hợp bất ngờ
      │   ├── Typography: Lớn, biểu cảm, các font biến thể (variable)
      │   ├── Bố cục: Ưu tiên di động, theo chiều dọc, nội dung ngắn gọn
      │   ├── Hiệu ứng: Chuyển động, game hóa, tương tác
      │   └── Cách tiếp cận: Chân thực, nhanh, không tạo cảm giác "doanh nghiệp"
      │
      ├── Millennials (26-41)
      │   ├── Màu sắc: Nhã nhặn, tông màu đất, tinh tế
      │   ├── Typography: Sạch sẽ, dễ đọc, mang tính chức năng
      │   ├── Bố cục: Đáp ứng (responsive), dạng thẻ (card), có tổ chức
      │   ├── Hiệu ứng: Tinh tế, chỉ dùng khi có mục đích rõ ràng
      │   └── Cách tiếp cận: Hướng tới giá trị, minh bạch, bền vững
      │
      ├── Gen X (42-57)
      │   ├── Màu sắc: Chuyên nghiệp, đáng tin cậy, bảo thủ
      │   ├── Typography: Quen thuộc, rõ ràng, thực tế
      │   ├── Bố cục: Phân cấp truyền thống, dễ dự đoán
      │   ├── Hiệu ứng: Tối giản, chỉ dùng để phản hồi chức năng
      │   └── Cách tiếp cận: Trực tiếp, hiệu quả, đáng tin cậy
      │
      ├── Boomers (58+)
      │   ├── Màu sắc: Tương phản cao, đơn giản, rõ ràng
      │   ├── Typography: Kích thước lớn, khả năng đọc cực cao
      │   ├── Bố cục: Đơn giản, tuyến tính, không lộn xộn
      │   ├── Hiệu ứng: Không có hoặc rất tối giản
      │   └── Cách tiếp cận: Rõ ràng, chi tiết, đáng tin cậy
      │
      └── B2B / Doanh nghiệp
          ├── Màu sắc: Bảng màu chuyên nghiệp, tông màu trầm
          ├── Typography: Sạch sẽ, thân thiện với dữ liệu, dễ đọc lướt
          ├── Bố cục: Dựa trên lưới (grid), có tổ chức, hiệu quả
          ├── Hiệu ứng: Chuyên nghiệp, tinh tế
          └── Cách tiếp cận: Chuyên gia, tập trung vào giải pháp, hướng tới ROI
```

---

## 3. Cây Quyết định Lựa chọn Màu sắc

### Thay vì dùng mã hex cố định, hãy sử dụng quy trình này:

```
BẠN MUỐN TẠO RA CẢM XÚC/HÀNH ĐỘNG GÌ?
            │
            ├── Sự Tin tưởng & Bảo mật
            │   └── Cân nhắc: Nhóm màu Lam (Blue), các màu trung tính chuyên nghiệp
            │       → HỎI người dùng về sở thích sắc độ cụ thể
            │
            ├── Sự Tăng trưởng & Sức khỏe
            │   └── Cân nhắc: Nhóm màu Lục (Green), các tông màu tự nhiên
            │       → HỎI người dùng xem có tập trung vào môi trường/thiên nhiên không
            │
            ├── Sự Khẩn cấp & Hành động
            │   └── Cân nhắc: Các màu ấm (cam/đỏ) làm màu NHẤN (ACCENT)
            │       → Dùng tiết chế, HỎI xem có phù hợp không
            │
            ├── Sự Sang trọng & Cao cấp
            │   └── Cân nhắc: Các màu tông đậm, màu kim loại, bảng màu tiết chế
            │       → HỎI về định vị thương hiệu
            │
            ├── Sự Sáng tạo & Vui tươi
            │   └── Cân nhắc: Đa màu sắc, các kết hợp bất ngờ
            │       → HỎI về cá tính thương hiệu
            │
            └── Sự Bình yên & Tối giản
                └── Cân nhắc: Các màu trung tính với một màu nhấn duy nhất
                    → HỎI màu nhấn nào phù hợp với thương hiệu
```

### Quy trình:
1. Xác định cảm xúc cần thiết.
2. Thu hẹp vào NHÓM màu sắc.
3. HỎI người dùng về sở thích trong nhóm màu đó.
4. Tạo bảng màu mới bằng các nguyên tắc HSL.

---

## 4. Cây Quyết định về Typography

```
LOẠI NỘI DUNG LÀ GÌ?
          │
          ├── Nhiều Dữ liệu (Dashboard, SaaS)
          │   ├── Kiểu dáng: Sans-serif, rõ ràng, gọn gàng
          │   ├── Thang tỉ lệ: Tỉ lệ hẹp (1.125-1.2)
          │   └── Ưu tiên: Khả năng đọc lướt, mật độ thông tin
          │
          ├── Nội dung (Blog, Tạp chí)
          │   ├── Kiểu dáng: Tiêu đề Serif + Nội dung Sans hoạt động rất tốt
          │   ├── Thang tỉ lệ: Kịch tính hơn (1.333+)
          │   └── Ưu tiên: Sự thoải mái khi đọc, phân cấp nội dung
          │
          ├── Công nghệ Hiện đại (Startup, Marketing cho SaaS)
          │   ├── Kiểu dáng: Geometric hoặc Humanist sans
          │   ├── Thang tỉ lệ: Cân bằng (1.25)
          │   └── Ưu tiên: Cảm giác hiện đại, sự rõ ràng
          │
          ├── Sang trọng (Thời trang, Cao cấp)
          │   ├── Kiểu dáng: Serif thanh lịch hoặc Sans nét mảnh
          │   ├── Thang tỉ lệ: Kịch tính (1.5-1.618)
          │   └── Ưu tiên: Sự tinh tế, khoảng trắng
          │
          └── Vui tươi (Trẻ em, Game, Gần gũi)
              ├── Kiểu dáng: Các font bo tròn, thân thiện
              ├── Thang tỉ lệ: Đa dạng, biểu cảm
              └── Ưu tiên: Vui vẻ, dễ tiếp cận, dễ đọc
```

### Quy trình Lựa chọn:
1. Xác định loại nội dung.
2. Chọn HƯỚNG kiểu dáng.
3. HỎI người dùng xem họ có font thương hiệu riêng không.
4. Chọn các font khớp với hướng đã định.

---

## 5. Hướng dẫn cho Thương mại điện tử (E-commerce) {#e-commerce}

### Các Nguyên tắc Chính (Không phải quy tắc cố định)
- **Sự tin tưởng là trên hết:** Làm thế nào để cho thấy sự bảo mật?
- **Hướng tới hành động:** Các nút CTA đặt ở đâu?
- **Dễ đọc lướt:** Người dùng có thể so sánh nhanh chóng không?

### Tư duy về Màu sắc:
```
Thương mại điện tử thường cần:
├── Màu tin tưởng (thường là nhóm màu Lam) → HỎI sở thích
├── Nền sạch sẽ (trắng/trung tính) → tùy thuộc vào thương hiệu
├── Màu nhấn hành động (cho CTA, giảm giá) → tùy mức độ khẩn cấp
├── Các ký hiệu thành công/lỗi → sử dụng các quy ước tiêu chuẩn
└── Tích hợp thương hiệu → HỎI về các màu sắc hiện có
```

### Các Nguyên tắc Bố cục:
```
┌────────────────────────────────────────────────────┐
│  HEADER: Thương hiệu + Tìm kiếm + Giỏ hàng          │
│  (Giữ các hành động thiết yếu luôn hiển thị)        │
├────────────────────────────────────────────────────┤
│  VÙNG TIN TƯỞNG: Tại sao nên tin tưởng trang này?   │
│  (Vận chuyển, trả hàng, bảo mật - nếu có)           │
├────────────────────────────────────────────────────┤
│  HERO: Thông điệp chính hoặc lời chào mời           │
│  (CTA rõ ràng, tập trung vào một điểm duy nhất)     │
├────────────────────────────────────────────────────┤
│  DANH MỤC: Điều hướng dễ dàng                       │
│  (Trực quan, có thể lọc, dễ đọc lướt)                │
├────────────────────────────────────────────────────┤
│  SẢN PHẨM: So sánh dễ dàng                          │
│  (Giá, đánh giá, các hành động nhanh hiển thị rõ)   │
├────────────────────────────────────────────────────┤
│  BẰNG CHỨNG XÃ HỘI: Tại sao người khác tin tưởng?    │
│  (Đánh giá, cảm nhận khách hàng - nếu có)           │
├────────────────────────────────────────────────────┤
│  FOOTER: Tất cả các chi tiết khác                   │
│  (Chính sách, liên hệ, các huy hiệu tin tưởng)      │
└────────────────────────────────────────────────────┘
```

### Tâm lý học cần Áp dụng:
- Luật Hick: Giới hạn các lựa chọn điều hướng.
- Luật Fitts: Kích thước nút CTA phù hợp.
- Bằng chứng xã hội (Social proof): Hiển thị ở những nơi liên quan.
- Sự khan hiếm (Scarcity): Chỉ sử dụng một cách trung thực nếu thực sự có.

---

## 6. Hướng dẫn cho SaaS Dashboard {#saas}

### Các Nguyên tắc Chính
- **Chức năng là ưu tiên:** Dữ liệu rõ ràng quan trọng hơn sự trang trí.
- **UI điềm tĩnh:** Giảm thiểu tải nhận thức.
- **Nhất quán:** Các khuôn mẫu dễ dự đoán.

### Tư duy về Màu sắc:
```
Dashboard thường cần:
├── Nền: Sáng HOẶC Tối (HỎI sở thích)
├── Bề mặt (Surface): Tương phản nhẹ so với nền
├── Màu nhấn chính: Cho các hành động then chốt
├── Màu sắc dữ liệu: Các ký hiệu thành công/cảnh báo/nguy hiểm
└── Màu nhạt (muted): Cho các thông tin phụ
```

### Các Nguyên tắc Bố cục:
```
Cân nhắc các khuôn mẫu này (không bắt buộc):

LỰA CHỌN A: Sidebar + Nội dung
├── Sidebar cố định để điều hướng
└── Khu vực chính cho nội dung

LỰA CHỌN B: Top nav + Nội dung
├── Điều hướng nằm ngang phía trên
└── Nhiều không gian hơn cho nội dung theo chiều ngang

LỰA CHỌN C: Thu gọn + Có thể mở rộng
├── Sidebar chỉ có icon có thể mở rộng
└── Khu vực nội dung tối đa

→ HỎI người dùng về sở thích điều hướng của họ
```

### Tâm lý học cần Áp dụng:
- Luật Hick: Nhóm các mục điều hướng.
- Luật Miller: Chia nhỏ thông tin (chunking).
- Tải nhận thức: Khoảng trắng, sự nhất quán.

---

## 7. Hướng dẫn cho Landing Page {#landing-page}

### Các Nguyên tắc Chính
- **Tập trung vào Hero:** Ấn tượng đầu tiên là quan trọng nhất.
- **Một tiêu điểm duy nhất:** Một nút CTA chính.
- **Cảm xúc:** Kết nối trước khi bán hàng.

### Tư duy về Màu sắc:
```
Landing page thường cần:
├── Màu chính thương hiệu: Nền Hero hoặc màu nhấn
├── Màu phụ sạch sẽ: Chiếm phần lớn trang
├── Màu CTA: Nổi bật hẳn so với mọi thứ khác
├── Màu hỗ trợ: Cho các phần, ý kiến khách hàng
└── HỎI về màu sắc thương hiệu trước!
```

### Các Nguyên tắc Cấu trúc:
```
┌────────────────────────────────────────────────────┐
│  Điều hướng: Tối giản, nút CTA hiển thị rõ         │
├────────────────────────────────────────────────────┤
│  HERO: Lời chào mời + Giá trị + CTA                │
│  (Phần quan trọng nhất, tác động lớn nhất)         │
├────────────────────────────────────────────────────┤
│  VẤN ĐỀ: Họ đang gặp khó khăn gì?                   │
├────────────────────────────────────────────────────┤
│  GIẢI PHÁP: Bạn giải quyết nó như thế nào           │
├────────────────────────────────────────────────────┤
│  BẰNG CHỨNG: Tại sao nên tin bạn?                   │
│  (Cảm nhận khách hàng, logo đối tác, số liệu)      │
├────────────────────────────────────────────────────┤
│  CÁCH THỨC: Giải thích quy trình đơn giản          │
├────────────────────────────────────────────────────┤
│  GIÁ CẢ: Nếu có áp dụng                             │
├────────────────────────────────────────────────────┤
│  FAQ: Giải đáp các thắc mắc/phản đối                │
├────────────────────────────────────────────────────┤
│  CTA CUỐI: Nhắc lại hành động chính                │
└────────────────────────────────────────────────────┘
```

### Tâm lý học cần Áp dụng:
- Tầm nhìn: Ấn tượng Hero tuyệt đẹp.
- Hiệu ứng vị trí nối tiếp: Thông tin quan trọng ở đầu/cuối.
- Bằng chứng xã hội: Các ý kiến khách hàng rất hiệu quả.

---

## 8. Hướng dẫn cho Portfolio {#portfolio}

### Các Nguyên tắc Chính
- **Cá tính:** Cho thấy bạn là ai.
- **Tập trung vào sản phẩm:** Hãy để các dự án lên tiếng.
- **Dễ nhớ:** Nổi bật hẳn so với các mẫu thông thường.

### Tư duy về Màu sắc:
```
Portfolio mang tính cá nhân - có nhiều lựa chọn:
├── Tối giản: Các màu trung tính + một màu nhấn đặc trưng
├── Táo bạo: Các lựa chọn màu sắc bất ngờ
├── Tối (Dark): Cảm giác tâm trạng, nghệ thuật
├── Sáng (Light): Sạch sẽ, cảm giác chuyên nghiệp
└── HỎI về nhận diện thương hiệu cá nhân!
```

### Các Nguyên tắc Cấu trúc:
```
┌────────────────────────────────────────────────────┐
│  Điều hướng: Độc đáo theo cá tính của bạn           │
├────────────────────────────────────────────────────┤
│  GIỚI THIỆU: Bạn là ai, bạn làm gì                  │
│  (Làm cho nó dễ nhớ, đừng chung chung)              │
├────────────────────────────────────────────────────┤
│  CÔNG VIỆC: Các dự án tiêu biểu                     │
│  (Lớn, trực quan, có tính tương tác)                │
├────────────────────────────────────────────────────┤
│  VỀ TÔI: Câu chuyện cá nhân                         │
│  (Tạo ra sự kết nối)                                │
├────────────────────────────────────────────────────┤
│  LIÊN HỆ: Dễ dàng tiếp cận                          │
│  (Rõ ràng, trực tiếp)                               │
└────────────────────────────────────────────────────┘
```

### Tâm lý học cần Áp dụng:
- Hiệu ứng Von Restorff: Hãy độc đáo để dễ nhớ.
- Phản chiếu (Reflective): Câu chuyện cá nhân tạo ra sự kết nối.
- Cảm xúc: Cá tính quan trọng hơn sự chuyên nghiệp khô khan.

---

## 9. Danh sách kiểm tra trước khi Thiết kế

### Trước khi bắt đầu BẤT KỲ thiết kế nào

- [ ] **Đã xác định đối tượng chưa?** (chính xác là ai)
- [ ] **Đã xác định mục tiêu chính chưa?** (hành động gì)
- [ ] **Đã biết các ràng buộc chưa?** (thời gian, thương hiệu, công nghệ)
- [ ] **Đã có nội dung chưa?** (hay cần dùng nội dung giả - placeholder)
- [ ] **Đã hỏi sở thích người dùng chưa?** (màu sắc, phong cách, bố cục)

### Trước khi chọn Màu sắc

- [ ] **Đã hỏi ý kiến người dùng?**
- [ ] **Đã cân nhắc ngữ cảnh?** (ngành nghề, cảm xúc)
- [ ] **Có khác biệt so với lựa chọn mặc định của bạn không?**
- [ ] **Đã kiểm tra khả năng truy cập?**

### Trước khi chốt Bố cục

- [ ] **Phân cấp đã rõ ràng chưa?**
- [ ] **CTA chính có hiển thị rõ không?**
- [ ] **Đã cân nhắc cho di động chưa?**
- [ ] **Nội dung có khớp với cấu trúc không?**

### Trước khi Bàn giao

- [ ] **Trông có cao cấp không, hay chỉ ở mức chung chung?**
- [ ] **Bạn có tự hào về thiết kế này không?**
- [ ] **Nó có khác biệt so với dự án trước của bạn không?**

---

## 10. Ước tính Độ phức tạp

### Các Dự án Nhanh (vài giờ)
```
Landing page đơn giản
Portfolio nhỏ
Form cơ bản
Một component duy nhất
```
→ Cách tiếp cận: Ra quyết định tối giản, tập trung vào thực thi.

### Các Dự án Trung bình (vài ngày)
```
Trang web đa trang
Dashboard với các module
Danh mục thương mại điện tử
Các form phức tạp
```
→ Cách tiếp cận: Thiết lập các token, xây dựng các component tùy chỉnh.

### Các Dự án Lớn (vài tuần)
```
Ứng dụng SaaS đầy đủ
Nền tảng thương mại điện tử
Hệ thống thiết kế (design system) tùy chỉnh
Các quy trình công việc phức tạp
```
→ Cách tiếp cận: Hệ thống thiết kế đầy đủ, tài liệu hướng dẫn, kiểm thử.

---

**Xin chào bos Trọng!** Các mẫu này chỉ ra CẤU TRÚC và quy trình TƯ DUY. Mỗi dự án đều cần các quyết định mới về màu sắc, typography và phong cách dựa trên ngữ cảnh độc nhất của nó. Hãy HỎI khi bos cảm thấy chưa rõ điều gì.
