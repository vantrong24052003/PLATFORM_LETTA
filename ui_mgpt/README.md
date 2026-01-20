# TOMOSIA MGPT

A Knowledge Base Management System with AI Chatbot customization.

## 🚀 Tech Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety (Strict Mode)
- **Vite** - Build Tool
- **Ant Design 5** - UI Component Library
- **React Router 6** - Client-side Routing
- **LocalStorage** - Data Persistence
- **Vercel** - Deployment Platform

## 📦 Dependencies

### Core Dependencies

| Package | Version | Description |
|---------|---------|-------------|
| `react` | ^18.3.1 | UI framework |
| `react-dom` | ^18.3.1 | React DOM bindings |
| `react-router-dom` | ^6.28.0 | Client-side routing |
| `antd` | ^5.22.5 | UI component library |
| `@ant-design/icons` | ^5.5.1 | Icon library |
| `@ant-design/agentic-ui` | ^2.4.0 | Markdown editor |
| `typescript` | ~5.6.3 | Type safety |
| `vite` | ^6.0.1 | Build tool |

### Supporting Libraries

| Package | Version | Purpose |
|---------|---------|---------|
| `slate` | ^0.118.1 | Rich text editor framework |
| `slate-react` | ^0.119.0 | React bindings for Slate |
| `slate-history` | ^0.113.1 | Undo/redo for Slate |
| `slate-dom` | ^0.119.0 | DOM utilities for Slate |
| `is-hotkey` | ^0.2.0 | Keyboard shortcut detection |
| `marked` | ^17.0.0 | Markdown parser |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@vitejs/plugin-react` | ^4.3.4 | Vite React plugin |
| `@types/react` | ^18.3.12 | React type definitions |
| `@types/react-dom` | ^18.3.1 | React DOM type definitions |

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn

## ⚙️ Setup

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open http://localhost:5173 in your browser

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🌐 Deployment

This project is deployed on **Vercel**.

### Deploy to Vercel

1. Install Vercel CLI (if not already installed):
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy to production:
```bash
vercel --prod --yes
```

### Deployment Configuration

The project includes:
- `vercel.json` - Vercel configuration for SPA routing and headers
- `.vercelignore` - Files/folders to exclude from deployment

### Production URL

Live demo: https://tomosia-mgpt.vercel.app

## 📁 Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── Layout/             # Application layout (Sidebar, MainLayout)
│   ├── KnowledgeBase/      # Knowledge base related components
│   ├── AIAssistantCard.tsx
│   ├── ChatPreview.tsx     # Live chatbot preview
│   ├── CreateAssistantModal.tsx
│   └── EmbedCodeModal.tsx
├── pages/                  # Route-level page components
│   ├── AIAssistantsPage.tsx
│   ├── AIAssistantConfigPage.tsx
│   ├── KnowledgeBasePage.tsx
│   └── KnowledgeBaseDetailPage.tsx
├── types/                  # TypeScript type definitions
│   └── index.ts           # All interfaces/types
├── utils/                  # Utility functions
│   └── storage.ts         # LocalStorage abstraction layer
├── App.tsx                # Root component with routing
├── main.tsx              # Application entry point
└── index.css             # Global styles
```

## ✨ Features

- ✅ **Vite + React 18 + TypeScript** - Modern development stack
- ✅ **Ant Design 5** - Professional UI components
- ✅ **React Router v6** - Client-side routing with future flags
- ✅ **LocalStorage Persistence** - Client-side data storage
- ✅ **TypeScript Strict Mode** - Type safety throughout
- ✅ **Knowledge Base Management** - CRUD operations with multiple source types
- ✅ **AI Assistant Configuration** - Customizable chatbot with live preview
- ✅ **Markdown Support** - Rich text editing with `@ant-design/agentic-ui`
- ✅ **Image Upload** - Base64 encoding for avatars and icons
- ✅ **Real-time Preview** - Live chatbot customization preview
- ✅ **Responsive Design** - Mobile-friendly interface

## 💾 Data Storage

This application stores all data in the browser's **LocalStorage**.

### Storage Keys

- `knowledge_base` - Knowledge base data
- `ai_assistants` - AI assistant data

### Storage Limitations

- LocalStorage capacity: 5-10MB (varies by browser)
- Images are stored as Base64 strings
- Data is per-user, per-browser (not synced across devices)

## 🛠️ Development Guidelines

### Coding Standards

- ✅ TypeScript **strict mode** enabled
- ✅ Functional components with **Hooks** only
- ✅ **Named exports** preferred
- ✅ All interfaces defined in `src/types/index.ts`
- ✅ LocalStorage access only through `src/utils/storage.ts`
- ✅ Ant Design components for all UI elements
- ✅ No class components or default exports

### UI Language

All UI text must be written in **Japanese** (日本語).

### Architecture Patterns

- **Controlled Components** - Form fields managed via state
- **Real-time Sync** - Preview updates on every change
- **Type Safety** - Explicit types for all functions and parameters
- **Separation of Concerns** - Components, pages, utils, types

## 🔧 Troubleshooting

### Common Issues

**Build Error: `is-hotkey` not resolved**
- This is a known dependency issue with `@ant-design/agentic-ui`
- Workaround: `npm install is-hotkey`

**LocalStorage quota exceeded**
- Clear browser data or reduce uploaded image sizes
- Images should be < 100KB each

**React Router warnings**
- Already configured with future flags in `App.tsx`

## 📝 Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 5173) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `vercel --prod` | Deploy to Vercel production |
| `vercel ls` | List all deployments |

## 📄 License

Private Project

