# Docker Deployment

---

## Hiện Trạng

**Docker-compose hiện tại** (đã chạy):
- ✅ Letta container (letta_server)
- ✅ PostgreSQL trong Letta (port 5433)

**Chưa có**:
- Platform Backend (sẽ chạy riêng)

---

## Architecture

```
┌──────────────────────────────┐
│ Docker: letta_server         │
│  - Letta API: 8283           │
│  - PostgreSQL: 5433          │
│    ├── Letta tables          │
│    └── Custom tables (sau    │
│         khi migration)       │
└──────────────────────────────┘
         ↑
         │ Connect
         │
┌──────────────────────────────┐
│ Platform Backend (local)     │
│  - Port: 3000                │
│  - npm run dev               │
└──────────────────────────────┘
```

---

## Letta Container (Đã Chạy)

**File hiện tại**: `docker-compose.yml`

```yaml
services:
  letta:
    image: letta/letta:latest
    container_name: letta_server
    ports:
      - "8283:8283"      # Letta API
      - "5433:5432"      # PostgreSQL
    environment:
      - OPENAI_API_BASE=${OPENAI_API_BASE}
      - ZHIPUAI_API_KEY=${ZHIPUAI_API_KEY}
      - DEFAULT_LLM_MODEL=glm-4.7
      - DEFAULT_EMBEDDING_MODEL=text-embedding-3-small
      - LETTA_SERVER_PASSWORD=${LETTA_SERVER_PASSWORD}
      - OPENAI_API_KEY=${ZHIPUAI_API_KEY}
    volumes:
      - letta_pg_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  letta_pg_data:
```

**Status**: ✅ Đang chạy

---

## Tasks Cần Làm

### 1. Run Migration (Tạo 2 Bảng)

```bash
# Chạy migration vào Letta DB
cat migrations/create_bot_tables.sql | docker exec -i letta_server psql -U letta -d letta

# Verify
docker exec letta_server psql -U letta -d letta -c "\dt letta.bot_templates"
docker exec letta_server psql -U letta -d letta -c "\dt letta.agent_mappings"
```

**Kết quả**: Tạo 2 bảng `bot_templates` và `agent_mappings` trong Letta PostgreSQL

---

### 2. Setup Platform Backend (Local)

**Install dependencies**:
```bash
cd PLATFORM_LETTA
npm install
npm install pg  # PostgreSQL client
```

**Environment variables** (`.env`):
```bash
# Letta API
LETTA_API_URL=http://localhost:8283
LETTA_API_KEY=<LETTA_SERVER_PASSWORD từ docker-compose>

# Letta Database
LETTA_DB_HOST=localhost
LETTA_DB_PORT=5433
LETTA_DB_USER=letta
LETTA_DB_PASSWORD=letta
LETTA_DB_NAME=letta

# Server
PORT=3000
NODE_ENV=development
```

**Run**:
```bash
npm run dev
```

---

### 3. Verify Setup

**Check Letta**:
```bash
curl http://localhost:8283/health
```

**Check Platform Backend**:
```bash
curl http://localhost:3000/health
```

**Check DB connection**:
```bash
docker exec letta_server psql -U letta -d letta -c "SELECT * FROM letta.bot_templates;"
```

---

## Monitoring

**Letta logs**:
```bash
docker logs -f letta_server
```

**Platform Backend logs**:
```bash
# Trong terminal đang chạy npm run dev
```

**Database backup**:
```bash
docker exec letta_server pg_dump -U letta letta > backup.sql
```

---

## Summary

**Hiện tại**:
- ✅ Letta đã chạy trong Docker
- ⏳ Cần run migration tạo 2 bảng
- ⏳ Cần setup Platform Backend (local)

**Không cần**:
- ❌ KHÔNG cần sửa docker-compose.yml
- ❌ KHÔNG cần thêm service mới
- ❌ Chỉ cần migrate DB và chạy Backend local
