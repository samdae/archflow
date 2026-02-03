# Archflow for Claude Code

**Document-driven development skills with Multi-Agent Debate for Claude Code**

Archflow brings systematic, document-driven development workflows to Claude Code through AI agent skills. It enables high-quality software development by maintaining clear requirements, designs, and changelogs throughout the entire development lifecycle.

## What is Archflow?

Archflow is a comprehensive set of AI agent skills that transforms how you build software with Claude Code:

- **Document-Driven Development**: Keep requirements, designs, and changelogs synchronized with your code
- **Multi-Agent Debate**: Two specialized AI agents (Domain Architect and Best Practice Advisor) collaborate to produce optimal designs
- **Systematic Workflows**: Pre-built skills for common development tasks
- **Full Traceability**: Track every decision from initial requirements to final implementation
- **Quality Assurance**: Built-in validation gates ensure completeness before moving forward

## Installation

### Prerequisites

- Node.js 16.0.0 or higher
- Claude Code installed

### Quick Install

Install Archflow skills into your project with a single command:

```bash
npx archflow init
```

This command will:
1. Copy all skills to `.codebuddy/skills/` (or `CLAUDE.md` depending on your setup)
2. Copy agent definitions to `.codebuddy/agents/`
3. Create a default `archflow.config.yaml` in your project root
4. Set up templates in the `archflow/templates/` directory

### Manual Installation

If automatic installation doesn't work for your setup:

1. Clone the Archflow repository or download the files
2. Copy the `skills/` folder to `.codebuddy/skills/` in your project
3. Copy the `agents/` folder to `.codebuddy/agents/` in your project
4. Copy `archflow.config.yaml` to your project root

## Getting Started

After installation, you can trigger Archflow skills directly in your Claude Code chat by using trigger keywords.

### Basic Workflow

1. **Refine Requirements**: Start by transforming rough ideas into structured requirements

   Say: `spec` or `requirements`
   
   Claude Code will guide you through:
   - Collecting your unstructured materials (Notion docs, chat history, images)
   - Analyzing and organizing the content
   - Asking clarifying questions
   - Generating a complete requirements document
   
   Output: `docs/{serviceName}/spec.md`

2. **Design the Architecture**: Let two AI agents debate the optimal design

   Say: `arch` or `design`
   
   The Multi-Agent Debate process:
   - **Domain Architect**: Designs based on your specific project context
   - **Best Practice Advisor**: Proposes ideal design based on universal best practices
   - **Cross-Review**: Each agent critiques the other's design
   - **Synthesis**: Produces final design with documented tradeoffs
   
   Output: `docs/{serviceName}/arch.md`

3. **Implement the Code**: Automated implementation from design documents

   Say: `implement`
   
   Claude Code will:
   - Parse the design document step-by-step
   - Generate code according to the architecture
   - Validate against quality gates
   - Handle errors and edge cases
   
   Output: Working code implementation

4. **Fix Bugs Systematically**: Debug with document context

   Say: `debug` or `bug fix`
   
   Systematic debugging process:
   - Analyze error in context of design documents
   - Identify root cause
   - Propose fix with impact analysis
   - Update documentation if needed
   
   Output: Bug fix + `docs/{serviceName}/trace.md`

### Example Session

```
You: spec

Claude: I'll help you create a requirements document. Let me ask a few questions...

[Interactive Q&A follows]

Claude: ✅ Requirements Document Complete
        Saved to: docs/alert/spec.md
        
        Next Step: Run 'architect' to begin design.
        → Reference: @docs/alert/spec.md

You: architect @docs/alert/spec.md

Claude: Starting Multi-Agent Debate for design...

[Two agents debate and synthesize design]

Claude: ✅ Architect Design Complete
        Saved to: docs/alert/arch.md
        
        Next Step: Run 'implement' to begin coding.
        → Reference: @docs/alert/arch.md
```

## Available Skills

Archflow includes 10 specialized skills:

| Skill | Trigger Keywords | Purpose |
|-------|-----------------|---------|
| **spec** | `spec`, `specification`, `요구사항 정의` | Transform unstructured materials into refined requirements |
| **arch** | `arch`, `architecture`, `설계` | Multi-Agent Debate for optimal feature design |
| **check** | `check`, `verify`, `검증` | Verify design completeness before implementation |
| **build** | `build`, `compile`, `구현` | Automated implementation from design docs |
| **debug** | `debug`, `fix`, `버그 수정` | Systematic debugging with document context |
| **trace** | `trace`, `log`, `변경 기록` | Generate structured changelogs |
| **sync** | `sync`, `synchronize`, `동기화` | Sync documentation after code changes |
| **enhance** | `enhance`, `improve`, `기능 개선` | Design enhancements for existing features |
| **reinforce** | `reinforce`, `보강` | Enhance existing documentation |
| **reverse** | `reverse`, `문서화` | Generate documentation from existing code |
| **overview** | `overview`, `onboarding` | Generate 1-page project overview |
| **runbook** | `runbook`, `deploy`, `배포 문서` | Collect deployment information for release |

## Configuration

Customize Archflow behavior by editing `archflow.config.yaml` in your project root.

### Key Configuration Options

