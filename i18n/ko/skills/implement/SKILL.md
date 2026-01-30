---
name: Implement
description: 설계 문서 기반 자동 구현. Triggers on "구현", "implement", "개발", "코드 구현". architect 스킬의 설계 문서를 순차 실행.
version: 2.0.0
---

# Implement Workflow

설계 문서(architect.md)를 기반으로 자동 구현을 수행합니다.

## 💡 권장 모델

**Sonnet 권장** (비용 효율) / GPT-5.2 Codex 가능

→ 설계 문서가 상세하므로 고성능 모델 불필요. 토큰 소비가 많은 단계라 비용 절감 효과 큼.
→ 새 세션에서 모델 변경 후 실행

## 🔄 도구 폴백 (Fallback)

| 도구 | 없을 때 대체 방법 |
|------|-----------------|
| **Read/Grep** | 사용자에게 파일 경로 목록 요청 → 필요한 부분 복사-붙여넣기 요청 |
| **AskQuestion** | "다음 중 선택해주세요: 1) 옵션A 2) 옵션B 3) 옵션C" 형태로 질문 |
| **Task** | 서브에이전트 없이 단계별 순차 실행, 각 단계 완료 보고 후 다음 진행 |

## 📁 문서 구조

```
projectRoot/
  └── docs/
        └── {serviceName}/
              ├── requirements.md   # require-refine 스킬 출력
              ├── architect.md      # ← 이 스킬의 입력
              └── changelog.md      # bugfix 스킬 출력
```

**serviceName 추론**: 입력 파일 경로 `docs/{serviceName}/architect.md`에서 자동 추출

## 선행 조건

- **architect** 스킬로 생성된 설계 문서 필요
- 설계 문서에 Implementation Plan, Code Mapping, Tech Stack 섹션 필수

## Phase 0: 스킬 진입

### 0-0. 모델 안내 (시작 시 출력)

> 💡 **이 스킬은 Sonnet 또는 GPT-5.2 Codex 모델을 권장합니다.**
> 설계 문서가 상세하므로 고성능 모델이 불필요하며, 토큰 소비가 많아 비용 절감 효과가 큽니다.
> **새 세션에서 모델을 변경한 후 실행하세요.**
>
> **입력**: `docs/{serviceName}/architect.md`

### 0-1. 설계 문서 확인

스킬만 호출 시 (입력 정보 없이) **AskQuestion으로 필요 정보 안내**:

```json
{
  "title": "구현 시작",
  "questions": [
    {
      "id": "has_design",
      "prompt": "설계 문서가 있나요? (docs/{serviceName}/architect.md)",
      "options": [
        {"id": "yes", "label": "예 - @파일경로로 알려드릴게요"},
        {"id": "no", "label": "아니오 - 설계 문서 작성부터 필요해요"}
      ]
    }
  ]
}
```

- `no` → **architect** 스킬로 안내
- `yes` → 파일 경로 입력 요청 → 0-2로 진행

### 0-2. serviceName 추론

입력받은 파일 경로에서 serviceName 추출:
- 입력: `docs/alert/architect.md`
- 추출: `serviceName = "alert"`

### 0-3. 프로젝트 설정 확인

```json
{
  "title": "프로젝트 설정",
  "questions": [
    {
      "id": "orm_usage",
      "prompt": "ORM(Object-Relational Mapping)을 사용하나요?",
      "options": [
        {"id": "yes", "label": "예 - 패키지명 알려드릴게요 (SQLAlchemy, Prisma, TypeORM 등)"},
        {"id": "no", "label": "아니오 - Raw SQL 사용"}
      ]
    },
    {
      "id": "db_type",
      "prompt": "사용하는 데이터베이스는?",
      "options": [
        {"id": "postgresql", "label": "PostgreSQL"},
        {"id": "mysql", "label": "MySQL / MariaDB"},
        {"id": "sqlite", "label": "SQLite"},
        {"id": "mongodb", "label": "MongoDB"},
        {"id": "other", "label": "기타 (직접 입력)"}
      ]
    },
    {
      "id": "db_version",
      "prompt": "DB 버전을 알고 있나요?",
      "options": [
        {"id": "known", "label": "예 - 버전 알려드릴게요"},
        {"id": "project", "label": "모름 - 프로젝트 설정 파일에서 확인"},
        {"id": "unknown", "label": "모름 - 표준 SQL(ANSI) 사용"}
      ]
    },
    {
      "id": "db_schema_change",
      "prompt": "DB 스키마 변경(테이블/컬럼 추가·수정)이 있나요? 있다면 어떻게 적용하나요?",
      "options": [
        {"id": "auto", "label": "앱 실행 시 자동 반영 (ORM 등)"},
        {"id": "migration_tool", "label": "마이그레이션 도구 사용 (Alembic, Flyway, Prisma Migrate 등)"},
        {"id": "manual_sql", "label": "수동 SQL 실행"},
        {"id": "none", "label": "DB 변경 없음"}
      ]
    },
    {
      "id": "commit_strategy",
      "prompt": "Git 커밋 전략은?",
      "options": [
        {"id": "none", "label": "커밋 안함 (기본)"},
        {"id": "per_phase", "label": "단계별 커밋"},
        {"id": "final", "label": "완료 후 한번에 커밋"}
      ]
    },
    {
      "id": "test_strategy",
      "prompt": "테스트 코드 작성은?",
      "options": [
        {"id": "per_feature", "label": "기능별 테스트 파일 작성"},
        {"id": "per_design", "label": "설계 문서에 명시된 경우만"},
        {"id": "none", "label": "테스트 작성 안함"}
      ]
    },
    {
      "id": "dependency_manager",
      "prompt": "새 라이브러리 추가 시 어디에 기록하나요?",
      "options": [
        {"id": "project_default", "label": "프로젝트 기본 설정 파일 (package.json, pyproject.toml, go.mod 등)"},
        {"id": "manual", "label": "수동 관리 / 별도 문서"},
        {"id": "none", "label": "새 의존성 없음"}
      ]
    }
  ]
}
```

