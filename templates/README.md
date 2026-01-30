# Archflow Document Templates

This directory contains output document templates used by various Archflow skills.

## Available Templates

| Template | Used By Skill | Description |
|----------|--------------|-------------|
| `requirements-template.md` | `require-refine` | Requirements document structure |
| `architect-template.md` | `architect` | Design document with API specs, DB schema, implementation plan |
| `changelog-template.md` | `changelogging` | Bug fix and change log documentation |
| `deploy-launchpad-template.md` | `deploy-launchpad` | Deployment information and guide |

## Template Reuse

Some skills reuse existing templates:

- **reverse** skill: Generates documents using `requirements-template.md` and `architect-template.md`
- **architect-sync** skill: Updates existing `architect.md` (no separate template)
- **architect-enhance** skill: Updates existing `architect.md` (no separate template)
- **reinforce** skill: Updates existing `requirements.md` or `architect.md` (no separate template)

## Usage

Templates are referenced by skills during document generation. Each template includes:
- Front matter with metadata fields
- Section structure with placeholders (e.g., `{serviceName}`, `{date}`)
- Standard formatting and tables

Skills automatically populate these templates with collected information.
