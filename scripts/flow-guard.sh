#!/bin/bash
# flow-guard.sh — master-flow 다이어그램 작업 가드 (UserPromptSubmit hook)
# 프롬프트에 플로우 작업 키워드가 있으면 빌드 전 체크리스트를 컨텍스트에 주입한다.
# 목적: 가이드 규칙이 "있어도 안 펴봐서" 깨지는 것을 매 요청마다 강제 리마인드.

input=$(cat)
prompt=$(printf '%s' "$input" | python3 -c "import sys,json; print(json.load(sys.stdin).get('prompt',''))" 2>/dev/null)

# 플로우 작업 키워드 (master-flow 다이어그램 특정 — 광범위한 'figma'는 제외해 오발동 방지)
if printf '%s' "$prompt" | grep -qiE "플로우|커넥터|다이어그램|뎁스|depth|밴드|서브레이블|상태레이블|섹션 ?(생성|재빌드|만들|배치|추가)|master ?페이지|master-flow|블룸버그.*섹션|챌린지.*플로우|내정보.*플로우|v\.?ai.*플로우"; then
  GUIDE="$HOME/Taehui-Worklog/_shared/master-flow/guide.md"
  echo "⚠️ [플로우 작업 가드] 빌드 전 필수 — 기억 복원 금지, SSOT 실측부터:"
  echo "  1. SSOT = guide.md + connect-builder.js 직접 Read (압축·세션전환 직후 기억에서 복원 ❌ · Figma 16097은 2026-07-06 동결 스냅샷)"
  echo "  2. 기준섹션 16037 레이블 배치 실측 — 서브레이블=뎁스(열)별 콘텐츠명 / 상태레이블=화면별 / 단일화면은 상태레이블 생략"
  echo "  3. 0단계 트리거맵 작성 → 행 배치 도출: '다른 트리거→다른 도착화면 N개 = 분기행 N개' (다른 화면을 한 행에 묶지 말 것)"
  echo "  4. 화면·라벨 y는 guide.md §2 수직공식으로 계산 (즉흥 상수 ❌)"
  echo "  5. 빌드 후 검증: 9단계 수치검증(행간격837·도착center·관통0) + 의미검증(트리거·행배치) + 소스 네이티브 커넥터 시각대조"
  echo "  ※ 수치검증 ≠ 의미검증. 상세 규칙: $GUIDE (§현행모델·§2-1 레이블모델·작업순서가드) + connect-builder.js"
fi
exit 0
