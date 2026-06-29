# 현재 상태 스냅샷 (전체)

> 새 세션이 "지금 어디까지 했나"를 한눈에 잡는 파일.
> 상세 이력은 각 프로덕트 폴더의 `_CONTEXT.md` 와 `{작업}/YYYY-MM-DD.md` 를 본다.
> Last updated: 2026-06-29

---

## 세션 시작 루틴

1. 오늘 다룰 **프로덕트**를 정한다 → 해당 `{product}/_CONTEXT.md` 를 읽는다.
2. 그 안의 작업 폴더에서 최신 `YYYY-MM-DD.md` 1~2개로 맥락을 잡는다.
3. Figma/코드 write 전에 해당 작업 폴더의 `guide.md` 규칙을 먼저 읽는다.
4. 이 파일(`CONTEXT.md`)의 `Last updated`가 각 프로덕트 최신 로그보다 오래됐으면 **stale snapshot**으로 취급하고, 실제 로그·git 상태를 먼저 확인한다.

---

## 프로덕트 현황 (한눈에)

| 프로덕트 | 폴더 | 현재 상태 | 다음 |
|----------|------|-----------|------|
| **VestWay** | [vestway/](vestway/) | master-flow: 블룸버그 재제작 테스트(`16524:28640`)로 **§2-2 가이드 버그 발견·교정** — 세그먼트는 "라벨", 배치는 항상 §5 분기행(진입점 다르면 같은 세그먼트라도 다른 행). 교훈: **"가이드 버그=재현 버그"**(기억 리셋해도 SSOT 자체가 틀리면 오류 재현). guide §2-2·SSOT노드·connect-builder·메모리 동기화(06-29) | 기존 섹션 position 트리거 함정 점검, 세그먼트 모델 타 섹션 적용 |
| **RealAcademy** | [realacademy/](realacademy/) | ra-live-class 마스터 컴포넌트 중앙화 진행 | 후속 확인 |
| **RealClass** | _(폴더 예정)_ | 작업 기록 시 생성 | — |

---

## 활성 대상 파일 / 공통 주의

- **VestWay Figma**: `zsbXUBaPLvxiYwOMFCtFsS` (현재 모든 Figma 요청은 테스트 파일로 범위 제한)
- **공통 함정**: 이 Figma 환경엔 `Pretendard` 폰트 미설치 → `text.characters=` 직접 수정/`loadFontAsync` 막힘. 워딩 교체는 텍스트 노드 `clone()`으로 우회.

---

## 폴더 규칙

```text
{product}/                ← 프로덕트가 1차 분류축 (VestWay, RealAcademy, RealClass)
  _CONTEXT.md             ← 그 프로덕트 현재 상태 스냅샷
  {작업}/                 ← 작업/태스크 단위 (master-flow, sp500-logo 등)
    guide.md              ← 재현 가능한 프로세스 가이드 (도구·코드·함정)
    YYYY-MM-DD.md         ← 세션별 작업 로그
CONTEXT.md                ← (this) 전체 프로덕트 요약
```
