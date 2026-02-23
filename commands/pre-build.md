---
name: pre-build
description: |
  Verify implementation readiness before build.
  Checks external services, infrastructure, business logic, mock data.

  Triggers: pre-build, prepare, ready check
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

# /pre-build

Invoke the **pre-build** skill to verify implementation readiness before starting build.

## What it does

1. **Analyze Architecture**
   - Read arch-be.md / arch-fe.md
   - Identify external dependencies, services, APIs

2. **Check Readiness**
   - External service availability (DB, APIs, auth providers)
   - Infrastructure prerequisites (env vars, configs, ports)
   - Business logic dependencies (seed data, mock services)

3. **Generate Checklist**
   - Creates actionable readiness report
   - Flags blockers and warnings

4. **Generate Output**
   - Creates `docs/{serviceName}/pre-build.md`

## Output Structure

```
docs/{serviceName}/pre-build.md
├── External Services Status
├── Infrastructure Checklist
├── Mock/Stub Requirements
├── Environment Variables
└── Blockers & Warnings
```

## Recommended Model

**Sonnet** (cost-effective, sufficient for checklist generation)

## Next Step

After all items pass, run `/build` to start implementation.

## Usage Examples

```
/pre-build
→ Reads arch-be.md, arch-fe.md
→ Checks external service availability
→ Generates readiness checklist
→ docs/auth-service/pre-build.md generated
```
