# 영어판 HTML 글 (build.py가 body 부분에 실행해요)
import re
def R(old, new, n=None):
    global s
    c = s.count(old)
    assert c >= 1, ("missing", old[:80])
    if n is not None: assert c == n, ("count", c, old[:80])
    s = s.replace(old, new)

def RP(start, new, end="</p>"):
    """start 문구부터 end 직전까지 바꿔요 (한 줄 안)"""
    global s
    i = s.find(start); assert i >= 0, ("missing", start[:60])
    j = s.find(end, i); assert j > i and "\n" not in s[i:j], ("span", start[:60])
    s = s[:i] + new + s[j:]


WHY = [
 ('박자가 다른 물결을 더하면', 'Add waves that keep different beats and you get the water level at any moment. Switch them on and off to see where spring and neap tides come from.'),
 ('공간의 차이가 조석에서만 오도록', 'No buildings and no codes, so every difference comes from the tide alone. The ground is built up in the order common on the Incheon shore. Step through to watch it form.'),
 ('한 높이를 고르면', 'Pick a height and see how often, how long, when and how fast water reaches it — over a day, a fortnight and a year, and as one line of the record. Click any chart to change the height.'),
 ('높이별 조석 기록은 높이를 넣으면', 'The record says what water a height gets. Design reads it backwards: set the condition a part of the space must meet, pick the column that measures it, and sweep upward until the condition holds. All five variables take these three steps, and the heights and widths they find become the plinth.'),
 ('위에서 본 읽는 법을', 'Now do it yourself. Change the five variables on the right and the rules read the record again — heights and widths shift and the plinths rebuild in 3D. The two readings only report. The dashed line is the thesis plinth; your version carries on into steps 5 and 6.'),
 ('기단은 모양이 하나이지만', 'One form, many places over a day, a fortnight and a year. Run time and the waterline climbs the steps, the neck floods into an island, and the floor days pass.'),
 ('실험 대지와 규칙은 그대로 두고', 'Same site, same rules — only the tide data changes. 3D, plan and section share one scale, set side by side at mudflat level. Open a sea for its location, data and why its plinth comes out the way it does.'),
]
for st, en in WHY: RP(st, en)

# ---------- 01 Collect ----------
for a, b in [
 ('<h3>물결 하나하나 <small id="c-lanes-sub"></small></h3>', '<h3>Each wave <small id="c-lanes-sub"></small></h3>'),
 ('aria-label="물결별 물높이"', 'aria-label="Water level by wave"'),
 ('<h3>더한 물높이 <small id="c-sum-sub"></small></h3>', '<h3>Sum of waves <small id="c-sum-sub"></small></h3>'),
 ('aria-label="더한 물높이"', 'aria-label="Summed water level"'),
 ('></i>켠 물결의 합</span>', '></i>Waves switched on</span>'),
 ('></i>모든 물결의 합</span>', '></i>All waves</span>'),
 ('<div class="row"><span>보는 기간</span></div>', '<div class="row"><span>Window</span></div>'),
 ('aria-label="보는 기간"', 'aria-label="Window"'),
 ('aria-pressed="false">하루</button><button data-w="fort" aria-pressed="true">보름</button><button data-w="year" aria-pressed="false">1년</button>', 'aria-pressed="false">Day</button><button data-w="fort" aria-pressed="true">Fortnight</button><button data-w="year" aria-pressed="false">Year</button>'),
 ('<label for="c-start">시작하는 날</label>', '<label for="c-start">Start day</label>'),
 ('<div class="row"><span>물결 고르기</span></div>', '<div class="row"><span>Waves</span></div>'),
 ('data-p="m2">M2만</button>', 'data-p="m2">M2 only</button>'),
 ('data-p="six">큰 여섯</button><button class="btn" data-p="all">전부</button>', 'data-p="six">Big six</button><button class="btn" data-p="all">All</button>'),
 ('<h3>이 창에서</h3>', '<h3>In this window</h3>'),
 ('<h3>계산의 검증</h3>', '<h3>Check against forecasts</h3>'),
 ('<h3>설명</h3>', '<h3>In plain words</h3>'),
 ('<h3>원리 · 조화상수로 물높이를 어떻게 계산하나 <small id="c-how-sub"></small></h3>', '<h3>How it works — water level from harmonic constants <small id="c-how-sub"></small></h3>'),
 ('aria-label="회전하는 물결 화살표와 물높이"', 'aria-label="Rotating wave arrows and water level"'),
 ('<button class="btn pri" id="c-ph-play">재생</button>', '<button class="btn pri" id="c-ph-play">Play</button>'),
 ('aria-label="화살표로 볼 물결"', 'aria-label="Waves shown as arrows"'),
 ('<button data-p="m2" aria-pressed="false">M2만</button><button data-p="m2s2" aria-pressed="true">M2 + S2</button><button data-p="six" aria-pressed="false">큰 여섯</button>', '<button data-p="m2" aria-pressed="false">M2 only</button><button data-p="m2s2" aria-pressed="true">M2 + S2</button><button data-p="six" aria-pressed="false">Big six</button>'),
 ('aria-label="시각 (보름 안)"', 'aria-label="Time within the fortnight"'),
 ('aria-label="물결 이름 풀이"', 'aria-label="Wave names"'),
]: R(a, b)
GL = [('M2', 'The moon’s twice-daily wave. 12 h 25 min. The largest.'),
      ('S2', 'The sun’s twice-daily wave. Exactly 12 h.'),
      ('N2', 'The moon drawing nearer and further. 12 h 40 min. Makes one spring tide a month larger.'),
      ('K2', 'Moon and sun leaving the equator. 11 h 58 min.'),
      ('K1 · O1 · P1 · Q1', 'Once-a-day waves — 23 h 56 · 25 h 49 · 24 h 04 · 26 h 52. They make the two high waters unequal.'),
      ('Sa · Ssa', 'Yearly and half-yearly. Mean water rises and falls with the seasons.'),
      ('M4 · MS4 · M6', 'Short waves born in shallow water (6 · 6.1 · 4.1 h). Make the flood and the ebb run at different speeds.'),
      ('L2 · MU2 · NU2 등', 'Small waves from wobbles in the moon’s orbit. Mont-Saint-Michel, Tonkin and Venice use 40–44 of them.')]
