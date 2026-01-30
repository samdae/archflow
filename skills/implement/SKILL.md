---
id: implement
name: Implement
description: Automated implementation based on design document.
version: 2.0.0
triggers:
  - "implement"
  - "implementation"
  - "develop"
  - "code implementation"
requires: ["architect"]
platform: all
recommended_model: sonnet
---

> **Language**: This skill is written in English for universal compatibility.
> Always respond in the user's language unless explicitly requested otherwise.
> If uncertain about the user's language, ask for clarification.

# Implement Workflow

Automated implementation based on design document (architect.md).

## 💡 Recommended Model

**Sonnet recommended** (cost-effective) / GPT-5.2 Codex available

→ Design document is detailed, so high-performance model unnecessary. High token consumption in this phase, so significant cost savings.
→ Run in new session after switching model

## 🔄 Tool Fallback

| Tool | Alternative when unavailable |
|------|------------------------------|
| **Read/Grep** | Request file path from user → ask for copy-paste |
| **AskQuestion** | "Please select: 1) OptionA 2) OptionB 3) OptionC" format |
| **Task** | No sub-agent - execute step-by-step sequentially, report completion of each step before proceeding to next |

## 📁 Document Structure

```
projectRoot/
  └── docs/
        └── {serviceName}/
              ├── requirements.md   # require-refine skill output
              ├── architect.md      # ← This skill's input
              └── changelog.md      # bugfix skill output
```

**serviceName inference**: Automatically extracted from input file path `docs/{serviceName}/architect.md`

## Prerequisites

- **architect** skill output design document required
- Design document must have Implementation Plan, Code Mapping, Tech Stack sections

## Phase 0: Skill Entry

### 0-0. Model Guidance (Display at start)

> 💡 **This skill recommends the Sonnet or GPT-5.2 Codex model.**
> Design document is detailed, so high-performance model unnecessary. High token consumption makes cost savings significant.
> **Switch model in a new session before running.**
>
> **Input**: `docs/{serviceName}/architect.md`

### 0-1. Verify Design Document

When skill invoked without input, **use AskQuestion to guide information collection**:

```json
{
  "title": "Start Implementation",
  "questions": [
    {
      "id": "has_design",
      "prompt": "Do you have a design document? (docs/{serviceName}/architect.md)",
      "options": [
        {"id": "yes", "label": "Yes - I will provide via @filepath"},
        {"id": "no", "label": "No - Need design document first"}
      ]
    }
  ]
}
```

- `no` → Guide to **architect** skill
- `yes` → Request file path → Proceed to 0-2

### 0-2. Infer serviceName

Extract serviceName from provided file path:
- Input: `docs/alert/architect.md`
- Extract: `serviceName = "alert"`

### 0-3. Verify Project Settings

```json
{
  "title": "Project Settings",
  "questions": [
    {
      "id": "orm_usage",
      "prompt": "Do you use ORM (Object-Relational Mapping)?",
      "options": [
        {"id": "yes", "label": "Yes - I will provide package name (SQLAlchemy, Prisma, TypeORM, etc.)"},
        {"id": "no", "label": "No - Using Raw SQL"}
      ]
    },
    {
      "id": "db_type",
      "prompt": "What database are you using?",
      "options": [
        {"id": "postgresql", "label": "PostgreSQL"},
        {"id": "mysql", "label": "MySQL / MariaDB"},
        {"id": "sqlite", "label": "SQLite"},
        {"id": "mongodb", "label": "MongoDB"},
        {"id": "other", "label": "Other (specify)"}
      ]
    },
    {
      "id": "db_version",
      "prompt": "Do you know the DB version?",
      "options": [
        {"id": "known", "label": "Yes - I will provide version"},
        {"id": "project", "label": "No - Check from project config files"},
        {"id": "unknown", "label": "No - Use standard SQL (ANSI)"}
      ]
    },
    {
      "id": "db_schema_change",
      "prompt": "Are there DB schema changes (table/column add/modify)? If yes, how to apply?",
      "options": [
        {"id": "auto", "label": "Auto-apply on app startup (ORM, etc.)"},
        {"id": "migration_tool", "label": "Use migration tool (Alembic, Flyway, Prisma Migrate, etc.)"},
        {"id": "manual_sql", "label": "Manual SQL execution"},
        {"id": "none", "label": "No DB changes"}
      ]
    },
    {
      "id": "commit_strategy",
      "prompt": "Git commit strategy?",
      "options": [
        {"id": "none", "label": "No commit (default)"},
        {"id": "per_phase", "label": "Commit per step"},
        {"id": "final", "label": "Commit once after completion"}
      ]
    },
    {
      "id": "test_strategy",
      "prompt": "Test code writing?",
      "options": [
        {"id": "per_feature", "label": "Write test file per feature"},
        {"id": "per_design", "label": "Only when specified in design document"},
        {"id": "none", "label": "No test writing"}
      ]
    },
    {
      "id": "dependency_manager",
      "prompt": "Where to record when adding new libraries?",
      "options": [
        {"id": "project_default", "label": "Project default config file (package.json, pyproject.toml, go.mod, etc.)"},
        {"id": "manual", "label": "Manual management / separate document"},
        {"id": "none", "label": "No new dependencies"}
      ]
    }
  ]
}
```