**ORM 사용 시**: 패키지명 추가 입력 요청
**DB 버전 알고 있으면**: 버전 추가 입력 요청

**이미 설계 문서가 제공된 경우** → 0-3 프로젝트 설정만 확인 후 Phase 1로 진행

## Phase 0.5: 필수 참조 파일 로드

설계 문서의 **Section 4 (Implementation Plan) > 📂 필수 참조 파일** 확인:

1. 명시된 파일들 **Read 도구로 먼저 로드**
2. 각 파일에서 확인할 패턴 메모:
   - 네이밍 컨벤션
   - 폴더 구조
   - 에러 처리 방식
   - Import 스타일
3. 이 패턴들을 서브에이전트 프롬프트에 포함

**필수 참조 파일이 없으면** → 메인 에이전트가 Code Mapping의 기존 파일 중 대표 파일 3개 자동 선정

---

## Phase 1: 설계 문서 분석 (메인 에이전트)

설계 문서에서 다음 정보 추출:

| 섹션 | 추출 정보 |
|------|----------|
| Tech Stack | 언어, 프레임워크, DB, ORM, 서드파티 |
| Implementation Plan | 단계별 작업 목록 |
| Code Mapping | 파일별 역할, 신규/수정 구분, **메서드명/호출위치** |
| Architecture Impact | DB 변경사항 (마이그레이션 필요 여부) |
| API Specification | 엔드포인트 상세 |

### 1-1. 공통 파일 식별

Code Mapping에서 여러 단계에 영향을 주는 파일 식별:
- `shared/`, `common/`, `utils/`, `lib/` 경로의 파일
- 여러 단계에서 참조되는 파일

→ 이 파일들은 **가장 먼저 처리**하거나 **단계 0**으로 분리

### 1-2. 의존성 그래프 생성

```
예시:
0. shared/공통 (가장 먼저)
1. 모델/엔티티 (독립)
2. Repository/DAO (모델 의존)
3. Service (Repository 의존)
4. API/Controller (Service 의존)
5. 외부 연동 (독립 or API 의존)
```

### 1-3. 서브에이전트 호출 계획 수립

| 단계 | 실행 방식 | 이유 |
|------|----------|------|
| 의존성 없는 단계들 | 병렬 호출 가능 | 속도 향상 |
| 의존성 있는 단계들 | 순차 호출 | 선행 결과 필요 |

### 1-4. 마이그레이션 감지

DB 변경사항 있으면 Phase 4에서 안내할 내용 기록:
- 신규 테이블
- 필드 추가/삭제
- 인덱스 변경

---

## Phase 2: 서브에이전트 기반 실행

