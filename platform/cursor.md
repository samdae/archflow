# Archflow for Cursor

**Document-driven development skills with Multi-Agent Debate for Cursor**

Archflow brings systematic, document-driven development workflows to Cursor through AI agent skills. It enables high-quality software development by maintaining clear requirements, designs, and changelogs throughout the entire development lifecycle.

## What is Archflow?

Archflow is a comprehensive set of AI agent skills that transforms how you build software with Cursor:

- **Document-Driven Development**: Keep requirements, designs, and changelogs synchronized with your code
- **Multi-Agent Debate**: Two specialized AI agents (Domain Architect and Best Practice Advisor) collaborate to produce optimal designs
- **Systematic Workflows**: Pre-built skills for common development tasks
- **Full Traceability**: Track every decision from initial requirements to final implementation
- **Quality Assurance**: Built-in validation gates ensure completeness before moving forward
- **Task Tool Integration**: Leverages Cursor's native Task tool for true parallel multi-agent execution

## Installation

### Prerequisites

- Node.js 16.0.0 or higher
- Cursor IDE installed

### Quick Install

Install Archflow skills into your project with a single command:

```bash
npx archflow init
```

This command will:
1. Copy all skills to `.cursor/skills/` directory
2. Copy agent definitions to `.cursor/agents/`
3. Create a default `archflow.config.yaml` in your project root
4. Set up templates in the `archflow/templates/` directory

### Manual Installation

If automatic installation doesn't work for your setup:

1. Clone the Archflow repository or download the files
2. Copy the `skills/` folder to `.cursor/skills/` in your project
3. Copy the `agents/` folder to `.cursor/agents/` in your project
4. Copy `archflow.config.yaml` to your project root

### Verification

After installation, verify the setup:

```
projectRoot/
  ├── archflow.config.yaml
  └── .cursor/
        ├── skills/
        │     ├── require-refine.md
        │     ├── architect.md
        │     ├── implement.md
        │     └── ...
        └── agents/
              ├── domain-architect.md
              └── best-practice-advisor.md
```

## Getting Started

After installation, you can trigger Archflow skills directly in your Cursor chat by using trigger keywords.

### Basic Workflow

1. **Refine Requirements**: Start by transforming rough ideas into structured requirements

   Say: `require-refine` or `requirements`
   
   Cursor will guide you through:
   - Collecting your unstructured materials (Notion docs, chat history, images)
   - Analyzing and organizing the content
   - Asking clarifying questions using the AskQuestion tool
   - Generating a complete requirements document
   
   Output: `docs/{serviceName}/requirements.md`

2. **Design the Architecture**: Let two AI agents debate the optimal design

   Say: `architect` or `design`
   
   The Multi-Agent Debate process:
   - **Domain Architect**: Designs based on your specific project context
   - **Best Practice Advisor**: Proposes ideal design based on universal best practices
   - **Cross-Review**: Each agent critiques the other's design in parallel
   - **Synthesis**: Produces final design with documented tradeoffs
   
   Output: `docs/{serviceName}/architect.md`

3. **Implement the Code**: Automated implementation from design documents

   Say: `implement`
   
   Cursor will:
   - Parse the design document step-by-step
   - Generate code according to the architecture
   - Validate against quality gates
   - Handle errors and edge cases
   - Use ReadLints tool to check for errors
   
   Output: Working code implementation

4. **Fix Bugs Systematically**: Debug with document context

   Say: `bugfix` or `bug fix`
   
   Systematic debugging process:
   - Analyze error in context of design documents
   - Identify root cause
   - Propose fix with impact analysis
   - Update documentation if needed
   
   Output: Bug fix + `docs/{serviceName}/changelog.md`

### Example Session

