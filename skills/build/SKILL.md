---
id: build
name: Build
description: |
  Automated implementation based on design document.
  Analyzes arch.md, creates dependency graph, executes step-by-step.

  Triggers: build, compile, implement, 빌드, 구현
user-invocable: true
version: 2.0.0
triggers:
  - "build"
  - "compile"
  - "implement"
  - "generate code"
requires: ["arch"]
platform: all
recommended_model: sonnet
allowed-tools:
  - Read
  - Write
  - StrReplace
  - Glob
  - Grep
  - LS
  - Shell
  - Task
---

> ℹ️ **Global Rules Applied**:
> This skill adheres to the Archflow Global Rules defined in `rules/archflow-rules.md`.

# Build Workflow

Automated implementation based on design document (arch.md).

## 💡 Recommended Model

**Sonnet recommended** (cost-effective)

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
              ├── spec.md       # spec skill output
              ├── arch-be.md    # ← This skill's input (Backend)
              ├── arch-fe.md    # ← This skill's input (Frontend)
              └── trace.md      # debug skill output
```

**serviceName inference**: Automatically extracted from input file path `docs/{serviceName}/arch-be.md` or `arch-fe.md`

## Prerequisites

- **arch** skill output design document required
- Design document must have Implementation Plan, Code Mapping, Tech Stack sections

## Phase -1: Service Discovery

### -1.1. Scan Docs Directory

1. **List subdirectories** in `docs/` folder.
2. **Determine Service Name**:
   - **If 1 directory found**: Auto-select.
   - **If multiple found**: Ask user to select.
   - **If none found**: Manual input.

3. **Auto-resolve Paths**:
   - `arch-be.md` = `docs/{serviceName}/arch-be.md`
   - `arch-fe.md` = `docs/{serviceName}/arch-fe.md`
   - `profile` = `profiles/be.md` or `fe.md` (based on file existence)

## Phase 0: Skill Entry

### 0-0. Model Guidance (Display at start)

> 💡 **This skill recommends the Sonnet model.**
> Design document is detailed, so high-performance model unnecessary. High token consumption makes cost savings significant.
> **Switch model in a new session before running.**
>
> **Input**: `docs/{serviceName}/arch-be.md` or `docs/{serviceName}/arch-fe.md`

### 0-1. Verify Design Document

When skill invoked without input, **use AskQuestion to guide information collection**:

```json
{
  "title": "Start Implementation",
  "questions": [
    {
      "id": "has_design",
      "prompt": "Do you have a design document? (docs/{serviceName}/arch-be.md or arch-fe.md)",
      "options": [
        {"id": "yes", "label": "Yes - I will provide via @filepath"},
        {"id": "no", "label": "No - Need design document first"}
      ]
    }
  ]
}
```

- `no` → Guide to **arch** skill
- `yes` → Request file path → Proceed to 0-2

### 0-2. Infer serviceName and Detect Profile

Extract serviceName and detect BE/FE from provided file path:
- Input: `docs/alert/arch-be.md` → serviceName = "alert", profile = **BE**
- Input: `docs/alert/arch-fe.md` → serviceName = "alert", profile = **FE**

**Load Profile:**
- If `arch-be.md` → **Read `profiles/be.md`** from this skill folder
- If `arch-fe.md` → **Read `profiles/fe.md`** from this skill folder

> ⚠️ **MUST read the profile file before proceeding.**
> The profile defines project settings questions, dependency graph, and completion report template.

### 0-2.5. Pre-Analyze Design Document (Smart Detect)

**Read the provided `arch-be.md` or `arch-fe.md` and parse the `Tech Stack` section.**

Try to extract:
- `db_type`: from `database` field (e.g. "PostgreSQL")
- `orm_usage`: from `orm` field (e.g. "SQLAlchemy" or "Raw SQL")
- `target_framework`: from `framework` field

**Goal**: To skip redundant questions in 0-3.

### 0-3. Verify Project Settings (Only if needed)

**If Service Discovery failed or docs missing:**
Use AskQuestion to collect design document path.

**If Service Discovery succeeded:**
- Check if `arch-be.md` or `arch-fe.md` exists.
- If both exist, ask user which one to build.
- **Skip manual path input.**

**Dynamic Question Generation:**
Based on the data extracted in 0-2.5, **remove** questions that are already answered.

- If `db_type` is detected → Remove `db_type` question
- If `orm_usage` is detected → Remove `orm_usage` question

**Remaining Questions (asking only what is missing):**
> Use questions from the loaded profile, excluding detected items.


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

## Phase 0.5: Package Installation (First Step)

**Before any code implementation, install required dependencies.**

### 0.5-1. Read Dependencies Section

From the design document (arch-be.md or arch-fe.md), read the `Dependencies` section:

```yaml
package_manager: "{pip|uv|poetry|npm|yarn|pnpm}"
project_type: "{new|existing}"

