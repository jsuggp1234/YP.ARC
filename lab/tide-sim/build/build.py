# tide-sim 빌드: source.html(원래 한국어판)에서 사이트 디자인을 입힌 두 판을 만들어요.
#   python build.py  →  ../index.html (English, 기본)  +  ../ko.html (한국어)
# 내용을 고칠 때는 source.html(시뮬레이터 원본)이나 이 파일을 고친 뒤 다시 실행해요.
# 영어 글: HTML은 아래 HTML_EN, 스크립트 안 한국어 조각은 runs.json 순서대로 en_runs.py.
import re, json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = open(os.path.join(HERE, "source.html"), encoding="utf8").read()
RUNS = json.load(open(os.path.join(HERE, "runs.json"), encoding="utf8"))
exec(open(os.path.join(HERE, "en_runs.py"), encoding="utf8").read())
assert len(EN) == len(RUNS)
RUN_EN = dict(zip(RUNS, EN)); RUN_EN.update({"렌더": "Render", "렌더 보기": "Render view", "세로 축척 = 가로 축척 (실제 비율)": "Vertical = horizontal (true scale)", "세로 ×": "Vertical ×", "둘째 바닥": "Second floor", "아래 바닥": "Lower floor", "수변 단": "Waterside step", "맨 위 바닥": "Top floor", "이음목": "Neck", "자락 끝": "Apron end", " · 3D·평면과 같은 땅 높이": " · same ground as 3D and plan"})
RUN_RE = r"[^`'\"$\{\}<>\n]*[가-힣][^`'\"$\{\}<>\n]*"


