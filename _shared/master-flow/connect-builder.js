/**
 * connect-builder.js — 플로우 커넥터 빌더 (가이드 규칙을 코드 불변식으로 강제)
 * 짝 문서: guide.md(현행 §5/§6) + Figma SSOT 16097:3930. 가이드=무엇/왜, 이 파일=어떻게.
 *
 * ── 사용법 (중요) ───────────────────────────────────────────────
 * Figma MCP(use_figma)는 로컬 파일 require 불가 → 이 파일을 **Read로 읽어 그 코드를
 * use_figma 호출에 그대로 주입(verbatim)**한다. 기억/이전 대화에서 재구성 금지(드리프트 차단).
 * 호출 예:
 *   // <이 파일 내용 전체 붙여넣기>
 *   const sec = await figma.getNodeByIdAsync('<섹션id>');
 *   return buildConnectors(sec, [
 *     {from:[795,1327], to:[3640,1327], trig:{text:'챌린지 상태'},   name:'챌린지홈>종목선택'},
 *     {from:[795,1327], to:[3640,4707], trig:{text:'누적 상금'},     name:'챌린지홈>내상금내역'},
 *     ...
 *   ]);
 *
 * ── 스펙 형식 ───────────────────────────────────────────────────
 *   {from:[x,y], to:[x,y], trig:{text:'행라벨'} | {name:'컴포넌트명'}, name:'출발>도착'}
 *   - from/to : 섹션-상대 좌표(화면 좌상단). 빌더가 그 위치의 클론 화면을 찾음.
 *   - trig    : {text:'행 라벨'} **권장**(행을 유일하게 식별). {name:...}은 화면 내 유일할 때만.
 *               ⚠️ 동명 아이콘(arrow_right 등 다중 매칭)을 name으로 질의하면 엉뚱한 걸 잡음 → text로.
 *
 * ── 강제하는 규칙 (전부 코드 불변식 + 결과 실측 검증) ──────────────
 *  1. 출발 = 트리거 컴포넌트 모서리. 텍스트 라벨이 **좁은 버튼형 조상**(INSTANCE/COMPONENT h≤80 폭<0.5W)
 *     안에 있으면 그 버튼 우측(규칙1.5 — CTA/pill, 태블릿 1280 검증). 메뉴/리스트 행(넓은 행)이면
 *     **라벨 cy 최근접 '우측 끝 아이콘'**(셰브론/화살표), 넓은 카드/버튼·독립 링크는 자기 우측.
 *     (라벨 텍스트 모서리 ❌) — 행컨테이너는 아이콘 없을 때 폴백.
 *  2. 첫 방향전환 = 트리거 화면 우측 +20px 이후 (firstBend_x ≥ from.right+20).
 *     예외(이탈 코리도): 같은 화면 다중 출발 중 **오른쪽에 같은-y 형제 트리거**가 있으면(가로지름·겹침),
 *     그 커넥터는 버튼 우측서 **화면 위/아래(from.y1-44 or y2+44)로 세로 이탈** 후 우측 라우팅 → 겹침·버튼 관통 방지.
 *  3. 화면 관통 0 — 출발/도착 외 모든 화면 bbox와 충돌검사 통과한 경로만 채택(자동 위/아래 우회).
 *  4. 도착 = 도착 화면 좌변 세로 중앙.
 *  5. 팬아웃 레인 분리 — 같은 출발 그룹은 도착(행) 순서로 레인 분산.
 *  6. 트리거/경로 못 찾으면 **날조 대신 실패 보고**(r:'트리거못찾음'|'경로없음').
 *
 * ── 한계 (반드시 인지) ──────────────────────────────────────────
 *  • 수치검증(관통·도착·꺾임)은 **트리거의 *의미* 오류를 못 잡는다.** 엉뚱한 동명 아이콘을 잡아도
 *    기하적으론 통과함. 빌드 후 **소스 네이티브 커넥터/시각 대조 필수**. report의 ambiguous=true 주의.
 *  • **「행 배치 *의미*」 오류도 같은 한계.** 행간격(837)·도착center 수치검증은 통과해도, 다른 화면을
 *    한 행에 잘못 묶은 건 못 잡는다 → 빌드 전 verifyRowBranching(specs)로 가드. (블룸버그 v2, 2026-06-26)
 *  • selling→약관안내처럼 소스에 트리거가 없는 전환은 스펙에 넣지 말 것(날조 금지).
 *
 * 갱신 이력: 2026-06-24 정본화 / 2026-06-26 verifyRowBranching 추가(다른 화면=분기행 가드) /
 *   2026-07-06 규칙1.5 버튼조상 추가 — 태블릿(1280)에서 비율 상수(0.55W/0.3W/0.5W)가 CTA(397px)·pill을
 *   전부 탈락시켜 텍스트 폴백(버튼 안 텍스트 우측)·우측끝아이콘 오인(book 아이콘)이 발생한 갭 수정 (RA 학습 커스텀).
 */
