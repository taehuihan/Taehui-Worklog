# VestWay — 현재 상태 스냅샷

> 상세 이력은 각 작업 폴더의 `YYYY-MM-DD.md`, 프로세스는 `guide.md` 참조.
> Last updated: 2026-06-25 (블룸버그 리서치 조회 `16474:31056` 신규 빌드 — 무료/유료 행 분리 + 커넥터 4개 9단계 통과)

---

## 대상 / 범위

- **Figma 파일**: `zsbXUBaPLvxiYwOMFCtFsS` (VestWay 디자인, 현재 테스트 파일로 범위 제한)
- 작업 성격: Claude + Figma MCP(Plugin API) 자동화

---

## 작업별 현황

| 작업 | 폴더 | 상태 | 다음 |
|------|------|------|------|
| 앱스크린샷 목업 교체 | [app-screenshots/](app-screenshots/) | 260617 섹션 1~8번 `vaihome-following1` 교체 완료 | 다음 화면 업데이트 시 동일 워크플로 |
| S&P 500 로고 컴포넌트 | [sp500-logo/](sp500-logo/) | **전체 완료** (564개) | 신규 종목 편입 시만 |
| Master 플로우 다이어그램 | [master-flow/](master-flow/) | **v3 `16245:20440`**(V.AI) + **내정보 `16297:15585`** + **챌린지 모바일 `16374:19659`** + **블룸버그 리서치 조회 `16474:31056`**(x=85596, 무료/유료 행 분리, 커넥터 4개, 06-25). 가이드 SSOT(16097:3930)·guide.md·connect-builder.js 동기화 완료 | 상세(무료)/상세(유료) CTA 연결처 확인, v3 DEPTH_GAP 800 재배치 여부 |

---

## 핵심 함정 (현재 유효)

- `Pretendard` 폰트 미설치 → 텍스트 직접 수정 불가, `clone()` 우회.
- 앱스토어 5.5형 축소는 `rescale(270/310)` 1순위 (resize는 우측 잘림).
- 워딩 차이 동기화는 텍스트 프레임 `clone()` 교체.
- `upload_assets`(count 호출) 임시 노드는 작업 후 `.remove()` 정리.
