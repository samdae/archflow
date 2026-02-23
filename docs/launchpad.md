# Archflow Installation Launchpad

> **For AI Agents**: Follow this document step-by-step to install Archflow for the user.
> Read each section carefully and execute the commands/actions as instructed.

---

## Step 0: Select Language

**Ask the user:**
"Which language do you prefer for this installation? (e.g., English, Korean, Japanese...)"

**Action:**
- If the user answers in a language other than English (e.g., "한글", "한국어"), **translate and guide them in that language** for all subsequent steps.

---

## Step 1: Confirm Installation Location

**Ask the user:**

"Install Archflow in the current directory? / 현재 경로에 Archflow를 설치할까요?"
Path: `{current_working_directory}`

1. **Yes / 네** → Proceed to Step 2.
2. **No / 아니오** → Ask user for the target path, or exit.

---

## Step 2: Detect AI Tool

Check the current project structure to detect the AI coding tool:

| Indicator | Tool |
|-----------|------|
| `.cursor/` directory exists | **Cursor** |
| `CLAUDE.md` or `.claude/` exists | **Claude Code** |
| `AGENTS.md` or `.opencode/` exists | **OpenCode** |

If neither is detected, **ask the user** which tool they are using.

---

## Step 3: Install Archflow

### For Cursor

Clone the repository and copy skill files:

```bash
git clone https://github.com/samdae/archflow.git .archflow-tmp
```

If git is not available, ask the user to install it:

| OS | Installation |
|----|-------------|
| **Windows** | `winget install Git.Git` |
| **macOS** | `brew install git` or `xcode-select --install` |
| **Linux** | `sudo apt install git` or `sudo dnf install git` |

Copy these 3 directories from `.archflow-tmp/` to the project:

| Source | Destination |
|--------|------------|
| `.archflow-tmp/skills/` | `.cursor/skills/` |
| `.archflow-tmp/rules/` | `.cursor/rules/` |
| `.archflow-tmp/agents/` | `.cursor/agents/` |

**Action:** Use your file tools (Read, Write, Shell) to copy all files recursively.

Then clean up:

```bash
rm -rf .archflow-tmp
```

Windows:
```bash
rmdir /s /q .archflow-tmp
```

### For Claude Code

Register the marketplace, install the plugin, and enable it:

```
/plugin marketplace add samdae/archflow
/plugin install archflow@samdae
/plugin enable archflow@samdae
```

**Action:** Run these commands sequentially inside Claude Code.

> No file copying needed. Claude Code registers the GitHub repository as a plugin and activates it.

### For OpenCode

Clone the repository and copy files:

```bash
git clone https://github.com/samdae/archflow.git .archflow-tmp
```

Copy these 4 directories from `.archflow-tmp/` to the project:

| Source | Destination |
|--------|------------|
| `.archflow-tmp/skills/` | `.opencode/skills/` |
| `.archflow-tmp/commands/` | `.opencode/commands/` |
| `.archflow-tmp/agents/` | `.opencode/agents/` |
| `.archflow-tmp/rules/` | `.opencode/rules/` |

**Action:** Use your file tools to copy all files recursively.

Then configure rules in `opencode.json` (project root):

**Action:**
1. Check if `opencode.json` already exists
2. If **exists**: Read it, append `".opencode/rules/archflow-rules.md"` to the `instructions` array (create the array if absent)
3. If **not exists**: Create new file:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [".opencode/rules/archflow-rules.md"]
}
```

Then clean up:

```bash
rm -rf .archflow-tmp
```

Windows:
```bash
rmdir /s /q .archflow-tmp
```

---

## Step 4: Verify Installation

Check that the installation was successful:

| Tool | Verification |
|------|-------------|
| Cursor | Check `.cursor/skills/arch/SKILL.md` exists |
| Claude Code | Run `/plugin` → "Manage Plugins" and verify archflow is enabled |
| OpenCode | Check `.opencode/skills/arch/SKILL.md` exists |

---

## Step 5: Initialize Git (Optional)

If the project is not already a git repository:

```bash
git init
git add .
git commit -m "chore: initialize project with archflow"
```

---

## Completion

**Notify the user:**

```
✅ Archflow installed successfully!

Available skills (15):

Core Pipeline:
  /spec        Transform materials into spec.md
  /arch        Multi-agent debate → arch-be/fe.md
  /ui          Generate UI spec from API endpoints
  /check       Verify design completeness
  /pre-build   Verify environment readiness
  /build       Automated implementation from design
  /test        Generate and/or run tests

Bugfix & Maintenance:
  /debug       Systematic bug fixing
  /trace       Record changes to trace.md
  /sync        Sync changes to arch.md

Document Management:
  /reinforce   Add requirements or fill gaps
  /reverse     Reverse-engineer docs from code
  /overview    Generate 1-page project overview

Deployment:
  /runbook     Generate deployment documentation

Type /archflow to see all skills anytime.
```
