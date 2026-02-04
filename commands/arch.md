---
name: arch
description: |
  Multi-agent debate to derive optimal design through two perspectives.
  Domain Architect + Best Practice Advisor collaborate in round-based debate.

  Triggers: arch, architecture, blueprint
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
  - LS
  - Task
  - AskQuestion
  - Skill
---

# /arch

Invoke the **arch** skill for multi-agent debate design.

## BE/FE Support

This skill supports separate templates for Backend and Frontend:
- **Backend**: `templates/be.md` → generates `arch-be.md`
- **Frontend**: `templates/fe.md` → generates `arch-fe.md`

## What it does

1. **Load Requirements**
   - Read `docs/{serviceName}/spec.md`
   - (Frontend only) Read `docs/{serviceName}/ui.md`

2. **Select Architecture Type**
   - **Backend**: API server, business logic, database
   - **Frontend**: Web app, SPA, components (requires ui.md)

3. **Multi-Agent Debate**
   - **Domain Architect**: Project context, existing patterns, domain knowledge
   - **Best Practice Advisor**: Industry standards, clean architecture, ideal patterns
   - Round-based debate (typically 2-3 rounds)

4. **User Checkpoint**
   - Present design decisions
   - Get user approval or feedback

5. **Generate Output**
   - Creates `docs/{serviceName}/arch-be.md` (Backend)
   - Creates `docs/{serviceName}/arch-fe.md` (Frontend)

## Output Structure

**Backend (arch-be.md):**
- Tech Stack (DB, ORM, Infra)
- Database Schema (YAML)
- Code Mapping (Repository, Service, Controller)
- API Specification
- Migration Summary

**Frontend (arch-fe.md):**
- Tech Stack (Framework, State Mgmt, Styling)
- Component Structure
- State Management
- Route Definition
- API Integration

## Recommended Model

**Opus Required** - Design quality determines implementation quality

## Prerequisites

**Backend:**
- `docs/{serviceName}/spec.md` from `/spec`

**Frontend:**
- `docs/{serviceName}/spec.md` from `/spec`
- `docs/{serviceName}/ui.md` from `/ui`

## Next Step

After completion, run `/check` then `/build` to start implementation.

## Usage Examples

**Backend:**
```
/arch
→ Select: Backend
→ Loads spec.md + be.md template
→ Domain Architect proposes...
→ Best Practice Advisor challenges...
→ User checkpoint: "Approve design?"
→ docs/auth-service/arch-be.md generated
```

**Frontend:**
```
/arch
→ Select: Frontend
→ Check: ui.md exists?
→ Loads spec.md + ui.md + fe.md template
→ Domain Architect proposes...
→ Best Practice Advisor challenges...
→ User checkpoint: "Approve design?"
→ docs/auth-service/arch-fe.md generated
```

## Flow Position

```
Backend: /spec → /arch (BE) → /check → /build
Frontend: /spec → /arch (BE) → /ui → /arch (FE) → /check → /build
```
