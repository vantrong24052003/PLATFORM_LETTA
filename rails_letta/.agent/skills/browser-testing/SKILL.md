---
name: browser-testing
description: Hướng dẫn sử dụng browser_subagent để test UI, verify changes, chụp screenshot và record video. Sử dụng sau mỗi thay đổi frontend/UI.
---

# Browser Testing với Browser Subagent

**Mục đích**: Hướng dẫn khi nào và cách sử dụng `browser_subagent` tool để verify UI changes, test user flows, và tạo visual documentation.

## Nguyên tắc Cốt lõi

> **UI changes PHẢI được verify bằng mắt thường (visual verification).** Code có thể pass lint và test, nhưng UI có thể vẫn bị lỗi về layout, styling, hoặc UX.

## Khi nào BẮT BUỘC sử dụng Browser Subagent

### ✅ Sử dụng khi:

1. **Thay đổi React Components**
   - Tạo component mới
   - Sửa component hiện có
   - Thay đổi props hoặc state logic

2. **Thay đổi CSS/SCSS**
   - Cập nhật styles
   - Thay đổi layout/grid
   - Responsive design changes

3. **Form Changes**
   - Thêm/sửa form fields
   - Validation logic
   - Form submission flows

4. **User Flows**
   - Login/logout
   - Multi-step processes
   - Navigation changes

5. **AdminLTE Integration**
   - Sử dụng AdminLTE components
   - Custom styling trên AdminLTE base

### ❌ KHÔNG cần dùng khi:

- Chỉ thay đổi backend logic
- Chỉ sửa database schema
- Chỉ thay đổi API endpoints (không ảnh hưởng UI)
- Chỉ viết tests

---

## Workflow Sử dụng Browser Subagent

### Bước 1: Xác định Task

Trước khi gọi `browser_subagent`, hãy xác định rõ:
- **Mục tiêu**: Verify cái gì? (e.g., "Verify login form hiển thị đúng")
- **URL**: Trang nào cần test?
- **Actions**: Cần tương tác gì? (click, type, scroll, etc.)
- **Expected Result**: Kết quả mong đợi là gì?

### Bước 2: Gọi Browser Subagent

```markdown
Ví dụ task description:

"Navigate to http://localhost:3000/login, verify the login form displays correctly with email and password fields, AdminLTE styling is applied, and the submit button is visible. Take a screenshot of the page."
```

### Bước 3: Capture Evidence

- **Screenshot**: Luôn chụp screenshot của UI state quan trọng
- **Video**: Record video cho user flows phức tạp
- **RecordingName**: Đặt tên mô tả, lowercase với underscores (e.g., `login_form_verification`)

### Bước 4: Embed vào Walkthrough

Sau khi có screenshot/video, embed vào `walkthrough.md`:

```markdown
## UI Verification

![Login form với AdminLTE styling](/path/to/screenshot.webp)

Hoặc với video:

![User login flow](/path/to/recording.webp)
```

---

## Examples

### Example 1: Verify Component Rendering

**Scenario**: Tạo component `UserProfileCard` mới

**Browser Subagent Task**:
```
Navigate to http://localhost:3000/users/1, wait for the UserProfileCard component to load, verify it displays user avatar, name, email, and role. Take a screenshot named 'user_profile_card'.
```

**Expected Output**:
- Screenshot showing the component
- Visual confirmation of all fields
- AdminLTE styling applied correctly

---

### Example 2: Test Form Validation

**Scenario**: Thêm validation cho form đăng ký

**Browser Subagent Task**:
```
Navigate to http://localhost:3000/signup, try to submit the form without filling any fields, verify validation errors appear in red below each field. Then fill in valid data and verify the form submits successfully. Record this flow as 'signup_validation_flow'.
```

**Expected Output**:
- Video showing validation errors
- Video showing successful submission
- Visual proof of error messages

---

### Example 3: Responsive Design Check

**Scenario**: Cập nhật dashboard layout để responsive

**Browser Subagent Task**:
```
Navigate to http://localhost:3000/dashboard, resize browser to mobile width (375px), verify the sidebar collapses, cards stack vertically, and all content remains accessible. Take screenshots at desktop (1920px), tablet (768px), and mobile (375px) widths named 'dashboard_desktop', 'dashboard_tablet', 'dashboard_mobile'.
```

**Expected Output**:
- 3 screenshots showing responsive behavior
- Visual confirmation of layout changes

---

## Best Practices

### 1. Clear Task Descriptions

❌ **Tệ**: "Test the page"
✅ **Tốt**: "Navigate to /login, verify email field accepts input, password field masks characters, and submit button is enabled when both fields are filled"

### 2. Specific Return Conditions

Luôn nói rõ khi nào browser subagent nên return:
- "Return after screenshot is taken"
- "Return after form submission completes"
- "Return after navigation to dashboard"

### 3. Meaningful Recording Names

❌ **Tệ**: "test1", "screenshot"
✅ **Tốt**: "login_form_validation", "dashboard_responsive_mobile"

### 4. Combine with Manual Testing

Browser subagent không thay thế manual testing hoàn toàn. Sử dụng nó để:
- Quick verification sau code changes
- Visual documentation
- Regression testing

---

## Integration với Quality Control Loop

### Frontend Specialist Quality Loop

```markdown
Sau khi chỉnh sửa bất kỳ file frontend nào:
1. **Chạy Lint**: `docker exec -it senri-web-1 yarn lint`
2. **Kiểm tra PropTypes**: Đảm bảo tất cả components có PropTypes đầy đủ
3. **Browser Testing**: ← SỬ DỤNG BROWSER SUBAGENT Ở ĐÂY
   - Navigate to affected pages
   - Verify UI renders correctly
   - Take screenshots/videos
4. **Xác nhận UI**: Đảm bảo tuân thủ AdminLTE grid và CSS variables
5. **Báo cáo hoàn tất**: Chỉ báo cáo sau khi tất cả kiểm tra pass
```

---

## Troubleshooting

### Issue: Browser subagent không start được

**Solution**: Kiểm tra xem dev server có đang chạy không:
```bash
docker exec -it senri-web-1 ps aux | grep rails
```

### Issue: Screenshot bị blank/trắng

**Solution**: Thêm wait time trong task description:
```
"Navigate to URL, wait 3 seconds for React to render, then take screenshot"
```

### Issue: Recording quá lớn

**Solution**: Giới hạn scope của recording, chỉ record essential steps.

---

**Xin chào bos Trọng!** Browser testing giờ đã là một phần bắt buộc trong workflow frontend development! 🚀
