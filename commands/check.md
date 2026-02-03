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

## BE/FE Support

This skill auto-detects profile from input file:
- **Backend**: `arch-be.md` → uses `profiles/be.md`
- **Frontend**: `arch-fe.md` → uses `profiles/fe.md`

## What it does

1. **Load Design Document**
   - Read `docs/{serviceName}/arch-be.md` or `arch-fe.md`
   - Auto-load appropriate profile (BE or FE)

2. **Completeness Check (Backend)**
   - DB Schema: All tables have full column definitions?
   - Code Mapping: All features mapped to file/class/method?
   - API Spec: All endpoints have Request/Response defined?
   - Error Policy: Main error scenarios defined?

3. **Completeness Check (Frontend)**
   - Component Structure: All components have props defined?
   - State Management: Global vs local state scope clear?
   - UX States: Loading, error, empty states defined?
   - Accessibility: Keyboard nav, ARIA labels defined?

4. **Identify Gaps**
   - List missing or incomplete sections
   - Categorize by severity

5. **Interactive Resolution**
   - Ask user to fill gaps
   - Or allow AI inference with assumptions noted

## Recommended Model

**Sonnet** (analysis task) / Opus for complex designs

## Prerequisites

- `docs/{serviceName}/arch-be.md` or `arch-fe.md` from `/arch`

## Next Step

After validation passes, run `/build` to start implementation.

## Usage Examples

```
/check @docs/auth/arch-be.md
→ Detected: Backend profile
→ Checking completeness...
→ ⚠️ Missing: Error handling for POST /users
→ ⚠️ Missing: Index definition for users table
→ All checks passed → Ready for /build

/check @docs/dashboard/arch-fe.md
→ Detected: Frontend profile
→ Checking completeness...
→ ⚠️ Missing: Loading state for DataTable
→ ⚠️ Missing: Error boundary definition
→ All checks passed → Ready for /build
```
