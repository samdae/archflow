---
name: build
description: |
  Automated implementation based on design document.
  Analyzes arch.md, creates dependency graph, executes step-by-step.

  Triggers: build, compile, implement
user-invocable: true
allowed-tools:
  - Read
  - Write
  - StrReplace
  - Glob
  - Grep
  - LS
  - Shell
  - Task
  - Skill
---

# /implement

Invoke the **implement** skill for automated implementation.

## What it does

1. **Analyze Design Document**
   - Read `docs/{serviceName}/arch.md`
   - Extract Code Mapping section

2. **Create Dependency Graph**
   - Identify file dependencies
   - Determine implementation order

3. **Step-by-Step Execution**
   - Sub-agent based parallel/sequential execution
   - Create files according to Code Mapping
   - Implement APIs, DB schemas, business logic

4. **Validation**
   - Cross-reference implementation with Code Mapping
   - Ensure all planned files are created

5. **Generate Report**
   - Completion status
   - Files created/modified

## Recommended Model

**Sonnet** (cost-effective) / GPT-5.2 Codex available

## Prerequisites

- `docs/{serviceName}/arch.md` from `/arch`

## Next Step

If bugs occur, run `/bugfix` in Debug mode.

## Usage Examples

```
/build
→ Loads arch.md
→ Analyzing Code Mapping...
→ Creating: src/auth/service.py
→ Creating: src/auth/repository.py
→ Creating: tests/auth/test_service.py
→ Implementation complete: 12 files created
```