dependencies:
  - name: "{package}"
    version: "{version}"
    purpose: "{purpose}"
    status: "approved"      # Only install approved packages
```

### 0.5-2. Generate Install Command

Based on `package_manager` and `status: approved` packages:

| Package Manager | Install Command |
|-----------------|-----------------|
| pip | `pip install {package}=={version}` |
| uv | `uv pip install {package}=={version}` |
| poetry | `poetry add {package}@{version}` |
| npm | `npm install {package}@{version}` |
| yarn | `yarn add {package}@{version}` |
| pnpm | `pnpm add {package}@{version}` |

### 0.5-3. Execute Installation

```bash
# Example for pip
pip install fastapi==0.109.0 sqlalchemy==2.0.25 alembic==1.13.1

# Example for npm
npm install react@18.2.0 zustand@4.5.0 axios@1.6.5
```

### 0.5-4. Verify Installation

1. Run install command using Shell tool
2. Check exit code (0 = success)
3. If failed:
   - Show error message
   - Ask user to resolve manually or suggest alternative

**Report to user before proceeding:**
```
✅ Package Installation Complete
- Installed: {count} packages
- Package manager: {manager}
- Ready to proceed with implementation
```

→ After successful installation, proceed to Phase 1

---

## Phase 1: Deep Analysis of Design Document (Main Agent)

> **Note**: Basic parsing was done in 0-2.5. Now perform deep analysis for implementation.

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
    **Pass rows with `Impl = [ ]` from design document Section 3:**
    | # | Feature | File | Class | Method | Action | Impl |
    |---|---------|------|-------|--------|--------|------|
    | {#} | {feature} | {file path} | {class name} | {method name} | {call location and code to add} | [ ] |

    ⚠️ Only implement rows where `Impl = [ ]` (skip already implemented rows)
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

    #### 4. Update Implementation Status (IMPORTANT)
    - After successfully implementing each Code Mapping row:
      1. Read the design document (arch-be.md or arch-fe.md)
      2. Find the row by `#` number in Code Mapping table
      3. Update `[ ]` → `[x]` using StrReplace
      - Example: `| 3 | Refresh | ... | [ ] |` → `| 3 | Refresh | ... | [x] |`
    - This ensures progress is tracked even if build is interrupted

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
> 1. **Verify**: Run `/test` to generate/run tests for the implemented code.
> 2. **Debug**: If bugs occur, run `/debug`.
>
> Document paths: `docs/{serviceName}/spec.md`, `arch-be.md` or `arch-fe.md`
```

### 4-3. Update spec.md Status

**After all implementation is complete, update spec.md Requirement Summary:**

1. Read `docs/{serviceName}/spec.md`
2. Find `## 0. Requirement Summary` table
3. For each implemented Req ID (from Code Mapping with `Impl = [x]`):
   - Update Status from `Designed` to `Implemented`
4. Save spec.md

**Example:**
```markdown
| Req ID | Category | Requirement | Priority | Status |
|--------|----------|-------------|----------|--------|
| FR-001 | Auth | 이메일/비밀번호 로그인 | High | Implemented |  ← Updated
| FR-002 | Auth | 소셜 로그인 | Medium | Implemented |  ← Updated
```

> This completes the SSOT cycle: spec (Draft → Designed → Implemented)

### Commit Handling

| Strategy | Handling |
|---------|---------|
| none | No commit, user handles directly |
| per_phase | Already completed per step |
| final | Commit all changes at once |

---

# Integration Flow

```
[spec] → docs/{serviceName}/spec.md
        ↓
[arch] → docs/{serviceName}/arch-be.md  (Backend)
       → docs/{serviceName}/arch-fe.md  (Frontend)
        ↓
[build] → Implementation (uses profile: profiles/be.md or profiles/fe.md)
        ↓
(Bug occurs)
        ↓
[debug] → docs/{serviceName}/trace.md
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
