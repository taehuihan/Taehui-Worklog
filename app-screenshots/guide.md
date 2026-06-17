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
| `resize` 후 클리핑 | 반응형(auto-layout) 컴포넌트면 OK, 고정폭이면 우측 잘림 ❌ |
| `rescale()` | 폰트 재배치 필요 → 이 환경엔 **`Pretendard` 없음** → 텍스트 w:1 붕괴 ❌ |
| 자식 constraint→SCALE | 인스턴스 자식은 컴포넌트에 잠겨 변경 불가 ❌ |

**해결:**
- **반응형 화면** (예: vai-home): 라이브 인스턴스 resize로 정상 축소 → 편집 가능 유지
- **고정폭 화면** (예: vai-home/chat): google 인스턴스를 PNG export(scale4) → 사각형 `image fill`(scaleMode FILL)로 배치. 폰트 무관 정상 렌더. 단 **정적**(이후 컴포넌트 수정 미반영)
  - `upload_assets`가 fill 자동적용 안 하면 반환 imageHash로 `node.fills=[{type:'IMAGE',scaleMode:'FILL',imageHash}]` 직접 설정

---

## 도구 스택

| 도구 | 용도 |
|------|------|
| Figma MCP (use_figma / get_screenshot / download_assets / upload_assets) | Figma 제어 |
| python3 + opencv + numpy | 원근 워프, quad 코너 검출 |
| curl | export/upload 자산 전송 |

---

## 환경 주의

- `Pretendard` 폰트 미설치 → 텍스트 재배치 동반 작업(rescale/loadFont) 불가. 한글 화면 스케일은 반응형 resize 또는 이미지화로 우회.
- 인스턴스 자식 constraint 변경 불가 (컴포넌트 잠금).
