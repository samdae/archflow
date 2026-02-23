# Archflow

**Document-driven development skills with Multi-Agent Debate for AI coding tools**

Archflow is a skill-based plugin for AI coding tools (Cursor, Claude Code) that enables systematic, document-driven development workflows. It leverages Multi-Agent Debate to produce high-quality architectural designs and maintains full traceability from requirements to implementation.

## System Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Backend Development                              │
│                                                                             │
│  /spec → /arch → /check → /pre-build → /build → /test                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           Frontend Development                              │
│                                                                             │
│  /spec → /arch(BE) → /check → /ui → /arch(FE) → /check → /pre-build       │
│       → /build → /test                                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              Bug Fix                                        │
│                                                                             │
│  /debug → /trace → /sync                                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                             Enhancement                                     │
│                                                                             │
│  /reinforce → /arch → /check → /pre-build → /build → /test                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         Legacy Documentation                                │
│                                                                             │
│  /reverse → /reinforce (optional) → /check                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

> **SSOT Principle**: All changes start from spec.md. arch.md is a derived document.

## Features

- **Document-Driven Development**: Maintain clear requirements, designs, and changelogs throughout the development lifecycle
- **Multi-Agent Debate**: Two specialized agents (Domain Architect and Best Practice Advisor) collaborate to produce optimal designs
- **Systematic Workflows**: 14 pre-built skills for common development tasks
- **Full Traceability**: Keep documentation synchronized with code changes

## Installation

### AI-Assisted (Recommended)

Open `docs/launchpad.md` in your AI tool and tell the AI:
> "Follow this launchpad to install archflow"

The AI will clone the repository and copy the necessary files automatically.

### Manual Installation

#### Cursor

```bash
git clone https://github.com/samdae/archflow.git .archflow-tmp
cp -r .archflow-tmp/skills/ .cursor/skills/
cp -r .archflow-tmp/rules/ .cursor/rules/
cp -r .archflow-tmp/agents/ .cursor/agents/
rm -rf .archflow-tmp
```

#### Claude Code

Inside Claude Code, run these commands:

```
/plugin marketplace add samdae/archflow
/plugin install archflow@samdae
/plugin enable archflow@samdae
```

### Supported Tools

| Tool | Installation |
|------|-------------|
| **Cursor** | Clone + copy to `.cursor/skills/`, `.cursor/rules/`, `.cursor/agents/` |
| **Claude Code** | `/plugin marketplace add samdae/archflow` → install → enable |

## Quick Start

After installation, use slash commands:

| Command | Description |
|---------|-------------|
| `/archflow` | Show all available skills |
| `/spec` | Transform materials into spec.md |
| `/arch` | Multi-agent debate → arch-be.md or arch-fe.md |
| `/ui` | Generate UI specification from API endpoints |
| `/check` | Verify design completeness |
| `/pre-build` | Verify environment readiness (deps, secrets, infra) |
| `/build` | Automated implementation from design |
| `/test` | Generate and/or run tests (scoped) |
| `/debug` | Systematic bug fixing with direct execution |
| `/trace` | Record changes to trace.md |
| `/sync` | Sync changes to arch.md |
| `/reinforce` | Add requirements to spec.md or fill gaps |
| `/reverse` | Reverse-engineer docs from existing code |
| `/overview` | Generate 1-page project overview |
| `/runbook` | Generate deployment documentation |

## Workflow

### Backend Development

```
/spec → /arch → /check → /pre-build → /build → /test
```

### Frontend Development

```
/spec → /arch(BE) → /check → /ui → /arch(FE) → /check → /pre-build → /build → /test
```

### Bug Fixing

```
/debug → /trace → /sync
```

### Feature Enhancement

```
/reinforce → /arch → /check → /pre-build → /build → /test
```

### Legacy Code Documentation

```
/reverse → /reinforce (optional) → /check
```

> **Note**: All changes start from spec.md via `/spec` or `/reinforce`.

## Skills Included

