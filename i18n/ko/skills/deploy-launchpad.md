---
name: Deploy Launchpad
description: 배포에 필요한 정보를 Q&A로 수집하여 Launchpad 문서 생성. Triggers on "deploy-launchpad", "배포 문서", "배포 설정", "launchpad". LLM이 이 문서를 보고 배포 안내 가능.
version: 1.0.0
---

# Deploy Launchpad Workflow

배포에 필요한 모든 정보를 Q&A로 수집하여 Launchpad 문서를 생성합니다.

## 💡 권장 모델

**Sonnet** (문서 작성)

## 🔄 도구 폴백 (Fallback)

| 도구 | 없을 때 대체 방법 |
|------|-----------------|
| **AskQuestion** | "다음 중 선택해주세요" 형태로 질문 |
| **Read** | 사용자에게 파일 내용 복사 요청 |

## 📁 문서 구조

```
projectRoot/
  └── docs/
        └── {serviceName}/
              └── deploy-launchpad.md   # ← 이 스킬의 출력
```

## ⚠️ 시크릿 주의

**실제 시크릿 값(비밀번호, API 키 등)은 문서에 담지 마세요.**
→ "어디서 가져오는지" 경로/방법만 기록

---

## Phase 0: 스킬 진입

### 0-1. 서비스 정보

```json
{
  "title": "배포 Launchpad 생성",
  "questions": [
    {
      "id": "service_name",
      "prompt": "서비스명을 입력해주세요 (예: report, alert, issue)",
      "options": [
        {"id": "input", "label": "직접 입력할게요"}
      ]
    },
    {
      "id": "service_port",
      "prompt": "서비스 포트는?",
      "options": [
        {"id": "input", "label": "직접 입력할게요 (예: 8080)"}
      ]
    }
  ]
}
```

### 0-2. 기존 문서 확인

```json
{
  "title": "기존 Launchpad",
  "questions": [
    {
      "id": "existing_doc",
      "prompt": "이미 deploy-launchpad.md가 있나요?",
      "options": [
        {"id": "yes", "label": "예 - 업데이트할게요"},
        {"id": "no", "label": "아니오 - 새로 만들게요"}
      ]
    }
  ]
}
```

---

## Phase 1: 인프라 정보 수집

### 1-1. 인프라 유형

```json
{
  "title": "인프라 유형",
  "questions": [
    {
      "id": "infra_type",
      "prompt": "배포 인프라는 무엇인가요?",
      "options": [
        {"id": "k8s", "label": "Kubernetes (AKS, EKS, GKE, 자체 클러스터)"},
        {"id": "docker", "label": "Docker / Docker Compose"},
        {"id": "vm", "label": "VM / 베어메탈"},
        {"id": "serverless", "label": "Serverless (Lambda, Cloud Functions)"},
        {"id": "other", "label": "기타"}
      ]
    }
  ]
}
```

### 1-2. Kubernetes 선택 시

```json
{
  "title": "Kubernetes 설정",
  "questions": [
    {
      "id": "k8s_provider",
      "prompt": "K8s 제공자는?",
      "options": [
        {"id": "aks", "label": "Azure AKS"},
        {"id": "eks", "label": "AWS EKS"},
        {"id": "gke", "label": "Google GKE"},
        {"id": "self", "label": "자체 클러스터"},
        {"id": "other", "label": "기타"}
      ]
    },
    {
      "id": "k8s_namespace",
      "prompt": "Namespace는? (환경별로 다르면 나중에 환경별 섹션에서 입력)",
      "options": [
        {"id": "input", "label": "직접 입력할게요"}
      ]
    },
    {
      "id": "k8s_manifest",
      "prompt": "Manifest 파일 위치는? (예: k8s/, deploy/)",
      "options": [
        {"id": "input", "label": "직접 입력할게요"}
      ]
    }
  ]
}
```

### 1-3. Docker 선택 시

```json
{
  "title": "Docker 설정",
  "questions": [
    {
      "id": "dockerfile_path",
      "prompt": "Dockerfile 위치는?",
      "options": [
        {"id": "input", "label": "직접 입력할게요 (예: ./Dockerfile)"}
      ]
    },
    {
      "id": "compose_path",
      "prompt": "docker-compose.yml 위치는? (없으면 없음)",
      "options": [
        {"id": "input", "label": "직접 입력할게요"},
        {"id": "none", "label": "없음"}
      ]
    },
    {
      "id": "registry",
      "prompt": "컨테이너 레지스트리는?",
      "options": [
        {"id": "acr", "label": "Azure Container Registry"},
        {"id": "ecr", "label": "AWS ECR"},
        {"id": "gcr", "label": "Google GCR"},
        {"id": "dockerhub", "label": "Docker Hub"},
        {"id": "other", "label": "기타"}
      ]
    }
  ]
}
```