### 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│  메인 에이전트 (오케스트레이터)                               │
│  - 단계 순서 관리                                            │
│  - 서브에이전트 호출                                         │
│  - 결과 수집                                                │
│  - 문제 발생 시 사용자 개입 요청                              │
└─────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│  각 단계별 서브에이전트 (Task 도구 사용)                       │
│  - subagent_type: "generalPurpose"                          │
│  - 독립 컨텍스트로 실행                                      │
│  - 결과만 메인에 반환                                        │
└─────────────────────────────────────────────────────────────┘
```

### 2-1. 서브에이전트 호출 패턴

각 단계마다 Task 도구로 서브에이전트 호출:

```
Task(
  subagent_type: "generalPurpose",
  description: "단계 N: {단계명}",
  prompt: """
    ## 구현 태스크

    ### 단계 정보
    - 단계명: {Implementation Plan에서 추출}
    - 목표: {단계 설명}

    ### Tech Stack
    - Language: {언어}
    - Framework: {프레임워크}
    - DB: {DB 종류} {버전}
    - ORM: {ORM 패키지명 또는 "Raw SQL"}

    ### Code Mapping (이 단계에서 다룰 파일)
    **설계 문서 Section 3 상세 형식 그대로 전달:**
    | Feature | File | Class | Method | Action |
    |---------|------|-------|--------|--------|
    | {기능} | {파일경로} | {클래스명} | {메서드명} | {호출위치 및 추가코드} |

    ⚠️ 메서드명과 호출 위치가 명시되어 있으면 반드시 해당 위치에 구현할 것

    ### 설계 스펙
    {API Spec, Sequence Diagram 등 관련 부분}

    ### 이미 생성된 파일 (참조용)
    {이전 단계에서 생성된 파일 목록}

    ### 📂 필수 참조 패턴 (Phase 0.5에서 추출)
    **참조 파일**: {필수 참조 파일 경로}
    **적용할 패턴**:
    - 네이밍: {파악된 네이밍 규칙}
    - 구조: {파악된 코드 구조}
    - 에러 처리: {파악된 에러 처리 방식}

    ### 프로젝트 설정
    - 테스트: {test_strategy}
    - 커밋: {commit_strategy}

    ### 구현 규칙 (필수 준수)

    #### ⚠️ 1. 기존 파일 먼저 읽기 (최우선)
    - 수정 대상 파일이 이미 존재하면 **반드시 먼저 Read로 전체 내용 파악**
    - 신규 파일이라도 **같은 디렉토리의 유사 파일 1개 이상 Read**
    - 읽기 없이 바로 Write/Edit 금지

    #### ⚠️ 2. 유사 코드 패턴 탐색 및 복제
    - 프로젝트 내 **유사 기능 구현체 Grep으로 탐색**
    - 찾은 패턴의 **네이밍, 구조, 에러 처리 방식 그대로 복제**
    - 예: Repository 추가 시 → 기존 Repository 파일 패턴 따라가기
    - 예: API 추가 시 → 기존 라우터 파일 구조 따라가기

    #### 3. 일반 규칙
    - Lint 오류 발생 시 자동 수정 (최대 3회)
    - 완료 후 생성/수정된 파일 목록 반환

    ### 반환 형식
    완료 후 다음 형식으로 보고:
    - created_files: [생성된 파일 경로]
    - modified_files: [수정된 파일 경로]
    - status: success | failed
    - error: (실패 시 오류 내용)
  """
)
```

### 2-2. 단계별 실행 흐름

```
메인 에이전트:
  for each 단계 in Implementation Plan:
    1. 서브에이전트 호출 (Task)
    2. 결과 수신 대기
    3. 결과 확인:
       - success → 다음 단계
       - failed → Phase 2-4 (개입 요청)
    4. 커밋 전략이 "per_phase"면 커밋
    5. 생성된 파일 목록 누적 (다음 단계에 전달용)
