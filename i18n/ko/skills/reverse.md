---
name: Reverse
description: 코드에서 요구사항/설계 문서 역생성. Triggers on "reverse", "리버스", "코드에서 문서", "문서화", "레거시 문서화". 문서 없이 코드만 있는 레거시 프로젝트용.
version: 1.0.0
---

# Reverse Workflow

코드베이스를 분석하여 requirements.md와 architect.md를 역생성합니다.

## 💡 권장 모델

**Opus 필수** - 코드에서 의도 추론 필요

→ 특히 requirements는 "왜"를 추론해야 하므로 고성능 모델 필수

## 🔄 도구 폴백 (Fallback)

| 도구 | 없을 때 대체 방법 |
|------|-----------------|
| **Read/Grep** | 사용자에게 파일 경로 목록 요청 → 필요한 부분 복사-붙여넣기 요청 |
| **Glob** | 사용자에게 파일 목록 요청 |
| **AskQuestion** | "다음 중 선택해주세요: 1) 옵션A 2) 옵션B" 형태로 질문 |
| **Task** | 서브에이전트 없이 순차 분석, 사용자 중간 확인 |

## 📁 문서 구조

```
projectRoot/
  └── docs/
        └── {serviceName}/
              ├── requirements.md   # ← 이 스킬의 출력 1
              ├── architect.md      # ← 이 스킬의 출력 2
              └── changelog.md      # (나중에 bugfix에서 생성)
```

## ⚠️ 주의사항

- **requirements.md는 추론 결과**: 코드에서 "왜"는 직접 보이지 않음. 불완전할 수 있음.
- **architect.md는 추출 결과**: Code Mapping, API Spec, DB Schema는 코드에서 직접 추출.
- **reinforce로 보강 필요**: 불완전한 부분은 reinforce 스킬로 점진적 보강.

---

## Phase 0: 스킬 진입

### 0-0. 모델 안내 (시작 시 출력)

> ⚠️ **이 스킬은 Opus 모델 사용을 강력히 권장합니다.**
> 코드에서 비즈니스 의도를 추론해야 하므로 고성능 모델 필수.
>
> **입력**: serviceName + 코드 범위
> **출력**: 
> - `docs/{serviceName}/requirements.md`
> - `docs/{serviceName}/architect.md`
>
> ⚠️ 생성된 문서는 불완전할 수 있습니다. `reinforce` 스킬로 보강하세요.

### 0-1. 기본 정보 입력

스킬만 호출 시 **AskQuestion으로 필요 정보 안내**:

```json
{
  "title": "레거시 문서화 시작",
  "questions": [
    {
      "id": "service_name",
      "prompt": "서비스 이름을 입력해주세요 (예: alert, issue, worker-assign)",
      "options": [
        {"id": "input", "label": "직접 입력할게요"}
      ]
    }
  ]
}
```

### 0-2. 코드 범위 지정

```json
{
  "title": "분석할 코드 범위",
  "questions": [
    {
      "id": "scope_type",
      "prompt": "어떤 범위의 코드를 분석할까요?",
      "options": [
        {"id": "folder", "label": "특정 폴더 - @폴더경로로 알려드릴게요"},
        {"id": "files", "label": "특정 파일들 - @파일경로로 알려드릴게요"},
        {"id": "pattern", "label": "패턴 지정 - apps/{serviceName}/** 같은 형태"}
      ]
    }
  ]
}
```

### 0-3. 추가 컨텍스트 (선택)

```json
{
  "title": "추가 정보",
  "questions": [
    {
      "id": "has_context",
      "prompt": "이 서비스에 대해 알고 있는 정보가 있나요?",
      "options": [
        {"id": "yes", "label": "예 - 간단히 설명할게요"},
        {"id": "no", "label": "아니오 - 코드만 보고 분석해주세요"}
      ]
    }
  ]
}
```

- `yes` → 사용자가 제공하는 컨텍스트를 분석에 활용
- `no` → 코드만으로 분석

---

## Phase 1: 코드 분석

### 1-1. 파일 구조 파악

지정된 범위에서 파일 목록 수집:

```
Glob으로 파일 목록 수집:
  - *.py, *.ts, *.js 등 소스 파일
  - models/, schemas/, routers/ 등 디렉토리 구조
  - 설정 파일 (config, .env.example 등)
```

