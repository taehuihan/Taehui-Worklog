# Task 페이지 → Master 페이지 플로우 자동화

> 작성자: 태희  
> 작업 기간: 2026년 6월  
> 대상: Bestway 앱 디자인 시스템 — V.AI 화면 플로우를 Master 다이어그램 페이지에 자동 정리

---

## 목표

Figma의 **Task 페이지**에 산재한 화면(Frame)들을 **Master 페이지**의 플로우 다이어그램 섹션으로 자동 이동·정렬한다.

수작업으로 하면 화면 하나씩 복사→붙여넣기→위치 조정→커넥터 그리기 반복이지만, Claude + Figma MCP Plugin API를 활용하면 이 과정을 스크립트로 처리할 수 있다.

### 최종 목표 상태

```
Master 페이지
└── "V.AI 개선 플로우" SectionNode
      ├── bg Rectangle (#BFBFBF 배경)
      ├── Depth 밴드 (D1 ~ D5, #3A3A3A, h=130)
      ├── 서브레이블 / 상태레이블 텍스트
      ├── 화면 22개 (Task 페이지에서 복제)
      └── 커넥터 벡터 21개
```

---

## 배경 및 대화 맥락

### 왜 자동화가 필요했나

Bestway V.AI 기능 개선을 진행하면서 Task 페이지에 30개 이상의 화면이 쌓였다. Master 페이지는 전체 앱 플로우를 한눈에 보는 다이어그램 페이지인데, Task에서 완성된 화면을 Master에 수동으로 옮기는 작업이 반복됐다.

- 화면 복제 → 위치 맞추기 → 밴드·레이블 추가 → 커넥터 그리기
- 화면이 많아질수록 수작업 실수 증가 (위치 오차, 커넥터 겹침)

### Claude와 함께 찾은 접근법

1. **Figma MCP를 통한 Plugin API 직접 제어** — Claude가 `use_figma` 도구로 JavaScript를 Figma 플러그인 컨텍스트에서 실행
2. **기준 섹션 역공학** — 이미 완성된 "블룸버그 리서치 조회" 섹션의 좌표·스타일을 분석해 레이아웃 상수 추출
3. **스크립트 패턴화** — 재사용 가능한 함수(mkVec, appendScreen 등)로 구조화

---

## 완료된 작업 (2026-06-09)

### V.AI 개선 플로우 섹션 생성

- **파일**: 테스트 파일 `TCFQPUYWPmBmwcpo7cCu8w`
- **Master 페이지 노드**: `14753:31917` ("🚧 Master")
- **생성된 섹션**: `16073:3930` ("V.AI 개선 플로우")
  - 위치: x=4700, y=4592 (기존 가이드 섹션 우측)
  - 크기: 6570×5748px

#### 배치된 화면 22개

| 화면 이름 | Depth | Row | 섹션 기준 x | 섹션 기준 y |
|-----------|-------|-----|------------|------------|
| vai/onboarding/1 | 1 | 0 | 360 | 1306 |
| vai/onboarding/2 | 1 | 0 | 755 | 1306 |
| vai/tutorial/1 | 2 | 0 | 1630 | 1306 |
| vai/tutorial/2 | 2 | 0 | 2025 | 1306 |
| vai/home/following | 3 | 0 | 2900 | 1306 |
| vai/home/find | 3 | 0 | 3295 | 1306 |
| vai/home/bloomberg-modal | 3 | 1 | 2900 | 2934 |
| vai/chat/1 | 4 | 0 | 4170 | 1306 |
| vai/chat/2 | 4 | 0 | 4565 | 1306 |
| vai/chat/3 | 4 | 1 | 4170 | 2934 |
| vai/chat/4 | 4 | 1 | 4565 | 2934 |
| vai/chat-source/2 | 4 | 1 | 4960 | 2934 |
| vai/chat-source/1 | 5 | 0 | 5440 | 1306 |
| vai/chat-copy/1 | 5 | 0 | 5835 | 1306 |
| vai/chat-bookmark/1 | 5 | 1 | 5440 | 2934 |
| vai/chat-report/1 | 5 | 1 | 5835 | 2934 |
| vai/chat-report/2 | 5 | 2 | 5835 | 4562 |
| vai/search/default | 4 | 2 | 4170 | 4562 |
| vai/search/focused | 4 | 2 | 4565 | 4562 |
| vai/search/manage | 4 | 2 | 4960 | 4562 |
| vai/search/result | 4 | 2 | 5355 | 4562 |
| vai/search/no-result | 4 | 2 | 5750 | 4562 |

#### 추가된 커넥터 21개

