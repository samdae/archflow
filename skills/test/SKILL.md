---
name: test
description: Generate and/or run tests for archflow projects. Use when validating changes, regression checks, or pre-release verification. Supports BE (API/unit) and FE (Playwright headless) with scoped runs (change-based default), FR-based, module-based, or custom paths.
---

# Test

## Overview
Create and/or execute tests for backend and frontend changes with minimal scope. Default scope is change-based (git diff), aligned to the arch commit baseline.

## Core Capabilities

### 1) Mode Selection
Choose one:
- **generate**: write tests only
- **run**: execute existing tests only
- **both**: generate then execute

### 2) Target Selection (BE/FE)
- **BE**: API/unit tests (project defaults)
- **FE**: Playwright headless E2E
- **Both**: split by BE/FE scopes

### 3) Scope Selection (default = change-based)
- **change-based** (default): use `git diff` vs last arch commit
- **FR-based**: select Req IDs (e.g., FR-001)
- **module-based**: select modules/features from Code Mapping
- **custom paths**: user-provided file/test paths

> **Baseline rule**: build is always after arch commit. Use the **latest arch commit** as the diff base.

## Workflow

### Step 0: Collect Inputs
Ask for:
- target: BE / FE / both
- mode: generate / run / both
- scope type: change-based / FR / module / custom

### Step 1: Resolve Scope
**Change-based (default):**
1) Find latest commit with message prefix `docs({serviceName}): arch`
2) Run `git diff --name-only <arch_commit>..HEAD`
3) Map changed files → test targets

**FR-based:**
- Read `docs/{serviceName}/spec.md` and `arch-*.md`
- Map FR → Code Mapping rows → files

**Module-based:**
- Use Code Mapping sections in `arch-*.md`

**Custom:**
- Use provided paths

### Step 2: Generate Tests (if mode includes generate)
- **BE**: generate API/unit tests using project conventions
- **FE**: generate Playwright tests (headless by default)

### Step 3: Run Tests (if mode includes run)
- **BE**: run project test command (pytest/npm test/etc.)
- **FE**: run Playwright headless

### Step 4: Report
Return:
- scope used
- tests created (paths)
- tests executed + results

## Notes
- If git unavailable, ask for a file list to scope tests.
- If FE test tooling not installed, propose adding Playwright to dependencies and rerun.
