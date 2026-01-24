---
name: 07-research
description: "Research methodology for investigating new technologies, APIs, and solutions"
---

# Skill: Research & Investigation

## Purpose
This skill provides systematic approaches for researching new technologies, APIs, libraries, and solutions to technical problems.

## When to Use
- Evaluating new libraries/frameworks
- Understanding third-party APIs
- Finding solutions to unfamiliar problems
- Comparing technology options
- Learning new concepts

---

## Guidelines

### 1. Define Research Goal

**Be Specific**:
- ❌ "Research React"
- ✅ "Find best React state management for multi-tenant SaaS"
- ✅ "Understand Stripe API for subscription billing"

**Document Goal**:
```
Research Goal: [What you need to know]
Context: [Why you need this]
Constraints: [Time, budget, compatibility]
Success Criteria: [What answers you need]
```

### 2. Research Sources (Priority Order)

**Tier 1 (Official)**:
1. Official documentation
2. GitHub repository (README, issues, discussions)
3. Official blog posts/guides

**Tier 2 (Community)**:
1. Stack Overflow (accepted answers)
2. Dev.to / Medium (recent articles)
3. Reddit / HackerNews discussions

**Tier 3 (Supplementary)**:
1. Tutorial sites
2. YouTube videos
3. Course platforms

**Avoid**:
- Outdated articles (>2 years old)
- Forums with no activity
- AI-generated content farms

### 3. Documentation Research

**What to Read**:
- Getting Started / Quickstart
- Core Concepts
- API Reference (for specific features)
- Migration Guides

**What to Skip** (Initially):
- Advanced topics (read later)
- Deprecated features
- Changelogs (unless checking versions)

**Note-Taking**:
```markdown
# Library: [Name] v[Version]

## Core Concepts
- Concept 1
- Concept 2

## Key Features
- Feature 1: [Why relevant]
- Feature 2: [Why relevant]

## API Examples
[Minimal code examples]

## Gotchas
- Issue 1
- Issue 2
```

### 4. Code Example Research

**Find Working Examples**:
1. Official examples repository
2. GitHub search: `language:ruby [keyword]`
3. CodeSandbox / StackBlitz demos
4. Tutorial repositories

**Evaluate Examples**:
- ✅ Recent commits (active)
- ✅ Has tests
- ✅ Clean code
- ❌ Abandoned repos
- ❌ Overly complex examples

### 5. API Research Pattern

**For Third-Party APIs**:

**Step 1: Find Docs**
- Official API reference
- OpenAPI/Swagger spec
- Postman collections

**Step 2: Authentication**
- API key vs OAuth
- Where to store credentials
- Rate limits

**Step 3: Core Endpoints**
- List key endpoints
- Request/response format
- Error handling

**Step 4: Try in Sandbox**
```bash
# Test with curl first
curl -X GET https://api.example.com/v1/users \
  -H "Authorization: Bearer TOKEN"
```

**Step 5: Check SDKs**
- Official client libraries
- Community gems/packages
- Code generation tools

### 6. Comparative Research

**When comparing options** (e.g., State Management: Redux vs Zustand vs Jotai):

**Criteria Matrix**:
| Criteria | Option A | Option B | Option C |
|----------|----------|----------|----------|
| Learning Curve | High | Low | Medium |
| Bundle Size | 150KB | 10KB | 5KB |
| Community | Large | Growing | Small |
| TypeScript Support | Excellent | Good | Good |
| Our Fit | ⚠️ Overkill | ✅ Good | ❌ Too simple |

**Decision**: Option B (Best fit for our needs)

### 7. Proof of Concept (PoC)

**Mini Implementation**:
```
Goal: Verify library works in our stack
Scope: 1-2 hours max
Success: Can authenticate + fetch data
```

**Spike Steps**:
1. Install library
2. Basic setup (minimal config)
3. Test core feature
4. Document findings

**Document Result**:
```markdown
# PoC: [Library Name]

## Setup Time
15 minutes

## Works?
✅ Yes / ❌ No

## Blockers Found
- Issue 1
- Issue 2

## Recommendation
Use / Don't Use / Needs More Investigation
```

### 8. Security Research

**For external libraries**:

**Check**:
- [ ] NPM audit / Bundle audit
- [ ] GitHub security advisories
- [ ] Known CVEs (cve.mitre.org)
- [ ] Last commit date (is it maintained?)
- [ ] License (commercial use allowed?)

**Red Flags**:
- No commits in 2+ years
- Unaddressed critical CVEs
- Suspicious dependencies
- Unclear licensing

### 9. Performance Research

**Benchmarking**:
```
Research: Is Library X faster than Y?

Method:
- Find existing benchmarks (jsperf, github)
- Run PoC with realistic data size
- Measure: Speed, Memory, Bundle size

Results:
Library X: 50ms, 10MB RAM, 100KB bundle
Library Y: 100ms, 5MB RAM, 50KB bundle

Decision: Library Y (Speed not critical, size matters)
```

### 10. Documentation of Findings

**Research Report Template**:
```markdown
# Research: [Topic]

**Date**: 2025-01-24
**Researcher**: [Name]
**Time Spent**: 2 hours

## Goal
[What we needed to know]

## Sources
1. [Source 1]
2. [Source 2]

## Key Findings
- Finding 1
- Finding 2

## Recommendation
[Use X because Y]

## Next Steps
- [ ] Create PoC
- [ ] Review with team
- [ ] Update decision log
```

---

## Research Checklist

### Planning
- [ ] Research goal defined
- [ ] Time budget set
- [ ] Success criteria clear

### Execution
- [ ] Official docs reviewed
- [ ] Code examples found
- [ ] PoC attempted (if needed)
- [ ] Security checked
- [ ] Comparison done (if multiple options)

### Documentation
- [ ] Findings documented
- [ ] Recommendation made
- [ ] Sources cited
- [ ] Shared with team

---

## Common Research Scenarios

### New Library Evaluation
1. Read README + Getting Started
2. Check GitHub issues (open bugs?)
3. Try minimal example
4. Check bundle size impact
5. Verify license + security

### API Integration
1. Find API docs
2. Get API key (sandbox)
3. Test authentication
4. Test core endpoints with curl
5. Check rate limits
6. Find/build SDK

### Problem Solution
1. Search Stack Overflow
2. Check GitHub issues (similar problems?)
3. Review official docs (common pitfalls)
4. Try community solutions
5. Adapt to our context

---

## Research Tools

**Code Search**:
- GitHub Code Search
- grep.app
- Sourcegraph

**API Testing**:
- Postman
- Insomnia
- curl

**Documentation**:
- DevDocs (offline docs)
- Dash (macOS)
- Zeal (Windows/Linux)

**Benchmarking**:
- jsPerf
- Benchmark.js
- Apache Bench (APIs)

---

## Checklist for AI Agent

When researching:
- [ ] Define clear research goal
- [ ] Start with official docs
- [ ] Find working code examples
- [ ] Test with PoC if needed
- [ ] Check security/licensing
- [ ] Document findings
- [ ] Make clear recommendation