for k, en in GL:
    i = s.find(f'<dt>{k}</dt><dd>'); assert i >= 0, k
    j = s.find('</dd>', i)
    s = s[:i] + f'<dt>{k.replace(" 등", " …")}</dt><dd>{en}' + s[j:]
EASY = [
 ('<b class="ei">합주</b>', 'An ensemble', 'The tide is a piece played by many instruments.', 'Each keeps its own beat: the moon’s big drum (M2) every 12 h 25 min, the sun’s snare (S2) every 12 h exactly, and others once a day (K1, O1) or once a year (Sa).'),
 ('<b class="ei">악보</b>', 'The score', 'Harmonic constants are a sea’s score.', 'Moon and sun are the same everywhere, but the seabed and coastline set how loud (amplitude) and how late (phase) each instrument plays. Incheon’s big drum is huge (2.85 m); Venice’s is quiet. Write the score once and the sea can be replayed at any time.'),
 ('<b class="ei">소리의 합</b>', 'The sum', 'The water level is every instrument added at that moment.', 'Do it for each of the 525,600 minutes of a year and nothing is missed. Below, each arrow is one instrument; the tip of the chain is the water level.'),
 ('<b class="ei">사리와 조금</b>', 'Spring and neap', 'Drums in step play loud; out of step, soft.', 'Their beats differ by 25 minutes, so about every 15 days they strike together and the range grows (spring), then drift apart and it shrinks (neap).'),
 ('<b class="ei">눈금 말뚝</b>', 'Gauge posts', 'Picture a post marked every 5 cm on the mudflat.', 'In Incheon that is 196 posts, from the lowest reach of water (−0.20 m) to just above the highest (+9.55 m). Higher up, water never comes. One post is one line of the record.'),
 ('<b class="ei">일기</b>', 'A diary', 'Every post keeps a diary, every minute for a year.', '“Under water, or dry?” A year is 525,600 minutes, so each post writes 525,600 entries.'),
 ('<b class="ei">네 물음</b>', 'Four questions', 'The diary is summed up in four answers.', 'How many days it floods (<b>often</b>), how long it stays above water (<b>long</b>), when it is dry by daylight (<b>when</b>), how fast the water rises (<b>fast</b>). Together they are the character of that height.'),
 ('<b class="ei">거꾸로</b>', 'In reverse', 'Design reads the summary backwards.', 'Set the answer first — “where does ground flood half the year?” — then sweep the posts upward until it appears. That is step 04.'),
]
for key, t, b1, rest in EASY:
    i = s.find(key); assert i >= 0, key
    j = s.find('</p></div>', i)
    s = s[:i] + f'<b class="ei">{t}</b><p><b>{b1}</b> {rest}' + s[j:]
