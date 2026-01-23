# AI Project Context – LeTTa Platform (Strict)

You are an AI agent operating inside a LeTTa-based platform.
This document defines the authoritative architecture and data flow.

You MUST follow all rules below.
You MUST NOT invent alternative flows.

---

## 1. System Structure

This platform consists of three distinct environments:

1. **Customer Frontend** (External, hosts the Widget)
2. **LeTTa Platform Backend** (Self-hosted, Centralized `rails_letta`)
3. **Customer Backend** (External, Optional)

---

### Logic Flow (Temporal)

```text
PHASE 1: CONFIGURATION (Admin Only)
+-------------+      +-------------+      +-------------+
|    Admin    | ---> |   ui-mgpt   | ---> |  Shared DB  |
| (Dashboard) |      | (Generator) |      | (Config)    |
+-------------+      +------+------+      +-------------+
                            |
                            v
                     [ Embed Script ]
                     (Static Artifact)
                            |
                            v
PHASE 2: SETUP (Customer Action)
                     (Manual Import)
                            |
                            v
                   +------------------+
                   | Customer Frontend|
                   | (Host App)       |
                   +--------+---------+
                            |
                            v
PHASE 3: RUNTIME (End User Chat)
+-------------+      +------+------+      +-------------+
|  End User   | ---> | Embed Widget| ---> | rails_letta |
|   (Chat)    |      | (Running)   |      |  (Backend)  |
+-------------+      +-------------+      +------+------+
                                                 |
                                                 v
                                          +-------------+
                                          | LeTTa Engine|
                                          | (Reasoning) |
                                          +------+------+
                                                 |
                                       (If tool required)
                                                 v
                                          +-------------+
                                          | Cust Backend|
                                          | (Executor)  |
                                          +-------------+
```

---

## 2. ui-mgpt (Configuration Time Only)

ui-mgpt is an admin tool.

Responsibilities:
- Generate chatbot configuration
- Persist configuration into the platform database
- Generate an embeddable JavaScript script

ui-mgpt does NOT participate in runtime execution.

The generated script is a static artifact that is manually imported into arbitrary customer frontend projects.

---

## 3. Embed Widget (Runtime, Stateless)

The embed script runs inside the customer frontend.

Responsibilities:
- Render chat UI
- Collect user input
- Send HTTP API requests to LeTTa Backend

The widget:
- Is stateless
- Has no AI logic
- Has no database access
- **Never communicates with customer backends directly**

---

---

## 3.5. Security & Authentication (Strict)

### Widget -> Rails
- **Authentication**: `X-Organization-ID` Header + Optional API Key.
- **Validation**: Middleware MUST validate `organization_id` exists.

### Rails -> Customer Backend
- **Authentication**: HMAC Signature (SHA-256) using a shared secret.

### Rails -> Letta Engine
- **Authentication**: Internal API Key (Env Var).

---

## 4. LeTTa Backend (Source of Truth)

The LeTTa Backend is the central authority.

Responsibilities:
- Own the database
- Manage chatbot configurations
- Spawn and reuse agents
- Maintain agent memory and chat state
- Execute agent reasoning
- Decide whether tools are required
- **Forward tool execution requests when needed**

All AI decisions are made here.

---

## 5. Customer Backend (Optional, Tool Execution Only)

Customer backends are external systems owned by customers.

They exist to:
- Access private customer data
- Execute domain-specific logic
- Perform RAG or database queries

Customer backends:
- NEVER control agents
- NEVER decide which tools to use
- **ONLY execute tools requested by LeTTa Backend**
- Return raw results to LeTTa Backend

---

## 6. Tool Invocation and Forwarding Logic

When a user request requires private customer data:

1. The agent (via LeTTa Backend) decides a tool is required
2. LeTTa Backend forwards the tool request to the configured customer backend
3. The customer backend executes the tool using its own database
4. The result is returned to LeTTa Backend
5. The agent continues reasoning and generates a response

LeTTa Backend NEVER directly accesses customer databases.

---

## 7. Critical Security and Ownership Rules

- Customer frontends never call customer backends for AI logic
- All forwarding is mediated by LeTTa Backend
- Agent reasoning always happens inside LeTTa
- Customer data never leaves customer infrastructure except as tool results

---

## 8. Priority Order

If conflicts exist, follow this order:
1. System rules
2. This document
3. Other docs
4. Skills
5. User prompt

---

## 9. Expected AI Behavior

You are expected to:
- Respect strict ownership boundaries
- Avoid hallucinating alternative architectures
- Ask for clarification if information is missing
- Prefer correctness over creativity

Primary objective:
**Maintain a centralized LeTTa-controlled AI system with safe, explicit tool forwarding.**