### 1-2. 핵심 파일 식별

| 파일 유형 | 추출 대상 |
|----------|----------|
| **라우터/컨트롤러** | API 엔드포인트 |
| **모델/엔티티** | DB 스키마 |
| **서비스/유스케이스** | 비즈니스 로직 |
| **스키마/DTO** | 데이터 구조 |
| **설정 파일** | Tech Stack |

### 1-3. 코드 읽기

핵심 파일들을 Read로 분석:
- 클래스/함수 시그니처
- 주요 로직 흐름
- 의존성 관계
- 주석 (있다면)

---

## Phase 2: 정보 추출

### 2-1. 직접 추출 가능 (architect용)

| 항목 | 추출 방법 |
|------|----------|
| **Tech Stack** | import문, 의존성 파일 분석 |
| **Code Mapping** | 파일/클래스/메서드 구조 |
| **API Spec** | 라우터 데코레이터, 엔드포인트 정의 |
| **DB Schema** | 모델 클래스, 마이그레이션 파일 |
| **Sequence Flow** | 함수 호출 관계 추적 |

### 2-2. 추론 필요 (requirements용)

| 항목 | 추론 방법 |
|------|----------|
| **Goal** | API 이름, 주석, 전체 구조에서 추론 |
| **기능 명세** | 엔드포인트별 동작에서 추론 |
| **데이터 계약** | 스키마/DTO에서 추론 |
| **예외 정책** | try-catch, 에러 핸들러에서 추론 |

### 2-3. 추출 불가 (Q&A로 수집)

| 항목 | 질문 |
|------|------|
| **Non-goals** | "이 서비스가 의도적으로 안 하는 것은?" |
| **우선순위** | "기능 중 가장 중요한 것은?" |
| **트레이드오프 이유** | "왜 이 방식을 선택했나요?" |
| **비즈니스 맥락** | "이 서비스의 사용자는 누구인가요?" |

---

## Phase 3: Q&A 루프 (최대 5회)

### 3-1. 추출 결과 보고

```markdown
## 코드 분석 결과

### 직접 추출된 정보
| 항목 | 내용 |
|------|------|
| Tech Stack | {추출 결과} |
| API 개수 | {N}개 |
| DB 테이블 | {N}개 |
| 주요 컴포넌트 | {목록} |

### 추론된 정보 (검증 필요)
| 항목 | 추론 내용 | 확신도 |
|------|----------|--------|
| Goal | {추론} | 높음/중간/낮음 |
| 주요 기능 | {추론} | 높음/중간/낮음 |

### 파악 못한 정보 (질문 필요)
- {항목 1}
- {항목 2}
```

### 3-2. 질문

```json
{
  "title": "추가 정보 수집 (1/5)",
  "questions": [
    {
      "id": "goal",
      "prompt": "이 서비스의 비즈니스 목적은 무엇인가요?",
      "options": [
        {"id": "answer", "label": "알려드릴게요"},
        {"id": "skip", "label": "모르겠음 - 넘기기"},
        {"id": "confirm", "label": "추론 내용이 맞아요: {추론된 Goal}"}
      ]
    }
  ]
}
```

**반복**: 파악 못한 정보에 대해 질문, 사용자가 "모르겠음" 선택 시 빈칸으로 두고 진행

### 3-3. Q&A 종료 조건

- 모든 핵심 질문 완료
- 사용자가 "이제 됐어요" 선택
- 5회 도달

---

## Phase 4: requirements.md 생성

### 4-1. 템플릿

