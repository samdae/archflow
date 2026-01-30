---
name: Architect Enhance
description: 기존 기능 고도화 설계. Triggers on "architect-enhance", "아키텍처 고도화", "기능 고도화". 고도화 요구사항 + synced architect → 고도화 설계.
version: 1.0.0
---

# Architect Enhance Workflow

기존 architect 문서에 고도화 요구사항을 반영한 설계를 추가합니다.

## 💡 권장 모델

**Opus 필수** - 기존 설계와의 정합성 분석 필요

→ 기존 architect + 새 요구사항 + 충돌 검증 = 복잡한 분석

## 🔄 도구 폴백 (Fallback)

| 도구 | 없을 때 대체 방법 |
|------|-----------------|
| **Read/Grep** | 사용자에게 파일 내용 복사-붙여넣기 요청 |
| **AskQuestion** | "다음 중 선택해주세요: 1) 옵션A 2) 옵션B 3) 옵션C" 형태로 질문 |
| **Task** | 서브에이전트 없이 순차 분석, 사용자 중간 확인 |

## 📁 문서 구조

```
projectRoot/
  └── docs/
        └── {serviceName}/
              ├── requirements.md        # 기존 요구사항
              ├── requirements-v2.md     # ← 고도화 요구사항 (require-refine 출력)
              ├── architect.md           # ← 기존 설계 (synced 상태 권장)
              └── changelog.md
```

## ⚠️ 선행 조건

1. **기존 architect.md**가 최신 상태 (bugfix 후 architect-sync 완료)
2. **고도화 요구사항**이 require-refine으로 정리됨

---

## Phase 0: 스킬 진입

### 0-0. 모델 안내

> ⚠️ **이 스킬은 Opus 모델 사용을 강력히 권장합니다.**
> 기존 설계와의 정합성 분석이 필요하므로 고성능 모델 필수.
>
> **입력**:
> - 고도화 요구사항 (requirements-v2.md 등)
> - 기존 architect.md (synced 상태 권장)
>
> **출력**: 업데이트된 architect.md

### 0-1. 파일 입력 받기

```json
{
  "title": "기능 고도화 설계",
  "questions": [
    {
      "id": "has_enhance_req",
      "prompt": "고도화 요구사항 문서가 있나요? (require-refine으로 생성)",
      "options": [
        {"id": "yes", "label": "예 - @파일경로로 알려드릴게요"},
        {"id": "no", "label": "아니오 - 요구사항 정리부터 필요해요"}
      ]
    }
  ]
}
```

- `no` → **require-refine** 스킬로 안내
- `yes` → 파일 경로 입력 요청

```json
{
  "title": "기존 설계 문서",
  "questions": [
    {
      "id": "has_architect",
      "prompt": "기존 architect.md가 있나요?",
      "options": [
        {"id": "yes", "label": "예 - @파일경로로 알려드릴게요"},
        {"id": "no", "label": "아니오 - 신규 기능이에요"}
      ]
    },
    {
      "id": "is_synced",
      "prompt": "architect.md가 최신 상태(bugfix 반영)인가요?",
      "options": [
        {"id": "yes", "label": "예 - 최신 상태"},
        {"id": "no", "label": "아니오 - 동기화 필요"},
        {"id": "unsure", "label": "모르겠음"}
      ]
    }
  ]
}
```

- `is_synced: no` → **architect-sync** 먼저 실행 권장
- `has_architect: no` → 일반 **architect** 스킬로 안내 (신규 기능)

### 0-2. serviceName 추론

입력 파일 경로에서 serviceName 추출:
- 입력: `docs/alert/architect.md`
- 추출: `serviceName = "alert"`

### 0-3. Git Commit 전략

```json
{
  "title": "수정 전 Git Commit",
  "questions": [
    {
      "id": "git_strategy",
      "prompt": "architect.md를 수정하기 전에 현재 상태를 Git commit 하시겠습니까?",
      "options": [
        {"id": "commit", "label": "예 - commit 후 진행 (권장)"},
        {"id": "skip", "label": "아니오 - 바로 진행"}
      ]
    }
  ]
}
```

- `commit` 선택 시:
  ```bash
  git add docs/{serviceName}/architect.md
  git commit -m "backup: architect.md before enhance"
  ```
- `skip` 선택 시: 바로 Phase 1로 진행

---

## Phase 1: 문서 분석

### 1-1. 기존 architect 분석

기존 설계에서 핵심 정보 파악:

| 섹션 | 파악 내용 |
|------|----------|
| Summary | 현재 기능의 Goal, Non-goals |
| Scope | 현재 구현 범위 |
| Architecture | 컴포넌트 구조, DB 스키마 |
| Code Mapping | 현재 파일/클래스/메서드 구조 |
| API Spec | 현재 API 목록 |

### 1-2. 고도화 요구사항 분석

고도화 요구사항에서 파악:

| 항목 | 내용 |
|------|------|
| 추가 기능 | 새로 구현할 기능 |
| 변경 기능 | 기존 기능 수정 |
| 삭제 기능 | 더 이상 필요 없는 기능 |
| 비기능 요구사항 | 성능/보안 개선 등 |

### 1-3. 영향도 분석

