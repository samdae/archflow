---
name: Reinforce
description: 기존 문서에 새 정보 보강. Triggers on "reinforce", "보강", "문서 보강", "정보 추가". reverse로 생성된 불완전 문서 보강용.
version: 1.0.0
---

# Reinforce Workflow

reverse로 생성된 불완전한 문서에 새 정보를 추가하여 보강합니다.

## 💡 권장 모델

**Sonnet** 권장 (문서 + 새 정보 병합)

→ 복잡한 추론 필요 시 Opus

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
              ├── requirements.md   # ← 입력/출력
              ├── architect.md      # ← 입력/출력
              └── changelog.md
```

## ⚠️ 사용 시점

- **reverse 후**: 불완전한 문서의 ❓ 항목 보강
- **새 정보 획득 시**: 나중에 알게 된 정보 반영
- **오류 수정 시**: 잘못 추론된 내용 수정

---

## Phase 0: 스킬 진입

### 0-0. 모델 안내 (시작 시 출력)

> 💡 **이 스킬은 Sonnet 모델을 권장합니다.**
> 기존 문서 + 새 정보 병합 작업이므로 고성능 모델 불필요.
> 복잡한 추론이 필요하면 Opus로 재시도.
>
> **입력**: 
> - `docs/{serviceName}/requirements.md`
> - `docs/{serviceName}/architect.md`
> - 보강할 새 정보
>
> **출력**: 업데이트된 requirements.md, architect.md

### 0-1. 문서 입력

```json
{
  "title": "문서 보강 시작",
  "questions": [
    {
      "id": "has_docs",
      "prompt": "보강할 문서가 있나요?",
      "options": [
        {"id": "yes", "label": "예 - @파일경로로 알려드릴게요"},
        {"id": "no", "label": "아니오 - 문서가 없어요"}
      ]
    }
  ]
}
```

- `no` → **reverse** 스킬로 안내
- `yes` → requirements.md, architect.md 경로 입력 요청

### 0-2. serviceName 추론

입력 파일 경로에서 serviceName 추출:
- 입력: `docs/alert/requirements.md`
- 추출: `serviceName = "alert"`

---

## Phase 1: 기존 문서 분석

### 1-1. 문서 로드

requirements.md와 architect.md 읽기

### 1-2. 미확인 항목 파악

문서에서 다음 표시 항목 추출:
- `❓ 확인 필요`
- `❓ 미확인`
- `❓ 추론`
- 확신도 "낮음" 항목
- 빈 섹션

### 1-3. 현재 상태 보고

```markdown
## 현재 문서 상태

### requirements.md
| 섹션 | 상태 |
|------|------|
| Goal | ✅ 확인됨 / ❓ 추론 / ❌ 미확인 |
| Non-goals | {상태} |
| 기능 명세 | {상태} |
| 우선순위 | {상태} |

### architect.md
| 섹션 | 상태 |
|------|------|
| Summary | {상태} |
| Code Mapping | ✅ 추출됨 |
| API Spec | ✅ 추출됨 |
| Risks & Tradeoffs | {상태} |

