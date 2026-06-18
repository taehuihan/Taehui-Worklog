# Taehui Worklog

태휘의 Claude AI 협업 작업 히스토리.

여러 프로덕트(**RealAcademy · VestWay · RealClass**)의 디자인 작업을 Claude + Figma MCP로 자동화한 기록을 **프로덕트 단위**로 관리한다.

---

## 시작하기

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

## 프로덕트

각 프로덕트의 진행 작업·현황은 해당 폴더의 `_CONTEXT.md` 를 본다. (README는 색인만 둔다)

| 프로덕트 | 폴더 | Figma 파일 키 |
|----------|------|---------------|
| **VestWay** | [vestway/](vestway/) | `zsbXUBaPLvxiYwOMFCtFsS` |
| **RealAcademy** | [realacademy/](realacademy/) | `NAy5RTgdGb7UiTU8CcxHL3` |
| **RealClass** | _(작업 기록 시 생성)_ | — |

---

## 폴더 구조

**프로덕트가 1차 분류축**이고, 그 아래에 작업(태스크) 단위 폴더를 둔다.

```text
CONTEXT.md                ← 전체 프로덕트 현황 한눈 요약
{product}/                ← 프로덕트 (vestway, realacademy, realclass)
  _CONTEXT.md             ← 그 프로덕트 현재 상태 스냅샷
  {작업}/                 ← 작업/태스크 단위 (master-flow, sp500-logo …)
    guide.md              ← 재현 가능한 프로세스 가이드 (도구·핵심 코드·함정)
    YYYY-MM-DD.md         ← 세션별 작업 로그 (그날 한 일, 발견)
```

- **`guide.md`** = 시간이 지나도 유효한 "어떻게 하는가" (정제된 가이드)
- **`YYYY-MM-DD.md`** = 그날의 raw 기록 (무엇을 했고 무엇이 막혔나)
- **`_CONTEXT.md` / `CONTEXT.md`** = "지금 어디까지 했나" 스냅샷 (세션 시작용)

---

## 자동화

| 구성 | 하는 일 |
|------|---------|
| **SessionStart 훅** (`~/.claude/settings.json`) | 새 세션마다 `~/Taehui-Worklog` 를 git pull → freshness 검사 → `CONTEXT.md` 를 세션 컨텍스트에 자동 주입 |
| **`scripts/check-context-freshness.sh`** | 각 CONTEXT의 `Last updated` 를 해당 폴더 최신 `YYYY-MM-DD.md` 와 비교, 오래됐으면 stale 경고 |

로컬 작업 경로는 `~/Taehui-Worklog` 로 고정한다.

---

## 도구 스택

| 도구 | 용도 |
|------|------|
| Claude (claude-sonnet-4) | 전체 작업 오케스트레이션 |
| Figma MCP | Figma Plugin API 직접 제어 |
| Node.js + sharp / python + opencv | SVG→PNG 변환, 원근 워프 |
| GitHub CLI (gh) | 레포 접근, 파일 관리 |

---

## 관련 리소스

| 리소스 | 링크 |
|--------|------|
| VestWay 디자인 (Figma) | https://www.figma.com/design/zsbXUBaPLvxiYwOMFCtFsS |
| RA PAGE UI_Live Class (Figma) | https://www.figma.com/design/NAy5RTgdGb7UiTU8CcxHL3 |

<!-- 자주 쓰는 브랜드 가이드·외부 문서가 생기면 여기에 추가 -->