RP('아래의 원리는 같은 이야기를', 'The diagram below tells the same story as a formula; the calculation follows it exactly.')
STEPS_C = [('<li><b>물결로 나눈다.</b>', 'Split into waves.', 'The tide is the sum of many waves raised by the pull of moon and sun, each with a period fixed by astronomy: M2 (moon) every 12 h 25 min, S2 (sun) every 12 h.'),
           ('<li><b>한 시각의 높이를 구한다.</b>', 'Find one moment’s height.', 'Each wave is an arrow on the left. Its length is the size; it turns once per period. Its vertical part is what that wave adds right now.'),
           ('<li><b>모두 더한다.</b>', 'Add them up.', 'Chain the arrows tip to tail; the last tip is the water level above mean sea level. The curve on the right is the path of that tip.')]
for key, t, rest in STEPS_C:
    i = s.find(key); assert i >= 0, key
    j = s.find('</li>', i)
    s = s[:i] + f'<li><b>{t}</b> {rest}' + s[j:]
RP('Z₀ 평균 해수면', 'Z₀ mean sea level · H size · ω beat (fixed angular speed of each wave) · g local lag · V₀ astronomical angle at the start · f, u corrections for the 18.6-year cycle of the moon’s orbit', '</span>')

# ---------- 02 Site ----------
for a, b in [
 ('aria-label="실험 대지 3D"', 'aria-label="Test site in 3D"'),
 ('<span class="hint">끌어서 돌리기 · 휠이나 두 손가락으로 확대</span>', '<span class="hint">Drag to orbit · scroll or pinch to zoom</span>'),
 ('<h3>평면 <small>등고선 0.25 m (굵은 선 1 m) · 축선 ⓪ ① ② · A–A는 아래 단면의 자리</small></h3>', '<h3>Plan <small>Contours 0.25 m (bold 1 m) · grid lines ⓪ ① ② · A–A marks the section below</small></h3>'),
 ('aria-label="실험 대지 평면"', 'aria-label="Test site plan"'),
 ('<h3>단면 A–A <small>대지의 y = 30 m 선을 따라 자른 모습, 세로 축척은 3D와 같음</small></h3>', '<h3>Section A–A <small>Cut along y = 30 m, vertical scale as in 3D</small></h3>'),
 ('aria-label="실험 대지 단면"', 'aria-label="Test site section"'),
 ('<button class="btn" id="s-prev">이전</button><button class="btn pri" id="s-next">다음 단계</button><button class="btn" id="s-auto">처음부터 자동으로</button>', '<button class="btn" id="s-prev">Back</button><button class="btn pri" id="s-next">Next step</button><button class="btn" id="s-auto">Play from the start</button>'),
 ('aria-label="높이 배율"><button data-v="1" aria-pressed="true">높이 1배</button><button data-v="2" aria-pressed="false">2배</button>', 'aria-label="Height scale"><button data-v="1" aria-pressed="true">Height ×1</button><button data-v="2" aria-pressed="false">×2</button>'),
 ('<label for="s-h">물높이</label>', '<label for="s-h">Water level</label>'),
 ('<button class="btn" id="s-play">사리 하루 물 들이기</button>', '<button class="btn" id="s-play">Run a spring-tide day</button>'),
]: R(a, b)
R('aria-pressed="true">치수</button>', 'aria-pressed="true">Dimensions</button>')
R('aria-pressed="false">치수</button>', 'aria-pressed="false">Dimensions</button>')