```

### 2-3. 병렬 실행 (의존성 없는 단계)

의존성 그래프 분석 결과, 병렬 가능한 단계는 동시 호출:

```
예시:
- 단계 1 (모델) + 단계 5 (외부 연동 분석) → 병렬 가능
- 단계 2 (Repository) → 단계 1 완료 후
- 단계 3 (Service) → 단계 2 완료 후
```

**주의**: 같은 파일 수정 시 충돌 방지를 위해 순차 실행

---

## Phase 2-4: 문제 발생 시 개입 요청

서브에이전트가 `status: failed` 반환 시, 메인 에이전트가 사용자에게 개입 요청.

**개입 조건:**
- 서브에이전트 3회 재시도 후에도 실패
- 기존 코드와 설계 충돌 발견
- 설계 문서에 명시되지 않은 결정 필요

```json
{
  "title": "구현 중 문제 발생 (단계 N: {단계명})",
  "questions": [
    {
      "id": "resolution",
      "prompt": "[서브에이전트 오류 내용]\n\n어떻게 처리할까요?",
      "options": [
        {"id": "retry", "label": "다시 시도 (힌트 추가)"},
        {"id": "option_a", "label": "[해결책 A]"},
        {"id": "option_b", "label": "[해결책 B]"},
        {"id": "skip", "label": "이 단계 건너뛰기"},
        {"id": "stop", "label": "구현 중단"}
      ]
    }
  ]
}
```

**retry 선택 시**: 사용자가 추가 힌트 입력 → 서브에이전트 재호출

## Phase 3: 구현 검증 (메인 에이전트)

모든 서브에이전트 완료 후, Code Mapping 기준으로 구현 여부 검증.

### 3-1. 검증 방법

설계 문서의 Code Mapping 각 항목에 대해:

1. **Grep 도구**로 메서드/클래스 존재 여부 검색
   - 패턴: 메서드명 또는 클래스명
   - 대상: 해당 파일 경로

2. **존재 확인 시** → Read 범위 결정:
   - **검증용 (존재 확인)**: 해당 라인부터 30줄 읽기
   - **수정용 (보완 필요 시)**: 관련 함수/클래스 기준 **상하 200줄** 또는 **파일 전체**(500줄 미만 시)
   - 설계 의도와 대략 일치하는지 확인

   ⚠️ **수정 시에는 30줄만 보고 감으로 수정 금지** - 스타일/에러 처리/DI/유틸 사용 방식 파악 필수

3. **미존재 또는 불일치 시** → 해당 항목 보완 구현

### 3-2. 검증 체크리스트

| 검증 대상 | 방법 | 기준 |
|----------|------|------|
| 메서드 존재 | Grep | 메서드명 매칭 |
| 클래스 존재 | Grep | 클래스명 매칭 |
| 기본 구조 (검증) | Read 30줄 | 설계 의도와 대략 일치 |
| 수정 시 컨텍스트 | Read 200줄/전체 | 스타일, 에러 처리, DI 파악 |

### 3-3. 검증 완료 조건

- Code Mapping의 **모든 항목** 존재 확인
- 누락 발견 시 보완 완료
- 전부 확인 후 → Phase 4로 진행

---

## Phase 4: 완료 보고 (메인 에이전트)

검증 완료 후, 결과 종합하여 보고.

### 4-1. 결과 수집

각 서브에이전트로부터 수집:
- `created_files`: 생성된 파일 목록
- `modified_files`: 수정된 파일 목록
- `status`: 성공/실패

### 4-2. 보고 내용

```markdown
## 구현 완료 보고

### 실행 요약
| 단계 | 상태 | 생성 파일 | 수정 파일 |
|------|------|----------|----------|
| 1. 모델 | ✅ | 2 | 0 |
| 2. Repository | ✅ | 1 | 1 |
| ... | ... | ... | ... |

### 생성된 파일
- `path/to/new_file` - 설명

### 수정된 파일
- `path/to/existing_file` - 변경 내용

### DB 마이그레이션
(프로젝트 설정에 따라)

**마이그레이션 도구 사용 시:**
도구별 명령어 안내

**수동 SQL 실행 시:**
\`\`\`sql
-- 신규 테이블: {테이블명}
CREATE TABLE {테이블명} (
  -- 설계 문서 Section 2 기반 + {db_type} 문법으로 생성
);

-- 기존 테이블 수정
ALTER TABLE {테이블명} ...;

-- 인덱스
CREATE INDEX ...;
\`\`\`

### 의존성 변경
(프로젝트 설정에 따라)
- `package_name` 추가 필요 → 프로젝트 설정 파일에 기록

### 남은 수동 작업
- [ ] 환경변수 설정 (있다면)
- [ ] 테스트 실행
- [ ] FE 연동 확인

### Git 커밋
(커밋 전략에 따라)
- 커밋됨 / 커밋 안됨

### 다음 단계 안내
> ✅ **구현 완료**
>
> 버그 발생 시 `bugfix` 스킬을 **Debug 모드**에서 실행하세요.
> 문서 경로: `docs/{serviceName}/requirements.md`, `architect.md`
```

### 커밋 처리

| 전략 | 처리 |
|------|------|
| none | 커밋 안함, 사용자가 직접 |
| per_phase | 이미 단계별로 완료됨 |
| final | 전체 변경사항 한번에 커밋 |

---

# 연계

```
[require-refine] → docs/{serviceName}/requirements.md
        ↓
[architect] → docs/{serviceName}/architect.md
        ↓
[implement] → 구현
        ↓
(버그 발생)
        ↓
[bugfix] → docs/{serviceName}/changelog.md
```

---

# 주의사항

1. **자동 실행되는 것들**
   - 파일 생성/수정
   - Lint 오류 수정
   - 커밋 (선택 시)

2. **자동 실행되지 않는 것들 (안전상)**
   - DB 마이그레이션 실행
   - 패키지 설치
   - 서버 재시작
   - 테스트 실행

3. **중단 조건**
   - 사용자가 "구현 중단" 선택
   - 치명적 오류 (파일 시스템 오류 등)
   - 설계 문서 파싱 실패