### 1-4. VM 선택 시

```json
{
  "title": "VM 설정",
  "questions": [
    {
      "id": "access_method",
      "prompt": "서버 접속 방법은?",
      "options": [
        {"id": "ssh", "label": "SSH"},
        {"id": "bastion", "label": "Bastion Host 경유"},
        {"id": "vpn", "label": "VPN 필요"},
        {"id": "other", "label": "기타"}
      ]
    },
    {
      "id": "deploy_method",
      "prompt": "배포 방법은?",
      "options": [
        {"id": "rsync", "label": "rsync / scp"},
        {"id": "git_pull", "label": "git pull"},
        {"id": "ansible", "label": "Ansible"},
        {"id": "other", "label": "기타"}
      ]
    }
  ]
}
```

---

## Phase 2: CI/CD 정보 수집

### 2-1. CI/CD 유무

```json
{
  "title": "CI/CD",
  "questions": [
    {
      "id": "has_cicd",
      "prompt": "CI/CD 파이프라인이 있나요?",
      "options": [
        {"id": "yes", "label": "예 - 설정 알려드릴게요"},
        {"id": "no", "label": "아니오 - 수동 배포"}
      ]
    }
  ]
}
```

### 2-2. CI/CD 있을 때

```json
{
  "title": "CI/CD 설정",
  "questions": [
    {
      "id": "cicd_tool",
      "prompt": "CI/CD 도구는?",
      "options": [
        {"id": "github_actions", "label": "GitHub Actions"},
        {"id": "gitlab_ci", "label": "GitLab CI"},
        {"id": "jenkins", "label": "Jenkins"},
        {"id": "argocd", "label": "ArgoCD"},
        {"id": "azure_devops", "label": "Azure DevOps"},
        {"id": "other", "label": "기타"}
      ]
    },
    {
      "id": "cicd_file",
      "prompt": "파이프라인 설정 파일 위치는?",
      "options": [
        {"id": "input", "label": "직접 입력할게요 (예: .github/workflows/)"}
      ]
    },
    {
      "id": "trigger",
      "prompt": "배포 트리거는?",
      "options": [
        {"id": "push_main", "label": "main/master 브랜치 push"},
        {"id": "tag", "label": "태그 생성"},
        {"id": "manual", "label": "수동 트리거"},
        {"id": "other", "label": "기타"}
      ]
    }
  ]
}
```

---

## Phase 3: 환경별 설정 수집

### 3-1. 환경 구분

```json
{
  "title": "환경 구분",
  "questions": [
    {
      "id": "environments",
      "prompt": "어떤 환경이 있나요?",
      "options": [
        {"id": "dev_prod", "label": "dev, prod"},
        {"id": "dev_stg_prod", "label": "dev, staging, prod"},
        {"id": "single", "label": "단일 환경"},
        {"id": "other", "label": "기타 (직접 입력)"}
      ],
      "allow_multiple": true
    }
  ]
}
```

### 3-2. 환경별 상세 (환경마다 반복)

```json
{
  "title": "{환경명} 설정",
  "questions": [
    {
      "id": "env_url",
      "prompt": "{환경명} 서비스 URL은?",
      "options": [
        {"id": "input", "label": "직접 입력할게요"}
      ]
    },
    {
      "id": "env_config",
      "prompt": "{환경명} 설정 파일 위치는? (.env, config 등)",
      "options": [
        {"id": "input", "label": "직접 입력할게요"}
      ]
    },
    {
      "id": "env_specific",
      "prompt": "{환경명}에만 있는 특별한 설정이 있나요?",
      "options": [
        {"id": "yes", "label": "예 - 설명할게요"},
        {"id": "no", "label": "아니오"}
      ]
    }
  ]
}
```

---

## Phase 4: 빌드/배포 명령어 수집

### 4-1. 빌드

