---
name: ui
description: |
  Generate UI specification from requirements and backend API design.
  Derives screen list, component hierarchy, and user interactions.

  Triggers: ui, ui spec, screen design
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Glob
  - LS
  - AskQuestion
---

# /ui

Invoke the **ui** skill to generate UI specification from requirements and backend API.

## What it does

1. **Load Documents**
   - Read `docs/{serviceName}/spec.md` (requirements)
   - Read `docs/{serviceName}/arch-be.md` (backend API)

2. **Select Target Platform**
   - **Mobile only**: Mobile viewport wireframes
   - **Desktop only**: Desktop viewport wireframes
   - **Responsive (Both)**: Mobile First approach with breakpoint hints

3. **Derive Screen List**
   - Analyze API endpoints to determine needed screens
   - `GET /resources` → List screen
   - `GET /resources/:id` → Detail screen
   - `POST /resources` → Create form
   - `POST /auth/login` → Login screen

4. **Generate UI Specifications**
   - ASCII wireframe for each screen (based on platform selection)
   - Component hierarchy (YAML)
   - States (loading, empty, error, loaded)
   - User interactions mapping

5. **Identify Shared Components**
   - Extract reusable components
   - Define props and usage

6. **Output**
   - Creates `docs/{serviceName}/ui.md`

## Output Structure

**ui.md contains:**
- Responsive Strategy (platform, breakpoints)
- Screen List (route, endpoints, auth)
- Screen Specifications (wireframe, components, states, interactions)
- Shared Components (props, usage)
- Design System Reference

## Recommended Model

**Opus Required** - UI derivation requires domain knowledge

## Prerequisites

- `docs/{serviceName}/spec.md` from `/spec`
- `docs/{serviceName}/arch-be.md` from `/arch` (Backend)

## Next Step

After completion, run `/arch` and select **Frontend** to generate technical architecture.

## Usage Examples

```
/ui
→ Loads spec.md + arch-be.md
→ Analyzes endpoints
→ Derives 5 screens from API
→ Generates wireframes and component hierarchy
→ docs/blog/ui.md generated

→ Next: /arch (Frontend)
```

## Flow Position

```
/spec → /arch (BE) → /ui → /arch (FE) → /build (FE)
```
