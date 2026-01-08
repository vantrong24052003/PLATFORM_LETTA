# Letta API Demo

Một project Node.js với kiến trúc MVC chuẩn chỉnh, sử dụng Letta AI client.

## Cấu trúc Project

```
setup-letta/
├── src/
│   ├── config/          # Cấu hình ứng dụng
│   ├── controllers/     # Controllers xử lý request/response
│   ├── services/        # Business logic layer
│   ├── routes/          # Định nghĩa routes
│   ├── middlewares/     # Custom middlewares
│   └── utils/           # Helper functions
├── server.js            # Entry point
├── package.json
└── .env
```

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

3. Cập nhật `LETTA_API_KEY` trong file `.env` nếu cần.

## Chạy server

```bash
npm start
```

Hoặc chạy với chế độ watch (tự động restart khi có thay đổi):
```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:3000`

## API Endpoints

### 1. Trang chủ
```
GET /api/
```
Trả về thông tin về server và danh sách endpoints.

### 2. Tạo Agent mới
```
POST /api/agents/create
```

**Body (JSON):**
```json
{
  "humanName": "The human's name is Bob the Builder.",
  "personaName": "My name is Sam, the all-knowing sentient AI.",
  "model": "openai/gpt-4o-mini",
  "contextWindowLimit": 16000
}
```

Tất cả các field đều optional, sẽ sử dụng giá trị mặc định nếu không được cung cấp.

### 3. Lấy thông tin Agent
```
GET /api/agents/:agentId
```

### 4. Liệt kê tất cả Agents
```
GET /api/agents
```

## Ví dụ sử dụng

### Tạo agent mới:
```bash
curl -X POST http://localhost:3000/api/agents/create \
  -H "Content-Type: application/json" \
  -d '{
    "humanName": "The human is John Doe",
    "personaName": "I am Alice, your helpful assistant"
  }'
```

### Lấy danh sách agents:
```bash
curl http://localhost:3000/api/agents
```