```json
{
  "title": "빌드",
  "questions": [
    {
      "id": "build_command",
      "prompt": "빌드 명령어는? (없으면 없음)",
      "options": [
        {"id": "input", "label": "직접 입력할게요 (예: docker build -t ...)"},
        {"id": "none", "label": "빌드 단계 없음"}
      ]
    },
    {
      "id": "build_prereq",
      "prompt": "빌드 전 필요한 작업이 있나요?",
      "options": [
        {"id": "yes", "label": "예 - 설명할게요"},
        {"id": "no", "label": "아니오"}
      ]
    }
  ]
}
```

### 4-2. 배포

```json
{
  "title": "배포",
  "questions": [
    {
      "id": "deploy_command",
      "prompt": "배포 명령어는?",
      "options": [
        {"id": "input", "label": "직접 입력할게요 (예: kubectl apply -f ...)"}
      ]
    },
    {
      "id": "deploy_prereq",
      "prompt": "배포 전 필요한 작업이 있나요? (DB 마이그레이션 등)",
      "options": [
        {"id": "yes", "label": "예 - 설명할게요"},
        {"id": "no", "label": "아니오"}
      ]
    }
  ]
}
```

### 4-3. 롤백

```json
{
  "title": "롤백",
  "questions": [
    {
      "id": "rollback_command",
      "prompt": "롤백 방법은?",
      "options": [
        {"id": "input", "label": "직접 입력할게요 (예: kubectl rollout undo ...)"},
        {"id": "unknown", "label": "잘 모르겠어요"}
      ]
    }
  ]
}
```

---

## Phase 5: 검증/모니터링 정보 수집

### 5-1. 검증

```json
{
  "title": "검증",
  "questions": [
    {
      "id": "health_check",
      "prompt": "헬스체크 URL은?",
      "options": [
        {"id": "input", "label": "직접 입력할게요 (예: /health, /api/health)"},
        {"id": "none", "label": "없음"}
      ]
    },
    {
      "id": "smoke_test",
      "prompt": "배포 후 확인할 테스트가 있나요?",
      "options": [
        {"id": "yes", "label": "예 - 설명할게요"},
        {"id": "no", "label": "아니오"}
      ]
    }
  ]
}
```

### 5-2. 모니터링

```json
{
  "title": "모니터링",
  "questions": [
    {
      "id": "monitoring_url",
      "prompt": "모니터링 대시보드 URL이 있나요?",
      "options": [
        {"id": "input", "label": "직접 입력할게요"},
        {"id": "none", "label": "없음"}
      ]
    },
    {
      "id": "log_access",
      "prompt": "로그 확인 방법은?",
      "options": [
        {"id": "input", "label": "직접 입력할게요 (예: kubectl logs, CloudWatch)"},
        {"id": "unknown", "label": "잘 모르겠어요"}
      ]
    }
  ]
}
```

---

## Phase 6: 시크릿/설정 관리

### 6-1. 시크릿 관리

```json
{
  "title": "시크릿 관리",
  "questions": [
    {
      "id": "secret_method",
      "prompt": "시크릿 관리 방법은?",
      "options": [
        {"id": "k8s_secret", "label": "K8s Secret"},
        {"id": "vault", "label": "HashiCorp Vault"},
        {"id": "aws_sm", "label": "AWS Secrets Manager"},
        {"id": "azure_kv", "label": "Azure Key Vault"},
        {"id": "env_file", "label": ".env 파일"},
        {"id": "other", "label": "기타"}
      ]
    },
    {
      "id": "secret_location",
      "prompt": "시크릿 설정 위치/방법은? (실제 값은 적지 마세요)",
      "options": [
        {"id": "input", "label": "직접 입력할게요"}
      ]
    }
  ]
}
```

---

## Phase 7: 주의사항/체크리스트

### 7-1. 배포 전 체크리스트

```json
{
  "title": "배포 전 체크리스트",
  "questions": [
    {
      "id": "pre_deploy_checklist",
      "prompt": "배포 전 확인해야 할 항목이 있나요?",
      "options": [
        {"id": "yes", "label": "예 - 알려드릴게요"},
        {"id": "no", "label": "특별히 없음"}
      ]
    }
  ]
}
```

### 7-2. 주의사항

```json
{
  "title": "주의사항",
  "questions": [
    {
      "id": "cautions",
      "prompt": "배포 시 주의사항이 있나요?",
      "options": [
        {"id": "yes", "label": "예 - 알려드릴게요"},
        {"id": "no", "label": "특별히 없음"}
      ]
    }
  ]
}
```

