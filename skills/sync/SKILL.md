---
id: sync
name: Sync
description: |
  Synchronize changelog/enhancement results to arch document.
  Filters design-impacting changes and updates arch.md.

  Triggers: sync, synchronize, 동기화, 설계 동기화
user-invocable: true
version: 2.0.0
triggers:
  - "sync"
  - "synchronize"
  - "design sync"
requires: ["debug", "enhance"]
platform: all
recommended_model: sonnet
allowed-tools:
  - Read
  - Write
  - Glob
  - LS
---

> **Language**: This skill is written in English for universal compatibility.
> Always respond in the user's language unless explicitly requested otherwise.
> If uncertain about the user's language, ask for clarification.

# Sync Workflow

Synchronize design-impacting items from changelog or enhancement design results to existing arch.md.

## 💡 Recommended Model

**Sonnet recommended** (document merging task)

→ For complex conflicts, Opus recommended

## 🔄 Tool Fallback

| Tool | Alternative when unavailable |
|------|------------------------------|
| **Read** | Request file path from user → ask for copy-paste |
| **AskQuestion** | "Please select: 1) OptionA 2) OptionB" format |

## 📁 Document Structure

```
projectRoot/
  └── docs/
        └── {serviceName}/
              ├── spec.md
              ├── arch.md      # ← Sync target
              └── trace.md      # ← Input (design-impacting items)
```

## ⚠️ Execution Timing

Run in following situations:
1. **After debug completion** - When "Design Impact: Yes" items added to changelog
2. **After /enhance completion** - When integrating enhancement design to existing arch

---

## Phase 0: Skill Entry

### 0-0. Model Guidance

> 💡 **This skill recommends the Sonnet model.**
> Document merging task, so high-performance model unnecessary.
>
> **Input**: trace.md (design-impacting items) or enhancement design result
> **Output**: Updated arch.md

### 0-1. Verify Sync Type

```json
{
  "title": "Architect Synchronization",
  "questions": [
    {
      "id": "sync_type",
      "prompt": "What content will you synchronize?",
      "options": [
        {"id": "debug", "label": "Bug fix - Design-impacting items from changelog"},
        {"id": "enhance", "label": "Feature enhancement - enhance results"}
      ]
    }
  ]
}
```

### 0-2. Collect File Input

**When debug selected:**
```json
{
  "title": "File Input",
  "questions": [
    {
      "id": "has_changelog",
      "prompt": "Please provide changelog file path (docs/{serviceName}/trace.md)",
      "options": [
        {"id": "yes", "label": "Yes - I will provide via @filepath"}
      ]
    },
    {
      "id": "has_arch",
      "prompt": "Please provide arch file path (docs/{serviceName}/arch.md)",
      "options": [
        {"id": "yes", "label": "Yes - I will provide via @filepath"}
      ]
    }
  ]
}
```

**When enhance selected:**
> "Please provide enhancement design result and existing arch.md path."

### 0-3. Infer serviceName

Extract serviceName from input file path:
- Input: `docs/alert/trace.md`
- Extract: `serviceName = "alert"`

---

## Phase 1: Analyze Changes

### 1-1. Debug Sync (trace → arch)

Filter only **"Design Impact: Yes"** items from changelog:

```
Analyze changelog:
  for each item:
    if Design Impact == "Yes":
      → Add to sync targets
      → Identify affected sections (Code Mapping, API Spec, DB Schema, etc.)
```

### 1-2. Enhancement Sync (enhancement result → arch)

Identify changes/additions from enhancement design results:
- New APIs
- Modified APIs
- New components
- DB schema changes

### 1-3. Report Changes

```markdown
## Sync Target Analysis

### Change Items
| Source | Affected Section | Change Content |
|--------|-----------------|----------------|
| {changelog date or enhance} | {section name} | {change description} |

### arch.md Modification Plan
| Section | Current State | After Change |
|---------|--------------|-------------|
| {section name} | {existing content summary} | {changed content summary} |
```

### 1-4. Git Commit Strategy

```json
{
  "title": "Git Commit Before Modification",
  "questions": [
    {
      "id": "git_strategy",
      "prompt": "Do you want to Git commit the current state before modifying arch.md?",
      "options": [
        {"id": "commit", "label": "Yes - Commit then proceed (recommended)"},
        {"id": "skip", "label": "No - Proceed immediately"}
      ]
    }
  ]
}
```

- When `commit` selected:
  ```bash
  git add docs/{serviceName}/arch.md
  git commit -m "backup: arch.md before sync"
  ```
- When `skip` selected: Proceed directly to Phase 2

---

## Phase 2: Conflict Verification

### 2-1. Check for Conflicts

Compare existing arch content with new changes:

| Conflict Type | Example | Resolution |
|--------------|---------|------------|
| Duplicate modification in same section | Same endpoint in API Spec | Request user selection |
| Logical inconsistency | References deleted API | Warn and confirm with user |
| None | Adding new item | Auto-proceed |

### 2-2. When Conflict Occurs

```json
{
  "title": "Sync Conflict Detected",
  "questions": [
    {
      "id": "conflict_resolution",
      "prompt": "Existing content conflicts with new changes.\n\nExisting: {existing content}\nNew: {new content}\n\nHow to proceed?",
      "options": [
        {"id": "keep_old", "label": "Keep existing - Ignore new changes"},
        {"id": "use_new", "label": "Replace with new content"},
        {"id": "merge", "label": "Merge - Reflect both"},
        {"id": "manual", "label": "Manual handling - I will modify directly"}
      ]
    }
  ]
}
```

---

## Phase 3: Update arch.md

### 3-1. Update by Section

| Section | Update Method |
|---------|--------------|
| Code Mapping | Add/modify/delete rows |
| API Spec | Add/modify endpoints |
| DB Schema | Modify table/column definitions |
| Sequence Diagram | Modify diagram |
| Risks & Tradeoffs | Add new tradeoffs |

### 3-2. Add Sync History

Add/update sync history section at bottom of arch.md:

```markdown
---

## Sync History

| Date | Type | Source | Changes |
|------|------|--------|---------|
| {date} | debug | changelog {date} | {change summary} |
| {date} | enhance | requirements v2 | {change summary} |
```

### 3-3. Save

Save updated arch.md (overwrite existing file)

---

## Phase 4: Completion Report

```markdown
## Architect Synchronization Complete

### Sync Summary
| Item | Content |
|------|---------|
| Type | debug / enhance |
| Source | {changelog date or requirements} |
| Modified Sections | {section list} |

### Change History
| Section | Change Type | Change Content |
|---------|------------|----------------|
| {section} | Add/Modify/Delete | {content} |

### Files
- Updated: `docs/{serviceName}/arch.md`

### Next Steps
- **If implementation needed**: Run `build` skill
- **If additional modifications needed**: Edit arch.md directly
```

---

# Integration Flow

```
[debug] → changelog (design-impacting items)
                ↓
         [sync] → Update arch
                ↓
           [build] (if needed)

[enhance] → Enhancement design
                ↓
         [sync] → Update arch
                ↓
           [build]
```

---

# Important Notes

1. **Bugfixes without design impact don't need sync**
   - Ignore "Design Impact: No" items in changelog

2. **Preserve existing content**
   - Keep sections without conflicts as is
   - Update only changed sections

3. **Sync History management**
   - Record all synchronizations
   - Enable future change tracking
