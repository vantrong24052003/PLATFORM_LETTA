# Kiến trúc Antigravity Kit (Senri)

> Bộ công cụ mở rộng khả năng của AI Agent cho dự án Senri

---

## 📋 Tổng quan

Antigravity Kit là một hệ thống module bao gồm:

- **18 Specialist Agents** - Các persona AI chuyên biệt theo vai trò
- **26 Skills** - Các module kiến thức chuyên sâu theo lĩnh vực
- **10 Workflows** - Các quy trình xử lý lệnh slash (/)

---

## 🏗️ Cấu trúc thư mục

```plaintext
.agent/
├── ARCHITECTURE.md          # File này
├── agents/                  # 18 Specialist Agents
├── skills/                  # 26 Skills
├── workflows/               # 10 Slash Commands
├── rules/                   # Các quy tắc chung (GEMINI.md)
└── scripts/                 # Các script kiểm tra chính
```

---

## 🤖 Các Agent (18)

Persona AI chuyên biệt cho các lĩnh vực khác nhau.

| Agent                    | Trọng tâm                         | Skill sử dụng                                            |
| ------------------------ | --------------------------------- | -------------------------------------------------------- |
| `orchestrator`           | Điều phối đa agent                | parallel-agents, behavioral-modes                        |
| `project-planner`        | Khám phá, lập kế hoạch nhiệm vụ   | brainstorming, plan-writing, architecture                |
| `frontend-specialist`    | React 18.2.0 (JSX) & AdminLTE 2.3.11 | frontend-design, react-best-practices                    |
| `backend-specialist`     | Rails 7.0.8 & API                 | rails-best-practices, api-patterns, database-design      |
| `database-architect`     | Schema, SQL (MySQL 5.7/8.0)       | database-design                                          |
| `devops-engineer`        | AWS, Docker, Capistrano           | deployment-procedures, docker-expert                     |
| `security-auditor`       | Tuân thủ bảo mật                  | vulnerability-scanner                                    |
| `test-engineer`          | Kiểm thử (RSpec 3.12 / Jest 29)   | testing-patterns, tdd-workflow, webapp-testing           |
| `debugger`               | Phân tích nguyên nhân gốc rễ      | systematic-debugging                                     |
| `performance-optimizer`  | Tốc độ, Web Vitals                | performance-profiling                                    |
| `seo-specialist`         | Thứ hạng, hiển thị                | seo-fundamentals                                         |
| `documentation-writer`   | Hướng dẫn, tài liệu               | documentation-templates                                  |
| `product-manager`        | Yêu cầu, user stories             | plan-writing, brainstorming                              |
| `product-owner`          | Chiến lược, backlog, MVP          | plan-writing, brainstorming                              |
| `qa-automation-engineer` | Kiểm thử E2E (Playwright)         | webapp-testing, testing-patterns                         |
| `code-archaeologist`     | Code cũ, refactoring              | clean-code, code-review-checklist                        |
| `explorer-agent`         | Phân tích codebase                | -                                                        |

---

## 🧩 Các Skill (26)

Các lĩnh vực kiến thức module được tùy chỉnh cho dự án Rails/React này.

### Frontend & UI

| Skill                   | Mô tả                                                      |
| ----------------------- | ---------------------------------------------------------- |
| `react-best-practices`  | Hiệu năng & các pattern cho React 18.2.0                   |
| `web-design-guidelines` | Kiểm tra Web UI / Truy cập (context AdminLTE 2)            |
| `frontend-design`       | Các pattern UI/UX, hệ thống thiết kế                       |

### Backend & API

| Skill                   | Mô tả                                     |
| ----------------------- | ----------------------------------------- |
| `rails-best-practices`  | Các nguyên tắc Rails 7.0.8 & Sidekiq 7    |
| `api-patterns`          | Các pattern REST & GraphQL                |

### Database

| Skill             | Mô tả                                  |
| ----------------- | -------------------------------------- |
| `database-design` | Thiết kế Schema & tối ưu hóa MySQL     |

### TypeScript/JavaScript

| Skill               | Mô tả                                       |
| ------------------- | ------------------------------------------- |
| `typescript-expert` | TS 4.8.3 Lập trình cấp độ type, hiệu năng   |

### Cloud & Infrastructure

| Skill                   | Mô tả                       |
| ----------------------- | --------------------------- |
| `docker-expert`         | Container hóa, Compose      |
| `deployment-procedures` | Quy trình AWS & Capistrano  |
| `server-management`     | Quản lý hạ tầng             |

### Testing & Quality

| Skill                   | Mô tả                      |
| ----------------------- | -------------------------- |
| `testing-patterns`      | Chiến lược RSpec & Jest    |
| `webapp-testing`        | E2E, Playwright            |
| `browser-testing`       | Browser subagent, UI verify|
| `tdd-workflow`          | Phát triển hướng kiểm thử  |
| `code-review-checklist` | Tiêu chuẩn review code     |
| `lint-and-validate`     | Linting, kiểm tra hợp lệ   |

### Security

| Skill                   | Mô tả                      |
| ----------------------- | -------------------------- |
| `vulnerability-scanner` | Kiểm tra lỗ hổng, OWASP    |

### Architecture & Planning

| Skill           | Mô tả                        |
| --------------- | ---------------------------- |
| `app-builder`   | Khung ứng dụng full-stack    |
| `architecture`  | Các pattern thiết kế hệ thống|
| `plan-writing`  | Lập kế hoạch, chia nhỏ task  |
| `brainstorming` | Đặt câu hỏi Socratic         |

### SEO & Growth

| Skill              | Mô tả                         |
| ------------------ | ----------------------------- |
| `seo-fundamentals` | SEO, E-E-A-T, Core Web Vitals |

### Shell/CLI

| Skill                | Mô tả                         |
| -------------------- | ----------------------------- |
| `bash-linux`         | Lệnh Linux, viết script       |

---

## 🔄 Công việc (Workflows - 10)

Các thủ tục lệnh slash. Gọi bằng `/lệnh`.

| Lệnh             | Mô tả                    |
| ---------------- | ------------------------ |
| `/brainstorm`    | Khám phá kiểu Socratic   |
| `/create`        | Tạo tính năng mới        |
| `/debug`         | Debug các vấn đề         |
| `/deploy`        | Triển khai ứng dụng      |
| `/enhance`       | Cải thiện code hiện tại  |
| `/orchestrate`   | Điều phối đa agent       |
| `/plan`          | Chia nhỏ nhiệm vụ        |
| `/preview`       | Xem trước các thay đổi   |
| `/status`        | Kiểm tra trạng thái dự án|
| `/test`          | Chạy kiểm thử            |
