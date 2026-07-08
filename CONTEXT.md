# 현재 상태 스냅샷 (전체)

> 새 세션이 "지금 어디까지 했나"를 한눈에 잡는 파일.
> 상세 이력은 각 프로덕트 폴더의 `_CONTEXT.md` 와 `{작업}/YYYY-MM-DD.md` 를 본다.
> Last updated: 2026-07-08

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
| **VestWay** | [vestway/](vestway/) | master-flow: **SSOT md 전환(07-06)** — guide.md+connect-builder.js가 단일 기준, Figma 16097 동결(§4-1 스타일·분기행순서 이관 완료) + **규칙1.5 버튼조상**(태블릿 트리거 갭 2건 수정) + **스킬 공용화**(`.claude/skills/master-flow-*`, 개인 커맨드는 포인터). 이전: §10 업데이트 워크플로·블룸버그 업데이트(06-29) | 기존 섹션 position 트리거 점검, 다른 디자이너 스킬 온보딩 피드백 |
| **RealAcademy** | [realacademy/](realacademy/) | **master-flow 섹션 2개**: 학습커스텀 `50686:3312`(화면9·커넥터3, 07-06) + **칭찬저금통 `50744:10173`(화면7·커넥터2, 07-08)** — 둘 다 검증 전항 통과. 칭찬저금통은 규칙1.5로 태블릿 CTA 트리거 무보정 통과. 태블릿 1280 편차는 `realacademy/master-flow/guide.md` · ra-live-class 컴포넌트 중앙화 진행 | RA 추가 소스 섹션 정리 시 동일 워크플로 |
| **RealClass** | _(폴더 예정)_ | 작업 기록 시 생성 | — |

---

## 활성 대상 파일 / 공통 주의

- **VestWay Figma**: `zsbXUBaPLvxiYwOMFCtFsS` + 테스트 `TCFQPUYWPmBmwcpo7cCu8w` · **RA Figma**: `MOJH4fo6X8hy7tfr3Spxuv` (실제 파일은 사용자 명시 지정 시)
- **플로우 규칙 SSOT**: `_shared/master-flow/guide.md` + `connect-builder.js` (프로덕트 무관 중앙 위치, 2026-07-08 `vestway/`에서 이관. Figma 16097은 2026-07-06부로 동결 스냅샷)
- **공통 함정**: 이 Figma 환경엔 `Pretendard` 폰트 미설치 → `text.characters=` 직접 수정/`loadFontAsync` 막힘. 워딩 교체는 텍스트 노드 `clone()`으로 우회.

---

## 폴더 규칙

```text
_shared/                  ← 프로덕트 무관 공용 자산 (규칙 SSOT 등)
  master-flow/
    guide.md              ← 플로우 규칙 SSOT (본체, 프로덕트 공통)
    connect-builder.js    ← 커넥터 빌더 SSOT
{product}/                ← 프로덕트가 1차 분류축 (VestWay, RealAcademy, RealClass)
  _CONTEXT.md             ← 그 프로덕트 현재 상태 스냅샷
  {작업}/                 ← 작업/태스크 단위 (master-flow, sp500-logo 등)
    guide.md              ← 그 프로덕트의 프로세스 가이드/편차 (master-flow는 _shared 포인터+편차만)
    YYYY-MM-DD.md         ← 세션별 작업 로그
CONTEXT.md                ← (this) 전체 프로덕트 요약
```
