---
name: architect-enhance
description: |
  Design enhancement for existing features.
  Analyzes existing architect.md and designs improvements.

  Triggers: architect-enhance, enhance design, improve architecture
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

# /architect-enhance

Invoke the **architect-enhance** skill for feature enhancement design.

## What it does

1. **Analyze Existing Design**
   - Read `docs/{serviceName}/architect.md`
   - Understand current architecture

2. **Analyze Enhancement Requirements**
   - From `/require-refine` output
   - Or direct user input

3. **Impact Analysis**
   - Which components affected?
   - Breaking changes?
   - Migration needed?

4. **Enhancement Design**
   - Sub-agent collaboration (like /architect)
   - Domain awareness + Best practices
   - Minimal change principle

5. **Integrate with Existing**
   - Merge enhancement into architect.md
   - Update Code Mapping, API Spec

## Recommended Model

**Opus Required** - Consistency analysis with existing design is critical

## Prerequisites

- Existing `docs/{serviceName}/architect.md` (synced state recommended)
- Enhancement requirements (from `/require-refine`)

## Next Step

After completion, run `/implement` for enhancement implementation.

## Usage Examples

```
/architect-enhance
→ "Enhancement?" → "Add OAuth2 support to auth-service"
→ Loading existing architect.md...
→ Impact analysis: AuthService, TokenRepository affected
→ Designing enhancement...
→ architect.md updated with OAuth2 section
```
