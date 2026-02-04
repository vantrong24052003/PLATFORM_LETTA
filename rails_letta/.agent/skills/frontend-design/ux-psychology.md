# Tham chiếu Tâm lý học UX (UX Psychology Reference)

> Đi sâu vào các định luật UX, thiết kế cảm xúc, xây dựng niềm tin và tâm lý học hành vi.

---

## 1. Các Định luật UX Cốt lõi

### Định luật Hick (Hick's Law)

**Nguyên sắc:** Thời gian để đưa ra quyết định tăng theo hàm logarit với số lượng lựa chọn.

```
Thời gian Quyết định = a + b × log₂(n + 1)
Trong đó n = số lượng lựa chọn
```

**Ứng dụng:**
- Menu điều hướng: Tối đa 5-7 mục cấp cao nhất
- Form: Chia nhỏ thành các bước (tiết lộ lũy tiến - progressive disclosure)
- Tùy chọn: Đặt sẵn các lựa chọn mặc định khi có thể
- Bộ lọc: Ưu tiên các bộ lọc hay dùng nhất, ẩn các bộ lọc nâng cao

**Ví dụ:**
```
❌ Sai: 15 mục menu trong một thanh điều hướng
✅ Đúng: 5 danh mục chính + "Thêm" (More)

❌ Sai: 20 trường trong form cùng một lúc
✅ Đúng: Quy trình 3 bước với 5-7 trường mỗi bước
```

---

### Định luật Fitts (Fitts' Law)

**Nguyên tắc:** Thời gian để chạm tới mục tiêu là một hàm của khoảng cách và kích thước.

```
MT = a + b × log₂(1 + D/W)
Trong đó D = khoảng cách, W = chiều rộng
```

**Ứng dụng:**
- CTAs: Làm cho các nút chính lớn hơn (chiều cao tối thiểu 44px)
- Mục tiêu chạm: Tối thiểu 44×44px trên di động
- Vị trí: Đặt các hành động quan trọng gần vị trí con trỏ tự nhiên
- Các góc: "Các góc ma thuật" (Magic corners - cạnh vô tận = cực kỳ dễ chạm)

**Kích thước Nút:**
```css
/* Sắp xếp theo mức độ quan trọng */
.btn-primary { height: 48px; padding: 0 24px; }
.btn-secondary { height: 40px; padding: 0 16px; }
.btn-tertiary { height: 36px; padding: 0 12px; }

/* Mục tiêu chạm trên di động */
@media (hover: none) {
  .btn { min-height: 44px; min-width: 44px; }
}
```

---

### Định luật Miller (Miller's Law)

**Nguyên tắc:** Một người bình thường chỉ có thể giữ được 7±2 mảnh thông tin (chunks) trong bộ nhớ làm việc.

**Ứng dụng:**
- Danh sách: Nhóm thành các mẫu 5-7 mục
- Điều hướng: Tối đa 7 mục menu
- Nội dung: Chia nhỏ nội dung dài bằng các tiêu đề
- Số điện thoại: 555-123-4567 (đã chia nhóm)

**Ví dụ về Chia vốn (Chunking):**
```
❌ 5551234567
✅ 555-123-4567

❌ Đoạn văn bản dài không có điểm ngắt
✅ Các đoạn văn ngắn
   Kèm gạch đầu dòng
   Và tiêu đề phụ
```

---

### Hiệu ứng Von Restorff (Hiệu ứng Cô lập)

**Nguyên tắc:** Một mục nổi bật hẳn so với các mục khác sẽ dễ được ghi nhớ hơn.

**Ứng dụng:**
- Nút CTA: Sử dụng màu sắc khác biệt hoàn toàn với các phần tử khác
- Bảng giá: Làm nổi bật gói dịch vụ được đề xuất
- Thông tin quan trọng: Sử dụng các dấu hiệu nhận diện trực quan
- Các tính năng mới: Thêm nhãn (badge) hoặc các ghi chú nổi bật

**Ví dụ:**
```css
/* Mọi nút màu xám, nút chính nổi bật hẳn */
.btn { background: #E5E7EB; }
.btn-primary { background: #3B82F6; }

/* Gói dịch vụ được đề xuất được làm nổi bật */
.pricing-card { border: 1px solid #E5E7EB; }
.pricing-card.popular {
  border: 2px solid #3B82F6;
  box-shadow: var(--shadow-lg);
}
```

---

### Hiệu ứng Vị trí Nối tiếp (Serial Position Effect)

**Nguyên tắc:** Các mục ở đầu (ưu tiên đầu - primacy) và ở cuối (ưu tiên cuối - recency) của một danh sách sẽ được ghi nhớ tốt nhất.

**Ứng dụng:**
- Điều hướng: Đặt các mục quan trọng nhất ở đầu và cuối
- Danh sách: Các thông tin then chốt ở trên cùng và dưới cùng
- Form: Các trường bắt buộc/quan trọng ở đầu
- CTAs: Nhắc lại nút bấm ở đầu và cuối của các trang dài

**Ví dụ:**
```
Điều hướng: Trang chủ | [các mục khác] | Liên hệ

Trang landing page dài:
- CTA ở phần hero (trên cùng)
- Các section nội dung
- CTA được lặp lại ở dưới cùng
```

### Định luật Jakob (Jakob’s Law)

**Nguyên tắc:** Người dùng dành phần lớn thời gian trên CÁC trang web khác. Họ muốn trang web của bạn hoạt động giống như tất cả các trang khác mà họ đã biết.

**Ứng dụng:**
- **Các mẫu (Patterns):** Sử dụng các vị trí tiêu chuẩn cho thanh tìm kiếm và giỏ hàng.
- **Mô hình Tâm trí (Mental Models):** Sử dụng các biểu tượng quen thuộc (Vd: kính lúp cho tìm kiếm).
- **Từ vựng (Vocabulary):** Dùng "Đăng nhập" thay vì "Vào cổng thông tin."
- **Bố cục (Layout):** Để logo ở góc trên bên trái để liên kết về "Trang chủ."
- **Tương tác (Interaction):** Vuốt sang phải để quay lại/tiếp tục nên mang lại cảm giác tự nhiên.
- **Phản hồi (Feedback):** Màu sắc tiêu chuẩn (Đỏ = Lỗi, Xanh lá = Thành công).

**Ví dụ:**
```
❌ Sai: Một trang web mà khi nhấn vào logo lại dẫn đến trang "Về chúng tôi."
✅ Đúng: Nhấn vào logo luôn đưa người dùng trở lại Trang chủ.

❌ Sai: Dùng biểu tượng "Ngôi sao" để đại diện cho việc "Xóa."
✅ Đúng: Dùng biểu tượng "Thùng rác" để đại diện cho việc "Xóa."
```

---

### Định luật Tesler (Bảo toàn sự Phức tạp)