주요 연결 흐름:
- onboarding/1 → onboarding/2 → tutorial/1 → tutorial/2 → home/following
- home/following → chat/1 (팔로잉탭 AI 카드 클릭)
- home/find → chat/1
- home/following → bloomberg-modal (조건부: 리서치 탭 미방문 유저)
- home/following → search (+ 아이콘)
- chat/1 → chat/3 (이용약관), chat/4 (구독 유도)
- chat/2 → chat-source/1, chat-copy/1, chat-bookmark/1, chat-report/1
- chat-report/1 → chat-report/2

---

## 레이아웃 규칙 (추출된 상수)

기존 "블룸버그 리서치 조회" 섹션을 역공학해 추출한 레이아웃 상수.

### 수직 상수 (섹션 기준 y)

```
SECTION_MARGIN_TOP  = 360   ← 밴드 상단
BAND_H              = 130   ← 밴드 높이 (fill #3A3A3A)
BAND_BOTTOM         = 490

GAP_BAND_TO_SUBLBL  = 400
SUBLBL_Y (row0)     = 890
SUBLBL_H            = 58    ← 48px Bold 폰트 기준

GAP_SUBLBL_TO_STATE = 165
STATELBL_Y (row0)   = 1113
STATELBL_H          = 44    ← 36px Bold 폰트 기준

GAP_STATE_TO_SCREEN = 170
SCREEN_Y (row0)     = 1327
```

행 간격: 이전 행 화면들의 bottom에서 400px 아래가 다음 행 서브레이블 y.

### 수평 상수

```
SECTION_LEFT_MARGIN = 360   ← 첫 번째 열 시작 x
SCREEN_WIDTH (SW)   = 375   ← iPhone 표준
INTERNAL_GAP (SG)   = 40    ← 같은 Depth 내 화면 간격
DEPTH_GAP (DG)      = 500   ← Depth 열 사이 간격

dx(Depth i) = 360 + i × 1270
→ [360, 1630, 2900, 4170, 5440]
```

---

## 핵심 코드 패턴

### 커넥터 생성 함수 (mkVec)

```javascript
function mkVec(pts, name, sec) {
  var xs = pts.map(function(p){return p[0];});
  var ys = pts.map(function(p){return p[1];});
  var ox = Math.min.apply(null, xs), oy = Math.min.apply(null, ys);
  var v = figma.createVector();
  v.vectorNetwork = {
    vertices: pts.map(function(p){return {x: p[0]-ox, y: p[1]-oy};}),
    segments: pts.slice(0,-1).map(function(_,i){return {start:i, end:i+1};}),
    regions: []
  };
  v.x = ox; v.y = oy;
  v.fills = [];
  v.strokes = [{type:'SOLID', color:{r:0.478,g:0.478,b:0.478}}];
  v.strokeWeight = 2;
  v.strokeCap = 'ARROW_EQUILATERAL'; // 도착 vertex에만 적용
  v.name = 'conn:' + name;
  sec.appendChild(v);
  return v;
}
```

Z-shape 커넥터 좌표 패턴:
```javascript
// midX = 두 화면 사이 갭의 수직 구간 x
[[dep[0], dep[1]], [midX, dep[1]], [midX, arr[1]], [arr[0], arr[1]]]
```

### Task → Master 화면 복제

```javascript
await figma.setCurrentPageAsync(taskPage);
const src = taskPage.findAll(n => n.name === 'vai/screen/name')[0];

await figma.setCurrentPageAsync(masterPage);
const clone = src.clone();
sec.appendChild(clone);
clone.x = target_x;  // 섹션 기준 상대 좌표
clone.y = target_y;
```

---

## 막힌 지점 (Blockers)

### 1. Figma Section 내 노드 접근 불가

**현상**: `figma.getNodeById('sectionsNodeId')` → null 반환  
**원인**: Figma Plugin API에서 비현재 페이지의 SectionNode는 children이 빈 배열로 반환됨  
**해결**: `await figma.setCurrentPageAsync(targetPage)` 로 페이지 먼저 전환 후 접근

```javascript
// 잘못된 방법
const sec = figma.getNodeById('16073:3930'); // null

// 올바른 방법
await figma.setCurrentPageAsync(masterPage);
const sec = figma.getNodeById('16073:3930'); // 정상 접근
```

### 2. createConnector() 미지원

**현상**: `figma.createConnector()` → 함수 없음 오류  
**원인**: Figma Plugin API에 커넥터 생성 함수가 없음  
**해결**: `figma.createVector()` + `vectorNetwork` 수동 설정으로 커넥터와 동일한 벡터 생성

### 3. vectorNetwork 누적 오프셋 버그

**현상**: 기존 커넥터를 업데이트할 때 좌표가 이상하게 이동  
**원인**: `vectorNetwork` 재설정 시 기존 `v.x`, `v.y` 오프셋에 새 좌표가 누적됨  
**해결**: 업데이트 전 반드시 `v.x = 0; v.y = 0;` 리셋 필요

### 4. Cross-page 화면 복제 좌표 혼동

