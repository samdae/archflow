---
name: archflow
description: |
  archflow plugin help - Show all available archflow skills.
  Workaround for skills autocomplete issue.

  Use "/archflow" or just type "archflow help" to see available skills list.

  Triggers: archflow, archflow help, archflow skills, show archflow commands
user-invocable: true
allowed-tools:
  - Read
  - Skill
---

# archflow Skills

> Show all available archflow skills (Skills autocomplete workaround)

Display the following help message:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 archflow - The Design Compiler v2.0.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 Core Pipeline (Feature Development)
  /spec                    Transform materials into spec.md
  /arch                    Multi-agent debate → arch-be/fe.md
  /ui                      Generate UI spec from API endpoints
  /check                   Verify design completeness
  /pre-build               Verify environment readiness
  /build                   Automated implementation from design
  /test                    Generate and/or run tests

🐛 Bugfix & Maintenance
  /debug                   Systematic bug fixing (Debug mode)
  /trace                   Record changes to trace.md
  /sync                    Sync design-impacting changes to arch.md

📚 Document Management
  /reinforce               Add requirements or fill documentation gaps
  /reverse                 Reverse-engineer docs from existing code
  /overview                Generate 1-page project overview

🚢 Deployment
  /runbook                 Generate deployment documentation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 Document Structure:
   docs/{serviceName}/
   ├── spec.md              # from /spec
   ├── arch-be.md           # from /arch (Backend)
   ├── ui.md                # from /ui
   ├── arch-fe.md           # from /arch (Frontend)
   ├── trace.md             # from /trace
   ├── overview.md          # from /overview
   └── runbook.md           # from /runbook

💡 Recommended Flow:
   Feature BE:   /spec → /arch → /check → /pre-build → /build → /test
   Feature FE:   /spec → /arch(BE) → /check → /ui → /arch(FE) → /check → /pre-build → /build → /test
   Bugfix:       /debug → /trace → /sync
   Enhancement:  /reinforce → /arch → /check → /pre-build → /build → /test
   Legacy:       /reverse → /reinforce (optional) → /check

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  Note: Skills may not have autocomplete in CLI.
    Type the command directly (e.g., /spec)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Skills Reference

### Core Pipeline (7)

| Skill | Description |
|-------|-------------|
| `/spec` | Transform unstructured materials into refined requirements |
| `/arch` | Multi-agent debate for optimal design (BE/FE) |
| `/ui` | Generate UI specification from API endpoints |
| `/check` | Verify design completeness before implementation (BE/FE) |
| `/pre-build` | Verify environment readiness (deps, secrets, infra) |
| `/build` | Automated implementation from design document (BE/FE) |
| `/test` | Generate and/or run tests with scoped targeting (BE/FE) |

### Bugfix & Maintenance (3)

| Skill | Description |
|-------|-------------|
| `/debug` | Systematic bug fixing with Debug mode |
| `/trace` | Record changes and fixes to changelog |
| `/sync` | Synchronize design-impacting changes to arch document |

### Document Management (3)

| Skill | Description |
|-------|-------------|
| `/reinforce` | Add requirements or fill documentation gaps |
| `/reverse` | Reverse-engineer docs from existing code (BE/FE) |
| `/overview` | Generate 1-page project overview for onboarding |

### Deployment (1)

| Skill | Description |
|-------|-------------|
| `/runbook` | Generate deployment documentation |