# ---------- 03 Structure ----------
for a, b in [
 ('<h3>1년 · 날마다의 만조와 간조 <small>높이 기준이 나오는 곳</small></h3>', '<h3>Year — daily high and low water <small>where the height thresholds come from</small></h3>'),
 ('aria-label="1년의 만조와 간조"', 'aria-label="High and low water over a year"'),
 ('></i>그날의 간조에서 만조까지 (물이 오르내린 높이의 범위)</span>', '></i>Each day, low to high water</span>'),
 ('></i>만조가 고른 땅 높이(검은 선)를 넘은 만큼 · 그 땅이 잠기는 날</span>', '></i>High water above the chosen ground (black line) — a day it floods</span>'),
 ('<h3>보름 · 정오의 물과 달의 나이 <small>날 기준</small></h3>', '<h3>Fortnight — noon water and moon age <small>by day</small></h3>'),
 ('aria-label="정오의 물과 달의 나이"', 'aria-label="Noon water and moon age"'),
 ('<h3>하루 · 물의 움직임 <small>시간 기준 · <span id="r-day-sub"></span></small></h3>', '<h3>Day — how the water moves <small>by hour · <span id="r-day-sub"></span></small></h3>'),
 ('aria-label="하루의 물"', 'aria-label="Water over a day"'),
 ('<label for="r-h">땅의 높이</label>', '<label for="r-h">Ground height</label>'),
 ('<button class="btn" id="r-sweep">아래에서 위로 훑기</button><button class="btn" data-h="T1">가장 높은 만조</button><button class="btn" data-h="T2">가장 낮은 만조</button><button class="btn" data-h="T3">가장 높은 간조</button>', '<button class="btn" id="r-sweep">Sweep upward</button><button class="btn" data-h="T1">Highest high water</button><button class="btn" data-h="T2">Lowest high water</button><button class="btn" data-h="T3">Highest low water</button>'),
 ('<label for="r-d">하루 그림의 날</label>', '<label for="r-d">Day shown</label>'),
 ('<h3>높이별 조석 기록 <small>5 cm마다 한 줄 · 세로는 땅의 높이, 가로는 그 높이에서 잰 값</small></h3>', '<h3>Tide record by height <small>one line every 5 cm · ground height up, measured values across</small></h3>'),
 ('aria-label="높이별 조석 기록"', 'aria-label="Tide record by height"'),
 ('<h3>기록의 한 줄</h3>', '<h3>One line of the record</h3>'),
 ('<h3>설명 · 이 기록은 무엇이고 왜 이렇게 만들었나</h3>', '<h3>In plain words — what the record is, and why</h3>'),
 ('<h3 style="margin-top:14px">왜 이렇게 정리했나 · 다섯 가지 기준</h3>', '<h3 style="margin-top:24px">Why it is built this way — five rules</h3>'),
 ('aria-label="하루의 물과 땅의 높이"', 'aria-label="A day of water against ground height"'),
]: R(a, b)
RP('세로선 하나가 하루입니다.', 'Each vertical line is one day — date across, height up. Count the days with fill and you have how many days a year that height floods (“Flooded days” in the record).')
CRIT = [('<li><b>높이로 묶는다.</b>', 'Group by height.', 'Ground at one height sees the same water anywhere on the site (shown in step 02). Collected by height instead of position, 6,161 points become 196 lines in Incheon with nothing lost. Only low pockets cut off from the sea differ, and step 02’s “flooding height” corrects for them.'),
        ('<li><b>세 기간으로 읽는다.</b>', 'Read three spans.', 'Water changes on three beats: the day (two highs, two lows), the fortnight (spring and neap) and the year (seasons, the moon’s tilt). One span alone hides the other two, so the record counts in the units people live by.'),
        ('<li><b>네 물음으로 요약한다.</b>', 'Sum up in four questions.', 'Using a space needs not the water level itself but “when can I go down, and how long can I stay”. So the record keeps count (often), length (long), timing (when) and speed (fast). None stands in for another.'),
        ('<li><b>5 cm 간격.</b>', 'Every 5 cm.', 'One waterside step (0.5 m) divided by ten. Each step gets ten lines — enough to tell its top from its bottom. Finer than this changes nothing in the design.'),
        ('<li><b>1분 간격, 1년.</b>', 'Every minute, for a year.', 'Slack water near low tide lasts just over two hours, and daylight is counted in hours; a minute counts both without error. A year is the shortest span that holds spring, neap and every season.'),
        ('<li><b>재는 법.</b>', 'How it is measured.', 'Fix a height and compare it with each of the year’s 525,600 minutes of water. Water above: a flooded minute. Below: a dry one. Counted by day, daylight and hour, that is one line of the record.'),
        ('<li><b>땅이 높아지면 물이 덜 온다.</b>', 'Higher ground, less water.', 'Only days whose high water clears the height flood it, so higher ground floods less often and for less time, and stays dry longer and more often by day.'),
        ('<li><b>빠르기는 가운데가 가장 빠르다.</b>', 'Fastest in the middle.', 'Water pauses at high and low tide and moves fastest near mean sea level, so speed peaks there and falls away above and below.'),
        ('<li><b>답이 뒤집히는 세 높이.</b>', 'Three heights where answers flip.', 'Above the highest high water, water never comes; below the lowest high water, it comes every day; above the highest low water, ground dries every day. These three split the ground into four.')]
