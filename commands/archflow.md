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

🚀 Core Pipeline (New Feature)
  /spec                    Transform materials into requirements.md
  /arch                    Multi-agent debate → arch.md
  /check                   Verify design completeness (recommended)
  /build                   Automated implementation from design

🐛 Bugfix & Maintenance
  /debug                   Systematic bug fixing (Debug mode)
  /trace                   Record changes to changelog.md

🔄 Design Evolution
  /sync                    Sync changelog/enhancement to arch.md
  /enhance                 Design enhancement for existing features

📚 Document Management
  /reinforce               Fill gaps in incomplete documents
  /reverse                 Reverse-engineer docs from existing code
  /overview                Generate 1-page project overview

🚢 Deployment
  /runbook                 Generate deployment documentation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 Document Structure:
   docs/{serviceName}/
   ├── requirements.md     # from /spec
   ├── arch.md             # from /arch
   ├── changelog.md        # from /trace
   ├── overview.md         # from /overview
   └── runbook.md          # from /runbook

💡 Recommended Flow:
   New Feature:  /spec → /arch → /check → /build
   Bugfix:       /debug → /trace → /sync
   Legacy Code:  /reverse → /reinforce → /sync
   Enhancement:  /enhance → /build

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  Note: Skills may not have autocomplete in CLI.
    Type the command directly (e.g., /spec)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Skills Reference

### Core Pipeline (4)

| Skill | Description |
|-------|-------------|
| `/spec` | Transform unstructured materials into refined requirements |
| `/arch` | Multi-agent debate for optimal design |
| `/check` | Verify design completeness before implementation |
| `/build` | Automated implementation from design document |

### Bugfix & Maintenance (2)

| Skill | Description |
|-------|-------------|
| `/debug` | Systematic bug fixing with Debug mode |
| `/trace` | Record changes and fixes to changelog |

### Design Evolution (2)

| Skill | Description |
|-------|-------------|
| `/sync` | Synchronize changes to arch document |
| `/enhance` | Design enhancement for existing features |

### Document Management (3)

| Skill | Description |
|-------|-------------|
| `/reinforce` | Fill gaps in incomplete documents |
| `/reverse` | Reverse-engineer docs from existing code |
| `/overview` | Generate 1-page project overview for onboarding |

### Deployment (1)

| Skill | Description |
|-------|-------------|
| `/runbook` | Generate deployment documentation |