**Nguyên tắc:** Trong bất kỳ hệ thống nào, luôn có một lượng phức tạp nhất định không thể cắt giảm được, nó chỉ có thể được chuyển dịch từ người dùng sang phần mềm (hoặc ngược lại).

**Ứng dụng:**
- **Backend:** Để hệ thống xử lý các định dạng (Vd: tiền tệ).
- **Phát hiện (Detection):** Tự động phát hiện loại thẻ hoặc thành phố thông qua mã bưu điện.
- **Tự động hóa (Automation):** Điền sẵn dữ liệu cho người dùng quay lại.
- **Cá nhân hóa (Personalization):** Chỉ hiển thị các trường liên quan dựa trên các câu trả lời trước đó.
- **Mặc định (Defaults):** Sử dụng các giá trị mặc định thông minh cho các cài đặt thông dụng.
- **Tích hợp:** Sử dụng SSO (Đăng nhập mạng xã hội) để giảm bớt ma sát khi đăng ký.

**Ví dụ:**
```
❌ Sai: Bắt người dùng gõ "USD $" vào mọi trường giá tiền trong form.
✅ Đúng: Ứng dụng tự động thêm tiền tố "$" dựa trên vị trí của người dùng.

❌ Sai: Ép người dùng tự chọn loại thẻ (Visa/Mastercard).
✅ Đúng: Tự động phát hiện loại thẻ từ 4 chữ số đầu tiên được nhập.
```

---

### Định luật Parkinson (Parkinson’s Law)

**Nguyên tắc:** Bất kỳ nhiệm vụ nào cũng sẽ phình to ra cho đến khi chiếm hết thời gian rảnh rỗi.

**Ứng dụng:**
- **Hiệu quả:** Dùng "Tự động lưu" (Auto-save) để giảm thời gian hoàn thành nhiệm vụ.
- **Tốc độ:** Giới hạn các bước trong phễu chuyển đổi.
- **Sự rõ ràng:** Dùng nhãn rõ ràng để ngăn người dùng phải "rê chuột thăm dò" ý nghĩa.
- **Phản hồi:** Xác thực theo thời gian thực để ngăn người dùng lãng phí thời gian vào các lỗi.
- **Onboarding:** Cài đặt nhanh "Express" cho người dùng nâng cao.
- **Ràng buộc:** Đặt giới hạn ký tự trên các trường nhập liệu để tập trung tư duy.

**Ví dụ:**
```
❌ Sai: Form đăng ký 10 trang cho phép người dùng lướt đi chỗ khác và mất dữ liệu.
✅ Đúng: "Đăng nhập một chạm" bằng Google hoặc Apple ID.

❌ Sai: Cho người dùng thời gian vô tận để viết tiểu sử.
✅ Đúng: Cung cấp tính năng "Tiểu sử gợi ý" để giúp họ hoàn thành trong vài giây.
```

---

### Ngưỡng Doherty (Doherty Threshold)

**Nguyên tắc:** Năng suất tăng vọt khi máy tính và người dùng tương tác với tốc độ (<400ms) đảm bảo không bên nào phải chờ đợi bên kia.

**Ứng dụng:**
- **Phản hồi:** Sử dụng các tín hiệu trực quan ngay lập tức khi nhấn chuột.
- **Tải trang:** Sử dụng skeleton screens (màn hình khung xương) để cải thiện cảm nhận về hiệu suất.
- **Lạc quan (Optimism):** Cập nhật UI trước khi server phản hồi (Optimistic UI).
- **Chuyển động:** Sử dụng micro-animations để che lấp các sự trì hoãn nhỏ.
- **Bộ nhớ đệm (Caching):** Tải trước các trang hoặc tài nguyên tiếp theo dưới nền.
- **Ưu tiên:** Tải nội dung văn bản trước các hình ảnh nặng, độ phân giải cao.

**Ví dụ:**
```
❌ Sai: Một nút bấm không có phản ứng gì trong 2 giây sau khi được nhấn.
✅ Đúng: Nút bấm lập tức đổi màu và hiển thị vòng xoay "Đang tải."

❌ Sai: Màn hình trắng trơn xuất hiện trong lúc chờ lấy dữ liệu.
✅ Đúng: Skeleton screen hiển thị các khung xám nơi nội dung sẽ xuất hiện.
```

---

### Định luật Postel (Nguyên tắc Bền vững)

**Nguyên tắc:** Khắt khe với những gì bạn làm, nhưng dễ tính với những gì bạn chấp nhận từ người khác.

**Ứng dụng:**
- **Xử lý lỗi:** Đừng báo lỗi chỉ vì thiếu một dấu cách hoặc dấu gạch ngang.
- **Định dạng:** Chấp nhận ngày tháng theo cả hai kiểu DD/MM/YYYY hoặc MM/DD/YYYY.
- **Nhập liệu:** Tự động loại bỏ khoảng trắng thừa ở đầu/cuối.
- **Dự phòng (Fallbacks):** Sử dụng avatar mặc định nếu người dùng chưa tải ảnh lên.
- **Tìm kiếm:** Chấp nhận lỗi chính tả và đưa ra gợi ý "Có phải bạn muốn tìm...?".
- **Khả năng truy cập:** Đảm bảo trang web hoạt động trên mọi trình duyệt và thiết bị.

**Ví dụ:**
```
❌ Sai: Từ chối số điện thoại vì người dùng nhập thêm dấu cách.
✅ Đúng: Chấp nhận đầu vào và tự động loại bỏ khoảng trắng.

❌ Sai: Bắt buộc người dùng nhập "January" thay vì "01" hoặc "Jan".
✅ Đúng: Trường ngày tháng hiểu được cả ba định dạng.
```

---

### Dao cạo Occam (Occam’s Razor)

**Nguyên tắc:** Giữa các giả thuyết cạnh tranh dự đoán tốt như nhau, giả thuyết nào có ít giả định nhất nên được chọn. Giải pháp đơn giản nhất thường là giải pháp tốt nhất.

**Ứng dụng:**
- **Logic:** Loại bỏ các cú click không cần thiết.
- **Hình ảnh:** Chỉ sử dụng số lượng font/màu sắc thực sự cần thiết.
- **Chức năng:** Nếu một trường có thể làm việc của hai trường, hãy gộp chúng lại.
- **Nội dung:** Sử dụng văn bản ngắn nhất có thể để truyền tải ý nghĩa.
- **Bố cục:** Loại bỏ các yếu tố trang trí không phục vụ mục tiêu.
- **Luồng:** Tránh phân nhánh trừ khi thực sự bắt buộc.

**Ví dụ:**
```
❌ Sai: Nút "Đăng nhập" mở ra trang mới, sau đó nhập email, rồi mới đến mật khẩu.
✅ Đúng: Một modal đăng nhập duy nhất hỏi cả hai thông tin trên cùng một màn hình.

❌ Sai: Sử dụng 5 cỡ chữ và 4 màu sắc khác nhau trên một thẻ (card).
✅ Đúng: Sử dụng 2 cỡ chữ và 1 màu nhấn.
```

