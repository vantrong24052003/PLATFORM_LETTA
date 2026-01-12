# MGPT Chatbot Widget (TypeScript)

Embeddable chatbot widget cho PLATFORM_LETTA, viết bằng TypeScript.

## 📁 Cấu Trúc

```
widget/
├── src/
│   ├── types.ts      # Type definitions
│   ├── config.ts     # API config
│   ├── bot.ts        # Bot config loader
│   ├── agent.ts      # Agent management
│   ├── chat.ts       # Chat handler
│   ├── ui.ts         # UI components
│   └── index.ts      # Main entry point
├── dist/             # Build output (generated)
├── tsconfig.json     # TypeScript config
├── webpack.config.js # Webpack config
└── package.json      # Dependencies
```

## 🛠️ Development

### Prerequisites
- Node.js >= 18
- npm >= 9

### Install Dependencies
```bash
npm install
```

### Type Check
```bash
npm run type-check
```

### Build
```bash
npm run build
```

Build output: `dist/embed.js`

### Watch Mode (Auto-rebuild)
```bash
npm run dev
```

## 📦 Build Output

- **File**: `dist/embed.js`
- **Size**: ~7.8 KB (minified)
- **Format**: UMD (Universal Module Definition)
- **Target**: ES2020 + DOM

## 🚀 Deployment

Sau khi build, copy `dist/embed.js` sang `../public/embed.js`:

```bash
cd /path/to/PLATFORM_LETTA
./build-widget.sh
```

Hoặc manual:
```bash
cp widget/dist/embed.js public/embed.js
```

## 📝 Usage

### Basic Integration
```html
<script 
  src="http://localhost:4000/widget/embed.js" 
  data-assistant-id="YOUR_BOT_ID"
></script>
```

### Advanced API
```javascript
// Set custom agent
ChatbotWidget.setAgent('agent-xxx');

// Create agent for specific user
await ChatbotWidget.createAgent('user-123');

// Open/Close chat programmatically
ChatbotWidget.openChat();
ChatbotWidget.closeChat();

// Send message programmatically
await ChatbotWidget.sendMessage('Hello!');

// Custom bubble click handler
ChatbotWidget.onBubbleClick(async () => {
  console.log('Bubble clicked!');
  await ChatbotWidget.createAgent();
  ChatbotWidget.openChat();
});
```

## 🔧 Configuration

Widget configuration được load từ Backend API:
- `name`: Bot name
- `greeting`: Initial greeting message
- `system`: System prompt (applied to agent)
- `theme_config`: UI customization
  - `primaryColor`: Primary color
  - `botAvatarUrl`: Bot avatar image
  - `bubbleIconUrl`: Bubble icon image
  - `footerText`: Footer text

## 🎨 Theming

Theme config example:
```json
{
  "primaryColor": "#1677ff",
  "botAvatarUrl": "data:image/png;base64,...",
  "bubbleIconUrl": "data:image/png;base64,...",
  "footerText": "Powered by MGPT"
}
```

## 📊 TypeScript Types

All types are defined in `src/types.ts`:
- `BotConfig`: Bot template configuration
- `MessageResponse`: Chat response structure
- `ChatbotWidgetAPI`: Public API interface
- `ThemeConfig`: UI theme configuration

## 🧹 Clean Build

```bash
npm run clean
npm run build
```

## 🐛 Debugging

1. Build với source maps (đã enabled):
   ```bash
   npm run build
   ```

2. Check browser console:
   - Network tab: Xem API calls
   - Console tab: Xem errors/logs

3. Type check:
   ```bash
   npm run type-check
   ```

## 📝 Notes

- Widget code chạy trong browser, không phải Node.js
- TypeScript compiled to ES2020 for modern browsers
- Source maps included for debugging
- UMD format supports both `<script>` tag và module import