### 보강 필요 항목
1. {항목 1} - {현재 상태}
2. {항목 2} - {현재 상태}
```

---

## Phase 2: 새 정보 수집

### 2-1. 보강 유형 선택

```json
{
  "title": "어떤 정보를 추가하나요?",
  "questions": [
    {
      "id": "reinforce_type",
      "prompt": "보강할 내용의 유형을 선택하세요",
      "options": [
        {"id": "fill_blank", "label": "미확인 항목 채우기 - ❓ 표시된 항목"},
        {"id": "correct", "label": "오류 수정 - 잘못 추론된 내용 수정"},
        {"id": "add_new", "label": "새 정보 추가 - 추가로 알게 된 정보"},
        {"id": "guided", "label": "가이드 모드 - 하나씩 질문해주세요"}
      ]
    }
  ]
}
```

### 2-2. 유형별 처리

**fill_blank (미확인 항목 채우기):**
```json
{
  "title": "미확인 항목 보강",
  "questions": [
    {
      "id": "item_1",
      "prompt": "{미확인 항목 1}에 대해 알려주세요\n현재 상태: ❓ 확인 필요",
      "options": [
        {"id": "answer", "label": "알려드릴게요"},
        {"id": "skip", "label": "아직 모르겠어요 - 넘기기"}
      ]
    }
  ]
}
```

**correct (오류 수정):**
> "어떤 내용이 잘못되었나요? 수정할 섹션과 올바른 내용을 알려주세요."

**add_new (새 정보 추가):**
> "추가할 정보를 알려주세요. 자유롭게 설명해주시면 적절한 섹션에 반영하겠습니다."

**guided (가이드 모드):**
미확인 항목을 순서대로 질문

---

## Phase 3: 정보 분류

### 3-1. 사용자 입력 분석

사용자가 제공한 정보를 분석하여 분류:

| 정보 유형 | 반영 대상 |
|----------|----------|
| 비즈니스 목적/의도 | requirements.md - Goal, Non-goals |
| 기능 설명/동작 | requirements.md - 기능 명세 |
| 우선순위/중요도 | requirements.md - 우선순위 |
| 기술 결정 이유 | architect.md - Risks & Tradeoffs |
| 구조 변경 | architect.md - Architecture, Code Mapping |
| API 변경 | architect.md - API Spec |

### 3-2. 분류 확인 (애매한 경우)

```json
{
  "title": "정보 분류",
  "questions": [
    {
      "id": "classify",
      "prompt": "입력하신 정보:\n\"{사용자 입력 요약}\"\n\n이 정보는 어디에 반영할까요?",
      "options": [
        {"id": "requirements", "label": "요구사항 (requirements.md)"},
        {"id": "architect", "label": "설계 (architect.md)"},
        {"id": "both", "label": "둘 다"},
        {"id": "auto", "label": "알아서 판단해주세요"}
      ]
    }
  ]
}
```

---

## Phase 4: 문서 업데이트

### 4-1. requirements.md 업데이트 (해당 시)

| 섹션 | 업데이트 방식 |
|------|-------------|
| Goal | 기존 추론 → 확정 (❓ 제거) |
| Non-goals | 빈칸 → 내용 채움 |
| 기능 명세 | 추가/수정 |
| 우선순위 | 빈칸 → 내용 채움 |
| 불명확 항목 | 해결된 항목 제거 |

### 4-2. architect.md 업데이트 (해당 시)

| 섹션 | 업데이트 방식 |
|------|-------------|
| Summary | Goal/Non-goals 확정 |
| Scope | 범위 명확화 |
| Risks & Tradeoffs | 빈칸 → 내용 채움 |
| 기타 | 오류 수정 |

### 4-3. 상태 표시 업데이트

- `❓ 확인 필요` → 내용으로 교체
- `❓ 추론` → `✅ 확인됨`으로 변경 (사용자가 확인한 경우)
- 확신도 "낮음" → "높음"으로 변경 (사용자가 확인한 경우)

### 4-4. 보강 기록 추가

문서 하단에 보강 기록:

```markdown
---

## 보강 기록 (Reinforce History)

| 날짜 | 보강 유형 | 변경 내용 |
|------|----------|----------|
| {날짜} | fill_blank | Goal, Non-goals 확정 |
| {날짜} | add_new | Risks 섹션 추가 |
```

---

## Phase 5: 저장 및 완료

### 5-1. 변경 사항 확인

```markdown
## 변경 예정 사항

### requirements.md
| 섹션 | 변경 전 | 변경 후 |
|------|--------|--------|
| {섹션} | {이전 상태} | {새 내용} |

### architect.md
| 섹션 | 변경 전 | 변경 후 |
|------|--------|--------|
| {섹션} | {이전 상태} | {새 내용} |
```

사용자 확인:
> "이 내용으로 문서를 업데이트합니다. 진행할까요?"

### 5-2. 파일 저장

```
docs/{serviceName}/requirements.md (업데이트)
docs/{serviceName}/architect.md (업데이트)
```

### 5-3. 완료 보고

```markdown
## 문서 보강 완료

### 업데이트 요약
| 문서 | 변경 섹션 | 변경 유형 |
|------|----------|----------|
| requirements.md | {섹션} | {fill_blank/correct/add_new} |
| architect.md | {섹션} | {fill_blank/correct/add_new} |

### 현재 완성도
| 문서 | 이전 | 현재 |
|------|------|------|
| requirements.md | {N}% | {N}% |
| architect.md | {N}% | {N}% |

### 남은 미확인 항목
| 항목 | 문서 |
|------|------|
| {항목} | {문서} |

### 다음 단계
- **추가 보강 필요 시**: `reinforce` 재실행
- **문서 완성됨**: 이후 sync/enhance/implement 사용 가능
```

---

# 연계

```
[reverse] → 불완전한 문서
               │
               ▼
         [reinforce] ←──┐
               │        │ (반복)
               ▼        │
         보강된 문서 ────┘
               │
               ▼ (완성 후)
         sync/enhance/implement 사용 가능
```

---

# 주의사항

1. **reverse 없이 사용 가능**
   - 수동으로 만든 문서에도 사용 가능
   - 단, ❓ 표시가 없으면 "미확인 항목 채우기" 모드 사용 불가

2. **점진적 보강**
   - 한 번에 모든 정보를 채울 필요 없음
   - 알게 될 때마다 reinforce 재실행

3. **코드 다시 안 읽음**
   - reverse와 달리 코드 분석 없음
   - 기존 문서 + 사용자 입력만 처리
   - 토큰 효율적

4. **보강 기록 관리**
   - 모든 보강은 기록으로 남김
   - 추후 변경 이력 추적 가능