---

## 2. Nhận thức Trực quan (Nguyên tắc Gestalt)

### Định luật Gần (Law of Proximity)

**Nguyên tắc:** Các đối tượng ở gần nhau có xu hướng được nhóm lại với nhau.

**Ứng dụng:**
- **Nhóm:** Đặt nhãn (label) gần sát với trường nhập liệu (input).
- **Khoảng cách:** Dùng lề rộng hơn giữa các khối nội dung không liên quan.
- **Thẻ (Cards):** Văn bản trong thẻ nên gần hình ảnh của nó hơn là đường viền.
- **Chân trang (Footers):** Nhóm các liên kết pháp lý lại với nhau, tách biệt khỏi liên kết mạng xã hội.
- **Điều hướng:** Nhóm cài đặt "Người dùng" tách biệt với cài đặt "Ứng dụng".
- **Form:** Nhóm các trường Địa chỉ lại với nhau, tách biệt với các trường Thẻ tín dụng.

**Ví dụ:**
```
❌ Sai: Khoảng cách đều nhau và lớn giữa mọi dòng văn bản trong form.
✅ Đúng: Khoảng cách hẹp giữa nhãn và input tương ứng, khoảng cách lớn hơn giữa các cặp.

❌ Sai: Nút "Gửi" nằm lơ lửng giữa trang, xa rời form.
✅ Đúng: Nút "Gửi" đặt ngay dưới trường nhập liệu cuối cùng.
```

---

### Định luật Đồng dạng (Law of Similarity)

**Nguyên tắc:** Mắt người có xu hướng nhận thức các yếu tố tương tự nhau trong thiết kế là một bức tranh, hình dạng hoặc nhóm hoàn chỉnh, ngay cả khi các yếu tố đó bị tách biệt.

**Ứng dụng:**
- **Nhất quán:** Màu sắc nhất quán cho tất cả các liên kết có thể click.
- **Biểu tượng:** Tất cả icon trong bộ phải có cùng độ dày nét.
- **Nút:** Cùng hình dạng/kích thước cho các nút có cùng mức độ quan trọng.
- **Typography:** Sử dụng cùng kiểu H2 cho tất cả các tiêu đề phần.
- **Phản hồi:** Tất cả hành động "Xóa" nên dùng cùng một màu (Vd: Đỏ).
- **Trạng thái:** Trạng thái Hover và Active phải nhất quán trên toàn ứng dụng.

**Ví dụ:**
```
❌ Sai: Một số link màu xanh, một số màu xanh lá, số khác chỉ là màu đen đậm.
✅ Đúng: Mọi phần tử văn bản click được trong app đều cùng một màu Xanh.

❌ Sai: Dùng "Nút Xanh" cho "Gửi" và cũng dùng "Nút Xanh" đó cho "Hủy".
✅ Đúng: "Gửi" là Nút Xanh Đậm; "Hủy" là Nút Viền Xanh (Ghost Button).
```

---

### Định luật Vùng chung (Law of Common Region)

**Nguyên tắc:** Các yếu tố có xu hướng được nhận thức thành nhóm nếu chúng cùng chia sẻ một khu vực có ranh giới rõ ràng.

**Ứng dụng:**
- **Chứa đựng:** Dùng thẻ (card) để nhóm hình ảnh và tiêu đề.
- **Đường viền:** Dùng đường kẻ để tách thanh bên (sidebar) khỏi luồng chính.
- **Nền:** Dùng màu nền khác cho chân trang (footer).
- **Modals:** Dùng hộp riêng biệt để tách pop-up khỏi trang.
- **Danh sách:** Màu nền xen kẽ (zebra striping) cho các hàng.
- **Header:** Một thanh đặc chạy ngang trên cùng để nhóm các mục điều hướng.

**Ví dụ:**
```
❌ Sai: Danh sách tin tức mà văn bản và hình ảnh của các tin khác nhau chồng chéo.
✅ Đúng: Mỗi bài viết nằm gọn trong thẻ trắng riêng trên nền xám nhạt.

❌ Sai: Footer có cùng màu nền với thân trang chính.
✅ Đúng: Footer tối màu tách biệt rõ ràng các liên kết pháp lý khỏi nội dung trang.
```

---

### Định luật Kết nối Đồng nhất (Law of Uniform Connectedness)

**Nguyên tắc:** Các yếu tố được kết nối trực quan (ví dụ: qua đường kẻ, mũi tên) được nhận thức là có liên quan nhiều hơn so với các yếu tố không có kết nối.

**Ứng dụng:**
- **Luồng:** Dùng đường kẻ nối các bước trong trình hướng dẫn tiến độ (wizard).
- **Menu:** Dropdown "chạm" hoặc nối liền với nút cha của nó.
- **Biểu đồ:** Đường kẻ nối các điểm dữ liệu trong biểu đồ.
- **Mối quan hệ:** Nối công tắc gạt (toggle) với văn bản mà nó điều khiển.
- **Phân cấp:** Cấu trúc cây cho thư mục tệp tin.
- **Form:** Kết nối nút chọn "Thẻ tín dụng" với khung nhập liệu bên dưới nó.

**Ví dụ:**
```
❌ Sai: Quy trình 3 bước mà các số "1", "2", và "3" nằm rải rác.
✅ Đúng: Một đường ngang nối "1", "2", và "3" để hiển thị trình tự.

❌ Sai: Menu thả xuống lơ lửng không chạm vào nút đã mở nó.
✅ Đúng: Menu thả xuống gắn liền trực quan với nút cha.
```

---

### Định luật Tối giản (Law of Prägnanz)

**Nguyên tắc:** Mọi người sẽ nhận thức và diễn giải các hình ảnh mơ hồ hoặc phức tạp thành dạng đơn giản nhất có thể, vì đó là cách diễn giải tốn ít nỗ lực nhận thức nhất.

**Ứng dụng:**
- **Rõ ràng:** Dùng icon hình học rõ ràng cho điều hướng.
- **Giảm bớt:** Loại bỏ các kết cấu 3D hoặc bóng đổ không cần thiết.
- **Hình dạng:** Ưu tiên hình chữ nhật/tròn tiêu chuẩn hơn các đa giác phức tạp.
- **Tập trung:** Dùng hình bóng (silhouettes) tương phản cao cho các hành động chính.
- **Logo:** Dấu ấn thương hiệu đơn giản, dễ nhận biết ở kích thước nhỏ.
- **UX:** Một mục tiêu chính mỗi trang để giữ "hình dạng tâm trí" đơn giản.

**Ví dụ:**
```
❌ Sai: Hình minh họa 3D siêu thực của kẹp hồ sơ làm icon "Tệp tin".
✅ Đúng: Một đường viền 2D đơn giản hình kẹp hồ sơ.

❌ Sai: Logo nhiều màu, phức tạp dùng làm biểu tượng đang tải (loading spinner).
✅ Đúng: Một vòng tròn đơn sắc đơn giản.
```

