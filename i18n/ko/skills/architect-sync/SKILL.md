---
name: Architect Sync
description: changelog/고도화 결과를 architect 문서에 동기화. Triggers on "architect-sync", "아키텍처 동기화", "설계 동기화". bugfix/architect-enhance 후 실행.
version: 1.0.0
---

# Architect Sync Workflow

changelog의 설계 영향 항목 또는 고도화 설계를 기존 architect.md에 동기화합니다.

## 💡 권장 모델

**Sonnet** 권장 (문서 병합 작업)

→ 복잡한 충돌 발생 시 Opus 권장

## 🔄 도구 폴백 (Fallback)

| 도구 | 없을 때 대체 방법 |
|------|-----------------|
| **Read** | 사용자에게 파일 내용 복사-붙여넣기 요청 |
| **AskQuestion** | "다음 중 선택해주세요: 1) 옵션A 2) 옵션B" 형태로 질문 |

## 📁 문서 구조

```
projectRoot/
  └── docs/
        └── {serviceName}/
              ├── requirements.md
              ├── architect.md      # ← 동기화 대상
              └── changelog.md      # ← 입력 (설계 영향 있음 항목)
```

## ⚠️ 실행 시점

다음 상황에서 실행:
1. **bugfix 완료 후** - changelog에 "설계 영향: 있음" 항목이 추가됐을 때
2. **architect-enhance 완료 후** - 고도화 설계를 기존 architect에 통합할 때

---

## Phase 0: 스킬 진입

### 0-0. 모델 안내

> 💡 **이 스킬은 Sonnet 모델을 권장합니다.**
> 문서 병합 작업이므로 고성능 모델 불필요.
>
> **입력**: changelog.md (설계 영향 항목) 또는 고도화 설계 결과
> **출력**: 업데이트된 architect.md

### 0-1. 동기화 유형 확인

```json
{
  "title": "Architect 동기화",
  "questions": [
    {
      "id": "sync_type",
      "prompt": "어떤 내용을 동기화하나요?",
      "options": [
        {"id": "bugfix", "label": "버그 수정 - changelog의 설계 영향 항목"},
        {"id": "enhance", "label": "기능 고도화 - architect-enhance 결과"}
      ]
    }
  ]
}
```

### 0-2. 파일 입력 받기

**bugfix 선택 시:**
```json
{
  "title": "파일 입력",
  "questions": [
    {
      "id": "has_changelog",
      "prompt": "changelog 파일 경로를 알려주세요 (docs/{serviceName}/changelog.md)",
      "options": [
        {"id": "yes", "label": "예 - @파일경로로 알려드릴게요"}
      ]
    },
    {
      "id": "has_architect",
      "prompt": "architect 파일 경로를 알려주세요 (docs/{serviceName}/architect.md)",
      "options": [
        {"id": "yes", "label": "예 - @파일경로로 알려드릴게요"}
      ]
    }
  ]
}
```

**enhance 선택 시:**
> "고도화 설계 결과와 기존 architect.md 경로를 알려주세요."

### 0-3. serviceName 추론

입력 파일 경로에서 serviceName 추출:
- 입력: `docs/alert/changelog.md`
- 추출: `serviceName = "alert"`

---

## Phase 1: 변경 사항 분석

### 1-1. bugfix 동기화 (changelog → architect)

changelog에서 **"설계 영향: 있음"** 항목만 필터링:

```
changelog 분석:
  for each 항목:
    if 설계 영향 == "있음":
      → 동기화 대상에 추가
      → 영향 받은 섹션 파악 (Code Mapping, API Spec, DB Schema 등)
```

### 1-2. enhance 동기화 (고도화 결과 → architect)

고도화 설계 결과에서 변경/추가 사항 파악:
- 새로운 API
- 수정된 API
- 새로운 컴포넌트
- DB 스키마 변경

### 1-3. 변경 사항 보고

