# Archflow

**Document-driven development skills with Multi-Agent Debate for Claude Code & Cursor**

Archflow is a comprehensive set of AI agent skills that enables systematic, document-driven development workflows. It leverages Multi-Agent Debate to produce high-quality architectural designs and maintains full traceability from requirements to implementation.

## Features

- **Document-Driven Development**: Maintain clear requirements, designs, and changelogs throughout the development lifecycle
- **Multi-Agent Debate**: Two specialized agents (Domain Architect and Best Practice Advisor) collaborate to produce optimal designs
- **Systematic Workflows**: Pre-built skills for common development tasks (architect, implement, bugfix, reverse-engineer, etc.)
- **Full Traceability**: Keep documentation synchronized with code changes
- **Platform Support**: Works seamlessly with both Claude Code and Cursor

## Installation

Install Archflow skills into your project:

```bash
npx archflow init
```

This will:
1. Copy all skills to `.cursor/skills/` or `.codebuddy/skills/` (depending on your platform)
2. Copy agent definitions to `.cursor/agents/` or `.codebuddy/agents/`
3. Create a default `archflow.config.yaml` in your project root

## Quick Start

After installation, you can trigger skills directly in your AI chat:

- **Design a feature**: Say "architect" or "설계" followed by your requirements
- **Implement a design**: Say "implement" or "구현" with your design document path
- **Fix a bug**: Say "bugfix" or "버그 수정" to enter systematic debugging mode
- **Refine requirements**: Say "require-refine" or "요구사항 정리" with your raw requirements
- **Reverse-engineer**: Say "reverse" or "문서화" to generate docs from existing code

For detailed usage, refer to individual skill documentation in the `.cursor/skills/` directory.

## Configuration

Customize Archflow behavior by editing `archflow.config.yaml` in your project root. Key settings include:

- Platform target (Cursor/Claude Code)
- Multi-Agent Debate settings
- Documentation paths
- Language preferences (Korean/English)
- Automation options

## Supported Platforms

- **Cursor**: Full support with `.cursor/` directory structure
- **Claude Code**: Full support with `.codebuddy/` directory structure

## Skills Included

- `architect`: Multi-Agent Debate for feature design
- `architect-enhance`: Design enhancements for existing features
- `architect-sync`: Sync documentation after code changes
- `implement`: Automated implementation from design docs
- `bugfix`: Systematic debugging with document context
- `changelogging`: Generate structured changelogs
- `require-refine`: Refine raw requirements into structured docs
- `reinforce`: Enhance existing documentation
- `reverse`: Generate documentation from code

## License

Apache License 2.0

## Author

samdae

## Repository

https://github.com/samdae/archflow

---

## Skill Structure

Archflow skills follow a standardized structure to ensure consistency, maintainability, and proper integration with AI agents. All skills must adhere to the following standards.

### Front Matter Standard

Every skill file must begin with YAML front matter containing metadata:

```yaml
---
id: require-refine
name: Require Refine
description: Transform unstructured materials into refined requirements document.
version: 2.0.0
triggers:
  - "requirements"
  - "require-refine"
  - "define requirements"
  - "feature definition"
requires: []
platform: all
recommended_model: opus
---
```

#### Front Matter Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique skill identifier in kebab-case (e.g., `require-refine`, `architect`) |
| `name` | string | Yes | Human-readable skill name displayed to users |
| `description` | string | Yes | Brief description (1-2 sentences) of what the skill does |
| `version` | string | Yes | Semantic versioning (e.g., `2.0.0`) for skill version tracking |
| `triggers` | array | Yes | List of keywords that trigger this skill (English and localized) |
| `requires` | array | No | List of prerequisite skill IDs that must run before this skill |
| `platform` | string | Yes | Target platform: `"all"`, `"claude-code"`, or `"cursor"` |
| `recommended_model` | string | No | Recommended AI model: `"opus"` (quality) or `"sonnet"` (cost-effective) |

### Language Directive

All skills must include this standard language directive immediately after the front matter to ensure proper localization:

```markdown
> **Language**: This skill is written in English for universal compatibility.
> Always respond in the user's language unless explicitly requested otherwise.
> If uncertain about the user's language, ask for clarification.
```

**Purpose**: Ensures skills work across different languages while maintaining English as the source language for portability.

### Tool Fallback Section

Every skill must include a fallback strategy table for when standard tools are unavailable:

```markdown
## 🔄 Tool Fallback

| Tool | Alternative when unavailable |
|------|------------------------------|
| **Read/Grep** | Request file path from user → ask for copy-paste |
| **AskQuestion** | "Please select: 1) OptionA 2) OptionB 3) OptionC" format |
| **Task** | Use step-by-step checklist, or Self-debate pattern |
```

**Standard Fallback Rules**:

- **Read/Grep**: Ask user for file path → request manual copy-paste of content
- **AskQuestion**: Use numbered text-based selection format
- **Task/SubAgent**: Fall back to step-by-step checklist or self-debate pattern

### Self-Debate Pattern (for `architect` skill)

When the `Task` tool is unavailable and multi-agent collaboration is needed, use the **Self-Debate Pattern**:

#### Phase 1: Initial Prompt Split

```
You will play two roles in sequence to design this feature:

**Role A: Domain Architect**
- Context: Full project structure, requirements document
- Goal: Design that fits this specific project

**Role B: Best Practice Advisor**
- Context: Feature requirements only (no project context)
- Goal: Ideal design based on universal best practices

Start with Role A. After your design, I will ask you to switch to Role B.
```

