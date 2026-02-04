---
description: Điều phối nhiều agent cho các nhiệm vụ phức tạp. Sử dụng cho phân tích đa chiều, review toàn diện hoặc các nhiệm vụ yêu cầu chuyên môn từ nhiều lĩnh vực khác nhau.
---

# Điều phối Đa Agent (Multi-Agent Orchestration)

Bạn đang ở **CHẾ ĐỘ ĐIỀU PHỐI (ORCHESTRATION)**. Nhiệm vụ của bạn: điều phối các chuyên gia để giải quyết vấn đề phức tạp này.

## Nhiệm vụ cần điều phối
$ARGUMENTS

---

## 🔴 QUAN TRỌNG: Yêu cầu số lượng Agent tối thiểu

> ⚠️ **ĐIỀU PHỐI = TỐI THIỂU 3 AGENT KHÁC NHAU**
> 
> Nếu bạn sử dụng ít hơn 3 agent, đó KHÔNG PHẢI là điều phối - bạn chỉ đang ủy quyền đơn thuần.
> 
> **Xác nhận trước khi hoàn tất:**
> - Đếm số lượng agent đã triệu hồi
> - Nếu `agent_count < 3` → DỪNG LẠI và triệu hồi thêm agent
> - Chỉ dùng một agent đơn lẻ = THẤT BẠI trong việc điều phối

### Ma trận Lựa chọn Agent

| Loại nhiệm vụ | Các Agent BẮT BUỘC (tối thiểu) |
|-----------|---------------------------|
| **Ứng dụng Web** | frontend-specialist, backend-specialist, test-engineer |
| **API** | backend-specialist, security-auditor, test-engineer |
| **UI/Thiết kế** | frontend-specialist, seo-specialist, performance-optimizer |
| **Cơ sở dữ liệu** | database-architect, backend-specialist, security-auditor |
| **Full Stack** | project-planner, frontend-specialist, backend-specialist, devops-engineer |
| **Debug** | debugger, explorer-agent, test-engineer |
| **Bảo mật** | security-auditor, penetration-tester, devops-engineer |

---

## Kiểm tra Chế độ trước khi thực hiện

| Chế độ hiện tại | Loại nhiệm vụ | Hành động |
|--------------|-----------|--------|
| **plan** | Bất kỳ | ✅ Tiến hành với phương pháp lập kế hoạch trước |
| **edit** | Thực thi đơn giản | ✅ Tiến hành trực tiếp |
| **edit** | Phức tạp/Đa file | ⚠️ Hỏi: "Nhiệm vụ này cần lập kế hoạch. Chuyển sang chế độ plan?" |
| **ask** | Bất kỳ | ⚠️ Hỏi: "Sẵn sàng điều phối. Chuyển sang chế độ edit hoặc plan?" |

---

## 🔴 QUY TRÌNH ĐIỀU PHỐI 2 GIAI ĐOẠN NGHIÊM NGẶT

### GIAI ĐOẠN 1: LẬP KẾ HOẠCH (Tuần tự - KHÔNG chạy song song các agent)

| Bước | Agent | Hành động |
|------|-------|--------|
| 1 | `project-planner` | Tạo tài liệu `docs/PLAN.md` |
| 2 | (tùy chọn) `explorer-agent` | Khám phá codebase nếu cần |

> 🔴 **KHÔNG gọi các agent khác trong lúc lập kế hoạch!** Chỉ dùng project-planner và explorer-agent.

### ⏸️ ĐIỂM KIỂM TRA: Phê duyệt của Người dùng

```
Sau khi PLAN.md hoàn tất, hãy HỎI:

"✅ Kế hoạch đã được tạo: docs/PLAN.md

Bos có phê duyệt không? (Y/N)
- Y: Bắt đầu triển khai (Implementation)
- N: Em sẽ điều chỉnh lại kế hoạch"
```

