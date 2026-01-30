---
name: deploy-launchpad
description: |
  Collect deployment information via Q&A to generate Launchpad document.
  Creates comprehensive deployment guide without actual secrets.

  Triggers: deploy-launchpad, deployment docs, create launchpad
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Glob
  - LS
  - AskQuestion
  - Skill
---

# /deploy-launchpad

Invoke the **deploy-launchpad** skill to create deployment documentation.

## What it does

1. **Service Information**
   - Service name, port
   - Health check endpoints

2. **Infrastructure**
   - Platform: K8s / Docker / VM / Serverless
   - Resource requirements
   - Scaling configuration

3. **CI/CD Configuration**
   - Pipeline tool (GitHub Actions, Jenkins, etc.)
   - Build steps
   - Deployment triggers

4. **Environment Settings**
   - Environment variables (names only, not values)
   - Config files locations
   - Secret management (where to retrieve, not actual values)

5. **Commands**
   - Build commands
   - Deploy commands
   - Rollback commands

6. **Validation & Monitoring**
   - Health check verification
   - Log locations
   - Alerting setup

7. **Generate Output**
   - Creates `docs/{serviceName}/deploy-launchpad.md`

## Recommended Model

**Sonnet** (documentation task)

## Output

`docs/{serviceName}/deploy-launchpad.md`

⚠️ **Never includes actual secret values** - only records where/how to retrieve them

## Usage After Creation

```
"Deploy {serviceName}" + @deploy-launchpad.md
→ LLM reads document and guides deployment
```

## Usage Examples

```
/deploy-launchpad
→ "Service name?" → "auth-service"
→ "Platform?" → "Kubernetes"
→ "CI/CD tool?" → "GitHub Actions"
→ "Environment variables?" → "DB_URL, JWT_SECRET, REDIS_URL"
→ "Where are secrets stored?" → "AWS Secrets Manager"
→ deploy-launchpad.md generated
```
