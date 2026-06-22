# VestWay — 현재 상태 스냅샷

> 상세 이력은 각 작업 폴더의 `YYYY-MM-DD.md`, 프로세스는 `guide.md` 참조.
> Last updated: 2026-06-22 (master-flow v3 + 네이밍=뎁스 모델 재정립, SSOT/git 갱신)

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
| Master 플로우 다이어그램 | [master-flow/](master-flow/) | **현행 v3 `16245:20440`** (네이밍=뎁스 모델, gap60, 커넥터 뎁스간만, 트리거=bbox시작점 최근접). v2(16210)는 구버전. 규칙은 SSOT(16097:3930)+git guide.md 동기화(06-22) | home→bloomberg 트리거 정밀화, v2/구버전 정리, 상태레이블 검수 |

---

## 핵심 함정 (현재 유효)

- `Pretendard` 폰트 미설치 → 텍스트 직접 수정 불가, `clone()` 우회.
- 앱스토어 5.5형 축소는 `rescale(270/310)` 1순위 (resize는 우측 잘림).
- 워딩 차이 동기화는 텍스트 프레임 `clone()` 교체.
- `upload_assets`(count 호출) 임시 노드는 작업 후 `.remove()` 정리.