**When ORM used**: Request additional input for package name
**When DB version known**: Request additional input for version

**When design document already provided** → Verify only 0-3 project settings, then proceed to Phase 1

## Phase 0.5: Load Required Reference Files

Check design document's **Section 4 (Implementation Plan) > 📂 Required Reference Files**:

1. **Load listed files first with Read tool**
2. Note patterns to check in each file:
   - Naming conventions
   - Folder structure
   - Error handling approach
   - Import style
3. Include these patterns in sub-agent prompts

**If no required reference files** → Main agent auto-selects 3 representative files from existing files in Code Mapping

---

## Phase 1: Analyze Design Document (Main Agent)

Extract following information from design document:

| Section | Extract Information |
|---------|-------------------|
| Tech Stack | Language, framework, DB, ORM, 3rd-party |
| Implementation Plan | Step-by-step task list |
| Code Mapping | File roles, new/modify classification, **method names/call locations** |
| Architecture Impact | DB changes (migration needed or not) |
| API Specification | Endpoint details |

### 1-1. Identify Common Files

Identify files affecting multiple steps in Code Mapping:
- Files in `shared/`, `common/`, `utils/`, `lib/` paths
- Files referenced by multiple steps

→ These files are **processed first** or separated as **step 0**

### 1-2. Generate Dependency Graph

```
Example:
0. shared/common (first)
1. Model/Entity (independent)
2. Repository/DAO (depends on model)
3. Service (depends on repository)
4. API/Controller (depends on service)
5. External integration (independent or depends on API)
```

### 1-3. Plan Sub-agent Invocations

| Step | Execution Method | Reason |
|------|-----------------|--------|
| Steps without dependencies | Can invoke in parallel | Speed improvement |
| Steps with dependencies | Invoke sequentially | Prior results needed |

### 1-4. Detect Migrations

If DB changes exist, record content to guide in Phase 4:
- New tables
- Field add/delete
- Index changes

---

## Phase 2: Sub-agent Based Execution

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Main Agent (Orchestrator)                                  │
│  - Manage step order                                        │
│  - Invoke sub-agents                                        │
│  - Collect results                                          │
│  - Request user intervention on issues                      │
└─────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│  Sub-agent per step (using Task tool)                       │
│  - subagent_type: "generalPurpose"                          │
│  - Execute in independent context                           │
│  - Return results only to main                              │
└─────────────────────────────────────────────────────────────┘
```

### 2-1. Sub-agent Invocation Pattern

Invoke sub-agent with Task tool for each step:

```
Task(
  subagent_type: "generalPurpose",
  description: "Step N: {step name}",
  prompt: """
    ## Implementation Task

    ### Step Information
    - Step name: {extracted from Implementation Plan}
    - Goal: {step description}

    ### Tech Stack
    - Language: {language}
    - Framework: {framework}
    - DB: {DB type} {version}
    - ORM: {ORM package name or "Raw SQL"}

    ### Code Mapping (files to handle in this step)
    **Pass detailed format from design document Section 3 as is:**
    | Feature | File | Class | Method | Action |
    |---------|------|-------|--------|--------|
    | {feature} | {file path} | {class name} | {method name} | {call location and code to add} |

    ⚠️ If method name and call location specified, must implement at that location

    ### Design Spec
    {API Spec, Sequence Diagram, etc. related parts}

    ### Already Created Files (for reference)
    {list of files created in previous steps}

    ### 📂 Required Reference Patterns (extracted from Phase 0.5)
    **Reference File**: {required reference file path}
    **Patterns to Apply**:
    - Naming: {identified naming rules}
    - Structure: {identified code structure}
    - Error Handling: {identified error handling approach}

    ### Project Settings
    - Test: {test_strategy}
    - Commit: {commit_strategy}

    ### Implementation Rules (Must Follow)

    #### ⚠️ 1. Read Existing File First (Top Priority)
    - If target file to modify already exists, **must first Read entire content**
    - Even for new files, **Read at least 1 similar file** in same directory
    - No Write/Edit without reading first

    #### ⚠️ 2. Search and Replicate Similar Code Patterns
    - **Search for similar feature implementations with Grep** in project
    - **Replicate naming, structure, error handling approach** of found patterns
    - Example: When adding Repository → Follow existing Repository file pattern
    - Example: When adding API → Follow existing router file structure

    #### 3. General Rules
    - Auto-fix lint errors (max 3 attempts)
    - Return list of created/modified files upon completion

    ### Return Format
    Report upon completion in following format:
    - created_files: [created file paths]
    - modified_files: [modified file paths]
    - status: success | failed
    - error: (error content if failed)
  """
)
```

### 2-2. Step-by-Step Execution Flow

```
Main Agent:
  for each step in Implementation Plan:
    1. Invoke sub-agent (Task)
    2. Wait for result
    3. Check result:
       - success → next step
       - failed → Phase 2-4 (request intervention)
    4. Commit if strategy is "per_phase"
    5. Accumulate created file list (to pass to next step)
