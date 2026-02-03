---
name: debug
description: |
  Systematic bug fixing based on documents in Debug mode.
  Cross-references error with design flow to find root cause.

  Triggers: debug, fix, bugfix
user-invocable: true
allowed-tools:
  - Read
  - Write
  - StrReplace
  - Glob
  - Grep
  - LS
  - Shell
  - Skill
---

# /debug

Invoke the **debug** skill for systematic bug fixing.

⚠️ **Run in Debug mode for best results**

## What it does

1. **Load Context**
   - Read `docs/{serviceName}/requirements.md`
   - Read `docs/{serviceName}/arch.md`
   - Read `docs/{serviceName}/changelog.md` (if exists)

2. **Analyze Error**
   - Cross-reference error location with design flow
   - Trace through Code Mapping
   - Identify affected components

3. **Root Cause Analysis**
   - Compare expected behavior (from requirements)
   - Compare implementation (from arch)
   - Identify discrepancy

4. **Implement Fix**
   - Apply minimal targeted fix
   - Verify fix doesn't break other components

5. **Record Results**
   - Auto-call `/trace` to record fix

## Recommended Model

**Sonnet first** (Debug mode provides error location)
→ **Opus** for complex bugs

## Prerequisites

- `docs/{serviceName}/requirements.md`
- `docs/{serviceName}/arch.md`

## Next Step

After completion, `/trace` is automatically called.

## Usage Examples

```
/debug
→ "What's the error?" → [paste error or use Debug mode]
→ Loads requirements.md, arch.md
→ Tracing error through Code Mapping...
→ Root cause: Missing null check in UserService.validate()
→ Applying fix...
→ Calling /trace...
```