---

### Định luật Hình/Nền (Law of Figure/Ground)

**Nguyên tắc:** Mắt người phân biệt một đối tượng khỏi khu vực xung quanh nó. Hình thức, hình bóng hoặc hình dạng được nhận thức là hình (figure/đối tượng), trong khi khu vực xung quanh được nhận thức là nền (ground).

**Ứng dụng:**
- **Tập trung:** Dùng lớp phủ (overlays/scrims) cho modal để làm nổi bật nội dung.
- **Độ sâu:** Đổ bóng (drop shadows) để ngụ ý "hình" đang nằm trên "nền".
- **Tương phản:** Chữ sáng trên nền tối (hoặc ngược lại).
- **Làm mờ:** Dùng làm mờ nền để nhấn mạnh văn bản tiền cảnh.
- **Điều hướng:** Header dính (sticky) trôi nổi nằm trên nội dung trang.
- **Hover:** Nâng nhẹ thẻ khi di chuột để định nghĩa chúng là hình.

**Ví dụ:**
```
❌ Sai: Cửa sổ popup không có bóng hoặc viền, hòa lẫn vào trang.
✅ Đúng: Modal có bóng đổ và lớp phủ nền tối đi.

❌ Sai: Chữ trắng đặt trực tiếp trên ảnh nhiều màu rối mắt.
✅ Đúng: Chữ trắng đặt trên lớp nền tối bán trong suốt ("scrim").
```

---

### Định luật Điểm Tiêu cự (Law of Focal Point)

**Nguyên tắc:** Bất cứ điều gì nổi bật về mặt thị giác sẽ thu hút và giữ sự chú ý của người xem trước tiên.

**Ứng dụng:**
- **Lối vào:** Đặt đề xuất giá trị chính tại điểm tiêu cự.
- **Màu sắc:** Sử dụng một "Màu Hành động" có độ rực rỡ cao trên nền giao diện trung tính.
- **Chuyển động:** Sử dụng hoạt ảnh tinh tế trên CTA để thu hút ánh nhìn.
- **Kích thước:** Số liệu quan trọng nhất phải có font chữ lớn nhất.
- **Typography:** Sử dụng độ đậm (bold) cho tiêu đề và độ đậm thường cho nội dung.
- **Hướng:** Sử dụng mũi tên hoặc hướng nhìn (hình ảnh người đang nhìn vào nút bấm).

**Ví dụ:**
```
❌ Sai: Trang chủ có 5 nút bấm cùng kích thước và màu sắc.
✅ Đúng: Một nút "Bắt đầu ngay" lớn với màu sắc tươi sáng.

❌ Sai: Bảng điều khiển (dashboard) mà "Tổng Doanh thu" có kích thước bằng "Phiên bản Hệ thống".
✅ Đúng: "Tổng Doanh thu" hiển thị bằng số lớn, đậm ở vị trí trung tâm phía trên.
```

---

## 3. Thiên kiến Nhận thức & Hành vi (Cognitive Biases & Behavior)

### Hiệu ứng Zeigarnik

**Nguyên tắc:** Mọi người ghi nhớ các nhiệm vụ chưa hoàn thành hoặc bị gián đoạn tốt hơn là các nhiệm vụ đã hoàn thành.

**Ứng dụng:**
- **Gamification:** Sử dụng thanh "Hoàn thiện hồ sơ 60%".
- **Tương tác:** Hé lộ (tease) học phần tiếp theo trong lộ trình học tập.
- **Giữ chân:** Hiển thị danh sách "Việc cần làm" gồm các tính năng chưa được khám phá.
- **Phản hồi:** Các huy hiệu (badges) thông báo tin nhắn chưa đọc.
- **Đà (Momentum):** Hiển thị bước "Tiếp theo" ngay sau khi hoàn thành một bước.
- **Mua sắm:** Nhắc nhở "Hoàn tất đơn hàng" trong giỏ hàng.

**Ví dụ:**
```
❌ Sai: Quy trình onboarding im lặng, không cho biết còn bao nhiêu phần việc.
✅ Đúng: Một danh sách kiểm tra hiển thị "Đã xong 3 trên 5 bước".

❌ Sai: Ứng dụng học tập hiển thị dấu tích ngay cả khi video mới xem được một nửa.
✅ Đúng: Vòng tiến độ hiển thị một nửa cho đến khi video thực sự kết thúc.
```

### Hiệu ứng Goal Gradient (Độ dốc Mục tiêu)

**Nguyên tắc:** Xu hướng tiếp cận mục tiêu tăng lên khi khoảng cách đến mục tiêu thu hẹp lại.

**Ứng dụng:**
- **Đà (Momentum):** Cho người dùng "Sự tiến bộ nhân tạo" (Vd: Tặng sẵn 2 tem tích điểm).
- **Tiến độ:** Chia một form 10 trường thành 2 bước, mỗi bước 5 trường.
- **Phản hồi:** Ăn mừng các cột mốc khi hoàn thành được một nửa nhiệm vụ.
- **Động lực:** Chỉ cho người dùng thấy họ còn cách phần thưởng/trạng thái bao xa.
- **Điều hướng:** Sử dụng breadcrumbs để hiển thị khoảng cách đến đích.
- **Tải trang:** Tăng tốc độ hoạt ảnh loading khi nó gần đạt 100%.

**Ví dụ:**
```
❌ Sai: Thanh tiến độ bắt đầu từ 0% và cảm giác như một chặng đường dài.
✅ Đúng: Thanh bắt đầu từ 20% vì người dùng đã "bắt đầu" bằng việc mở ứng dụng.

❌ Sai: Quy trình thanh toán mà bước "Xem lại lần cuối" cảm giác như một bước thứ 5 bất ngờ.
✅ Đúng: Dán nhãn rõ ràng các bước: "Vận chuyển > Thanh toán > Sắp xong rồi!"
```

### Quy tắc Đỉnh-Cuối (Peak-End Rule)

**Nguyên tắc:** Mọi người đánh giá một trải nghiệm chủ yếu dựa trên cảm giác của họ tại điểm cao trào nhất (điểm dữ dội nhất) và tại điểm kết thúc, thay vì tổng thể hay trung bình của mọi khoảnh khắc.

**Ứng dụng:**
- **Thành công:** Làm cho màn hình "Đã xác nhận đơn hàng" trở nên đáng nhớ.
- **Niềm vui:** Thêm pháo giấy hoặc hoạt ảnh độc đáo tại thời điểm người dùng nhận được giá trị.
- **Hỗ trợ:** Đảm bảo tương tác cuối cùng với chatbot là hữu ích.
- **Rời bỏ (Unboarding):** Ngay cả khi người dùng rời đi, hãy làm cho lối ra cuối cùng sạch sẽ.
- **Onboarding:** Kết thúc phiên đầu tiên bằng một "Chiến thắng" rõ ràng.
- **Xử lý lỗi:** Biến trang 404 thành một tương tác vui vẻ, hữu ích.