for key, t, rest in CRIT:
    i = s.find(key); assert i >= 0, key
    j = s.find('</li>', i)
    s = s[:i] + f'<li><b>{t}</b> {rest}' + s[j:]
R('<h3>원리 · 땅의 높이 하나가 기록의 한 줄이 되기까지 <small id="r-how-sub"></small></h3>', '<h3>How it works — from one ground height to one line <small id="r-how-sub"></small></h3>')
RP('파란 곡선은 위에서 고른 날의 물', 'The curve is the chosen day’s water; the line is the chosen ground. While the curve is above the line the ground is under water (filled); below it, dry. The slope where they cross is how fast water rises at that height.')
RP('같은 물을 높이만 바꿔 다시 재면', 'Measure the same water at another height and the four answers change like this. <b id="r-how-dz"></b>')

# ---------- 04 Variables ----------
for a, b in [
 ('<h3>조건 → 열 → 높이 <small id="d-sub"></small></h3>', '<h3>Condition → column → height <small id="d-sub"></small></h3>'),
 ('aria-label="기록의 열을 훑어 높이를 찾고 기단에 그리기"', 'aria-label="Sweep a record column to find a height and draw it on the plinth"'),
 ('></i>지금 만드는 변수</span>', '></i>Variable being found</span>'),
 ('></i>이미 만든 변수</span>', '></i>Variables found</span>'),
 ('<div class="ctl"><div class="row"><span>만들 변수</span></div>', '<div class="ctl"><div class="row"><span>Variable</span></div>'),
 ('<button class="btn pri" id="d-play">다섯 변수를 차례로</button><button class="btn" id="d-scan">이 변수 다시 훑기</button>', '<button class="btn pri" id="d-play">All five in turn</button><button class="btn" id="d-scan">Sweep this one again</button>'),
 ('<h3>지금 찾은 값</h3>', '<h3>Found so far</h3>'),
 ('<h3>링크 시뮬레이션 · 무엇이 무엇과, 왜 이어지나 <small>선을 누르거나 변수를 고르면 그 연결이 왜 생기고 어떤 관계인지 나옵니다</small></h3>', '<h3>Links — what connects to what, and why <small>click a line or a variable to see the reason for that link</small></h3>'),
 ('aria-label="물음, 데이터 열, 변수, 기단 부분의 연결"', 'aria-label="Links between questions, record columns, variables and plinth parts"'),
 ('<h3>3D로 보기 · 찾은 높이가 기단의 어느 부분이 되나 <small id="d3-sub"></small></h3>', '<h3>In 3D — which part of the plinth each height becomes <small id="d3-sub"></small></h3>'),
 ('<h3>네 물음과 다섯 변수 <small>어느 변수가 어느 물음의 열을 읽나</small></h3>', '<h3>Four questions, five variables <small>which variable reads which column</small></h3>'),
 ('<h3>높이와 너비를 하나의 형태로 <small>논문 5.1의 네 배치 결정</small></h3>', '<h3>Heights and widths into one form <small>four layout decisions, thesis 5.1</small></h3>'),
 ('<li><b>둥글게 둔다.</b> 데이터는 물이 오는 방향을 말하지 않으므로, 단면 하나로 형태 전체를 정합니다.</li>', '<li><b>Make it round.</b> The data says nothing about direction, so one section sets the whole form.</li>'),
 ('<li><b>높은 바닥을 가운데에.</b> 물은 바깥에서 차오르므로, 사람이 언제나 안쪽으로 물러설 수 있게 합니다.</li>', '<li><b>Highest floor in the middle.</b> Water rises from the edge, so people can always step back inward.</li>'),
 ('<li><b>단을 너비만큼 차례로 두른다.</b> 기단의 크기도 물의 빠르기에서 나옵니다.</li>', '<li><b>Ring the steps by their widths.</b> The plinth’s size also comes from the speed of the water.</li>'),
 ('<li><b>뭍 쪽은 이음목, 바다 쪽은 자락.</b> 뭍 쪽으로 단을 이어 이음목을, 바다 쪽으로 아래 바닥을 늘여 자락을 내되 갯벌보다 낮게 파지 않습니다.</li>', '<li><b>A neck to the land, an apron to the sea.</b> Steps run landward into a neck; the lower floor runs seaward into an apron, never dug below the mudflat.</li>'),
 ('<span class="hint">끌어서 돌리기 · 휠로 확대 · 두 번 눌러 처음 모습</span>', '<span class="hint">Drag to orbit · scroll to zoom · double-click to reset</span>'),
 ('aria-label="지금 만드는 변수가 놓이는 기단 부분 3D"', 'aria-label="Plinth part set by the current variable, in 3D"'),
]: R(a, b)
RP('조건의 값은 아래 "변수를 바꿔 보기"에서', 'Change the conditions in “Try the variables” below and the heights found here change with them.')
RP('바닷물은 가장 낮은 간조에 두어', 'The sea is held at the lowest low water so the whole plinth shows. A clear plane sweeps the record upward; where the condition is met it stays as an outline and marks the height. The part that height sets is drawn dark, the rest knocked back. Click any node in the links above to light the part it sets — the surrounding plinths follow the same rules and light up with it.')

