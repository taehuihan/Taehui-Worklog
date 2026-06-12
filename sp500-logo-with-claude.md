# S&P 500 로고 500개, Claude와 함께 제작한 방법

> 작성자: 태희  
> 작업 기간: 2026년 5월~6월  
> 대상: Bestway 앱 디자인 시스템 — S&P 500 종목 로고 썸네일 컴포넌트 564개

---

## 배경

Bestway는 S&P 500 500개 종목의 주식 뉴스를 제공하는 앱이다. 각 종목을 시각적으로 구분하기 위해 종목별 로고 썸네일이 필요했다. 500개 로고를 하나씩 직접 제작하는 대신, Claude(AI)와 Figma MCP를 활용해 자동화 파이프라인을 구축했다.

---

## 최종 결과물

- **564개** 로고 컴포넌트 (S&P 500 + 주요 해외 종목 포함)
- Figma Design System 파일 내 `Icon` 페이지 → `Frame 1171275587` 에 16열 그리드로 배치
- 각 컴포넌트: 40×40px, 모서리 반경 4px, 내부 30×30 로고 이미지

---

## 컴포넌트 구조

```
COMPONENT "ticker / {ticker}" [40×40, cornerRadius:4, clipsContent:true]
  fill: 브랜드 배경색 (기본 #F5F5F5)
  └─ RECTANGLE "logo-image" [30×30 @ (5,5)]
       fills: [{ type: IMAGE, scaleMode: FIT }]
```

---

## 전체 프로세스

### 1단계 — 로고 소스 확보

로고를 가져오는 소스를 단계적으로 발전시켰다.

| 순서 | 소스 | 특징 |
|------|------|------|
| 1차 | **Brandfetch API** | 브랜드 컬러 메타데이터 포함, 월 유료 플랜 필요 |
| 2차 | **Logo.dev** | 무료, 그러나 일부 로고 오류 (음식 사진, 히브리어 텍스트 등 엉뚱한 결과) |
| 3차 | **GitHub 오픈소스 레포** (`TryV/S-P-500-Companies-Logos`) | SVG 원본 파일 직접 활용 |
| 4차 | **Wikimedia Commons** | 공식 SVG, 품질 가장 안정적 |
| 5차 | **기업 공식 사이트** | 위키미디어에 없는 경우 직접 수집 |

### 2단계 — SVG → PNG 변환

Figma의 `upload_assets` API는 PNG/JPG만 지원한다. SVG를 PNG로 변환하기 위해 Node.js의 `sharp` 라이브러리를 사용했다.

```bash
cd /tmp && npm install sharp
```

```javascript
const sharp = require('/tmp/node_modules/sharp');
sharp(fs.readFileSync('logo.svg'))
  .trim({ background: '#ffffff', threshold: 10 })  // 여백 자동 제거
  .resize(400, 400, { fit: 'contain', background: { r:255,g:255,b:255,alpha:1 } })
  .png()
  .toFile('logo_hires.png');
```

**포인트:** `trim()`으로 SVG 여백을 제거한 뒤 400×400으로 확대하면 30×30 썸네일에서도 로고가 크게 보인다.

### 3단계 — Figma 컴포넌트 생성 (Figma Plugin API)

Claude가 Figma MCP를 통해 직접 컴포넌트를 생성하고 이미지를 삽입한다.

```javascript
// 1. 컴포넌트 준비
const comp = figma.getNodeById(compId);
while (comp.children.length > 0) comp.children[0].remove();
comp.fills = [{ type: 'SOLID', color: { r:0.957, g:0.957, b:0.957 } }]; // #F5F5F5
const rect = figma.createRectangle();
rect.resize(30, 30); rect.x = 5; rect.y = 5; rect.fills = [];
comp.appendChild(rect);

// 2. 이미지 업로드 (upload_assets 도구)
// → submitUrl 반환

// 3. PNG curl 업로드
// curl -X POST {submitUrl} --data-binary @logo.png
```

### 4단계 — 배경색 결정

로고 종류에 따라 배경색을 다르게 적용했다.

| 상황 | 배경색 |
|------|--------|
| 기본 (대부분) | `#F5F5F5` 밝은 회색 |
| 로고가 밝은 색 (흰색 계열) | `#1A1A1A` 어두운 색 |
| 브랜드 컬러가 있는 경우 | 브랜드 컬러 그대로 사용 |
| 로고 색 = 배경 색 충돌 | light 버전 로고로 교체 또는 `#000000` |

### 5단계 — 작업 현황 관리

Figma 내 별도 프레임 `S&P 500 작업 현황`을 만들어 539개 종목의 진행 상태를 텍스트로 관리했다.

- `●` 초록색 = 로고 완료
- `○` 회색 = 미완료

Claude가 스캔 → 완료된 항목 자동으로 `○ → ●` 업데이트.

---

