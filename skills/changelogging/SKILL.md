---
id: changelogging
name: Changelogging
description: |
  Dedicated changelog writing skill.
  Records bug fixes, changes, and their design impact.

  Triggers: changelogging, record change, update changelog, 변경 기록
user-invocable: true
version: 2.0.0
triggers:
  - "changelogging"
  - "changelog"
  - "change log"
  - "record changes"
requires: ["bugfix"]
platform: all
recommended_model: sonnet
allowed-tools:
  - Read
  - Write
  - Glob
  - LS
  - AskQuestion
---

> **Language**: This skill is written in English for universal compatibility.
> Always respond in the user's language unless explicitly requested otherwise.
> If uncertain about the user's language, ask for clarification.

# Changelogging Workflow

Records bug fixes, analysis results, and changes in changelog.md.

## 💡 Recommended Model

**Sonnet** (document writing)

## 🔄 Tool Fallback

| Tool | Alternative when unavailable |
|------|------------------------------|
| **Read** | Request user to copy-paste existing changelog content |
| **AskQuestion** | "Please select one of the following" format |

## 📁 Document Structure

```
projectRoot/
  └── docs/
        └── {serviceName}/
              └── changelog.md   # ← This skill's output
```

## ⚠️ Invocation Timing

1. **Automatically called from bugfix skill** - After analysis/fix completion
2. **Manually called by user** - When not called from bugfix, or when recording independently

---

## Phase 0: Skill Entry

### 0-1. Context Verification

**When called from bugfix session:**
> Use context from previous conversation (cause, fix content, etc.) as is

**When called independently:**
```json
{
  "title": "Changelog Writing",
  "questions": [
    {
      "id": "has_context",
      "prompt": "Do you have content to record?",
      "options": [
        {"id": "bugfix", "label": "Bug fix result - I analyzed/fixed in this session"},
        {"id": "manual", "label": "Manual record - I will explain directly"}
      ]
    }
  ]
}
```

### 0-2. serviceName Verification

```json
{
  "title": "Service Confirmation",
  "questions": [
    {
      "id": "service_name",
      "prompt": "Which service's changelog should this be recorded in?",
      "options": [
        {"id": "input", "label": "I will tell you the service name"}
      ]
    }
  ]
}
```

---

## Phase 1: Result Type Classification

### 1-1. Result Type Verification

```json
{
  "title": "Result Type",
  "questions": [
    {
      "id": "result_type",
      "prompt": "What type of result are you recording?",
      "options": [
        {"id": "fix_complete", "label": "Code fix completed - Bug was fixed"},
        {"id": "external_cause", "label": "External cause identified - Not my code's problem"},
        {"id": "investigation", "label": "Investigation result - Cause identification in progress/failed"},
        {"id": "other", "label": "Other changes"}
      ]
    }
  ]
}
```

---

## Phase 2: Information Gathering

### 2-1. Extract from Context (bugfix session)

Extract the following information from previous conversation:
- Symptom (user-reported issue)
- Cause (analysis result)
- Fix content (if any)
- Impact scope

### 2-2. Manual Input (independent invocation)

> "Please provide the following information:
> 1. Symptom (What was the problem?)
> 2. Cause (Why did it happen?)
> 3. Action (How was it resolved? Or resolution plan)
> 4. Impact scope (Which features/files are affected?)"

### 2-3. Design Impact Verification

```json
{
  "title": "Design Impact",
  "questions": [
    {
      "id": "design_impact",
      "prompt": "Does this change impact the design (architect.md)?",
      "options": [
        {"id": "yes", "label": "Yes - API/DB/structure changed"},
        {"id": "no", "label": "No - Bug fix only"},
        {"id": "unsure", "label": "Not sure"}
      ]
    }
  ]
}
```

- `yes` → Write detailed design impact section + guide to architect-sync
- `no` → Mark as no design impact

---

## Phase 3: Changelog Writing

### 3-1. Check Existing Changelog

- If exists → Add new entry at the top
- If not exists → Create new

### 3-2. Template

```markdown
# Changelog

## {date} - {result type}

### Basic Information
| Item | Content |
|------|---------|
| Symptom | {user-reported symptom} |
| Cause | {identified cause} |
| Severity | Critical / High / Medium / Low |
| **Design Impact** | **Yes / No** |

### Design Impact Details (Only when Yes)
| Affected Section | Changes |
|-----------------|---------|
| Code Mapping | {method added/changed/deleted - if applicable} |
| API Spec | {endpoint changes - if applicable} |
| DB Schema | {table/column changes - if applicable} |
| Sequence Diagram | {flow changes - if applicable} |

⚠️ **When design impact exists**: Need to synchronize architect.md with `architect-sync` skill

### Change Reasoning
- **Why did this problem occur**: {root cause analysis}
- **Why was this action taken**: {reason for action choice}

### Action Details
| File | Changes | Change Type |
|------|---------|-------------|
| {file path} | {change description} | Fixed/Added/Deleted/None |

### Impact Scope
- **Direct Impact**: {modified features/APIs}
- **Indirect Impact**: {other features that may be affected by this fix}
- **No Impact Confirmed**: {areas confirmed to not be affected by changes}

### Verification Method
| Verification Item | Method | Expected Result |
|------------------|--------|-----------------|
| Problem resolution | {test method} | {normal operation} |
| Regression test | {related feature test} | {existing features normal} |

### Related Documents
- Requirements: docs/{serviceName}/requirements.md
- Design: docs/{serviceName}/architect.md

---

(Previous changelog entries...)
```

### 3-3. Adjustment by Result Type

**Code fix completed:**
- Record actual changed files/content in Action Details

**External cause identified:**
- Action Details: "No code changes - External cause"
- Record detailed external cause in Change Reasoning
- Add recommended actions (contact external team, configuration changes, etc.)

**Investigation result:**
- Severity: "Under investigation"
- Action Details: "Investigation in progress" or "Cause identification failed"
- Record next steps

---

## Phase 4: Save and Complete

### 4-1. Save

```
docs/{serviceName}/changelog.md
```

### 4-2. Completion Report

```markdown
## Changelog Writing Complete

### Summary
| Item | Content |
|------|---------|
| Service | {serviceName} |
| Result Type | {Code fix/External cause/Investigation record} |
| Design Impact | Yes / No |

### Files
- Updated: `docs/{serviceName}/changelog.md`

### Next Steps
- **When design impact exists**: Execute `architect-sync` skill
- **When testing needed**: Proceed with testing according to verification method
```

---

# Integration Flow

```
[bugfix] → Analysis/fix complete
              │
              ▼
        [changelogging] → Write changelog.md
              │
              ▼ (when design impact exists)
        [architect-sync] → Synchronize architect.md
```

---

# Important Notes

1. **Recommended to call in same session**
   - Automatic extraction possible when bugfix context exists
   - Manual input required if different session

2. **Design Impact Judgment**
   - API/DB/structure changes → Yes
   - Simple bug fix (logic only) → No
   - If ambiguous, treat as "Yes" (safe)

3. **External causes are also worth recording**
   - "Not our code's problem" is also important information
   - Reference for when same problem occurs later