def build(lang):
    s = SRC
    en = lang == "en"
    T = lambda e, k: e if en else k

    def R(old, new, n=None):
        nonlocal s
        c = s.count(old)
        assert c >= 1, ("missing", lang, old[:90])
        if n is not None: assert c == n, ("count", c, old[:90])
        s = s.replace(old, new)

    def RP(start, new, end="</p>"):
        nonlocal s
        i = s.find(start); assert i >= 0, ("missing", start[:60])
        j = s.find(end, i); assert j > i and "\n" not in s[i:j], ("span", start[:60])
        s = s[:i] + new + s[j:]

    # ================= 공통 (두 언어) =================
    R('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=IBM+Plex+Sans+KR:wght@400;500;600&display=swap">\n', '')
    R('<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n', '')
    R('pretendardvariable-dynamic-subset.min.css', 'pretendardvariable.min.css')
    R('<title>조석 기단 시뮬레이터</title>', T('<title>TIDE-SIM — YP.STUDIO &amp; LAB</title>', '<title>TIDE-SIM 조석 기단 시뮬레이터 — YP.STUDIO &amp; LAB</title>'))
    R('<html lang="ko">', f'<html lang="{lang}">')
    # 고른 언어 기억 (localStorage yp-tide-lang, 기본 English)
    R('<meta charset="utf-8">', '<meta charset="utf-8">\n<script>try{var L=localStorage.getItem("yp-tide-lang"),K=/ko\\.html$/.test(location.pathname);if(L==="ko"&&!K)location.replace("ko.html"+location.hash);else if(L==="en"&&K)location.replace("./"+location.hash);}catch(e){}</script>', 1)

    R('</style>\n<div class="ybar" role="banner">', '</style>' + CSS + '<div class="ybar" role="banner">', 1)

    # 상단바 (사이트와 같은 4칸) + EN / KO
    i = s.find('<div class="ybar" role="banner">'); j = s.find('</div>\n<header class="top">', i)
    roll = lambda t: f'<span class="roll"><span data-t="{t}">{t}</span></span>'
    lg = '<a class="lg-sw" data-l="ko" href="ko.html" hreflang="ko" aria-label="한국어로 보기"><b>EN</b> / KO</a>' if en else \
         '<a class="lg-sw" data-l="en" href="./" hreflang="en" aria-label="View in English">EN / <b>KO</b></a>'
    s = s[:i] + f'''<div class="ybar" role="banner">
  <a class="y-logo" href="../../index.html" aria-label="YP.STUDIO &amp; LAB home">{roll("YP.STUDIO &amp; LAB")}</a>
  <a class="y-work" href="../../lab.html">{roll("Lab / tide-sim")}</a>
  <div class="y-nav"><a href="../../lab.html">{roll("Menu")}</a><a href="../../works.html">{roll("Studio")}</a></div>
  <div class="y-r"><span class="y-time">Seoul <span class="num" id="yClock">--:--</span></span><span class="y-sws">{lg}<button class="md-sw" id="yMode" type="button" aria-label="{T("Switch light and dark", "밝은 화면과 어두운 화면 바꾸기")}"><b>Light</b> / Dark</button></span></div>
''' + s[j:]

    # 표지
    i = s.find('<div class="brand">'); j = s.find('<div class="seasel">', i)
    meta = T('<b>RE:TIDE — Tide Simulator</b><span>Lab · Simulation · 2026</span><span>Graduation thesis</span>',
             '<b>RE:TIDE — 조석 기단 시뮬레이터</b><span>Lab · Simulation · 2026</span><span>졸업 논문</span>')
    lede = T('The thesis, run live. One year of tide becomes a record by height, the record is read backwards into five variables, and the variables build a stepped plinth that floods and dries with the sea.',
             '논문을 직접 돌려 보는 화면이에요. 1년의 물높이가 높이별 기록이 되고, 기록을 거꾸로 읽어 다섯 변수를 만들고, 변수가 바다와 함께 잠기고 드러나는 계단 기단을 만들어요.')
    s = s[:i] + f'''<div class="brand">
      <h1>TIDE-SIM</h1>
      <p class="cv-meta">{meta}</p>
      <p class="lede">{lede}</p>
    </div>
    ''' + s[j:]
    if en: R('<span class="lab" id="seaLab">바다</span>', '<span class="lab" id="seaLab">Sea</span>')

    # 단계 줄 (핀 #261–#264, #267: 진행 표시)
    NAV = [("데이터 수집", "Data collection", "데이터 수집"), ("실험 대지", "Experimental site", "실험 대지"), ("데이터 구조화", "Data structure", "데이터 구조화"),
           ("변수체계", "Variables system", "변수체계"), ("조수 시뮬레이션", "Simulation", "시뮬레이션"), ("네 바다", "Four seas", "네 바다")]
    for ko, e, k in NAV: R(f'</span>{ko}</a>', f'</span>{T(e, k)}</a>', 1)
    R('<nav class="steps" aria-label="단계">', f'<nav class="steps" aria-label="{T("Steps", "단계")}">')
    i = s.find('<a href="#seas" data-v="seas">'); j = s.find('</a>', i) + 4
    s = s[:i] + s[i:j] + f'\n    <span class="stp-ct num" id="stepCt" aria-live="polite">01 / 06</span>' + s[j:]
    R('</div>\n</nav>', '</div>\n  <i class="stp-bar" aria-hidden="true"><b id="stepBar"></b></i>\n</nav>', 1)
    if en: R('<p class="loading" id="loading">조석 데이터를 불러오는 중입니다.</p>', '<p class="loading" id="loading">Loading tide data…</p>')

    # 단계 머리: 번호 + 제목
    H = [('h-collect', '1. 데이터 수집 <span class="h2s">조화상수로 1년의 물높이를 계산</span>', '01', 'Data collection', 'One year of water, from harmonic constants', '논문 2.1 · 2.2'),
         ('h-site', '2. 실험 대지 <span class="h2s">100 m × 60 m 대지 위의 물</span>', '02', 'Experimental site', 'Water on a 100 m × 60 m plot', '논문 2.2 · 3.3'),
         ('h-structure', '3. 데이터 구조화 <span class="h2s">높이마다 한 줄의 기록</span>', '03', 'Data structure', 'One line of record for every height', '논문 3.1 – 3.3'),
         ('h-derive', '4. 변수체계 <span class="h2s">기록을 거꾸로 읽어 다섯 변수로</span>', '04', 'Variables system', 'Reading the record backwards into five variables', '논문 4.1 · 4.2'),
         ('h-rules', '4-2. 변수 바꿔 보기 <span class="h2s">조건을 바꾸면 기단이 다시 생긴다</span>', '04.2', 'Try the variables', 'Change a condition and the plinth rebuilds', '논문 4.1 · 4.2 · 5.1'),
         ('h-water', '5. 조수 시뮬레이션 <span class="h2s">기단 위로 흐르는 1년의 물</span>', '05', 'Simulation', 'A year of water over the plinth', '논문 5.1'),
         ('h-seas', '6. 네 바다 <span class="h2s">같은 규칙, 다른 네 바다</span>', '06', 'Four seas', 'Same rules, four different seas', '논문 5.2 · 5.3')]
    for hid, old, n, t, sub, ref in H:
        m = re.match(r'[\d-]+\. (.*?) <span class="h2s">(.*?)</span>', old)
        tt, ss = (t, sub) if en else (m.group(1), m.group(2))
        R(f'<h2 id="{hid}">{old}</h2><span class="ref">{ref}</span>',
          f'<h2 id="{hid}"><span class="vn">{n}</span>{tt} <span class="h2s">{ss}</span></h2><span class="ref">{ref.replace("논문", "Thesis") if en else ref}</span>', 1)

    # 핀 #267: 단계 끝마다 다음 단계로
    NX = [("collect", "site", "02"), ("site", "structure", "03"), ("structure", "derive", "04"), ("rules", "water", "05"), ("water", "seas", "06"), ("seas", "collect", "01")]
    nm = {k: T(e, kk) for (_, e, kk), k in zip(NAV, ["collect", "site", "structure", "derive", "water", "seas"])}
    for sec, to, num in NX:
        i = s.find(f'<section class="view" id="v-{sec}"'); assert i >= 0, sec
        j = s.find('</section>', i)
        lab = T("Back to the start", "처음으로") if sec == "seas" else T("Next", "다음")
        s = s[:j] + f'''  <a class="nx" href="#{to}" data-v="{to}"><span class="nx-k">{lab}</span><span class="nx-t"><span class="num">{num}</span>{nm[to]}<span class="nx-a" aria-hidden="true">→</span></span></a>
  ''' + s[j:]

    # 핀 #268: 하루 그림(r-ph)을 조작판 바로 아래로
    i = s.find('<div class="howfig">\n          <canvas class="ch" id="r-ph"'); assert i >= 0
    j = s.find('</div>', s.find('</p>', i)) + 6
    fig = s[i:j]; s = s[:i] + s[j:]
    fig = fig.replace('<div class="howfig">', f'<div class="card r-phc">\n          <h3>{T("A day at this height", "이 높이의 하루")}</h3>', 1)
    k = s.find('<input type="range" id="r-d"'); k = s.find('</div>\n        </div>', k) + len('</div>\n        </div>')
    s = s[:k] + '\n        ' + fig + s[k:]

    # 핀 #276: 하나/다섯 기단 고르기를 3D 화면 오른쪽 위 아이콘으로
    i = s.find('<div class="seg" id="v-mode"'); j = s.find('</div>', i) + 6
    s = s[:i] + s[j:]
    one, five = T("One plinth", "하나의 기단"), T("Five plinths", "다섯 기단")
    ic1 = '<svg viewBox="0 0 22 14" width="22" height="14" aria-hidden="true"><rect x="6.5" y="2.5" width="9" height="9" fill="none" stroke="currentColor"/></svg>'
    ic5 = '<svg viewBox="0 0 22 14" width="22" height="14" aria-hidden="true">' + ''.join(f'<rect x="{x}" y="{y}" width="4" height="4" fill="none" stroke="currentColor"/>' for x, y in [(1.5, 1.5), (9, 1.5), (16.5, 1.5), (5.25, 8.5), (12.75, 8.5)]) + '</svg>'
    R('<canvas id="v-cv"', f'<div class="seg ov-mode" id="v-mode" role="group" aria-label="{T("View", "보기")}"><button data-m="one" aria-pressed="false" title="{one}" aria-label="{one}">{ic1}</button><button data-m="five" aria-pressed="true" title="{five}" aria-label="{five}">{ic5}</button></div><canvas id="v-cv"', 1)

    # 핀 #274: 네 바다 3D — 갯벌 아래를 꽉 채운 땅으로
    R("soil = new THREE.MeshStandardMaterial({ map: repTex(texSoil(), 4, 1), color: '#8f8166', roughness: 1 });\n  const mud = tag(new THREE.Mesh(new THREE.BoxGeometry(W, 2.5, L), [soil, soil, mudTop, soil, soil, soil]), 'terrain'); mud.position.y = -1.25;",
      "soil = new THREE.MeshStandardMaterial({ map: repTex(texSoil(), 4, 24), color: '#8f8166', roughness: 1 });\n  const mud = tag(new THREE.Mesh(new THREE.BoxGeometry(W, 60, L), [soil, soil, mudTop, soil, soil, soil]), 'terrain'); mud.position.y = -30;", 1)

    # 핀 #294: 넓은 화면에선 평면 높이를 그리드 칸이 정해요 (폭으로 높이를 맞추던 것 끄기) + 칸 크기가 바뀌면 다시 그리기
    R("if (Math.abs(pe.getBoundingClientRect().height - ph) > 2) pe.style.height = ph + 'px';", "if (!matchMedia('(min-width: 901px)').matches && Math.abs(pe.getBoundingClientRect().height - ph) > 2) pe.style.height = ph + 'px';", 1)
    R("new ResizeObserver(() => v.req()).observe($('#s-cv'));", "new ResizeObserver(() => v.req()).observe($('#s-cv'));\n    { let w0 = 0; const ro = new ResizeObserver(() => { const w = $('#s-plan').clientWidth * 10000 + $('#s-plan').clientHeight + $('#s-sec').clientHeight; if (w !== w0) { w0 = w; inval('site'); } }); ro.observe($('#s-plan')); ro.observe($('#s-sec')); }", 1)

    exec(open(os.path.join(HERE, 'patch_more.py'), encoding='utf8').read(), G0 := {'os': os, 'HERE': HERE}); G0['patch_more'](R, T); G0['patch_sec'](R, T); G0['patch_fit'](R, T); G0['patch_plan'](R, T); G0['patch_plan2'](R, T); G0['patch_plan3'](R, T); G0['patch_dock'](R, T)

    # 핀 #293 (예전 #259 대신): SketchUp 같은 3D 조작 — nav3d.js
    i = s.find("  const pts = new Map(); let pinch = 0;"); j = s.find("canvas.addEventListener('contextmenu', e => e.preventDefault());", i)
    assert i > 0 and j > i; j += len("canvas.addEventListener('contextmenu', e => e.preventDefault());") + 1
    s = s[:i] + open(os.path.join(HERE, "nav3d.js"), encoding="utf8").read() + s[j:]
    R("function View3D(canvas, o) {", "const NAV_LG = " + repr(T("Orbit: middle drag · Pan: Shift + middle drag · Zoom: wheel · Reset: double-click", "돌리기: 가운데 끌기 · 옮기기: Shift + 가운데 끌기 · 확대: 휠 · 처음 모습: 두 번 누르기")) + ";\nfunction View3D(canvas, o) {", 1)

    # 핀 #260·#273·#275: 실감 → Render / 렌더
    R('<span>실감</span>', '<span>렌더</span>'); R('title="실감 보기"', 'title="렌더 보기"')

    # 핀 #258: 짧게
    R("$('#c-how-amp').innerHTML = `${s.ko}에서는 M2가 <b>${A('M2')} m</b>, S2가 <b>${A('S2')} m</b>이고, 상수는 모두 ${allK.length}개입니다.`;",
      "$('#c-how-amp').innerHTML = " + ("`${s.ko}: M2 <b>${A('M2')} m</b>, S2 <b>${A('S2')} m</b> · ${allK.length} constants.`;" if en else "`${s.ko}: M2 <b>${A('M2')} m</b>, S2 <b>${A('S2')} m</b> · 상수 ${allK.length}개.`;"), 1)
    RP('<li><b>크기 · 박자 · 시작을 적는다.</b>', T('<li><b>Write down size and lag.</b> Each wave’s size (H) and lag (g) in that sea. <span id="c-how-amp"></span>',
                                               '<li><b>크기와 늦음을 적는다.</b> 그 바다에서 물결마다의 크기(H)와 늦음(g)이에요. <span id="c-how-amp"></span>'), '</li>')

    # 핀 #267: 진행 표시 + 다음 단계로 넘어가면 맨 위로
    R("$$('#stepNav a').forEach(a => a.setAttribute('aria-current', a.dataset.v === view ? 'page' : 'false'));",
      "$$('#stepNav a').forEach(a => a.setAttribute('aria-current', a.dataset.v === view ? 'page' : 'false'));\n  { const i = ['collect', 'site', 'structure', 'derive', 'water', 'seas'].indexOf(view), c = $('#stepCt'), b = $('#stepBar'); if (c) c.textContent = String(i + 1).padStart(2, '0') + ' / 06'; if (b) b.style.width = ((i + 1) / 6 * 100) + '%'; }", 1)
    R("window.addEventListener('hashchange', route); route();",
      "window.addEventListener('hashchange', route); route();\n  document.addEventListener('click', e => { if (e.target.closest('a.nx, #stepNav a')) setTimeout(() => { const m = $('#main'), t = m.getBoundingClientRect().top + scrollY - 136; if (scrollY > t) scrollTo(0, t); }, 0); });", 1)

    # 핀 #272: 링크(물음 → 열 → 변수 → 부분) 고르기를 3D 화면 안 작은 버튼으로
    R("    drawLinks();\n  };\n  D.pick = function",
      "    { const box = $('#d-3d'), bar = document.createElement('div'); bar.className = 'lk-bar'; bar.setAttribute('role', 'group'); bar.setAttribute('aria-label', '" + T("Link choices", "링크 고르기") + "');\n"
      "      bar.innerHTML = LK.cols.map((t, c) => `<div class=\"lk-g\"><span class=\"lk-h\">${t}</span>${LK.nodes.filter(n => n[1] === c).map(n => `<button type=\"button\" data-k=\"${n[0]}\" aria-pressed=\"false\">${n[2]}</button>`).join('')}</div>`).join('');\n"
      "      box.appendChild(bar); bar.addEventListener('pointerdown', e => e.stopPropagation()); bar.addEventListener('wheel', e => e.stopPropagation());\n"
      "      bar.addEventListener('click', e => { const b = e.target.closest('button[data-k]'); if (!b) return; const k = b.dataset.k; LK.sel = k; const i = DV.findIndex(v => v.k === k); if (i >= 0 && i !== D4.i) { this.stopAuto(); this.pick(i); } else { drawLinks(); inval('derive'); } }); }\n"
      "    drawLinks();\n  };\n  D.pick = function", 1)
    R("  svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.innerHTML = out;",
      "  svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.innerHTML = out;\n  $$('.lk-bar button').forEach(b => { b.setAttribute('aria-pressed', String(b.dataset.k === sel)); b.classList.toggle('in', path.has(b.dataset.k)); });", 1)

    # 핀 #288–#291: 마우스를 시뮬레이션 그림 위에 두고 휠을 돌리면 시간(날짜·시각·높이)이 넘어가고 페이지는 멈춰요. 그림 밖에서는 평소처럼 스크롤.
    R("window.addEventListener('hashchange', route); route();",
      "window.addEventListener('hashchange', route); route();\n"
      "  { const WM = { 'c-lanes': ['c-start', 1, 200], 'c-sum': ['c-start', 1, 200], 'c-ph': ['c-ph-tr', 10], 'r-year': ['r-d', 1], 'r-fort': ['r-d', 1], 'r-day': ['r-d', 1], 'r-ph': ['r-d', 1], 'r-rec': ['r-h', 0.05],\n"
      "      'w-sec': ['w-t', 10], 'w-plan': ['w-t', 10], 'w-fort': ['w-t', 60], 'w-year': ['w-t', 1440] };\n"
      "    for (const id in WM) { const cv = document.getElementById(id); if (!cv) continue; let acc = 0; cv.setAttribute('data-lenis-prevent', ''); cv.classList.add('wh-sim');\n"
      "      cv.addEventListener('wheel', e => { const r = document.getElementById(WM[id][0]); if (!r || r.closest('[hidden]')) return; e.preventDefault(); acc += e.deltaY + e.deltaX;\n"
      "        const th = WM[id][2] || 100, n = Math.trunc(acc / th); if (!n) return; acc -= n * th; const st = WM[id][1], v = clamp(+r.value + n * st, +r.min, +r.max);\n"
      "        if (v !== +r.value) { r.value = v; r.dispatchEvent(new Event('input', { bubbles: true })); } }, { passive: false }); } }", 1)

    # 핀 #292: 화살표 그림 자동 재생을 느리게 (1초에 90분 → 20분)
    R("PH.t = (PH.t + dt * 60 * 1.5) % 21240;", "PH.t = (PH.t + dt * 20) % 21240;", 1)

    G0['patch_icons'](R, T); G0['patch_vtable'](R, T); G0['patch_playwater'](R, T); G0['patch_guides'](R, T); G0['patch_diag'](R, T); G0['patch_skirts'](R, T); G0['patch_perf'](R, T); G0['patch_bg'](R, T); G0['patch_wvars'](R, T)

    # 큰 읽기 값의 글자 크기는 토큰으로
    R('style="font-family:var(--font);font-size:19px"', 'style="font-size:var(--t-xl)"')

    # 언어 고르기 기억
    R("  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', paint);",
      "  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', paint);\n  $$('.lg-sw').forEach(a => a.addEventListener('click', () => { try { localStorage.setItem('yp-tide-lang', a.dataset.l); } catch (_) {} a.href = a.getAttribute('href').split('#')[0] + location.hash; }));", 1)

    if not en:
        return s

    # ================= English =================
    a = s.find('<div class="ybar"'); b = s.find('<script>\n', s.find('three.min.js'))
    head, body, script = s[:a], s[a:b], s[b:]
    G = {"s": body}
    exec(HTML_EN_CODE, G)
    body = G["s"]
    # 스크립트: 날짜 · 바다 이름 · 한국어 조각
    sc = script
    for x, y in [("const WD = ['일', '월', '화', '수', '목', '금', '토'];", "const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];"),
                 ("let s = `${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일 (${WD[d.getUTCDay()]})`;", "let s = `${d.getUTCDate()} ${MON[d.getUTCMonth()]} (${WD[d.getUTCDay()]})`;"),
                 ("(d.getUTCMonth() + 1) + '월'", "MON[d.getUTCMonth()]"), ("((9 + m) % 12 + 1) + '월'", "MON[(9 + m) % 12]"), ("(mo + 1) + '월'", "MON[mo]"),
                 ("const res = await fetch('tide.json'); DATA = await res.json();", "const res = await fetch('tide.json'); DATA = await res.json(); for (const k in DATA.seas) DATA.seas[k].nm = { INC: 'Incheon', SML: 'Mont-Saint-Michel', HON: 'Gulf of Tonkin', VEN: 'Venice' }[k] || DATA.seas[k].en;")]:
        assert x in sc, x[:60]; sc = sc.replace(x, y)
    sc = re.sub(r"\.ko\b", ".nm", sc)
    out, pos, miss = [], 0, set()
    # 주석은 건드리지 않아요: 줄 주석(//…)과 블록 주석을 건너뛰며 바꿔요
    def tr_code(code):
        def f(m):
            r = m.group(0)
            if r in RUN_EN: return RUN_EN[r]
            miss.add(r); return r
        return re.sub(RUN_RE, f, code)
    parts = re.split(r"(/\*.*?\*/|(?<![:'\"`\\])//[^\n]*)", sc, flags=re.S)
    sc = "".join(p if (p.startswith("/*") or p.startswith("//")) else tr_code(p) for p in parts)
    left = [m for m in miss if re.search('[가-힣]', m)]
    if left: print("untranslated runs:", len(left), left[:20], file=sys.stderr)
    return head + body + sc


CSS = open(os.path.join(HERE, "site-skin.css"), encoding="utf8").read()
HTML_EN_CODE = compile(open(os.path.join(HERE, "html_en.py"), encoding="utf8").read(), "html_en.py", "exec")

if __name__ == "__main__":
    for lang, name in [("en", "index.html"), ("ko", "ko.html")]:
        html = build(lang).rstrip("\n") + '\n<script src="../../assets/js/pullback.js" defer></script>\n'  # 끌어서 뒤로 가기 (사이트 공통)
        open(os.path.join(HERE, "..", name), "w", encoding="utf8", newline="\n").write(html)
        print(name, len(html))
