---
name: require-refine
description: |
  Transform unstructured materials into refined requirements document.
  Collects service name and input materials, creates Q&A loop to clarify unclear points.

  Triggers: require-refine, refine requirements, create requirements
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

# /require-refine

Invoke the **require-refine** skill to transform unstructured materials into a refined requirements document.

## What it does

1. **Collect Inputs**
   - Service name
   - Input materials (meetings, specs, sketches, etc.)

2. **Create Draft Requirements**
   - Analyze all inputs
   - Structure into standard format

3. **Q&A Loop**
   - Identify unclear or ambiguous points
   - Ask clarifying questions
   - Iterate until requirements are clear

4. **Generate Output**
   - Creates `docs/{serviceName}/requirements.md`

## Output Structure

```
docs/{serviceName}/requirements.md
├── Goal
├── Core Features
├── Non-Functional Requirements
├── Constraints
└── Out of Scope
```

## Recommended Model

**Opus** (quality priority) / Sonnet acceptable (cost savings)

## Next Step

After completion, run `/architect` to start design.

## Usage Examples

```
/require-refine
→ "Service name?" → "auth-service"
→ "Input materials?" → @meeting-notes.md @api-sketch.png
→ Q&A loop...
→ docs/auth-service/requirements.md generated
```
