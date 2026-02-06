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
2. **No / 아니오** → Ask user for the target path manually, or exit.

---

## Step 2: Check Prerequisites

### 2-1. Detect Operating System

```bash
# Detect OS
node -e "console.log(process.platform)"
```

Expected output: `win32`, `darwin`, or `linux`

### 2-2. Check Node.js

```bash
node --version
```

**If Node.js is not installed:**

Notify user and provide installation instructions:

| OS | Installation Command |
|----|--------------------|
| **Windows** | `winget install OpenJS.NodeJS.LTS` or download from https://nodejs.org |
| **macOS** | `brew install node` or download from https://nodejs.org |
| **Linux** | `sudo apt install nodejs npm` or `sudo dnf install nodejs npm` |

**Wait for user confirmation before proceeding.**

### 2-3. Check Git

```bash
git --version
```

**If Git is not installed:**

Notify user and provide installation instructions:

| OS | Installation Command |
|----|--------------------|
| **Windows** | `winget install Git.Git` or download from https://git-scm.com |
| **macOS** | `brew install git` or `xcode-select --install` |
| **Linux** | `sudo apt install git` or `sudo dnf install git` |

**Wait for user confirmation before proceeding.**

---

## Step 3: Install Archflow

```bash
npm install samdae/archflow
```

*Note: We install directly from GitHub to ensure you have the latest version.*

This will automatically run the `postinstall` script (`scripts/init.js`).

---

## Step 4: Select Your AI Tool

The init script will prompt:

```
Which AI coding tool are you using?

1) Cursor
2) Windsurf
3) Antigravity (Current)
4) Claude Code
5) GPT-Codex (OpenAI)
6) Gemini CLI (Google)

Enter your choice (1-6):
```

---

## Step 5: Tool-Specific Installation

### Cursor (Option 1)
- Copy `skills/` → `.cursor/skills/`
- Copy `rules/` → `.cursor/rules/`
- Copy `agents/` (if needed)

### Windsurf (Option 2)
- Copy `skills/` → `.windsurf/skills/`
- Merge `rules/` → `.windsurfrules` (single file)
- Create `AGENTS.md` in project root

### Antigravity (Option 3)
- Copy `skills/` → `skills/`
- Copy `rules/` → `rules/`
- Copy `agents/` → `agents/`

### Claude Code (Option 4)
- Run: `claude add marketplace samdae/archflow`
- Run: `claude install archflow`

### GPT-Codex (Option 5)
- Copy `skills/` → `.codex/skills/`
- Copy `rules/` → `.codex/rules/`
- Create `AGENTS.md` in project root

### Gemini CLI (Option 6)
- Copy `skills/` → `.gemini/skills/`
- Create/update `settings.json` with rules
- Create `GEMINI.md` in project root

---

## Step 6: Verify Installation

After installation, verify by checking the tool-specific paths:

| Tool | Check Path |
|------|-----------|
| Cursor | `.cursor/skills/arch/SKILL.md` |
| Windsurf | `.windsurf/skills/arch/SKILL.md` |
| Antigravity | `skills/arch/SKILL.md` |
| Claude Code | Run `claude skills list` |
| GPT-Codex | `.codex/skills/arch/SKILL.md` |
| Gemini CLI | `.gemini/skills/arch/SKILL.md` |

---

## Step 7: Initialize Git (Optional but Recommended)

If the project is not a git repository:

```bash
git init
git add .
git commit -m "chore: initialize project with archflow"
```

---

## Completion

**Notify user:**

```
✅ Archflow installed successfully!

You can now use the following skills:
- /spec - Transform requirements into spec.md
- /arch - Design with Multi-Agent Debate
- /build - Implement from design docs
- /test - Run tests
- /debug - Debug with document context

Documentation: https://github.com/samdae/archflow
```
