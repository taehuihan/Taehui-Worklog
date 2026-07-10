# RealAcademy — 현재 상태 스냅샷

> 상세 이력은 각 작업 폴더의 `YYYY-MM-DD.md` 참조.
> Last updated: 2026-07-10

---

## 작업별 현황

| 작업 | 폴더 | 상태 | 다음 |
|------|------|------|------|
| Live Class 마스터 컴포넌트 중앙화 | [ra-live-class/](ra-live-class/) | 📍26.04 페이지 마스터 7개 → `[Master] Comp` 이동 + 인스턴스 대체 완료 | 다른 날짜 페이지도 중앙화 필요한지 확인 |
| Master 플로우 | [master-flow/](master-flow/) | ✅ 섹션: 학습커스텀 `50686:3312` + 칭찬저금통 `50744:10173` + **학습커스텀-COMP `50809:12120`**. **SSOT 대폭 개정(07-09~10)**: 뎁스→"플로우 단계"·밴드 "Flow Step N" / 세그먼트 마커=**모양 기반**(사각형=세그먼트/다이아=분기점) / 전진 모달=슬래시·커넥터 연결 / **exit-corridor**(바텀시트 2버튼 겹침) / **시각확인 필수**(전 과정). 학습커스텀 재구성=3 세그먼트 행그룹(신규/가입5일후/기존)+전진모달 D3/D4 | ⏭️ `/master-flow-new` 스킬에 comp 정리 단계 연결(미연결) |
| Master 컴포넌트 정리(-COMP) | [master-flow/comp-guide.md](master-flow/comp-guide.md) | ✅ **comp-guide.md 신설(07-10)**: §1 스타일·§2 대상(소스 페이지 마스터만)·§3 배치(부모별 서브트리, 큰→작은 좌→우)·§4 검증. 학습커스텀-COMP 빌드·검증 통과 | ⏭️ 스킬 연결 / 다른 플로우 재검증 |

---

## 대상 / 함정

- **Figma 파일**: `NAy5RTgdGb7UiTU8CcxHL3` (🔍[RA] PAGE UI_Live Class)
- `figma.moveNodesToPage()` 는 존재하지 않음 → `page.appendChild(node)` 루프로 이동.
- 인스턴스 삽입 시 인덱스 shift → 각 노드마다 `indexOf` fresh 재계산 필요.