```yaml
# Platform settings
platform:
  target: "claude-code"
  skills_path: ".codebuddy/skills"
  agents_path: ".codebuddy/agents"

# Workflow settings
workflow:
  enable_debate: true  # Enable Multi-Agent Debate
  auto_sync_arch: true  # Auto-sync docs after changes
  auto_changelog: true  # Auto-generate changelog after debug

# Documentation settings
documentation:
  arch_root: "docs"
  requirements_root: "docs/requirements"
  changelog_root: "docs/changelog"

# Language settings
language:
  primary: "ko"  # "ko" or "en"
  multi_language: false

# Advanced settings
advanced:
  validation_mode: "normal"  # "strict", "normal", or "lenient"
  auto_fix_lints: true
  generate_tests: true
```

## Tool Limitations & Fallbacks

Claude Code may not have all tools available. Archflow skills adapt automatically:

| Tool | Fallback Behavior |
|------|------------------|
| **Task** (Sub-agents) | Uses **Self-Debate Pattern** - Claude plays both agent roles sequentially |
| **AskQuestion** | Uses numbered text-based selection format |
| **Read/Grep** | Asks you to provide file path and content via copy-paste |

### Self-Debate Pattern

When the Task tool is unavailable for Multi-Agent Debate, Archflow uses the Self-Debate Pattern:

1. **Phase 1**: Claude plays Domain Architect role and creates initial design
2. **Phase 2**: Claude switches to Best Practice Advisor role and critiques the design
3. **Phase 3**: Claude synthesizes both perspectives into final design

This pattern ensures high-quality designs even without native multi-agent support.

## Document Structure

Archflow organizes documentation in a standardized structure:

```
projectRoot/
  ├── archflow.config.yaml
  ├── docs/
  │     └── {serviceName}/
  │           ├── spec.md   # spec output
  │           ├── arch.md      # arch output
  │           └── trace.md      # debug output
  └── .codebuddy/
        ├── skills/
        │     ├── spec.md
        │     ├── arch.md
        │     ├── build.md
        │     └── ...
        └── agents/
              ├── domain-arch.md
              └── best-practice-advisor.md
```

## Troubleshooting

### Skill Not Triggering

**Problem**: You say the trigger keyword but Claude doesn't activate the skill

**Solutions**:
- Ensure skills are installed in `.codebuddy/skills/` or `CLAUDE.md`
- Try using the exact trigger keyword from the skill list
- Check that the skill file has proper YAML front matter
- Restart Claude Code to reload skills

### Multi-Agent Debate Not Working

**Problem**: Only one agent responds instead of debate

**Solutions**:
- This is expected if Task tool is unavailable
- Archflow automatically uses Self-Debate Pattern
- Claude will play both roles sequentially
- Final output quality remains high

### Documents Not Saving

**Problem**: Skills complete but files aren't created

**Solutions**:
- Verify write permissions in your project directory
- Check that `docs/` folder exists (create it manually if needed)
- Ensure file paths in config are correct
- Ask Claude to show you the generated content for manual save

### Language Mismatch

**Problem**: Responses are in wrong language

**Solutions**:
- Skills auto-detect your language from your messages
- Override by setting `language.primary` in `archflow.config.yaml`
- Explicitly request language: "Please respond in English"

### Quality Gate Failures

**Problem**: Skill returns to Q&A phase repeatedly

**Solutions**:
- This is intentional - design documents must meet minimum completeness
- Answer the clarifying questions to complete missing sections
- If you want to skip validation, set `validation_mode: lenient` in config
- Review Section 8 (Quality Gates) in the skill to see what's required

## Best Practices

### 1. Start with Requirements

Always begin with `spec` before jumping into design or implementation. Clear requirements prevent wasted effort.

### 2. Trust the Debate Process

When using `arch`, let both agents fully present their perspectives before synthesis. Don't rush to a solution.

### 3. Reference Documents

Always use `@docs/{serviceName}/spec.md` notation to pass documents between skills. This ensures Claude has full context.

### 4. Maintain Documentation

Run `sync` after manual code changes to keep docs in sync. This prevents documentation drift.

### 5. Use Version Control

Commit generated documents (`spec.md`, `arch.md`, `trace.md`) to git. This creates an audit trail of all design decisions.

## Advanced Usage

### Custom Skills

You can create your own skills by:
1. Creating a new `.md` file in `.codebuddy/skills/`
2. Adding YAML front matter with triggers and metadata
3. Following the skill structure standard (see README.md)

### Custom Agents

Add specialized agents for domain-specific debates:
1. Create agent profile in `.codebuddy/agents/`
2. Reference in `archflow.config.yaml` under `workflow.debate_agents`
3. Agents will be invoked during Multi-Agent Debate

### Workflow Automation

Enable automation options in config:
- `auto_sync_arch: true` - Automatically sync docs after code changes
- `auto_changelog: true` - Automatically generate changelog after debug
- `auto_fix_lints: true` - Automatically fix linter errors during implementation

## Learn More

- **Full Documentation**: See individual skill files in `.codebuddy/skills/` for detailed workflows
- **Templates**: Check `archflow/templates/` for document templates
- **Configuration Reference**: Review `archflow.config.yaml` comments for all options
- **Examples**: See `docs/` folder for sample outputs (generated after first use)

## Support & Feedback

- **Issues**: Report bugs or request features on GitHub
- **Repository**: https://github.com/samdae/archflow
- **License**: Apache License 2.0

---

**Ready to start?** Try `spec` in your next Claude Code chat to transform your development workflow!