**Ví dụ:**
```
❌ Sai: Sau quy trình khai thuế 20 phút, ứng dụng chỉ hiện chữ "Đã gửi".
✅ Đúng: Màn hình "Chúc mừng!" với tóm tắt số tiền hoàn thuế.

❌ Sai: Trò chơi kết thúc với dòng chữ "Game Over" đơn giản bằng font thường.
✅ Đúng: Màn hình tổng kết hiển thị điểm cao cùng nhạc ăn mừng.
```

### Hiệu ứng Thẩm mỹ-Khả dụng (Aesthetic-Usability Effect)

**Nguyên tắc:** Người dùng thường coi các thiết kế đẹp mắt là các thiết kế dễ sử dụng hơn.

**Ứng dụng:**
- **Niềm tin:** Hình ảnh chất lượng cao mua được "tín dụng niềm tin" cho các lỗi nhỏ.
- **Thương hiệu:** Hình ảnh nhất quán, chất lượng cao xây dựng sự chuyên nghiệp.
- **Tương tác:** Giao diện đẹp giữ chân người dùng khám phá lâu hơn.
- **Kiên nhẫn:** Người dùng dễ tha thứ cho thời gian tải lâu hơn nếu UI đẹp.
- **Tự tin:** Thiết kế sạch sẽ làm cho các công cụ phức tạp cảm thấy dễ quản lý hơn.
- **Trung thành:** Mọi người hình thành mối liên kết cảm xúc với các sản phẩm đẹp.

**Ví dụ:**
```
❌ Sai: Ứng dụng ngân hàng với văn bản lệch lạc và màu sắc lỗi thời từ thập niên 90.
✅ Đúng: Ứng dụng ngân hàng hiện đại, bóng bẩy với các hoạt ảnh mượt mà.

❌ Sai: Sử dụng ảnh kho (stock photos) độ phân giải thấp, vỡ hạt.
✅ Đúng: Sử dụng hình minh họa thương hiệu tùy chỉnh, độ phân giải cao.
```

### Thiên kiến Mỏ neo (Anchoring Bias)

**Nguyên tắc:** Người dùng dựa rất nhiều vào mẩu thông tin đầu tiên được đưa ra ("mỏ neo") khi đưa ra quyết định.

**Ứng dụng:**
- **Giá cả:** Hiển thị giá gốc bị gạch bỏ.
- **Các gói:** Đặt gói "Doanh nghiệp" đắt nhất ở phía xa bên trái.
- **Sắp xếp:** Làm nổi bật "Phổ biến nhất" là gợi ý đầu tiên.
- **Giảm giá:** Nêu rõ "Tiết kiệm 20%" trước khi hiển thị giá cuối cùng.
- **Giới hạn:** "Giới hạn 12 cái mỗi khách" neo ý tưởng rằng nó có giá trị cao.
- **Mặc định:** Bắt đầu với số tiền "Đề xuất quyên góp" cao.

**Ví dụ:**
```
❌ Sai: Chỉ hiển thị giá "$49".
✅ Đúng: Hiển thị "~~$99~~ $49 (Giảm 50%)".

❌ Sai: Sắp xếp danh sách laptop từ rẻ nhất đến đắt nhất.
✅ Đúng: Hiển thị mẫu "Pro" cao cấp trước tiên để làm các mẫu khác trông có vẻ rẻ.
```

### Bằng chứng Xã hội (Social Proof)

**Nguyên tắc:** Mọi người sao chép hành động của người khác để cố gắng thực hiện hành vi trong một tình huống nhất định.

**Ứng dụng:**
- **Xác thực:** Hiển thị "Tham gia cùng hơn 50,000 người khác".
- **Đánh giá:** Xếp hạng sao và lời chứng thực của khách hàng đã được xác minh.
- **Logo:** Phần "Được tin cậy bởi" hiển thị logo thương hiệu đối tác.
- **Tin trực tiếp (Live Feed):** Thông báo "Sarah vừa mua sản phẩm này 5 phút trước".
- **Hoạt động:** "300 người hiện đang xem mặt hàng này".
- **Chứng chỉ:** Giải thưởng ngành và huy hiệu bảo mật.

**Ví dụ:**
```
❌ Sai: Trang đăng ký chỉ có mỗi một form.
✅ Đúng: Trang đăng ký có dòng chữ "Tham gia cùng 2 triệu nhà thiết kế".

❌ Sai: Đánh giá ẩn danh không có tên hoặc ảnh.
✅ Đúng: Đánh giá bao gồm khuôn mặt, tên và thẻ "Người mua đã xác minh" (Verified Buyer).
```

### Nguyên tắc Khan hiếm (Scarcity Principle)

**Nguyên tắc:** Con người đặt giá trị cao hơn cho một đối tượng khan hiếm và giá trị thấp hơn cho những thứ có sẵn dồi dào.

**Ứng dụng:**
- **Khẩn cấp:** "Chỉ còn 2 mặt hàng trong kho".
- **Thời gian:** Đồng hồ đếm ngược cho các đợt giảm giá.
- **Quyền truy cập:** Bản beta "chỉ dành cho người được mời" hoặc các hạng thành viên độc quyền.
- **Tính mùa vụ:** Các sản phẩm "Phiên bản Mùa hè".
- **Hết hàng:** "Sắp có hàng trở lại - đặt trước ngay".
- **Nhu cầu:** "Đang có nhu cầu cao - 10 người đã thêm vào giỏ hàng".

**Ví dụ:**
```
❌ Sai: Đợt giảm giá không bao giờ kết thúc và không có đếm ngược.
✅ Đúng: "Deal trong ngày" với đồng hồ đếm ngược từng giây.

❌ Sai: Hiển thị sản phẩm có sẵn mà không có số lượng tồn kho.
✅ Đúng: "Chỉ còn 3 cái với giá này!"
```

### Thiên kiến Thẩm quyền (Authority Bias)

**Nguyên tắc:** Xu hướng cho rằng ý kiến của một nhân vật có thẩm quyền có độ chính xác cao hơn và bị ảnh hưởng nhiều hơn bởi ý kiến đó.

**Ứng dụng:**
- **Chuyên môn:** Sử dụng "Đã xác minh bởi Chuyên gia" hoặc ảnh chân dung chuyên nghiệp.
- **Chứng nhận:** Con dấu tin cậy (Norton, ISO, HIPAA).
- **Truyền thông:** Logo "Đã xuất hiện trên TechCrunch/Forbes".
- **Chứng thực (Endorsements):** Lời chứng thực từ các nhà lãnh đạo ngành hoặc người có ảnh hưởng (KOLs).
- **Ngôn ngữ:** Văn phong tự tin, chuyên nghiệp và chính xác.
- **Lịch sử:** "Được thành lập năm 1950" để ngụ ý sự trường tồn và tin cậy.

