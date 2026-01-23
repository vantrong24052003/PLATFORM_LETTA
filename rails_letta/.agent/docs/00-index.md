# rails_letta Documentation

Reference documentation for the Rails Letta backend platform.

## Contents

| Document | Description |
|----------|-------------|
| [Architecture](./01-architecture.md) | System components and communication rules |
| [Concepts](./02-concepts.md) | Bot templates, agents, user identity, lifecycle |
| [Letta Database](./04-letta-database.md) | Letta AI database schema (48 tables) |
| [Schema Design](./05-schema-design.md) | Custom Rails tables design |
| [Letta Workflow](./06-letta-workflow.md) | **Core Specs**: Agents, Streaming, Tools, Approvals |

## Project Purpose

This project builds a **frontend-embeddable chat widget** that connects end users to AI agents managed by administrators.

**Key goals**:
- Allow admins to create Bot Templates
- Allow end users to chat via an embedded widget
- Support multiple bots and multiple users
- Persist chat sessions via backend-managed agents

## Quick Links

| Resource | Path |
|----------|------|
| Rules | `.agent/rules/` |
| Skills | `.agent/skills/` |
| Plan | `.agent/plan/` |
| Workflows | `.agent/workflows/` |

## Authority Order

When information conflicts:
1. Rules (highest priority)
2. This documentation
3. Skills
4. User prompt (lowest priority)