# ---------- 04.2 Try ----------
for a, b in [
 ('<h3>3D 시뮬레이션 · 바꾼 값으로 다시 생긴 기단 <small id="u3-sub"></small></h3>', '<h3>3D — plinths rebuilt from your values <small id="u3-sub"></small></h3>'),
 ('aria-label="변수를 바꾸면 다시 생기는 기단 무리 3D"', 'aria-label="Plinths rebuilt as the variables change, in 3D"'),
 ('<div class="ctl" style="margin-top:8px"><div class="row"><span>물높이</span></div>', '<div class="ctl" style="margin-top:8px"><div class="row"><span>Water level</span></div>'),
 ('aria-label="3D의 물높이"><button data-w="lo" aria-pressed="true">가장 낮은 간조</button><button data-w="T2" aria-pressed="false">가장 낮은 만조</button><button data-w="C" aria-pressed="false">만조의 가운데값</button><button data-w="T1" aria-pressed="false">가장 높은 만조</button>', 'aria-label="Water level in 3D"><button data-w="lo" aria-pressed="true">Lowest low water</button><button data-w="T2" aria-pressed="false">Lowest high water</button><button data-w="C" aria-pressed="false">Median high water</button><button data-w="T1" aria-pressed="false">Highest high water</button>'),
 ('<h3>기록을 거꾸로 읽어 기단으로 <small id="u-sub"></small></h3>', '<h3>From the record to the plinth <small id="u-sub"></small></h3>'),
 ('aria-label="기록과 기단 단면"', 'aria-label="Record and plinth section"'),
 ('></i>지금의 기단</span>', '></i>Your plinth</span>'),
 ('></i>논문의 기단</span>', '></i>Thesis plinth</span>'),
 ('></i>규칙이 읽은 곳</span>', '></i>Where the rules read</span>'),
 ('<h3>실제 비례 단면 <small id="u-real-sub"></small></h3>', '<h3>True-scale section <small id="u-real-sub"></small></h3>'),
 ('aria-label="실제 비례로 그린 기단 단면과 사람"', 'aria-label="Plinth section at true scale, with a person"'),
 ('<button class="btn" id="u-gentle">완만하게 바꿔 보기 (사이트 예시)</button><button class="btn" id="u-reset2">논문 값</button>', '<button class="btn" id="u-gentle">Try a gentler slope</button><button class="btn" id="u-reset2">Thesis values</button>'),
 ('<h3>다섯 변수와 두 읽기 지표 <small>표 2를 지금의 값으로</small></h3>', '<h3>Five variables, two readings <small>table 2 at the current values</small></h3>'),
 ('<h3>변수는 7개입니다 <small>5개는 만들고, 2개는 읽는다</small></h3>', '<h3>Seven variables <small>five build, two read</small></h3>'),
]: R(a, b)
i = s.find('<p class="note">논문의 변수 체계는'); assert i >= 0
j = s.find('</p>', i)
s = s[:i] + '<p class="note">The thesis uses <b>five variables that build the plinth</b> (layer, edge, link, stay, slope) and <b>two readings of the result</b> (zone, timing) — seven in all, every one read from the record of step 03.' + s[j:]
RP('조절하는 막대는 만드는 변수마다 하나', 'One slider per building variable, five in all. Each slider is the condition that variable must meet (e.g. link = “an island on 187 days a year”); reading the record with it gives the plinth’s dimensions. The two readings only report. Finer criteria and the form dimensions that do not come from data sit in the folded panel at the bottom.')

