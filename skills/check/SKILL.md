---
id: check
name: Check
description: |
  Verify design document completeness before implementation.
  Identifies missing details based on defined components and asks user to fill gaps.

  Triggers: check, verify, validate design, 설계 검증, 검증
user-invocable: true
version: 1.0.0
triggers:
  - "check"
  - "verify"
  - "validate"
  - "design review"
requires: ["arch"]
platform: all
recommended_model: sonnet
allowed-tools:
  - Read
  - Write
  - Glob
  - LS
  - AskQuestion
---

> **Language**: This skill is written in English for universal compatibility.
> Always respond in the user's language unless explicitly requested otherwise.
> If uncertain about the user's language, ask for clarification.

# Architect Review Workflow

Verify design document completeness and identify missing details that will be needed during implementation.

## 💡 Recommended Model

**Sonnet** recommended (analysis task) / Opus for complex designs

## 🔄 Tool Fallback

| Tool | Alternative when unavailable |
|------|------------------------------|
| **Read** | Request file path from user → ask for copy-paste |
| **AskQuestion** | "Please select: 1) OptionA 2) OptionB 3) OptionC" format |

## 📁 Document Structure

```
projectRoot/
  └── docs/
        └── {serviceName}/
              ├── spec.md  # Input (optional)
              └── arch.md     # Input & Output (updated)
```

---

## Phase 0: Skill Entry

### 0-1. Model Recommendation

> 💡 **Sonnet is sufficient for this skill.**
> This is an analysis task, not a creative design task.

### 0-2. Collect Service Name

**Use AskQuestion:**

```json
{
  "title": "Architect Review",
  "questions": [
    {
      "id": "service_name",
      "prompt": "Which service's design document do you want to review?",
      "options": [
        {"id": "input", "label": "I will type the service name"}
      ]
    }
  ]
}
```

Or detect from context if user provides file path.

### 0-3. Load Design Document

Read `docs/{serviceName}/arch.md`

If not found → Error: "Design document not found. Run /arch first."

---

## Phase 1: Component Detection

Scan the design document and detect which components are defined:

### Detection Checklist

| Component | Detection Method | Triggers Additional Checks |
|-----------|-----------------|---------------------------|
| **Authentication** | "인증", "auth", "OAuth", "JWT" in document | Token refresh, Session management |
| **Database** | DB schema tables defined | Soft delete, Indexes, Migrations |
| **REST API** | API endpoints defined | Pagination, Rate limiting, Versioning |
| **External API calls** | External API list exists | Retry policy, Caching, Fallback |
| **Async processing** | Celery, Queue, Worker mentioned | Error handling, Retry, DLQ |
| **Real-time** | SSE, WebSocket mentioned | Connection management, Heartbeat |
| **File storage** | Upload, S3, file mentioned | Size limits, Cleanup policy |
| **Caching** | Redis, Cache mentioned | TTL policy, Invalidation |
| **K8s/Docker** | Deployment config exists | Health check, Resource limits |
| **LLM/AI** | LLM, OpenAI, Claude mentioned | Cost control, Token limits |

---

## Phase 2: Gap Analysis

For each detected component, check if required details are defined:

### Authentication Gaps

| Required Detail | Check | If Missing |
|-----------------|-------|------------|
| Token refresh logic | Is refresh token flow defined? | Ask user |
| Token expiration time | Is expiry duration specified? | Ask user |
| Session invalidation | How to logout/revoke? | Ask user |

### Database Gaps

| Required Detail | Check | If Missing |
|-----------------|-------|------------|
| Soft delete vs Hard delete | Is deletion strategy defined? | Ask user |
| Index strategy | Are indexes defined for query patterns? | Suggest based on API |
| Migration strategy | Is Alembic/migration mentioned? | Suggest |

### REST API Gaps

| Required Detail | Check | If Missing |
|-----------------|-------|------------|
| Pagination | Is pagination defined for list APIs? | Ask user |
| Rate limiting | Is rate limit policy defined? | Ask user |
| API versioning | Is /v1/ or versioning mentioned? | Suggest |
| Request validation | Is validation logic defined? | Suggest |

### External API Gaps

| Required Detail | Check | If Missing |
|-----------------|-------|------------|
| Retry policy | Is retry count/backoff defined? | Ask user |
| Caching strategy | Is response caching defined? | Ask user |
| Fallback behavior | What if external API fails? | Ask user |
| Timeout settings | Is timeout defined? | Suggest default |

### Async Processing Gaps

| Required Detail | Check | If Missing |
|-----------------|-------|------------|
| Error handling | What if task fails? | Ask user |
| Retry policy | Is retry count defined? | Ask user |
| Dead letter queue | Is DLQ/failed task handling defined? | Suggest |
| Idempotency | Can task be safely retried? | Ask user |