**Ví dụ:**
```
❌ Sai: Blog sức khỏe được viết bởi "Admin".
✅ Đúng: Bài viết sức khỏe "Được thẩm định bởi Bác sĩ Jane Smith, Bác sĩ Tim mạch".

❌ Sai: Ứng dụng bảo mật không nhắc đến chứng nhận nào.
✅ Đúng: Hiển thị logo "Chứng nhận ISO 27001" và "Bảo mật bởi Norton".
```

### Ám ảnh Mất mát (Loss Aversion)

**Nguyên tắc:** Mọi người thường thích tránh mất mát hơn là đạt được lợi ích tương đương. Thà không mất 5$ còn hơn là nhặt được 5$.

**Ứng dụng:**
- **Thông điệp:** "Đừng đánh mất mã giảm giá của bạn".
- **Dùng thử:** "Bản dùng thử miễn phí của bạn sắp hết hạn - hãy giữ lại dữ liệu của bạn ngay".
- **Khan hiếm:** "Một khi đã hết là hết hẳn".
- **Giỏ hàng:** "Đừng bỏ lỡ các mặt hàng trong giỏ của bạn".
- **Lòng trung thành:** "Bạn đã kiếm được 500 điểm - đừng để chúng hết hạn".
- **Rủi ro:** "Đảm bảo hoàn tiền trong 30 ngày" (giảm bớt "sự mất mát" về tiền bạc).

**Ví dụ:**
```
❌ Sai: "Bấm vào đây để nhận coupon $10."
✅ Đúng: "Bạn có một khoản tín dụng $10 đang chờ. Hãy dùng nó trước khi hết hạn vào tối nay!"

❌ Sai: "Hủy đăng ký của bạn."
✅ Đúng: "Nếu bạn hủy, bạn sẽ mất quyền truy cập vào 50 dự án đã lưu."
```

### Hiệu ứng Đồng thuận Giả (False-Consensus Effect)

**Nguyên tắc:** Mọi người có xu hướng đánh giá quá cao mức độ mà ý kiến, niềm tin, sở thích, giá trị và thói quen của họ là bình thường và điển hình so với người khác.

**Ứng dụng:**
- **Kiểm thử:** Bạn không phải là người dùng - hãy kiểm thử với đối tượng mục tiêu thực sự.
- **Nghiên cứu:** Sử dụng dữ liệu định tính (phỏng vấn) và định lượng (phân tích).
- **Thiên kiến:** Sử dụng "Đánh giá Thiết kế Mù" (Blind Design Reviews) để tránh sự thiên vị cá nhân.
- **Persona:** Bám sát vào Chân dung Người dùng (User Personas) đã thiết lập thay vì linh cảm cá nhân.
- **Biến thể:** Kiểm thử với người dùng từ các nhân khẩu học/khả năng khác nhau.
- **Khách quan:** Sử dụng bản đồ nhiệt (heatmaps) để xem hành vi thực tế của người dùng.

**Ví dụ:**
```
❌ Sai: Nhà thiết kế quyết định một tính năng là "trực quan" mà không cần kiểm thử.
✅ Đúng: Chạy thử nghiệm A/B để xem phiên bản nào người dùng thích hơn.

❌ Sai: Xây dựng ứng dụng hoàn toàn bằng tiếng Anh vì "ai cũng biết tiếng Anh".
✅ Đúng: Thêm bản địa hóa dựa trên dữ liệu vị trí thực tế của người dùng.
```

### Lời nguyền Kiến thức (Curse of Knowledge)

**Nguyên tắc:** Một thiên kiến nhận thức xảy ra khi một cá nhân, giao tiếp với những người khác, vô tình cho rằng người khác có nền tảng kiến thức để hiểu mình.

**Ứng dụng:**
- **Văn bản:** Tránh biệt ngữ (jargon) và sử dụng ngôn ngữ bình dân.
- **Onboarding:** Hướng dẫn giả định rằng người dùng không biết gì cả.
- **Tooltips:** Giải thích các thuật ngữ phức tạp khi di chuột qua.
- **Cấu trúc:** Tiết lộ lũy tiến (ẩn các cài đặt nâng cao).
- **Nhãn:** Sử dụng icon + nhãn văn bản cho điều hướng (đừng chỉ dựa vào icon).
- **Hỗ trợ:** FAQs toàn diện cho người dùng lần đầu.

**Ví dụ:**
```
❌ Sai: Thông báo lỗi nói "Exception: Null Pointer at 0x0045."
✅ Đúng: Thông báo lỗi nói "Đã xảy ra lỗi. Vui lòng thử tải lại trang."

❌ Sai: Điều hướng ứng dụng đám mây bằng các thuật ngữ như "S3 Bucket Instances".
✅ Đúng: Sử dụng thuật ngữ đơn giản như "Lưu trữ Tệp tin".
```

### Hiệu ứng Bước đệm (Stepping Stone Effect / Foot-in-the-Door)

**Nguyên tắc:** Người dùng cam kết với các nhiệm vụ lớn nếu họ bắt đầu bằng những nhiệm vụ nhỏ.

**Ứng dụng:**
- **Phễu:** Xin email trước khi xin thông tin thẻ tín dụng.
- **Tương tác:** Hỏi một sở thích (Vd: "Chế độ tối?") trước khi đăng ký.
- **Onboarding:** Sử dụng một chuỗi các câu hỏi "Có/Không" nhanh chóng.
- **Niềm tin:** Cung cấp tài liệu PDF/công cụ miễn phí trước khi yêu cầu đăng ký trả phí.
- **Hồ sơ:** Yêu cầu tải ảnh lên trước, sau đó điền tiểu sử sau.
- **Bán hàng:** Cung cấp sản phẩm giá rẻ "mồi nhử" (tripwire) trước dịch vụ chính.

**Ví dụ:**
```
❌ Sai: Nút "Bắt đầu Dùng thử Miễn phí" yêu cầu thông tin thẻ tín dụng ngay lập tức.
✅ Đúng: Yêu cầu email và mật khẩu trước, sau đó mới đề xuất dùng thử.

❌ Sai: Khảo sát hiển thị tất cả 50 câu hỏi trên một trang.
✅ Đúng: Khảo sát bắt đầu bằng một câu hỏi "Có/Không" dễ dàng.
```

---

## 2. Thiết kế Cảm xúc (Emotional Design - Don Norman)

### Ba Mức độ Xử lý

