---
name: master-flow-update
description: Master 플로우 — 기존 섹션 업데이트. 소스 변경(화면 추가·교체·삭제·rename·split)을 이미 만든 Master 플로우 섹션에 반영한다. "섹션 업데이트해줘", "소스 바뀐 거 반영해줘" 요청 시 사용.
---

# Master 플로우 — 기존 섹션 업데이트

소스 변경(화면 추가·교체·삭제·rename)을 기존 Master 섹션에 반영한다.
인자: 대상 설명 (예: "블룸버그 리서치 조회 섹션 — 설명 화면 2개로 split")

> **전제**: Taehui-Worklog 레포 안에서 실행. 프로덕트별 편차는 `{product}/master-flow/guide.md` 먼저 확인 (RA: 태블릿 1280).

## 필수 선행 (기억 복원 ❌)

1. **파일 Read** (2개 동시) — **규칙 SSOT**:
   - `vestway/master-flow/guide.md` (§10 업데이트 워크플로 포함)
   - `vestway/master-flow/connect-builder.js`

## 업데이트 워크플로 (guide.md §10)

**0. 소스 특정** — Master 섹션명 ↔ 소스 페이지/섹션명 매칭 확인 (첫 매칭만 1회 확인)

**1. 화면 식별 ⚠️** — 네이밍 하드코딩 금지. 화면 폭 기준 전수 스캔(프로덕트 편차 확인: 모바일 ~375 / RA 태블릿 ~1280), 컴포넌트/variant(`plan=`·`Property=`)·내부요소 제외. **diff 결과 시각 확인 후 진행**

**2. Diff — 이름 매칭** — 추가 / 삭제 / 교체(이름 같고 내용 다름) / rename·split 분류

**3. 삭제 → Archive 이동** — Master 우측 끝 Archive 섹션으로 이동 + 출처·날짜 라벨 (없으면 생성)

**4. 추가 → 가이드대로 배치** — §2 수직공식(글로벌 max bottom), 진입점은 소스 네이티브 커넥터 실측. 뎁스 구조 바뀌면 기존 화면 cascade shift

**5. 교체 → 같은 위치** — 높이 달라지면 아래 행 전체 cascade + 커넥터 재계산

**6. Rename / Split** — 삭제+추가로 처리. Split(1→N): 원본 → Archive, N개 새로 추가, 커넥터 재연결

**7. 검증 + 섹션 크기 재조정** — 9단계 수치검증(행간격 837) + 섹션 크기 재계산 + **우측 섹션 cascade(겹침 0 확인 필수** — 섹션이 커지며 옆 섹션·Archive 침범 사례 있음)

## 빌드 후 필수

8. **커넥터 재빌드** (변경된 연결이 있을 경우) — connect-builder.js 전체 verbatim 주입 + `buildConnectors()`. report의 관통·도착center·첫꺾임 + via·ambiguous 의미 대조

9. **워크로그 기록** — `{해당 product}/master-flow/YYYY-MM-DD.md` 에 diff 결과·변경 화면·Archive 내역·검증 결과 append
