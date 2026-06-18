# Taehui Worklog

태휘의 Claude AI 협업 작업 히스토리.

여러 프로덕트(**RealAcademy · VestWay · RealClass**)의 디자인 작업을 Claude + Figma MCP로 자동화한 기록을 **프로덕트 단위**로 관리한다.

---

## 시작하기

새 세션은 [CONTEXT.md](CONTEXT.md)(전체 현황) → 작업할 `{product}/_CONTEXT.md`(프로덕트 상세) 순으로 읽고 시작한다.

---

## 프로덕트

| 프로덕트 | 폴더 | 내용 |
|----------|------|------|
| **VestWay** | [vestway/](vestway/) | VestWay 앱 디자인 자동화 — 앱스크린샷 목업, S&P500 로고, Master 플로우 다이어그램 |
| **RealAcademy** | [realacademy/](realacademy/) | [RA] Live Class Figma 마스터 컴포넌트 중앙화 |
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

## 도구 스택

| 도구 | 용도 |
|------|------|
| Claude (claude-sonnet-4) | 전체 작업 오케스트레이션 |
| Figma MCP | Figma Plugin API 직접 제어 |
| Node.js + sharp / python + opencv | SVG→PNG 변환, 원근 워프 |
| GitHub CLI (gh) | 레포 접근, 파일 관리 |
