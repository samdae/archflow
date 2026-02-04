---
name: reinforce
description: |
  Add new requirements to spec.md or fill gaps in documents.
  Primary: Add new features (replaces /enhance workflow).
  Secondary: Fill gaps after /reverse.

  Triggers: reinforce, add requirements, new feature
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Glob
  - LS
  - AskQuestion
---

# /reinforce

Invoke the **reinforce** skill to add requirements or supplement documents.

## Primary Use: Add New Requirements

**This replaces the old `/enhance` workflow:**

```
Old: /enhance → arch.md direct modification (SSOT violation)
New: /reinforce → spec.md update → /arch → design update (SSOT preserved)
```

## What it does

1. **Load Existing spec.md**
   - Read `docs/{serviceName}/spec.md`
   - Parse Requirement Summary grid

2. **Add New Requirements**
   - User describes new feature
   - Assign new Req ID (FR-xxx)
   - Add to Requirement Summary with Status = `Draft`

3. **Update Related Sections**
   - Feature Specification
   - Non-Functional Requirements
   - Data Contracts (if applicable)

4. **Guide Next Steps**
   - Run `/arch` to update design document

## Secondary Use: Fill Gaps

- After `/reverse` to fill ❓ markers
- Correct incorrectly inferred content
- Add missing information

## Recommended Model

**Sonnet** (document merging) / Opus for complex reasoning

## Enhancement Workflow

```
New Proposal → /reinforce → /arch → /check → /build
```

## Next Step

After adding requirements, run `/arch` to generate/update design.

## Usage Examples

**Adding new requirement:**
```
/reinforce
→ Select: "Add new requirements"
→ "Add user profile photo upload feature"
→ New Req ID: FR-004
→ spec.md updated
→ Next: Run /arch to update design
```

**Filling gaps (after reverse):**
```
/reinforce
→ Select: "Fill gaps"
→ Found 5 unconfirmed items (❓)
→ Q&A loop
→ Documents updated
```
