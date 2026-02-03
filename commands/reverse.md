---
name: reverse
description: |
  Reverse-engineer requirements and design documents from existing code.
  Analyzes codebase and generates incomplete docs that need reinforcement.

  Triggers: reverse, reverse engineer, document existing code
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
  - LS
  - AskQuestion
  - Skill
---

# /reverse

Invoke the **reverse** skill for legacy code documentation.

## BE/FE Support

This skill asks for code type and loads appropriate profile:
- **Backend**: uses `profiles/be.md` → generates `arch-be.md`
- **Frontend**: uses `profiles/fe.md` → generates `arch-fe.md`

## What it does

1. **Collect Inputs**
   - Service name
   - Code type (Backend or Frontend)
   - Code scope (directories, files)

2. **Analyze Codebase (Backend)**
   - Router/Controller → API endpoints
   - Model/Entity → DB schema
   - Service/Usecase → Business logic

3. **Analyze Codebase (Frontend)**
   - Pages/Routes → Route structure
   - Components → Component hierarchy
   - Hooks/Store → State management

4. **Extract Information**
   - Code Mapping / Component Structure
   - API Specification (BE) or API Integration (FE)
   - DB Schema (BE) or State Schema (FE)

5. **Infer Requirements**
   - Goal (from API patterns / UI patterns)
   - Features (from code structure)
   - Constraints (from dependencies)

6. **Q&A Loop**
   - Ask about unknown/ambiguous items
   - Mark unconfirmed items with ❓

7. **Generate Output**
   - `docs/{serviceName}/spec.md` (incomplete)
   - `docs/{serviceName}/arch-be.md` or `arch-fe.md` (incomplete)

## Recommended Model

**Opus Required** - Must infer intent from code

## Output

Documents marked with ❓ for unconfirmed items:
- `docs/{serviceName}/spec.md`
- `docs/{serviceName}/arch-be.md` (Backend)
- `docs/{serviceName}/arch-fe.md` (Frontend)

## Next Step

Run `/reinforce` to fill gaps in generated documents.

## Usage Examples

```
/reverse
→ "Service name?" → "legacy-api"
→ "Code type?" → "Backend"
→ "Code scope?" → @src/api/ @src/models/
→ Analyzing file structure...
→ Found 23 files, 5 API endpoints, 8 models
→ Documents generated (12 items marked ❓)

/reverse
→ "Service name?" → "dashboard"
→ "Code type?" → "Frontend"
→ "Code scope?" → @src/pages/ @src/components/
→ Analyzing component structure...
→ Found 15 components, 8 routes, 3 stores
→ Documents generated (8 items marked ❓)
```
