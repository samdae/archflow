---
name: check
description: |
  Verify design document completeness before implementation.
  Identifies missing details based on defined components and asks user to fill gaps.

  Triggers: check, verify, validate
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Glob
  - LS
  - AskQuestion
  - Skill
---

# /check

Invoke the **check** skill to verify design completeness.

## What it does

1. **Load Design Document**
   - Read `docs/{serviceName}/arch.md`

2. **Completeness Check**
   - DB Schema: All tables have full column definitions?
   - Code Mapping: All features mapped to file/class/method?
   - API Spec: All endpoints have Request/Response defined?
   - Error Policy: Main error scenarios defined?

3. **Identify Gaps**
   - List missing or incomplete sections
   - Categorize by severity

4. **Interactive Resolution**
   - Ask user to fill gaps
   - Or allow AI inference with assumptions noted

## Recommended Model

**Sonnet** (analysis task) / Opus for complex designs

## Prerequisites

- `docs/{serviceName}/arch.md` from `/arch`

## Next Step

After validation passes, run `/build` to start implementation.

## Usage Examples

```
/check
→ Loads arch.md
→ Checking completeness...
→ ⚠️ Missing: Error handling for POST /users
→ ⚠️ Missing: Index definition for users table
→ "Provide details or allow inference?"
→ All checks passed
→ Ready for /build
```
