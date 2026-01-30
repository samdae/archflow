<!-- Archflow Template: Changelog Document -->
<!-- Generated from: changelogging skill -->
<!-- This template is used to record bug fixes, analysis results, and changes -->

# Changelog

## {date} - {result type}

### Basic Information
| Item | Content |
|------|---------|
| Symptom | {user-reported symptom} |
| Cause | {identified cause} |
| Severity | Critical / High / Medium / Low |
| **Design Impact** | **Yes / No** |

### Design Impact Details (Only when Yes)
| Affected Section | Changes |
|-----------------|---------|
| Code Mapping | {method added/changed/deleted - if applicable} |
| API Spec | {endpoint changes - if applicable} |
| DB Schema | {table/column changes - if applicable} |
| Sequence Diagram | {flow changes - if applicable} |

⚠️ **When design impact exists**: Need to synchronize architect.md with `architect-sync` skill

### Change Reasoning
- **Why did this problem occur**: {root cause analysis}
- **Why was this action taken**: {reason for action choice}

### Action Details
| File | Changes | Change Type |
|------|---------|-------------|
| {file path} | {change description} | Fixed/Added/Deleted/None |

### Impact Scope
- **Direct Impact**: {modified features/APIs}
- **Indirect Impact**: {other features that may be affected by this fix}
- **No Impact Confirmed**: {areas confirmed to not be affected by changes}

### Verification Method
| Verification Item | Method | Expected Result |
|------------------|--------|-----------------|
| Problem resolution | {test method} | {normal operation} |
| Regression test | {related feature test} | {existing features normal} |

### Related Documents
- Requirements: docs/{serviceName}/requirements.md
- Design: docs/{serviceName}/architect.md

---

(Previous changelog entries...)
