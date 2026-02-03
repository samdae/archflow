---
name: reverse
description: |
  Reverse-engineer requirements and design documents from existing code.
  Analyzes codebase and generates incomplete docs that need reinforcement.

  Triggers: reverse, reverse engineer, document existing code
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

# /reverse

Invoke the **reverse** skill for legacy code documentation.

## What it does

1. **Collect Inputs**
   - Service name
   - Code scope (directories, files)

2. **Analyze Codebase**
   - File structure analysis
   - Core file identification
   - Pattern recognition

3. **Extract Information**
   - Code Mapping (existing files, dependencies)
   - API Specification (from routes, controllers)
   - DB Schema (from models, migrations)

4. **Infer Requirements**
   - Goal (from README, comments)
   - Features (from code structure)
   - Constraints (from dependencies)

5. **Q&A Loop**
   - Ask about unknown/ambiguous items
   - Mark unconfirmed items with ❓

6. **Generate Output**
   - `docs/{serviceName}/spec.md` (incomplete)
   - `docs/{serviceName}/arch.md` (incomplete)

## Recommended Model

**Opus Required** - Must infer intent from code

## Output

Documents marked with ❓ for unconfirmed items:
- `docs/{serviceName}/spec.md`
- `docs/{serviceName}/arch.md`

## Next Step

Run `/reinforce` to fill gaps in generated documents.

## Usage Examples

```
/reverse
→ "Service name?" → "legacy-api"
→ "Code scope?" → @src/api/ @src/models/
→ Analyzing file structure...
→ Found 23 files, 5 API endpoints, 8 models
→ Inferring requirements...
→ Q: "What is the business purpose of this service?"
→ "Order management for e-commerce"
→ Documents generated (12 items marked ❓)
→ Run /reinforce to complete
```
