# Taehui Worklog

태휘의 Claude AI 협업 작업 히스토리.

여러 프로덕트(**RealAcademy · VestWay · RealClass**)의 디자인 작업을 Claude + Figma MCP로 자동화한 기록을 **프로덕트 단위**로 관리한다.

---

## 시작하기

로컬 작업 경로는 `~/Taehui-Worklog` 로 고정한다.

새 세션은 [CONTEXT.md](CONTEXT.md)(전체 현황) → 작업할 `{product}/_CONTEXT.md`(프로덕트 상세) 순으로 읽고 시작한다.

먼저 `bash scripts/check-context-freshness.sh` 를 실행해 CONTEXT 스냅샷이 최신 로그보다 오래(stale)됐는지 확인한다. ⚠️ 경고가 나온 CONTEXT는 곧이곧대로 믿지 말고 실제 로그·git 상태를 먼저 확인한다.

---

## 채널 역할 (무엇을 어디에 두나)

작업물의 정본과 기록을 구분한다. 같은 정보를 양쪽에 중복하지 않는다.

| 채널 | 역할 (정본) |
|------|------------|
| **Figma** | 디자인 원본 — 화면·컴포넌트의 진짜 모습 |
| **Taehui-Worklog** (this) | 작업 기록 — 무엇을 했고 어떻게 했나, 진행 현황 |

### What belongs here

- 날짜별 작업 로그 (`{product}/{작업}/YYYY-MM-DD.md`)
- 재현 가능한 프로세스 가이드·함정 (`guide.md`)
- 현재 진행 상황 스냅샷 (`CONTEXT.md`, `_CONTEXT.md`)

### What does NOT belong here

- 디자인 결과물의 시각적 원본 → **Figma**가 정본
- 매번 바뀌는 진행 현황을 README에 → **CONTEXT.md**가 담당
- 그날 한 작업을 CONTEXT에 → **YYYY-MM-DD.md** 로그가 담당

---

## 폴더 구조

**프로덕트가 1차 분류축**이고, 그 아래에 작업(태스크) 단위 폴더를 둔다.

```text
CONTEXT.md                ← 전체 프로덕트 현황 한눈 요약
_shared/                  ← 프로덕트 무관 공용 자산 (규칙 SSOT 등)
  master-flow/
    guide.md              ← 플로우 규칙 SSOT (본체, 프로덕트 공통)
    connect-builder.js    ← 커넥터 빌더 SSOT
{product}/                ← 프로덕트 (vestway, realacademy, realclass)
  _CONTEXT.md             ← 그 프로덕트 현재 상태 스냅샷
  {작업}/                 ← 작업/태스크 단위 (master-flow, sp500-logo …)
    guide.md              ← 그 프로덕트 가이드/편차 (master-flow는 _shared 포인터+편차만)
    YYYY-MM-DD.md         ← 세션별 작업 로그 (그날 한 일, 발견)
```

- **`_shared/`** = 특정 프로덕트 소유가 아닌 공용 규칙·도구 (플로우 규칙 SSOT). 규칙은 한 곳에서만 관리해 드리프트를 막는다.
- **`guide.md`** = 시간이 지나도 유효한 "어떻게 하는가" (정제된 가이드)
- **`YYYY-MM-DD.md`** = 그날의 raw 기록 (무엇을 했고 무엇이 막혔나)
- **`_CONTEXT.md` / `CONTEXT.md`** = "지금 어디까지 했나" 스냅샷 (세션 시작용)

---

## 다른 디자이너 온보딩 — master-flow 스킬 쓰기

Figma **Task 화면들을 Master 페이지 플로우 다이어그램 섹션으로 자동 정리**하는 스킬 2종(`/master-flow-new`, `/master-flow-update`)이 이 레포에 포함돼 있다. 스킬 본체·규칙 SSOT가 한 레포에 같이 있어 **clone만 하면 버전이 항상 맞는다.**

### 사전 조건

- **Claude Code** 설치 + **Figma MCP**(claude.ai Figma) 연결
- 대상 Figma 파일 접근 권한 (+ 기준섹션 실측용 VestWay 테스트 파일 `TCFQPUYWPmBmwcpo7cCu8w`)

### 셋업 (2단계)

1. **레포를 `~/Taehui-Worklog` 경로에 clone** (경로 고정 — 스킬이 레포 상대 경로, 훅이 이 절대 경로를 참조):
   ```bash
   git clone https://github.com/taehuihan/Taehui-Worklog.git ~/Taehui-Worklog
   ```
2. **스킬 인식** (택1):
   - **(권장) 레포 루트에서 Claude Code 실행** → `.claude/skills/`가 자동 인식돼 `/master-flow-new`·`/master-flow-update`가 바로 뜬다.
   - **(어디서나 쓰려면) 글로벌 복사** → `.claude/skills/master-flow-*` 를 `~/.claude/skills/` 로 복사. 단 규칙 파일 참조 때문에 **레포 clone은 여전히 필수.**

### 쓰는 법

```text
/master-flow-new     <소스 설명 또는 Figma URL>      # 새 플로우 섹션 생성
/master-flow-update  <대상 섹션 설명>                # 기존 섹션에 소스 변경 반영
```

규칙 본체는 `_shared/master-flow/guide.md` + `connect-builder.js`. 스킬이 빌드 전 이 SSOT를 읽어 그대로 적용한다.

### (선택) 플로우 가드 훅

빌드 전 체크리스트를 자동 리마인드하는 hook도 있다(규칙 누락 방지). 필수는 아니며, 설치 절차는 [scripts/SETUP-hooks.md](scripts/SETUP-hooks.md) 참고.

---

## 관련 리소스

| 리소스 | 링크 |
|--------|------|
| VestWay 디자인 (Figma) | https://www.figma.com/design/zsbXUBaPLvxiYwOMFCtFsS |
| RA PAGE UI_Live Class (Figma) | https://www.figma.com/design/NAy5RTgdGb7UiTU8CcxHL3 |

<!-- 자주 쓰는 브랜드 가이드·외부 문서가 생기면 여기에 추가 -->