```markdown
## 영향도 분석

### 추가 필요
| 항목 | 내용 | 영향 받는 섹션 |
|------|------|--------------|
| 새 API | {엔드포인트} | API Spec, Code Mapping |
| 새 테이블 | {테이블명} | DB Schema, Architecture |

### 수정 필요
| 항목 | 기존 | 변경 후 | 영향 받는 섹션 |
|------|------|--------|--------------|
| API 변경 | {기존 스펙} | {새 스펙} | API Spec |
| 스키마 변경 | {기존 컬럼} | {새 컬럼} | DB Schema |

### 삭제 대상
| 항목 | 이유 |
|------|------|
| {삭제 항목} | {삭제 이유} |
```

---

## Phase 2: 고도화 설계 (서브에이전트 협의)

### 2-A: Domain Architect 호출

**Task 도구**로 `domain-architect` 서브에이전트 호출:

```
Task(
  subagent_type: "domain-architect",
  description: "기존 설계 기반 고도화 설계",
  prompt: """
    기존 architect.md: {기존 설계 내용}
    고도화 요구사항: {고도화 요구사항}

    기존 설계와의 정합성을 유지하면서 고도화 설계안을 제시하라.
    - 기존 패턴/구조 유지
    - 변경 최소화 원칙
    - 마이그레이션 고려
  """
)
```

### 2-B: Best Practice Advisor 호출

**Task 도구**로 `best-practice-advisor` 서브에이전트 호출:

```
Task(
  subagent_type: "best-practice-advisor",
  description: "고도화 베스트 프랙티스",
  prompt: """
    고도화 요구사항: {고도화 요구사항}

    이 고도화에 대한 이상적인 설계안을 제시하라.
    (기존 설계는 모름 - 컨텍스트 없음)
  """
)
```

### 2-C: 협의 (architect 스킬과 동일)

Round 1-2 협의 → 사용자 체크포인트 → 결정

---

## Phase 3: 기존 architect 통합

### 3-1. 통합 전략

| 변경 유형 | 통합 방식 |
|----------|----------|
| 추가 | 해당 섹션에 새 항목 추가 |
| 수정 | 기존 항목을 새 내용으로 교체 |
| 삭제 | 기존 항목에 ~~취소선~~ 또는 삭제 |

### 3-2. 섹션별 통합

**Summary 섹션:**
- Goal 수정/확장
- Non-goals 업데이트

**Scope 섹션:**
- In scope 항목 추가
- Out of scope 재검토

**Architecture Impact 섹션:**
- Components 추가/수정
- DB Schema 추가/수정

**Code Mapping 섹션:**
- 새 파일/클래스/메서드 추가
- 기존 항목 수정 표시

**API Spec 섹션:**
- 새 엔드포인트 추가
- 기존 엔드포인트 수정

**Implementation Plan 섹션:**
- 고도화 구현 단계 추가

### 3-3. 고도화 표시

통합된 내용에 고도화 표시:

```markdown
## 6. API Specification

### 기존 API
(기존 내용 유지)

### 🆕 고도화 API (v2 - {날짜})
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/v1/alerts/batch | POST | 일괄 알림 처리 (고도화) |
```

---

## Phase 4: 품질 게이트 검증

architect 스킬의 Phase 5.5와 동일한 품질 검증 수행:

### 필수 검증 항목

| 항목 | 검증 기준 |
|------|----------|
| 기존 기능 영향 | 기존 API/스키마 호환성 확인 |
| 새 기능 완성도 | 고도화 요구사항 전체 반영 확인 |
| 마이그레이션 | DB 변경 시 마이그레이션 방안 확인 |

---

## Phase 5: 저장 및 완료

### 5-1. architect.md 업데이트

기존 architect.md에 고도화 내용 통합하여 저장.

### 5-2. Sync History 추가

```markdown
---

## Sync History

| 날짜 | 유형 | 출처 | 변경 내용 |
|------|------|------|----------|
| {날짜} | enhance | requirements-v2 | {고도화 요약} |
```

### 5-3. 완료 보고

```markdown
## 고도화 설계 완료

### 요약
| 항목 | 내용 |
|------|------|
| 서비스 | {serviceName} |
| 고도화 요구사항 | {requirements 파일} |
| 변경 섹션 | {섹션 목록} |

### 주요 변경
- **추가**: {추가된 기능/API/테이블}
- **수정**: {수정된 항목}
- **삭제**: {삭제된 항목}

### 파일
- 업데이트됨: `docs/{serviceName}/architect.md`

### 다음 단계
1. architect.md 검토
2. `implement` 스킬로 구현 시작
```

---

# 연계

```
[require-refine] → 기존 requirements.md

(고도화 필요)
        ↓
[require-refine] → requirements-v2.md (고도화 요구사항)
        ↓
[architect-enhance] ← synced architect.md
        ↓
architect.md 업데이트
        ↓
[implement] → 고도화 구현
```

---

# 주의사항

1. **architect-sync 먼저 실행 권장**
   - 기존 architect가 최신 상태여야 정확한 분석 가능

2. **기존 기능 호환성**
   - 고도화가 기존 기능을 깨뜨리지 않는지 확인 필수
   - Breaking change 시 명시적 경고

3. **점진적 고도화**
   - 한 번에 너무 많은 변경은 피함
   - 단계별 고도화 권장

4. **마이그레이션 고려**
   - DB 스키마 변경 시 마이그레이션 방안 필수
   - 데이터 호환성 검증