```
You: require-refine

Cursor: I'll help you create a requirements document. Let me ask a few questions...

[Interactive Q&A follows using AskQuestion tool]

Cursor: ✅ Requirements Document Complete
        Saved to: docs/alert/requirements.md
        
        Next Step: Run 'architect' to begin design.
        → Reference: @docs/alert/requirements.md

You: architect @docs/alert/requirements.md

Cursor: Starting Multi-Agent Debate for design...

[Two agents debate in parallel using Task tool and synthesize design]

Cursor: ✅ Architect Design Complete
        Saved to: docs/alert/architect.md
        
        Next Step: Run 'implement' to begin coding.
        → Reference: @docs/alert/architect.md
```

## Available Skills

Archflow includes 10 specialized skills:

| Skill | Trigger Keywords | Purpose |
|-------|-----------------|---------|
| **require-refine** | `require-refine`, `requirements`, `요구사항 정리` | Transform unstructured materials into refined requirements |
| **architect** | `architect`, `design`, `설계` | Multi-Agent Debate for optimal feature design |
| **architect-enhance** | `architect-enhance`, `기능 고도화` | Design enhancements for existing features |
| **architect-sync** | `architect-sync`, `설계 동기화` | Sync documentation after code changes |
| **implement** | `implement`, `구현`, `develop` | Automated implementation from design docs |
| **bugfix** | `bugfix`, `bug fix`, `버그 수정` | Systematic debugging with document context |
| **changelogging** | `changelogging`, `changelog`, `변경 기록` | Generate structured changelogs |
| **reinforce** | `reinforce`, `보강` | Enhance existing documentation |
| **reverse** | `reverse`, `문서화` | Generate documentation from existing code |
| **deploy-launchpad** | `deploy-launchpad`, `배포 문서` | Collect deployment information for release |

## Configuration

Customize Archflow behavior by editing `archflow.config.yaml` in your project root.

### Key Configuration Options

```yaml
# Platform settings
platform:
  target: "cursor"
  skills_path: ".cursor/skills"
  agents_path: ".cursor/agents"

# Workflow settings
workflow:
  enable_debate: true  # Enable Multi-Agent Debate
  debate_agents:
    - "domain-architect"
    - "best-practice-advisor"
  auto_sync_architect: true  # Auto-sync docs after changes
  auto_changelog: true  # Auto-generate changelog after bugfix

# Documentation settings
documentation:
  architect_root: "docs"
  requirements_root: "docs/requirements"
  changelog_root: "docs/changelog"
  template_style: "standard"  # "standard" or "minimal"

# Language settings
language:
  primary: "ko"  # "ko" or "en"
  multi_language: false

# Advanced settings
advanced:
  validation_mode: "normal"  # "strict", "normal", or "lenient"
  auto_fix_lints: true
  generate_tests: true
  commit_strategy: "manual"  # "manual", "auto", or "prompt"
```

## Cursor-Specific Features

Cursor provides several tools that enhance Archflow's capabilities:

### Task Tool (TodoWrite)

The `architect` skill leverages Cursor's Task tool for true parallel multi-agent debate:

- **Domain Architect** and **Best Practice Advisor** work simultaneously
- Each agent maintains independent context and perspective
- Cross-review happens in real-time with task state tracking
- No sequential role-switching needed (unlike Self-Debate Pattern)

### AskQuestion Tool

All skills use Cursor's interactive `AskQuestion` tool for structured Q&A:

- Multiple-choice questions with single or multi-select
- Clear, clickable options instead of text-based input
- Better user experience for decision-making
- Reduces ambiguity and improves answer quality

### ReadLints Tool

The `implement` and `bugfix` skills use `ReadLints` to check code quality:

- Automatically detects linter errors after code generation
- Provides context-aware error messages
- Enables immediate fixes during implementation
- Maintains code quality throughout the workflow

### File Operations

Cursor's advanced file tools enable seamless document management:

- **Read/Grep**: Skills automatically read existing code and documents
- **StrReplace**: Precise, context-aware code modifications
- **Write**: Create new files with proper formatting
- **Glob**: Find files matching patterns for batch operations

## Tool Availability

Cursor has full tool support for Archflow workflows:

| Tool | Status | Used By |
|------|--------|---------|
| **Task (TodoWrite)** | ✅ Available | `architect`, `implement`, `bugfix` |
| **AskQuestion** | ✅ Available | All skills requiring user input |
| **Read/Grep** | ✅ Available | All skills reading code/docs |
| **StrReplace** | ✅ Available | `implement`, `bugfix`, `architect-sync` |
| **ReadLints** | ✅ Available | `implement`, `bugfix` |

All Archflow skills work at full capacity in Cursor with no fallback patterns needed.

## Document Structure

Archflow organizes documentation in a standardized structure:

```
projectRoot/
  ├── archflow.config.yaml
  ├── docs/
  │     └── {serviceName}/
  │           ├── requirements.md   # require-refine output
  │           ├── architect.md      # architect output
  │           └── changelog.md      # bugfix output
  └── .cursor/
        ├── skills/
        │     ├── require-refine.md
        │     ├── architect.md
        │     ├── implement.md
        │     ├── bugfix.md
        │     ├── changelogging.md
        │     ├── architect-enhance.md
        │     ├── architect-sync.md
        │     ├── reinforce.md
        │     ├── reverse.md
        │     └── deploy-launchpad.md
        └── agents/
              ├── domain-architect.md
              └── best-practice-advisor.md
```

## Troubleshooting

### Skill Not Triggering

**Problem**: You say the trigger keyword but Cursor doesn't activate the skill

**Solutions**:
- Ensure skills are installed in `.cursor/skills/` directory
- Try using the exact trigger keyword from the skill list
- Check that the skill file has proper YAML front matter
- Restart Cursor to reload skills
- Check that skill filename matches pattern: `{skill-id}.md`

### Multi-Agent Debate Not Working

**Problem**: Task tool not creating parallel agent tasks

**Solutions**:
- Verify `workflow.enable_debate: true` in `archflow.config.yaml`
- Check that both agent files exist in `.cursor/agents/`
- Ensure agent filenames match config: `domain-architect.md`, `best-practice-advisor.md`
- Try running in Debug mode to see Task tool calls
- If Task tool is unavailable, skill will automatically fall back to Self-Debate Pattern

### Documents Not Saving

**Problem**: Skills complete but files aren't created

**Solutions**:
- Verify write permissions in your project directory
- Check that `docs/` folder exists (create it manually if needed)
- Ensure file paths in config are correct relative to project root
- Look for error messages in Cursor's output panel
- Try specifying absolute path in config instead of relative

### Language Mismatch

**Problem**: Responses are in wrong language

**Solutions**:
- Skills auto-detect your language from your messages
- Override by setting `language.primary` in `archflow.config.yaml`
- Explicitly request language: "Please respond in English"
- Check that skill front matter includes language directive

### Quality Gate Failures

**Problem**: Skill returns to Q&A phase repeatedly

**Solutions**:
- This is intentional - design documents must meet minimum completeness
- Answer the clarifying questions to complete missing sections
- If you want to skip validation, set `validation_mode: lenient` in config
- Review Section 4 or Section 8 (Quality Gates) in the skill to see what's required
- For MVP, consider accepting partial completion and noting unclear items in Section 5

### ReadLints Showing Errors

**Problem**: Linter errors appear after implementation

**Solutions**:
- This is expected - `ReadLints` helps catch quality issues early
- Review the errors and ask Cursor to fix them
- Enable `advanced.auto_fix_lints: true` for automatic fixes
- Some errors may be intentional (e.g., unused imports) - review before fixing
- Use `# type: ignore` or similar comments for false positives

## Best Practices

### 1. Start with Requirements

Always begin with `require-refine` before jumping into design or implementation. Clear requirements prevent wasted effort.

### 2. Trust the Debate Process

When using `architect`, let both agents fully present their perspectives before synthesis. Don't interrupt the Task workflow.

### 3. Reference Documents

Always use `@docs/{serviceName}/requirements.md` notation to pass documents between skills. This ensures Cursor has full context.

### 4. Maintain Documentation

Run `architect-sync` after manual code changes to keep docs in sync. This prevents documentation drift.

