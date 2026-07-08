# 팀 공유 — 플로우 작업 가드 hook 설치

master-flow 다이어그램 작업 시 **빌드 전 가이드 체크리스트를 자동 주입**하는 hook이다.
가이드 규칙이 "있어도 안 펴봐서" 깨지는 것을 매 요청마다 강제 리마인드한다.

## 전제

1. **Claude Code** 설치 + **Figma MCP**(플러그인) 연결
2. 이 repo(`Taehui-Worklog`)를 **`~/Taehui-Worklog`** 경로에 clone (스크립트가 이 경로를 참조)

## 설치 — 본인 글로벌 설정에 hook 등록

`~/.claude/settings.json` 의 `hooks` 에 아래 `UserPromptSubmit` 블록을 추가한다.
(이미 다른 hook이 있으면 `hooks` 객체 안에 **병합** — 기존 것 지우지 말 것)

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash \"$HOME/Taehui-Worklog/scripts/flow-guard.sh\"",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

## 활성화

등록 후 `/hooks` 메뉴를 한 번 열거나 Claude Code를 재시작하면 다음 프롬프트부터 작동한다.
플로우/섹션/커넥터 등 키워드가 있는 요청에서만 체크리스트가 뜨고, 무관한 요청엔 조용하다.

## 동작 확인

```bash
echo '{"prompt":"블룸버그 섹션 만들어줘"}' | bash ~/Taehui-Worklog/scripts/flow-guard.sh   # 체크리스트 출력
echo '{"prompt":"오늘 날씨?"}'              | bash ~/Taehui-Worklog/scripts/flow-guard.sh   # 빈 출력(정상)
```

## 규칙 본체

- 체크리스트 상세: `_shared/master-flow/guide.md` (§현행모델·§2-1 레이블모델·작업순서가드) + `connect-builder.js`
- 규칙 SSOT: `_shared/master-flow/guide.md` + `connect-builder.js` (프로덕트 무관 중앙 위치, 2026-07-08 이관. Figma `16097:3930`은 2026-07-06부로 동결 스냅샷)

---

## 스킬 셋업 (다른 디자이너용)

이 문서는 **hook** 설치만 다룬다. master-flow 스킬(`/master-flow-new`·`/master-flow-update`) 셋업 — clone 경로·사전 조건·쓰는 법 — 은 레포 최상위 [README.md](../README.md)의 **"다른 디자이너 온보딩"** 섹션이 정본이다. (여기 중복하지 않는다.)
