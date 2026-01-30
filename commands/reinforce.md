---
name: reinforce
description: |
  Reinforce existing documents with new information.
  Fills gaps in incomplete documents, especially after /reverse.

  Triggers: reinforce, fill gaps, complete documents
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Glob
  - LS
  - AskQuestion
  - Skill
---

# /reinforce

Invoke the **reinforce** skill to supplement incomplete documents.

## What it does

1. **Load Existing Documents**
   - Read `docs/{serviceName}/requirements.md`
   - Read `docs/{serviceName}/architect.md`

2. **Identify Gaps**
   - Find unconfirmed items (❓ markers)
   - Find incomplete sections
   - Find inferred content that needs verification

3. **Collect New Information**
   - Q&A loop with user
   - Target specific gaps

4. **Update Documents**
   - Replace ❓ with confirmed information
   - Fill incomplete sections
   - Mark items as verified

## Recommended Model

**Sonnet** (document merging) / Opus for complex reasoning

## When to Use

- After `/reverse` to fill gaps in generated documents
- When new information becomes available
- To correct incorrectly inferred content

## Next Step

When documents are complete, can use `/architect-sync`, `/architect-enhance`, or `/implement`.

## Usage Examples

```
/reinforce
→ Loading requirements.md, architect.md...
→ Found 5 unconfirmed items (❓)
→ Q1: "What is the expected response time for API?"
→ "Under 200ms"
→ Q2: "Is Redis required or optional?"
→ "Required for session management"
→ Documents updated: 5 gaps filled
```
