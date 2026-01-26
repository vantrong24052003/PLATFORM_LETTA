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
PHASE 1: CONFIGURATION (Admin Dashboard)
+-------------+      +-------------+      +-----------------------------+
|    Admin    | ---> |   ui-mgpt   | ---> |  Shared DB (Bot Templates)   |
| (Dashboard) |      | (Config)    |      |  [Store: customer_domain]    |
+-------------+      +------+------+      +-----------------------------+
                            |
                            v
                     [ Embed Script ] (Contains BotID)

PHASE 2: RUNTIME (Streaming & Tool Loop)
+-------------+      +--------------+      +---------------------------+
|   End User  | <--> | Host Website | <--> |  LeTTa Platform (Backend) |
|    (Chat)   |      | (Embed Widget)|     |      [ORCHESTRATOR]       |
+-------------+      +--------------+      +------------+--------------+
                                                        |
                                                        | (1) Proxy Request
                                                        v
                                               +-----------------+
                   (4) Normal Message Stream < |  LeTTa Engine   |
                       (Text Tokens)           |  (The BRAIN)    |
                                               +-----------------+
                                                        |
                                               (2) Tool Decision
                                               (If LLM needs data)
                                                        v
                                               +-----------------+
                         (3) Resolve Domain <+ |  Rails Router   |
                             from Database     | (The HANDS)     |
                                               +-----------------+
                                                        |
                         (5) Forward POST <-----+-------+
                             via Customer Domain
                                                        |
                                                        v
                                               +-----------------+
                                               | Customer Backend|
                                               | (Local Executor)|
                                               +-----------------+
```

---

## 2. ui-mgpt (Configuration Time Only)

ui-mgpt is an admin tool.

Responsibilities:
- Generate chatbot configuration including the **Target Customer Domain**.
- Persist configuration into the platform database.
- Generate an embeddable JavaScript script.

ui-mgpt does NOT participate in runtime execution.

---

## 3. Embed Widget (Runtime, Stateless)

The embed script runs inside the customer frontend.

Responsibilities:
- Render chat UI.
- Collect user input.
- Send HTTP API requests to LeTTa Backend.

The widget:
- Is stateless and has no AI logic.
- **Never communicates with customer backends directly**.

---

## 4. LeTTa Backend (The Forwarding Hub)

The LeTTa Backend is the central authority and orchestrator.

Responsibilities:
- Manage multi-tenant chatbot configurations.
- Map end-users to persistent Letta Agents.
- **Orchestrate Bidirectional Tool Forwarding**.
- Manage Human-in-the-loop (HITL) approval states.

---

## 5. Customer Backend (Local Executor)

Customer backends are external systems owned by customers.

Responsibilities:
- Execute domain-specific logic (e.g., query local DBs, hitting internal APIs).
- Return raw results to the LeTTa Platform.

---

## 6. Bidirectional Tool Forwarding Mechanism

The platform implements a "Proxy Hub" pattern to allow agents to interact with private data without violating infrastructure boundaries.

### 6.1. The Role of `customer_domain`
Since the platform is centralized, it lacks intrinsic knowledge of where a specific customer's API resides. The `customer_domain` registered in the **Bot Template** serves as the authoritative routing address.

### 6.2. The Reasoning-First Protocol
The system distinguishes between **Reasoning** (thinking) and **Execution** (doing).

1.  **Direct Streaming (Normal Mode)**:
    If the Agent (The Brain) can answer without extra data, it simply emits text tokens. These are proxied by Rails directly to the Widget. User sees a normal chat response.

2.  **Tool-Augmented Reasoning (Forwarding Mode)**:
    If the Agent determines it lacks information (e.g., "I don't know the order status"), it emits a `tool_call` instead of text.
    - **Step A (The Brain decides)**: Letta Engine sends the Tool Name and Arguments to Rails.
    - **Step B (The Hands execute)**: Rails (as the orchestrator) detects the tool is mapped to an external customer backend.
    - **Step C (Routing)**: Rails fetches the `customer_domain` and forwards the payload.
    - **Step D (Verification)**: Customer Backend executes and returns data.
    - **Step E (Completion)**: Rails feeds the result back to the Brain. The Brain now "understands" and can finally emit the text stream to the User.

**Crucial Point**: The LLM (Letta) is the only entity that decides IF a tool is needed. Rails never "forces" a tool call; it only serves as the delivery agent to the Customer's Domain.

### 6.3. Security & Integrity
- **Authentication**: Outbound requests to customer backends are signed via **HMAC SHA-256** to verify the platform's identity.
- **Tenant Isolation**: Routing is strictly enforced at the database level using `organization_id`.
- **Encapsulation**: Customer data remains inside the customer's network, only entering the platform as transient tool results.

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
- Ask for clarification if information is missing

Primary objective:
**Maintain a centralized LeTTa-controlled AI system with safe, explicit tool forwarding.**
