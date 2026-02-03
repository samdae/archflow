 # Archflow 콘텐츠 전략

## 데모 + 튜토리얼 통합

| 기존 생각 | 제안 |
|-----------|-------------|
| 데모 영상 따로 | 데모 = 튜토리얼 |
| 튜토리얼 따로 | 예제 코드 = 데모 결과물 |
| 콘텐츠 3개 | 콘텐츠 1개로 통합 |

**장점:**
- 한 번 만들면 두 가지 해결
- 영상과 예제 코드가 일치 (신뢰도 ↑)
- "이 영상 따라하면 이 코드 나옴" → 명확

**보완하면 좋을 점:**
- 영상 타임스탬프를 README에 포함 (0:00 요구사항, 2:30 설계, 5:00 구현...)
- `examples/blog-demo/` 안에 단계별 문서도 같이 두면 금상첨화

---

## README 구조

```
README.md (메인)
├── 데모 영상 임베드
├── 한 줄 소개 + 태그라인
├── 핵심 개념 (3-4문장)
├── Quick Start (5줄 이내)
└── 링크: [한국어 상세 문서](docs/README.ko.md) | [English](docs/README.en.md)

docs/
├── README.ko.md (상세 한국어)
├── README.en.md (상세 영어)
└── ...
```

**장점:**
- 메인 README가 깔끔 (스크롤 압박 없음)
- 첫인상에서 영상 + 핵심만 보임
- 관심 있는 사람만 상세 문서로 이동
- GitHub에서 흔히 쓰는 패턴 (익숙함)

---

## 예제 폴더 구조

```
examples/
└── blog-demo/
    ├── README.md (이 예제 설명, 영상 타임스탬프)
    ├── docs/
    │   ├── spec.md
    │   ├── arch.md
    │   └── trace.md
    └── src/
        └── (생성된 코드)
```

---

## 메인 README 예시

```markdown
# Archflow

**The Design Compiler** — Architecture flows into code

> 설계 문서를 코드로 컴파일합니다. 같은 설계, 같은 코드.

## Demo

[![Archflow Demo](thumbnail.png)](https://youtube.com/...)

*5분 만에 블로그 API 설계부터 구현까지*

## What is Archflow?

- 요구사항 → 설계 → 코드, 문서 하나로 관리
- Multi-Agent Debate으로 설계 품질 확보
- 같은 설계에서 동일한 코드 생성 (재현성 95%+)

## Quick Start

\`\`\`bash
/plugin marketplace add samdae/archflow
/plugin install archflow
/spec → /arch → /check → /build
\`\`\`

## Documentation

- [한국어 문서](docs/README.ko.md)
- [English Documentation](docs/README.en.md)

## Examples

- [Blog API Demo](examples/blog-demo/) - 데모 영상에서 만든 예제
```

---

## 결론

| 항목 | 판단 |
|------|------|
| 데모 + 튜토리얼 통합 | ⭕ 좋음 |
| 예제 코드로 결과물 제공 | ⭕ 좋음 |
| README 분리 (메인 + ko/en) | ⭕ 좋음 |