## 주요 어려움과 해결 방법

### 문제 1: Logo.dev가 엉뚱한 로고를 반환

- MRNA(Moderna) → 히브리어 텍스트 로고
- MKC(McCormick) → 음식 사진
- ROL(Rollins) → 사진 배경에 로고 오버레이

**해결:** GitHub 오픈소스 레포 + Wikimedia Commons SVG로 소스 변경.

### 문제 2: SVG 변환 도구 부재

macOS 환경에서 `cairosvg`, `rsvg-convert`, `inkscape`, `ImageMagick` 모두 설치 불가 또는 libcairo 의존성 문제.

**해결:** `npm install sharp` — Node.js 기반으로 libcairo 없이 SVG 렌더링 가능.

### 문제 3: 워드마크 로고의 썸네일 가독성

Moderna, Regeneron처럼 텍스트만 있는 워드마크 로고는 30×30에서 너무 작게 보임.

**해결:** `trim()`으로 여백 제거 후 `contain`으로 리사이즈 → 로고가 박스를 최대한 채우도록.

### 문제 4: 심볼 로고 추출

GlobeLife(GL), KDP(Keurig Dr Pepper) 등 심볼+워드마크가 함께 있는 SVG에서 심볼만 추출 필요.

**해결:** SVG path의 x 좌표를 분석해 좌측(심볼)과 우측(워드마크)을 분리. viewBox를 심볼 영역으로 재설정.

### 문제 5: 상업적 사용 우려

로고 이미지의 저작권 문제 검토 필요.

**해결:** 주식 정보 앱에서의 종목 식별용 로고 사용은 편집적/정보 제공 목적으로 일반적으로 상업적 분쟁 리스크가 낮다. 단, 로고 자체를 상품화하거나 과도하게 크게 사용하지 않는 것이 원칙. 소스는 Wikimedia Commons(공개 라이선스) 우선 사용.

### 문제 6: Figma 플러그인 API 접근 문제

특정 노드(S&P 500 작업 현황 프레임)가 Figma Section 내부에 있어 `figma.getNodeById()`로 접근 불가.

**해결:** `await figma.setCurrentPageAsync(page)` 로 페이지를 먼저 전환한 뒤 접근.

### 문제 7: 배치 업로드 속도

14개 로고를 순차 업로드하면 너무 느림.

**해결:** `upload_assets` 11개 병렬 호출 + `curl & wait` 패턴으로 병렬 처리.

---

## Claude에게 요청하는 방법 (다른 디자이너를 위한 가이드)

### 기본 요청 패턴

```
"[티커명] 로고 Wikimedia에서 찾아서 Figma [컴포넌트ID]에 넣어줘"
```

### 스트로크 마커 활용

교체가 필요한 로고 컴포넌트에 Figma에서 stroke를 추가해두면, Claude가 자동으로 필터링해서 교체 작업을 진행한다.

```
"스트로크 추가된 종목 전부 찾아서 로고 교체해줘"
```

### 작업 현황 동기화

```
"S&P 500 작업현황 문서 업데이트해줘 — 로고 있는 건 초록불로 표시"
```

### 일괄 작업 요청 예시

```
"mrna, cprt, amcr, regn, orly, gehc, are, gl 8개 로고
 Wikimedia SVG 찾아서 400x400 PNG로 변환 후 Figma에 올려줘.
 배경은 #F5F5F5 고정"
```

---

## 사용 도구 스택

| 도구 | 용도 |
|------|------|
| **Claude (claude-sonnet-4)** | 전체 자동화 오케스트레이션 |
| **Figma MCP** | Figma Plugin API 직접 제어 |
| **Node.js + sharp** | SVG → PNG 고해상도 변환 |
| **GitHub CLI (gh)** | 소스 레포 접근 |
| **curl** | PNG 파일 Figma 서버 업로드 |
| **Wikimedia Commons** | 공개 SVG 로고 소스 |
| **Python (정규식)** | SVG 구조 분석, 색상 추출 |

---

## 파일 위치 (로컬)

| 경로 | 내용 |
|------|------|
| `/tmp/svgs/` | GitHub 레포에서 받은 SVG 원본 |
| `/tmp/web_logos/` | Wikimedia에서 받은 SVG + 변환된 고해상도 PNG |
| `/tmp/logos/` | Logo.dev에서 받은 PNG (일부 오류 있음) |
| `/tmp/node_modules/sharp/` | SVG 변환 라이브러리 |

---

## Figma 파일 정보

| 항목 | 값 |
|------|-----|
| Design System 파일 키 | `4eg56nNqkfnsr8ornorMsJ` |
| 로고 컨테이너 프레임 | `2359:3394` |
| 작업 현황 문서 | `5027:36` |
| 그리드 | 16열 × 40행, STEP_X=48, STEP_Y=56 |
| 총 컴포넌트 수 | 564개 |