**현상**: Task 페이지에서 clone한 화면을 Master 섹션에 appendした 후 좌표가 맞지 않음  
**원인**: `appendChild` 전후로 좌표 기준이 page-absolute → section-relative로 바뀜  
**해결**: `sec.appendChild(clone)` 직후에 섹션 기준 상대 좌표로 x/y 설정

### 5. 커넥터 겹침 문제

**현상**: 동일 Depth 갭을 통과하는 커넥터가 겹쳐서 어떤 연결인지 불명확  
**해결**: 갭을 N등분해 midX 분리
- 커넥터 2개: 갭 내 1/3 지점, 2/3 지점
- 커넥터 3개: 1/4, 1/2, 3/4 지점
- 타겟이 먼 커넥터 → midX를 갭 좌측에 배치

### 6. 서브레이블 높이 불일치

**현상**: V.AI 섹션 화면 y가 기준 섹션(블룸버그)과 다름  
**원인**: V.AI 섹션 작업 시 서브레이블 `textAutoResize` 실행 전 높이를 36px로 잘못 사용 (정상: 58px)  
**영향**: 화면 y = 1306 (정상: 1327)  
**향후 처리**: 신규 섹션은 Bloomberg 기준(h=58, screen y=1327) 통일

---

## 현재 작업 상태 (2026-06-12 기준)

| 항목 | 상태 |
|------|------|
| V.AI 개선 플로우 섹션 생성 | ✅ 완료 |
| 화면 22개 배치 | ✅ 완료 |
| 커넥터 21개 추가 | ✅ 완료 |
| 레이아웃 상수 문서화 | ✅ 완료 |
| 자동화 스크립트 패키징 | ⬜ 미착수 |
| 신규 화면 추가 자동화 | ⬜ 미착수 |

---

## 다음 행동 (Next Actions)

### 즉시 가능한 작업

1. **신규 화면 추가 자동화**  
   Task 페이지에 새 화면이 생겼을 때 한 줄 요청으로 Master 섹션에 추가  
   ```
   "vai/home/new-feature 화면 D3 Row1에 추가해줘"
   ```

2. **서브레이블 높이 통일**  
   V.AI 섹션의 서브레이블 h를 36 → 58로 수정, 이에 따른 화면 y 1306 → 1327 일괄 조정

3. **스트로크 마커 활용**  
   위치가 바뀐 화면에 stroke를 추가해두면 Claude가 자동으로 필터링해 위치 재조정 가능

### 중장기 자동화 아이디어

4. **Task 페이지 스캔 → Master 자동 동기화**  
   Task 페이지의 모든 `vai/` 프리픽스 화면을 스캔해 Master에 없는 화면 감지 → 자동 추가

5. **플로우 정의 파일 기반 생성**  
   JSON으로 플로우 정의 (`screens`, `connections`, `layout`)를 작성하면 Claude가 Figma에 자동 생성

   ```json
   {
     "section": "V.AI 개선 플로우",
     "screens": [
       {"name": "vai/onboarding/1", "depth": 1, "row": 0},
       ...
     ],
     "connections": [
       {"from": "vai/onboarding/1", "to": "vai/onboarding/2", "trigger": "CTA 버튼"}
     ]
   }
   ```

---

## Claude에게 요청하는 방법 (다른 디자이너를 위한 가이드)

### 기본 패턴

```
"[화면명] 화면을 Master 페이지 V.AI 섹션 D[N] Row[N]에 추가해줘"
```

### 커넥터 추가

```
"vai/home/following → vai/chat/1 커넥터 D3→D4 갭에 추가해줘.
 트리거: 홈 화면 팔로잉탭 AI 카드 클릭 (y=450)"
```

### 전체 섹션 새로 생성

```
"Task 페이지의 vai/ 화면 목록 전체 스캔해서
 Master 페이지에 새 섹션 '[섹션명]' 만들고 레이아웃 상수 기준으로 배치해줘"
```

### 현재 섹션 상태 확인

```
"Master 페이지 V.AI 섹션 현재 상태 확인해줘 — 화면 수, 커넥터 수, 빠진 화면 있는지"
```

---

## 사용 도구 스택

| 도구 | 용도 |
|------|------|
| **Claude (claude-sonnet-4)** | 전체 자동화 오케스트레이션 |
| **Figma MCP** | Figma Plugin API 직접 제어 |
| **Figma Plugin API** | SectionNode 생성, clone, vectorNetwork |

---

## Figma 파일 정보

| 항목 | 값 |
|------|-----|
| 테스트 파일 키 | `TCFQPUYWPmBmwcpo7cCu8w` |
| Master 페이지 노드 | `14753:31917` |
| V.AI 개선 플로우 섹션 | `16073:3930` |
| 기준 섹션 (블룸버그) | `16037:31196` |
