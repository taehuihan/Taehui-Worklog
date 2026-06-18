# 앱스크린샷 목업 화면 교체 가이드

VestWay 마케팅/앱스토어용 폰 목업의 화면 이미지·콘텐츠를 교체하는 작업 가이드.

**대상 파일:** [VW] VestWay 디자인 (`zsbXUBaPLvxiYwOMFCtFsS`), 앱스크린샷 페이지.

---

## 두 가지 목업 유형

### A. baked-perspective 목업 (마케팅 듀얼폰, google_1/_2 등)
- 화면 레이어 이름 `👈` (VECTOR, IMAGE fill, scaleMode FIT, identity transform)
- 원근 왜곡이 **소스 PNG에 baked**되어 있음 → 평면 스크린샷 그냥 못 넣음

**교체 절차:**
1. `get_design_context`로 구조 파악, `download_assets`로 기존 fill PNG 추출 (원근 baked 확인)
2. opencv로 화면 quad 코너 검출: alpha>16 마스크 → 최대 컨투어 → `approxPolyDP(c, 0.02*arcLength, True)` → 4점 (sum/diff로 TL/TR/BR/BL 정렬). 같은 목업이면 좌/우 quad 동일
3. 신규 평면 스크린샷 고해상도 추출(`download_assets defaultScale 4`)
4. `cv2.getPerspectiveTransform(평면 full-rect → quad)` + `warpPerspective`, 캔버스 종횡비는 원본 fill과 동일(예 1000:846), 2배 출력 OK
5. `upload_assets(nodeId, scaleMode FIT)` → submitUrl에 `curl -F "file=@warped.png;type=image/png"` POST

**컴포넌트 상속:** `👈`는 목업 컴포넌트 내부 노드라, fill 한 번 교체하면 모든 인스턴스에 자동 상속 (크기 달라도 종횡비 같으면 OK).

### B. 라이브 화면 인스턴스 (앱스토어 6.5형/5.5형, google_3~5 등)
- 화면이 라이브 앱화면 컴포넌트 인스턴스 (레이어명 `img-N`), 번호(N)로 google ↔ 앱스토어 매칭
- 똑바로 선 포트레이트 (원근 없음)

**google_N → 앱스토어 복제:**
- ⚠️ `swapComponent`는 오버라이드(커스텀 콘텐츠) 누락 → **반드시 `clone()`** 으로 오버라이드까지 복제
- 크기: 6.5형 = google와 동일 w·h / 5.5형 = ×(270/310)=0.871 비례 축소
- 위치(414폭 기준): 6.5형 x=52 y=288, 5.5형 x=72 y=264 (center 정렬)

---

## 5.5형 축소 시 우측 잘림 (핵심 함정)

5.5형은 270폭으로 줄여야 하는데, 화면 컴포넌트가 **반응형이 아니면 resize가 콘텐츠를 클리핑**함.

| 방법 | 결과 |
|------|------|
| ✅ **`clone()` + `rescale(270/310)`** | **1순위.** 콘텐츠까지 비례 축소 → 잘림 없음, **편집 가능 벡터 유지** |
| `resize` | 프레임 경계만 축소, 콘텐츠 미스케일 → 고정폭이면 우측 잘림 ❌ |
| PNG export + image fill | export bbox 종횡비 ≠ RECT 종횡비면 잘림, 정적/비편집 ⚠️ fallback용 |
| 자식 constraint→SCALE | 인스턴스 자식은 컴포넌트에 잠겨 변경 불가 ❌ |

**✅ 권장 절차 (2026-06-18 검증):**
```js
const cloned = googleScreen.clone();
parent.appendChild(cloned);
cloned.rescale(270/310);   // 콘텐츠까지 비례 축소
cloned.x = sx; cloned.y = sy;  // rescale이 좌표도 바꾸므로 재설정 필수
```
- ⚠️ 기존엔 "rescale은 Pretendard 폰트 붕괴"로 알려졌으나, **6개 화면(vai-home/Frame/MO 챌린지·투자연습) 전부 폰트 오류 없이 rescale 성공.** → 무조건 PNG로 도망갈 필요 없음. rescale 먼저 try, 실패 화면만 PNG fallback.

**PNG fallback (rescale 실패 시만):**
- google 인스턴스를 PNG export(scale4) → 사각형 `image fill`로 배치. 폰트 무관 정상 렌더. 단 **정적**(이후 컴포넌트 수정 미반영)
- ⚠️ scaleMode **FILL은 종횡비 불일치 시 잘림** → **FIT 권장** 또는 RECT를 PNG 종횡비에 맞출 것
- `upload_assets`가 fill 자동적용 안 하면 imageHash로 `node.fills=[{type:'IMAGE',scaleMode:'FIT',imageHash}]` 직접 설정

## 워딩 동기화 (폰트 잠김 우회)

앱스토어 워딩이 google과 다를 때, `text.characters=` 직접 수정은 **Pretendard 로드 실패로 막힘**. → google 텍스트 프레임(`Frame 427319802`)을 통째로 `clone()`해서 기존 위치(x,y)에 붙이고 old 제거. 폰트 무관하게 교체됨.

## 업로드 임시 노드 정리

`upload_assets`(nodeId 없이 count 호출)는 캔버스에 임시 프레임 자동 생성(응답 `placedOnNodeId`). 작업 후 `.remove()`로 정리. 또 `download_assets`는 compound 노드 ID(`I...;...`) 미지원 → 부모 인스턴스 ID로 우회.

---

## 도구 스택

| 도구 | 용도 |
|------|------|
| Figma MCP (use_figma / get_screenshot / download_assets / upload_assets) | Figma 제어 |
| python3 + opencv + numpy | 원근 워프, quad 코너 검출 |
| curl | export/upload 자산 전송 |

---

## 환경 주의

- `Pretendard` 폰트 미설치 → `loadFontAsync`/`text.characters=` 직접 수정 불가. 워딩 교체는 텍스트 프레임 `clone()`으로 우회.
- 단, `rescale()`은 폰트 붕괴 위험이 알려진 것과 달리 실제로는 화면 다수에서 성공 → 5.5형 축소는 rescale 1순위로 시도.
- 인스턴스 자식 constraint 변경 불가 (컴포넌트 잠금).
