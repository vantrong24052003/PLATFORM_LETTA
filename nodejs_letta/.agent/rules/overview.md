# Tổng Quan Dự Án & Quy Tắc Kiến Trúc

## 1. Mục Đích Dự Án
**Vai trò**: Project 1 (Bộ Não / Letta Server).
**Trách nhiệm**:
- Host và quản lý các Letta Agent.
- Quản lý Context (Ngữ cảnh), Memory (Trí nhớ) của AI.
- Nhận Chat Request từ Client -> Ra quyết định gọi Tool (Reasoning).
- **TUYỆT ĐỐI KHÔNG** kết nối trực tiếp đến Database nghiệp vụ (Business DB).
- **TUYỆT ĐỐI KHÔNG** chứa logic nghiệp vụ (Business Logic).

## 2. Kiến Trúc: Phân Tách Trách Nhiệm (Separation of Concerns)
Dự án này hoạt động như "Bộ Não" trong mô hình "Brain-Body".

- **Project 1 (Repo này)**:
  - Chỉ là một Node.js API Server thuần túy.
  - Sử dụng thư viện `@letta-ai/letta-client` để điều khiển AI.
  - Hoàn toàn **Stateless** đối với dữ liệu nghiệp vụ (không biết Product, Order, User là gì).

- **Project 2 (Client App - Bên ngoài)**:
  - Là nơi chứa Database thật (Postgres/MySQL/Mongo).
  - Là nơi chứa Business Logic thật.
  - Chịu trách nhiệm thực thi các Tool Calls mà Project 1 yêu cầu (Ví dụ: Project 1 bảo "Tìm giày", Project 2 sẽ chạy SQL query để tìm).

## 3. Tech Stack
- **Runtime**: Node.js
- **Ngôn ngữ**: TypeScript (Bắt buộc Strict Mode).
- **Framework**: Express.js.
- **AI Core**: `@letta-ai/letta-client`.
- **Database**: KHÔNG SỬ DỤNG (Chỉ dùng memory nội bộ của Letta nếu cần).

## 4. Các Quy Tắc Cốt Lõi
1.  **Cấm Database Driver**: Code trong project này **không bao giờ** được phép import `pg`, `mysql`, `mongoose` hay bất kỳ driver DB nào kết nối tới dữ liệu khách hàng.
2.  **API Giao Tiếp**: Chỉ cung cấp các API RESTful để Project 2 kết nối vào (`/agents`, `/chat`, `/webhook`).
3.  **Clean Architecture**: Luồng xử lý chỉ đi từ `Controllers` -> `Letta Service`. Không được đẻ ra các Service nghiệp vụ thừa thãi.