```markdown
# {serviceName} 요구사항

> ⚠️ 이 문서는 코드에서 역추출되었습니다. `reinforce` 스킬로 보강하세요.

## 1. 개요

### 1.1 서비스명
{serviceName}

### 1.2 도메인
{추론 또는 사용자 입력}

### 1.3 개발 포커스
- [x] Backend
- [ ] Frontend

## 2. 목적

### 2.1 Goal
{추론 또는 사용자 입력 또는 "❓ 확인 필요"}

### 2.2 Non-goals
{사용자 입력 또는 "❓ 확인 필요"}

## 3. 기능 명세

### 3.1 핵심 기능
| 기능 | 설명 | 확신도 |
|------|------|--------|
| {API에서 추론} | {설명} | 높음/중간/낮음 |

### 3.2 상세 기능
{API별 동작에서 추론}

## 4. 데이터 계약

### 4.1 주요 엔티티
| 엔티티 | 필드 | 출처 |
|--------|------|------|
| {모델에서 추출} | {필드 목록} | 코드 |

## 5. 예외/에러 정책

{try-catch, 에러 핸들러에서 추론}

## 6. 불명확 항목

| 항목 | 상태 | 비고 |
|------|------|------|
| {파악 못한 것} | ❓ 확인 필요 | reinforce로 보강 |

## 7. 우선순위

{사용자 입력 또는 "❓ 확인 필요"}

---

## 역추출 정보

| 항목 | 내용 |
|------|------|
| 생성일 | {날짜} |
| 분석 범위 | {코드 범위} |
| 스킬 버전 | reverse 1.0.0 |
```

---

## Phase 5: architect.md 생성

### 5-1. FEATURE_DESIGN_DOC_TEMPLATE 형식으로 생성

기존 architect 스킬의 출력 템플릿과 동일하게 생성하되:

| 섹션 | 상태 |
|------|------|
| Summary | 추론 (Goal/Non-goals) |
| Scope | 추론 |
| Architecture Impact | **추출** (Components, DB Schema) |
| Sequence Diagram | 추론 가능하면 생성 |
| **Code Mapping** | **추출** (핵심) |
| **API Spec** | **추출** (핵심) |
| Implementation Plan | 이미 구현됨 → 생략 또는 현재 구조 기술 |
| Risks & Tradeoffs | 사용자 입력 또는 "❓ 확인 필요" |

### 5-2. 역추출 표시

문서 상단에 표시:

```markdown
> ⚠️ 이 문서는 코드에서 역추출되었습니다.
> - **추출**: Code Mapping, API Spec, DB Schema (신뢰 가능)
> - **추론**: Goal, Scope, Sequence (검증 필요)
> - **미확인**: Risks, Tradeoffs (reinforce로 보강)
```

---

## Phase 6: 저장 및 완료

### 6-1. 파일 저장

```
docs/{serviceName}/requirements.md
docs/{serviceName}/architect.md
```

### 6-2. 완료 보고

```markdown
## 레거시 문서화 완료

### 생성된 문서
| 문서 | 경로 | 완성도 |
|------|------|--------|
| requirements.md | docs/{serviceName}/requirements.md | {N}% |
| architect.md | docs/{serviceName}/architect.md | {N}% |

### 완성도 상세
| 항목 | 상태 |
|------|------|
| Goal | ✅ 확인됨 / ❓ 추론 / ❌ 미확인 |
| Code Mapping | ✅ 추출됨 |
| API Spec | ✅ 추출됨 |
| DB Schema | ✅ 추출됨 |
| Risks | ❓ 미확인 |

### 미확인 항목 (reinforce로 보강 필요)
- {항목 1}
- {항목 2}

### 다음 단계
1. 생성된 문서 검토
2. `reinforce` 스킬로 미확인 항목 보강
3. 보강 완료 후 일반 파이프라인(sync/enhance) 사용 가능
```

---

# 연계

```
[레거시 코드]
      │
      ▼
  [reverse] → requirements.md (불완전)
      │      → architect.md (불완전)
      ▼
  [reinforce] → requirements.md (보강)
      │        → architect.md (보강)
      ▼
   (문서 완성)
      │
      ▼
  이후 sync/enhance/implement 사용 가능
```

---

# 주의사항

1. **requirements는 추론 결과**
   - 코드에서 "왜"는 보이지 않음
   - 확신도 표시로 신뢰도 구분
   - 반드시 검증 필요

2. **architect는 추출 + 추론**
   - Code Mapping, API Spec, DB Schema는 신뢰 가능
   - Goal, Scope, Risks는 추론이므로 검증 필요

3. **reinforce로 점진적 보강**
   - 한 번에 완벽한 문서 기대 금지
   - 추가 정보 획득 시 reinforce로 보강

4. **토큰 주의**
   - 코드 범위가 넓으면 토큰 소비 큼
   - 범위를 적절히 지정
