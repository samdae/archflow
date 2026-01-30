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
📐 archflow - Document-Driven Development Pipeline v1.0.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 Core Pipeline (New Feature)
  /require-refine          Transform materials into requirements.md
  /architect               Multi-agent debate → architect.md
  /implement               Automated implementation from design

🐛 Bugfix & Maintenance
  /bugfix                  Systematic bug fixing (Debug mode)
  /changelogging           Record changes to changelog.md

🔄 Design Evolution
  /architect-sync          Sync changelog/enhancement to architect.md
  /architect-enhance       Design enhancement for existing features

📚 Document Management
  /reinforce               Fill gaps in incomplete documents
  /reverse                 Reverse-engineer docs from existing code

🚢 Deployment
  /deploy-launchpad        Generate deployment documentation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 Document Structure:
   docs/{serviceName}/
   ├── requirements.md     # from /require-refine
   ├── architect.md        # from /architect
   ├── changelog.md        # from /changelogging
   └── deploy-launchpad.md # from /deploy-launchpad

💡 Recommended Flow:
   New Feature:  /require-refine → /architect → /implement
   Bugfix:       /bugfix → /changelogging → /architect-sync
   Legacy Code:  /reverse → /reinforce → /architect-sync
   Enhancement:  /architect-enhance → /implement

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  Note: Skills may not have autocomplete in CLI.
    Type the command directly (e.g., /require-refine)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Skills Reference

### Core Pipeline (3)

| Skill | Description |
|-------|-------------|
| `/require-refine` | Transform unstructured materials into refined requirements |
| `/architect` | Multi-agent debate for optimal design |
| `/implement` | Automated implementation from design document |

### Bugfix & Maintenance (2)

| Skill | Description |
|-------|-------------|
| `/bugfix` | Systematic bug fixing with Debug mode |
| `/changelogging` | Record changes and fixes to changelog |

### Design Evolution (2)

| Skill | Description |
|-------|-------------|
| `/architect-sync` | Synchronize changes to architect document |
| `/architect-enhance` | Design enhancement for existing features |

### Document Management (2)

| Skill | Description |
|-------|-------------|
| `/reinforce` | Fill gaps in incomplete documents |
| `/reverse` | Reverse-engineer docs from existing code |

### Deployment (1)

| Skill | Description |
|-------|-------------|
| `/deploy-launchpad` | Generate deployment documentation |
