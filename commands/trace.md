---
name: trace
description: |
  Record bug fixes, changes, and their design impact to changelog.
  Trace changes for future reference.

  Triggers: trace, log, record
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Glob
  - LS
  - AskQuestion
  - Skill
---

# /trace

Invoke the **trace** skill to record changes.

## What it does

1. **Extract Context**
   - From debug session (automatic)
   - Or manual input

2. **Classify Result Type**
   - ✅ Fix Complete
   - ⚠️ External Cause (infra, dependency, etc.)
   - 🔍 Investigation Required

3. **Check Design Impact**
   - Does this change affect arch.md?
   - New patterns discovered?
   - API changes?

4. **Generate/Update Changelog**
   - Creates or updates `docs/{serviceName}/trace.md`
   - Structured format with date, description, impact

## Output Structure

```
docs/{serviceName}/trace.md
├── [Date] - Change Title
│   ├── Type: bugfix/feature/refactor
│   ├── Description
│   ├── Root Cause (if bugfix)
│   ├── Solution
│   ├── Files Changed
│   └── Design Impact: Yes/No
```

## Recommended Model

**Sonnet** (document writing)

## When to Use

- Automatically called from `/debug`
- Manually call to record independent changes

## Next Step

If design impact exists, run `/sync`.

## Usage Examples

```
/trace
→ [Auto-extracted from debug session]
→ Type: bugfix
→ Design Impact: Yes (new validation pattern)
→ trace.md updated
→ "Run /sync to update design"
```
