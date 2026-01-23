---
name: 02-build-widget
description: "Phase 2: Build Vanilla JS Embed Widget"
---

# Build Widget Skill

## Overview
This skill guides you through **Phase 2**: Building the embeddable chat widget.
This is a standalone Vanilla JS project inside `rails_letta/widget/`, built with Webpack.

## When to Use
Use this skill when:
- You need to create the client-side code that customers will embed.
- You are working on the chat UI (Bubble, Chatbox).

## How It Works

### Step 1: Project Setup
**Directory**: `widget/`
- [ ] Initialize npm: `npm init -y`
- [ ] Install Webpack, Babel.
- [ ] Ensure `dist/embed.js` output is configured.

### Step 2: Integation with Rails
**File**: `src/config.js`
- [ ] Set API Base URL to point to the Rails API (e.g., `http://localhost:3000/api/letta`).

### Step 3: Deployment
- [ ] The build output `embed.js` should eventually be copied to `public/embed.js` in the Rails app so it can be served locally.
    ```bash
    cp dist/embed.js ../public/embed.js
    ```

## Best Practices
- **No Conflict**: Ensure CSS classes are prefixed to avoid clashing with host sites.
- **Lightweight**: Keep the bundle size minimal.
