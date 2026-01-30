<!-- Archflow Template: Deployment Launchpad Document -->
<!-- Generated from: deploy-launchpad skill -->
<!-- This template is used by LLMs to guide deployment -->
<!-- ⚠️ Actual secret values should NOT be included -->

# {serviceName} Deployment Launchpad

> This document is used by LLMs to guide deployment.
> Actual secret values are not included.

## 1. Service Information

| Item | Value |
|------|-------|
| Service Name | {serviceName} |
| Port | {port} |
| Repository | {repo_url} |

---

## 2. Infrastructure

### 2.1 Type
{infra_type} ({provider})

### 2.2 Configuration
| Item | Value |
|------|-------|
| {Infrastructure-specific settings...} | |

---

## 3. CI/CD

### 3.1 Tool
{cicd_tool or "Manual deployment"}

### 3.2 Pipeline
- Configuration file: {cicd_file}
- Trigger: {trigger}

---

## 4. Environment-Specific Configuration

### 4.1 {Environment Name}
| Item | Value |
|------|-------|
| URL | {url} |
| Configuration file | {config_path} |
| Special notes | {specific} |

(Repeat for each environment)

---

## 5. Build

### 5.1 Prerequisites
{prereq or "None"}

### 5.2 Build Command
```bash
{build_command}
```

---

## 6. Deployment

### 6.1 Prerequisites
{prereq or "None"}

### 6.2 Deployment Command
```bash
{deploy_command}
```

### 6.3 Rollback Command
```bash
{rollback_command}
```

---

## 7. Validation

### 7.1 Health Check
- URL: {health_check_url}
- Expected response: 200 OK

### 7.2 Smoke Test
{smoke_test or "None"}

---

## 8. Monitoring

| Item | Link/Method |
|------|-------------|
| Dashboard | {dashboard_url} |
| Log Access | {log_access} |

---

## 9. Secrets/Configuration Management

| Item | Method |
|------|--------|
| Management method | {secret_method} |
| Location/Access | {secret_location} |

⚠️ **Actual secret values are not included in this document.**

---

## 10. Pre-Deployment Checklist

- [ ] {checklist_item_1}
- [ ] {checklist_item_2}
- [ ] ...

---

## 11. Cautions

{cautions or "No special cautions"}

---

## Meta Information

| Item | Content |
|------|---------|
| Created | {date} |
| Last Modified | {date} |
| Skill Version | deploy-launchpad 2.0.0 |
