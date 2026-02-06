# Archflow Global Rules

These rules apply globally to all Archflow skills. Individual skills must adhere to these standards unless explicitly overridden.

## 1. Communication
> **Language**
> - This skill is written in English for universal compatibility.
> - **Always respond in the user's language** unless explicitly requested otherwise.
> - If uncertain about the user's language, ask for clarification.

## 2. Document Version Control
> **Git Workflow**
> - After document changes, **git commit is recommended**.
> - **Commit message format**: `docs({serviceName}): {skillName} - {change summary}`
> - **Failover**: If git is unavailable or the directory is not a repository → **skip and continue**.

## 3. Identifier Management
> **Code Mapping `#` Rule**
> - Always use `max(existing #) + 1` for new rows.
> - **NEVER reuse deleted numbers** (to maintain history traceability).

> **Requirement ID `FR-{number}` Rule**
> - Always use `max(existing number) + 1` for new requirements.
> - **NEVER reuse deleted numbers**.

## 4. Logical Inconsistency Handling
> **Conflict Detection & Resolution**
> - When user feedback conflicts with existing design, requirements, or purpose:
>
> ### Step 1: Detect and Report
> 1. **Detect**: Identify the specific contradiction.
> 2. **Report**: Present "Existing Content" vs "User Feedback".
>
> ### Step 2: Resolve
> Use `AskQuestion` to offer the following resolution options:
> - **Keep original**: Ignore new feedback and maintain the current state.
> - **Accept new**: Revise the original content to match the new feedback.
> - **Merge**: Incorporate elements of both (requires explanation).
> - **Re-debate / Clarify**: Request further discussion or specific details.
