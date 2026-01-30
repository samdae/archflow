---
id: bugfix
name: Bugfix
description: Systematic bug fixing based on documents in Debug mode.
version: 2.0.0
triggers:
  - "bug"
  - "bugfix"
  - "error fix"
  - "fix bug"
requires: ["architect"]
platform: all
recommended_model: opus
---

> **Language**: This skill is written in English for universal compatibility.
> Always respond in the user's language unless explicitly requested otherwise.
> If uncertain about the user's language, ask for clarification.

# Bugfix Workflow

Systematically fix bugs by combining runtime context from Debug mode with documentation.

## 💡 Recommended Model

**Try Sonnet first** (Debug mode provides error location + documentation provides expected behavior)

→ For complex bugs (multi-file, flow analysis needed), **Opus** is recommended
→ If it doesn't work, retry with Opus

## 🔄 Tool Fallback

| Tool | Alternative when unavailable |
|------|------------------------------|
| **Read/Grep** | Request file path from user → ask for copy-paste |
| **AskQuestion** | "Please select: 1) OptionA 2) OptionB 3) OptionC" format |
| **Debug mode unavailable** | Request user to directly paste error log/stack trace |

## ⚠️ Execution Environment

**Run this skill in Debug mode.**

Combining runtime information (error log, stack trace, variable state) provided by Debug mode with documentation is essential for effectiveness.

## 📁 Document Structure

```
projectRoot/
  └── docs/
        └── {serviceName}/
              ├── requirements.md   # require-refine skill output (input)
              ├── architect.md      # architect skill output (input)
              └── changelog.md      # ← This skill's output
```

**serviceName inference**: Automatically extracted from input file path `docs/{serviceName}/requirements.md` or `architect.md`

---

## Phase 0: Skill Entry

### 0-0. Model and Environment Guidance (Display at start)

> 💡 **This skill should be run in Debug mode for best results.**
> Combines error location from Debug mode + expected behavior information from documentation.
>
> **Recommended Model**: Try Sonnet first, Opus for complex bugs
>
> **Required Documents** (`docs/{serviceName}/` folder):
> - requirements.md (required)
> - architect.md (required)
> - changelog.md (optional - will be created in this session if not present)

### 0-1. Collect Document Input

```json
{
  "title": "Start Bug Fix",
  "questions": [
    {
      "id": "has_requirements",
      "prompt": "Do you have a requirements document? (docs/{serviceName}/requirements.md)",
      "options": [
        {"id": "yes", "label": "Yes - I will provide via @filepath"},
        {"id": "no", "label": "No - I don't have it"}
      ]
    },
    {
      "id": "has_design",
      "prompt": "Do you have a design document? (docs/{serviceName}/architect.md)",
      "options": [
        {"id": "yes", "label": "Yes - I will provide via @filepath"},
        {"id": "no", "label": "No - I don't have it"}
      ]
    },
    {
      "id": "has_changelog",
      "prompt": "Do you have a changelog? (docs/{serviceName}/changelog.md)",
      "options": [
        {"id": "yes", "label": "Yes - I will provide via @filepath"},
        {"id": "no", "label": "No - Will be created upon completion"}
      ]
    }
  ]
}
```

**Processing by response:**
- Requirements or design `no` → Show **General Debug Mode** guidance below
- Changelog `no` → Proceed with plan to create in Phase 3
- All `yes` → Request file paths → Proceed to Phase 1

### General Debug Mode (When documents unavailable)

When proceeding without requirements/design documents:

> ⚠️ **Proceeding in General Debug Mode.**
>
> Without documentation, we proceed with bug fixing using only error log and code analysis.
> - Cannot verify expected behavior from documentation
> - Cannot trace design flow
> - Changelog after fix will be saved to separate file
>
> Do you want to continue?

**General Debug Flow:**
1. Analyze error message/stack trace
2. Grep + Read related code
3. Estimate cause → Confirm with user
4. Implement fix
5. Specify separate location for changelog

### 0-2. Infer serviceName

Extract serviceName from provided file path:
- Input: `docs/alert/requirements.md` or `docs/alert/architect.md`
- Extract: `serviceName = "alert"`
- Output path: `docs/alert/changelog.md`

### 0-3. Verify Error Information

Verify information provided by Debug mode:
- Error message
- Stack trace (error location)
- Related variable state (if available)

Request additional information from user:
> "Please describe the error situation. If you see an error message or stack trace in Debug mode, please share it as well."