function buildConnectors(sec, specs) {
  const SX = sec.absoluteBoundingBox.x, SY = sec.absoluteBoundingBox.y;
  const screens = sec.children
    .filter(c => ['FRAME', 'INSTANCE', 'SECTION'].includes(c.type))
    .map(c => { const b = c.absoluteBoundingBox; return { node: c,
      x1: Math.round(b.x - SX), y1: Math.round(b.y - SY),
      x2: Math.round(b.x + b.width - SX), y2: Math.round(b.y + b.height - SY),
      cy: Math.round(b.y + b.height / 2 - SY) }; });
  const findScreen = (x, y) => screens.find(s => Math.abs(s.x1 - x) < 8 && Math.abs(s.y1 - y) < 8);

  // 트리거 해석: 행 라벨 → 행 컨테이너 우측(아이콘 위치). 넓은 카드/독립 링크는 자기 우측.
  function findTrigger(scr, q) {
    let cs = q.name
      ? scr.node.findAll(n => n.absoluteBoundingBox && new RegExp(q.name).test(n.name || ''))
      : scr.node.findAll(n => n.type === 'TEXT' && n.absoluteBoundingBox && (n.characters || '').includes(q.text));
    if (!cs.length) return null;
    cs.sort((a, b) => { const r = t => ['INSTANCE', 'COMPONENT'].includes(t.type) ? 0 : 1;
      if (r(a) !== r(b)) return r(a) - r(b);
      const A = x => x.absoluteBoundingBox.width * x.absoluteBoundingBox.height; return A(a) - A(b); });
    const a = cs[0], ab = a.absoluteBoundingBox, sb = scr.node.absoluteBoundingBox, cy = ab.y + ab.height / 2;
    const ambiguous = cs.length > 1, RE = sb.x + sb.width;
    // 1) 넓은 카드/버튼 → 자기 우측
    if (ab.width > sb.width * 0.55)
      return { x2: Math.round(ab.x + ab.width - SX), cy: Math.round(cy - SY), ambiguous, via: '요소자체' };
    // 1.5) 텍스트 매치 → 좁은 버튼형 조상(INSTANCE/COMPONENT, h≤80, 폭<0.5W) 우측 — CTA·pill 버튼.
    //     화면폭 무관(비율 상수가 태블릿 1280에서 CTA를 전부 탈락시키는 갭 수정, 2026-07-06).
    //     넓은 메뉴행(≥0.5W)은 건너뜀 → 기존 2) 우측끝아이콘 동작 보존.
    if (q.text) { let bp = a.parent;
      while (bp && bp !== scr.node) { const bb = bp.absoluteBoundingBox;
        if (bb && ['INSTANCE', 'COMPONENT'].includes(bp.type) && bb.height <= 80 && bb.width < sb.width * 0.5)
          return { x2: Math.round(bb.x + bb.width - SX), cy: Math.round(bb.y + bb.height / 2 - SY), ambiguous, via: '버튼조상' };
        bp = bp.parent; } }
    // 2) 라벨 cy에 '가장 가까운' 우측 끝 아이콘(작은 인터랙티브, 화면 우측 70px 내, ±65).
    //    촘촘한 메뉴행은 최근접으로 구분, 라벨-아이콘 세로 오프셋(상금 행 등)도 포착. 시작 y는 아이콘 cy.
    let ric = scr.node.findAll(n => { const b = n.absoluteBoundingBox;
      return b && n !== a && ['INSTANCE', 'VECTOR', 'FRAME', 'COMPONENT'].includes(n.type)
        && b.width < sb.width * 0.3 && b.height < 80
        && (b.x + b.width) > RE - 70 && (b.x + b.width) <= RE + 2
        && (b.x + b.width) > ab.x + ab.width && Math.abs(b.y + b.height / 2 - cy) < 65; });
    if (ric.length) { ric.sort((p, q2) => Math.abs(p.absoluteBoundingBox.y + p.absoluteBoundingBox.height / 2 - cy) - Math.abs(q2.absoluteBoundingBox.y + q2.absoluteBoundingBox.height / 2 - cy));
      const r = ric[0].absoluteBoundingBox; return { x2: Math.round(r.x + r.width - SX), cy: Math.round(r.y + r.height / 2 - SY), ambiguous, via: '우측끝아이콘' }; }
    // 3) 행 컨테이너(폭 0.5~0.97, 높이<130) 우측 — 우측끝 아이콘이 없을 때
    let row = a.parent, d = 0;
    while (row && d < 5) { const rb = row.absoluteBoundingBox;
      if (rb && rb.width > sb.width * 0.5 && rb.width < sb.width * 0.97 && rb.height < 130)
        return { x2: Math.round(rb.x + rb.width - SX), cy: Math.round(cy - SY), ambiguous, via: '행컨테이너' };
      row = row.parent; d++; }
    // 4) 최후: 독립 링크/요소는 자기 우측
    return { x2: Math.round(ab.x + ab.width - SX), cy: Math.round(cy - SY), ambiguous, via: '요소자체(폴백)' };
  }

  // 기하: 직교 세그먼트 vs 화면 충돌
  const M = 2;
  const segHit = (a, b, r) => Math.max(a[0], b[0]) > r.x1 + M && Math.min(a[0], b[0]) < r.x2 - M
    && Math.max(a[1], b[1]) > r.y1 + M && Math.min(a[1], b[1]) < r.y2 - M;
  const pathHits = (p, obs) => { for (let i = 0; i < p.length - 1; i++) for (const r of obs) if (segHit(p[i], p[i + 1], r)) return r; return null; };

  // 경로: 출발(트리거 모서리)→화면+20 직진 후 첫꺾임→갭/우회→도착 화면 좌변 중앙
  function route(from, to, trig, lane, corridorY) {
    const s = [trig.x2, trig.cy], t = [to.x1, to.cy], ex = from.x2 + 20;
    const obs = screens.filter(o => o !== from && o !== to);
    const xs = [lane]; const ivs = obs.map(o => [o.x1, o.x2]).sort((a, b) => a[0] - b[0]); let cur = from.x2;
    for (const [a, b] of ivs) { if (a > cur + 20) xs.push((cur + a) >> 1); cur = Math.max(cur, b); }
    xs.push(to.x1 - 60, (from.x2 + to.x1) >> 1);
    const viaXs = xs.filter(x => x >= ex && x < to.x1 + 10);
    // 이탈 코리도(같은 화면 형제 버튼 회피): 출발 버튼 우측에서 화면 위/아래로 세로 이탈 후 우측 라우팅 → 겹침·버튼 관통 방지
    if (corridorY != null) {
      for (const vx of viaXs) { const p = [s, [s[0], corridorY], [vx, corridorY], [vx, t[1]], t]; if (!pathHits(p, obs)) return p; }
      for (const vx of viaXs) { const p = [s, [s[0], corridorY], [ex, corridorY], [ex, t[1]], [vx, t[1]], t]; if (!pathHits(p, obs)) return p; }
    }
    const band = obs.filter(o => o.x2 > from.x2 - 20 && o.x1 < to.x1 + 20);
    const tYs = [from.y1 - 44, from.y2 + 44, to.y1 - 44, to.y2 + 44].concat(band.map(o => o.y2 + 44)).concat(band.map(o => o.y1 - 44));
    for (const vx of viaXs) { const p = [s, [vx, s[1]], [vx, t[1]], t]; if (!pathHits(p, obs)) return p; }           // 직진→꺾(vx≥ex)
    for (const ty of tYs) for (const vx of viaXs) { const p = [s, [ex, s[1]], [ex, ty], [vx, ty], [vx, t[1]], t]; if (!pathHits(p, obs)) return p; } // +20직진→우회
    return null;
  }

  function mkVec(pts, name) {
    const ox = Math.min(...pts.map(p => p[0])), oy = Math.min(...pts.map(p => p[1])), last = pts.length - 1;
    const v = figma.createVector();
    v.vectorNetwork = { vertices: pts.map((p, i) => ({ x: p[0] - ox, y: p[1] - oy, strokeCap: i === last ? 'ARROW_EQUILATERAL' : 'NONE' })),
      segments: pts.slice(0, -1).map((_, i) => ({ start: i, end: i + 1 })), regions: [] };
    v.x = ox; v.y = oy; v.fills = []; v.strokes = [{ type: 'SOLID', color: { r: 0.478, g: 0.478, b: 0.478 } }];
    v.strokeWeight = 2; v.name = 'conn:' + name; sec.appendChild(v);
  }

  // 기존 커넥터 제거 + 화면·트리거 사전 해석 + 레인·이탈 코리도 배정
  sec.children.filter(c => c.name && /^conn:/.test(c.name)).forEach(c => c.remove());
  specs.forEach(sp => { sp._from = findScreen(...sp.from); sp._to = findScreen(...sp.to);
    sp._trig = (sp._from && sp._to) ? findTrigger(sp._from, sp.trig) : null; });
  const groups = {};
  specs.forEach(sp => { if (sp._from && sp._to && sp._trig) (groups[sp.from.join()] = groups[sp.from.join()] || []).push(sp); });
  for (const k in groups) { const g = groups[k]; const from = g[0]._from;
    g.sort((a, b) => a._to.cy - b._to.cy || a._to.x1 - b._to.x1);
    const minToX = Math.min(...g.map(s => s._to.x1)), lo = from.x2 + 120, hi = minToX - 60;
    g.forEach((sp, i) => { sp.lane = g.length > 1 ? Math.round(lo + (hi - lo) * (i + 0.5) / g.length) : Math.round((lo + hi) / 2); });
    // 이탈 코리도: 트리거 x순 정렬, 오른쪽에 같은-y(±80) 형제 트리거가 있으면(가로지름) 화면 위/아래로 우회
    const byTx = [...g].sort((a, b) => a._trig.x2 - b._trig.x2);
    byTx.forEach((sp, i) => { const crossesRight = byTx.slice(i + 1).some(o => Math.abs(o._trig.cy - sp._trig.cy) < 80);
      sp.corridorY = crossesRight ? (sp._to.cy < sp._trig.cy ? from.y1 - 44 : from.y2 + 44) : null; }); }

  // 빌드 + 검증
  const report = [];
  for (const sp of specs) {
    const from = sp._from, to = sp._to, trig = sp._trig;
    if (!from || !to) { report.push({ n: sp.name, r: '화면못찾음' }); continue; }
    if (!trig) { report.push({ n: sp.name, r: '트리거못찾음' }); continue; }
    const pts = route(from, to, trig, sp.lane, sp.corridorY);
    if (!pts) { report.push({ n: sp.name, r: '경로없음(관통회피불가)' }); continue; }
    mkVec(pts, sp.name);
    const b1 = pts[1], l = pts[pts.length - 1];
    // 첫꺾임: 표준=우측 직진 후 꺾임 / 코리도=버튼 우측서 세로 이탈(같은 x)
    const firstOK = sp.corridorY != null ? (pts[0][0] === b1[0]) : (pts[0][1] === b1[1] && b1[0] >= from.x2 + 20);
    report.push({ n: sp.name, 출발: [trig.x2, trig.cy], via: trig.via, corridor: sp.corridorY != null,
      ambiguous: trig.ambiguous || false,
      첫꺾임: firstOK ? 'ok' : 'VIOLATION',
      도착중앙: l[1] - to.cy === 0 ? 'ok' : (l[1] - to.cy),
      관통: pathHits(pts, screens.filter(o => o !== from && o !== to)) ? 'HIT' : 'ok' });
  }
  return report;
}

