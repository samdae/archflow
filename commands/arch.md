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

## What it does

1. **Load Requirements**
   - Read `docs/{serviceName}/spec.md`

2. **Multi-Agent Debate**
   - **Domain Architect**: Project context, existing patterns, domain knowledge
   - **Best Practice Advisor**: Industry standards, clean architecture, ideal patterns
   - Round-based debate (typically 2-3 rounds)

3. **User Checkpoint**
   - Present design decisions
   - Get user approval or feedback

4. **Generate Output**
   - Creates `docs/{serviceName}/arch.md`

## Output Structure

```
docs/{serviceName}/arch.md
├── Overview
├── Architecture Decisions
├── Code Mapping
│   ├── Files to create/modify
│   └── Dependencies
├── API Specification
├── DB Schema
└── Design Notes
```

## Recommended Model

**Opus Required** - Design quality determines implementation quality

## Prerequisites

- `docs/{serviceName}/spec.md` from `/spec`

## Next Step

After completion, run `/build` to start implementation.

## Usage Examples

```
/arch
→ Loads spec.md
→ Domain Architect proposes...
→ Best Practice Advisor challenges...
→ Round 2...
→ User checkpoint: "Approve design?"
→ docs/auth-service/arch.md generated
```
