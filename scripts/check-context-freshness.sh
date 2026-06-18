#!/usr/bin/env bash
#
# check-context-freshness.sh
#
# 각 CONTEXT 스냅샷의 "Last updated" 날짜가, 실제 최신 작업 로그(YYYY-MM-DD.md)보다
# 오래됐는지 검사한다. 오래됐으면 stale 경고를 띄운다.
#
# 검사 대상:
#   - 루트 CONTEXT.md      ← 레포 전체의 가장 최신 로그와 비교
#   - {product}/_CONTEXT.md ← 그 프로덕트 폴더 안의 가장 최신 로그와 비교
#
# 사용: 새 세션 시작 시 실행. 경고가 나오면 해당 CONTEXT를 곧이곧대로 믿지 말고
#       실제 로그 / git 상태를 먼저 확인한다.
#
# 종료 코드: stale 항목이 하나라도 있으면 1, 모두 최신이면 0.

set -euo pipefail

# 레포 루트로 이동 (스크립트 위치 기준)
cd "$(dirname "$0")/.."

# "Last updated: YYYY-MM-DD" 추출
get_context_date() {
  local file="$1"
  grep -m1 -oE 'Last updated:[[:space:]]*[0-9]{4}-[0-9]{2}-[0-9]{2}' "$file" 2>/dev/null \
    | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}' || true
}

# 디렉터리 하위에서 가장 최신 YYYY-MM-DD.md 파일명의 날짜
get_latest_log_date() {
  local dir="$1"
  find "$dir" -type f -name '20[0-9][0-9]-[0-9][0-9]-[0-9][0-9].md' 2>/dev/null \
    | sed -E 's#.*/([0-9]{4}-[0-9]{2}-[0-9]{2})\.md#\1#' \
    | sort | tail -1 || true
}

stale_found=0

check() {
  local label="$1" context_file="$2" search_dir="$3"

  if [[ ! -f "$context_file" ]]; then
    return
  fi

  local ctx_date latest_date
  ctx_date="$(get_context_date "$context_file")"
  latest_date="$(get_latest_log_date "$search_dir")"

  if [[ -z "$ctx_date" ]]; then
    printf '  ⚠️  %-14s %s 에 "Last updated: YYYY-MM-DD" 가 없음\n' "$label" "$context_file"
    stale_found=1
    return
  fi

  if [[ -z "$latest_date" ]]; then
    printf '  ✅  %-14s 로그 없음 (CONTEXT %s)\n' "$label" "$ctx_date"
    return
  fi

  # 문자열 비교로 충분 (YYYY-MM-DD는 사전식 = 시간순)
  if [[ "$ctx_date" < "$latest_date" ]]; then
    printf '  ⚠️  %-14s STALE — CONTEXT %s < 최신 로그 %s\n' "$label" "$ctx_date" "$latest_date"
    stale_found=1
  else
    printf '  ✅  %-14s 최신 (CONTEXT %s ≥ 로그 %s)\n' "$label" "$ctx_date" "$latest_date"
  fi
}

echo "── CONTEXT freshness 검사 ──"

# 루트: 레포 전체 최신 로그와 비교
check "전체" "CONTEXT.md" "."

# 각 프로덕트
for ctx in */_CONTEXT.md; do
  [[ -e "$ctx" ]] || continue
  product_dir="$(dirname "$ctx")"
  check "$product_dir" "$ctx" "$product_dir"
done

echo "───────────────────────────"
if [[ "$stale_found" -eq 1 ]]; then
  echo "⚠️  stale 항목 있음 → 해당 CONTEXT를 믿지 말고 실제 로그/git 상태를 먼저 확인하세요."
  exit 1
else
  echo "✅ 모든 CONTEXT 최신."
  exit 0
fi