# ---------- 05 Tide ----------
for a, b in [
 ('aria-label="기단과 물 3D"', 'aria-label="Plinth and water in 3D"'),
 ('<h3>단면 <small>뭍에서 바다 쪽으로 기단 가운데를 자른 모습 · 실제 비례</small></h3>', '<h3>Section <small>through the middle, land to sea · true scale</small></h3>'),
 ('aria-label="기단 단면과 물"', 'aria-label="Plinth section with water"'),
 ('<h3>평면 <small>위에서 본 모습 · 지금 물에 잠긴 부분은 파랑</small></h3>', '<h3>Plan <small>from above · flooded parts filled</small></h3>'),
 ('aria-label="기단 평면과 물"', 'aria-label="Plinth plan with water"'),
 ('<h3>보름 <small>앞뒤 7일의 물, 가로선은 이음목</small></h3>', '<h3>Fortnight <small>7 days either side · the line is the neck</small></h3>'),
 ('aria-label="보름의 물"', 'aria-label="Water over a fortnight"'),
 ('<h3>1년 <small>섬이 되는 날과 둘째 바닥이 잠기는 날</small></h3>', '<h3>Year <small>island days and second-floor flood days</small></h3>'),
 ('aria-label="1년 달력"', 'aria-label="Year calendar"'),
 ('<label for="w-t">시각</label>', '<label for="w-t">Time</label>'),
 ('<button class="btn pri" id="w-play">재생</button>', '<button class="btn pri" id="w-play">Play</button>'),
 ('<button class="btn" data-j="max">가장 높은 물</button><button class="btn" data-j="spring">사리 만조</button><button class="btn" data-j="neap">조금</button><button class="btn" data-j="low">사리 간조</button>', '<button class="btn" data-j="max">Highest water</button><button class="btn" data-j="spring">Spring high</button><button class="btn" data-j="neap">Neap</button><button class="btn" data-j="low">Spring low</button>'),
 ('<button class="btn" id="w-zones" aria-pressed="false">땅 구분 색</button><button class="btn" id="w-ppl" aria-pressed="true">사람</button>', '<button class="btn" id="w-zones" aria-pressed="false">Ground zones</button><button class="btn" id="w-ppl" aria-pressed="true">People</button>'),
 ('<h3>지금 기단은</h3>', '<h3>The plinth now</h3>'),
 ('<h3>오늘 한낮에 열리는 부분 <small>정오의 물보다 높은 바닥과 단</small></h3>', '<h3>Open at midday <small>floors and steps above noon water</small></h3>'),
]: R(a, b)
R('aria-label="재생 빠르기"', 'aria-label="Playback speed"')
R('aria-pressed="false">1초에 10초</button>', 'aria-pressed="false">10 s / s</button>')
R('aria-pressed="false">10분</button>', 'aria-pressed="false">10 min</button>')
R('aria-pressed="true">1시간</button>', 'aria-pressed="true">1 h</button>')
R('aria-pressed="false">6시간</button>', 'aria-pressed="false">6 h</button>')
s = re.sub(r'(<button data-s="[0-9.]+" aria-pressed="false">)1일(</button>)', r'\g<1>1 day\2', s)
s = re.sub(r'(<button data-s="[0-9.]+" aria-pressed="false">)하루(</button>)', r'\g<1>1 day\2', s)

