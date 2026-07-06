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

1. **파일 Read** (2개 동시) — **규칙 SSOT**:
   - `vestway/master-flow/guide.md`
   - `vestway/master-flow/connect-builder.js`
   - ※ Figma 가이드 문서(`16097:3930`)는 2026-07-06부로 동결 — 갱신·참조 ❌

2. **기준섹션 실측** — VestWay 테스트 파일(`TCFQPUYWPmBmwcpo7cCu8w`) Master 페이지:
   - 기준섹션 `16037:31196` 레이블 y 실측 (sublbl / statelbl / screen_y) — guide.md §2·§4-1 수치와 대조(검증용)

3. **0단계 트리거맵** — 소스 섹션 네이티브 커넥터 전수 실측:
   - 각 커넥터 출발 노드 → 리프 트리거 해석 (endpoint bbox 실측, magnet 추정 ❌)
   - 표로 정리: `트리거 | from화면 | to화면`
   - 규칙: 다른 트리거 → 다른 도착화면 = 분기행. 출발화면이 같아도 도착이 다르면 다른 행.
   - 판단 기호(다이아몬드): D1 맨 좌측 = 유저 세그먼트(행 그룹 분리) / 플로우 내부 = 화면 분기 (guide.md §2-2·§2-3)

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

9. **워크로그 기록** — `{해당 product}/master-flow/YYYY-MM-DD.md` 에 결과 append:
   - 섹션 ID, 좌표, 화면 수, 커넥터 수, 수치검증 결과, ⚠️ 미확인 항목