```markdown
## 동기화 대상 분석

### 변경 항목
| 출처 | 영향 섹션 | 변경 내용 |
|------|----------|----------|
| {changelog 날짜 또는 enhance} | {섹션명} | {변경 설명} |

### architect.md 수정 계획
| 섹션 | 현재 상태 | 변경 후 |
|------|----------|--------|
| {섹션명} | {기존 내용 요약} | {변경 후 내용 요약} |
```

### 1-4. Git Commit 전략

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
  git commit -m "backup: architect.md before sync"
  ```
- `skip` 선택 시: 바로 Phase 2로 진행

---

## Phase 2: 충돌 검증

### 2-1. 충돌 검사

기존 architect 내용과 새 변경 사항 비교:

| 충돌 유형 | 예시 | 처리 |
|----------|------|------|
| 동일 섹션 중복 수정 | API Spec에 같은 엔드포인트 | 사용자 선택 요청 |
| 논리적 불일치 | 삭제된 API를 참조 | 경고 후 사용자 확인 |
| 없음 | 새 항목 추가 | 자동 진행 |

### 2-2. 충돌 발생 시

```json
{
  "title": "동기화 충돌 발생",
  "questions": [
    {
      "id": "conflict_resolution",
      "prompt": "기존 내용과 새 변경 사항이 충돌합니다.\n\n기존: {기존 내용}\n신규: {새 내용}\n\n어떻게 처리할까요?",
      "options": [
        {"id": "keep_old", "label": "기존 유지 - 새 변경 무시"},
        {"id": "use_new", "label": "새 내용으로 교체"},
        {"id": "merge", "label": "병합 - 둘 다 반영"},
        {"id": "manual", "label": "수동 처리 - 직접 수정할게요"}
      ]
    }
  ]
}
```

---

## Phase 3: architect.md 업데이트

### 3-1. 섹션별 업데이트

| 섹션 | 업데이트 방식 |
|------|-------------|
| Code Mapping | 행 추가/수정/삭제 |
| API Spec | 엔드포인트 추가/수정 |
| DB Schema | 테이블/컬럼 정의 수정 |
| Sequence Diagram | 다이어그램 수정 |
| Risks & Tradeoffs | 새 트레이드오프 추가 |

### 3-2. 동기화 기록 추가

architect.md 하단에 동기화 기록 섹션 추가/업데이트:

```markdown
---

## Sync History

| 날짜 | 유형 | 출처 | 변경 내용 |
|------|------|------|----------|
| {날짜} | bugfix | changelog {날짜} | {변경 요약} |
| {날짜} | enhance | requirements v2 | {변경 요약} |
```

### 3-3. 저장

업데이트된 architect.md 저장 (기존 파일 덮어쓰기)

---

## Phase 4: 완료 보고

```markdown
## Architect 동기화 완료

### 동기화 요약
| 항목 | 내용 |
|------|------|
| 유형 | bugfix / enhance |
| 출처 | {changelog 날짜 또는 requirements} |
| 수정 섹션 | {섹션 목록} |

### 변경 내역
| 섹션 | 변경 유형 | 변경 내용 |
|------|----------|----------|
| {섹션} | 추가/수정/삭제 | {내용} |

### 파일
- 업데이트됨: `docs/{serviceName}/architect.md`

### 다음 단계
- **구현 필요 시**: `implement` 스킬 실행
- **추가 수정 필요 시**: architect.md 직접 편집
```

---

# 연계

```
[bugfix] → changelog (설계 영향 있음)
                ↓
         [architect-sync] → architect 업데이트
                ↓
           [implement] (필요 시)

[architect-enhance] → 고도화 설계
                ↓
         [architect-sync] → architect 업데이트
                ↓
           [implement]
```

---

# 주의사항

1. **설계 영향 없는 bugfix는 동기화 불필요**
   - changelog의 "설계 영향: 없음" 항목은 무시

2. **기존 내용 보존**
   - 충돌 없는 섹션은 그대로 유지
   - 변경된 섹션만 업데이트

3. **Sync History 관리**
   - 모든 동기화는 기록으로 남김
   - 추후 변경 이력 추적 가능
