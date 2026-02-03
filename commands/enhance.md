---
name: enhance
description: |
  Design enhancement for existing features.
  Analyzes existing arch.md and designs improvements.

  Triggers: enhance, improve, extend
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
  - LS
  - Task
  - AskQuestion
  - Skill
---

# /enhance

Invoke the **enhance** skill for feature enhancement design.

## What it does

1. **Analyze Existing Design**
   - Read `docs/{serviceName}/arch.md`
   - Understand current architecture

2. **Analyze Enhancement Requirements**
   - From `/spec` output
   - Or direct user input

3. **Impact Analysis**
   - Which components affected?
   - Breaking changes?
   - Migration needed?

4. **Enhancement Design**
   - Sub-agent collaboration (like /arch)
   - Domain awareness + Best practices
   - Minimal change principle

5. **Integrate with Existing**
   - Merge enhancement into arch.md
   - Update Code Mapping, API Spec

## Recommended Model

**Opus Required** - Consistency analysis with existing design is critical

## Prerequisites

- Existing `docs/{serviceName}/arch.md` (synced state recommended)
- Enhancement requirements (from `/spec`)

## Next Step

After completion, run `/build` for enhancement implementation.

## Usage Examples

```
/enhance
→ "Enhancement?" → "Add OAuth2 support to auth-service"
→ Loading existing arch.md...
→ Impact analysis: AuthService, TokenRepository affected
→ Designing enhancement...
→ arch.md updated with OAuth2 section
```