| Skill | Description | BE/FE | Recommended Model |
|-------|-------------|-------|-------------------|
| `spec` | Refine raw requirements into structured docs | - | Opus |
| `arch` | Multi-Agent Debate for feature design | BE/FE | Opus |
| `ui` | Generate UI specification from API endpoints | - | Opus |
| `check` | Verify design completeness before implementation | BE/FE | Sonnet |
| `pre-build` | Verify environment readiness (deps, secrets, infra) | BE/FE | Sonnet |
| `build` | Automated implementation from design docs | BE/FE | Sonnet |
| `test` | Generate and/or run tests with scoped targeting | BE/FE | Sonnet |
| `debug` | Systematic debugging with direct code execution | - | Opus |
| `trace` | Generate structured changelogs | - | Sonnet |
| `sync` | Sync documentation after code changes | - | Sonnet |
| `reinforce` | Add requirements or fill documentation gaps | - | Sonnet |
| `reverse` | Generate documentation from code | BE/FE | Opus |
| `overview` | Generate 1-page project overview | - | Sonnet |
| `runbook` | Generate deployment documentation | - | Sonnet |

> Skills marked with "BE/FE" support separate profiles for Backend and Frontend development.

## Agents Included

| Agent | Description |
|-------|-------------|
| `domain-architect` | Project-aware design agent with domain knowledge |
| `best-practice-advisor` | Context-free best practice advisor |

## Document Structure

Skills that generate documentation follow this folder structure:

```
projectRoot/
  └── docs/
        └── {serviceName}/
              ├── spec.md           # from /spec
              ├── arch-be.md        # from /arch (Backend)
              ├── ui.md             # from /ui (UI specification)
              ├── arch-fe.md        # from /arch (Frontend)
              ├── trace.md          # from /trace
              ├── overview.md       # from /overview
              └── runbook.md        # from /runbook
```

> **Note**: Frontend development requires `/ui` before `/arch (FE)`. The ui.md defines screens, components, and interactions based on backend API endpoints.

## Language Support

All skills are written in English but automatically respond in the user's language.

Supported trigger keywords include:
- English: `arch`, `build`, `debug`, etc.
- Korean: `설계`, `구현`, `디버그`, etc.

## License

Apache License 2.0

## Author

samdae

## Repository

https://github.com/samdae/archflow

---

## Skill Development Guide

### Front Matter Standard

Every skill file must begin with YAML front matter:

```yaml
---
id: spec
name: Spec
description: |
  Transform unstructured materials into refined requirements document.
  Collects service name and input materials, creates Q&A loop.

  Triggers: spec, specification, 요구사항 정의
user-invocable: true
version: 2.0.0
triggers:
  - "spec"
  - "specification"
  - "requirements"
requires: []
recommended_model: opus
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
  - LS
  - AskQuestion
---
```

#### Required Fields

| Field | Description |
|-------|-------------|
| `id` | Unique skill identifier in kebab-case |
| `name` | Human-readable skill name |
| `description` | Brief description with triggers |
| `user-invocable` | Must be `true` for slash command registration |
| `version` | Semantic versioning |
| `allowed-tools` | List of tools this skill can use |

### Language Directive

All skills include a global rules reference after the front matter:

```markdown
> **Global Rules**: Adheres to rules/archflow-rules.md
```

### Tool Fallback

Every skill should handle unavailable tools:

| Tool | Fallback |
|------|----------|
| Read/Grep | Request file path → ask for copy-paste |
| AskQuestion | "Please select: 1) OptionA 2) OptionB" format |
| Task | Step-by-step checklist or Self-debate pattern |

### Quality Gates

Skills producing implementation-ready documents must validate:

| Item | Validation Criteria |
|------|-------------------|
| DB Schema | All tables have full column definitions |
| Code Mapping | All features mapped to file/class/method |
| API Spec | All endpoints have Request/Response defined |
| Error Policy | Main error scenarios defined |

⚠️ If incomplete, return to previous phase for clarification.