#### Phase 2: Cross-Review

```
Now switch to Role B (Best Practice Advisor).

Review the Role A design above and provide:
1. What you agree with
2. Concerns or risks
3. Alternative suggestions
4. Can we reach consensus? [Yes / Need discussion]
```

#### Phase 3: Synthesis

```
Now synthesize both perspectives into a final design.
Document in "Risks & Tradeoffs" section:
- Chosen approach
- Rejected alternatives and why
- Assumptions made
```

**When to use**: Only when `Task` tool is unavailable and multi-perspective design is needed.

### Document Structure Standard

Skills that generate documentation must follow this folder structure:

```
projectRoot/
  └── docs/
        └── {serviceName}/
              ├── requirements.md   # require-refine output
              ├── architect.md      # architect output
              └── changelog.md      # bugfix/changelogging output
```

**Naming convention**: `{serviceName}` should be lowercase, with hyphens or underscores (e.g., `alert`, `user-auth`, `order-management`).

### Phase-Based Workflow

Complex skills should organize work into numbered phases:

```markdown
## Phase 0: Skill Entry
- Validate inputs
- Collect missing information

## Phase 1: Initial Collection
- Gather requirements
- Identify unknowns

## Phase 2: Analysis
- Process input
- Generate draft

## Phase 3: Q&A Loop
- Ask clarifying questions
- Refine output

## Phase 4: User Review
- Present results
- Gather feedback

## Phase 5: Finalize
- Save output
- Provide next steps
```

### Error Handling: Logical Inconsistency Rule

When user feedback conflicts with established context (Section 0 goals, previous decisions), follow this protocol:

#### Step 1: Detect and Report

```markdown
⚠️ **Logical Inconsistency Detected**

**Existing Content**: {what was already confirmed}
**User Feedback**: {new conflicting input}
**Conflict Point**: {specific contradiction}
```

#### Step 2: Present Options

Use `AskQuestion` tool to resolve:

```json
{
  "title": "Resolve Logical Inconsistency",
  "questions": [
    {
      "id": "resolution",
      "prompt": "Existing content conflicts with new feedback. How should we proceed?",
      "options": [
        {"id": "keep_original", "label": "Keep original - Ignore new feedback"},
        {"id": "accept_new", "label": "Accept new - Revise original content"},
        {"id": "merge", "label": "Merge - Incorporate both (explain how)"},
        {"id": "clarify", "label": "Need clarification - Please explain more"}
      ]
    }
  ]
}
```

#### Step 3: Process Decision

- `keep_original` → Log warning, maintain original
- `accept_new` → Update content, document reason for change
- `merge` → Request user explanation of merge approach
- `clarify` → Request detailed explanation, then re-analyze

### Quality Gates

Skills that produce implementation-ready documents must validate completeness before proceeding:

#### Required Validation Checks

| Item | Validation Criteria | If Incomplete |
|------|-------------------|---------------|
| DB Schema | All tables have full column definitions | Enter question loop |
| Code Mapping | All features mapped to file/class/method | Enter question loop |
| API Spec | All endpoints have Request/Response defined | Enter question loop |
| Error Policy | Main error scenarios and responses defined | Enter question loop |

#### Minimum Completion Criteria (Fail Gate)

| Condition | Minimum Requirement |
|-----------|-------------------|
| **If API exists** | Request/Response spec + at least 2 error responses |
| **If Auth exists** | Role/Permission table with at least 1 entry |
| **If DB exists** | Core entity with at least 5 fields defined |

⚠️ **If any applicable item is incomplete, return to previous phase for clarification**

### Skill Completion Message

All skills must provide clear next steps upon completion:

```markdown
> ✅ **{Skill Name} Complete**
>
> Output: `{file path}`
>
> **Next Step**: Run `{next-skill}` to continue.
> → Reference: `@{output file path}`
```

### Example Skill Structure

Here's a minimal example following all standards:

```markdown
---
id: example-skill
name: Example Skill
description: Demonstrates standard skill structure.
version: 1.0.0
triggers:
  - "example"
  - "demo skill"
requires: []
platform: all
recommended_model: sonnet
---

> **Language**: This skill is written in English for universal compatibility.
> Always respond in the user's language unless explicitly requested otherwise.
> If uncertain about the user's language, ask for clarification.

# Example Skill Workflow

Brief description of what this skill does.

## 💡 Recommended Model

**Sonnet** recommended (balanced) / Opus for complex cases

## 🔄 Tool Fallback

| Tool | Alternative when unavailable |
|------|------------------------------|
| **Read/Grep** | Request file path from user → ask for copy-paste |
| **AskQuestion** | "Please select: 1) OptionA 2) OptionB 3) OptionC" format |
| **Task** | Use step-by-step checklist |

## Phase 0: Skill Entry

{Entry validation logic}

## Phase 1: {Phase Name}

{Phase logic}

...

## Completion

> ✅ **Example Skill Complete**
>
> Output: `docs/example/output.md`
>
> **Next Step**: Run next skill as needed.
```

---

## Best Practices

- **Keep skills focused**: Each skill should have a single, clear purpose
- **Use consistent naming**: Follow kebab-case for IDs and file names
- **Document assumptions**: Always log what was confirmed vs. inferred
- **Fail fast**: Use quality gates to catch incomplete designs early
- **Provide context**: Include file paths and specific locations in all mappings
- **Avoid ambiguity**: Prefer specific options over open-ended questions