```
┌─────────────────────────────────────────────────────────────┐
│  BẢN NĂNG (VISCERAL - Não Bò sát)                           │
│  ────────────────────────────────                           │
│  • Phản ứng ngay lập tức, tự động                           │
│  • Ấn tượng đầu tiên (50ms đầu)                             │
│  • Thẩm mỹ: màu sắc, hình khối, hình ảnh                    │
│  • "Wow, cái này đẹp quá!"                                  │
├─────────────────────────────────────────────────────────────┤
│  HÀNH VI (BEHAVIORAL - Não Chức năng)                       │
│  ────────────────────────────────────                       │
│  • Khả năng sử dụng và chức năng                            │
│  • Niềm vui từ việc sử dụng hiệu quả                        │
│  • Hiệu suất, độ tin cậy, sự dễ dàng                        │
│  • "Cái này hoạt động chính xác như tôi mong đợi!"          │
├─────────────────────────────────────────────────────────────┤
│  PHẢN TƯ (REFLECTIVE - Não Có ý thức)                       │
│  ────────────────────────────────────                       │
│  • Suy nghĩ có ý thức và ý nghĩa                            │
│  • Bản sắc cá nhân và giá trị                               │
│  • Trí nhớ dài hạn và lòng trung thành                      │
│  • "Thương hiệu này đại diện cho con người tôi"             │
└─────────────────────────────────────────────────────────────┘
```

### Thiết kế cho từng Mức độ

**Bản năng (Visceral):**
```css
/* Ấn tượng đầu tiên đẹp mắt */
.hero {
  background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%);
  color: white;
}

/* Tương tác vi mô dễ chịu */
.button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

**Hành vi (Behavioral):**
```javascript
// Phản hồi tức thì
button.onclick = () => {
  button.disabled = true;
  button.textContent = 'Đang lưu...';
  
  save().then(() => {
    showSuccess('Đã lưu!');  // Xác nhận ngay lập tức
  });
};
```

**Phản tư (Reflective):**
```html
<!-- Câu chuyện thương hiệu và giá trị -->
<section class="about">
  <h2>Tại Sao Chúng Tôi Tồn Tại</h2>
  <p>Chúng tôi tin rằng công nghệ nên trao quyền, chứ không phải làm phức tạp...</p>
</section>

<!-- Bằng chứng xã hội kết nối với bản sắc -->
<blockquote>
  "Công cụ này đã giúp tôi trở thành nhà thiết kế mà tôi hằng mong muốn."
</blockquote>
```

---

## 3. Hệ thống Xây dựng Niềm tin (Trust Building System)

### Các hạng mục Tín hiệu Niềm tin

| Hạng mục | Các yếu tố | Triển khai |
|----------|------------|------------|
| **Bảo mật** | SSL, huy hiệu, mã hóa | Ổ khóa hiển thị rõ, logo bảo mật trên form |
| **Bằng chứng xã hội** | Đánh giá, lời chứng thực, logo | Sao đánh giá, ảnh khách hàng, logo thương hiệu |
| **Minh bạch** | Chính sách, giá cả, liên hệ | Link rõ ràng, không phí ẩn, địa chỉ thực |
| **Chuyên nghiệp** | Chất lượng thiết kế, nhất quán | Không lỗi vặt, thương hiệu đồng bộ |
| **Thẩm quyền** | Chứng nhận, giải thưởng, truyền thông | "Đã xuất hiện trên...", chứng nhận ngành |

### Vị trí đặt Tín hiệu Niềm tin

```
┌────────────────────────────────────────────────────┐
│  HEADER: Banner niềm tin ("Miễn phí vận chuyển |  │
│          Đổi trả 30 ngày | Thanh toán bảo mật")    │
├────────────────────────────────────────────────────┤
│  HERO: Bằng chứng xã hội ("Được tin dùng bởi 10k+")│
├────────────────────────────────────────────────────┤
│  PRODUCT: Đánh giá hiển thị, huy hiệu bảo mật      │
├────────────────────────────────────────────────────┤
│  CHECKOUT: Icon thanh toán, huy hiệu SSL, bảo hành │
├────────────────────────────────────────────────────┤
│  FOOTER: Thông tin liên hệ, chính sách, chứng nhận │
└────────────────────────────────────────────────────┘
```

### Các mẫu CSS Xây dựng Niềm tin

```css
/* Kiểu dáng huy hiệu niềm tin */
.trust-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #F0FDF4;  /* Light green = security */
  border-radius: 2px; /* Sharp for trust = precision feel */
  font-size: 14px;
  color: #166534;
}

/* Secure form indicator */
.secure-form::before {
  content: '🔒 Secure form';
  display: block;
  font-size: 12px;
  color: #166534;
  margin-bottom: 8px;
}

/* Testimonial card */
.testimonial {
  display: flex;
  gap: 16px;
  padding: 24px;
  background: white;
  border-radius: 16px; /* Friendly = larger radius */
  box-shadow: var(--shadow-sm);
}

.testimonial-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;  /* Real photos > initials */
}
```

---

## 4. Cognitive Load Management

### Three Types of Cognitive Load

| Type | Definition | Designer's Role |
|------|------------|-----------------|
| **Intrinsic** | Inherent complexity of task | Break into smaller steps |
| **Extraneous** | Load from poor design | Eliminate this! |
| **Germane** | Effort for learning | Support and encourage |

### Reduction Strategies

**1. Simplify (Reduce Extraneous)**
```css
/* Visual noise → Clean */
.card-busy {
  border: 2px solid red;
  background: linear-gradient(...);
  box-shadow: 0 0 20px ...;
  /* Too much! */
}

.card-clean {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
  /* Calm, focused */
}
```

**2. Chunk Information**
```html
<!-- Overwhelming -->
<form>
  <!-- 15 fields at once -->
</form>

<!-- Chunked -->
<form>
  <fieldset>
    <legend>Step 1: Personal Info</legend>
    <!-- 3-4 fields -->
  </fieldset>
  <fieldset>
    <legend>Step 2: Shipping</legend>
    <!-- 3-4 fields -->
  </fieldset>
</form>
```

**3. Progressive Disclosure**
```html
<!-- Hide complexity until needed -->
<div class="filters">
  <div class="filters-basic">
    <!-- Common filters visible -->
  </div>
  <button onclick="toggleAdvanced()">
    Advanced Options ▼
  </button>
  <div class="filters-advanced" hidden>
    <!-- Complex filters hidden -->
  </div>
</div>
```

**4. Use Familiar Patterns**
```
✅ Standard navigation placement
✅ Expected icon meanings (🔍 = search)
✅ Conventional form layouts
✅ Common gesture patterns (swipe, pinch)
```

**5. Offload Information**
```html
<!-- Don't make users remember -->
<label>
  Card Number
  <input type="text" inputmode="numeric"
         autocomplete="cc-number"
         placeholder="1234 5678 9012 3456">
</label>

<!-- Show what they entered -->
<div class="order-summary">
  <p>Shipping to: <strong>John Doe, 123 Main St...</strong></p>
  <a href="#">Edit</a>
