# Phase 1: Project Setup

## Mục tiêu
Tạo FE project để build widget JavaScript thuần túy (không dùng framework) có thể embed vào bất kỳ website nào.

---

## 1. Khởi tạo Project

```bash
mkdir chatbot-widget
cd chatbot-widget
npm init -y
```

---

## 2. Cài đặt Dependencies

```bash
# Build tool
npm install --save-dev webpack webpack-cli webpack-dev-server

# Babel (support ES6+)
npm install --save-dev @babel/core @babel/preset-env babel-loader

# CSS loader (nếu có)
npm install --save-dev style-loader css-loader

# Development
npm install --save-dev html-webpack-plugin
```

**Lưu ý**: KHÔNG cài React, Vue, hoặc bất kỳ framework nào. Widget phải là Vanilla JS.

---

## 3. Cấu trúc thư mục

```
chatbot-widget/
├── src/
│   ├── index.js          # Entry point, expose ChatbotWidget global API
│   ├── agent.js          # Agent lifecycle (create/reuse)
│   ├── chat.js           # Chat handler (send message, parse response)
│   ├── ui.js             # UI renderer (bubble + chatbox)
│   ├── storage.js        # localStorage wrapper
│   └── styles.css        # Widget styles
├── dist/                 # Build output
├── webpack.config.js
└── package.json
```

---

## 4. Webpack Config

```javascript
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production', // or 'development'
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'chatbot-widget.js',
    library: 'ChatbotWidget',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devServer: {
    static: './dist',
    port: 9000
  }
};
```

**Key Points**:
- Output: `chatbot-widget.js` (single file).
- `library: 'ChatbotWidget'` → expose global API.
- `libraryTarget: 'umd'` → tương thích mọi module system.

---

## 5. Package.json Scripts

```json
{
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production"
  }
}
```

---

## 6. Test HTML (Development)

```html
<!-- dist/index.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Chatbot Widget Test</title>
</head>
<body>
  <h1>Test Website</h1>
  <p>Widget sẽ xuất hiện ở góc dưới phải.</p>

  <script src="chatbot-widget.js"></script>
  <script>
    ChatbotWidget.init({
      userId: "test_user_123",
      systemPrompt: "You are a helpful assistant.",
      apiBaseURL: "http://localhost:3000"
    });
  </script>
</body>
</html>
```

---

## Checkpoint

Chạy `npm run dev` → mở `http://localhost:9000` → kiểm tra:
- File `chatbot-widget.js` được build.
- Global API `ChatbotWidget` có sẵn trong console.
- Chưa có UI (sẽ làm ở Phase tiếp theo).

---

Tiếp theo: [Phase 2: Agent Lifecycle](./02-agent-lifecycle.md)
