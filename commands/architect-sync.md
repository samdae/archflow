---
name: architect-sync
description: |
  Synchronize changelog/enhancement results to architect document.
  Filters design-impacting changes and updates architect.md.

  Triggers: architect-sync, sync design, update architect
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Glob
  - LS
  - Skill
---

# /architect-sync

Invoke the **architect-sync** skill to synchronize design documents.

## What it does

1. **Filter Design-Impacting Items**
   - Scan `docs/{serviceName}/changelog.md`
   - Find entries with "Design Impact: Yes"

2. **Analyze Changes**
   - Extract patterns, API changes, schema updates
   - Determine integration points in architect.md

3. **Check for Conflicts**
   - Compare with existing design decisions
   - Identify potential inconsistencies

4. **Update Architect**
   - Integrate changes into `docs/{serviceName}/architect.md`
   - Update Code Mapping, API Spec, DB Schema as needed

5. **Add Sync History**
   - Record sync metadata
   - Link to changelog entries

## Recommended Model

**Sonnet** (document merging) / Opus for complex conflicts

## When to Use

- After `/bugfix` when "Design Impact: Yes"
- After `/architect-enhance` to integrate enhancement design

## Next Step

If implementation needed, run `/implement`.

## Usage Examples

```
/architect-sync
→ Scanning changelog.md...
→ Found 2 design-impacting changes
→ Analyzing integration points...
→ Updating Code Mapping section...
→ architect.md synchronized
→ Sync history added
```
