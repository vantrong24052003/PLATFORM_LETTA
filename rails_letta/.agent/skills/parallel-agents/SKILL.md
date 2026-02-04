---
name: parallel-agents
description: Các mẫu điều phối đa agent. Sử dụng khi có nhiều nhiệm vụ độc lập có thể chạy với kiến thức chuyên môn khác nhau hoặc khi cần phân tích toàn diện từ nhiều góc độ.
allowed-tools: Read, Glob, Grep
---

# Điều phối Agent Nội tại (Native Parallel Agents)

> Điều phối thông qua Công cụ Agent tích hợp sẵn của Antigravity

## Tổng quan

Kỹ năng này cho phép điều phối nhiều agent chuyên biệt thông qua hệ thống agent nội tại của Antigravity. Khác với các script bên ngoài, phương pháp này giữ cho toàn bộ việc điều phối nằm trong tầm kiểm soát của Antigravity.

## Khi nào nên sử dụng Điều phối

✅ **Phù hợp cho:**
- Các nhiệm vụ phức tạp yêu cầu kiến thức từ nhiều lĩnh vực chuyên môn.
- Phân tích code từ các góc độ bảo mật, hiệu năng và chất lượng.
- Các buổi review toàn diện (kiến trúc + bảo mật + kiểm thử).
- Triển khai tính năng cần sự kết hợp giữa backend + frontend + database.

❌ **KHÔNG phù hợp cho:**
- Các nhiệm vụ đơn giản, chỉ thuộc một lĩnh vực duy nhất.
- Các bản sửa lỗi nhanh hoặc thay đổi nhỏ.
- Các nhiệm vụ mà một agent là đủ để giải quyết.

---

## Triệu hồi Agent Nội tại

### Một Agent duy nhất
```
Sử dụng agent security-auditor để review phần xác thực
```

### Chuỗi tuần tự
```
Đầu tiên, sử dụng explorer-agent để khám phá cấu trúc dự án.
Sau đó, sử dụng backend-specialist để review các API endpoints.
Cuối cùng, sử dụng test-engineer để xác định các lỗ hổng trong kiểm thử.
```

### Với việc Truyền ngữ cảnh
```
Sử dụng frontend-specialist để phân tích các React components.
Dựa trên những phát hiện đó, yêu cầu test-engineer tạo các bản component tests.
```

### Tiếp tục công việc trước đó
```
Tiếp tục (resume) agent [agentId] và thực hiện thêm các yêu cầu bổ sung.
```

---

## Các Mẫu Điều phối (Orchestration Patterns)

### Mẫu 1: Phân tích Toàn diện
```
Các Agent: explorer-agent → [các agent lĩnh vực] → tổng hợp (synthesis)

1. explorer-agent: Lập bản đồ cấu trúc codebase.
2. security-auditor: Đánh giá tình trạng bảo mật.
3. backend-specialist: Đánh giá chất lượng API.
4. frontend-specialist: Đánh giá các mẫu UI/UX.
5. test-engineer: Đánh giá độ bao phủ kiểm thử.
6. Tổng hợp tất cả các phát hiện.
```

### Mẫu 2: Review Tính năng
```
Các Agent: các agent lĩnh vực bị ảnh hưởng → test-engineer

1. Xác định các lĩnh vực bị ảnh hưởng (backend? frontend? cả hai?).
2. Triệu hồi các agent lĩnh vực liên quan.
3. test-engineer xác minh các thay đổi.
4. Tổng hợp các khuyến nghị.
```

### Mẫu 3: Audit Bảo mật
```
Các Agent: security-auditor → penetration-tester → tổng hợp

1. security-auditor: Review cấu hình và mã nguồn.
2. penetration-tester: Kiểm thử lỗ hổng chủ động.
3. Tổng hợp với các phương án khắc phục được ưu tiên.
```

---

## Các Agent hiện có