# ---------- 06 Four seas ----------
for a, b in [
 ('<button class="btn pri" id="v-play">재생</button>', '<button class="btn pri" id="v-play">Play</button>'),
 ('aria-label="시각" style="margin-top:8px"', 'aria-label="Time" style="margin-top:8px"'),
 ('aria-label="바다 정보와 지도"', 'aria-label="Sea data and maps"'),
 ('aria-label="네 바다의 기단 3D"', 'aria-label="Plinths of the four seas in 3D"'),
 ('<span class="hint">끌어서 돌리기 · Shift 끌기로 옮기기 · 휠로 확대 · 두 번 눌러 처음 모습</span>', '<span class="hint">Drag to orbit · Shift-drag to pan · scroll to zoom · double-click to reset</span>'),
 ('aria-label="볼 바다"><button data-f="ALL" aria-pressed="true">네 바다</button><button data-f="INC" aria-pressed="false">인천</button><button data-f="SML" aria-pressed="false">몽생미셸만</button><button data-f="HON" aria-pressed="false">통킹만</button><button data-f="VEN" aria-pressed="false">베네치아</button>', 'aria-label="Sea shown"><button data-f="ALL" aria-pressed="true">All four</button><button data-f="INC" aria-pressed="false">Incheon</button><button data-f="SML" aria-pressed="false">Mont-Saint-Michel</button><button data-f="HON" aria-pressed="false">Gulf of Tonkin</button><button data-f="VEN" aria-pressed="false">Venice</button>'),
 ('<h3 style="margin:0 0 6px">다섯 기단 비교 <small>시뮬레이션이 만든 값</small></h3>', '<h3 style="margin:0 0 6px">Five plinths compared <small>values from the simulation</small></h3>'),
 ('<h3>규칙 대신 인천의 다섯 기단을 옮기면 <small>맨 위 바닥에 물이 오는 날, 목표는 0 · 91 · 183 · 274 · 365일</small></h3>', '<h3>Moving Incheon’s plinths instead of using the rules <small>days water reaches the top floor · targets 0 · 91 · 183 · 274 · 365</small></h3>'),
]: R(a, b)
RP('네 기단을 갯벌 높이를 맞춰', 'Four plinths at one scale, set at mudflat level, each filled with its own sea at the same moment. “Five plinths” scatters the five the simulation can produce — water on the top floor 0, 91, 183, 274 and 365 days a year — around the large one. Pick a sea to label each with its days and height; when the water rises, people swim rather than vanish.')
RP('그대로 옮기기는 평균 해수면에 맞추어', '“Moved as is” keeps the heights, aligned to mean sea level. “Moved in proportion” scales them by each sea’s mean daily range.')

# ---------- 대화상자 · 바닥글 ----------
for a, b in [
 ('aria-label="닫기">닫기</button>', 'aria-label="Close">Close</button>'),
 ('aria-label="세계 위치"></canvas><p class="note">세계에서의 위치</p>', 'aria-label="World location"></canvas><p class="note">Location</p>'),
 ('aria-label="바다 지도"', 'aria-label="Sea map"'),
 ('<div><h3>데이터</h3>', '<div><h3>Data</h3>'),
 ('<div><h3>왜 이런 기단이 나오나</h3>', '<div><h3>Why this plinth</h3>'),
 ('<span>RE:TIDE — 조석 기단 시뮬레이터</span>', '<span>RE:TIDE — Tide Simulator</span>'),
 ('<span>Data: 조화상수 4개 관측소 · 1년 10분 간격</span>', '<span>Harmonic constants, four stations · one year at 10 min</span>'),
 ('href="https://jsuggp1234.github.io/YP.ARC/lab.html">← Lab</a>', 'href="../../lab.html">← Lab</a>'),
 ('href="https://jsuggp1234.github.io/YP.ARC/works.html">Studio</a>', 'href="../../works.html">Studio</a>'),
]: R(a, b)
RP('조석은 2025년 10월 1일부터 1년', 'Tides run for one year from 1 October 2025, in each sea’s local time. Incheon uses 10 constants (Byun, 2011) on chart datum; the other three use 40–44 TICON-4 constants (Hart-Davis et al., 2025) on lowest astronomical tide.')
RP('화면의 물높이는 10분 간격으로', 'Water on screen is recomputed in the browser every 10 minutes; the height records and day groups use the thesis system’s one-minute output.')

R('<i style="background:var(--g1)"></i>네 가지 땅</span>', '<i style="background:var(--g1)"></i>Four grounds</span>')
