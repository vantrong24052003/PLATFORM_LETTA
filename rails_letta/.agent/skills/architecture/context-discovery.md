---
name: context-discovery
description: Khám phá ngữ cảnh dự án trước khi đưa ra các quyết định kiến trúc.
---

# Khám phá Ngữ cảnh (Context Discovery)

> Trước khi đề xuất bất kỳ kiến trúc nào, hãy thu thập ngữ cảnh.

## Hệ thống Câu hỏi (Hỏi Người dùng TRƯỚC)

1. **Quy mô (Scale)**
   - Số lượng người dùng? (10, 1K, 100K, 1M+)
   - Khối lượng dữ liệu? (MB, GB, TB)
   - Tỷ lệ giao dịch? (mỗi giây/phút)

2. **Đội ngũ (Team)**
   - Nhà phát triển độc lập hay nhóm?
   - Quy mô nhóm và chuyên môn?

3. **Thời gian (Timeline)**
   - MVP/Bản mẫu hay sản phẩm dài hạn?
   - Áp lực về thời gian ra mắt thị trường?

4. **Lĩnh vực (Domain)**
   - Tập trung vào CRUD hay logic nghiệp vụ phức tạp?
   - Yêu cầu về thời gian thực (real-time)?
   - Các quy định/tuân thủ pháp lý?

5. **Ràng buộc (Constraints)**
   - Giới hạn ngân sách?
   - Các hệ thống cũ cần tích hợp?
   - Sở thích về bộ công cụ công nghệ?

## Ma trận Phân loại Dự án

| Tiêu chí | MVP | SaaS | Doanh nghiệp |
|----------|-----|------|--------------|
| Quy mô | <1K | 1K-100K | 100K+ |
| Đội ngũ | Một mình | 2-10 người | >10 người |
| Thời gian | Nhanh (vài tuần) | Trung bình (vài tháng) | Dài hạn (vài năm) |
| Kiến trúc | Đơn giản | Mô-đun (Modular) | Phân tán (Distributed) |
| Ví dụ | Next.js API | NestJS | Microservices |

**Xin chào bos Trọng!** Em cần hiểu rõ bối cảnh của bos để đưa ra giải pháp kiến trúc tối ưu nhất.
