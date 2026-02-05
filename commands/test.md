---
name: test
description: |
  Generate and/or run tests with scoped targeting (change-based default).
  Supports BE (API/unit) and FE (Playwright headless E2E).

  Triggers: test, tests, run tests, qa, verify, 테스트, 검증
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

Invoke the **test** skill to generate and/or run tests with scoped targeting.

## What it does

1. **Collect Configuration**
   - Target: BE (API/unit) / FE (Playwright E2E) / Both
   - Mode: generate / run / both
   - Scope: change-based (default), FR-based, module-based, custom paths, all

2. **Resolve Test Scope**
   - **Change-based (default)**: Uses `git diff` vs latest arch commit
   - **FR-based**: Tests specific requirement IDs (FR-001, FR-002...)
   - **Module-based**: Tests specific modules from Code Mapping
   - **Custom paths**: User-specified files/directories
   - **All**: Full test suite

3. **Generate Tests** (if mode includes generate)
   - BE: Creates pytest/jest/vitest/go tests based on profile
   - FE: Creates Playwright E2E tests with state coverage

4. **Run Tests** (if mode includes run)
   - Executes tests with appropriate framework
   - Captures results and reports

5. **Generate Report**
   - Summary of passed/failed/skipped
   - FR coverage mapping
   - Failure details with suggestions

## Usage Examples

### Default (change-based scope)

```
/test
→ Target: BE
→ Mode: both
→ Scope: change-based
```

Tests only files changed since the last arch commit.

### FR-based scope

```
/test
→ Target: BE
→ Mode: run
→ Scope: FR-based
→ FR IDs: FR-001, FR-003
```

Runs tests covering specific requirements.

### Full test suite

```
/test
→ Target: Both
→ Mode: run
→ Scope: all
```

Runs all BE and FE tests.

## Workflow Integration

```
[build] → /test → ✅ All passed → Done
                → ❌ Failures → /debug
```

## Scope Selection Guide

| Scope | When to Use | Speed |
|-------|-------------|-------|
| **change-based** | Default, CI/CD, quick feedback | Fast |
| **FR-based** | Verify specific feature | Medium |
| **module-based** | Test specific area | Medium |
| **custom** | Debug specific file | Fast |
| **all** | Pre-release, full verification | Slow |

## Test Framework Support

### Backend

| Framework | Language | Auto-detected by |
|-----------|----------|------------------|
| pytest | Python | `pytest.ini`, `pyproject.toml` |
| jest | Node.js | `package.json` |
| vitest | Node.js | `package.json` |
| go test | Go | `go.mod` |
| JUnit | Java | `pom.xml`, `build.gradle` |

### Frontend

| Framework | Notes |
|-----------|-------|
| Playwright | Default, auto-installed if missing |

## Output

- **Console**: Test results with pass/fail summary
- **Optional**: `docs/{serviceName}/test-report.md` with detailed report

## Related Skills

| Skill | Relationship |
|-------|--------------|
| `/build` | Run before `/test` to have implementation |
| `/debug` | Run after `/test` if failures occur |
| `/trace` | Document bug fixes found via testing |
