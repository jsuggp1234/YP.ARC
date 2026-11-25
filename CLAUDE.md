# YP.STUDIO (저장소 이름은 YP.ARC) — Claude Code 작업 안내

이 파일은 Claude Code가 작업을 이어받을 때 먼저 읽는 안내서예요. 지금까지 정한 것과 사이트 구조를 정리해 두었어요.

## 누구를 위한 사이트인가
- 주인: yeop. 건축학과 졸업예정(2027년 2월), 설계사무소 취업 준비 중.
- 코딩 경험이 없어요. 설명은 한국어로, 전문 용어는 풀어서, 건물에 빗대어 설명해 주세요. 코드를 직접 짜게 하기보다 무엇을 바꿨고 왜 그런지를 알려 주는 쪽을 원해요.
- 목표: 건축 설계 작품을 담는 고급스러운 포트폴리오 웹사이트. 레퍼런스는 https://santalarch.com/#works (전체 흐름), https://telhaclarke.com.au/ (작은 글자), https://www.marcel-eberharter.com/ (모션).

## 이미 정한 것 (바꾸기 전에 먼저 물어보기)
- 배경은 순수 흰색 `#ffffff`, 회색은 모두 무채색. 베이지나 따뜻한 톤은 쓰지 않아요.
- 레이아웃과 모션은 santalarch를 최대한 따라가되(2026-11-21 결정), **글자는 작게 유지, 배경은 계속 흰색(검은 구간 없음)**.
- 글꼴(2026-11-22, brandonyasin.com 참고 요청): Neue Haas Unica Pro → Helvetica Neue → Inter → Pretendard 순서(`--sans`). Unica·Helvetica Now는 유료라 파일 없이 `local()`만 연결, 라이선스 woff2를 `assets/fonts/`에 넣으면 site.css 맨 위 @font-face에 url()을 붙여요. 예전: Helvetica 계열 한 가지(맥 Helvetica Neue / 윈도우 Inter / 한글 Pretendard). Mono 라벨은 쓰지 않아요. 상단바만 참고 사이트와 같은 순서(Helvetica Now Variable → Helvetica Neue → Helvetica → Arial, 핀 #17). Helvetica Now는 유료라 파일은 넣지 않아요. Menu·Contact는 셋째 칸에 나란히.
- 글자는 작게. 크기는 `assets/css/site.css`의 `--t-xs`부터 `--t-xxl`까지 토큰으로만 조절해요.
- 글자 위계(2026-11-21, 모든 작품 공통): 작품 제목 `--t-xxl` · 섹션 제목 `--t-l` · 본문 `--t-m` · 그림 제목·단계 번호 `--t-s`(굵게) · 설명·캡션·목록 `--t-xs` · 도면(위젯 SVG) 안 글자 `--t-xs`, 강조 수치만 `--t-s`. 위젯 SVG는 `tide.js`의 `fitText`가 `--fs`를 넣어 그림 크기와 상관없이 화면에서 같은 크기로 보여요. site.css 맨 끝 "글자 위계 통일" 블록.
- 건폐율·용적률 검토기 같은 계산 도구는 넣지 않아요.
- 다이어그램·도면 이미지에는 글자·지시선·점선을 넣지 않아요(2026-11-21). 원본 .ai에서 그림만 뽑고, 글은 `data.js` 그림의 `notes`(그림 아래 N칸 설명)나 `tags`([x%, y%, 글, "c"|"r", "b"|"m"], 그림 위 글자)로 사이트 글자 토큰 크기로 새로 써요. 원본(글자 있는 판)은 `portfolio-source/_svg/*-withtext.*`로 백업.
- 3D 작품 모형 구간(#top, hero3d.js)은 2026-11-21 핀 #432 사용자 요청으로 뺐어요. 메인 순서: 모션 아트 → Works 카드 → Profile → Contact.
- 페이지를 열면 YP.STUDIO 모션 아트(`.yi`, `site.js`의 `intro()`)가 먼저 나오고, 스크롤하면 바로 Works로 가요(2026-11-21 사용자 요청으로 Philosophy 장면은 뺐어요. 문구는 `data.js`에 그대로 남아 있어요). 순서: 모션 아트 → Works(작품 카드) → Profile → Contact.
  - 모션 아트: 글자를 작은 정사각 모듈로 쪼개 아래에서 조립, 마우스를 대면 비켜서며 45° 회전, 클릭하면 흩어졌다 모임, 스크롤하면 위로 흩어짐. 색은 `--ink`/`--line`을 읽어 다크 모드도 따라가요. Notes·Approach·Process·Toolkit·"Based in" 지구본은 "불필요한 과정"이라 2026-11-21에 사용자 요청으로 뺐어요.
- 배경 그리드(세로선·가운데 가로선)는 2026-11-21 사용자 요청으로 뺐어요. 순수 흰 배경만.
- 설계 철학 원문 (사용자가 직접 쓴 문장이라 고치지 않아요):
  > I believe architecture is an answer before an image — found in air and light, structure and joints that can truly be built.
  실용적인 해법을 강조하는 톤으로 나머지 문구를 맞춰요.
- 다크 모드는 오른쪽 위 토글로만 켜지고, 기본은 흰 화면이에요.
- 페이지마다 도면 세트처럼 시트 번호가 붙어요: A-000 표지, A-100 작품 목록, A-1xx 작품, A-900 소개.

## 구조
| 경로 | 역할 |
|---|---|
| `index.html` | 첫 화면 (핀 #35, A-000): 메뉴창과 같은 모양 — 회색 바탕에 페이지 축소판 카드 yeop(about) · philosophy · studio(works) · contact — 머리글자 Y·P·S로 YP.STUDIO처럼 읽히게(2026-11-22). 페이지 key는 works/about 그대로, 보이는 이름만 studio/yeop. 카드엔 네모 모듈 글자(Y·P·S·@, `stArt()`)만 있고 글씨 없음, 흰 바탕 위 반투명 유리 카드. 누르면 모듈이 단어(yeop·philosophy·studio·contact)로 이어지고(`TX.leave`), 다음 페이지에서 흩어져요(`TX.arrive`, sessionStorage `yp-tx`). contact는 철자 → 흩어지며 연락 패널. studio(works) 띠는 초당 60px로 저절로 흐르고(`caseStrip()` DRIFT), 사진에 올리면 멈춤 (`render.home`, 카드 글은 `SITE.start`, 축소판은 `miniHtml()`). philosophy·contact 카드에는 글자 모듈 모션아트(`stArt()`). 휠·끌기·← →로 이동, 누르면 화면 전체로 커진 뒤 이동, contact는 연락 패널 |
| `works.html` | Works (A-010): 예전 홈 — 작품 카드 가로 무한 띠 + 첫 방문 로딩 인트로 (`render.works`). 메뉴의 works 카드가 여기로 |
| `philosophy.html` | Philosophy (A-001): YP.STUDIO 모션 아트(`intro()`) → 설계 철학 문장 → 세 키워드 (`render.philosophy`) |
| `projects.html` | 작품 이름 목록 index (올리면 사진이 커서를 따라옴, A-100) |
| `archive.html` | Archive: 렌더·도면 이미지 가로 무한 띠 (A-200) |
| `project.html#<slug>` | 작품 상세 (v2 머리 → 번호 블록 본문 → 도면 띠 → next case) |
| `about.html` | 소개 (철학 문장 → About me → What I do → Core values → Process → CV, A-900) |
| `assets/js/data.js` | **모든 글과 작품 정보.** 내용 수정은 여기서만 |
| `assets/css/site.css` | 색, 글꼴, 배치, 모션 |
| `assets/js/site.js` | 화면 그리기, 스크롤 장면(`scenes()`), 커서, 페이지 전환 |
| `assets/js/hero3d.js` / `hero2d.js` | 첫 화면 3D 모형 / WebGL이 없을 때 2D 대체 |
| `assets/js/church.js` | 미래교회(Moduleverse Church) 시뮬레이션: `data.js` 그림에 `sim: "cross"|"layers"|"clock"|"plan"|"steps"`를 주면 그림 자리에 들어가요 (project.html에서 Three.js 사용) |
| `assets/js/drawings.js` | 이미지가 없을 때 쓰는 도면 자리표시, 스크롤로 그려지는 선 도면(`Drawing.fig`) |
| `assets/img/` | 작품 이미지 폴더 (아직 비어 있음) |

## 기술 메모
- 빌드 도구 없음. 정적 파일이라 `python3 -m http.server 8000` 후 http://localhost:8000 에서 봐요.
- 라이브러리는 CDN: Three.js r128, GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.13. 글꼴은 Google Fonts의 Inter + jsDelivr의 Pretendard.
- 배치는 8칸 그리드(`.g8`, 칸 사이 간격 없음). 장면의 제목은 화면 가운데 높이 바로 아래에 걸려요(예전 가로선 위치, 선 자체는 뺐어요).
- v2 상단바(2026-11-22, `docs/redesign-plan.md` 1단계): 4칸 그리드 `.g4`(가장자리 16px·간격 8px, 한 칸 = 화면 폭 28.125%, 모바일 8px) — 1 YP.STUDIO · 2 (비움) · 3 Menu/Contact · 4 Local time 서울 시각. 맨 오른쪽 끝은 작은 Light / Dark 버튼(`.md-sw`, 모바일은 다이얼 아래) + Time travel 다이얼(핀 #2, `site.js`의 `dial()`): 원 둘레 점을 돌리면 시각이 움직이고(한 바퀴 12시간) 밤이면 배경이 무채색으로 어두워지며 절반을 넘으면 다크 모드, 그냥 누르면 라이트/다크 전환, × 또는 Esc로 지금 시각. 키보드 ←→(Shift 1시간). 데스크톱 52px, 모바일 32px, 모바일은 로고가 1–2칸. 글자에 마우스를 올리면 위로 굴러요(`roll()`). 예전 상단바 진행선(아래 줄)은 숨김.
- v2 홈(2026-11-22, 계획 2단계): 세로 스크롤 없는 한 화면(`html.v2-home`), 아래쪽에 draft 아닌 작품 카드가 가로로 끝없이 돌아요(`site.js`의 `caseStrip()`, 세 벌 복제). 휠·끌기(5px 넘게)·← →로 이동, 움직이는 동안 0.9배, 사진 1.15배 시차. 카드 크기는 한 칸 폭 × 1.3224(1440에서 397×525). 예전 홈(모션 아트·#reel·Works·Profile)은 `render.homeV1`에 남아 있지만 호출하지 않아요.
- studio 보기 전환(2026-11-22): 상단바 둘째 칸 아이콘 두 개(`.cs-vw`, 슬라이드/그리드). 그리드는 3열(모바일 2열) 세로 스크롤(`.cs-gd`), 바꿀 때 띠 사진이 그리드 칸으로 날아가 앉고 나머지는 아래에서 열리며, 바탕에 네모 모듈이 한 번 스쳐요(`site.js`의 `csView()`). 고른 보기는 localStorage `yp-vw`. 카드 이름 앞 번호 `1. RE:TIDE`(`.cs-no`).
- 첫 화면 글자판(2026-11-22 최신, `render.home`, html.sl-home): 카드 없이 연회색(`--st-bg`) 위에 4칸 그리드로 큰 글자 Y·P·S·@(`.sl-a`, 위에 작은 이름). 글자는 가로 24층(`stGlyph`)이라 마우스가 다가가면 층들이 커서를 피해 물결처럼 밀리고, 2.5초 가만히 있으면 잔물결(rAF `tick`). 올린 글자 말고는 옅어져요. 누르면 다른 글자 층은 흩어지며 떨어지고 바탕은 흰색으로, 누른 글자는 화면 가운데로 가며 단어가 써진 뒤(`stSpell`) 층이 들려 사라지고 이동. 모바일은 2×2. 아래 카드형은 `render.homeCards`로 남김.
- 첫 화면(2026-11-22, brandonyasin.com 벤치마킹): 평평한 연회색 바탕(`--st-bg` #f3f3f3, 다크 #0b0b0b), 재질·그림자 없음. 카드 한 장 = 상단바 한 칸 폭(`stGeo()`), 칸 시작선에 맞춰 네 장, 넷째는 화면 밖으로 이어지고 휠·끌기로 이동. 화면 위 40%는 비우고 카드 위에 대문자 이름(`.st-cap`, --t-s). 카드 속엔 글자 하나(`SITE.start`의 `glyph` Y·P·S·@, `stGlyph()` → `.st-gl`): 글자를 가로 24층(슬래브, clip-path)으로 쪼개 아래층부터 떠오르며 쌓이고, 올리면 위층일수록 더 비켜 나가는 캔틸레버(CSS --k). 글자는 작게(--stw×0.3) 카드 가운데. 누르면 다른 카드·이름은 가라앉고 누른 카드가 화면 가득 커지며 글자가 화면 가운데로 → 뒤 글자가 한 자씩 써지며 단어가 늘 가운데에 오도록 앞 글자를 왼쪽으로 밀어요(Y→Yeop, P→Philosophy, S→Studio, @→@contact, `stSpell()`, `.st-wd`) → 다 쓰면 층이 들려 사라지고 흰 화면으로 이동 → 다음 페이지에서 흰 막이 위로 걷히며 본문 덩어리가 차례로 떠올라요(`stArrive()`, sessionStorage `yp-st` {k:"blank"}). contact는 같은 모션 뒤 연락 패널을 열고 첫 화면을 되돌려요. 사진·포스터 카드(`assets/img/*-poster.svg`)는 사용자 요청으로 뺐어요(파일은 남김). 네모 모듈(`stArt`)·콘크리트(`stConcrete`)·회반죽(`stPlaster`)·철자 넘김(`TX`) 코드는 남겨 두지만 쓰지 않아요.
- 첫 화면 바탕 노출콘크리트(2026-11-22, `stConcrete()` → `--conc`): 거푸집 판(화면 폭/1.7)·줄눈·판마다 폼타이 2×2·얼룩·기포를 그린 뒤 바탕색으로 한 겹 덮어 어렴풋하게. 다크 모드는 어두운 판. 무채색만.
- studio 띠 클릭 버그 수정(2026-11-22): 마우스로 누를 때 focusin이 띠를 움직여 클릭이 빗나가던 것 → 키보드 포커스(:focus-visible)일 때만 맞춤.
- 첫 화면 색(2026-11-22): 바탕 = 메뉴창 회색 `--mn-bg`, 카드 = `--bg`(유리 효과 뺌).
- v2 로딩 인트로(2026-11-22, 계획 3단계): 탭마다 홈에 처음 올 때 한 번(`yp-hi`), 움직임 줄이기면 건너뜀. 가운데 작은 사진(한 칸 폭의 45%)이 0.115초마다 작품 사진으로 바뀌다가 첫 카드(RE:TIDE) 자리로 1.1초 동안 커지고, 나머지 카드가 그 뒤에서 옆으로 펼쳐져요. 로고는 왼쪽부터 써지듯, 메뉴·시각·카드 이름표는 마지막에 나타나요(`site.js`의 `homeIntro()`, CSS `.hi`, `html.hi-on`/`hi-end`). 다른 페이지는 예전 로더 그대로.
- v2 Contact 패널(2026-11-22, 계획 4단계): 상단바 Contact(`[data-contact]`)를 누르면 어느 페이지든 어두운 덮개 위로 패널이 아래에서 올라와요(`site.js`의 `contactPanel()`, CSS `.ct`). 탭 Email / Instagram / Portfolio PDF는 아래 줄 하나를 강조, 닫기는 CLOSE·Esc·바깥 누르기, 주소 끝이 `#contact`면 바로 열림. 전송 폼은 없어요. 글은 `data.js`의 `SITE.contact`, `pdf` 경로가 비면 "Coming soon". 패널 회색은 `--panel`(무채색).
- v2 메뉴(2026-11-22, 계획 5단계): Menu를 누르면 회색 바탕(`--mn-bg`) 위에 페이지 카드 works · archive · about이 놓여요(`#menu.mn`, `site.js`의 `openMenu()`/`closeMenu()`/`miniHtml()`). 카드는 그 페이지 첫 화면 축소판(화면 크기로 그린 뒤 데스크톱 75%·모바일 60%로 줄이고 `clip-path`로 왼쪽만 보여요). 지금 페이지 카드가 화면 전체에서 카드로 줄어들고, 다른 카드를 누르면 화면 전체로 커진 뒤 이동해요. 휠·끌기·← →로 카드 줄 이동, Esc·Close·지금 페이지 카드로 닫기. 예전 목록형 메뉴는 지웠어요.
- v2 Archive(2026-11-22, 계획 6단계): `archive.html`(시트 A-200). 큰 제목 + 셋째 칸 설명·연도(`SITE.archive.lines/years`) + 아래 높이 30svh 이미지 가로 무한 띠(홈과 같은 `caseStrip()`). 이미지 목록 `SITE.archive.items`([slug, 사진, 비율], 작품마다 최대 4장)는 scratchpad의 arch-items.js로 만들었어요. 올리면 이미지 위에 작품 이름.
- v2 작품 이름 목록(2026-11-22, 계획 7단계): `projects.html`. 큰 제목 "index" + 줄마다 번호·이름(`--t-xl`)·종류·연도, 이름에 마우스를 올리면 그 작품 사진(세로형)이 커서를 따라와요(`.cl-pv`). 모바일은 줄 왼쪽에 작은 사진. 글은 `SITE.index`. 홈 셋째 칸 위쪽에 "Index of works (09)" 바로가기(`.cs-ix`). 예전 List/Grid 목록은 `render.projectsV1`에 남김.
- yeop(About) 페이지(2026-11-22 요청): 철학·가치관은 philosophy 페이지 몫이라 빼고 이력 위주로 — 이름(`--t-xxl`) + 한 줄(이름·역할·졸업) → 사진 + About me(`CV.intro`, 이력 소개) + Toolkit → Profile/CV. CV 대분류 제목은 `--t-s` 굵게(핀 #37). 아래 v2 About 판은 `render.aboutV2`로 남겨 둠. 2026-11-24 요청: 한 줄 소개 뒤 졸업 상태 문구·About me 문단·Experience 자세한 줄 뺌, 제목들 살짝 아래로(site.css 끝), Design Studio 아래 오른쪽에 작은 회색 `GPA 4.3/4.5`(`CV.gpa`).
- v2 About(2026-11-22, 계획 8–10단계): `render.about`(예전은 `render.aboutV1`). 철학 문장(`lineRise()`, 한 줄씩 올라옴) → 사진+About me(`CV.intro`) → What I do(`SITE.about.approach`)+Toolkit(`CV.skills` 이름) → Core values(`SITE.pillars`, `coreValues()`: 올리면 `Drawing.fig` 선 도면이 화면 전체에 그려지고 카드는 테두리 상자) → Process 6단계(`SITE.about.process`, `processPin()`: sticky 고정, 지금 단계가 셋째 칸에 오도록 줄이 밀리고 스크롤이 멈추면 가까운 단계로 맞춤) → CV. `draft: true` 글엔 Draft 표시. 참고: Playwright 일반 스크린샷은 sticky 구간에서 빈 화면이 나와서 CDP `Page.captureScreenshot`(fromSurface)로 찍어요.
- v2 작품 상세(2026-11-22, 계획 11–13단계): `render.project` 머리 `.cx-hd`(왼쪽 `.cx-tt` sticky 제목·메타, 오른쪽 `.cx-cv` 화면 높이 대표 이미지, `.cx-lead` 설명 문장 `lineRise` + `pj-facts`), 본문 `.cx-body`(목차 옆 칸 없음, 섹션마다 `data-v` 0–3으로 시작·폭이 달라요, 사진 섹션 `.ph`는 전체 폭), 끝 `.cx-nx` next case(draft 아닌 작품끼리 돌고 마지막 → 첫 작품). `.pg.cx`는 위 여백 0.
- v2 마무리(2026-11-22, 계획 14단계): 움직임 줄이기·키보드 포커스·다크 모드를 6개 페이지 × 2 크기로 확인. 쓰지 않는 예전 코드(`render.homeV1`, `render.projectsV1`, `render.aboutV1`, `intro()` 모션 아트, `reel()`, `worksHandoff()`, 예전 로더)는 사용자 결정 전까지 남겨 둬요.
- 상단바 아래 선은 스크롤에 따라 메뉴 눈금까지 자라고, 화면 아래 고정 표시(`.hud`)에 시트 번호 · 구간 이름 · `01 | 03`이 나와요. 구간은 `data-ind` 속성으로 정해요.
- 메인 첫 장면: `intro()`(모션 아트). 2026-11-21 핀 #408: 도면(펜 윤곽·포셰·기둥) → 기울며 층층이 건물 → 도시(도로망·공원·사람·차) 서사, 화면 아래 단계 자막. 차는 `build.streets`(둘레+글자 사이 골목, 화면 밖까지)를 달려요. 예전 Philosophy 장면 코드(`.mf`, `.pl`)는 `scenes()`에 남아 있지만 요소가 없으면 건너뛰어요.
- 렌더 장면(2026-11-22): `data.js` Scenes 섹션의 `scenes: true` → `site.js`의 `scenesHtml()`. 모든 작품이 같은 틀(줄마다 같은 폭·16:9 높이, 가로 사진 한 장 / 세로·정사각 두 장(셋이면 세 장) 나란히, `object-fit: cover`). 짝이 맞게 사진 순서를 정해요.
- 작품 주소는 `project.html#slug` (해시). 쿼리스트링은 쓰지 않아요.
- Philosophy 장면은 `position: sticky` + 스크롤 진행률로 움직여요. 폭 760px 이하와 `prefers-reduced-motion`에서는 일반 목록으로 펼쳐져요.
- 3D 색은 CSS 변수(`--model`, `--model-2`, `--model-hi`, `--ink`)를 읽어요. 테마가 바뀌면 `yp:theme` 이벤트가 나가요.
- 저장소(localStorage/sessionStorage) 접근은 모두 try/catch로 감싸 두었어요.
- 긴 수정 스크립트는 Bash 명령 안에 통째로 쓰지 않아요(2026-11-21 사용자 요청). Write 도구로 스크래치패드에 .js 파일을 먼저 만들고 `node 파일`로 실행해요.
- 표지 다음 화면 `#reel`(2026-11-21 채팅 요청): 제목 → 휘어진 무한 이미지 띠 → 설계 철학 한 줄 + Works·About 밑줄 링크. 사진 목록은 `data.js`의 `SITE.reel`([slug, 사진, 가로/세로 비율]). 핀 #448로 카드는 높이만 같고(데스크톱 420px, 모바일 260px) 폭은 사진 비율대로라 잘리지 않아요. 움직임은 `site.js`의 `reel()`(requestAnimationFrame, 매 프레임 0.8px, 5px 넘게 끌면 드래그·놓으면 0.95배씩 감속, 화면 밖·숨은 탭에서 멈춤, 움직임 줄이기 설정이면 드래그만). 위아래 곡선 마스크는 `var(--bg)`라 다크 모드도 맞아요.

## 2026-11-22 오후 추가분
- 첫 화면 글자(최신, 2026-11-22 5차): `YP. STUDIO`(`.sl-a`)가 가운데에 서 있어요. 스크롤·방향키 → 글자들이 흥분해 **수평선 위에서만** 커서 반대쪽으로 달아나요(웅크렸다 출발, 가속하며 앞으로 기울고 목표 앞에서 제동하며 젖힘, 속도에 맞춘 보폭, 다른 글자를 만나면 그 위로 올라타 넘어감 — STUDIO는 넘지 않음). 1.1초 조용하면 집으로 걸어와요. **글자를 누른 채 끌면 잡혀서** 누른 자리를 축으로 커서에 매달려 흔들리고(진자, `grab`/`physics`), 버튼을 놓으면 던진 속도로 떨어져 통통 튄 뒤 집으로 걸어가요(창 밖에서 놓아도 `dropAll`). 서 있을 땐 점(.)이 다른 글자 위로 뛰어오르고, Y는 왼쪽을 돌아다니고, Y·P는 뛰고 쳐다보고, STUDIO는 작게 뛰거나 떨어요. 링크 기본 끌기는 막았어요(`draggable=false`, dragstart). 코드: `render.home`의 `actors`/`fleeTo`/`grab`/`letGo`. 감정(6차): 서 있을 땐 숨쉬기(글자마다 다른 박자), 커서가 천천히 다가오면 궁금해서 까치발로 몸을 내밀고, 빠르게 스치면 깜짝 놀라 한 발 물러서며 떨어요. 9초 넘게 입력이 없으면 꾸벅꾸벅 졸다가(숨이 느리고 깊어짐) 움직이면 차례로 깜짝 깨요. 잡히면 처음엔 버둥대다 체념하고, 세게 돌려 놓으면 어지러워 비틀, 그냥 놓으면 몸을 털며 투덜. 집에 돌아오면 기뻐서 두 번 통통. 친구가 잡혀 있으면 다른 글자들이 불안해 떨어요.
- 작품 상세 대표 이미지: `data.js` 작품의 `coverR`(가로/세로)로 잘리지 않게 — 1.2 이상이면 가로형 머리 `.cx-w`, 아니면 `.cx-t`. `coverVideo`가 있으면 영상(움직임 줄이기면 사진).
- `seq.tag: true` → 장면 위에 지금 단계 이름(`.seq-tag`). 그림 `tags`의 글자(`.ftag`)에 `pt`/`lv` 종류.
- `keyed`(키 그림 + 스크롤로 바뀌는 상세들, `keyedHtml`/`keyedInit`): 항목의 `notes: [[번호, 글], …]`는 그림 아래 번호 목록(`.kj-nt`).
- Tree House `sim: "stops"`: 정지 자리 버튼·자동 순환·드릴 rpm 슬라이더(`.mv-ui`), 남은 시간 표시.
- RE:TIDE 수위 그림 `water-a..f.jpg`: 시뮬 프레임에 원본 상세 평면 `도면/2_2.jpg`를 곱하기로 겹친 것(원본 프레임 백업은 scratchpad `water-bak`).
- 도시 미니게임 Air & Light(핀 #75, `assets/js/citygame.js`, philosophy.html만 불러요): 모션 아트 아래 "Play — build a block" 버튼(`.yi-play`) → 화면 전체 `.cg`. 9×9 대지에 층(최대 6층, 36층까지)·공원(6곳)을 놓아 120명을 살게 하면서 아침·정오·오후 햇빛 70% 이상 지키기. 그림자는 해 위치로 계산, Sun 슬라이더로 시각을 돌려 볼 수 있고, 사람이 공원·빈 땅을 걸어요. 오른쪽 클릭·Erase로 빼기, Esc·Close로 닫기, 성공하면 철학 문장 카드. 무채색·다크 모드 따라감.
- Illustrator COM 작업은 한 번에 하나씩(여러 개를 동시에 걸면 큰 파일에서 1시간 넘게 멈춤).

## 확인 방법
- 데스크톱 1440×900, 모바일 390×844에서 각 페이지를 열어 콘솔 오류와 가로 스크롤이 없는지 봐요.
- 첫 화면은 매스 호버·클릭, 다크 토글, Philosophy 장면의 진행(시작·중간·끝)을 확인해요.

## 진행 상황
- 작업 브랜치: `v2-redesign`(2026-11-22부터, `v1-calculator`의 커밋 81cb4b8에서 갈라짐). 예전 `v1-calculator`는 PR #1 열려 있음 (https://github.com/jsuggp1234/YP.ARC/pull/1).
- GitHub Pages 공개(2026-11-23 사용자 요청): https://jsuggp1234.github.io/YP.ARC/ — `v2-redesign` 브랜치 루트에서 바로 공개돼요(`.nojekyll`). 그래서 이 브랜치에 push하면 곧 인터넷에 반영돼요. **push(=공개 갱신)는 사용자에게 먼저 확인받기.**

## 남은 일
1. 작품은 9개. 포트폴리오 PDF(`portfolio-source/`, git 제외)로 RE:TIDE · Motorism · Tim(team) Work · Modular O′ housing 4개를 채웠어요. 나머지 5개(`draft: true`)는 CV의 수상·스튜디오 이름만 있어요 — 사용자 자료를 받으면 채우기(작품명 확인 필요).
2. 프로필은 PDF 2면 기준. 생년월일·이메일·인스타그램은 사용자 요청으로 공개, 전화번호는 싣지 않아요. 프로필 사진은 원본(`portfolio-source/2.jpg`).
- 작품 도판: `portfolio-source/*.ai`(PDF 호환)를 pdf.js로 고해상도 렌더링해 잘라 `assets/img/<slug>/`에 넣었어요. 각 이미지의 `r`(가로/세로)로 원래 비율을 유지해요.
- **원본 우선 (2026-11-21 사용자 요청)**: PDF 캡처 대신 원본을 써요.
  - 렌더: `portfolio-source/<작품>/렌더/` 원본을 긴 변 2400px JPG로 줄여 같은 파일 이름으로 교체했어요.
  - 다이어그램·도면: 각 작품의 `다이어그램/`, `도면/` .ai를 일러스트레이터(PowerShell COM, `exportForScreens` → SVG, 글자는 윤곽선)로 내보내 `portfolio-source/_svg/`에 두고, `portfolio-source/_svg/crop.js`(브라우저에서 실행)로 필요한 칸만 남겨 `assets/img/<slug>/*.svg`로 저장해요. `<img>`로 쓰는 SVG는 웹폰트를 못 읽어서 글자를 윤곽선으로 내보내요.
  - 선이 너무 많아 SVG가 수 MB를 넘는 도면(예: LH 단면 A–A, 평면 4장)은 같은 벡터를 4000–7200px JPG로 직접 그려 써요.
  - RE:TIDE 다이어그램 원본(.ai "[변환됨]")은 이 컴퓨터에서 ·, ≈ 같은 기호가 €, Œ로 깨져서, 지금 사이트의 정리된 그래프를 그대로 둬요.
- 작품 페이지 부품(`data.js` 섹션 옵션): `widget`(tide.js의 moon·loop·dial·sine·flow·orbit·zoning·skin), 섹션 `v`(0–3, 시작 위치·폭 단 지정, 없으면 순서대로), `seq`(장면 넘김, `fade` 제자리 교차, `k` 크기 배율), `pan`(`loop: true`면 마우스를 올리고 휠로 도는 무한 띠. `h` 높이, `solid` 불투명, `labels: [[x%, 번호, 이름, 설명], …]`로 각 그림 아래 사이트 글자 이름표. `after: true`면 그림들 뒤, `w`로 폭), `panel`(`left`/`right`가 비면 `mapp-wide`), 그림의 `reveal: N`(N칸 그림을 스크롤에 따라 왼쪽부터 한 칸씩 드러냄, 핀 #8), seq의 `car`(장면 위를 달리는 빨간 네모, `site.js`의 `CAR_PATHS`, 핀 #4), 그림의 `flow`(칸이 드러난 뒤 빨간 힘의 흐름 길과 흐르는 점, `site.js`의 `FLOW_PATHS`, 핀 #19), `cols`+`cw`(칸 너비 비율), `sim.sections`(평면 시뮬레이션과 같은 수위로 물선이 움직이는 단면, `ticks: [[m, 위에서부터 비율], …]`).
3. 한국어 번역과 메모 문장 다듬기 (지금은 초안).
4. 사용자 승인 후 GitHub Pages로 공개.

## 실시간 핀 피드백 (로컬 전용)
- 실행: `node tools/feedback/server.js` → 사이트 http://localhost:8000/ , 피드백 http://localhost:8000/feedback
- 사용자가 핀을 꽂으면 `.feedback/events.log`에 한 줄(JSON)이 추가돼요. Claude는 Monitor로 `tail -F .feedback/events.log`를 지켜보다가 수정해요.
- 처리 순서: `node tools/feedback/reply.js <id> working` → 코드 수정(저장하면 피드백 화면이 자동 새로고침) → 답글을 UTF-8 파일로 써서 `node tools/feedback/reply.js <id> done @파일`.
- 핀 데이터는 `.feedback/pins.json` (git 제외). 위치는 `page`, `mode`, 문서 좌표 `x,y`, 그때 화면 폭 `vw`, 클릭한 요소 `sel`/`txt`로 기록돼요.
- 이미지: 사용자가 사이트 위에 이미지를 끌어다 놓으면 그 자리에 핀이 생기고(기존 핀 위면 그 핀에 추가), 파일은 `.feedback/uploads/`에 임시 저장돼요. 핀의 `images`에 경로가 들어 있어요. Claude는 이 파일을 `assets/img/<작품 slug>/`로 알맞은 영어 이름으로 옮기고(복사 후 원본 삭제) `data.js`의 `cover`/`src`에 연결해요. 25MB 이하 jpg·png·webp·gif·avif만 받아요.
- 모션 아트 → Works 넘기기(2026-11-21 채팅 요청): `site.js`의 `worksHandoff()`. 같은 날 이미지 띠 화면(#reel)이 사이에 들어오면서 호출을 꺼 뒀어요(모듈이 사진 위로 날아감). 핀 #440에서 넘기기를 다시 정해요. 스크롤 후반에 도시 모듈(윗면 정사각형)들이 떠올라 첫 카드 세 장의 자리를 9칸 타일로 채우고, 내려앉으면 카드 사진이 드러나요. 스크롤에 묶여 되감기도 돼요. 화면 고정 캔버스 `.hand-cv`.
- 작품 카드 hover 영상: `assets/img/<slug>/card-loop.mp4`(원본 `portfolio-source/대표사진 영상/`), `CARD_FX`에 연결. 영상은 사진과 같은 비율·같은 첫 장면이라 사진의 object-position을 따라가요.

## 2026-11-23 추가분
- 작품 상세 왼쪽 가장자리를 잡고 오른쪽으로 끌면 studio(works.html)로 돌아가요(`site.js`의 `swipeBack()`, CSS `.sb-*`). 상단바 Contact 링크는 숨김(`hidden`, 코드에서 클릭은 계속 씀).
- `fplan`(섹션 옵션, `fplanHtml`/`fpInit`): 층별 평면 sticky 보기 — 스크롤로 층이 바뀌고, 번호·목록에 올리면 서로 강조(`.fp-on`).
- 그림 `lead: N, ln: true`: 그림 위 번호 점(`tags`의 `"c pt"`) + 오른쪽 이름 목록 + 지시선, `notes: [[번호, 이름, 설명]]`.
- seq `frames`의 단계 `tags`(그림 위 글자)는 `z-index: 6`으로 fade 그림 위에 와요. `below: true`면 단계 목록이 그림 아래.
- Illustrator 원본에서 글자 없이 뽑기: scratchpad `ai-clean.ps1`(글자·지시선·번호 동그라미·글자 흰 테두리 윤곽선·긴 칸 나눔 선 숨김, 상자별 imageCapture, 지시선 끝점 좌표 JSON). imageCapture 뒤에는 Illustrator가 다음 호출에서 RPC 오류를 내므로 매번 껐다 켜요.
- 무채색 + 조명색만: ffmpeg `geq`로 채도(최대−최소) 22 이하는 회색으로, 그 위만 색을 남겨요(SMART PIXEL 밤 장면).
- `git checkout`으로 data.js를 되돌리면 CRLF가 돼서 `\n` 기준 수정 스크립트가 실패해요 → `sed -i 's/\r$//'`로 되돌린 뒤 실행.

## 2026-11-24 lab 페이지
- 메뉴에 `lab` 추가(`SITE.pages`, 시트 A-300). `lab.html`은 projects처럼 이름 목록이고, 이름에 올리면 세로 미리보기 사진이 커서를 따라와요(`render.lab`, 공통 `clHover()`). 글은 `SITE.lab`(title·note·items).
- 항목: tide-sim → `lab/tide-sim/`(RE:TIDE 조석 기단 시뮬레이터 빌드본, `index.html`+`tide.json`. 원본은 jsuggp1234/Tide-sim 저장소, 시뮬레이터를 고치면 이 사본도 같이 갱신), bim-sim은 `soon: true`(준비 중, 공개 주소를 받으면 `href` 연결).
- 미리보기: `assets/img/lab/tide-sim.jpg`(397:525), `bim-sim.svg`(자리표시).

## 2026-11-24 도면 치수 표기 통일 (라 후니타 배치도 방식, 사용자 요청)
- 그리드 기호는 동그라미 없이 굵은 짧은 선 + 글자: 그림 `tags`의 종류 `gx`(X), `gyl`(왼쪽 Y, 시계 반대 90°), `gyr`(오른쪽 Y, 시계 90°). 회전 글자만 필요하면 `rl`/`rr`.
- 세로 치수 글자도 같은 규칙: 왼쪽이면 시계 반대, 오른쪽이면 시계 방향(`dimsHtml`의 `dl`, `seq-dm.v.l`).
- 실 번호(`pt`)는 모든 그림에서 동그라미·흰 바탕 없이 숫자만(site.css 끝 블록). `.fp-n` 강조도 동그라미 없음.
- 그림에 구워져 있던 동그라미 기호·검정 원 번호는 지우고(scratchpad `bub.py` 인페인트) 같은 자리에 tags로 다시 씀: Motorism 6개 층, Tim(team) Work 8개 층(1F는 원래 기호 없음 → 기호만 추가), RE:TIDE 파빌리온·리프(오른쪽 A–F, SA–SJ), The Tree House 평면·네 상태.
- Natural Palette 층별 평면(`fplan.grid`, `site.js`의 `axHtml`): 배치도 그리드 X1–X10·Y1–Y9과 치수(mm)를 같은 축척으로 옮겨 그림(배치도 → 평면 변환 2.16배, 벽·기둥에 맞춰 확인).
- Campus Renovation 평면은 원래 이 방식이라 그대로. Samgakji·Smart Pixel·RE:TIDE 광역 배치도·캠퍼스 배치도·메타버스 지도는 도시 스케일 분석도라 그리드를 넣지 않음.

## 2026-11-25 모바일 도면 글자 정리 (사용자 요청: 모바일에서 그림 속 글자 겹침)
- 모바일(≤760px)에선 그림 위 글자(`.ftag`, `.seq-dm em`, `.fp-n` 등)가 **그림 폭에 비례**해요: `site.js`의 `mwInit()`이 그림마다 `--mw`(지금 폭 px)와 `--fr`(데스크톱에서 잰 "글자 ÷ 그림 폭")을 넣고, site.css 끝 블록이 `font-size = mw × fr`(5–9px, 치수 ×0.8, 그리드·번호 ×0.9)로 계산 → 모바일도 데스크톱과 같은 배치.
- `--fr` 값은 `assets/js/figw.js`(`window.FIGW`, 그림 src별). **그림 위 글자 크기나 데스크톱 배치를 바꾸면 scratchpad `figw.js`(데스크톱 1440에서 재서 다시 씀)로 다시 만들기.** 없는 그림은 0.0125.
- 모바일은 글자 뒤 얇은 흰 테두리(text-shadow)로 선 위에서도 읽혀요.
- seq `box`(Tim(team) Work 여섯 상세): 모바일은 지시선 끝에 번호만, 번호·이름 목록(`.sbx-lg`)은 그림 바로 아래.
- 겹치던 글자 위치 정리: RE:TIDE 마운드 배치도 프로그램 이름, Natural Palette 층 분해도(층 이름 3줄로 왼쪽), 홀 단면 "Lake ground", Modular O′ X1–X6(위로), Motorism 하중 그림(데스크톱 7px, "10 % trunk" 오른쪽 맞춤, 그림에 구워진 검정 원 번호 지움).
- 모바일 작품 페이지 `.pg.cx { overflow-x: clip }`(가로 넘침 방지).
- Natural Palette 배치도(2026-11-25 요청): 깃발(`fl`) 빼고 글자만, X는 `gx`·Y는 `gyr`(층별 평면과 같은 표현), 치수선 0.5px·숫자 8px. 좁은 치수 칸은 `dims` 6번째 값 `"b"`로 숫자를 선 반대쪽에(`.dim-t.db`).
- 같은 날 요청: 치수 끝 빗금을 아주 작게(그림 옵션 `tk`, 기본 0.6 → 배치도 0.22), 치수 숫자는 100 단위 반올림(합계도 맞춤: 36,900 · 26,400). 층별 평면 `fplan.grid` 값도 같이 반올림.

## 2026-11-25 다이어그램 고도화 (사용자 요청: 유치원·삼각지 다이어그램을 다른 작품 수준으로)
- Natural Palette "Four Readings of the Site": 실제 배치도(`site.jpg`)를 옅게 깐 위에 벡터로 새로 그린 `read-{sun,view,noise,access}.jpg`(scratchpad `np-read.js` → 글자 tags `np-fix.js` → 연결 `np-wire.js`). 해: 37.5° 하늘 반구 투영·하지/춘추분/동지 경로·정오 그림자, 조망: 층별 시야 원뿔, 소음: 도로 소음 띠와 거르는 켜, 접근: 차·아이 동선과 두 출입구. 예전 sun/view/noise/access.jpg는 남겨 둠.
- 삼각지 콘셉트 Inflow·Mixing·Cycle: 449px 작은 그림 대신 실제 대지(strategy-3) 위에 새로 그린 `concept-*-v2.jpg`(scratchpad `sg-concept.js`, `sg-wire.js`).
- 삼각지 Strategy·Mass 12장(2차, 사용자 "훨씬 고도화"): 원본에서 필지·기본 매스·단계별 검정 매스를 윤곽으로 뽑아(scratchpad `sg-geo.py` → /tmp/pl/sg-geo.json) 벡터로 새로 그린 `process-01..12.jpg`(`sg-steps.js`, 연결 `sg-wire2.js`). 바탕 strategy-2를 옅게, 축은 단색 화살표(상업 축 붉은색·녹지 축 검정·대비 축 회색·교통 축 검정), Step 01–07은 지난 단계 매스 회색 + 이번 단계 검정(붉은 테두리) + 오른쪽 위 7칸 진행 표시. 13번 배치도는 `site-plan-aligned-c.jpg`.
- 같은 날 유치원 2차(사용자: 그라데이션 쓰지 말고 정보 더): `np-read2.js` — 해: 동지 08–16시 일조 시간 지도(건물 높이로 계산, 1 m 칸 4단계)·하늘 반구 15° 고리·09/12/15시 그림자, 조망: 층별 눈높이·시야각·10 m 고리·조망 쪽 창, 소음: 도로 72 dB 선음원 15log 감쇠·건물 뒤 −9·가로수 −2 dB 지도(5 dB 단계)와 마당별 값, 접근: 동선 길이·아이 걸음 시간(0.9 m/s)·주차/내려주는 칸. 그라데이션 없음, 범례는 오른쪽 위 상자 + tags.
- 같은 날 3차(사용자): 다이어그램은 **웬만하면 무채색** — sg-steps·sg-concept·np-read2 모두 붉은색 빼고 검정·회색 단계로 다시 그림(상업 축 검정, 녹지 축 진회색, 대비 축 연회색, 교통 축 검정 가는 선 / 일조 4단계 회색 / 소음 검정 투명도 4단계 / 숲 쪽 창·시야는 회색). 지시선(`leadHtml`)은 번호 오른쪽에서 시작하고 점은 숨김(번호와 선이 겹쳐 안 보이던 문제). 레벨 숫자(`.fp-lv`, `.ftag.lv` 치수 제외)는 실 번호보다 작고(×0.78) 연하게(먹 45%), 실 번호는 굵고 조금 크게 — site.css 맨 끝 블록.
- 같은 날 4차(사용자: Step 다이어그램 옆에 3D 엑소노): Strategy seq에 `axon: true` + 단계마다 `ax`(그림)·`axTags`(그림 위 글자) → 평면 옆 `.seq-ax` 칸(`.seq-duo`, 모바일은 위아래). 그림은 scratchpad `sg-axon.js`+`sg-axon-page.js`(three r128 + 굵은 선, 남동쪽 위 평행 투영, 면마다 한 톤·한 가지 회색 그림자, 무채색)로 `axon-01..13.jpg`. 주변 건물 377동은 strategy-2의 닫힌 흰 칸에서 뽑음(`sg-ctx.py` → /tmp/pl/sg-ctx.json). 높이(5차, 사용자 야경 렌더 기준 — '층수가 하나도 안 맞아'): 1 px = 0.2 m, 층고 3.3 m. 유리 탑 B(889,601) 18층·A 북쪽(659,599) 14층 + 둘을 11–13층에서 잇는 벽돌 다리동, 목조 탑 C(1165,601) 18층·D(1424,601) 14층 + 10–13층의 긴 다리동(Step 03부터), 데크·Step 05 네모 4층, 유리 지붕 긴 창고 2층, 탑 A 앞 낮은 동 4–5층, 관문 3–4층, 마을 2–4층(네모난 작은 집은 박공). 시점은 렌더와 같은 남서쪽 위, 대지 삼각형에 자동 맞춤. 블록별 높이는 scratchpad `ax-h.py`/`sg-axon.js`. 6차(사용자: '이곳은 선큰가든'): 목조 탑 동쪽, 길가 삼각형 [[1714,566],[1940,566],[1722,722],[1676,690]]은 건물이 아니라 계단식 선큰가든 — 땅·대지 판에 구멍을 내고 안쪽으로 4단 내려가 바닥 −4.2 m, 나무 5그루(`ax-garden.py`). 그 안의 Step 07 조각 4개는 뺐고, 동쪽 끝 줄지은 3층 연립(기본 매스 x>1770)을 Step 07부터 넣음. 7차(사용자: 세 모서리 관문은 모두 **공지**, 건물 없음): mass-7의 톱니 테두리 검정은 매스가 아니라 비울 자리. 평면 Step 07(`strategy-step-12-open.jpg`)은 원 안 매스를 지우고 빗금+점선 광장, 엑소노는 원 안 건물이 Step 07부터 사라지고 바닥 빗금(`ax-open.py`), 동쪽은 선큰가든. 글자 tags는 `ax-tags.py`로 다시 연결. 평면 그림은 캐시 때문에 `strategy-step-NN.jpg`로 이름 바꿈.
- 같은 날(사용자): 층별 평면(fplan)은 **모바일에서도** 스크롤하면 층이 차례로 넘어가요(탭 그대로, 평면 위·탭·진행 막대 `.fp-pg`(--fpp)·목록 아래, 목록은 안에서 스크롤). 움직임 줄이기만 탭 전용.
- 같은 날(사용자: Site — Macro 고도화): `macro-v2-1..4.jpg`(scratchpad `mc-base.py` 원본 세 장 최댓값으로 글자 지운 도시 조직 → `mc-geo.py` 철도·기지 경계·한강대로 선 → `mc-draw.py` 벡터 그림·범례·막대, 글자 tags `mc-wire.py`). 1 px ≈ 1.9 m(근사, 삼각지역–용산역 거리). 1 경계(길이), 2 축(개발 흐름·허브 250/500/1000 m·대지에서 거리), 3 구역(5구역 무늬·면적), 4 남은 땅(경계를 넘지 않고 걸어 닿는 칸, 800 m 안 약 31%). 예전 macro-1..4.jpg는 남김. Blooming 작품 이름은 UNFURL로(사용자).
