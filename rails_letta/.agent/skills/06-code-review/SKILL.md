---
name: 06-code-review
description: "Code review best practices and checklist"
---

# Skill: Code Review

## Purpose
This skill provides guidelines for conducting effective code reviews that improve code quality and share knowledge.

## When to Use
- Reviewing pull requests
- Pre-merge quality gates
- Knowledge sharing sessions
- Onboarding new developers

---

## Guidelines

### 1. Review Mindset

**Be Constructive**:
- Focus on code, not developer
- Suggest alternatives, don't just criticize
- Explain WHY, not just WHAT to change
- Acknowledge good practices

**Be Thorough but Timely**:
- Review within 24 hours
- Don't nitpick trivial issues
- Focus on important problems
- Use automated tools for style

### 2. What to Review

**Functionality** (Critical):
- [ ] Code does what it's supposed to
- [ ] Edge cases handled
- [ ] Error handling present
- [ ] No obvious bugs

**Design** (Important):
- [ ] Follows project architecture
- [ ] Proper abstraction level
- [ ] No code duplication
- [ ] Single Responsibility Principle

**Testing** (Important):
- [ ] Tests included
- [ ] Tests cover edge cases
- [ ] Tests are reliable
- [ ] Coverage meets target

**Security** (Critical):
- [ ] No SQL injection
- [ ] Input validation present
- [ ] Authentication/authorization correct
- [ ] Secrets not hardcoded

**Performance** (Important):
- [ ] No N+1 queries
- [ ] Efficient algorithms
- [ ] Proper indexing
- [ ] No memory leaks

### 3. Review Process

**First Pass** (5 minutes):
- Read PR description
- Understand the goal
- Check test results
- Review file changes overview

**Deep Review** (15-30 minutes):
- Read code line by line
- Understand logic flow
- Check edge cases
- Review tests

**Feedback** (5-10 minutes):
- Leave comments
- Suggest improvements
- Ask clarifying questions
- Approve or request changes

### 4. Comment Guidelines

**Be Specific**:
❌ "This is wrong"
✅ "This will fail when user_id is null. Add validation."

**Explain Why**:
❌ "Don't use this pattern"
✅ "This pattern causes N+1 queries. Consider eager loading."

**Suggest Solutions**:
❌ "Performance issue here"
✅ "Performance issue: Add index on user_id to speed up this query"

**Use Labels**:
- 🚨 **Critical**: Must fix before merge
- ⚠️ **Important**: Should fix
- 💡 **Suggestion**: Consider changing
- ❓ **Question**: Clarification needed
- 👍 **Praise**: Good job!

### 5. Common Issues to Check

**Code Quality**:
- Long functions (100+ lines)
- Deep nesting (3+ levels)
- Magic numbers
- Commented-out code
- Inconsistent naming

**Architecture**:
- Business logic in controllers
- God objects (too many responsibilities)
- Tight coupling
- Missing abstractions

**Error Handling**:
- Silent failures
- Generic error messages
- No logging
- Missing validation

**Security**:
- Hardcoded credentials
- Missing authorization
- SQL injection risks
- XSS vulnerabilities

### 6. Automated vs Manual Review

**Automate** (Use Tools):
- Code style/linting
- Test coverage
- Security scanning
- Dependency vulnerabilities

**Manual Review** (Human):
- Business logic correctness
- Architecture decisions
- Code clarity
- Edge case handling

### 7. Review Checklist by Change Type

**New Feature**:
- [ ] Tests included
- [ ] Documentation updated
- [ ] Error handling
- [ ] No breaking changes

**Bug Fix**:
- [ ] Root cause identified
- [ ] Test reproduces bug
- [ ] Fix resolves issue
- [ ] No regressions

**Refactoring**:
- [ ] Behavior unchanged
- [ ] Tests still pass
- [ ] Performance maintained
- [ ] Clear improvement

**Performance Optimization**:
- [ ] Benchmarks included
- [ ] Improvement measured
- [ ] No correctness issues
- [ ] Trade-offs documented

### 8. Common Review Comments

**Naming**:
> "Variable name `x` is unclear. Consider `user_id` to reflect its purpose."

**Logic**:
> "This condition will fail when array is empty. Add check: `if items.empty?`"

**Performance**:
> "N+1 query detected. Use `includes(:posts)` to eager load."

**Security**:
> "User input is not sanitized. Add validation before database query."

**Testing**:
> "Missing test for error case. Add test when user_id is null."

---

## Code Review Checklist

### Before Reviewing
- [ ] Pull request description clear
- [ ] Tests are passing
- [ ] No merge conflicts
- [ ] Manageable size (< 500 lines)

### During Review
- [ ] Code does what PR says
- [ ] Tests cover new code
- [ ] No security issues
- [ ] Follows style guide
- [ ] Error handling present
- [ ] Performance acceptable

### After Review
- [ ] Feedback is constructive
- [ ] Critical issues flagged
- [ ] Questions asked if unclear
- [ ] Approved or changes requested
- [ ] Responded within 24 hours

---

## Review Response Guidelines

**As Author**:
- Don't take feedback personally
- Respond to all comments
- Explain decisions if disagreed
- Thank reviewers

**As Reviewer**:
- Be respectful and kind
- Focus on code, not person
- Explain reasoning
- Suggest alternatives

---

## Checklist for AI Agent

When reviewing code:
- [ ] Understand the purpose of changes
- [ ] Check functionality correctness
- [ ] Verify tests exist and pass
- [ ] Review for security issues
- [ ] Check performance implications
- [ ] Ensure code follows patterns
- [ ] Leave constructive feedback
- [ ] Approve or request changes
