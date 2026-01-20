# Phase 6: Build & Deploy

## Mục tiêu
Build widget thành 1 file JS production-ready và deploy lên CDN.

---

## 1. Production Build

```bash
npm run build
```

**Output**: `dist/chatbot-widget.js` (minified, single file).

**Webpack Production Optimization** (update `webpack.config.js`):
```javascript
module.exports = {
  mode: 'production',
  output: {
    filename: 'chatbot-widget.js',
    clean: true  // Clean dist folder before build
  },
  optimization: {
    minimize: true
  }
};
```

---

## 2. Test Production Build Locally

```html
<!-- test.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Widget Test (Production)</title>
</head>
<body>
  <h1>Test Website</h1>

  <script src="dist/chatbot-widget.js"></script>
  <script>
    ChatbotWidget.init({
      userId: "prod_test_user",
      systemPrompt: "You are a support assistant.",
      tools: ["search_products"],
      toolWebhooks: {
        search_products: {
          url: "https://my-backend.com/tools/search",
          method: "POST"
        }
      },
      apiBaseURL: "https://api.yourplatform.com"  // Production BE URL
    });
  </script>
</body>
</html>
```

Mở file này bằng browser → test toàn bộ flow.

---

## 3. Deploy lên CDN

### Option 1: AWS S3 + CloudFront
```bash
# Upload to S3
aws s3 cp dist/chatbot-widget.js s3://your-bucket/widgets/chatbot-widget.js --acl public-read

# CloudFront URL
https://d1234abcd.cloudfront.net/widgets/chatbot-widget.js
```

### Option 2: Vercel
```bash
npm install -g vercel
vercel --prod
```

**Output**: `https://your-widget.vercel.app/chatbot-widget.js`

### Option 3: GitHub Pages
```bash
# Push dist/ folder to gh-pages branch
git subtree push --prefix dist origin gh-pages
```

**URL**: `https://your-username.github.io/chatbot-widget/chatbot-widget.js`

---

## 4. Embed Script Template (For Customers)

Sau khi deploy, cung cấp cho khách hàng:

```html
<!-- Copy-paste vào website của bạn -->
<script src="https://cdn.yourplatform.com/chatbot-widget.js"></script>
<script>
  ChatbotWidget.init({
    userId: "YOUR_USER_ID",  // Replace with actual user ID
    systemPrompt: "You are a helpful assistant.",
    tools: [],  // Add tool names if needed
    toolWebhooks: {},  // Add webhook configs if needed
    apiBaseURL: "https://api.yourplatform.com"
  });
</script>
```

---

## 5. Versioning (Best Practice)

Build với version number:
```javascript
// webpack.config.js
const version = require('./package.json').version;

module.exports = {
  output: {
    filename: `chatbot-widget.${version}.js`
  }
};
```

**Deployment**:
- Version 1.0.0: `https://cdn.yourplatform.com/chatbot-widget.1.0.0.js`
- Version 1.1.0: `https://cdn.yourplatform.com/chatbot-widget.1.1.0.js`
- Latest (alias): `https://cdn.yourplatform.com/chatbot-widget.js` → redirect to latest version.

---

## 6. Performance Optimization

### A. Code Splitting (Optional)
Nếu widget quá lớn, tách CSS ra:
```javascript
// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'chatbot-widget.css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  }
};
```

**Embed**:
```html
<link rel="stylesheet" href="https://cdn.yourplatform.com/chatbot-widget.css">
<script src="https://cdn.yourplatform.com/chatbot-widget.js"></script>
```

### B. Compression
Enable Gzip/Brotli on CDN:
- S3 + CloudFront: Enable compression in CloudFront settings.
- Vercel: Automatic compression.

### C. Lazy Load
Widget chỉ load khi user click bubble:
```javascript
// Placeholder bubble (inline HTML)
<div id="chatbot-bubble-placeholder" onclick="loadChatbot()">💬</div>

<script>
function loadChatbot() {
  const script = document.createElement('script');
  script.src = 'https://cdn.yourplatform.com/chatbot-widget.js';
  script.onload = () => {
    ChatbotWidget.init({ userId: "..." });
  };
  document.body.appendChild(script);
}
</script>
```

---

## 7. Monitoring & Analytics

Track widget usage:
```javascript
// src/index.js
export async function init(userConfig) {
  // ... init logic
  
  // Track widget load
  trackEvent('widget_loaded', { userId: config.userId });
}

async function handleSendMessage() {
  // ... send message logic
  
  // Track message sent
  trackEvent('message_sent', { userId: config.userId, agentId });
}

function trackEvent(eventName, data) {
  // Send to analytics service
  fetch('https://your-analytics.com/events', {
    method: 'POST',
    body: JSON.stringify({ event: eventName, ...data })
  });
}
```

---

## 8. Final Checklist

- ✅ Build production: `npm run build`
- ✅ Test `dist/chatbot-widget.js` locally
- ✅ Deploy to CDN
- ✅ Test embed script trên website giả
- ✅ Verify:
  - Agent creation/reuse
  - Chat flow
  - Tool call approval
  - Webhook execution
- ✅ Provide embed script template to customers
- ✅ Setup versioning & monitoring

---

## Complete! 🎉

Widget đã sẵn sàng để embed vào bất kỳ website nào. Khách hàng chỉ cần:
1. Copy embed script.
2. Paste vào `<body>` của website.
3. Config `userId` và `toolWebhooks` (nếu có).
4. Done!

---

Quay lại: [README](../README.md) | [Configuration](../01-configuration/01-overview.md)