```

### 2-3. Parallel Execution (steps without dependencies)

Based on dependency graph analysis, invoke steps that can run in parallel simultaneously:

```
Example:
- Step 1 (Model) + Step 5 (External integration analysis) → Can run in parallel
- Step 2 (Repository) → After step 1 completion
- Step 3 (Service) → After step 2 completion
```

**Warning**: Execute sequentially to prevent conflicts when modifying same file

---

## Phase 2-4: Request Intervention on Issues

When sub-agent returns `status: failed`, main agent requests user intervention.

**Intervention Conditions:**
- Failure after 3 sub-agent retries
- Conflict discovered between existing code and design
- Decision needed not specified in design document

```json
{
  "title": "Implementation Issue (Step N: {step name})",
  "questions": [
    {
      "id": "resolution",
      "prompt": "[Sub-agent error content]\n\nHow to proceed?",
      "options": [
        {"id": "retry", "label": "Retry (add hint)"},
        {"id": "option_a", "label": "[Solution A]"},
        {"id": "option_b", "label": "[Solution B]"},
        {"id": "skip", "label": "Skip this step"},
        {"id": "stop", "label": "Stop implementation"}
      ]
    }
  ]
}
```

**When retry selected**: User provides additional hint → Re-invoke sub-agent

## Phase 3: Implementation Validation (Main Agent)

After all sub-agents complete, validate implementation against Code Mapping criteria.

### 3-1. Validation Method

For each item in design document's Code Mapping:

1. **Search with Grep tool** for method/class existence
   - Pattern: method name or class name
   - Target: corresponding file path

2. **When exists** → Determine Read range:
   - **For validation (existence check)**: Read 30 lines from that line
   - **For modification (when supplement needed)**: **200 lines above/below** based on related function/class or **entire file** (if less than 500 lines)
   - Check rough alignment with design intent

   ⚠️ **When modifying, do not fix blindly based on only 30 lines** - Must understand style/error handling/DI/util usage approach

3. **When non-existent or misaligned** → Implement supplement for that item

### 3-2. Validation Checklist

| Validation Target | Method | Criteria |
|------------------|--------|---------|
| Method exists | Grep | Method name match |
| Class exists | Grep | Class name match |
| Basic structure (validation) | Read 30 lines | Rough alignment with design intent |
| Context when modifying | Read 200 lines/entire | Understand style, error handling, DI |

### 3-3. Validation Completion Criteria

- Confirm existence of **all items** in Code Mapping
- Complete supplements when gaps found
- After verifying all → Proceed to Phase 4

---

## Phase 4: Completion Report (Main Agent)

After validation completion, summarize and report results.

### 4-1. Collect Results

Collect from each sub-agent:
- `created_files`: List of created files
- `modified_files`: List of modified files
- `status`: Success/failure

### 4-2. Report Content

```markdown
## Implementation Completion Report

### Execution Summary
| Step | Status | Created Files | Modified Files |
|------|--------|--------------|---------------|
| 1. Model | ✅ | 2 | 0 |
| 2. Repository | ✅ | 1 | 1 |
| ... | ... | ... | ... |

### Created Files
- `path/to/new_file` - Description

### Modified Files
- `path/to/existing_file` - Change content

### DB Migration
(Based on project settings)

**When using migration tool:**
Guidance on tool-specific commands

**When manual SQL execution:**
\`\`\`sql
-- New table: {table name}
CREATE TABLE {table name} (
  -- Generated based on design document Section 2 + {db_type} syntax
);

-- Existing table modification
ALTER TABLE {table name} ...;

-- Index
CREATE INDEX ...;
\`\`\`

### Dependency Changes
(Based on project settings)
- `package_name` needs to be added → Record in project config file

### Remaining Manual Tasks
- [ ] Environment variable setup (if any)
- [ ] Run tests
- [ ] Verify FE integration

### Git Commit
(Based on commit strategy)
- Committed / Not committed

### Next Steps Guide
> ✅ **Implementation Complete**
>
> If bugs occur, run `bugfix` skill in **Debug mode**.
> Document paths: `docs/{serviceName}/requirements.md`, `architect.md`
```

### Commit Handling

| Strategy | Handling |
|---------|---------|
| none | No commit, user handles directly |
| per_phase | Already completed per step |
| final | Commit all changes at once |

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
[bugfix] → docs/{serviceName}/changelog.md
```

---

# Important Notes

1. **Auto-executed items**
   - File creation/modification
   - Lint error fixing
   - Commit (when selected)

2. **Not auto-executed (for safety)**
   - DB migration execution
   - Package installation
   - Server restart
   - Test execution

3. **Termination conditions**
   - User selects "Stop implementation"
   - Fatal error (file system error, etc.)
   - Design document parsing failure
