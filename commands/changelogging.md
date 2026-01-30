---
name: changelogging
description: |
  Dedicated changelog writing skill.
  Records bug fixes, changes, and their design impact.

  Triggers: changelogging, record change, update changelog
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Glob
  - LS
  - AskQuestion
  - Skill
---

# /changelogging

Invoke the **changelogging** skill to record changes.

## What it does

1. **Extract Context**
   - From bugfix session (automatic)
   - Or manual input

2. **Classify Result Type**
   - ✅ Fix Complete
   - ⚠️ External Cause (infra, dependency, etc.)
   - 🔍 Investigation Required

3. **Check Design Impact**
   - Does this change affect architect.md?
   - New patterns discovered?
   - API changes?

4. **Generate/Update Changelog**
   - Creates or updates `docs/{serviceName}/changelog.md`
   - Structured format with date, description, impact

## Output Structure

```
docs/{serviceName}/changelog.md
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

- Automatically called from `/bugfix`
- Manually call to record independent changes

## Next Step

If design impact exists, run `/architect-sync`.

## Usage Examples

```
/changelogging
→ [Auto-extracted from bugfix session]
→ Type: bugfix
→ Design Impact: Yes (new validation pattern)
→ changelog.md updated
→ "Run /architect-sync to update design"
```
