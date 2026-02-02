# Workflow

Flow: **BASE-REQUIRE → ISSUE → PLAN → IMPLEMENT → REVIEW**

```
User Input  →  Standardize #1  →  Standardize #2  →  Design  →  Code  →  Review
(raw)          (format)          (clarify)        (plan)   (gen)   (check)
   ↓               ↓                  ↓               ↓        ↓        ↓
BASE-REQUIRE  →  ISSUE  →  PLAN  →  IMPLEMENT  →  CODE-REVIEW
```

---

## 1. BASE-REQUIRE (Standardize #1 - Format)

**Command:** `/create-base-require <ticket> "<title>"`

**Purpose:** Gather raw user input → standard format

**Input:** JIRA ticket, email, verbal... (any format)
**Output:** `base-require/BASE-REQUIRE-{N}.md`

**What it does:**
- Interactive prompts ask user for information
- Fill into 9-section template:
  1. TITLE
  2. DESCRIPTION (Background, why, value)
  3. WORK TYPE (checkbox)
  4. FR (Functional requirements)
  5. NFR (Non-functional)
  6. API MAPPING
  7. REFERENCES
  8. ACCEPTANCE CRITERIA
  9. OUT OF SCOPE

**NOT:** Interpret, analyze, clarify
**ONLY:** Format into template

---

## 2. ISSUE (Standardize #2 + Resolve Ambiguities)

**Command:** `/create-issue <path-to-base-require>`

**Purpose:** Find ALL unclear points → ask user to choose → MUST clarify before planning

**Input:** `BASE-REQUIRE-{N}.md`
**Output:** `issues/ISSUE-{N}.md` with "Clarification Chosen"

**What it does:**

1. **Analyze** BASE-REQUIRE deeply
2. **Find ALL ambiguities** - any unclear point:
   - "Filter agents" → Query local DB or call Letta API?
   - "Include related data" → Which fields? Array format?
   - "Pagination" → Cursor-based or offset-based?
   - "Response format" → JSON or wrapped?
3. **Ask user to select option** for EACH ambiguity (A/B/C)
4. **Append** "Clarification Chosen" to file

**IMPORTANT:** Plan CANNOT proceed without clarifications. MUST resolve ALL stuck points.

**Example:**
```
Ambiguity 1: Query from local DB or proxy to Letta API?
A: Query local database only
B: Proxy to Letta API (recommended)
C: Hybrid (both)

User selects B

Ambiguity 2: Include nested resources (tools, blocks)?
A: Always include all
B: User selects via include param
C: Never include

User selects B
```

---

## 3. PLAN (Design from Clear Requirements)

**Command:** `/create-plan <path-to-issue>`

**Purpose:** Break down requirements into implementable tasks

**Input:** `ISSUE-{N}.md` (with Clarification Chosen)
**Output:** `plans/PLAN-{N}.md`

**What it does:**
- Read CLEAR requirements
- Break down into tasks T1, T2, T3...
- Identify files to create/modify
- Design approach, test strategy, risks

**Format:**
| Task | File | Description |
|------|------|-------------|
| T1 | endpoints.rb | Add LIST_AGENTS constant |
| T2 | list.rb | Create List service |
| T3 | controller.rb | Create controller with index/show |

---

## 4. IMPLEMENT (Generate Code)

**Command:** `/start-implementation <path-to-plan>`

**Purpose:** Generate code from tasks

**Input:** `PLAN-{N}.md`
**Output:** Code files in `src/`

**What it does:**
- Read tasks T1, T2, T3...
- Generate code skeleton
- Follow existing patterns
- Create/modify files

---

## 5. REVIEW (Verify Code)

**Command:** `/code-review <plan> <src-dir>`

**Purpose:** Check code before merge

**Input:** `PLAN-{N}.md` + `src/`
**Output:** `CODE-REVIEW-{N}.md`

**What it does:**
- Scan code files
- Check security (SQLi, XSS, auth)
- Check test coverage
- Report issues + verdict

---

## Commands Summary

| Step | Command | Input → Output | Purpose |
|------|---------|---------------|---------|
| 1 | `/create-base-require <ticket> "<title>"` | User input → BASE-REQUIRE | Format raw input |
| 2 | `/create-issue <path>` | BASE-REQUIRE → ISSUE (clarified) | Standardize + resolve ambiguities |
| 3 | `/create-plan <path>` | ISSUE → PLAN (tasks) | Design + break down tasks |
| 4 | `/start-implementation <path>` | PLAN → Code files | Generate code |
| 5 | `/code-review <plan> <src>` | Code → CODE-REVIEW | Check code |
