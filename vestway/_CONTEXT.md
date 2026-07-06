# VestWay — 현재 상태 스냅샷

> 상세 이력은 각 작업 폴더의 `YYYY-MM-DD.md`, 프로세스는 `guide.md` 참조.
> Last updated: 2026-07-06 (**SSOT md 전환** — guide.md+connect-builder.js가 단일 기준, Figma 16097 동결 · **규칙1.5 버튼조상** 추가(태블릿 트리거 갭 수정) · **스킬 공용화** `.claude/skills/master-flow-*`)

---

## 대상 / 범위

- **Figma 파일**: `zsbXUBaPLvxiYwOMFCtFsS` (VestWay 실제 디자인 파일) + 테스트 파일 `TCFQPUYWPmBmwcpo7cCu8w` (실험·검증용)
- 작업 성격: Claude + Figma MCP(Plugin API) 자동화

---

## 작업별 현황

| 작업 | 폴더 | 상태 | 다음 |
|------|------|------|------|
| 앱스크린샷 목업 교체 | [app-screenshots/](app-screenshots/) | 260617 섹션 1~8번 `vaihome-following1` 교체 완료 | 다음 화면 업데이트 시 동일 워크플로 |
| S&P 500 로고 컴포넌트 | [sp500-logo/](sp500-logo/) | **전체 완료** (564개) | 신규 종목 편입 시만 |
| Master 플로우 다이어그램 (테스트) | [master-flow/](master-flow/) | **v3 `16245:20440`**(V.AI) + **내정보 `16297:15585`** + **챌린지 모바일 `16374:19659`** + **블룸버그 리서치 조회 `16524:28640`**(x=95001, SEC 6000×7748. §10 업데이트 워크플로 첫 적용: 설명→설명1·2 split·튜토리얼D1추가+시프트. 세그먼트=라벨. Archive `16532`) + **로그인 `16489:29286`**. **07-06: SSOT md 전환**(guide.md+builder가 기준, Figma 16097 동결·§4-1 스타일 이관) + **규칙1.5 버튼조상**(RA 태블릿 갭 수정) + 스킬 공용화 | 기존 섹션 position 트리거 함정 점검 |
| Master 플로우 다이어그램 (**실제 파일**) | [master-flow/](master-flow/) | **V.AI 개선 플로우 `15437:8054`** (`zsbXUBaPLvxiYwOMFCtFsS` Master, x=1000, 8970×6200. D1 온보딩2·D2 튜토리얼2·D3 홈2+블룸버그·D4 대화3+모달8+검색5. 커넥터 4개. 수치검증 통과. ⚠️ chat-modal-A/B/C/D 이름 확인 필요) | chat-modal 이름 확정, 추가 섹션 이식 |

---

## 핵심 함정 (현재 유효)

- `Pretendard` 폰트 미설치 → 텍스트 직접 수정 불가, `clone()` 우회.
- 앱스토어 5.5형 축소는 `rescale(270/310)` 1순위 (resize는 우측 잘림).
- 워딩 차이 동기화는 텍스트 프레임 `clone()` 교체.
- `upload_assets`(count 호출) 임시 노드는 작업 후 `.remove()` 정리.