---

## Phase 8: 문서 생성

### 8-1. 템플릿

```markdown
# {serviceName} 배포 Launchpad

> 이 문서는 LLM이 배포를 안내할 때 참고하는 문서입니다.
> 실제 시크릿 값은 포함되어 있지 않습니다.

## 1. 서비스 정보

| 항목 | 값 |
|------|-----|
| 서비스명 | {serviceName} |
| 포트 | {port} |
| 저장소 | {repo_url} |

---

## 2. 인프라

### 2.1 유형
{infra_type} ({provider})

### 2.2 설정
| 항목 | 값 |
|------|-----|
| {인프라별 설정...} | |

---

## 3. CI/CD

### 3.1 도구
{cicd_tool 또는 "수동 배포"}

### 3.2 파이프라인
- 설정 파일: {cicd_file}
- 트리거: {trigger}

---

## 4. 환경별 설정

### 4.1 {환경명}
| 항목 | 값 |
|------|-----|
| URL | {url} |
| 설정 파일 | {config_path} |
| 특이사항 | {specific} |

(환경별 반복)

---

## 5. 빌드

### 5.1 사전 작업
{prereq 또는 "없음"}

### 5.2 빌드 명령어
```bash
{build_command}
```

---

## 6. 배포

### 6.1 사전 작업
{prereq 또는 "없음"}

### 6.2 배포 명령어
```bash
{deploy_command}
```

### 6.3 롤백 명령어
```bash
{rollback_command}
```

---

## 7. 검증

### 7.1 헬스체크
- URL: {health_check_url}
- 예상 응답: 200 OK

### 7.2 Smoke Test
{smoke_test 또는 "없음"}

---

## 8. 모니터링

| 항목 | 링크/방법 |
|------|----------|
| 대시보드 | {dashboard_url} |
| 로그 확인 | {log_access} |

---

## 9. 시크릿/설정 관리

| 항목 | 방법 |
|------|------|
| 관리 방법 | {secret_method} |
| 위치/접근 | {secret_location} |

⚠️ **실제 시크릿 값은 이 문서에 포함되어 있지 않습니다.**

---

## 10. 배포 전 체크리스트

- [ ] {checklist_item_1}
- [ ] {checklist_item_2}
- [ ] ...

---

## 11. 주의사항

{cautions 또는 "특별한 주의사항 없음"}

---

## 메타 정보

| 항목 | 내용 |
|------|------|
| 생성일 | {날짜} |
| 최종 수정일 | {날짜} |
| 스킬 버전 | deploy-launchpad 1.0.0 |
```

### 8-2. 저장

```
docs/{serviceName}/deploy-launchpad.md
```

---

## Phase 9: 완료 보고

```markdown
## Deploy Launchpad 생성 완료

### 요약
| 항목 | 내용 |
|------|------|
| 서비스 | {serviceName} |
| 인프라 | {infra_type} |
| CI/CD | {cicd_tool 또는 "수동"} |
| 환경 | {environments} |

### 파일
- 생성됨: `docs/{serviceName}/deploy-launchpad.md`

### 사용법
배포할 때:
> "{serviceName} 배포해줘" + @deploy-launchpad.md
> → LLM이 문서를 읽고 배포 명령어 안내

### 다음 단계
- 문서 내용 검토
- 빠진 정보 있으면 직접 추가 또는 이 스킬 재실행
```

---

# 연계

```
[deploy-launchpad] → deploy-launchpad.md 생성
                            │
                            ▼
                    (배포 필요 시)
                            │
                    사용자: "배포해줘" + @deploy-launchpad.md
                            │
                            ▼
                    LLM이 문서 읽고 배포 명령어 안내
```

---

# 주의사항

1. **시크릿 값 금지**
   - 실제 비밀번호, API 키 등은 절대 담지 않음
   - "어디서 가져오는지" 방법만 기록

2. **보강 가능**
   - 처음에 모든 정보를 모를 수 있음
   - 나중에 스킬 재실행하거나 직접 편집으로 보강

3. **환경별 차이 주의**
   - dev/staging/prod 설정이 다를 수 있음
   - 환경별 섹션에 명확히 구분하여 기록

4. **최신 상태 유지**
   - 인프라/설정 변경 시 문서 업데이트 필요
