---
name: react-best-practices
description: Các nguyên tắc cốt lõi để phát triển React 18 chất lượng cao, hiệu năng tốt trong ngữ cảnh Rails/@rails/webpacker. Tập trung vào hiệu năng, quản lý state và tích hợp AdminLTE.
---

# React Best Practices (v18.2.0 - Tiếng Việt)

## 1. Tối ưu hóa hiệu năng (Performance Optimization)

### Quản lý Re-render
- **React.memo**: Sử dụng cho các pure functional components render thường xuyên với cùng một bộ props.
- **useMemo**: Sử dụng cho các tính toán tốn kém (expensive calculations).
- **useCallback**: Sử dụng để giữ ổn định function references khi truyền xuống các component con đã được memoize.
- **State Placement**: Giữ state gần nhất có thể với nơi nó được sử dụng để giảm thiểu phạm vi re-render.

### Tối ưu hóa Bundle
- **Code Splitting**: Sử dụng `React.lazy` và `Suspense` cho các component hoặc route lớn.
- **Dynamic Imports**: Import các thư viện nặng (như Chart.js hoặc D3) một cách năng động khi cần thiết.

## 2. State & Fetching dữ liệu (URQL / React Query)

- **Standardized Hooks**: Sử dụng custom hooks cho mọi hoạt động fetch dữ liệu để đóng gói logic.
- **Quản lý Cache**: Tận dụng normalized cache của URQL hoặc simple document cache một cách phù hợp.
- **Loading States**: Luôn xử lý trạng thái đang tải (loading) và lỗi (error) một cách mượt mà trên UI.

## 3. Xử lý Form (Formik + Yup)

- **Validation Schemas**: Luôn sử dụng Yup để định nghĩa cấu trúc validation.
- **Reusable Inputs**: Tạo các component wrapper cho các phần tử form Bootstrap 3 (AdminLTE) để hoạt động trơn tru với Formik.
- **Hiệu năng**: Sử dụng `FastField` cho các form phức tạp để tránh re-render toàn bộ form trên mỗi phím bấm.

## 4. Components & Styling (AdminLTE v2.3.11)

- **Cấu trúc AdminLTE**: Tuân thủ cấu trúc Box, Row, Col của AdminLTE (Bootstrap 3).
- **SCSS**: Sử dụng modular SCSS và các biến cho các style tùy chỉnh để duy trì tính nhất quán với theme.
- **Ref Handles**: Sử dụng `useImperativeHandle` một cách tiết kiệm, ưu tiên các pattern khai báo (declarative).

## 5. JavaScript & Type Checking
 
 - **PropTypes**: Sử dụng `prop-types` cho tất cả các components để đảm bảo tính đúng đắn của props.
 - **ES6+**: Tận dụng triệt để arrow functions, destructuring, spread operator.
 - **No TypeScript**: Dự án sử dụng JavaScript thuần. Các file `.d.ts` chỉ dùng cho IDE support.

## 6. Legacy Patterns (Class Components)

Mặc dù ưu tiên Functional Components + Hooks cho code mới, dự án vẫn duy trì một lượng lớn Class Components.

- **Maintenance Mode**: Chỉ refactor sang Hooks khi cần thay đổi logic lớn.
- **Life Cycle Methods**: Hiểu rõ tương đương `componentDidMount` -> `useEffect(() => {}, [])`.
- **HOCs (Higher-Order Components)**: Vẫn được sử dụng (ví dụ: `withClient`). Cân nhắc chuyển đổi sang Custom Hooks nếu có thể.