/**
 * ── 트리거 맵 추출 프로세스 (빌드 前 0단계, "누락 0" 설계) ─────────────
 * 위→아래(커넥터) + 아래→위(버튼) 양방향으로 봐야 누락이 0이 된다.
 *  1. 소스 네이티브 커넥터 **전수** 읽기 (모든 상태·일부만 ❌·position기반도 포함)
 *  2. 각 커넥터 출발점 → **리프 트리거** 해석. 출발이 컨테이너(카드)면
 *     **도착 라벨로 안쪽 버튼 특정** (card→결과확인 ⇒ "결과 확인" 버튼, card→종목선택 ⇒ "수정하기")
 *  3. crossCheckTriggers()로 **버튼 전수 대조** (아래→위 안전망):
 *     - 커버(자기/조상/자손이 커넥터 출발) → 자동 ✓ (사람 검토 X)
 *     - 제외(per-flow 제외목록: 탭바·토글·조건부모달 등) → 자동 (사람 검토 X)
 *     - ⚠️검토(나머지) → 사람이 **소수만** "연결/제외" 1회 판정. 제외는 목록에 기억 → 다음엔 자동.
 * 핵심: 1·2만 하면 *커넥터 자체가 빠진 전환*(예: 챌린지 안내가 소스에 없던 때)을 영영 못 잡음.
 *       3(버튼 전수)이 그 안전망. 단 부담은 "전수검토"가 아니라 "의심 소수 1회 판정".
 *
 * 사용:
 *   const startIds = new Set(소스커넥터.map(c=>c.connectorStart.endpointNodeId));
 *   crossCheckTriggers(홈화면노드, startIds, ['PRO를 구독','Button_square']); // 제외목록
 */
