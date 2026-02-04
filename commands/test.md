---
name: test
description: |
  Generate and/or run tests with scoped targeting (change-based default).
  Supports BE (API/unit) and FE (Playwright headless).

  Triggers: test, tests, qa, verify
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
  - LS
  - Shell
  - AskQuestion
  - Skill
---

# /test

Invoke the **test** skill to generate and/or run tests with minimal scope.

## What it does

1. **Collect Inputs**
   - Target: BE / FE / both
   - Mode: generate / run / both
   - Scope: change-based (default), FR-based, module-based, custom paths

2. **Resolve Scope**
   - Default uses git diff vs latest arch commit

3. **Generate and/or Run**
   - BE: API/unit tests
   - FE: Playwright headless E2E

## Usage Example

```
/test
→ Target: BE
→ Mode: both
→ Scope: change-based
```
