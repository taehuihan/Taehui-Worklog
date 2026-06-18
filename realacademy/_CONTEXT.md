# RealAcademy — 현재 상태 스냅샷

> 상세 이력은 각 작업 폴더의 `YYYY-MM-DD.md` 참조.
> Last updated: 2026-06-18

---

## 작업별 현황

| 작업 | 폴더 | 상태 | 다음 |
|------|------|------|------|
| Live Class 마스터 컴포넌트 중앙화 | [ra-live-class/](ra-live-class/) | 📍26.04 페이지 마스터 7개 → `[Master] Comp` 이동 + 인스턴스 대체 완료 | 다른 날짜 페이지도 중앙화 필요한지 확인 |

---

## 대상 / 함정

- **Figma 파일**: `NAy5RTgdGb7UiTU8CcxHL3` (🔍[RA] PAGE UI_Live Class)
- `figma.moveNodesToPage()` 는 존재하지 않음 → `page.appendChild(node)` 루프로 이동.
- 인스턴스 삽입 시 인덱스 shift → 각 노드마다 `indexOf` fresh 재계산 필요.