function crossCheckTriggers(homeNode, startNodeIds, exclude) {
  exclude = exclude || [];
  const hb = homeNode.absoluteBoundingBox;
  const covered = n => {
    let p = n; while (p) { if (startNodeIds.has(p.id)) return true; p = p.parent; }      // 자기/조상(카드)
    return homeNode === n ? false : n.findAll(x => startNodeIds.has(x.id)).length > 0;   // 자손
  };
  const ch = n => n.type === 'TEXT' ? (n.characters || '') : '';
  const clicks = homeNode.findAll(n => n.absoluteBoundingBox &&
    ((['INSTANCE', 'COMPONENT'].includes(n.type) && /button|cta|arrow/i.test(n.name || '')) ||
     (n.type === 'TEXT' && /Primary/i.test(n.name || ''))));
  return clicks.map(n => {
    const b = n.absoluteBoundingBox, cy = Math.round(b.y + b.height / 2 - hb.y);
    const label = (ch(n) || n.name || '').slice(0, 16);
    let v = '⚠️검토';
    if (covered(n)) v = '커버';
    else if (exclude.some(e => label.includes(e))) v = '제외';
    return { el: label, cy, 판정: v };
  });
}

/**
 * ── 행 배치 분기 검증 (빌드 前, 「다른 화면=분기행」 누락 가드) ──────────
 * 누락 사례(블룸버그 v2): 홈무료의 chevron→설명, 카드→상세(무료)를 "무료 유저 경로"라는
 * 편의로 한 행에 묶음. 둘은 *다른 트리거*로 가는 *다른 화면*이라 분기행이어야 함.
 *
 * 규칙: 한 출발화면(from)에서 *트리거가 다른* 커넥터들의 도착화면(to)이 **같은 행 y**에 있으면 ⚠️.
 *       (같은 트리거 = 같은 화면의 다른 스테이트 → 같은 행 OK)
 * specs: buildConnectors와 동일 형식. trig.text|trig.name으로 트리거 동일성 판단.
 * ⚠️ §5는 세그먼트 내에서도 항상 적용 — 같은 세그먼트 안에서도 다른 트리거→다른 화면이면 분기행(guide §2-2).
 *    세그먼트 자체는 별도 행 그룹으로 분리(§2-2). 세그먼트 내 화면 분기에도 §5 적용.
 * 반환: [{from, triggers:[...], sameRowY, warn:true}] — warn 있으면 행 분리.
 */
