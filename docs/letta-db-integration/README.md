# Letta-DB Integration Guide

## Tổng quan

Documentation này hướng dẫn cách tích hợp **Letta Server** (Project 1) với **Client Application** (Project 2) bất kể công nghệ (Node.js, Rails, Go, Python...).

## Structure

### 1. [Configuration & Architecture](./01-configuration/)
Hiểu kiến trúc và API Spec.

- **1.1 [Overview](./01-configuration/01-overview.md)**: Tổng quan mô hình Generic Client.
- **1.2 [Architecture](./01-configuration/02-architecture.md)**: Diagram.
- **1.3 [Sequence Diagrams](./01-configuration/03-sequence-diagrams.md)**: Flow dữ liệu.
- **1.4 [Tool Definition](./01-configuration/04-tool-definition.md)**: Define tool JSON.
- **1.5 [Agent Setup](./01-configuration/05-agent-setup.md)**: Config Server.
- **1.6 [API Contract](./01-configuration/06-api-contract.md)**: 📄 **QUAN TRỌNG NHẤT** - Định nghĩa chuẩn JSON giao tiếp.

### 2. [Client Implementation](./02-client-implementation/)
Hướng dẫn code Logic (Tech-Agnostic).

- **2.1 [DB Preparation](./02-client-implementation/01-db-preparation.md)**: Chuẩn bị query.
- **2.2 [Receive Request](./02-client-implementation/02-receive-request.md)**: Parse API response.
- **2.3 [Execute DB](./02-client-implementation/03-execute-db.md)**: Mapping & Exeucte.
- **2.4 [Send Response](./02-client-implementation/04-send-response.md)**: Submit kết quả.
- **2.5 [Multi-turn](./02-client-implementation/05-multi-turn.md)**: Logic nâng cao.
- **2.6 [Security](./02-client-implementation/06-security.md)**: Bảo mật Client.

### 3. Support
- **[Troubleshooting](./troubleshooting.md)**: Fix lỗi chung.

## Developer Path
- Nếu bạn làm **Project 2 (Client App)**:
  1. Đọc **[06-api-contract.md](./01-configuration/06-api-contract.md)** để biết format JSON.
  2. Đọc **[03-sequence-diagrams.md](./01-configuration/03-sequence-diagrams.md)** để hiểu flow.
  3. Làm theo các bước trong folder **02-client-implementation**.
