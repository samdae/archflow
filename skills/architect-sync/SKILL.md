---
id: architect-sync
name: Architect Sync
description: |
  Synchronize changelog/enhancement results to architect document.
  Filters design-impacting changes and updates architect.md.

  Triggers: architect-sync, sync design, update architect, 설계 동기화
user-invocable: true
version: 2.0.0
triggers:
  - "architect-sync"
  - "architecture sync"
  - "design sync"
requires: ["bugfix", "architect-enhance"]
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

# Architect Sync Workflow

Synchronize design-impacting items from changelog or enhancement design results to existing architect.md.

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
              ├── requirements.md
              ├── architect.md      # ← Sync target
              └── changelog.md      # ← Input (design-impacting items)
```

## ⚠️ Execution Timing

Run in following situations:
1. **After bugfix completion** - When "Design Impact: Yes" items added to changelog
2. **After architect-enhance completion** - When integrating enhancement design to existing architect

---

## Phase 0: Skill Entry

### 0-0. Model Guidance

> 💡 **This skill recommends the Sonnet model.**
> Document merging task, so high-performance model unnecessary.
>
> **Input**: changelog.md (design-impacting items) or enhancement design result
> **Output**: Updated architect.md

### 0-1. Verify Sync Type

```json
{
  "title": "Architect Synchronization",
  "questions": [
    {
      "id": "sync_type",
      "prompt": "What content will you synchronize?",
      "options": [
        {"id": "bugfix", "label": "Bug fix - Design-impacting items from changelog"},
        {"id": "enhance", "label": "Feature enhancement - architect-enhance results"}
      ]
    }
  ]
}
```

### 0-2. Collect File Input

**When bugfix selected:**
```json
{
  "title": "File Input",
  "questions": [
    {
      "id": "has_changelog",
      "prompt": "Please provide changelog file path (docs/{serviceName}/changelog.md)",
      "options": [
        {"id": "yes", "label": "Yes - I will provide via @filepath"}
      ]
    },
    {
      "id": "has_architect",
      "prompt": "Please provide architect file path (docs/{serviceName}/architect.md)",
      "options": [
        {"id": "yes", "label": "Yes - I will provide via @filepath"}
      ]
    }
  ]
}
```

**When enhance selected:**
> "Please provide enhancement design result and existing architect.md path."

### 0-3. Infer serviceName

Extract serviceName from input file path:
- Input: `docs/alert/changelog.md`
- Extract: `serviceName = "alert"`

---

## Phase 1: Analyze Changes

### 1-1. Bugfix Sync (changelog → architect)

Filter only **"Design Impact: Yes"** items from changelog:

```
Analyze changelog:
  for each item:
    if Design Impact == "Yes":
      → Add to sync targets
      → Identify affected sections (Code Mapping, API Spec, DB Schema, etc.)
```

### 1-2. Enhancement Sync (enhancement result → architect)

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

### architect.md Modification Plan
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
      "prompt": "Do you want to Git commit the current state before modifying architect.md?",
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
  git add docs/{serviceName}/architect.md
  git commit -m "backup: architect.md before sync"
  ```
- When `skip` selected: Proceed directly to Phase 2

---

## Phase 2: Conflict Verification

### 2-1. Check for Conflicts

Compare existing architect content with new changes:

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

## Phase 3: Update architect.md

### 3-1. Update by Section

| Section | Update Method |
|---------|--------------|
| Code Mapping | Add/modify/delete rows |
| API Spec | Add/modify endpoints |
| DB Schema | Modify table/column definitions |
| Sequence Diagram | Modify diagram |
| Risks & Tradeoffs | Add new tradeoffs |

### 3-2. Add Sync History

Add/update sync history section at bottom of architect.md:

```markdown
---

## Sync History

| Date | Type | Source | Changes |
|------|------|--------|---------|
| {date} | bugfix | changelog {date} | {change summary} |
| {date} | enhance | requirements v2 | {change summary} |
```

### 3-3. Save

Save updated architect.md (overwrite existing file)

---

## Phase 4: Completion Report

```markdown
## Architect Synchronization Complete

### Sync Summary
| Item | Content |
|------|---------|
| Type | bugfix / enhance |
| Source | {changelog date or requirements} |
| Modified Sections | {section list} |

### Change History
| Section | Change Type | Change Content |
|---------|------------|----------------|
| {section} | Add/Modify/Delete | {content} |

### Files
- Updated: `docs/{serviceName}/architect.md`

### Next Steps
- **If implementation needed**: Run `implement` skill
- **If additional modifications needed**: Edit architect.md directly
```

---

# Integration Flow

```
[bugfix] → changelog (design-impacting items)
                ↓
         [architect-sync] → Update architect
                ↓
           [implement] (if needed)

[architect-enhance] → Enhancement design
                ↓
         [architect-sync] → Update architect
                ↓
           [implement]
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
