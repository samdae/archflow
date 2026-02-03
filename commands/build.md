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

# /build

Invoke the **build** skill for automated implementation.

## BE/FE Support

This skill auto-detects profile from input file:
- **Backend**: `arch-be.md` → uses `profiles/be.md`
- **Frontend**: `arch-fe.md` → uses `profiles/fe.md`

## What it does

1. **Analyze Design Document**
   - Read `docs/{serviceName}/arch-be.md` or `arch-fe.md`
   - Auto-load appropriate profile (BE or FE)
   - Extract Code Mapping / Component Structure

2. **Create Dependency Graph**
   - **Backend**: Model → Repository → Service → Controller
   - **Frontend**: Types → API → Store → Components → Pages

3. **Step-by-Step Execution**
   - Sub-agent based parallel/sequential execution
   - Create files according to Code Mapping
   - Implement APIs, DB schemas (BE) or components, state (FE)

4. **Validation**
   - Cross-reference implementation with Code Mapping
   - Ensure all planned files are created

5. **Generate Report**
   - Completion status
   - Files created/modified
   - Migration SQL (BE) or Build commands (FE)

## Recommended Model

**Sonnet** (cost-effective) / GPT-5.2 Codex available

## Prerequisites

- `docs/{serviceName}/arch-be.md` or `arch-fe.md` from `/arch`

## Next Step

If bugs occur, run `/debug` in Debug mode.

## Usage Examples

```
/build @docs/auth/arch-be.md
→ Detected: Backend profile
→ Analyzing Code Mapping...
→ Creating: src/auth/service.py
→ Creating: src/auth/repository.py
→ Implementation complete: 12 files created

/build @docs/dashboard/arch-fe.md
→ Detected: Frontend profile
→ Analyzing Component Structure...
→ Creating: src/components/Dashboard/
→ Creating: src/hooks/useDashboard.ts
→ Implementation complete: 8 files created
```