| Agent | Chuyên môn | Cụm từ kích hoạt |
|-------|-----------|-----------------|
| `orchestrator` | Điều phối | "comprehensive", "multi-perspective", "toàn diện" |
| `security-auditor` | Bảo mật | "security", "auth", "vulnerabilities", "bảo mật" |
| `penetration-tester` | Kiểm thử xâm nhập | "pentest", "red team", "exploit", "tấn công" |
| `backend-specialist` | Backend | "API", "server", "Rails", "Node.js", "Express" |
| `frontend-specialist` | Frontend | "React", "UI", "components", "Next.js", "giao diện" |
| `test-engineer` | Kiểm thử | "tests", "coverage", "TDD", "kiểm thử" |
| `devops-engineer` | DevOps | "deploy", "CI/CD", "infrastructure", "vận hành" |
| `database-architect` | Cơ sở dữ liệu | "schema", "Prisma", "migrations", "cơ sở dữ liệu" |
| `mobile-developer` | Di động | "React Native", "Flutter", "mobile", "di động" |
| `api-designer` | Thiết kế API | "REST", "GraphQL", "OpenAPI" |
| `debugger` | Gỡ lỗi | "bug", "error", "not working", "lỗi" |
| `explorer-agent` | Khám phá | "explore", "map", "structure", "khám phá" |
| `documentation-writer` | Tài liệu | "write docs", "create README", "viết tài liệu" |
| `performance-optimizer` | Hiệu năng | "slow", "optimize", "profiling", "hiệu năng" |
| `project-planner` | Lập kế hoạch | "plan", "roadmap", "milestones", "lập kế hoạch" |
| `seo-specialist` | SEO | "SEO", "meta tags", "search ranking" |
| `game-developer` | Phát triển Game | "game", "Unity", "Godot", "Phaser" |

---

## Các Agent tích hợp sẵn của Antigravity

Những agent này hoạt động song song với các agent tùy chỉnh:

| Agent | Mô hình | Mục đích |
|-------|-------|---------|
| **Explore** | Haiku | Tìm kiếm codebase nhanh chóng (chế độ chỉ đọc) |
| **Plan** | Sonnet | Nghiên cứu trong chế độ lập kế hoạch (plan mode) |
| **General-purpose** | Sonnet | Các thay đổi đa bước phức tạp |

Sử dụng **Explore** cho các tìm kiếm nhanh, **agent tùy chỉnh** cho kiến thức chuyên sâu về lĩnh vực.

---

## Giao thức Tổng hợp (Synthesis Protocol)

Sau khi tất cả các agent hoàn thành, hãy tổng hợp lại:

```markdown
## Tổng hợp Điều phối (Orchestration Synthesis)

### Tóm tắt Nhiệm vụ
[Những gì đã đạt được]

### Đóng góp từ các Agent
| Agent | Phát hiện |
|-------|---------|
| security-auditor | Tìm thấy X |
| backend-specialist | Xác định được Y |

### Các Khuyến nghị Hợp nhất
1. **Nghiêm trọng**: [Vấn đề từ Agent A]
2. **Quan trọng**: [Vấn đề từ Agent B]
3. **Có thì tốt**: [Cải tiến từ Agent C]

### Danh sách hành động (Action Items)
- [ ] Khắc phục vấn đề bảo mật nghiêm trọng
- [ ] Refactor API endpoint
- [ ] Thêm các test còn thiếu
```

---

## Các Thực hành Tốt nhất

1. **Agent sẵn có** - Có thể điều phối 17 agent chuyên biệt.
2. **Thứ tự logic** - Khám phá → Phân tích → Triển khai → Kiểm thử.
3. **Chia sẻ ngữ cảnh** - Truyền các phát hiện liên quan cho các agent tiếp theo.
4. **Tổng hợp duy nhất** - Một báo cáo thống nhất, không xuất kết quả riêng rẽ.
5. **Xác minh thay đổi** - Luôn bao gồm test-engineer cho các thay đổi code.

---

## Lợi ích Chính

- ✅ **Phiên làm việc duy nhất** - Tất cả các agent chia sẻ chung ngữ cảnh.
- ✅ **AI kiểm soát** - Claude tự động điều phối độc lập.
- ✅ **Tích hợp nội tại** - Hoạt động mượt mà với các agent Explore, Plan có sẵn.
- ✅ **Hỗ trợ tiếp tục (Resume)** - Có thể tiếp tục công việc của agent trước đó.
- ✅ **Truyền ngữ cảnh** - Các phát hiện được luân chuyển giữa các agent.

---

**Xin chào bos Trọng!** Em đã sẵn sàng điều phối các chuyên gia để giải quyết mọi thử thách phức tạp nhất của bos.
