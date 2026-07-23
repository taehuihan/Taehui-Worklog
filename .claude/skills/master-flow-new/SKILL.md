---
name: master-flow-new
description: Master 플로우 — 신규 섹션 추가. 소스 섹션(Figma)을 Master 페이지에 플로우 다이어그램 섹션으로 정리한다. "플로우 섹션 만들어줘", "Master에 정리해줘" 요청 시 사용.
---

# Master 플로우 — 신규 섹션 추가

소스 섹션을 Master 페이지에 새 플로우 섹션으로 정리한다.
인자: 소스 설명 또는 Figma URL (예: "V.AI 페이지 > V.AI 개선 섹션", "소스URL > 타겟URL")

> **전제**: Taehui-Worklog 레포 안에서 실행 (경로가 레포 상대). 다른 위치라면 레포 경로를 먼저 찾는다.
> **프로덕트별 편차**: `{product}/master-flow/guide.md` 먼저 확인 — 예) RealAcademy는 태블릿 1280(step 1340), `realacademy/master-flow/guide.md`.

## 필수 선행 (빌드 전, 기억 복원 ❌)

1. **파일 Read** (2개 동시) — **규칙 SSOT** (프로덕트 무관 중앙 위치):
   - `_shared/master-flow/guide.md`
   - `_shared/master-flow/connect-builder.js`
   - ※ Figma 가이드 문서(`16097:3930`)는 2026-07-06부로 동결 — 갱신·참조 ❌

2. **기준섹션 실측** — VestWay 테스트 파일(`TCFQPUYWPmBmwcpo7cCu8w`) Master 페이지:
   - 기준섹션 `16037:31196` 레이블 y 실측 (sublbl / statelbl / screen_y) — guide.md §2·§4-1 수치와 대조(검증용)

3. **0단계 트리거맵** — 소스 섹션 네이티브 커넥터 전수 실측:
   - 각 커넥터 출발 노드 → 리프 트리거 해석 (endpoint bbox 실측, magnet 추정 ❌)
   - 표로 정리: `트리거 | from화면 | to화면`
   - 규칙: 다른 트리거 → 다른 도착화면 = 분기행. 출발화면이 같아도 도착이 다르면 다른 행.
   - 마커(도형 모양, 시각 확인 필수): **사각형+텍스트 = 유저 세그먼트**(행 그룹 분리, 시작점) / **다이아+텍스트 = 화면 분기점** (guide.md §2-2·§2-3, 2026-07-09 위치→모양 기반 개정)

4. **행 배치 도출** — `verifyRowBranching(specs)` 실행 (connect-builder.js 참조):
   - 같은 출발, 다른 트리거, 같은 행 y → ⚠️ 분기행으로 분리

## 빌드

5. **y 좌표 계산** — guide.md §2 수직공식 (즉흥 상수 ❌):
   - `sublbl_y(row N) = max(전체 depth 이전 행 화면들의 bottom) + 400`  ← **글로벌 max**
   - `statelbl_y = sublbl_y + 58 + 165`
   - `screen_y = statelbl_y + 44 + 170`
   - 단일 화면 depth: statelbl 생략 (간격은 유지)
   - 스타일·레이어 순서·섹션 위치(직전 섹션 우측+500): guide.md §4-1

6. **섹션 빌드** — connect-builder.js 전체를 use_figma 코드에 verbatim 주입:
   ```js
   // <connect-builder.js 전체 내용>
   const sec = await figma.getNodeByIdAsync('<섹션id>');
   return buildConnectors(sec, [
     {from:[x,y], to:[x,y], trig:{text:'트리거 텍스트'}, name:'출발>도착'},
     ...
   ]);
   ```

## 빌드 후 검증

7. **9단계 수치검증**:
   - 행간격: `screen_y(N) - prev_global_max_bottom = 837` (로컬 bottom ❌, 전체 max ✓)
   - 도착 center: `connector 끝점 y = to 화면 cy` · DEPTH_GAP = 800 · 섹션 겹침 0
   - 관통 0: buildConnectors report에서 `관통: 'ok'` 확인

8. **의미검증** (수치검증 ≠ 의미검증):
   - 트리거맵과 커넥터 1:1 대응 + **소스 네이티브 커넥터 출발점과 시각 대조** (report의 via·ambiguous 확인 — 수치가 전부 ok여도 엉뚱한 요소에서 출발할 수 있음)
   - 분기행 원칙: 출발 동일 + 트리거 다름 + 도착 다름 → 다른 행 y ✓

## 컴포넌트 정리 (-COMP)

9. **-COMP 컴포넌트 정리** — 플로우 검증(7·8) 통과 후, 로컬 마스터 컴포넌트가 있으면 수행 (없으면 skip, 로그에 "대상 마스터 0"):
   - **`_shared/master-flow/comp-guide.md` 직접 Read** (기억 복원 ❌) 후 그 규칙대로.
   - **먼저 §0 모델 자동 판정**: 파일 스캔 → 기능별 `_Comp` 섹션 있으면 **모델 2**(화면별 N섹션, 플로우와 같은 페이지, 좌→우 나열·간격400·플로우x정렬) / `-COMP` 단일 패턴이거나 마스터 소수면 **모델 1**(플로우 아래 +500, `[플로우명]-COMP` 1섹션, width 동일). 애매하면 확인.
   - **대상·편입**: 모델 1 = 소스 페이지 마스터(§2) / 모델 2 = 사용처 추적으로 마스터→화면→해당 `_Comp` 편입(§0). 배치 = 포함계층 좌→우 트리, 라벨 없음(§3).
   - **⚠️ 이동 전 확인 게이트(§0)**: -COMP는 마스터 *이동*이라 반쯤 파괴적 → **매핑표(마스터→대상섹션/예외)를 사람에게 1회 확인**받고 승인분만 이동. 스펙 주석에 박힌 작업중 마스터·공용·외부는 예외 처리.
   - **3중 검증**: 수치(§4 모델별 위치·width·마진360·겹침0·누락0) + 의미(소속·인스턴스 무결) + **시각(스크린샷 대조 필수)** — §4.

## 마무리

10. **워크로그 기록** — `{해당 product}/master-flow/YYYY-MM-DD.md` 에 결과 append:
   - 섹션 ID, 좌표, 화면 수, 커넥터 수, 수치검증 결과, ⚠️ 미확인 항목
   - -COMP: 섹션 ID, 이동한 마스터 수(=소스 대상 수), 검증 결과 (skip 시 사유)
