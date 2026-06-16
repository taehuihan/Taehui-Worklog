# Taehui Worklog

태휘의 Claude AI 협업 작업 히스토리.

Vestway 앱 디자인 작업에서 Claude + Figma MCP를 활용해 진행한 자동화 작업들을 기록한다.

---

## 프로젝트

| 폴더 | 내용 |
|------|------|
| [master-flow/](master-flow/) | Figma Task 페이지 화면 → Master 페이지 플로우 다이어그램 자동 정리 |
| [sp500-logo/](sp500-logo/) | S&P 500 종목 로고 썸네일 컴포넌트 564개 제작 |

---

## 파일 구조

각 프로젝트 폴더:

```
{project}/
  guide.md          ← 전체 프로세스 가이드 (도구 스택, 핵심 코드, 문제 해결)
  YYYY-MM-DD.md     ← 세션별 작업 로그 (그날 한 일, 발견한 것들)
```

---

## 도구 스택

| 도구 | 용도 |
|------|------|
| Claude (claude-sonnet-4) | 전체 작업 오케스트레이션 |
| Figma MCP | Figma Plugin API 직접 제어 |
| Node.js + sharp | SVG → PNG 고해상도 변환 |
| GitHub CLI (gh) | 레포 접근, 파일 관리 |
