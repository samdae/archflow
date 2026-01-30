# Archflow

**Document-driven development skills with Multi-Agent Debate for Cursor & Claude Code**

Archflow is a set of AI agent skills that enables systematic, document-driven development workflows. It leverages Multi-Agent Debate to produce high-quality architectural designs and maintains full traceability from requirements to implementation.

## Features

- **Document-Driven Development**: Maintain clear requirements, designs, and changelogs throughout the development lifecycle
- **Multi-Agent Debate**: Two specialized agents (Domain Architect and Best Practice Advisor) collaborate to produce optimal designs
- **Systematic Workflows**: Pre-built skills for common development tasks
- **Full Traceability**: Keep documentation synchronized with code changes
- **Debug Mode Integration**: Systematic bug fixing with IDE debugging support (Cursor)

## Platform Support

| Feature | Cursor | Claude Code |
|---------|--------|-------------|
| Skills | ✅ Full | ✅ Full |
| Multi-Agent Debate | ✅ Full | ✅ Full |
| Debug Mode (bugfix) | ✅ Full | ⚠️ Manual error input |
| Plugin Install | ❌ Manual copy | ✅ Marketplace |

**Cursor** is the primary platform with full feature support.
**Claude Code** is supported via plugin system with some limitations.

## Installation

### Cursor (Primary)

Copy the `skills/` and `agents/` folders to your project:

```bash
# Clone the repo
git clone https://github.com/samdae/archflow.git

# Copy to your project
cp -r archflow/skills/* your-project/.cursor/skills/
cp -r archflow/agents/* your-project/.cursor/agents/
```

Or download and copy manually from the [releases page](https://github.com/samdae/archflow/releases).

### Claude Code (Plugin)

```bash
# Step 1: Add archflow marketplace
/plugin marketplace add https://github.com/samdae/archflow

# Step 2: Install archflow plugin
/plugin install archflow
```

Choose your installation scope:
- **user scope**: Install for you globally
- **project scope**: Install for all collaborators on this repository
- **local scope**: Install for you, in this repo only

## Quick Start

After installation, use slash commands (or trigger keywords):

| Command | Description | Trigger Keywords |
|---------|-------------|------------------|
| `/require-refine` | Transform materials into requirements.md | requirements, 요구사항 |
| `/architect` | Multi-agent debate → architect.md | design, 설계 |
| `/implement` | Automated implementation from design | implement, 구현 |
| `/bugfix` | Systematic bug fixing | bug, 버그 |
| `/changelogging` | Record changes to changelog.md | changelog, 변경 |
| `/architect-sync` | Sync changes to architect.md | sync, 동기화 |
| `/architect-enhance` | Design enhancement for existing features | enhance, 개선 |
| `/reinforce` | Fill gaps in incomplete documents | reinforce, 보강 |
| `/reverse` | Reverse-engineer docs from existing code | reverse, 역설계 |
| `/deploy-launchpad` | Generate deployment documentation | deploy, 배포 |

## Workflow

### New Feature Development

```
/require-refine → /architect → /implement
```

### Bug Fixing (Cursor with Debug Mode)

```
[Debug Mode ON] → /bugfix → /changelogging → /architect-sync
```

### Bug Fixing (Claude Code)

```
[Provide error message/stack trace] → /bugfix → /changelogging → /architect-sync
```

### Legacy Code Documentation

```
/reverse → /reinforce → /architect-sync
```

### Feature Enhancement

```
/architect-enhance → /implement
```

## Skills Included

| Skill | Description | Recommended Model |
|-------|-------------|-------------------|
| `require-refine` | Refine raw requirements into structured docs | Opus |
| `architect` | Multi-Agent Debate for feature design | Opus |
| `implement` | Automated implementation from design docs | Sonnet |
| `bugfix` | Systematic debugging with document context | Opus |
| `changelogging` | Generate structured changelogs | Sonnet |
| `architect-sync` | Sync documentation after code changes | Sonnet |
| `architect-enhance` | Design enhancements for existing features | Opus |
| `reinforce` | Enhance existing documentation | Sonnet |
| `reverse` | Generate documentation from code | Opus |
| `deploy-launchpad` | Generate deployment documentation | Sonnet |

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
              ├── requirements.md      # from /require-refine
              ├── architect.md         # from /architect
              ├── changelog.md         # from /changelogging
              └── deploy-launchpad.md  # from /deploy-launchpad
```

## Language Support

All skills are written in English but automatically respond in the user's language.

Supported trigger keywords include:
- English: `architect`, `implement`, `bugfix`, etc.
- Korean: `설계`, `구현`, `버그 수정`, etc.

## License

Apache License 2.0

## Author

samdae

## Repository

https://github.com/samdae/archflow

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## Skill Development Guide

### Front Matter Standard

Every skill file must begin with YAML front matter:

```yaml
---
id: require-refine
name: Require Refine
description: |
  Transform unstructured materials into refined requirements document.
  Collects service name and input materials, creates Q&A loop.

  Triggers: require-refine, 요구사항 정의
user-invocable: true
version: 2.0.0
triggers:
  - "requirements"
  - "require-refine"
requires: []
platform: all
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
| `user-invocable` | Must be `true` for slash command registration (Claude Code) |
| `version` | Semantic versioning |
| `allowed-tools` | List of tools this skill can use |

### Language Directive

All skills must include this after the front matter:

```markdown
> **Language**: This skill is written in English for universal compatibility.
> Always respond in the user's language unless explicitly requested otherwise.
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