function verifyRowBranching(specs) {
  const rowOf = y => Math.round(y / 100);                 // 행 식별(±100px 허용)
  const trigKey = s => (s.trig && (s.trig.text || s.trig.name)) || '∅';
  const byFrom = {};
  specs.forEach(s => {
    const k = s.from[0] + ',' + s.from[1];
    (byFrom[k] = byFrom[k] || []).push(s);
  });
  const out = [];
  Object.entries(byFrom).forEach(([from, group]) => {
    // 트리거가 서로 다른 도착들 중, 같은 행 y에 몰린 게 있나?
    const byRow = {};
    group.forEach(s => { const r = rowOf(s.to[1]); (byRow[r] = byRow[r] || []).push(s); });
    Object.values(byRow).forEach(rowSpecs => {
      const trigs = [...new Set(rowSpecs.map(trigKey))];
      if (rowSpecs.length > 1 && trigs.length > 1) {
        out.push({ from, triggers: trigs, sameRowY: rowSpecs[0].to[1],
          names: rowSpecs.map(s => s.name), warn: true,
          msg: '다른 트리거의 다른 화면이 같은 행 → 분기행으로 분리 (세그먼트가 같아도 §5 적용)' });
      }
    });
  });
  return out.length ? out : [{ ok: true, msg: '행 배치 분기 위반 없음' }];
}