### Real-time Gaps

| Required Detail | Check | If Missing |
|-----------------|-------|------------|
| Connection timeout | Is SSE/WS timeout defined? | Suggest default |
| Reconnection logic | Client reconnection strategy? | Suggest |
| Heartbeat | Is keep-alive mechanism defined? | Suggest |

### Infrastructure Gaps

| Required Detail | Check | If Missing |
|-----------------|-------|------------|
| Health check endpoint | Is /health or probe defined? | Suggest |
| Liveness/Readiness | Are K8s probes defined? | Suggest if K8s |
| Graceful shutdown | Is shutdown handling defined? | Suggest |
| Logging strategy | Is log format/level defined? | Ask user |
| Monitoring | Is metrics/alerting defined? | Ask user |

### LLM/AI Gaps

| Required Detail | Check | If Missing |
|-----------------|-------|------------|
| Cost tracking | Is token/cost logging defined? | Suggest |
| Usage limits | Is per-user limit defined? | Already in doc? |
| Fallback model | What if primary model fails? | Ask user |
| Prompt versioning | Is prompt management defined? | Suggest |

---

## Phase 3: Q&A Loop

For each gap found, ask user to fill:

**Use AskQuestion for choices:**

```json
{
  "title": "Missing Detail: Token Refresh",
  "questions": [
    {
      "id": "token_refresh",
      "prompt": "Token refresh logic is not defined. How should expired tokens be handled?",
      "options": [
        {"id": "refresh_token", "label": "Use refresh token (recommended)"},
        {"id": "re_login", "label": "Require re-login"},
        {"id": "long_expiry", "label": "Use long expiry (24h+)"},
        {"id": "skip", "label": "Skip for now (decide during implementation)"}
      ]
    }
  ]
}
```

**For open-ended questions:**

> "Pagination is not defined for list APIs. What should be the default page size?"
>
> Suggested: 20 items per page, max 100

### Skip Handling

If user selects "Skip for now":
- Mark as `⚠️ TBD` in document
- Continue to next gap
- List all skipped items at the end

---

## Phase 4: Document Update

Update `docs/{serviceName}/arch.md` with filled gaps.

### Update Location

Add new section or update existing sections:

```markdown
## 12. Additional Design Details (from Review)

### Authentication Details
- Token expiration: 1 hour
- Refresh token expiration: 7 days
- Refresh flow: POST /api/v1/auth/refresh with refresh_token

### API Details
- Pagination: 20 items default, 100 max
- Rate limiting: 100 requests/minute per user

### Infrastructure Details
- Health check: GET /health (returns 200 OK)
- Graceful shutdown: 30 second timeout

### ⚠️ TBD (Skipped)
- Monitoring strategy
- Log aggregation
```

### Sync History Update

Add to Sync History section:

```markdown
| {date} | review | check | 설계 완성도 검증 - {N}개 항목 추가 |
```

---

## Phase 5: Summary Report

Present review summary to user:

```markdown
## Architect Review Complete

### Components Detected
- ✅ Authentication (Google OAuth + JWT)
- ✅ Database (PostgreSQL, 10 tables)
- ✅ REST API (15 endpoints)
- ✅ Async Processing (Celery)
- ✅ Real-time (SSE)
- ✅ External APIs (4 services)
- ✅ LLM (OpenAI GPT-4)

### Gaps Filled: 8
| Item | Decision |
|------|----------|
| Token refresh | Use refresh token |
| Pagination | 20 items default |
| Health check | GET /health added |
| ... | ... |

### Skipped (TBD): 2
- Monitoring strategy
- Log aggregation

### Document Updated
`docs/{serviceName}/arch.md` - 12. Additional Design Details section added

### Next Step
Run `/build` to start implementation.
```

---

## Completion Message

> ✅ **Architect Review Complete**
>
> Output: `docs/{serviceName}/arch.md` (updated)
>
> - Gaps filled: {N}
> - Skipped (TBD): {M}
>
> **Next Step**: Run `/build` to start implementation.

---

# Review Checklist Reference

Quick reference for common gaps by component:

| Component | Common Gaps |
|-----------|-------------|
| Auth | Token refresh, Session timeout, Logout flow |
| DB | Soft delete, Indexes, Cascade rules |
| API | Pagination, Rate limit, Versioning, Validation |
| External API | Retry, Cache, Timeout, Fallback |
| Async | Error handling, Retry, DLQ, Idempotency |
| Real-time | Timeout, Reconnect, Heartbeat |
| Infra | Health check, Probes, Graceful shutdown, Logging |
| LLM | Cost tracking, Limits, Fallback, Prompt versioning |
