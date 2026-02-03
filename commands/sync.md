---
name: sync
description: |
  Synchronize changelog/enhancement results to arch document.
  Filters design-impacting changes and updates arch.md.

  Triggers: sync, synchronize
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Glob
  - LS
  - Skill
---

# /sync

Invoke the **sync** skill to synchronize design documents.

## What it does

1. **Filter Design-Impacting Items**
   - Scan `docs/{serviceName}/changelog.md`
   - Find entries with "Design Impact: Yes"

2. **Analyze Changes**
   - Extract patterns, API changes, schema updates
   - Determine integration points in arch.md

3. **Check for Conflicts**
   - Compare with existing design decisions
   - Identify potential inconsistencies

4. **Update Architect**
   - Integrate changes into `docs/{serviceName}/arch.md`
   - Update Code Mapping, API Spec, DB Schema as needed

5. **Add Sync History**
   - Record sync metadata
   - Link to changelog entries

## Recommended Model

**Sonnet** (document merging) / Opus for complex conflicts

## When to Use

- After `/bugfix` when "Design Impact: Yes"
- After `/enhance` to integrate enhancement design

## Next Step

If implementation needed, run `/build`.

## Usage Examples

```
/sync
→ Scanning changelog.md...
→ Found 2 design-impacting changes
→ Analyzing integration points...
→ Updating Code Mapping section...
→ arch.md synchronized
→ Sync history added
```
