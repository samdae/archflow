---
name: overview
description: |
  Generate a 1-page project overview from requirements and arch documents.
  Perfect for onboarding new team members or quick project introduction.

  Triggers: overview, project overview, onboarding
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Glob
  - LS
  - AskQuestion
  - Skill
---

# /overview

Invoke the **overview** skill to generate project overview.

## What it does

1. **Load Source Documents**
   - Read `docs/{serviceName}/requirements.md`
   - Read `docs/{serviceName}/arch.md`

2. **Extract Key Information**
   - Project name and description
   - Key features (max 5-6)
   - Tech stack summary
   - Architecture diagram (simplified)
   - ERD (main entities)
   - Key flow (sequence diagram)

3. **Generate Overview**
   - Creates `docs/{serviceName}/overview.md`
   - 80-120 lines maximum (excluding diagrams)
   - Links to detailed docs

## Output Structure

```
docs/{serviceName}/overview.md
├── At a Glance (status, tech, repo)
├── What is this? (2-3 sentences)
├── Key Features (5-6 items)
├── Architecture (diagram + table)
├── Data Model (ERD)
├── Key Flow (sequence)
├── Quick Start
└── Learn More (links)
```

## Recommended Model

**Sonnet** (summarization task)

## Prerequisites

- `docs/{serviceName}/requirements.md` from `/spec`
- `docs/{serviceName}/arch.md` from `/arch`

## Usage Examples

```
/overview
→ "Service name?" → "auth-service"
→ Loading requirements.md, arch.md...
→ Extracting key information...
→ Generating diagrams...
→ docs/auth-service/overview.md generated
```