### 5. Use Version Control

Commit generated documents (`requirements.md`, `architect.md`, `changelog.md`) to git. This creates an audit trail of all design decisions.

### 6. Leverage Task Tool

Monitor the Task panel in Cursor during `architect` skill execution to see agent progress in real-time.

### 7. Review Lints Early

After `implement` completes, review `ReadLints` output immediately. Fix issues before moving to next phase.

### 8. Commit Strategy

Set `commit_strategy: prompt` to review changes before committing. Set `auto` for continuous integration workflows.

## Advanced Usage

### Custom Skills

You can create your own skills by:

1. Creating a new `.md` file in `.cursor/skills/`
2. Adding YAML front matter with triggers and metadata
3. Following the skill structure standard (see README.md)
4. Testing with trigger keywords in Cursor chat

Example front matter:

```yaml
---
id: custom-skill
name: Custom Skill
description: My custom workflow skill.
version: 1.0.0
triggers:
  - "custom"
  - "my-skill"
requires: []
platform: all
recommended_model: sonnet
---
```

### Custom Agents

Add specialized agents for domain-specific debates:

1. Create agent profile in `.cursor/agents/` (e.g., `security-expert.md`)
2. Reference in `archflow.config.yaml` under `workflow.debate_agents`
3. Agents will be invoked during Multi-Agent Debate

Example agent file structure:

```markdown
# Security Expert Agent

## Role
Security expert focused on threat modeling and secure design patterns.

## Expertise
- OWASP Top 10
- Authentication/Authorization
- Data encryption
- API security

## Review Focus
- Identify security vulnerabilities
- Recommend secure alternatives
- Check compliance requirements
```

### Workflow Automation

Enable automation options in config for streamlined workflows:

```yaml
workflow:
  auto_sync_architect: true  # Auto-sync docs after code changes
  auto_changelog: true       # Auto-generate changelog after bugfix

advanced:
  auto_fix_lints: true       # Auto-fix linter errors during implementation
  generate_tests: true       # Generate unit tests during implementation
  commit_strategy: "auto"    # Auto-commit after successful implementation
```

### Skill Chaining

Chain skills together for complete feature development:

```
require-refine → architect → implement → (test) → (bugfix if needed) → changelogging → architect-sync
```

Use Cursor's chat history to maintain context across the chain.

### Debugging Skills

To debug skill execution:

1. Enable Debug mode in Cursor
2. Watch Task panel for agent task creation
3. Check output panel for tool call logs
4. Review generated files in `docs/` folder
5. Inspect `archflow.config.yaml` for configuration issues

## Comparison: Cursor vs Claude Code

| Feature | Cursor | Claude Code |
|---------|--------|-------------|
| **Task Tool** | ✅ Native support | ❌ Falls back to Self-Debate |
| **AskQuestion** | ✅ Interactive UI | ✅ Interactive UI |
| **ReadLints** | ✅ Available | ❌ Manual checking |
| **File Operations** | ✅ Full suite | ✅ Full suite |
| **Multi-Agent Debate** | ✅ True parallel | ⚠️ Sequential simulation |
| **Skill Installation** | `.cursor/skills/` | `.codebuddy/skills/` or `CLAUDE.md` |

**Recommendation**: Both platforms fully support Archflow, but Cursor provides optimal experience for Multi-Agent Debate workflows.

## Learn More

- **Full Documentation**: See individual skill files in `.cursor/skills/` for detailed workflows
- **Templates**: Check `archflow/templates/` for document templates
- **Configuration Reference**: Review `archflow.config.yaml` comments for all options
- **Examples**: See `docs/` folder for sample outputs (generated after first use)
- **README**: See `archflow/README.md` for skill structure standards

## Support & Feedback

- **Issues**: Report bugs or request features on GitHub
- **Repository**: https://github.com/samdae/archflow
- **License**: Apache License 2.0
- **Author**: samdae

---

**Ready to start?** Try `require-refine` in your next Cursor chat to transform your development workflow!
