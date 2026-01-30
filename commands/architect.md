---
name: architect
description: |
  Multi-agent debate to derive optimal design through two perspectives.
  Domain Architect + Best Practice Advisor collaborate in round-based debate.

  Triggers: architect, design, create architecture, start design
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

# /architect

Invoke the **architect** skill for multi-agent debate design.

## What it does

1. **Load Requirements**
   - Read `docs/{serviceName}/requirements.md`

2. **Multi-Agent Debate**
   - **Domain Architect**: Project context, existing patterns, domain knowledge
   - **Best Practice Advisor**: Industry standards, clean architecture, ideal patterns
   - Round-based debate (typically 2-3 rounds)

3. **User Checkpoint**
   - Present design decisions
   - Get user approval or feedback

4. **Generate Output**
   - Creates `docs/{serviceName}/architect.md`

## Output Structure

```
docs/{serviceName}/architect.md
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

- `docs/{serviceName}/requirements.md` from `/require-refine`

## Next Step

After completion, run `/implement` to start implementation.

## Usage Examples

```
/architect
→ Loads requirements.md
→ Domain Architect proposes...
→ Best Practice Advisor challenges...
→ Round 2...
→ User checkpoint: "Approve design?"
→ docs/auth-service/architect.md generated
```