</div>
```

---

## 5. Persuasive Design (Ethical)

### Ethical Persuasion Techniques

| Technique | Ethical Use | Dark Pattern (Avoid) |
|-----------|-------------|----------------------|
| **Scarcity** | Real stock levels | Fake countdown timers |
| **Social Proof** | Genuine reviews | Fake testimonials |
| **Authority** | Real credentials | Misleading badges |
| **Urgency** | Real deadlines | Manufactured FOMO |
| **Commitment** | Progress saving | Guilt-tripping |

### Nudge Patterns

**Smart Defaults:**
```html
<!-- Pre-select the recommended option -->
<input type="radio" name="plan" value="monthly">
<input type="radio" name="plan" value="annual" checked>
  Annual (Save 20%)
```

**Anchoring:**
```html
<!-- Show original price to frame discount -->
<div class="price">
  <span class="original">$99</span>
  <span class="current">$79</span>
  <span class="savings">Save 20%</span>
</div>
```

**Social Proof:**
```html
<!-- Real-time activity -->
<div class="activity">
  <span class="avatar">👤</span>
  <span>Sarah from NYC just purchased</span>
</div>

<!-- Aggregate proof -->
<p>Join 50,000+ designers who use our tool</p>
```

**Progress & Commitment:**
```html
<!-- Show progress to encourage completion -->
<div class="progress">
  <div class="progress-bar" style="width: 60%"></div>
  <span>60% complete - almost there!</span>
</div>
```

---

## 6. User Persona Quick Reference

### Gen Z (Born 1997-2012)

```
CHARACTERISTICS:
- Digital natives, mobile-first
- Value authenticity, diversity
- Short attention spans
- Visual learners

DESIGN APPROACH:
├── Colors: Vibrant, hypercolor, bold gradients
├── Typography: Large, variable, experimental
├── Layout: Vertical scroll, mobile-native
├── Interactions: Fast, gamified, gesture-based
├── Content: Short-form video, memes, stories
└── Trust: Peer reviews > authority
```

### Millennials (Born 1981-1996)

```
CHARACTERISTICS:
- Value experiences over things
- Research before buying
- Socially conscious
- Price-sensitive but quality-aware

DESIGN APPROACH:
├── Colors: Muted pastels, earth tones
├── Typography: Clean, readable sans-serif
├── Layout: Responsive, card-based
├── Interactions: Smooth, purposeful animations
├── Content: Value-driven, transparent
└── Trust: Reviews, sustainability, values
```

### Gen X (Born 1965-1980)

```
CHARACTERISTICS:
- Independent, self-reliant
- Value efficiency
- Skeptical of marketing
- Balanced tech comfort

DESIGN APPROACH:
├── Colors: Professional, trustworthy
├── Typography: Familiar, conservative
├── Layout: Clear hierarchy, traditional
├── Interactions: Functional, not flashy
├── Content: Direct, fact-based
└── Trust: Expertise, track record
```

### Baby Boomers (Born 1946-1964)

```
CHARACTERISTICS:
- Detail-oriented
- Loyal when trusted
- Value personal service
- Less tech-confident

DESIGN APPROACH:
├── Colors: High contrast, simple palette
├── Typography: Large (18px+), high contrast
├── Layout: Simple, linear, spacious
├── Interactions: Minimal, clear feedback
├── Content: Comprehensive, detailed
└── Trust: Phone numbers, real people
```

---

## 7. Emotion Color Mapping

```
┌────────────────────────────────────────────────────┐
│  EMOTION          │  COLORS           │  USE       │
├───────────────────┼───────────────────┼────────────┤
│  Trust            │  Blue, Green      │  Finance   │
│  Excitement       │  Red, Orange      │  Sales     │
│  Calm             │  Blue, Soft green │  Wellness  │
│  Luxury           │  Black, Gold      │  Premium   │
│  Creativity       │  Teal, Pink       │  Art       │
│  Energy           │  Yellow, Orange   │  Sports    │
│  Nature           │  Green, Brown     │  Eco       │
│  Happiness        │  Yellow, Orange   │  Kids      │
│  Sophistication   │  Gray, Navy       │  Corporate │
│  Urgency          │  Red              │  Errors    │
└───────────────────┴───────────────────┴────────────┘
```

---

## 8. Psychology Checklist

### Before Launch

- [ ] **Hick's Law:** No more than 7 choices in navigation. Have choices been narrowed to reduce decision fatigue?
- [ ] **Fitts' Law:** Primary CTAs are large and reachable. Are the most important buttons easy to hit on mobile?
- [ ] **Miller's Law:** Content is chunked appropriately. Is information grouped into digestible units of 5-7?
- [ ] **Jakob's Law:** Does the site follow standard web conventions that users already understand?
- [ ] **Doherty Threshold:** Does the system provide feedback within 400ms? Are skeleton screens in place?
- [ ] **Tesler's Law:** Has complexity been moved from the user to the system where possible?
- [ ] **Parkinson’s Law:** Are there features like "One-Click Checkout" to minimize task completion time?
- [ ] **Von Restorff:** Does the primary CTA visually stand out from all other elements?
- [ ] **Serial Position:** Is the most critical information at the very beginning or end of lists?
- [ ] **Gestalt Laws:** Are related items physically grouped together (Proximity) or within a Card (Common Region)?
- [ ] **Zeigarnik Effect:** Are there visual indicators (like progress bars) for incomplete tasks?
- [ ] **Goal Gradient:** Is the user given a "head start" (e.g., 20% progress) to encourage completion?
- [ ] **Peak-End Rule:** Does the final "Success" screen create a moment of delight?
- [ ] **Occam’s Razor:** Have unnecessary visual or functional elements been removed?
- [ ] **Aesthetic-Usability:** Is the UI high-fidelity enough to build initial user trust?
- [ ] **Trust & Authority:** Are security badges, reviews, and expert certifications visible?
- [ ] **Social Proof:** Are real user numbers or testimonials visible at decision points?
- [ ] **Scarcity & Urgency:** If used, is the scarcity real and ethical (e.g., actual low stock)?
- [ ] **Loss Aversion:** Does the copy emphasize what the user stands to keep rather than just gain?
- [ ] **Anchoring:** Is the pricing presented in a way that frames the desired choice as a great value?
- [ ] **Postel’s Law:** Is the system flexible enough to accept various input formats without errors?
- [ ] **False-Consensus:** Has the design been tested with real users rather than just the internal team?
- [ ] **Curse of Knowledge:** Is the copy free of technical jargon and easy for a beginner to understand?
- [ ] **Stepping Stone:** Does the funnel start with low-friction tasks (e.g., email only)?
- [ ] **Cognitive Load:** Is extraneous visual noise minimized to keep the interface clean?
- [ ] **Emotional Design:** Does the color palette and imagery evoke the intended visceral reaction?
- [ ] **Feedback:** Do all interactive elements have immediate hover, active, and success states?
- [ ] **Accessibility:** Is the contrast ratio sufficient, and is the site navigable via keyboard/screen reader?
- [ ] **Prägnanz:** Are icons and shapes simple enough to be recognized at a glance?
- [ ] **Figure/Ground:** Is it clear which element is in focus (e.g., using shadows or scrims for modals)?