---

## Phase 1: Document Analysis

### 1-1. Load Documents

Read provided documents and identify key information:

| Document | Information to Extract |
|----------|----------------------|
| requirements.md | Expected behavior, normal scenario |
| architect.md | Flow (call order), Code Mapping |
| changelog.md | Recent changes (may be bug cause) |

### 1-2. Cross-reference Error Location with Design Flow

```
Error Location (stack trace):
  Example: alert_service.py:45 - NoneType error
        ↓
Check location in design document's Code Mapping:
  Example: AlertService.create_alert() → user_id handling
        ↓
Check expected behavior in requirements:
  Example: "Create notification for logged-in user"
        ↓
Identify mismatch
```

### 1-3. Report Analysis Results

```markdown
## Analysis Results

**Error Location**: {file}:{line} - {error message}

**Design Behavior**:
- {flow from design document for this part}

**Expected Behavior from Requirements**:
- {feature description from requirements}

**Recent Changes** (if changelog exists):
- {possibly related recent changes}

**Estimated Cause**:
- {cause hypothesis}

**Items Requiring Verification**:
- {if additional verification needed}
```

Confirm with user:
> "Is this analysis correct? If yes, I will proceed with the fix."

---

## Phase 2: Bug Fix

### 2-1. Confirm Cause

If analysis results are correct:
1. Read code at that location
2. Verify exact problem point
3. Decide fix direction

### 2-2. Implement Fix

Fix according to original design intent:
- Match requirements
- Match design flow
- Maintain existing code style

### 2-3. Verify Fix

Verify fixed code using Grep + Read:
- Fix applied?
- Matches design intent?

---

## Phase 3: Call changelogging Skill (Required)

> ⚠️ **Must call changelogging skill after analysis/fix completion.**

### 3-1. Call changelogging Skill

After analysis/fix completion, **must** call changelogging skill to record results.

**How to call:**
> "Calling changelogging skill to record this session's results."

Or guide user:
> "Analysis complete. Would you like to record this in the changelog?"

### 3-2. Recording by Result Type

| Result Type | Content to Record in changelogging |
|-------------|-----------------------------------|
| **Code fix completed** | Symptom, cause, fix content, design impact |
| **External cause identified** | Symptom, external cause, recommended action |
| **Investigation ongoing/failed** | Symptom, investigation content, next steps |

### 3-3. If Not Called

User can manually call:
> "changelogging" or "write changelog"

When called in the same session, it will use the previous conversation's context (cause, fix content, etc.) as is.

---

## Phase 4: Completion Report

```markdown
## Bug Fix Complete

### Analysis/Fix Summary
| Item | Content |
|------|---------|
| Symptom | {original bug symptom} |
| Cause | {identified cause} |
| Result Type | Code fix / External cause / Under investigation |
| Modified Files | {file list or "none"} |

### Test Method (if fixed)
1. {Verify with reproduction scenario}
2. {How to verify normal behavior}

### Recurrence Prevention (Required Checklist)
- [ ] Add tests (if applicable)
- [ ] Add guard/validation logic (if applicable)
- [ ] Add logging/monitoring (if applicable)

**Recurrence Probability**: High / Medium / Low
```

### Verify changelogging Call

> ⚠️ **Have you recorded this in the changelog?**
> 
> To record this session's results in the changelog:
> - Call "changelogging" skill
> - Or request "write changelog"
>
> **External causes and investigation failures are also worth recording.**

---

# Integration Flow

```
[require-refine] → docs/{serviceName}/requirements.md
        ↓
[architect] → docs/{serviceName}/architect.md
        ↓
[implement] → Implementation
        ↓
(Bug occurs)
        ↓
[bugfix] (Debug mode) → Analysis/fix
        ↓
[changelogging] → docs/{serviceName}/changelog.md
        ↓ (when design impact exists)
[architect-sync] → architect.md synchronization
```

---

# Important Notes

1. **Debug Mode Required**
   - Effectiveness decreases without runtime information from Debug mode
   - Error location and stack trace are essential

2. **Documentation Dependency**
   - Requirements/design documents must be accurate for effectiveness
   - If documentation and implementation mismatch, synchronization needed first

3. **Changelog Management**
   - All bug fixes should be recorded in changelog
   - Can reference for similar bugs in the future

4. **Complex Bugs**
   - For bugs spanning multiple files, Opus recommended
   - If not resolved at once, repeat: analysis → user confirmation → re-analysis