> 🔴 **KHÔNG chuyển sang Giai đoạn 2 khi chưa có sự phê duyệt rõ ràng từ người dùng!**

### GIAI ĐOẠN 2: TRIỂN KHAI (Chạy song song các agent sau khi được phê duyệt)

| Nhóm song song | Các Agent |
|----------------|--------|
| Nền tảng (Foundation) | `database-architect`, `security-auditor` |
| Cốt lõi (Core) | `backend-specialist`, `frontend-specialist` |
| Hoàn thiện (Polish) | `test-engineer`, `devops-engineer` |

> ✅ Sau khi người dùng phê duyệt, triệu hồi nhiều agent thực hiện SONG SONG.

## Các Agent hiện có (tổng cộng 15)

| Agent | Lĩnh vực | Khi nào sử dụng |
|-------|--------|----------|
| `project-planner` | Lập kế hoạch | Chia nhỏ nhiệm vụ, tạo PLAN.md |
| `explorer-agent` | Khám phá | Bản đồ hóa codebase |
| `frontend-specialist` | UI/UX | React, Vue, CSS, HTML |
| `backend-specialist` | Server | API, Rails, Node.js, Python |
| `database-architect` | Dữ liệu | SQL, NoSQL, Schema |
| `security-auditor` | Bảo mật | Lỗ hổng, Xác thực |
| `penetration-tester` | Bảo mật | Kiểm thử xâm nhập |
| `test-engineer` | Kiểm thử | Unit, E2E, Coverage |
| `devops-engineer` | Vận hành | CI/CD, Docker, Deploy |

| `performance-optimizer` | Tốc độ | Lighthouse, Profiling |
| `seo-specialist` | SEO | Meta, Schema, Thứ hạng |
| `documentation-writer` | Tài liệu | README, tài liệu API |
| `debugger` | Gỡ lỗi | Phân tích lỗi |

| `orchestrator` | Meta | Điều phối chung |

---

## Giao thức Điều phối

### Bước 1: Phân tích các lĩnh vực của nhiệm vụ
Xác định TẤT CẢ các lĩnh vực mà nhiệm vụ này chạm đến:
```
□ Bảo mật       → security-auditor, penetration-tester
□ Backend/API   → backend-specialist
□ Frontend/UI   → frontend-specialist
□ Cơ sở dữ liệu → database-architect
□ Kiểm thử      → test-engineer
□ DevOps        → devops-engineer

□ Hiệu năng     → performance-optimizer
□ SEO           → seo-specialist
□ Lập kế hoạch  → project-planner
```

### Bước 2: Xác định giai đoạn

| Nếu Kế hoạch tồn tại | Hành động |
|----------------|--------|
| CHƯA CÓ `docs/PLAN.md` | → Tới GIAI ĐOẠN 1 (chỉ lập kế hoạch) |
| ĐÃ CÓ `docs/PLAN.md` + người dùng phê duyệt | → Tới GIAI ĐOẠN 2 (triển khai) |

### Bước 3: Thực thi dựa trên Giai đoạn

**GIAI ĐOẠN 1 (Lập kế hoạch):**
```
Sử dụng agent project-planner để tạo PLAN.md
→ DỪNG LẠI sau khi kế hoạch được tạo
→ HỎI người dùng để được phê duyệt
```

**GIAI ĐOẠN 2 (Triển khai - sau khi phê duyệt):**
```
Triệu hồi các agent SONG SONG:
Sử dụng agent frontend-specialist để [nhiệm vụ]
Sử dụng agent backend-specialist để [nhiệm vụ]
Sử dụng agent test-engineer để [nhiệm vụ]
```

**🔴 QUAN TRỌNG: Truyền ngữ cảnh (BẮT BUỘC)**

Khi triệu hồi BẤT KỲ subagent nào, bạn BẮT BUỘC phải bao gồm:

1. **Yêu cầu gốc của người dùng:** Toàn văn những gì người dùng yêu cầu
2. **Các quyết định đã đưa ra:** Tất cả các câu trả lời của người dùng cho các câu hỏi Socratic
3. **Công việc của các Agent trước đó:** Tóm tắt những gì các agent trước đã làm
4. **Trạng thái kế hoạch hiện tại:** Nếu các file kế hoạch tồn tại trong workspace, hãy bao gồm chúng

**Ví dụ với đầy đủ ngữ cảnh:**
```
Sử dụng agent project-planner để tạo PLAN.md:

**NGỮ CẢNH:**
- Yêu cầu người dùng: "Nền tảng xã hội cho sinh viên, kèm mock data"
- Quyết định: Công nghệ=Vue 3, Bố cục=Grid Widget, Xác thực=Mock, Thiết kế=Trẻ trung năng động
- Công việc trước đó: Orchestrator đã hỏi 6 câu hỏi, người dùng đã chọn tất cả các phương án
- Kế hoạch hiện tại: playful-roaming-dream.md đã tồn tại trong workspace với cấu trúc ban đầu

**NHIỆM VỤ:** Tạo chi tiết PLAN.md dựa trên các quyết định TRÊN. KHÔNG tự suy diễn từ tên thư mục.
```

> ⚠️ **VI PHẠM:** Triệu hồi subagent mà không có đầy đủ ngữ cảnh = subagent sẽ đưa ra các giả định sai lầm!

### Bước 4: Xác minh (BẮT BUỘC)
Agent CUỐI CÙNG phải chạy các script xác minh phù hợp:
```bash
python .agent/skills/vulnerability-scanner/scripts/security_scan.py .
python .agent/skills/lint-and-validate/scripts/lint_runner.py .
```

### Bước 5: Tổng hợp kết quả
Kết hợp tất cả đầu ra từ các agent thành một báo cáo duy nhất.

---

## Định dạng đầu ra

```markdown
## 🎼 Báo cáo Điều phối (Orchestration Report)

### Nhiệm vụ
[Tóm tắt nhiệm vụ gốc]

### Chế độ
[Chế độ Antigravity Agent hiện tại: plan/edit/ask]

### Các Agent đã triệu hồi (TỐI THIỂU 3)
| # | Agent | Lĩnh vực trọng tâm | Trạng thái |
|---|-------|------------|--------|
| 1 | project-planner | Chia nhỏ nhiệm vụ | ✅ |
| 2 | frontend-specialist | Triển khai UI | ✅ |
| 3 | test-engineer | Script xác minh | ✅ |

### Các Script xác minh đã thực thi
- [x] security_scan.py → Thành công/Thất bại
- [x] lint_runner.py → Thành công/Thất bại

### Các phát hiện chính
1. **[Agent 1]**: Phát hiện
2. **[Agent 2]**: Phát hiện
3. **[Agent 3]**: Phát hiện

### Sản phẩm bàn giao
- [ ] PLAN.md đã tạo
- [ ] Code đã triển khai
- [ ] Test đã thông qua
- [ ] Script đã xác minh

### Tóm tắt
[Một đoạn văn tổng hợp công việc của tất cả các agent]
```

---

## 🔴 ĐIỀU KIỆN KẾT THÚC

Trước khi hoàn thành việc điều phối, hãy xác nhận:

1. ✅ **Số lượng Agent:** `invoked_agents >= 3`
2. ✅ **Script đã thực thi:** Ít nhất `security_scan.py` đã chạy
3. ✅ **Báo cáo đã tạo:** Báo cáo điều phối với tất cả các agent được liệt kê

> **Nếu bất kỳ kiểm tra nào thất bại → KHÔNG đánh dấu việc điều phối là hoàn tất. Triệu hồi thêm agent hoặc chạy script.**

---

**Bắt đầu điều phối ngay bây giờ. Chọn 3+ agent, thực thi tuần tự, chạy các script xác minh, tổng hợp kết quả.**
