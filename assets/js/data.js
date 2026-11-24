// ============================================================
// data.js — 사이트의 "내용"은 전부 여기서 고쳐요. (디자인·코드는 몰라도 됨)
//
// ※ 지금 들어 있는 작품명·설명은 레이아웃 확인용 "예시"예요. 실제 작품으로 바꿔 주세요.
//
// 이미지 넣는 법
//   1) assets/img/<작품폴더>/ 에 파일을 넣고
//   2) cover: "assets/img/shared-ground/cover.jpg" 처럼 경로를 적어요. (coverCaption: 대표 이미지 캡션, thumb: 카드·목록용 이미지, coverPos: 잘릴 때 보일 부분 "가로% 세로%")
//   3) 이미지 칸에 src를 비워두면 { kind: "plan" } 처럼 적은 종류의 "도면형 자리표시"가 그려져요.
//      kind 종류: site(배치도) · concept(다이어그램) · axon(액소노메트릭) · plan(평면) · section(단면) · elevation(입면)
//
// 첫 화면 3D 매스
//   pos:  [가로, 세로]  격자 위 위치 (-6 ~ 6)
//   mass: [[x, y, 폭, 깊이, 높이, 띄움], ...]  작품 기준 좌표, 1 = 격자 한 칸(약 7.2m)
//         띄움(선택): 바닥에서 떠 있는 높이 — 필로티 위 매스, 브리지, 캔틸레버 슬래브에 써요
// ============================================================

const SITE = {
  name: "YP.STUDIO & LAB", // 핀 #250·#252
  // 표지 다음 화면의 휘어진 이미지 띠 — [작품 slug, 사진, 가로/세로 비율]. 작품 사진(렌더)만, 작품마다 1~2장
  reel: [
    ["re-tide", "assets/img/re-tide/cover.jpg", 0.859],
    ["motorism", "assets/img/motorism/cover.jpg", 2.034],
    ["timteam-work", "assets/img/timteam-work/cover.jpg", 2.01],
    ["modular-o-housing", "assets/img/modular-o-housing/cover.jpg", 1.778],
    ["samgakji-residential", "assets/img/samgakji-residential/guesthouse.jpg", 1.502],
    ["smart-pixel", "assets/img/smart-pixel/cover-lane.jpg", 0.914],
    ["campus-renovation", "assets/img/campus-renovation/eng1-courtyard-winter.jpg", 1.778],
    ["re-tide", "assets/img/re-tide/scene-2.jpg", 0.973],
    ["motorism", "assets/img/motorism/interior-museum.jpg", 1.778],
    ["timteam-work", "assets/img/timteam-work/night-exterior.jpg", 0.635],
  ],
  owner: "Jeong Seungyeop",
  ownerKo: "정승엽",
  birth: "1999.08.26",
  role: "Architectural Designer",
  based: "Seoul, KR",
  coords: "37.5665° N, 126.9780° E",
  status: "2027년 2월 졸업예정",
  portrait: "assets/img/profile.jpg", // 원본: portfolio-source/전시 사진2.jpg (993×1440)
  email: "jsuggp1234@naver.com",
  links: [
    { label: "Instagram", href: "https://instagram.com/yee.oop" },
    // { label: "GitHub", href: "https://github.com/..." },
  ],
  // Contact 패널 (v2 4단계). 전송 폼은 없어요(서버 없음). pdf가 비어 있으면 "준비 중"으로 보여요
  contact: {
    title: "Open to work",
    note: ["2027년 2월 졸업 · 설계사무소 지원", "Based in Seoul, KR"],
    lead: "", // 핀 #180 문구 삭제
    pdf: "assets/portfolio.pdf", // 핀 #181: portfolio-source/프로필의 20장 PDF
    pdfNote: "PDF는 준비 중이에요. 메일로 요청하시면 보내 드려요.",
  },
  // Menu 카드 세 장 (v2 5단계)
  // 첫 화면 카드 네 장 (핀 #35). glyph = 카드 안 모션 아트 글자
  // 첫 화면 카드 머리글자가 Y · P · S 로 이어져 YP.STUDIO처럼 읽혀요 (2026-11-22 요청). key는 페이지 종류라 그대로, 보이는 이름만 바꿔요
  start: [
    { key: "about", title: "yeop", glyph: "Y", href: "about.html", note: "Profile, process and CV" },
    { key: "philosophy", title: "philosophy", glyph: "P", href: "philosophy.html", note: "Answer before image — air and light, structure and joints." },
    { key: "contact", title: "contact", glyph: ".", word: ".contact", href: "#contact", contact: true, note: "Email · Instagram · Portfolio PDF" },
    { key: "works", title: "studio", glyph: "STUDIO", word: "STUDIO", href: "works.html", note: "Selected works, 2022—2027" },
    // 핀 #247: "YP. STUDIO & LAB" — &는 contact(연락 패널), LAB은 lab 페이지
    { key: "contact", title: "contact", glyph: "&", word: "&contact", href: "#contact", contact: true, note: "Email · Instagram · Portfolio PDF" },
    { key: "lab", title: "lab", glyph: "LAB", word: "LAB", href: "lab.html", note: "Simulations — tide-sim, bim-sim" },
  ],
  pages: [
    { key: "about", title: "yeop", href: "about.html" },
    { key: "philosophy", title: "philosophy", href: "philosophy.html" },
    { key: "works", title: "studio", href: "works.html" },
    { key: "lab", title: "lab", href: "lab.html" },
    { key: "contact", title: "contact", href: "#contact", contact: true },
  ],
  // Lab 페이지 (2026-11-24 요청): 설계를 돕는 시뮬레이션 도구. 줄을 누르면 그 도구가 열려요
  lab: {
    title: "lab",
    note: "Tools built alongside the work — simulations that read data and turn it into space.",
    items: [
      { key: "tide-sim", title: "tide-sim", href: "lab/tide-sim/", type: "Simulation — tidal plinths", year: "2026", img: "assets/img/lab/tide-sim.jpg" },
      { key: "bim-sim", title: "bim-sim", href: "https://jsuggp1234.github.io/bim-ai-sim/", type: "Simulation — BIM", year: "2026", img: "assets/img/lab/bim-sim.svg" } /* 핀 #246 */,
    ],
  },
  // About 페이지 (v2 8–10단계). draft: true 인 글은 제가 쓴 초안이라 화면에 "Draft"가 붙어요 — 확인 후 draft를 지우면 표시가 사라져요
  about: {
    image2: "", // What I do 옆 사진 (핀 #36으로 뺌)
    doTitle: "What I do",
    approach: {
      draft: true,
      items: ["Site reading", "Section first — air & light", "Structural order", "Joints & details", "Simulation & data", "Drawings & visualization"],
    },
    toolkitTitle: "Toolkit",
    valuesLead: { draft: true, text: "Three principles hold every drawing together" },
    processLead: { draft: true, text: "A process that moves from the question to the joint" },
    process: {
      draft: true,
      steps: [
        { k: "Read", d: "대지와 주변을 걸으며 흐름을 읽고, 풀어야 할 문제를 한 문장으로 적어요.", t: "Find the question first." },
        { k: "Define", d: "프로그램과 규모, 법규를 정리해 무엇을 먼저 풀지 정해요.", t: "Name what must be solved." },
        { k: "Section", d: "단면에서 빛이 들어오고 바람이 지나가는 길을 먼저 그려 봐요.", t: "Air and light come first." },
        { k: "Structure", d: "구조의 질서와 모듈을 정해 공간의 뼈대를 세워요.", t: "Order before ornament." },
        { k: "Joint", d: "재료가 만나는 접합부를 크게 그려 실제로 지어질 수 있는지 확인해요.", t: "Details decide the building." },
        { k: "Draw", d: "도면·다이어그램·렌더로 해법을 누구나 읽을 수 있게 정리해요.", t: "Make the answer readable." },
      ],
    },
    cvTitle: "Profile",
  },
  // 작품 이름 목록 페이지(projects.html, v2 7단계)와 홈의 바로가기 글
  index: { title: "index", note: "Selected works", link: "Index of works" },
  // Archive 오른쪽 짧은 설명과 연도 범위 (5단계 메뉴 카드, 6단계 Archive 페이지에서 같이 써요)
  archive: { lines: ["Renders, drawings", "and studies"], years: "2022—2027",
    // [작품 slug, 이미지, 가로/세로 비율] — scratchpad/arch-items.js로 만들었어요(작품마다 최대 4장)
    items: [
      ["re-tide","assets/img/re-tide/cover.jpg",0.859],
      ["re-tide","assets/img/re-tide/site-wide.jpg",1.911],
      ["re-tide","assets/img/re-tide/twelve-mounds.jpg",1.678],
      ["re-tide","assets/img/re-tide/water-a.jpg",1.462],
      ["motorism","assets/img/motorism/cover.jpg",2.034],
      ["motorism","assets/img/motorism/district-map.jpg",1.506],
      ["motorism","assets/img/motorism/axonometric.jpg",1.349],
      ["motorism","assets/img/motorism/detail-section-aa.jpg",0.653],
      ["timteam-work","assets/img/timteam-work/cover.jpg",2.01],
      ["timteam-work","assets/img/timteam-work/card.jpg",0.635],
      ["timteam-work","assets/img/timteam-work/territorial-reading.jpg",0.708],
      ["timteam-work","assets/img/timteam-work/composition-1.jpg",0.857],
      ["modular-o-housing","assets/img/modular-o-housing/cover.jpg",1.778],
      ["modular-o-housing","assets/img/modular-o-housing/loop-wheel.jpg",1],
      ["modular-o-housing","assets/img/modular-o-housing/axonometric-render.jpg",1.778],
      ["modular-o-housing","assets/img/modular-o-housing/section-a.jpg",1.614],
      ["samgakji-residential","assets/img/samgakji-residential/guesthouse.jpg",1.502],
      ["samgakji-residential","assets/img/samgakji-residential/macro-1.jpg",1.415],
      ["samgakji-residential","assets/img/samgakji-residential/macro-2.jpg",1.415],
      ["samgakji-residential","assets/img/samgakji-residential/macro-3.jpg",1.415],
      ["smart-pixel","assets/img/smart-pixel/cover-lane.jpg",0.914],
      ["smart-pixel","assets/img/smart-pixel/site-1-location.jpg",0.83],
      ["smart-pixel","assets/img/smart-pixel/site-2-fabric.jpg",0.83],
      ["smart-pixel","assets/img/smart-pixel/site-3-walk-home.jpg",0.83],
      ["campus-renovation","assets/img/campus-renovation/eng1-courtyard-winter.jpg",1.778],
      ["campus-renovation","assets/img/campus-renovation/site-plan.jpg",1.871],
      ["campus-renovation","assets/img/campus-renovation/concept.jpg",2.536],
      ["campus-renovation","assets/img/campus-renovation/eng1-courtyard-rain.jpg",1.778],
      ["the-tree-house","assets/img/the-tree-house/village-section.jpg",1.858],
      ["the-tree-house","assets/img/the-tree-house/bloom-kit-bare.jpg",1.169],
      ["the-tree-house","assets/img/the-tree-house/leaf-1.jpg",1.984],
      ["the-tree-house","assets/img/the-tree-house/leaf-2.jpg",1.984],
      ["metaverse-church","assets/img/metaverse-church/cover.jpg",1.778],
      ["metaverse-church","assets/img/metaverse-church/concept-twin-stack.jpg",1.068],
      ["metaverse-church","assets/img/metaverse-church/concept-sync.jpg",1.044],
      ["metaverse-church","assets/img/metaverse-church/module-kit.jpg",1.073],
      ["la-junita","assets/img/la-junita/aerial.jpg",1.577],
      ["la-junita","assets/img/la-junita/exterior-2.jpg",1.577],
      ["la-junita","assets/img/la-junita/plan-lower.jpg",1.391],
      ["la-junita","assets/img/la-junita/interior-1.jpg",1.502]
    ],
  },
  updated: "2026.11.20",
  rev: "04",

  // 첫 화면 문장 (줄마다 끊어서)
  hero: {
    tag: ["Practical", "Architecture"],
    lines: ["Architecture is", "an answer", "before an image."],
    motto: "Air and light. Structure and joints.",
    sub: "공기와 빛, 그리고 실제로 지어질 수 있는 구조와 접합부에서 해답을 찾는 건축가 지망생입니다.",
  },
  // Philosophy 첫 장면: 스크롤하면 단어가 하나씩 채워지는 선언문 (나의 설계 철학)
  manifesto: {
    en: "I believe architecture is an answer before an image — found in air and light, structure and joints that can truly be built.",
    ko: "건축은 이미지보다 먼저 하나의 해답이라고 믿습니다. 그 해답은 공기와 빛, 그리고 실제로 지어질 수 있는 구조와 접합부 안에 있습니다.",
    steps: ["Answer before image", "Air and light", "Structure and joints"],
    keys: ["answer", "air", "light", "structure", "joints", "built"], // 밑줄이 그어지는 핵심 단어
  },
  // 세 가지 키워드 (고정 화면에서 하나씩 넘어가요. fig: context · air · craft · order 도면)
  pillars: [
    { k: "Answer", en: "Define the problem before drawing the picture.", d: "보기 좋은 이미지보다 먼저, 대지와 프로그램이 던지는 문제를 정의하고 그 답을 찾습니다.", fig: "context" },
    { k: "Air & Light", en: "Space is shaped by how air moves and light falls.", d: "채광, 일조, 맞통풍을 단면에서 먼저 검토합니다. 쾌적함은 형태가 아니라 해법에서 나옵니다.", fig: "air" },
    { k: "Structure & Joints", en: "A design is finished only when it can truly be built.", d: "구조의 질서부터 재료가 만나는 접합부까지, 실제로 지어질 수 있는지를 기준으로 그립니다.", fig: "craft" },
  ],
};

// 작품 목록 — 포트폴리오 PDF(2026.11) 기준. draft: true 는 자료를 받기 전이라 이름·연도·수상만 있는 칸이에요.
/* spread */ const PROJECTS = [
  {
    slug: "re-tide", blurb: "조수간만의 차를 활용한 공공시설",
    title: "RE:TIDE",
    titleKo: "인천 내항 수변 공공시설",
    subtitle: "A tidal waterfront at the tip of the Incheon Inner Port jetty",
    type: "Public",
    year: "2026",
    studio: "Design Studio 7 · 졸업설계",
    award: "제58회 SKKU DOA 졸업작품전 설계우수상 · 건축사회상",
    program: "조수 수변 공공시설",
    site: "인천 내항",
    area: "",
    team: "단독",
    tools: "",
    pos: [-5.6, -4.2],
    terrain: {"water":0.45,"sea":5.2,"m":[[0.525,1.143,0.44,0.34],[0.618,2.193,0.44,0.34],[1.143,1.606,0.298,0.3],[1.235,0.216,0.241,0.3],[1.76,2.007,0.313,0.3],[2.038,0.649,0.313,0.3],[2.749,1.513,0.341,0.26],[2.656,2.409,0.199,0.2],[3.181,0.926,0.412,0.24],[3.49,2.285,0.412,0.2],[3.644,1.266,0.213,0.2],[3.86,0.463,0.17,0.2]],"links":[[3,0,0.17],[3,5,0.17],[5,8,0.17],[8,11,0.17],[8,10,0.17],[0,2,0.17],[2,1,0.17],[2,4,0.17],[4,6,0.17],[6,5,0.17],[4,7,0.17],[7,9,0.17],[6,9,0.17],[2,5,0.17]],"step":0.07},
    mass: [
      [0.616, 1.059, 0.838, 0.18, 0.1, 0.325, "box", 32.05],
      [0.761, 0.891, 0.024, 0.024, 0.181, 0.143],
      [0.687, 1.009, 0.024, 0.024, 0.039, 0.286],
      [0.96, 1.015, 0.024, 0.024, 0.325, 0],
      [0.886, 1.134, 0.024, 0.024, 0.286, 0.038],
      [1.159, 1.14, 0.024, 0.024, 0.325, 0],
      [1.085, 1.258, 0.024, 0.024, 0.325, 0],
      [1.358, 1.264, 0.024, 0.024, 0.204, 0.12],
      [1.284, 1.383, 0.024, 0.024, 0.174, 0.15],
      [1.817, 1.531, 0.949, 0.18, 0.1, 0.337, "box", -33.587],
      [1.909, 1.772, 0.024, 0.024, 0.314, 0.023],
      [1.986, 1.888, 0.024, 0.024, 0.178, 0.158],
      [2.13, 1.625, 0.024, 0.024, 0.335, 0.001],
      [2.208, 1.741, 0.024, 0.024, 0.188, 0.148],
      [2.351, 1.478, 0.024, 0.024, 0.337, 0],
      [2.429, 1.594, 0.024, 0.024, 0.222, 0.115],
      [2.573, 1.331, 0.024, 0.024, 0.193, 0.143],
      [2.65, 1.447, 0.024, 0.024, 0.077, 0.26],
      [2.907, 0.806, 0.918, 0.18, 0.1, 0.332, "box", 42.274],
      [3.116, 0.572, 0.024, 0.024, 0.302, 0.03],
      [3.022, 0.676, 0.024, 0.024, 0.228, 0.104],
      [3.306, 0.745, 0.024, 0.024, 0.149, 0.183],
      [3.212, 0.849, 0.024, 0.024, 0.092, 0.24],
      [3.496, 0.918, 0.024, 0.024, 0.285, 0.047],
      [3.402, 1.022, 0.024, 0.024, 0.198, 0.134],
      [3.687, 1.091, 0.024, 0.024, 0.296, 0.036],
      [3.592, 1.195, 0.024, 0.024, 0.133, 0.199],
      [1.125, 0.106, 0.22, 0.22, 0.18, 0.3],
      [0.508, 2.083, 0.22, 0.22, 0.18, 0.34],
      [3.38, 2.175, 0.22, 0.22, 0.18, 0.2]
    ],
    cover: "assets/img/re-tide/cover.jpg",
    coverR: 0.859, coverFull: true, coverVideo: "assets/img/re-tide/cover-hq.mp4", // 핀 #219: 화면 꽉 + 재생 버튼(원본 portfolio-source/대표사진 영상/retide 영상.mp4, 1376×1600) // 대표사진 가로/세로 (머리 배치용)
    thumb: "assets/img/re-tide/card-frame.jpg", // 카드 사진 = 대표 영상(card-loop.mp4)의 첫 장면이라 영상과 딱 맞아요
    coverCaption: "Twelve mounds, one tissue — pavilion and lookout tower in the rain", // 대표 이미지 아래 캡션
    summary:
      "Twice a day the sea at the Incheon Inner Port rises and falls by up to 9.62 m. As the port declines, the project reads the tip of its jetty as the frontline where the city meets that water. RE:TIDE hands this edge back from human time to the moon's: twelve mounds grow into one walkable tissue that the tide opens and closes again, twice a day and every fifteen days.",
    sections: [
      { heading: "Site", text: "Incheon Inner Port has been shaped by its history and now sits at the centre of redevelopment debates as its port functions decline. Rather than a redevelopment target, the project reads the tip of the jetty as the frontline where the city meets the water — close to the city, far on foot.", images: [], panel: {"src":"assets/img/re-tide/site-wide.jpg","left":[],"right":[],"notes":[["2.94 km","the only walk in, to Incheon Station"],["3.2 ×","longer on foot than in a line"],["9.62 m","the largest range of the tide"]],"legend":[["F","Port quay, fenced"],["O","Open edge"],["L","Lock gate"],["T","Rail station"],["+","Place, a tenth of its walk"]],"w":"50%","cap":"01 Close to the city, far on foot — each place on its row: on the left the line from the plot, on the right the walk. Wolmido lies 1.07 km across the basin but 68 minutes on foot.","r":1.911} },
      { heading: "Tide — The Moon", text: "The 6-hour tidal cycle and the 15-day spring–neap cycle are the spatial logic. In line with the sun the two pulls add up to a spring range of 8.65 m; at right angles they cancel to a neap range of 3.11 m.", images: [], widget: "moon" },
      { heading: "Tide — Spring and Neap", text: "The moon's 12.42 h and the sun's 12.00 h waves fall in and out of step every 14.77 days — 705 high waters a year, the range swelling from 3.11 m at neap to 8.65 m at spring and 9.62 m at most. Their bands set the plan zones: always dry, wet near spring, wet every day, always wet.", images: [], widget: "springneap" },
      { pair: true, heading: "Tide — One Tide as a Dial", text: "A low-water stand 19.1 % of the year, B flood 28.9 %, C high-water stand 20.5 %, D ebb 31.4 % — still water four times a day.", images: [], widget: "dial" },
      { heading: "Tide — Twelfths and the Sine", text: "h(t) = Z₀ + A cos(2πt / T − φ), Z₀ +4.75 m, T 12 h 25 min: hour by hour the water rises 1, 2, 3, 3, 2 and 1 twelfths of its range, as the measured tide does; the 9 m section is cut in these layers.", widget: "sine", images: [] },
      { heading: "Twelve Mounds, One Tissue", big: true, text: "Mounds on the eddies, paths on tangent arcs, a reef hollowed below and platforms on the crowns. Programs sit on the mounds and open and close with the tide.", images: [{src: "assets/img/re-tide/twelve-mounds.jpg", caption: "Twelve mounds, one tissue — the long pavilions and lookout towers lifted off their mounds", r: 1.678, tags: [[13,10.3,"Library","c","lv"],[52.9,4.3,"Lookout tower T1","","lv"],[70.8,2.6,"Water sports pavilion","r","lv"],[42.7,36,"Stage pavilion","r","lv"],[11.3,48,"Lookout tower T2","r","lv"],[86.7,51.5,"Lookout tower T3","","lv"]]}] },
      { heading: "Flow Layers", text: "Five layers, 21 programs, 58 links: strips from the low outer edge to the high inner ground, each carrying its own programs.", images: [], widget: "flow" },
      { heading: "Rising Water — Simulation", big: true, // 핀 #32: 평면·단면을 위아래로 크게
        text: "One site at six water levels — the order in which the mounds become islands and go under. White is walkable ground joined to the pier, hatching is ground reached only over a long pavilion, dots are islands cut off by the sea, and a dashed line marks a mound already under water. Drag the bar or press play to run the water up and down.", images: [], sim: { r: 1.462, flood: "assets/img/re-tide/water-flood.png", frames: [
        { src: "assets/img/re-tide/water-a.jpg", dry: "assets/img/re-tide/water-dry-a.jpg", level: 2.43, share: "higher 82.5 % of the year", d: "Mean low-water stand. The sea is at its lowest and every mound is joined on foot — 39,512 m² of walkable ground." },
        { src: "assets/img/re-tide/water-b.jpg", dry: "assets/img/re-tide/water-dry-b.jpg", level: 4.75, share: "higher 50.0 % of the year", d: "Mean sea level: the water stands higher than this for half the year. The bays fill, but every mound still holds to the pier — 34,233 m² on foot." },
        { src: "assets/img/re-tide/water-c.jpg", dry: "assets/img/re-tide/water-dry-c.jpg", level: 5.45, share: "higher 40.9 % of the year", d: "The farthest +8.5 m mound, M10, breaks away first and becomes an island — 31,049 m² on foot." },
        { src: "assets/img/re-tide/water-d.jpg", dry: "assets/img/re-tide/water-dry-d.jpg", level: 7.04, share: "higher about 18 % of the year", d: "Mean high-water stand. All five +8.5 m mounds are islands, and M07 is reached only across the stage pavilion — 22,082 m² on foot." },
        { src: "assets/img/re-tide/water-e.jpg", dry: "assets/img/re-tide/water-dry-e.jpg", level: 8.5, share: "higher 3.2 % of the year", d: "The +8.5 m mounds go under — on 128 days a year, for 1.7 hours at a time. 18,806 m² stays on foot." },
        { src: "assets/img/re-tide/water-f.jpg", dry: "assets/img/re-tide/water-dry-f.jpg", level: 9.24, share: "higher 0.24 % of the year", d: "The 99 % level. M02, M03, M05, M06 and M07 are cut off on the ground, and the library pavilion alone joins them to the pier — 6,914 m² on foot." },
      ], sections: [
        { src: "assets/img/re-tide/section-water.jpg", hi: "assets/img/re-tide/section-water-high.jpg", hiTop: 7.04, wr: "6.6%", r: 7.293, ticks: [[0,0.9267],[2.43,0.8015],[4.75,0.682],[7.04,0.564],[9.5,0.4373],[12,0.3085]], cap: "The long section at the same water — gate mound, library, theatre and sea-pool pavilion" },
      ] } },
      { heading: "Plans", text: "Three layers of one site on one grid — the mounds and their setting-out, the pavilions on them, and the structure at reef level. Scroll to lay one sheet over the next.", big: true, images: [], seq: {"kind":"frames","r":1.489,"fade":true,"tag":true,"below":true,"k":1.12,"steps":[{"src":"assets/img/re-tide/mound-layout.jpg","t":"Mound layout","s":"A-102 · A-103 — twelve mounds, their heights and programs","tags":[[17.86,40.69,"M01\n+14.5","c","nl w1"],[22.65,72.9,"M02\n+14.5","c","nl w1"],[31.36,53.52,"M03\n+13.5","c","nl w1"],[30.58,12.49,"M04\n+13.5","c","nl w1"],[44.3,68.87,"M05\n+12.5","c","nl w1"],[50.17,22.89,"M06\n+12.5","c","nl w1"],[64.78,51.67,"M07\n+10.5","c","nl w1"],[64.47,80.67,"M08\n+8.5","c","nl w1"],[69.95,28.67,"M09\n+8.5","c","nl w1"],[81.66,80.37,"M10\n+8.5","c","nl w1"],[81.12,44.8,"M11\n+8.5","c","nl w1"],[89.01,20.65,"M12\n+8.5","c","nl w1"],[67.73,77,"14 Market, aquarium","","m"],[60.29,19.67,"13 Ferry, water taxi","","m"],[70.23,36.1,"12 Water sports","","m"],[53.89,66.84,"Stage programs","","m"],[45.52,46.93,"9 Open-air theater","","m"],[37.84,17.55,"8 Sea-pool programs","","m"],[36.56,30.03,"7 Tidal pool","","m"],[22.17,53.58,"5 Open-air library","","m"],[29.42,40.36,"4 Library","","m"],[15.69,70.34,"2 Public plaza","","m"],[10.57,39.33,"1 Entrance gate, F&B","","m"],[97.43,96.74,"F","c","m"],[97.43,88.22,"E","c","m"],[97.38,66.89,"D","c","m"],[97.38,49.83,"C","c","m"],[97.41,32.77,"B","c","m"],[97.39,15.71,"A","c","m"],[88.98,4.13,"8","c","m"],[83.23,4.13,"7","c","m"],[71.8,4.13,"6","c","m"],[57.47,4.13,"5","c","m"],[43.17,4.13,"4","c","m"],[28.84,4.13,"3","c","m"],[17.38,4.13,"2","c","m"],[8.72,4.13,"1","c","m"]]},{"src":"assets/img/re-tide/plan-pavilion.jpg","t":"Pavilion layout","s":"A-204 — the pavilion roofs on the same mounds"},{"src":"assets/img/re-tide/plan-reef.jpg","t":"Structure at reef level","s":"A-202 — the shell on its legs, cut at DL +1.0"}]} }, // 핀 #183
      { heading: "Scenes", text: "Nine scenes along one tide — from the curtain pavilion and the sea pool to the library steps and the lookout tower.", images: [{src: "assets/img/re-tide/scene-1.jpg", caption: "Scene 1 — Curtain pavilion", r: 1.54}, {src: "assets/img/re-tide/scene-2.jpg", caption: "Scene 2 — Pavilion from the sea", r: 0.973}, {src: "assets/img/re-tide/scene-4.jpg", caption: "Scene 4 — Sea pool", r: 0.997}, {src: "assets/img/re-tide/scene-3.jpg", caption: "Scene 3 — High tide", r: 1.717}, {src: "assets/img/re-tide/scene-6.jpg", caption: "Scene 6 — Lookout tower", r: 1.048}, {src: "assets/img/re-tide/scene-8.jpg", caption: "Scene 8 — Library steps", r: 0.969}, {src: "assets/img/re-tide/scene-5.jpg", caption: "Scene 5 — Room facing the tower", r: 0.746}, {src: "assets/img/re-tide/scene-7.jpg", caption: "Scene 7 — Under the shell", r: 0.782}, {src: "assets/img/re-tide/scene-9.jpg", caption: "Scene 9 — Pavilion interior", r: 0.765}], stack: true, scenes: true },
    ],
    drawings: [], // 2026-11-22 핀: Plans·Sections 섹션으로 옮겼어요
  },
  {
    slug: "motorism", blurb: "성수 Drive-thru 팝업스토어",
    title: "PRND",
    titleKo: "성수동 DRIVE-THRU 복합문화공간",
    subtitle: "Car complex center / Pop-up center in Seongsu",
    type: "Culture",
    year: "2025",
    studio: "Design Studio 5",
    award: "성균관대학교 설계스튜디오5 최우수작품",
    program: "자동차 문화 복합시설 · 팝업 센터",
    site: "서울 성수동 연무장길",
    area: "",
    team: "단독",
    tools: "Rhino, Grasshopper, Ladybug",
    pos: [1.4, -5.6],
    mass: [
      [1.012, 0.012, 0.212, 0.42, 0.035, 0.13, "box", 8.5],
      [1.043, -0.005, 0.212, 0.04, 0.16, 0.165, "box", 8.5],
      [1.142, 0.053, 0.217, 0.42, 0.035, 0.151, "box", 25.167],
      [1.232, 0.053, 0.217, 0.04, 0.16, 0.186, "box", 25.167],
      [1.257, 0.132, 0.221, 0.42, 0.035, 0.172, "box", 42.49],
      [1.399, 0.167, 0.221, 0.04, 0.16, 0.207, "box", 42.49],
      [1.338, 0.241, 0.227, 0.42, 0.035, 0.192, "box", 62.093],
      [1.524, 0.332, 0.227, 0.04, 0.16, 0.227, "box", 62.093],
      [1.376, 0.385, 0.245, 0.42, 0.035, 0.213, "box", 80.661],
      [1.583, 0.541, 0.245, 0.04, 0.16, 0.248, "box", 80.661],
      [1.374, 0.588, 0.273, 0.42, 0.035, 0.234, "box", 91.704],
      [1.584, 0.784, 0.273, 0.04, 0.16, 0.269, "box", 91.704],
      [1.352, 0.847, 0.293, 0.42, 0.035, 0.254, "box", 93.716],
      [1.561, 1.051, 0.293, 0.04, 0.16, 0.289, "box", 93.716],
      [1.339, 1.14, 0.299, 0.42, 0.035, 0.275, "box", 90],
      [1.549, 1.33, 0.299, 0.04, 0.16, 0.31, "box", 90],
      [1.352, 1.433, 0.293, 0.42, 0.035, 0.296, "box", 86.284],
      [1.561, 1.609, 0.293, 0.04, 0.16, 0.331, "box", 86.284],
      [1.374, 1.692, 0.273, 0.42, 0.035, 0.316, "box", 88.296],
      [1.584, 1.876, 0.273, 0.04, 0.16, 0.351, "box", 88.296],
      [1.376, 1.895, 0.245, 0.42, 0.035, 0.337, "box", 99.339],
      [1.583, 2.119, 0.245, 0.04, 0.16, 0.372, "box", 99.339],
      [1.338, 2.039, 0.227, 0.42, 0.035, 0.358, "box", 117.907],
      [1.524, 2.328, 0.227, 0.04, 0.16, 0.393, "box", 117.907],
      [1.257, 2.148, 0.221, 0.42, 0.035, 0.378, "box", 137.51],
      [1.399, 2.493, 0.221, 0.04, 0.16, 0.413, "box", 137.51],
      [1.142, 2.227, 0.217, 0.42, 0.035, 0.399, "box", 154.833],
      [1.232, 2.607, 0.217, 0.04, 0.16, 0.434, "box", 154.833],
      [1.012, 2.268, 0.212, 0.42, 0.035, 0.42, "box", 171.5],
      [1.043, 2.665, 0.212, 0.04, 0.16, 0.455, "box", 171.5],
      [0.877, 2.268, 0.212, 0.42, 0.035, 0.44, "box", -171.5],
      [0.846, 2.665, 0.212, 0.04, 0.16, 0.475, "box", -171.5],
      [0.74, 2.227, 0.217, 0.42, 0.035, 0.461, "box", -154.833],
      [0.651, 2.607, 0.217, 0.04, 0.16, 0.496, "box", -154.833],
      [0.621, 2.148, 0.221, 0.42, 0.035, 0.482, "box", -137.51],
      [0.479, 2.493, 0.221, 0.04, 0.16, 0.517, "box", -137.51],
      [0.535, 2.039, 0.227, 0.42, 0.035, 0.502, "box", -117.907],
      [0.35, 2.328, 0.227, 0.04, 0.16, 0.537, "box", -117.907],
      [0.479, 1.895, 0.245, 0.42, 0.035, 0.523, "box", -99.339],
      [0.272, 2.119, 0.245, 0.04, 0.16, 0.558, "box", -99.339],
      [0.452, 1.692, 0.273, 0.42, 0.035, 0.544, "box", -88.296],
      [0.242, 1.876, 0.273, 0.04, 0.16, 0.579, "box", -88.296],
      [0.455, 1.433, 0.293, 0.42, 0.035, 0.564, "box", -86.284],
      [0.245, 1.609, 0.293, 0.04, 0.16, 0.599, "box", -86.284],
      [0.461, 1.14, 0.299, 0.42, 0.035, 0.585, "box", -90],
      [0.251, 1.33, 0.299, 0.04, 0.16, 0.62, "box", -90],
      [0.455, 0.847, 0.293, 0.42, 0.035, 0.606, "box", -93.716],
      [0.245, 1.051, 0.293, 0.04, 0.16, 0.641, "box", -93.716],
      [0.452, 0.588, 0.273, 0.42, 0.035, 0.626, "box", -91.704],
      [0.242, 0.784, 0.273, 0.04, 0.16, 0.661, "box", -91.704],
      [0.479, 0.385, 0.245, 0.42, 0.035, 0.647, "box", -80.661],
      [0.272, 0.541, 0.245, 0.04, 0.16, 0.682, "box", -80.661],
      [0.535, 0.241, 0.227, 0.42, 0.035, 0.668, "box", -62.093],
      [0.35, 0.332, 0.227, 0.04, 0.16, 0.703, "box", -62.093],
      [0.621, 0.132, 0.221, 0.42, 0.035, 0.688, "box", -42.49],
      [0.479, 0.167, 0.221, 0.04, 0.16, 0.723, "box", -42.49],
      [0.74, 0.053, 0.217, 0.42, 0.035, 0.709, "box", -25.167],
      [0.651, 0.053, 0.217, 0.04, 0.16, 0.744, "box", -25.167],
      [0.877, 0.012, 0.212, 0.42, 0.035, 0.73, "box", -8.5],
      [0.846, -0.005, 0.212, 0.04, 0.16, 0.765, "box", -8.5],
      [1.012, 0.012, 0.212, 0.42, 0.035, 0.75, "box", 8.5],
      [1.043, -0.005, 0.212, 0.04, 0.16, 0.785, "box", 8.5],
      [1.142, 0.053, 0.217, 0.42, 0.035, 0.771, "box", 25.167],
      [1.232, 0.053, 0.217, 0.04, 0.16, 0.806, "box", 25.167],
      [1.257, 0.132, 0.221, 0.42, 0.035, 0.792, "box", 42.49],
      [1.399, 0.167, 0.221, 0.04, 0.16, 0.827, "box", 42.49],
      [1.338, 0.241, 0.227, 0.42, 0.035, 0.812, "box", 62.093],
      [1.524, 0.332, 0.227, 0.04, 0.16, 0.847, "box", 62.093],
      [1.376, 0.385, 0.245, 0.42, 0.035, 0.833, "box", 80.661],
      [1.583, 0.541, 0.245, 0.04, 0.16, 0.868, "box", 80.661],
      [1.374, 0.588, 0.273, 0.42, 0.035, 0.854, "box", 91.704],
      [1.584, 0.784, 0.273, 0.04, 0.16, 0.889, "box", 91.704],
      [1.352, 0.847, 0.293, 0.42, 0.035, 0.874, "box", 93.716],
      [1.561, 1.051, 0.293, 0.04, 0.16, 0.909, "box", 93.716],
      [1.339, 1.14, 0.299, 0.42, 0.035, 0.895, "box", 90],
      [1.549, 1.33, 0.299, 0.04, 0.16, 0.93, "box", 90],
      [1.352, 1.433, 0.293, 0.42, 0.035, 0.916, "box", 86.284],
      [1.561, 1.609, 0.293, 0.04, 0.16, 0.951, "box", 86.284],
      [1.374, 1.692, 0.273, 0.42, 0.035, 0.936, "box", 88.296],
      [1.584, 1.876, 0.273, 0.04, 0.16, 0.971, "box", 88.296],
      [1.376, 1.895, 0.245, 0.42, 0.035, 0.957, "box", 99.339],
      [1.583, 2.119, 0.245, 0.04, 0.16, 0.992, "box", 99.339],
      [1.338, 2.039, 0.227, 0.42, 0.035, 0.978, "box", 117.907],
      [1.524, 2.328, 0.227, 0.04, 0.16, 1.013, "box", 117.907],
      [1.257, 2.148, 0.221, 0.42, 0.035, 0.998, "box", 137.51],
      [1.399, 2.493, 0.221, 0.04, 0.16, 1.033, "box", 137.51],
      [1.142, 2.227, 0.217, 0.42, 0.035, 1.019, "box", 154.833],
      [1.232, 2.607, 0.217, 0.04, 0.16, 1.054, "box", 154.833],
      [1.012, 2.268, 0.212, 0.42, 0.035, 1.04, "box", 171.5],
      [1.043, 2.665, 0.212, 0.04, 0.16, 1.075, "box", 171.5],
      [0.877, 2.268, 0.212, 0.42, 0.035, 1.06, "box", -171.5],
      [0.846, 2.665, 0.212, 0.04, 0.16, 1.095, "box", -171.5],
      [0.74, 2.227, 0.217, 0.42, 0.035, 1.081, "box", -154.833],
      [0.651, 2.607, 0.217, 0.04, 0.16, 1.116, "box", -154.833],
      [0.621, 2.148, 0.221, 0.42, 0.035, 1.102, "box", -137.51],
      [0.479, 2.493, 0.221, 0.04, 0.16, 1.137, "box", -137.51],
      [0.535, 2.039, 0.227, 0.42, 0.035, 1.122, "box", -117.907],
      [0.35, 2.328, 0.227, 0.04, 0.16, 1.157, "box", -117.907],
      [0.479, 1.895, 0.245, 0.42, 0.035, 1.143, "box", -99.339],
      [0.272, 2.119, 0.245, 0.04, 0.16, 1.178, "box", -99.339],
      [0.452, 1.692, 0.273, 0.42, 0.035, 1.164, "box", -88.296],
      [0.242, 1.876, 0.273, 0.04, 0.16, 1.199, "box", -88.296],
      [0.455, 1.433, 0.293, 0.42, 0.035, 1.184, "box", -86.284],
      [0.245, 1.609, 0.293, 0.04, 0.16, 1.219, "box", -86.284],
      [0.461, 1.14, 0.299, 0.42, 0.035, 1.205, "box", -90],
      [0.251, 1.33, 0.299, 0.04, 0.16, 1.24, "box", -90],
      [0.455, 0.847, 0.293, 0.42, 0.035, 1.226, "box", -93.716],
      [0.245, 1.051, 0.293, 0.04, 0.16, 1.261, "box", -93.716],
      [0.452, 0.588, 0.273, 0.42, 0.035, 1.246, "box", -91.704],
      [0.242, 0.784, 0.273, 0.04, 0.16, 1.281, "box", -91.704],
      [0.479, 0.385, 0.245, 0.42, 0.035, 1.267, "box", -80.661],
      [0.272, 0.541, 0.245, 0.04, 0.16, 1.302, "box", -80.661],
      [0.535, 0.241, 0.227, 0.42, 0.035, 1.288, "box", -62.093],
      [0.35, 0.332, 0.227, 0.04, 0.16, 1.323, "box", -62.093],
      [0.621, 0.132, 0.221, 0.42, 0.035, 1.308, "box", -42.49],
      [0.479, 0.167, 0.221, 0.04, 0.16, 1.343, "box", -42.49],
      [0.74, 0.053, 0.217, 0.42, 0.035, 1.329, "box", -25.167],
      [0.651, 0.053, 0.217, 0.04, 0.16, 1.364, "box", -25.167],
      [0.877, 0.012, 0.212, 0.42, 0.035, 1.35, "box", -8.5],
      [0.846, -0.005, 0.212, 0.04, 0.16, 1.385, "box", -8.5],
      [1.012, 0.012, 0.212, 0.42, 0.035, 1.37, "box", 8.5],
      [1.043, -0.005, 0.212, 0.04, 0.16, 1.405, "box", 8.5],
      [1.142, 0.053, 0.217, 0.42, 0.035, 1.391, "box", 25.167],
      [1.232, 0.053, 0.217, 0.04, 0.16, 1.426, "box", 25.167],
      [1.257, 0.132, 0.221, 0.42, 0.035, 1.412, "box", 42.49],
      [1.399, 0.167, 0.221, 0.04, 0.16, 1.447, "box", 42.49],
      [1.338, 0.241, 0.227, 0.42, 0.035, 1.432, "box", 62.093],
      [1.524, 0.332, 0.227, 0.04, 0.16, 1.467, "box", 62.093],
      [1.376, 0.385, 0.245, 0.42, 0.035, 1.453, "box", 80.661],
      [1.583, 0.541, 0.245, 0.04, 0.16, 1.488, "box", 80.661],
      [1.374, 0.588, 0.273, 0.42, 0.035, 1.474, "box", 91.704],
      [1.584, 0.784, 0.273, 0.04, 0.16, 1.509, "box", 91.704],
      [1.352, 0.847, 0.293, 0.42, 0.035, 1.494, "box", 93.716],
      [1.561, 1.051, 0.293, 0.04, 0.16, 1.529, "box", 93.716],
      [1.339, 1.14, 0.299, 0.42, 0.035, 1.515, "box", 90],
      [1.549, 1.33, 0.299, 0.04, 0.16, 1.55, "box", 90],
      [1.352, 1.433, 0.293, 0.42, 0.035, 1.536, "box", 86.284],
      [1.561, 1.609, 0.293, 0.04, 0.16, 1.571, "box", 86.284],
      [1.374, 1.692, 0.273, 0.42, 0.035, 1.556, "box", 88.296],
      [1.584, 1.876, 0.273, 0.04, 0.16, 1.591, "box", 88.296],
      [1.376, 1.895, 0.245, 0.42, 0.035, 1.577, "box", 99.339],
      [1.583, 2.119, 0.245, 0.04, 0.16, 1.612, "box", 99.339],
      [1.338, 2.039, 0.227, 0.42, 0.035, 1.598, "box", 117.907],
      [1.524, 2.328, 0.227, 0.04, 0.16, 1.633, "box", 117.907],
      [1.257, 2.148, 0.221, 0.42, 0.035, 1.618, "box", 137.51],
      [1.399, 2.493, 0.221, 0.04, 0.16, 1.653, "box", 137.51],
      [1.142, 2.227, 0.217, 0.42, 0.035, 1.639, "box", 154.833],
      [1.232, 2.607, 0.217, 0.04, 0.16, 1.674, "box", 154.833],
      [1.012, 2.268, 0.212, 0.42, 0.035, 1.66, "box", 171.5],
      [1.043, 2.665, 0.212, 0.04, 0.16, 1.695, "box", 171.5],
      [0.877, 2.268, 0.212, 0.42, 0.035, 1.68, "box", -171.5],
      [0.846, 2.665, 0.212, 0.04, 0.16, 1.715, "box", -171.5],
      [0.74, 2.227, 0.217, 0.42, 0.035, 1.701, "box", -154.833],
      [0.651, 2.607, 0.217, 0.04, 0.16, 1.736, "box", -154.833],
      [0.621, 2.148, 0.221, 0.42, 0.035, 1.722, "box", -137.51],
      [0.479, 2.493, 0.221, 0.04, 0.16, 1.757, "box", -137.51],
      [0.535, 2.039, 0.227, 0.42, 0.035, 1.742, "box", -117.907],
      [0.35, 2.328, 0.227, 0.04, 0.16, 1.777, "box", -117.907],
      [0.479, 1.895, 0.245, 0.42, 0.035, 1.763, "box", -99.339],
      [0.272, 2.119, 0.245, 0.04, 0.16, 1.798, "box", -99.339],
      [0.452, 1.692, 0.273, 0.42, 0.035, 1.784, "box", -88.296],
      [0.242, 1.876, 0.273, 0.04, 0.16, 1.819, "box", -88.296],
      [0.455, 1.433, 0.293, 0.42, 0.035, 1.804, "box", -86.284],
      [0.245, 1.609, 0.293, 0.04, 0.16, 1.839, "box", -86.284],
      [0.461, 1.14, 0.299, 0.42, 0.035, 1.825, "box", -90],
      [0.251, 1.33, 0.299, 0.04, 0.16, 1.86, "box", -90],
      [0.455, 0.847, 0.293, 0.42, 0.035, 1.846, "box", -93.716],
      [0.245, 1.051, 0.293, 0.04, 0.16, 1.881, "box", -93.716],
      [0.452, 0.588, 0.273, 0.42, 0.035, 1.866, "box", -91.704],
      [0.242, 0.784, 0.273, 0.04, 0.16, 1.901, "box", -91.704],
      [0.479, 0.385, 0.245, 0.42, 0.035, 1.887, "box", -80.661],
      [0.272, 0.541, 0.245, 0.04, 0.16, 1.922, "box", -80.661],
      [0.535, 0.241, 0.227, 0.42, 0.035, 1.908, "box", -62.093],
      [0.35, 0.332, 0.227, 0.04, 0.16, 1.943, "box", -62.093],
      [0.621, 0.132, 0.221, 0.42, 0.035, 1.928, "box", -42.49],
      [0.479, 0.167, 0.221, 0.04, 0.16, 1.963, "box", -42.49],
      [0.74, 0.053, 0.217, 0.42, 0.035, 1.949, "box", -25.167],
      [0.651, 0.053, 0.217, 0.04, 0.16, 1.984, "box", -25.167],
      [0.877, 0.012, 0.212, 0.42, 0.035, 1.97, "box", -8.5],
      [0.846, -0.005, 0.212, 0.04, 0.16, 2.005, "box", -8.5],
      [1.012, 0.012, 0.212, 0.42, 0.035, 1.99, "box", 8.5],
      [1.043, -0.005, 0.212, 0.04, 0.16, 2.025, "box", 8.5],
      [1.142, 0.053, 0.217, 0.42, 0.035, 2.011, "box", 25.167],
      [1.232, 0.053, 0.217, 0.04, 0.16, 2.046, "box", 25.167],
      [1.257, 0.132, 0.221, 0.42, 0.035, 2.032, "box", 42.49],
      [1.399, 0.167, 0.221, 0.04, 0.16, 2.067, "box", 42.49],
      [1.338, 0.241, 0.227, 0.42, 0.035, 2.052, "box", 62.093],
      [1.524, 0.332, 0.227, 0.04, 0.16, 2.087, "box", 62.093],
      [1.376, 0.385, 0.245, 0.42, 0.035, 2.073, "box", 80.661],
      [1.583, 0.541, 0.245, 0.04, 0.16, 2.108, "box", 80.661],
      [1.374, 0.588, 0.273, 0.42, 0.035, 2.094, "box", 91.704],
      [1.584, 0.784, 0.273, 0.04, 0.16, 2.129, "box", 91.704],
      [1.352, 0.847, 0.293, 0.42, 0.035, 2.114, "box", 93.716],
      [1.561, 1.051, 0.293, 0.04, 0.16, 2.149, "box", 93.716],
      [1.339, 1.14, 0.299, 0.42, 0.035, 2.135, "box", 90],
      [1.549, 1.33, 0.299, 0.04, 0.16, 2.17, "box", 90],
      [1.352, 1.433, 0.293, 0.42, 0.035, 2.156, "box", 86.284],
      [1.561, 1.609, 0.293, 0.04, 0.16, 2.191, "box", 86.284],
      [1.374, 1.692, 0.273, 0.42, 0.035, 2.176, "box", 88.296],
      [1.584, 1.876, 0.273, 0.04, 0.16, 2.211, "box", 88.296],
      [1.376, 1.895, 0.245, 0.42, 0.035, 2.197, "box", 99.339],
      [1.583, 2.119, 0.245, 0.04, 0.16, 2.232, "box", 99.339],
      [1.338, 2.039, 0.227, 0.42, 0.035, 2.218, "box", 117.907],
      [1.524, 2.328, 0.227, 0.04, 0.16, 2.253, "box", 117.907],
      [1.257, 2.148, 0.221, 0.42, 0.035, 2.238, "box", 137.51],
      [1.399, 2.493, 0.221, 0.04, 0.16, 2.273, "box", 137.51],
      [1.142, 2.227, 0.217, 0.42, 0.035, 2.259, "box", 154.833],
      [1.232, 2.607, 0.217, 0.04, 0.16, 2.294, "box", 154.833],
      [1.012, 2.268, 0.212, 0.42, 0.035, 2.28, "box", 171.5],
      [1.043, 2.665, 0.212, 0.04, 0.16, 2.315, "box", 171.5],
      [0.877, 2.268, 0.212, 0.42, 0.035, 2.3, "box", -171.5],
      [0.846, 2.665, 0.212, 0.04, 0.16, 2.335, "box", -171.5],
      [0.74, 2.227, 0.217, 0.42, 0.035, 2.321, "box", -154.833],
      [0.651, 2.607, 0.217, 0.04, 0.16, 2.356, "box", -154.833],
      [0.621, 2.148, 0.221, 0.42, 0.035, 2.342, "box", -137.51],
      [0.479, 2.493, 0.221, 0.04, 0.16, 2.377, "box", -137.51],
      [0.535, 2.039, 0.227, 0.42, 0.035, 2.362, "box", -117.907],
      [0.35, 2.328, 0.227, 0.04, 0.16, 2.397, "box", -117.907],
      [0.479, 1.895, 0.245, 0.42, 0.035, 2.383, "box", -99.339],
      [0.272, 2.119, 0.245, 0.04, 0.16, 2.418, "box", -99.339],
      [0.452, 1.692, 0.273, 0.42, 0.035, 2.404, "box", -88.296],
      [0.242, 1.876, 0.273, 0.04, 0.16, 2.439, "box", -88.296],
      [0.455, 1.433, 0.293, 0.42, 0.035, 2.424, "box", -86.284],
      [0.245, 1.609, 0.293, 0.04, 0.16, 2.459, "box", -86.284],
      [0.461, 1.14, 0.299, 0.42, 0.035, 2.445, "box", -90],
      [0.251, 1.33, 0.299, 0.04, 0.16, 2.48, "box", -90],
      [0.455, 0.847, 0.293, 0.42, 0.035, 2.466, "box", -93.716],
      [0.245, 1.051, 0.293, 0.04, 0.16, 2.501, "box", -93.716],
      [0.452, 0.588, 0.273, 0.42, 0.035, 2.486, "box", -91.704],
      [0.242, 0.784, 0.273, 0.04, 0.16, 2.521, "box", -91.704],
      [0.479, 0.385, 0.245, 0.42, 0.035, 2.507, "box", -80.661],
      [0.272, 0.541, 0.245, 0.04, 0.16, 2.542, "box", -80.661],
      [0.535, 0.241, 0.227, 0.42, 0.035, 2.528, "box", -62.093],
      [0.35, 0.332, 0.227, 0.04, 0.16, 2.563, "box", -62.093],
      [0.621, 0.132, 0.221, 0.42, 0.035, 2.548, "box", -42.49],
      [0.479, 0.167, 0.221, 0.04, 0.16, 2.583, "box", -42.49],
      [0.74, 0.053, 0.217, 0.42, 0.035, 2.569, "box", -25.167],
      [0.651, 0.053, 0.217, 0.04, 0.16, 2.604, "box", -25.167],
      [0.877, 0.012, 0.212, 0.42, 0.035, 2.59, "box", -8.5],
      [0.846, -0.005, 0.212, 0.04, 0.16, 2.625, "box", -8.5],
      [0.99, 0.69, 0.12, 0.12, 2.6, 0, "cyl"],
      [0.75, 0.45, 0.6, 0.6, 0.3, 2.3, "flare"],
      [0.99, 1.89, 0.12, 0.12, 2.6, 0, "cyl"],
      [0.75, 1.65, 0.6, 0.6, 0.3, 2.3, "flare"],
      [0.99, 1.29, 0.12, 0.12, 2.6, 0, "cyl"],
      [0.75, 1.05, 0.6, 0.6, 0.3, 2.3, "flare"],
      [-0.15, 1.1, 0.28, 0.5, 2.95]
    ],
    cover: "assets/img/motorism/cover.jpg",
    coverVideo: "assets/img/motorism/cover-hq.mp4", // 핀 #95 (원본 portfolio-source/대표사진 영상/모토리즘 영상.mp4)
    thumb: "assets/img/motorism/card-frame.jpg", // 카드 사진 = 대표 영상(card-loop.mp4)의 첫 장면이라 영상과 딱 맞아요
    coverR: 2.034,
    coverPos: "28% 50%", // 잘려 보일 때 사진의 어느 부분을 보여줄지 (가로% 세로%) — 작을수록 사진이 오른쪽으로 밀려 왼쪽이 더 보여요
    coverCaption: "Stacked bowls on trumpet columns, from Yeonmujang-gil",
    summary:
      "Pop-up stores line Yeonmujang-gil in Seongsu and fade out at its east end, where a public car park sits among car centres. Here the car is already part of everyday culture. PRND turns that car park into a car complex. Two ramps, A up at 11 % and B down at 9 %, wind through stacked bowls of car museum, drive-thru, F&B and a rooftop showroom.",
    sections: [
      { heading: "District", text: "Yeonmujang-gil, Seongsu: main car-roads, parking around the site, and the point where the pop-up line ends.", images: [], panel: {"src":"assets/img/motorism/district-map.jpg","r":1.506,"w":"62%","left":[],"right":[],"notes":[["250 m","from the site to the main car-roads"],["100 m","to the nearest public parking"],["29","pop-up stores, thinning out east to the site"]],"legend":[["■","Site"],["▨","Parking lot"],["●","Pop-up store"],["⊕","Car destination"]],"cap":"01 District — Yeonmujang-gil, Seongsu. North up; base vectorised from the analysis model, scale from the CAD site plan."} },
      { heading: "Yeonmujang-gil Transect", text: "Yeonmujang-gil is defined by a linear flow of pop-up stores, densest in developed Seoseongsu and fading toward Dongseongsu. The site sits where that flow stops; with parking lots, car centres and the Achasan-ro / Seongsu-iro crossing around it, mobility is already the district's everyday culture — a car-based cultural hub here is both timely and grounded.", images: [{ sim: "transect", src: "", caption: "Transect, west to east — people walk the pop-up line and thin out at the threshold; cars arrive at the site. Scroll to run the strip on", w: "100%", r: 5.6 }] },
      { heading: "Strategy", text: "Linear → ramp → loop. Visitors move along a single line and go out to find content; the ramp lifts movement from horizontal to vertical, layering the limited site into upper, ground and lower levels; on a set route, the content moves toward the visitor — space approaches the user.", images: [], widget: "orbit", seq: {"kind":"frames","r":2.895,"lite":true,"fade":true,"below":true,"k":0.8,"len":6,"car":"strategy","steps":[{"src":"assets/img/motorism/strategy-3.jpg","tags":[[47.4,5.3,"▾ Upper level","","m"],[56.3,47.4,"▾ Ground ±0","","m"],[64.2,95.6,"▾ Lower level","","m"],[76.2,30.5,"Core","c","m"]],"t":"Linear seeking","s":"one line, content found on foot","d":"Visitors move along a single line and go out to find content: black squares are content, red waves experience points."},{"src":"assets/img/motorism/strategy-3.jpg","tags":[[47.4,5.3,"▾ Upper level","","m"],[56.3,47.4,"▾ Ground ±0","","m"],[64.2,95.6,"▾ Lower level","","m"],[76.2,30.5,"Core","c","m"]],"t":"Ramp as connector","s":"horizontal to vertical","d":"The ramp lifts movement from horizontal to vertical, layering the limited site into upper, ground and lower levels."},{"src":"assets/img/motorism/strategy-3.jpg","tags":[[47.4,5.3,"▾ Upper level","","m"],[56.3,47.4,"▾ Ground ±0","","m"],[64.2,95.6,"▾ Lower level","","m"],[76.2,30.5,"Core","c","m"]],"t":"Circular arrival","s":"space approaches the user","d":"Vehicles stay on a set route while pop-up content and experiences move toward them: space approaches the user."}]} },
      { heading: "Zoning", text: "Two one-way ramps, one shared centre: A up and B down cross at one point, overlap in a shared centre to gather, start from the centre onto both loops, and hold booths on the outer curves, each tied back to the centre.", images: [], widget: "zoning" },
      { heading: "Stacked Bowls", text: "Two ramps, A up at 11 % and B down at 9 %, wind through stacked bowls of car museum, drive-thru, F&B and a rooftop showroom, carried on trumpet columns.", images: [{src: "assets/img/motorism/axonometric.jpg", caption: "Axonometric — steel deck truss in every slab, two one-way ramps, trumpet columns", r: 1.349}] },
      { heading: "Plans", text: "Six levels on one grid — from the parking below ground to the showroom on the roof, the ramp and the bowls turning through every floor.", big: true, images: [], seq: {"kind":"frames","r":1.056,"fade":true,"tag":true,"steps":[{"src":"assets/img/motorism/plan-b1.jpg","t":"B1","s":"FL −4,000 — parking for 46 cars, MDF room"},{"src":"assets/img/motorism/plan-1f.jpg","t":"1F","s":"FL ±0 — entrance, F&B, pop-up, plaza"},{"src":"assets/img/motorism/plan-2f.jpg","t":"2F","s":"FL +5,200 — car museum, information, exit"},{"src":"assets/img/motorism/plan-3f.jpg","t":"3F","s":"FL +8,800 — car museum, F&B"},{"src":"assets/img/motorism/plan-4f.jpg","t":"4F","s":"FL +12,200 — drive-thru booths"},{"src":"assets/img/motorism/plan-rf.jpg","t":"RF","s":"car showroom, car theatre"}]} },
      { heading: "Sections", text: "Two long cuts — the core and both ramps, the trumpet columns under the bowls.", big: true, cols: 1, images: [{src: "assets/img/motorism/section-a.jpg", caption: "Section A–A′ — through the core and both ramps", r: 1.405, w: "min(100%, calc((100vh - 170px) * 1.405))"}, {src: "assets/img/motorism/section-b.jpg", caption: "Section B–B′ — through the trumpet columns and the bowls", r: 1.405, w: "min(100%, calc((100vh - 170px) * 1.405))"}] },
      { heading: "Structure", big: true, cols: 2, cw: [0.496, 0.933], gap: "24px", text: "Each storey is a deck truss carried off a trumpet column and wrapped by a bowl of perforated cassettes — one bay read three ways, the load path, the trumpet geometry and erection in four lifts.", images: [{src: "assets/img/motorism/typical-bay.jpg", caption: "Typical bay perspective", r: 0.496, w: "100%"} /* 핀 #170: 시트 제목·설명 글 빼고 렌더만, 옆 단면과 같은 높이 */, {"src":"assets/img/motorism/detail-section-aa.jpg","caption":"Detail section A–A — mushroom column, ramp edge, parametric skin","r":0.653,"lead":30,"leadGap":2.6,"ln":1,"notes":[["01","Rim box + cap","Steel box along the lip of the bowl, capped in aluminium — the edge the eye follows."],["02","Parapet liner","Inner face of the parapet; a smooth panel at hand height on the ramp side."],["03","Curved apron","The bowl turns under the deck edge so rain and light run off the curve."],["04","Ramp deck","RC 175 on a 75 composite deck, laid between the radial top chords."],["05","Outer edge girder","CHS Ø273 pipe truss that gathers the bowl and seats on the arc tip."],["06","Parametric skin","Perforated cassettes hung on the sub-frame; how open each one is follows the bay's fields."],["07","Deck truss","H-200 top chord, CHS Ø139.7 bottom chord, Ø76.3 web at 490."],["08","Bracket truss","Cantilever truss that carries the deck past the column out to the edge girder."],["09","Hull rib","Curved rib under the bowl, one of the ten sub-frame rings at 600."],["10","Cast steel node","G20Mn5 collar on the trunk; both branches splice into it with M30 bolts."],["11","Secondary struts","CHS Ø88.9 drop from every second truss node onto the arc."],["12","Inner branch","Box 300 → 220 that takes the inner share of the storey load."],["13","Tree branch (arc)","Box 380 → 260 in compression — the outer arc that carries most of the load."],["14","Trunk","CFT Ø508 that takes everything down to the base plate."],["15","Soffit","Underside of the deck, lined so the trusses read as one smooth ceiling."],["16","Column shell","GFRC panels revolved on the trumpet profile, about 67 m² per storey."],["17","Trumpet foot","Where the shell narrows to Ø910 at the plaza — a cap-to-shaft ratio of 9.5 : 1."],["18","Plaza","The ground storey left open below the column."]],"tags":[[85,2.8,"01","c pt"],[83.8,5.9,"02","c pt"],[70,8.7,"03","c pt"],[18,9.5,"04","c pt"],[63.6,10.8,"05","c pt"],[84.2,11.5,"06","c pt"],[16,12.3,"07","c pt"],[71.5,14.1,"08","c pt"],[77,17,"09","c pt"],[27.6,36.6,"10","c pt"],[38.5,39.3,"11","c pt"],[22.5,42.5,"12","c pt"],[47,43.2,"13","c pt"],[27.6,47.1,"14","c pt"],[61,69.6,"15","c pt"],[24,79.1,"16","c pt"],[20.5,94.6,"17","c pt"],[60,95.8,"18","c pt"]]}] },
      { heading: "Structure — Load, Shape, Lift", text: "The same bay read for how the load travels, how the trumpet shell is shaped, and how the ground storey goes up.", cols: 2, cw: [1.357, 2.166], images: [{"src":"assets/img/motorism/load-path.jpg","caption":"Load path — bracket action","r":1.357,"nc":4,"tags":[[7.2,18,"1","c pt"],[49,34.5,"2","c pt"],[74.4,38.7,"3","c pt"],[53.8,42.7,"4","c pt"],[45.7,55.5,"5","c pt"],[17.3,56.2,"5","c pt"],[19.9,82.1,"6","c pt"],[31.2,93.6,"7","c pt"],[3.6,24.8,"+12,600","","lv"],[3.6,93.6,"+7,200","","lv"],[71,17.2,"q"],[83.5,14,"bowl","","m"],[42.4,60.8,"Bracket action","","b"],[61.5,66.5,"z 3,775 — top chord to cast node"],[61.5,70.5,"e 3,657 — lever arm"],[61.5,74.5,"T = C = 0.97 ZP"],[42.4,81.6,"Share of the storey load","","b"],[43.6,88.4,"69 % outer"],[68.6,88.4,"21 % inner"],[88.2,88.4,"10 % trunk"]],"notes":[["1","Deck","RC 175 on composite deck 75 between the radial top chords"],["2","Deck truss","H-200 top, CHS Ø139.7 bottom, Ø76.3 web @490"],["3","Edge girder","CHS Ø273 pipe truss gathers the bowl; seats on the arc tip"],["4","Struts","CHS Ø88.9 drop every second node onto the arc"],["5","Branches","Arc box 380 → 260 in compression; inner box 300 → 220"],["6","Cast node","G20Mn5 collar gathers both branches, M30 splices"],["7","Trunk","CFT Ø508 takes it all down to the base plate"]]}, {"src":"assets/img/motorism/trumpet-geometry.jpg","caption":"Trumpet geometry — GFRC shell profile as a curvature graph","r":2.166,"tags":[[13,1.5,"2,600 inner flare","c"],[23,1.5,"CL","c"],[39,1.5,"4,400 CL → lip","c"],[23.1,71.5,"Ø 910","c","lv"],[3,76,"FL +7,200","","lv"],[57.3,52,"3,350","r"],[60.4,46,"2,300"],[67,4,"90°","r"],[67,30,"60°","r"],[67,56,"30°","r"],[67,79.5,"0°","r"],[97.4,4,"0.8"],[97.4,41.8,"0.4"],[97.4,79.5,"0"],[72.4,83.5,"1","c"],[77.2,83.5,"2","c"],[82.1,83.5,"3","c"],[87,83.5,"4","c"],[91.8,83.5,"5","c"],[73.5,22,"R 1,767","c"],[82.2,19,"R 1,685","c"],[68.6,37.4,"G1","r"],[67.8,94,"outer"],[77.8,94,"inner"]],"notes":[["Cap : shaft","9.5 : 1","Ø 8,600 : Ø 910"],["Profile","6.18 m","10 sub-frame rings @600"],["GFRC","≈ 67 m²","per storey, the outer profile revolved"],["Tightest","R 1,767","at h 1,963, outer"],["Graph","φ and κ","black: flare angle, red: curvature 1/m, along the profile s (m)"]]}, {"src":"assets/img/motorism/erection.jpg","caption":"Erection — ground storey, GL → +7,200, in four lifts","r":3.525,"span":true,"notes":[["1","Trunk + base","CFT Ø508 on its base plate; C50 pumped later"],["2","Node + branches","Collar on the trunk, branches spliced, tip propped"],["3","Deck truss + girder","Truss, struts, girder bolted; deck poured"],["4","Sub-frame + shell","Ribs and rings off the trunk; GFRC panels hung"]]}] },
      { heading: "Skin — Why This Pattern", text: "Four fields over one bay, weighted and summed, set how open each cassette is.", cols: 2, images: [{"src":"assets/img/motorism/skin-why-sight.svg","caption":"H — Sight + street","r":2.041},{"src":"assets/img/motorism/skin-why-views.svg","caption":"A — Views","r":2.041},{"src":"assets/img/motorism/skin-why-sun.svg","caption":"S — Sun","r":2.062},{"src":"assets/img/motorism/skin-why-grain.svg","caption":"N — Grain","r":2.049},{"src":"assets/img/motorism/skin-why-result.svg","caption":"Result — open area","r":2.028}] },
      { heading: "Skin — Process", text: "The eight steps of the definition, from the ramp edge to 234 cut cassettes. Scroll to step through; red marks what each step adds.", big: true, images: [], seq: {"kind":"frames","r":1.557,"fade":true,"tag":true,"steps":[{"src":"assets/img/motorism/skin-proc-1.jpg","t":"Ramp edge + views","s":"plan of ring 1, one bay","d":"Ring 1 is the rail, cut into bays of 15.6 m — 26 modules of 600. Two view points sit on the rim (red); each pulls the field open.","k":[["Girder line","R 12,500"],["View 1","s 4,600 · reach 2,600"],["View 2","s 13,800 · reach 3,000"]]},{"src":"assets/img/motorism/skin-proc-2.jpg","t":"Three traced profiles","s":"section through the three bowls","d":"Each bowl section is a 4-point Bézier drawn in Rhino over the sketch (red control points); bay 05 uses bowl 2. Rows R1–R9 sit every 600 along it.","k":[["Bowl 1","deck 1, +800"],["Bowl 2","this bay"],["Bowl 3","deck 3, +800"]]},{"src":"assets/img/motorism/skin-proc-3.jpg","t":"Sweep the hull","s":"one surface along the ramp","d":"Perp Frame and Orient stand the profile on the bay's rail; Sweep1 runs it along ring 1 as it rises 5.5 % — one surface per bay.","k":[["Rail","ring 1, the ramp edge"],["Red section","s = 7.8 m"]]},{"src":"assets/img/motorism/skin-proc-4.jpg","t":"Divide into modules","s":"26 × 9 = 234 cassettes","d":"Iso-curve edges: u in 26 parts, v every 600 plus the rim. Cross Reference and Isotrim turn them into a tree of 26 branches × 9 items.","k":[["u","15,600 / 600 = 26 columns"],["v","5,336 / 600 = 9 rows"],["Red cell","B05-R3-C17"]]},{"src":"assets/img/motorism/skin-proc-5.jpg","t":"Four fields","s":"one value 0–1 per cassette","d":"Top: H rises up the hull, A peaks at the views. Bottom: S is the Ladybug summer-afternoon radiation, N a seeded grain from GhPython.","k":[["H height","× .60"],["A near a view","× .40"],["S sun 65–265 kWh/m²","× −.40"],["N grain","× .10"]]},{"src":"assets/img/motorism/skin-proc-6.jpg","t":"Weight + clamp","s":"the open ratio o and its 7 steps","d":"The weighted sum is clamped and remapped to 8–52 %, then snapped to the nearest of 7 punch steps. Map of the bay above, cassettes per step below.","k":[["v",".60 H + .40 A − .40 S + .10 N"],["o","8 % + 44 % · clamp(v, 0, 1)"]]},{"src":"assets/img/motorism/skin-proc-7.jpg","t":"One triangle per cassette","s":"corner rule + scale","d":"Three corners of the ±240 punch field make the triangle; its corner turns to the view, with a 15 % flip. Size k comes from o, scaled about the centroid. Right: the 28 cutting files, step × corner.","k":[["Corner","BL — hypotenuse to view 2"],["k","0.86 · min(.92, 2 · 0.227) = 0.579"],["Files","28 = 7 steps × 4 corners"]]},{"src":"assets/img/motorism/skin-proc-8.jpg","t":"Map back + fabricate","s":"bay 05 as built, then flat","d":"Each cut is mapped onto the hull and onto a flat trapezoid blank, tagged B-R-C and baked: one layer per cut file plus a CSV for the shop.","k":[["Row shown","R3-C15 … C20"],["Out","DXF × 28 + CSV"]]}]} },
      { heading: "Skin — The Definition", text: "The Grasshopper definition: input, hull, grid, the field rule, Ladybug sun, triangle and fabrication — every component checked against the model.", images: [], pan: {"src":"assets/img/motorism/skin-flow.svg","r":12.594,"h":"56vh","build":true,"cap":"Input → hull → grid → sun → the rule → triangle → fabrication; built left to right as you scroll"} },
      { heading: "Skin — One Cassette, One Input", text: "One cassette traced through the rule — then the same bay, re-run live: move one input and every cassette is re-computed.", images: [], widget: "skin" },
      { heading: "Scenes", text: "The car museum inside the bowls, the plaza under them, and the ramp winding past the showroom.", images: [{src: "assets/img/motorism/plaza.jpg", caption: "Plaza under the bowls", r: 1.5}, {src: "assets/img/motorism/interior-museum.jpg", caption: "Car museum", r: 1.778}, {src: "assets/img/motorism/ramp.jpg", caption: "Ramp and showroom", r: 1.5}], stack: true, scenes: true },
    ],
    drawings: [], // 2026-11-22 핀: Plans·Sections 섹션으로 옮겼어요
  },
  {
    slug: "timteam-work", blurb: "판교 고층 목조 복합문화시설",
    title: "Tim(team) Work",
    titleKo: "판교 고층 목조 오피스(복합문화)",
    subtitle: "High-Rise Timber Complex Cultural Facilities in Pangyo",
    type: "Office",
    year: "2024",
    studio: "2024 대한민국 목조건축대전 (계획부문)", // 핀 #227
    award: "2024 대한민국 목조건축대전 서울특별시장상",
    program: "14층 목조 오피스 · 문화시설",
    site: "성남시 판교 삼평동 641",
    area: "",
    team: "2인 공동작품",
    tools: "",
    pos: [-4.2, 2.8],
    mass: [
      [0.29, 0.29, 0.1, 0.1, 0.45, 0, "cyl"],
      [0.29, 0.79, 0.1, 0.1, 0.45, 0, "cyl"],
      [0.29, 1.29, 0.1, 0.1, 0.45, 0, "cyl"],
      [0.79, 0.29, 0.1, 0.1, 0.45, 0, "cyl"],
      [0.79, 1.29, 0.1, 0.1, 0.45, 0, "cyl"],
      [1.29, 0.29, 0.1, 0.1, 0.45, 0, "cyl"],
      [1.29, 0.79, 0.1, 0.1, 0.45, 0, "cyl"],
      [1.29, 1.29, 0.1, 0.1, 0.45, 0, "cyl"],
      [0.2, 0.2, 1.3, 1.3, 0.08, 0.45],
      [0.25, 0.25, 0.4, 0.4, 0.025, 0.53],
      [0.438, 0.438, 0.024, 0.024, 0.07, 0.555, "cyl"],
      [0.37, 0.37, 0.16, 0.16, 0.14, 0.6, "ball"],
      [0.25, 0.65, 0.4, 0.4, 0.2, 0.53],
      [0.25, 1.05, 0.4, 0.4, 0.2, 0.53],
      [0.65, 0.25, 0.4, 0.4, 0.025, 0.53],
      [0.65, 0.65, 0.4, 0.4, 0.2, 0.53],
      [0.65, 1.05, 0.4, 0.4, 0.2, 0.53],
      [1.05, 0.25, 0.4, 0.4, 0.2, 0.53],
      [1.05, 0.65, 0.4, 0.4, 0.2, 0.53],
      [1.05, 1.05, 0.4, 0.4, 0.2, 0.53],
      [0.25, 0.25, 0.4, 0.4, 0.2, 0.73],
      [0.25, 0.65, 0.4, 0.4, 0.2, 0.73],
      [0.25, 1.05, 0.4, 0.4, 0.2, 0.73],
      [0.65, 0.25, 0.4, 0.4, 0.025, 0.73],
      [0.838, 0.438, 0.024, 0.024, 0.07, 0.755, "cyl"],
      [0.77, 0.37, 0.16, 0.16, 0.14, 0.8, "ball"],
      [0.65, 0.65, 0.4, 0.4, 0.2, 0.73],
      [0.65, 1.05, 0.4, 0.4, 0.2, 0.73],
      [1.05, 0.25, 0.4, 0.4, 0.025, 0.73],
      [1.05, 0.65, 0.4, 0.4, 0.2, 0.73],
      [1.05, 1.05, 0.4, 0.4, 0.2, 0.73],
      [0.25, 0.25, 0.4, 0.4, 0.2, 0.93],
      [0.25, 0.65, 0.4, 0.4, 0.2, 0.93],
      [0.25, 1.05, 0.4, 0.4, 0.2, 0.93],
      [0.65, 0.25, 0.4, 0.4, 0.2, 0.93],
      [0.65, 0.65, 0.4, 0.4, 0.2, 0.93],
      [0.65, 1.05, 0.4, 0.4, 0.2, 0.93],
      [1.05, 0.25, 0.4, 0.4, 0.025, 0.93],
      [1.238, 0.438, 0.024, 0.024, 0.07, 0.955, "cyl"],
      [1.17, 0.37, 0.16, 0.16, 0.14, 1, "ball"],
      [1.05, 0.65, 0.4, 0.4, 0.025, 0.93],
      [1.05, 1.05, 0.4, 0.4, 0.2, 0.93],
      [0.25, 0.25, 0.4, 0.4, 0.2, 1.13],
      [0.25, 0.65, 0.4, 0.4, 0.2, 1.13],
      [0.25, 1.05, 0.4, 0.4, 0.2, 1.13],
      [0.65, 0.25, 0.4, 0.4, 0.2, 1.13],
      [0.65, 0.65, 0.4, 0.4, 0.2, 1.13],
      [0.65, 1.05, 0.4, 0.4, 0.2, 1.13],
      [1.05, 0.25, 0.4, 0.4, 0.2, 1.13],
      [1.05, 0.65, 0.4, 0.4, 0.025, 1.13],
      [1.238, 0.838, 0.024, 0.024, 0.07, 1.155, "cyl"],
      [1.17, 0.77, 0.16, 0.16, 0.14, 1.2, "ball"],
      [1.05, 1.05, 0.4, 0.4, 0.025, 1.13],
      [0.25, 0.25, 0.4, 0.4, 0.2, 1.33],
      [0.25, 0.65, 0.4, 0.4, 0.2, 1.33],
      [0.25, 1.05, 0.4, 0.4, 0.2, 1.33],
      [0.65, 0.25, 0.4, 0.4, 0.2, 1.33],
      [0.65, 0.65, 0.4, 0.4, 0.2, 1.33],
      [0.65, 1.05, 0.4, 0.4, 0.025, 1.33],
      [1.05, 0.25, 0.4, 0.4, 0.2, 1.33],
      [1.05, 0.65, 0.4, 0.4, 0.2, 1.33],
      [1.05, 1.05, 0.4, 0.4, 0.025, 1.33],
      [1.238, 1.238, 0.024, 0.024, 0.07, 1.355, "cyl"],
      [1.17, 1.17, 0.16, 0.16, 0.14, 1.4, "ball"],
      [0.25, 0.25, 0.4, 0.4, 0.2, 1.53],
      [0.25, 0.65, 0.4, 0.4, 0.2, 1.53],
      [0.25, 1.05, 0.4, 0.4, 0.025, 1.53],
      [0.65, 0.25, 0.4, 0.4, 0.2, 1.53],
      [0.65, 0.65, 0.4, 0.4, 0.2, 1.53],
      [0.65, 1.05, 0.4, 0.4, 0.025, 1.53],
      [0.838, 1.238, 0.024, 0.024, 0.07, 1.555, "cyl"],
      [0.77, 1.17, 0.16, 0.16, 0.14, 1.6, "ball"],
      [1.05, 0.25, 0.4, 0.4, 0.2, 1.53],
      [1.05, 0.65, 0.4, 0.4, 0.2, 1.53],
      [1.05, 1.05, 0.4, 0.4, 0.2, 1.53],
      [0.25, 0.25, 0.4, 0.4, 0.2, 1.73],
      [0.25, 0.65, 0.4, 0.4, 0.025, 1.73],
      [0.25, 1.05, 0.4, 0.4, 0.025, 1.73],
      [0.438, 1.238, 0.024, 0.024, 0.07, 1.755, "cyl"],
      [0.37, 1.17, 0.16, 0.16, 0.14, 1.8, "ball"],
      [0.65, 0.25, 0.4, 0.4, 0.2, 1.73],
      [0.65, 0.65, 0.4, 0.4, 0.2, 1.73],
      [0.65, 1.05, 0.4, 0.4, 0.2, 1.73],
      [1.05, 0.25, 0.4, 0.4, 0.2, 1.73],
      [1.05, 0.65, 0.4, 0.4, 0.2, 1.73],
      [1.05, 1.05, 0.4, 0.4, 0.2, 1.73],
      [0.25, 0.25, 0.4, 0.4, 0.025, 1.93],
      [0.25, 0.65, 0.4, 0.4, 0.025, 1.93],
      [0.438, 0.838, 0.024, 0.024, 0.07, 1.955, "cyl"],
      [0.37, 0.77, 0.16, 0.16, 0.14, 2, "ball"],
      [0.25, 1.05, 0.4, 0.4, 0.2, 1.93],
      [0.65, 0.25, 0.4, 0.4, 0.2, 1.93],
      [0.65, 0.65, 0.4, 0.4, 0.2, 1.93],
      [0.65, 1.05, 0.4, 0.4, 0.2, 1.93],
      [1.05, 0.25, 0.4, 0.4, 0.2, 1.93],
      [1.05, 0.65, 0.4, 0.4, 0.2, 1.93],
      [1.05, 1.05, 0.4, 0.4, 0.2, 1.93],
      [0.25, 0.25, 0.4, 0.4, 0.025, 2.13],
      [0.438, 0.438, 0.024, 0.024, 0.07, 2.155, "cyl"],
      [0.37, 0.37, 0.16, 0.16, 0.14, 2.2, "ball"],
      [0.25, 0.65, 0.4, 0.4, 0.2, 2.13],
      [0.25, 1.05, 0.4, 0.4, 0.2, 2.13],
      [0.65, 0.25, 0.4, 0.4, 0.025, 2.13],
      [0.65, 0.65, 0.4, 0.4, 0.2, 2.13],
      [0.65, 1.05, 0.4, 0.4, 0.2, 2.13],
      [1.05, 0.25, 0.4, 0.4, 0.2, 2.13],
      [1.05, 0.65, 0.4, 0.4, 0.2, 2.13],
      [1.05, 1.05, 0.4, 0.4, 0.2, 2.13],
      [0.25, 0.25, 0.4, 0.4, 0.2, 2.33],
      [0.25, 0.65, 0.4, 0.4, 0.2, 2.33],
      [0.25, 1.05, 0.4, 0.4, 0.2, 2.33],
      [0.65, 0.25, 0.4, 0.4, 0.025, 2.33],
      [0.838, 0.438, 0.024, 0.024, 0.07, 2.355, "cyl"],
      [0.77, 0.37, 0.16, 0.16, 0.14, 2.4, "ball"],
      [0.65, 0.65, 0.4, 0.4, 0.2, 2.33],
      [0.65, 1.05, 0.4, 0.4, 0.2, 2.33],
      [1.05, 0.25, 0.4, 0.4, 0.025, 2.33],
      [1.05, 0.65, 0.4, 0.4, 0.2, 2.33],
      [1.05, 1.05, 0.4, 0.4, 0.2, 2.33],
      [0.25, 0.25, 0.4, 0.4, 0.2, 2.53],
      [0.25, 0.65, 0.4, 0.4, 0.2, 2.53],
      [0.25, 1.05, 0.4, 0.4, 0.2, 2.53],
      [0.65, 0.25, 0.4, 0.4, 0.2, 2.53],
      [0.65, 0.65, 0.4, 0.4, 0.2, 2.53],
      [0.65, 1.05, 0.4, 0.4, 0.2, 2.53],
      [1.05, 0.25, 0.4, 0.4, 0.025, 2.53],
      [1.238, 0.438, 0.024, 0.024, 0.07, 2.555, "cyl"],
      [1.17, 0.37, 0.16, 0.16, 0.14, 2.6, "ball"],
      [1.05, 0.65, 0.4, 0.4, 0.025, 2.53],
      [1.05, 1.05, 0.4, 0.4, 0.2, 2.53],
      [0.25, 0.25, 0.4, 0.4, 0.2, 2.73],
      [0.25, 0.65, 0.4, 0.4, 0.2, 2.73],
      [0.25, 1.05, 0.4, 0.4, 0.2, 2.73],
      [0.65, 0.25, 0.4, 0.4, 0.2, 2.73],
      [0.65, 0.65, 0.4, 0.4, 0.2, 2.73],
      [0.65, 1.05, 0.4, 0.4, 0.2, 2.73],
      [1.05, 0.25, 0.4, 0.4, 0.2, 2.73],
      [1.05, 0.65, 0.4, 0.4, 0.025, 2.73],
      [1.238, 0.838, 0.024, 0.024, 0.07, 2.755, "cyl"],
      [1.17, 0.77, 0.16, 0.16, 0.14, 2.8, "ball"],
      [1.05, 1.05, 0.4, 0.4, 0.025, 2.73],
      [0.25, 0.25, 0.4, 0.4, 0.2, 2.93],
      [0.25, 0.65, 0.4, 0.4, 0.2, 2.93],
      [0.25, 1.05, 0.4, 0.4, 0.2, 2.93],
      [0.65, 0.25, 0.4, 0.4, 0.2, 2.93],
      [0.65, 0.65, 0.4, 0.4, 0.2, 2.93],
      [0.65, 1.05, 0.4, 0.4, 0.025, 2.93],
      [1.05, 0.25, 0.4, 0.4, 0.2, 2.93],
      [1.05, 0.65, 0.4, 0.4, 0.2, 2.93],
      [1.05, 1.05, 0.4, 0.4, 0.025, 2.93],
      [1.238, 1.238, 0.024, 0.024, 0.07, 2.955, "cyl"],
      [1.17, 1.17, 0.16, 0.16, 0.14, 3, "ball"],
      [0.25, 0.25, 0.4, 0.4, 0.2, 3.13],
      [0.25, 0.65, 0.4, 0.4, 0.2, 3.13],
      [0.25, 1.05, 0.4, 0.4, 0.025, 3.13],
      [0.65, 0.25, 0.4, 0.4, 0.2, 3.13],
      [0.65, 0.65, 0.4, 0.4, 0.2, 3.13],
      [0.65, 1.05, 0.4, 0.4, 0.025, 3.13],
      [0.838, 1.238, 0.024, 0.024, 0.07, 3.155, "cyl"],
      [0.77, 1.17, 0.16, 0.16, 0.14, 3.2, "ball"],
      [1.05, 0.25, 0.4, 0.4, 0.2, 3.13],
      [1.05, 0.65, 0.4, 0.4, 0.2, 3.13],
      [1.05, 1.05, 0.4, 0.4, 0.2, 3.13],
      [0.25, 0.25, 0.4, 0.4, 0.2, 3.33],
      [0.25, 0.65, 0.4, 0.4, 0.025, 3.33],
      [0.25, 1.05, 0.4, 0.4, 0.025, 3.33],
      [0.438, 1.238, 0.024, 0.024, 0.07, 3.355, "cyl"],
      [0.37, 1.17, 0.16, 0.16, 0.14, 3.4, "ball"],
      [0.65, 0.25, 0.4, 0.4, 0.2, 3.33],
      [0.65, 0.65, 0.4, 0.4, 0.2, 3.33],
      [0.65, 1.05, 0.4, 0.4, 0.2, 3.33],
      [1.05, 0.25, 0.4, 0.4, 0.2, 3.33],
      [1.05, 0.65, 0.4, 0.4, 0.2, 3.33],
      [1.05, 1.05, 0.4, 0.4, 0.2, 3.33],
      [0.25, 0.25, 0.4, 0.4, 0.025, 3.53],
      [0.25, 0.65, 0.4, 0.4, 0.025, 3.53],
      [0.438, 0.838, 0.024, 0.024, 0.07, 3.555, "cyl"],
      [0.37, 0.77, 0.16, 0.16, 0.14, 3.6, "ball"],
      [0.25, 1.05, 0.4, 0.4, 0.2, 3.53],
      [0.65, 0.25, 0.4, 0.4, 0.2, 3.53],
      [0.65, 0.65, 0.4, 0.4, 0.2, 3.53],
      [0.65, 1.05, 0.4, 0.4, 0.2, 3.53],
      [1.05, 0.25, 0.4, 0.4, 0.2, 3.53],
      [1.05, 0.65, 0.4, 0.4, 0.2, 3.53],
      [1.05, 1.05, 0.4, 0.4, 0.2, 3.53],
      [0.25, 0.25, 0.4, 0.4, 0.025, 3.73],
      [0.438, 0.438, 0.024, 0.024, 0.07, 3.755, "cyl"],
      [0.37, 0.37, 0.16, 0.16, 0.14, 3.8, "ball"],
      [0.25, 0.65, 0.4, 0.4, 0.2, 3.73],
      [0.25, 1.05, 0.4, 0.4, 0.2, 3.73],
      [0.65, 0.25, 0.4, 0.4, 0.025, 3.73],
      [0.65, 0.65, 0.4, 0.4, 0.2, 3.73],
      [0.65, 1.05, 0.4, 0.4, 0.2, 3.73],
      [1.05, 0.25, 0.4, 0.4, 0.2, 3.73],
      [1.05, 0.65, 0.4, 0.4, 0.2, 3.73],
      [1.05, 1.05, 0.4, 0.4, 0.2, 3.73],
      [0.25, 0.25, 0.4, 0.4, 0.2, 3.93],
      [0.25, 0.65, 0.4, 0.4, 0.2, 3.93],
      [0.25, 1.05, 0.4, 0.4, 0.2, 3.93],
      [0.65, 0.25, 0.4, 0.4, 0.025, 3.93],
      [0.838, 0.438, 0.024, 0.024, 0.07, 3.955, "cyl"],
      [0.77, 0.37, 0.16, 0.16, 0.14, 4, "ball"],
      [0.65, 0.65, 0.4, 0.4, 0.2, 3.93],
      [0.65, 1.05, 0.4, 0.4, 0.2, 3.93],
      [1.05, 0.25, 0.4, 0.4, 0.025, 3.93],
      [1.05, 0.65, 0.4, 0.4, 0.2, 3.93],
      [1.05, 1.05, 0.4, 0.4, 0.2, 3.93]
    ],
    cover: "assets/img/timteam-work/exterior-arcade-rain.jpg", // 핀 #99 (예전: cover-tower.jpg 핀 #41)
    // coverVideo: "assets/img/timteam-work/cover-hq.mp4", // 핀 #72 (원본 portfolio-source/대표사진 영상/목조 오피스 영상.mp4) — 핀 #99로 사진으로 바꿈
    coverR: 2.01, // 대표사진 가로/세로 (머리 배치용)
    thumb: "assets/img/timteam-work/cover.jpg",
    thumb: "assets/img/timteam-work/card-frame.jpg", // 카드·목록에 쓰는 이미지 (상세 페이지 맨 위는 cover)
    coverCaption: "The timber arcade in the rain",
    summary:
      "Pangyo Techno Valley is a district of glass towers on a green edge. Sampyeong-dong 641 sits between the two and asks if an office can be built of timber and climb with the park. A 14-storey timber office: GLT frame and CLT slabs on a 3,500 grid around three cores, with 53 planted terraces rising to a roof garden at +61,000 over a timber arcade.",
    sections: [
      { heading: "Territorial Reading", text: "1.6 km around the plot, north up, 250 m grid — where the green link meets the office district. The site section runs west–east through the plot, from Hwarang Park to the towers of Pangyo.", images: [], panel: {"src":"assets/img/timteam-work/territorial-reading.jpg","r":0.708,"left":[["Startup Campus","public start-up centre"],["Cha Bio Complex","biotech research"],["SK Chemicals","research headquarters"],["Nexon Korea","game developer HQ"],["NHN Play Museum","museum and offices"],["AhnLab","security software HQ"],["NCSoft R&D Center","across the Unjungcheon"],["Plot 1","43 × 37 m · 1,591 m²"],["Hwarang Park","13 ha hill park"],["Kakao Pangyo Agit","offices over shops"],["Pangyo Station","Sinbundang, Gyeonggang"],["Krafton Tower","game developer HQ"],["Alpharium 2","high-rise housing"]],"right":[["11 min walk","4 programmes in 250 m"],["15 min walk","7 programmes in 250 m"],["10 min walk","11 programmes in 250 m"],["13 min walk","10 programmes in 250 m"],["8 min walk","10 programmes in 250 m"],["7 min walk","15 programmes in 250 m"],["7 min walk","8 programmes in 250 m"],["61 m timber tower","4 programmes in 250 m"],["10 min walk","1 programme in 250 m"],["6 min walk","9 programmes in 250 m"],["8 min walk","7 programmes in 250 m"],["10 min walk","6 programmes in 250 m"],["7 min walk","5 programmes in 250 m"]],"notes":[["5 min · 400 m","green 34 % · built 13 % · height 47 / 68 m · pedshed 21 %"],["10 min · 800 m","green 13 % · built 17 % · height 42 / 77 m · pedshed 44 %"],["15 min · 1,200 m","green 8 % · built 15 % · height 35 / 77 m · pedshed 43 %"],["Green link","park to plaza, through the plot"]],"legend":[["T","Tech office"],["R","Housing"],["C","Civic, culture"],["P","Park"],["S","Station"],["+","250 m grid"]],"cap":"Territorial reading — 1.6 km around plot 1, north up, 250 m grid. Each place on its row: on the left what it is, on the right the walk from the plot."}, stack: true, pan: {"src":"assets/img/timteam-work/site-section-wide.jpg","r":4.844,"h":"25vh","w":"64%","after":true,"cap":"Site section S–S′ — west–east through plot 1, from Hwarang Park to the offices of Pangyo; scroll to walk along it, past the neighbouring plots"} },
      { heading: "Composition of Timber", text: "In Pangyo Techno Valley, where many technologies meet, a tall timber building for culture and work that draws nature in. Timber columns carry the structure and divide the space as they go, and a small garden terrace on every floor ties nature in vertically, through real trees.", images: [], seq: {"kind":"frames","r":0.857,"k":0.5,"steps":[{"src":"assets/img/timteam-work/composition-1.jpg","t":"Mass timber","s":"one solid block of wood"},{"src":"assets/img/timteam-work/composition-2.jpg","t":"Tall timber","s":"floors stacked on a timber spine"},{"src":"assets/img/timteam-work/composition-3.jpg","t":"Timber in sequence","s":"stems repeated, like a grove"},{"src":"assets/img/timteam-work/composition-4.jpg","x":"4%","t":"Vertical flow","s":"terraces and trees up the frame"}]} },
      { heading: "Mass Process", text: "Ordinary block to vertical park, in five moves — scroll to run them.", images: [], seq: {"kind":"frames","r":0.842,"k":0.6,"steps":[{"src":"assets/img/timteam-work/mass-1.jpg","t":"Mass","s":"1 block · 14 storeys + roof","d":"The ordinary answer first: one block on the plot, 28,000 square and 61,000 to the roof.","k":[["Plot","1,591 m²"],["Footprint","835 m²"],["Coverage","52 %"]]},{"src":"assets/img/timteam-work/mass-2.jpg","t":"Grid","s":"8 × 8 bays · 896 cells","d":"Cut on the 3,500 timber grid and the real storeys: 5,500, 5,500, 6,000, then 4,000.","k":[["Bay","3,500"],["Podium","5,500–6,000"],["Typical","4,000"]]},{"src":"assets/img/timteam-work/mass-3.jpg","t":"Modular","s":"744 kept · 152 open","d":"Cells come out where the city should come in: the ground floor, a 4F courtyard and the terraces.","k":[["Cells kept","744"],["Cells open","152"],["Open share","17 %"]]},{"src":"assets/img/timteam-work/mass-4.jpg","t":"Flow","s":"53 terraces · roof 784 m²","d":"The open cells are planted. Terraces step two bays per storey and the park climbs the tower.","k":[["Terraces","53"],["Helices","3"],["Planted","1,433 m²"]]},{"src":"assets/img/timteam-work/mass-5.jpg","t":"Arcade","s":"19 bays · 1F 454 m²","d":"The 2F floor cantilevers one bay over a glazed ground floor, and the park passes under it.","k":[["Cantilever","3,950"],["1F enclosed","454 m²"],["Arcade bays","19"]]}]} },
      { heading: "Systems", text: "Cores, frame, slabs, skin and terraces: three concrete cores, a GLT column on every node of the 3,500 grid, one CLT slab per level, a post-and-beam curtain wall with timber slats, and the open cells planted 600 deep.", images: [{ src: "assets/img/timteam-work/systems.jpg", caption: "Systems — cores, frame, slabs, skin, terraces", r: 3.597, notes: [["01","Cores","Stairs, lifts and shafts in three concrete cores, the only concrete above ground"],["02","Frame","A GLT column on every node of the 3,500 grid and girders under each slab"],["03","Slabs","One CLT slab per level, left open where a terrace or the courtyard cuts in"],["04","Skin","A post-and-beam curtain wall, with a grating catwalk and timber slats outside"],["05","Terraces","The open cells planted 600 deep on the CLT, two helices up to the roof garden"]] }] },
      { heading: "Four Facades, Unfolded", text: "Terraces from the plans, levels from the sections: post-and-beam glazing, slab edge, glare slats and open bays, read around all four sides.", images: [{src: "assets/img/timteam-work/four-facades.jpg", caption: "Four facades, unfolded", r: 1.711} /* 핀 #228: 나무 자라는 시뮬레이션 빼고 원래 그림 */] },
      { heading: "Joints in Timber", text: "One slice from 1F to 5F around a single bay, six details redrawn at one scale, and six joints exploded — core, column, girder, arcade and facade.", images: [], keyed: {"key":{"src":"assets/img/timteam-work/one-slice-bare.jpg","r":0.878,"caption":"One slice, 1F to 5F — where each joint sits"},"items":[{"src":"assets/img/timteam-work/joint-1.jpg","r":0.744,"t":"Core to slab, panel to panel","x":48.4,"y":24,"notes":[["1","R.C core wall, 300"],["2","Cast-in steel plate"],["3","Steel seat bracket"],["4","Threaded anchor rods and nuts"],["5","Bearing pad"],["6","Buffer strip on the panel edge"],["7","CLT 250, five crossed layers"],["8","Tongue and groove, jehyeo jjokmae"],["9","Oak butterfly key, eunjang"]]},{"src":"assets/img/timteam-work/joint-2.jpg","r":0.744,"t":"Column to beam","x":55.2,"y":25.9,"notes":[["1","GLT column in four shafts, 600 × 600"],["2","Cruciform slot, sagae matchum"],["3","Dovetail mortise in each shaft head"],["4","Fork blade under the girder, galkwi"],["5","Oak pegs through head and blade, sanji"],["6","GLT double girder, 340 × 360"],["7","Dovetail tenon on each leaf, jumeokjang"]]},{"src":"assets/img/timteam-work/joint-3.jpg","r":0.744,"t":"PSL column head","x":59.8,"y":81,"notes":[["1","PSL column in two leaves"],["2","Load-assist steel plate"],["3","GLT double girder, lower"],["4","Half-lap housing, banteok matchum"],["5","Steel drift pins"],["6","GLT double girder, upper, crossing"],["7","Oak pegs through the lap"],["8","Timber louvre ceiling, cut away"]]},{"src":"assets/img/timteam-work/joint-4.jpg","r":0.744,"t":"Girder splice","x":65.5,"y":56.5,"notes":[["1","GLT girder leaf, 150 × 360"],["2","The leaf continued"],["3","Scarf faces, eotgeori"],["4","Step that stops the pieces sliding"],["5","Square oak keys, sanji, driven through"]]},{"src":"assets/img/timteam-work/joint-5.jpg","r":0.744,"t":"Arcade","x":32,"y":80,"notes":[["1","PSL column in two leaves"],["2","Springer block on the column"],["3","Mortise in the springer"],["4","Tenon at the rib foot, jangbu"],["5","Pointed GLT rib"],["6","Butterfly key across the apex"],["7","Glazing in the pointed arch"],["8","Mullion and transom, morticed"],["9","GLT double girder, 2F"]]},{"src":"assets/img/timteam-work/joint-6.jpg","r":0.744,"t":"Slab edge and facade","x":29.3,"y":13.1,"notes":[["1","CLT slab"],["2","O.A floor and timber flooring"],["3","EPS 100 insulation"],["4","Aluminium facing"],["5","Timber mullion"],["6","Transom with a tenon, jangbu"],["7","Triple glazing"],["8","Aluminium pressure plate and cap"],["9","Steel grating catwalk"],["10","Outer frame, 50 × 50 steel pipe"],["11","Timber blades against glare, tilted down and out"]]}]}, seq: {"kind":"lead","src":"assets/img/timteam-work/one-slice-bare.jpg","r":0.878,"n":9,"steps":[{"t":"One slice, 1F to 5F","s":"two bays by two, seen from inside"},{"t":"5F and 4F — the office floor","s":"frame, slab, girders and services"},{"t":"3F — the terrace","s":"dropped into the slab"},{"t":"2F — the lounge","s":"the same floor, finish taken off"},{"t":"1F — the arcade","s":"arches, wave ceiling, tree columns"}],"L":[["l",12.81,24.55,"Double-skin facade",1],["r",16.59,59,"Four-shaft GLT column 360",1],["l",18.39,24.95,"O.A floor 300",1],["r",19.7,69.5,"5F corporate workspace",1,1],["l",21.85,25.25,"CLT slab 250",1],["r",22.64,73.5,"Steel column foot, each floor",1],["l",25.32,33.6,"GLT double girders",1],["r",25.58,68.35,"Heating and cooling pipes",1],["r",28.52,62.2,"Air pipe 250",1],["l",28.78,38.5,"Flooring 10, impact 30",1],["r",31.46,69.5,"Sprinkler pipe",1],["l",32.25,48.05,"Waffle ceiling",1],["r",34.42,70.55,"4F office community",1,1],["l",35.72,39.5,"Curtain wall to the void",1],["r",48.75,54.7,"Curtain wall, lounge to terrace",2],["l",49.71,29.4,"Parapet, CLT 150, timber clad",2],["r",51.69,74,"3F lounge",2,1],["l",53.18,28.85,"Terrace soil 600",2],["r",54.63,73.85,"3F terrace",2,1],["l",56.65,24.55,"Drainage deck 100",2],["l",60.11,24.4,"CLT slab 250, dropped 575",2],["r",69.15,71.85,"2F lounge",3,1],["l",72.44,30.45,"O.A floor, 2F",3],["l",77.4,32.55,"Arches, carrying the load",4],["r",78.81,63.7,"2F and up drawn lifted 1 500",4],["l",80.85,37.85,"Wave ceiling, timber louvre",4],["r",81.77,60.45,"The louvre fanned up at the cut",4],["r",84.71,53.85,"Showroom curtain wall",4],["l",86.05,40,"PSL low-rise, tree columns",4],["r",88.94,69.8,"Four-shaft PSL column",4],["r",91.88,61.3,"1F showroom, companies",4,1],["r",95.66,53.1,"Steel column shoe",4]]} },
      { heading: "Six Details, in Timber", text: "Six details redrawn at one scale from 1:10 — one at a time, with the materials each one holds.", images: [], seq: {"kind":"frames","r":1.9003,"box":21,"below":true,"fade":true,"k":1.3,"steps":[{"src":"assets/img/timteam-work/detail-b1.jpg","lb":[["r",22.04,"15"],["l",22.76,"6"],["r",29.03,"9"],["l",29.39,"1"],["r",35.3,"7"],["r",41.49,"3"],["l",52.78,"16"],["r",68.73,"8"],["r",78.76,"10"]],"t":"B1 Slab edge and facade","s":"where the office floor meets the double skin","k":[["O.A floor 300","6"],["CLT slab 250, five layers","1"],["EPS insulation","7"],["GLT girder 340 × 360","3"],["Heating and utilities conduit","15"],["Wooden grid ceiling","16"],["Post-and-beam facade","8"],["Steel grating catwalk","9"],["Glare slats, wood","10"]]},{"src":"assets/img/timteam-work/detail-b2.jpg","lb":[["r",19.0,"11"],["l",30.65,"13"],["l",43.01,"14"],["l",50.0,"1"],["l",56.27,"7"],["r",58.33,"3"],["l",70.34,"16"],["r",79.03,"8"]],"t":"B2 Terrace planter","s":"soil carried on the slab","k":[["Planting layer 600","13"],["Drainage deck and membrane","14"],["CLT slab 250, five layers","1"],["EPS insulation","7"],["GLT girder 340 × 360","3"],["Wooden grid ceiling","16"],["Parapet, CLT 150 in a timber frame","11"],["Post-and-beam facade","8"]]},{"src":"assets/img/timteam-work/detail-b3.jpg","lb":[["r",6.72,"12"],["r",29.39,"11"],["l",41.04,"13"],["l",61.02,"1"],["l",70.07,"3"],["r",82.71,"8"],["r",92.74,"9"]],"t":"B3 Terrace parapet","s":"the edge of the dropped terrace","k":[["Planting layer 600","13"],["CLT slab 250, five layers","1"],["GLT girder 340 × 360","3"],["Parapet, CLT 150 in a timber frame","11"],["Deck coping on a steel pipe","12"],["Post-and-beam facade","8"],["Steel grating catwalk","9"]]},{"src":"assets/img/timteam-work/detail-b4.jpg","lb":[["l",31.45,"6"],["l",37.63,"1"],["r",38.8,"13"],["r",48.84,"2"],["r",60.48,"1"],["r",82.17,"16"]],"t":"B4 Office to terrace","s":"the step down in the slab","k":[["O.A floor 300","6"],["CLT slab 250, five layers","1"],["CLT stacked at the step","2"],["Planting layer 600","13"],["Wooden grid ceiling","16"]]},{"src":"assets/img/timteam-work/detail-b5.jpg","lb":[["l",42.74,"6"],["r",44.09,"15"],["l",50.09,"1"],["r",50.36,"9"],["l",56.36,"7"],["r",63.44,"3"],["l",78.14,"17"]],"t":"B5 2F slab over the arcade","s":"the floor above the louvre","k":[["O.A floor 300","6"],["CLT slab 250, five layers","1"],["EPS insulation","7"],["GLT girder 340 × 360","3"],["Heating and utilities conduit","15"],["Steel grating catwalk","9"],["Wooden louvre ceiling, a wave","17"]]},{"src":"assets/img/timteam-work/detail-b6.jpg","lb":[["l",17.29,"1"],["l",27.33,"3"],["r",29.03,"18"],["l",45.97,"17"],["r",67.38,"5"],["l",80.73,"4"]],"t":"B6 Louvre ceiling, arches","s":"the wave hung under the 2F slab","k":[["CLT slab 250, five layers","1"],["GLT girder 340 × 360","3"],["Hanger rods","18"],["Wooden louvre ceiling, a wave","17"],["Pointed GLT arch","5"],["PSL column","4"]]}]} },
      { heading: "Plans", text: "Nine of fourteen floors on one grid, X1–X9 by Y1–Y9 at 3,500 — from the ground up, the core stays put while each floor changes around it.", big: true, images: [], seq: {"kind":"frames","r":1.0955,"fade":true,"tag":true,"steps":[{"src":"assets/img/timteam-work/plan-1f.jpg","t":"1F ±0","s":"Public space"},{"src":"assets/img/timteam-work/plan-2f.jpg","t":"2F +5,500","s":"Community"},{"src":"assets/img/timteam-work/plan-4f.jpg","t":"4F +17,000","s":"Office community"},{"src":"assets/img/timteam-work/plan-5f.jpg","t":"5F +21,000","s":"Hot-desk office"},{"src":"assets/img/timteam-work/plan-7f.jpg","t":"7F +29,000","s":"Typical office"},{"src":"assets/img/timteam-work/plan-8f.jpg","t":"8F +33,000","s":"Typical office"},{"src":"assets/img/timteam-work/plan-9f.jpg","t":"9F +37,000","s":"Typical office"},{"src":"assets/img/timteam-work/plan-10f.jpg","t":"10F +41,000","s":"Typical office"},{"src":"assets/img/timteam-work/plan-13f.jpg","t":"13F +53,000","s":"Typical office"}]} },
      { heading: "Sections", text: "Two cuts through the tower — A–A′ through the stair core, B–B′ along the arcades.", big: true, images: [{src: "assets/img/timteam-work/sections.jpg", caption: "Sections A–A′ through the stair core (left) and B–B′ along the arcades (right) — cut lines heavy, lines beyond light", r: 1.376, tags: [[2.66,7.06,"RF +61,000","","lv"],[2.66,11.93,"14F +57,000","","lv"],[2.66,16.8,"13F +53,000","","lv"],[2.66,21.67,"12F +49,000","","lv"],[2.66,26.54,"11F +45,000","","lv"],[2.66,31.41,"10F +41,000","","lv"],[2.66,36.28,"9F +37,000","","lv"],[2.66,41.15,"8F +33,000","","lv"],[2.66,46.02,"7F +29,000","","lv"],[2.66,50.89,"6F +25,000","","lv"],[2.66,55.76,"5F +21,000","","lv"],[2.66,60.63,"4F +17,000","","lv"],[2.66,67.94,"3F +11,000","","lv"],[2.66,74.59,"2F +5,500","","lv"],[2.66,81.49,"GL ±0","","lv"],[2.66,87.99,"B1 −4,800","","lv"],[2.66,93.42,"B2 −9,300","","lv"]]}] },
      { heading: "Scenes", text: "The tower at night over the timber arcade, and the interiors it shelters.", images: [{src: "assets/img/timteam-work/exterior-arcade-rain.jpg", caption: "Timber arcade in the rain", r: 2.01}, {src: "assets/img/timteam-work/night-exterior.jpg", caption: "Exterior at night", r: 0.635}, {src: "assets/img/timteam-work/interior-hall.jpg", caption: "Hall in timber", r: 0.752}, {src: "assets/img/timteam-work/interior-arcade.jpg", caption: "Showroom under the arches", r: 1.07}, {src: "assets/img/timteam-work/interior-cafe.jpg", caption: "Cafeteria and spiral stair", r: 0.711}], stack: true, scenes: true },
    ],
    drawings: [], // 2026-11-22 핀: Plans·Sections 섹션으로 옮겼어요
  },
  {
    slug: "modular-o-housing", blurb: "모듈러 공동주택",
    title: "Modular O′ housing",
    titleKo: "모듈러 주거 단지",
    subtitle: "Modular housing complex, assembled and taken apart on one grid",
    type: "Housing",
    year: "2024",
    studio: "공모전",
    award: "제28회 LH 대학생 주택건축대전 장려상",
    program: "모듈러 공동주택",
    site: "",
    area: "",
    team: "2인 공동작품",
    tools: "",
    pos: [2.8, 2.1],
    mass: [
      [0, 0, 0.25, 0.25, 0.3, 0],
      [0, 0, 0.25, 0.25, 0.3, 0.3],
      [0, 0, 0.25, 0.25, 0.15, 0.6],
      [0.25, 0, 0.25, 0.25, 0.3, 0],
      [0.25, 0, 0.25, 0.25, 0.3, 0.3],
      [0.5, 0, 0.25, 0.25, 0.3, 0],
      [0.5, 0, 0.25, 0.25, 0.15, 0.3],
      [0.75, 0, 0.25, 0.25, 0.3, 0],
      [0.75, 0, 0.25, 0.25, 0.3, 0.3],
      [0.75, 0, 0.25, 0.25, 0.15, 0.6],
      [1, 0, 0.25, 0.25, 0.3, 0],
      [1, 0, 0.25, 0.25, 0.3, 0.3],
      [1, 0, 0.25, 0.25, 0.3, 0.6],
      [1, 0, 0.25, 0.25, 0.15, 0.9],
      [1.25, 0, 0.25, 0.25, 0.3, 0],
      [1.25, 0, 0.25, 0.25, 0.3, 0.3],
      [1.25, 0, 0.25, 0.25, 0.3, 0.6],
      [1.5, 0, 0.25, 0.25, 0.3, 0],
      [1.5, 0, 0.25, 0.25, 0.3, 0.3],
      [1.5, 0, 0.25, 0.25, 0.3, 0.6],
      [1.5, 0, 0.25, 0.25, 0.15, 0.9],
      [1.75, 0, 0.25, 0.25, 0.3, 0],
      [1.75, 0, 0.25, 0.25, 0.3, 0.3],
      [1.75, 0, 0.25, 0.25, 0.15, 0.6],
      [2, 0, 0.25, 0.25, 0.3, 0],
      [2, 0, 0.25, 0.25, 0.3, 0.3],
      [2, 0, 0.25, 0.25, 0.3, 0.6],
      [2, 0, 0.25, 0.25, 0.15, 0.9],
      [2.25, 0, 0.25, 0.25, 0.3, 0],
      [2.25, 0, 0.25, 0.25, 0.3, 0.3],
      [2.25, 0, 0.25, 0.25, 0.3, 0.6],
      [2.25, 0, 0.25, 0.25, 0.15, 0.9],
      [2.5, 0, 0.25, 0.25, 0.3, 0],
      [2.5, 0, 0.25, 0.25, 0.3, 0.3],
      [2.5, 0, 0.25, 0.25, 0.3, 0.6],
      [2.5, 0, 0.25, 0.25, 0.15, 0.9],
      [2.75, 0, 0.25, 0.25, 0.3, 0],
      [2.75, 0, 0.25, 0.25, 0.3, 0.3],
      [2.75, 0, 0.25, 0.25, 0.3, 0.6],
      [2.75, 0, 0.25, 0.25, 0.15, 0.9],
      [0, 0.25, 0.25, 0.25, 0.3, 0],
      [0, 0.25, 0.25, 0.25, 0.3, 0.3],
      [0, 0.25, 0.25, 0.25, 0.15, 0.6],
      [0.25, 0.25, 0.25, 0.25, 0.3, 0],
      [0.25, 0.25, 0.25, 0.25, 0.3, 0.3],
      [0.25, 0.25, 0.25, 0.25, 0.15, 0.6],
      [0.5, 0.25, 0.25, 0.25, 0.3, 0],
      [0.5, 0.25, 0.25, 0.25, 0.3, 0.3],
      [0.5, 0.25, 0.25, 0.25, 0.15, 0.6],
      [0.75, 0.25, 0.25, 0.25, 0.3, 0],
      [0.75, 0.25, 0.25, 0.25, 0.3, 0.3],
      [0.75, 0.25, 0.25, 0.25, 0.15, 0.6],
      [1, 0.25, 0.25, 0.25, 0.3, 0],
      [1, 0.25, 0.25, 0.25, 0.3, 0.3],
      [1, 0.25, 0.25, 0.25, 0.3, 0.6],
      [1, 0.25, 0.25, 0.25, 0.15, 0.9],
      [1.25, 0.25, 0.25, 0.25, 0.3, 0],
      [1.25, 0.25, 0.25, 0.25, 0.3, 0.3],
      [1.25, 0.25, 0.25, 0.25, 0.3, 0.6],
      [1.25, 0.25, 0.25, 0.25, 0.15, 0.9],
      [1.5, 0.25, 0.25, 0.25, 0.3, 0],
      [1.5, 0.25, 0.25, 0.25, 0.3, 0.3],
      [1.5, 0.25, 0.25, 0.25, 0.3, 0.6],
      [1.5, 0.25, 0.25, 0.25, 0.15, 0.9],
      [1.75, 0.25, 0.25, 0.25, 0.3, 0],
      [1.75, 0.25, 0.25, 0.25, 0.3, 0.3],
      [1.75, 0.25, 0.25, 0.25, 0.3, 0.6],
      [1.75, 0.25, 0.25, 0.25, 0.15, 0.9],
      [2, 0.25, 0.25, 0.25, 0.3, 0],
      [2, 0.25, 0.25, 0.25, 0.3, 0.3],
      [2, 0.25, 0.25, 0.25, 0.3, 0.6],
      [2, 0.25, 0.25, 0.25, 0.15, 0.9],
      [2.25, 0.25, 0.25, 0.25, 0.3, 0],
      [2.25, 0.25, 0.25, 0.25, 0.3, 0.3],
      [2.25, 0.25, 0.25, 0.25, 0.3, 0.6],
      [2.25, 0.25, 0.25, 0.25, 0.3, 0.9],
      [2.5, 0.25, 0.25, 0.25, 0.3, 0],
      [2.5, 0.25, 0.25, 0.25, 0.3, 0.3],
      [2.5, 0.25, 0.25, 0.25, 0.3, 0.6],
      [2.5, 0.25, 0.25, 0.25, 0.3, 0.9],
      [2.75, 0.25, 0.25, 0.25, 0.3, 0],
      [2.75, 0.25, 0.25, 0.25, 0.3, 0.3],
      [2.75, 0.25, 0.25, 0.25, 0.3, 0.6],
      [2.75, 0.25, 0.25, 0.25, 0.15, 0.9],
      [0, 0.5, 0.25, 0.25, 0.3, 0],
      [0, 0.5, 0.25, 0.25, 0.3, 0.3],
      [0, 0.5, 0.25, 0.25, 0.15, 0.6],
      [0.25, 0.5, 0.25, 0.25, 0.3, 0],
      [0.25, 0.5, 0.25, 0.25, 0.3, 0.3],
      [0.25, 0.5, 0.25, 0.25, 0.15, 0.6],
      [0.5, 0.5, 0.25, 0.25, 0.3, 0],
      [0.5, 0.5, 0.25, 0.25, 0.3, 0.3],
      [0.75, 0.5, 0.25, 0.25, 0.3, 0],
      [0.75, 0.5, 0.25, 0.25, 0.3, 0.3],
      [1, 0.5, 0.25, 0.25, 0.3, 0],
      [1, 0.5, 0.25, 0.25, 0.3, 0.3],
      [1, 0.5, 0.25, 0.25, 0.3, 0.6],
      [1.25, 0.5, 0.25, 0.25, 0.3, 0],
      [1.25, 0.5, 0.25, 0.25, 0.3, 0.3],
      [1.25, 0.5, 0.25, 0.25, 0.3, 0.6],
      [1.25, 0.5, 0.25, 0.25, 0.15, 0.9],
      [1.5, 0.5, 0.25, 0.25, 0.3, 0],
      [1.5, 0.5, 0.25, 0.25, 0.3, 0.3],
      [1.5, 0.5, 0.25, 0.25, 0.3, 0.6],
      [1.5, 0.5, 0.25, 0.25, 0.15, 0.9],
      [1.75, 0.5, 0.25, 0.25, 0.3, 0],
      [1.75, 0.5, 0.25, 0.25, 0.3, 0.3],
      [1.75, 0.5, 0.25, 0.25, 0.3, 0.6],
      [1.75, 0.5, 0.25, 0.25, 0.15, 0.9],
      [2, 0.5, 0.25, 0.25, 0.3, 0],
      [2, 0.5, 0.25, 0.25, 0.3, 0.3],
      [2, 0.5, 0.25, 0.25, 0.3, 0.6],
      [2, 0.5, 0.25, 0.25, 0.15, 0.9],
      [2.25, 0.5, 0.25, 0.25, 0.3, 0],
      [2.25, 0.5, 0.25, 0.25, 0.3, 0.3],
      [2.25, 0.5, 0.25, 0.25, 0.3, 0.6],
      [2.25, 0.5, 0.25, 0.25, 0.3, 0.9],
      [2.5, 0.5, 0.25, 0.25, 0.3, 0],
      [2.5, 0.5, 0.25, 0.25, 0.3, 0.3],
      [2.5, 0.5, 0.25, 0.25, 0.3, 0.6],
      [2.5, 0.5, 0.25, 0.25, 0.3, 0.9],
      [2.75, 0.5, 0.25, 0.25, 0.3, 0],
      [2.75, 0.5, 0.25, 0.25, 0.3, 0.3],
      [2.75, 0.5, 0.25, 0.25, 0.3, 0.6],
      [2.75, 0.5, 0.25, 0.25, 0.15, 0.9],
      [0, 0.75, 0.25, 0.25, 0.3, 0],
      [0, 0.75, 0.25, 0.25, 0.3, 0.3],
      [0, 0.75, 0.25, 0.25, 0.15, 0.6],
      [0.25, 0.75, 0.25, 0.25, 0.3, 0],
      [0.25, 0.75, 0.25, 0.25, 0.3, 0.3],
      [0.5, 0.75, 0.25, 0.25, 0.3, 0],
      [0.5, 0.75, 0.25, 0.25, 0.3, 0.3],
      [0.5, 0.75, 0.25, 0.25, 0.15, 0.6],
      [0.75, 0.75, 0.25, 0.25, 0.3, 0],
      [0.75, 0.75, 0.25, 0.25, 0.3, 0.3],
      [1, 0.75, 0.25, 0.25, 0.3, 0],
      [1, 0.75, 0.25, 0.25, 0.3, 0.3],
      [1, 0.75, 0.25, 0.25, 0.3, 0.6],
      [1.25, 0.75, 0.25, 0.25, 0.3, 0],
      [1.25, 0.75, 0.25, 0.25, 0.3, 0.3],
      [1.25, 0.75, 0.25, 0.25, 0.3, 0.6],
      [1.5, 0.75, 0.25, 0.25, 0.3, 0],
      [1.5, 0.75, 0.25, 0.25, 0.3, 0.3],
      [1.5, 0.75, 0.25, 0.25, 0.3, 0.6],
      [1.5, 0.75, 0.25, 0.25, 0.15, 0.9],
      [1.75, 0.75, 0.25, 0.25, 0.3, 0],
      [1.75, 0.75, 0.25, 0.25, 0.3, 0.3],
      [1.75, 0.75, 0.25, 0.25, 0.15, 0.6],
      [2, 0.75, 0.25, 0.25, 0.3, 0],
      [2, 0.75, 0.25, 0.25, 0.3, 0.3],
      [2, 0.75, 0.25, 0.25, 0.3, 0.6],
      [2.25, 0.75, 0.25, 0.25, 0.3, 0],
      [2.25, 0.75, 0.25, 0.25, 0.3, 0.3],
      [2.25, 0.75, 0.25, 0.25, 0.3, 0.6],
      [2.25, 0.75, 0.25, 0.25, 0.15, 0.9],
      [2.5, 0.75, 0.25, 0.25, 0.3, 0],
      [2.5, 0.75, 0.25, 0.25, 0.3, 0.3],
      [2.5, 0.75, 0.25, 0.25, 0.3, 0.6],
      [2.5, 0.75, 0.25, 0.25, 0.3, 0.9],
      [2.75, 0.75, 0.25, 0.25, 0.3, 0],
      [2.75, 0.75, 0.25, 0.25, 0.3, 0.3],
      [2.75, 0.75, 0.25, 0.25, 0.3, 0.6],
      [2.75, 0.75, 0.25, 0.25, 0.3, 0.9],
      [0, 1, 0.25, 0.25, 0.15, 0],
      [0.25, 1, 0.25, 0.25, 0.15, 0],
      [0.5, 1, 0.25, 0.25, 0.15, 0],
      [0.75, 1, 0.25, 0.25, 0.15, 0],
      [2, 1, 0.25, 0.25, 0.15, 0],
      [2.25, 1, 0.25, 0.25, 0.15, 0],
      [2.5, 1, 0.25, 0.25, 0.15, 0],
      [2.75, 1, 0.25, 0.25, 0.15, 0],
      [0, 1.25, 0.25, 0.25, 0.15, 0],
      [0.25, 1.25, 0.25, 0.25, 0.3, 0],
      [0.5, 1.25, 0.25, 0.25, 0.15, 0],
      [0.75, 1.25, 0.25, 0.25, 0.15, 0],
      [1, 1.25, 0.25, 0.25, 0.3, 0],
      [1, 1.25, 0.25, 0.25, 0.3, 0.3],
      [1, 1.25, 0.25, 0.25, 0.15, 0.6],
      [1.25, 1.25, 0.25, 0.25, 0.3, 0],
      [1.25, 1.25, 0.25, 0.25, 0.3, 0.3],
      [1.25, 1.25, 0.25, 0.25, 0.15, 0.6],
      [1.5, 1.25, 0.25, 0.25, 0.3, 0],
      [1.5, 1.25, 0.25, 0.25, 0.3, 0.3],
      [1.5, 1.25, 0.25, 0.25, 0.15, 0.6],
      [1.75, 1.25, 0.25, 0.25, 0.3, 0],
      [1.75, 1.25, 0.25, 0.25, 0.3, 0.3],
      [1.75, 1.25, 0.25, 0.25, 0.3, 0.6],
      [2, 1.25, 0.25, 0.25, 0.3, 0],
      [2, 1.25, 0.25, 0.25, 0.3, 0.3],
      [2, 1.25, 0.25, 0.25, 0.3, 0.6],
      [2, 1.25, 0.25, 0.25, 0.3, 0.9],
      [2.25, 1.25, 0.25, 0.25, 0.3, 0],
      [2.25, 1.25, 0.25, 0.25, 0.3, 0.3],
      [2.25, 1.25, 0.25, 0.25, 0.3, 0.6],
      [2.25, 1.25, 0.25, 0.25, 0.3, 0.9],
      [2.25, 1.25, 0.25, 0.25, 0.3, 1.2],
      [2.5, 1.25, 0.25, 0.25, 0.3, 0],
      [2.5, 1.25, 0.25, 0.25, 0.3, 0.3],
      [2.5, 1.25, 0.25, 0.25, 0.3, 0.6],
      [2.5, 1.25, 0.25, 0.25, 0.3, 0.9],
      [2.75, 1.25, 0.25, 0.25, 0.3, 0],
      [2.75, 1.25, 0.25, 0.25, 0.3, 0.3],
      [2.75, 1.25, 0.25, 0.25, 0.3, 0.6],
      [2.75, 1.25, 0.25, 0.25, 0.3, 0.9],
      [2.75, 1.25, 0.25, 0.25, 0.15, 1.2],
      [0, 1.5, 0.25, 0.25, 0.3, 0],
      [0.25, 1.5, 0.25, 0.25, 0.3, 0],
      [0.25, 1.5, 0.25, 0.25, 0.15, 0.3],
      [0.5, 1.5, 0.25, 0.25, 0.3, 0],
      [0.5, 1.5, 0.25, 0.25, 0.15, 0.3],
      [0.75, 1.5, 0.25, 0.25, 0.15, 0],
      [1, 1.5, 0.25, 0.25, 0.3, 0],
      [1, 1.5, 0.25, 0.25, 0.3, 0.3],
      [1, 1.5, 0.25, 0.25, 0.15, 0.6],
      [1.25, 1.5, 0.25, 0.25, 0.3, 0],
      [1.25, 1.5, 0.25, 0.25, 0.3, 0.3],
      [1.25, 1.5, 0.25, 0.25, 0.3, 0.6],
      [1.5, 1.5, 0.25, 0.25, 0.3, 0],
      [1.5, 1.5, 0.25, 0.25, 0.3, 0.3],
      [1.5, 1.5, 0.25, 0.25, 0.3, 0.6],
      [1.75, 1.5, 0.25, 0.25, 0.3, 0],
      [1.75, 1.5, 0.25, 0.25, 0.3, 0.3],
      [1.75, 1.5, 0.25, 0.25, 0.3, 0.6],
      [2, 1.5, 0.25, 0.25, 0.3, 0],
      [2, 1.5, 0.25, 0.25, 0.3, 0.3],
      [2, 1.5, 0.25, 0.25, 0.3, 0.6],
      [2, 1.5, 0.25, 0.25, 0.3, 0.9],
      [2, 1.5, 0.25, 0.25, 0.3, 1.2],
      [2.25, 1.5, 0.25, 0.25, 0.3, 0],
      [2.25, 1.5, 0.25, 0.25, 0.3, 0.3],
      [2.25, 1.5, 0.25, 0.25, 0.3, 0.6],
      [2.25, 1.5, 0.25, 0.25, 0.3, 0.9],
      [2.25, 1.5, 0.25, 0.25, 0.15, 1.2],
      [2.5, 1.5, 0.25, 0.25, 0.3, 0],
      [2.5, 1.5, 0.25, 0.25, 0.3, 0.3],
      [2.5, 1.5, 0.25, 0.25, 0.3, 0.6],
      [2.5, 1.5, 0.25, 0.25, 0.3, 0.9],
      [2.5, 1.5, 0.25, 0.25, 0.15, 1.2],
      [2.75, 1.5, 0.25, 0.25, 0.3, 0],
      [2.75, 1.5, 0.25, 0.25, 0.3, 0.3],
      [2.75, 1.5, 0.25, 0.25, 0.3, 0.6],
      [2.75, 1.5, 0.25, 0.25, 0.3, 0.9],
      [2.75, 1.5, 0.25, 0.25, 0.3, 1.2],
      [0, 1.75, 0.25, 0.25, 0.15, 0],
      [0.25, 1.75, 0.25, 0.25, 0.3, 0],
      [0.5, 1.75, 0.25, 0.25, 0.3, 0],
      [0.5, 1.75, 0.25, 0.25, 0.15, 0.3],
      [0.75, 1.75, 0.25, 0.25, 0.15, 0],
      [1, 1.75, 0.25, 0.25, 0.3, 0],
      [1, 1.75, 0.25, 0.25, 0.3, 0.3],
      [1, 1.75, 0.25, 0.25, 0.15, 0.6],
      [1.25, 1.75, 0.25, 0.25, 0.3, 0],
      [1.25, 1.75, 0.25, 0.25, 0.3, 0.3],
      [1.25, 1.75, 0.25, 0.25, 0.3, 0.6],
      [1.5, 1.75, 0.25, 0.25, 0.3, 0],
      [1.5, 1.75, 0.25, 0.25, 0.3, 0.3],
      [1.5, 1.75, 0.25, 0.25, 0.3, 0.6],
      [1.75, 1.75, 0.25, 0.25, 0.3, 0],
      [1.75, 1.75, 0.25, 0.25, 0.3, 0.3],
      [1.75, 1.75, 0.25, 0.25, 0.3, 0.6],
      [2, 1.75, 0.25, 0.25, 0.3, 0],
      [2, 1.75, 0.25, 0.25, 0.3, 0.3],
      [2, 1.75, 0.25, 0.25, 0.3, 0.6],
      [2, 1.75, 0.25, 0.25, 0.3, 0.9],
      [2, 1.75, 0.25, 0.25, 0.15, 1.2],
      [2.25, 1.75, 0.25, 0.25, 0.3, 0],
      [2.25, 1.75, 0.25, 0.25, 0.3, 0.3],
      [2.25, 1.75, 0.25, 0.25, 0.3, 0.6],
      [2.25, 1.75, 0.25, 0.25, 0.3, 0.9],
      [2.25, 1.75, 0.25, 0.25, 0.3, 1.2],
      [2.5, 1.75, 0.25, 0.25, 0.3, 0],
      [2.5, 1.75, 0.25, 0.25, 0.3, 0.3],
      [2.5, 1.75, 0.25, 0.25, 0.3, 0.6],
      [2.5, 1.75, 0.25, 0.25, 0.3, 0.9],
      [2.5, 1.75, 0.25, 0.25, 0.3, 1.2],
      [2.75, 1.75, 0.25, 0.25, 0.3, 0],
      [2.75, 1.75, 0.25, 0.25, 0.3, 0.3],
      [2.75, 1.75, 0.25, 0.25, 0.3, 0.6],
      [2.75, 1.75, 0.25, 0.25, 0.3, 0.9],
      [2.75, 1.75, 0.25, 0.25, 0.3, 1.2],
      [0, 2, 0.25, 0.25, 0.15, 0],
      [0.25, 2, 0.25, 0.25, 0.15, 0],
      [0.5, 2, 0.25, 0.25, 0.15, 0],
      [0.75, 2, 0.25, 0.25, 0.15, 0],
      [1, 2, 0.25, 0.25, 0.3, 0],
      [1, 2, 0.25, 0.25, 0.3, 0.3],
      [1.25, 2, 0.25, 0.25, 0.3, 0],
      [1.25, 2, 0.25, 0.25, 0.3, 0.3],
      [1.25, 2, 0.25, 0.25, 0.3, 0.6],
      [1.5, 2, 0.25, 0.25, 0.3, 0],
      [1.5, 2, 0.25, 0.25, 0.3, 0.3],
      [1.5, 2, 0.25, 0.25, 0.15, 0.6],
      [1.75, 2, 0.25, 0.25, 0.3, 0],
      [1.75, 2, 0.25, 0.25, 0.3, 0.3],
      [2, 2, 0.25, 0.25, 0.3, 0],
      [2, 2, 0.25, 0.25, 0.3, 0.3],
      [2, 2, 0.25, 0.25, 0.3, 0.6],
      [2, 2, 0.25, 0.25, 0.3, 0.9],
      [2.25, 2, 0.25, 0.25, 0.3, 0],
      [2.25, 2, 0.25, 0.25, 0.3, 0.3],
      [2.25, 2, 0.25, 0.25, 0.3, 0.6],
      [2.25, 2, 0.25, 0.25, 0.3, 0.9],
      [2.25, 2, 0.25, 0.25, 0.15, 1.2],
      [2.5, 2, 0.25, 0.25, 0.3, 0],
      [2.5, 2, 0.25, 0.25, 0.3, 0.3],
      [2.5, 2, 0.25, 0.25, 0.3, 0.6],
      [2.5, 2, 0.25, 0.25, 0.3, 0.9],
      [2.5, 2, 0.25, 0.25, 0.3, 1.2],
      [2.75, 2, 0.25, 0.25, 0.3, 0],
      [2.75, 2, 0.25, 0.25, 0.3, 0.3],
      [2.75, 2, 0.25, 0.25, 0.3, 0.6],
      [2.75, 2, 0.25, 0.25, 0.3, 0.9],
      [1, 1, 1, 0.25, 0.035, 0.9],
      [2.05, 1, 0.15, 0.25, 0.035, 1.2]
    ],
    cover: "assets/img/modular-o-housing/cover.jpg",
    coverVideo: "assets/img/modular-o-housing/cover-hq.mp4", // 핀 #120 (원본 portfolio-source/대표사진 영상/lh영상.mp4, 1920px)
    coverR: 1.778, // 대표사진 가로/세로 (머리 배치용)
    thumb: "assets/img/modular-o-housing/card-frame.jpg", // 카드 사진 = 대표 영상(card-loop.mp4)의 첫 장면이라 영상과 딱 맞아요
    coverCaption: "The courtyard under the bridges",
    summary:
      "Most housing is built once and torn down whole. Modular O′ treats the home as a kit: steel frames that serve two lives over 100 years, cassettes and pods changed every 15 to 30. Factory-made modules on one 4,500 grid stack into four blocks around two yards, joined by bridges at 3F and 8F. Every node is pinned and bolted, so any part can be taken apart again.",
    sections: [
      { heading: "The Loop", text: "One frame, 100 years — design, factory, road, crane, live and adapt, renew, take apart, use again.", images: [], widget: "loop", wsrc: "assets/img/modular-o-housing/loop-wheel.jpg" },
      { heading: "Assembly Sequence", text: "Twelve steps on site: piles, base, core, ground, tie plates, levels, open frames, facade, roof, plant and hand over.", images: [], seq: {"kind":"frames","r":0.872,"lite":true,"fade":true,"k":0.7,"steps":[{"src":"assets/img/modular-o-housing/assembly-01.svg","t":"Piles","s":"factory, in parallel","d":"Bored piles and ground beams under every node of the 4.5 m grid"},{"src":"assets/img/modular-o-housing/assembly-02.svg","t":"Base","s":"factory, in parallel","d":"RC plinth, cast-in plates set level on every node: the only wet work"},{"src":"assets/img/modular-o-housing/assembly-03.svg","t":"Core","s":"crane","d":"The braced core stack goes up first and takes the lateral load"},{"src":"assets/img/modular-o-housing/assembly-04.svg","t":"Ground","s":"crane","d":"Arcade frames bolt to the plates; shop modules land on pins"},{"src":"assets/img/modular-o-housing/assembly-05.svg","t":"Tie plates","s":"crane","d":"M24 bolts through the access windows; one plate ties each node"},{"src":"assets/img/modular-o-housing/assembly-06.svg","t":"Level 1","s":"crane","d":"One lift per home cell; the terrace frame comes flat-packed"},{"src":"assets/img/modular-o-housing/assembly-07.svg","t":"Level 2","s":"crane — frames and rods","d":"The stack steps back: open cells become the terraces above"},{"src":"assets/img/modular-o-housing/assembly-08.svg","t":"Open frames","s":"crane — frames and rods","d":"Greenhouse frame on the roof; X rods pinned into the open frames"},{"src":"assets/img/modular-o-housing/assembly-09.svg","t":"Facade","s":"dry trades","d":"Glazed cassettes and louvres clip on from outside, no scaffold"},{"src":"assets/img/modular-o-housing/assembly-10.svg","t":"Roof + PV","s":"dry trades","d":"Roof cassettes close the top modules; PV rows bolt to the frame"},{"src":"assets/img/modular-o-housing/assembly-11.svg","t":"Plant + serve","s":"dry trades","d":"Decks and planter trays lifted in; pods hook up to the core risers"},{"src":"assets/img/modular-o-housing/assembly-12.svg","t":"Hand over","s":"dry trades","d":"Lines sealed, linings closed, gaps fire-stopped: dry from base up"}]} },
      { big: true, // 핀 #47 크게
        heading: "Mass Study", text: "Six moves on one site: maximum volume, entrance axis, four blocks, modular cells, daylight, bridges and arcade.", images: [{src: "assets/img/modular-o-housing/axonometric-render.jpg", caption: "Axonometric view — install, live, take apart", r: 1.778}], seq: {"kind":"frames","r":1.492,"lite":true,"fade":true,"k":0.72,"steps":[{"src":"assets/img/modular-o-housing/mass-1.svg","t":"Maximum volume","s":"the largest mass the site allows"},{"src":"assets/img/modular-o-housing/mass-2.svg","t":"Entrance axis","s":"a long shared plaza opens from the entrance"},{"src":"assets/img/modular-o-housing/mass-3.svg","t":"Four blocks","s":"split for access, with shared yards on two layers"},{"src":"assets/img/modular-o-housing/mass-4.svg","t":"Modular cells","s":"infill system and factory-made frames for a shorter build, grouped in clusters"},{"src":"assets/img/modular-o-housing/mass-5.svg","t":"Daylight","s":"heights stepped so the sun reaches the yards"},{"src":"assets/img/modular-o-housing/mass-6.svg","t":"Bridges + arcade","s":"bridges between blocks, shops in a ground-floor arcade, farm yards between"}]} },
      { v: 0, // 핀 #46 #66 왼쪽 끝 세로선에 맞춰요
        al: 1.778, heading: "Kit of Parts", text: "One grid, one node, skeleton and infill, dry and reversible — eight module types that every part obeys.", images: [], pan: {"src":"assets/img/modular-o-housing/kit-strip.svg","r":23.857,"h":"11vh","solid":true,"labels":[[0.088,"V-00","Module frame","the base of every closed cell"],[5.643,"V-01","Studio cell","a whole home in one module"],[11.199,"V-02","Living cell","the wet cell of a joined home"],[16.754,"V-03","Bedroom cell","a dry cell: no pod, no kitchen"],[22.31,"V-04","Children’s room","two beds and a desk"],[27.865,"V-05","End cell","the gable is an outside wall"],[33.421,"V-06","Cluster hall","a living room for one storey"],[38.976,"V-07","Shop / café","ground floor, under the homes"],[44.532,"V-08","Community corner","the farm info centre"],[50.088,"F-00","Open frame","posts + beams, bolted on site"],[55.643,"F-01","Terrace","every home touches one"],[61.199,"F-02","Arcade","market, bikes, the doorstep"],[66.754,"F-03","Bridge","the complex crossed above the street"],[72.31,"F-04","Greenhouse / lounge","shared, in the voids"],[77.865,"F-05","Roof garden","beds rented by the season"],[83.421,"F-06","Smart-farm module","seedlings for the terraces"],[88.976,"C-01","Stair core","two flights a storey"],[94.532,"C-02","Lift core","beside each stair"]],"loop":true,"cap":"Kit of parts — eighteen modules on two frames"} },
      { heading: "Plans", text: "Four floors drawn on one frame — scroll to go up the building, one floor at a time — and the four home types the cells combine into.", images: [{src: "assets/img/modular-o-housing/unit-plans.jpg", caption: "Home types — four unit plans built from the same 4.5 m cells, people drawn faint for scale", r: 2.806, tags: [[3.6,84,"A  Studio","","b"],[3.6,88.6,"1 cell · 20 m²","","m"],[3.6,93.2,"one person, pod + kitchen","","m"],[22.25,84,"B  Two-cell home","","b"],[22.25,88.6,"2 cells · 40 m²","","m"],[22.25,93.2,"living + two kids' rooms","","m"],[40.85,84,"C  Family home","","b"],[40.85,88.6,"3 cells in an L · 61 m²","","m"],[40.85,93.2,"two bedrooms, two baths","","m"],[71.5,84,"D  Cluster hall","","b"],[71.5,88.6,"4 cells · 81 m²","","m"],[71.5,93.2,"a shared hall, one bedroom","","m"]]}], seq: {"kind":"frames","below":true,"r":1.48,"lite":true,"fade":true,"k":1.25,"legend":true,"dims":[[21.2,39.87,11.64,"31,500"],[39.87,45.33,11.64,"9,000"],[45.33,63.87,11.64,"31,500"],[63.87,69.0,11.64,"9,000"],[69.0,87.47,11.64,"31,500"],[15.29,43.41,91.47,"31,500","v"],[43.41,58.71,91.47,"18,000","v"],[58.71,86.63,91.47,"31,500","v"]],"steps":[{"src":"assets/img/modular-o-housing/plan-1.jpg","k":[["Meeting rooms","1"],["Shared offices","2"],["Toilets","3"],["Shared kitchen","4"],["Management office","5"],["Co-working hall","6"],["Lounge and café","7"],["Sunken courtyard, open to B1","8"],["Homes on the ground","9"],["Garden plaza","10"],["Core — stair and lifts","11"]],"tags":[[23.67,23.19,"1","c pt"],[31.0,25.16,"2","c pt"],[39.33,19.73,"3","c pt"],[46.67,21.21,"4","c pt"],[61.0,23.19,"5","c pt"],[52.0,37.49,"6","c pt"],[53.33,69.07,"7","c pt"],[37.33,46.37,"8","c pt"],[73.33,23.68,"9","c pt"],[78.67,51.31,"10","c pt"],[54.0,85.64,"11","c pt"]],"t":"Ground floor","s":"shops and the arcade","d":"Shops line the street under the west block; the open ground runs from the entrance into the site"},{"src":"assets/img/modular-o-housing/plan-2.jpg","k":[["Community rooms","1"],["Shared rooms","2"],["Home cells","3"],["Cluster court","4"],["Podium deck","5"],["Stepped garden","6"],["Shared greenhouse","7"],["Core — stair and lifts","8"]],"tags":[[32.0,23.19,"1","c pt"],[50.67,21.21,"2","c pt"],[46.67,18.75,"3","c pt"],[54.33,27.63,"4","c pt"],[52.0,49.33,"5","c pt"],[24.67,41.44,"6","c pt"],[78.33,29.6,"7","c pt"],[54.0,84.85,"8","c pt"]],"t":"Second floor","s":"the shared deck","d":"The first home clusters sit on the podium deck, each around its own small court"},{"src":"assets/img/modular-o-housing/plan-3.jpg","k":[["Community rooms","1"],["Roof terrace on the west wing","2"],["Shared rooms","3"],["Greenhouse court","4"],["Home clusters","5"],["Bridge over the courtyard","6"],["Courtyard below","7"],["Core — stair and lifts","8"]],"tags":[[32.0,19.73,"1","c pt"],[32.0,27.63,"2","c pt"],[50.67,21.21,"3","c pt"],[54.33,29.11,"4","c pt"],[74.0,21.71,"5","c pt"],[78.67,45.39,"6","c pt"],[78.67,51.8,"7","c pt"],[54.0,84.85,"8","c pt"]],"t":"Third floor","s":"clusters and bridges","d":"Clusters climb on the east blocks and the first bridge links them across the courtyard"},{"src":"assets/img/modular-o-housing/plan-4.jpg","k":[["Home cells","1"],["Terrace cells","2"],["Greenhouse court","3"],["Four homes around a hall","4"],["Bridge","5"],["Open courtyard","6"],["Bridge to the east blocks","7"],["Courtyard","8"],["Core — stair and lifts","9"]],"tags":[[30.0,23.68,"1","c pt"],[30.0,29.3,"2","c pt"],[54.0,28.61,"3","c pt"],[60.0,35.52,"4","c pt"],[56.0,45.19,"5","c pt"],[54.67,51.31,"6","c pt"],[66.67,56.24,"7","c pt"],[78.67,51.8,"8","c pt"],[54.0,84.85,"9","c pt"]],"t":"Typical floor","s":"four blocks, one grid","d":"Four blocks of home cells on one 4.5 m grid, tied together by bridges over the courtyard"}]} },
      { heading: "Section and Detail", text: "The section through the courtyard bridges, and one terrace beside a home cell drawn at detail scale — the kit of parts, put together.", images: [{"src":"assets/img/modular-o-housing/section-a.jpg","caption":"Section A–A — looking east, N to S: north-middle block 31,500 · courtyard 18,000 · south-middle block 31,500","r":1.614,"lead":20,"notes":[["01","Terrace cells","Open frame + planter tray"],["02","Void + shared greenhouse","Every third storey"],["03","Roof frames","Pergola / smart farm"],["04","Stacking nodes","Pin, tie plate, bolted end plates"],["05","Bridges","Open frames + rods, levels 3 and 8"],["06","Beyond","The east blocks"],["07","Bathroom pods","Cut, set into the floor zone, ducts over"],["08","Home cells","One module each, on pins"],["09","Shared rooms","Either side of every bridge and greenhouse link"],["10","Courtyard","18,000 between the blocks, open down to B1"],["11","B1 shared rooms","Transfer slab 1,000 over, B1 slab 400"],["12","B2 parking","Retaining wall 600, perimeter drain Ø200"],["13","Raft and piles","Raft 900, caps 1,600 · PHC piles Ø500 to rock"]],"tags":[[0.6,23,"10F  +29,700","","lv"],[0.6,41.3,"7F  +19,800","","lv"],[0.6,59.3,"4F  +9,900","","lv"],[0.6,77.1,"1F  ±0","","lv"],[0.6,87.6,"B1  −5,400","","lv"],[0.6,93.6,"B2  −9,000","","lv"],[7,19.4,"01","c pt"],[23.4,45,"02","c pt"],[32.8,11.7,"03","c pt"],[40.2,35.3,"04","c pt"],[50.5,32.3,"05","c pt"],[56.7,45.2,"06","c pt"],[67.9,42,"07","c pt"],[12.4,32.3,"08","c pt"],[77.4,37.9,"09","c pt"],[50.2,80.7,"10","c pt"],[15,84,"11","c pt"],[33.8,92.8,"12","c pt"],[29.9,98,"13","c pt"]]},{"src":"assets/img/modular-o-housing/detail-section.jpg","caption":"Detail section — a terrace beside a home cell","r":1.334,"lead":30,"leadGap":4.2,"notes":[["01","Terrace","Planter tray on the steel deck, soil 300"],["02","Drain","Tray outlet, pipe down through the deck"],["03","Stacking node","Pin, tie plate and bolted end plates between cells"],["04","Floor cassette","Insulated, corrugated steel deck"],["05","Services","Duct and fan coil in the zone above the ceiling"],["06","Wall panel","Insulated sandwich panel, inner lining"],["07","Home cell","Kitchen, table and bed in one 4.5 m module"],["08","Balustrade","Steel post and glass at the terrace edge"],["09","Corner post","Square hollow section, bolted at each floor"],["10","Terrace deck","Steel plate on the frame beams, falling to the tray drain"],["11","Kitchen run","Sink, hob and wall unit along the service wall"],["12","Duct sleeve","Supply and extract through the cell wall to the fan coil"],["13","Cell floor","Timber finish on an acoustic layer over the cassette"],["14","Outer wall","Insulated panel with a ribbed steel skin, east side"],["15","Built-in shelving","Storage set against the wall shared with the next cell"],["16","Terrace table","Bench and table — the terrace used as an outdoor room"]],"tags":[[28,2.2,"TERRACE CELL  4,500","c","m"],[71,2.2,"HOME CELL  4,500","c","m"],[3.2,26,"3,300","c","lv"],[3.2,68,"3,300","c","lv"],[20,43,"01","c pt"],[28.4,51,"02","c pt"],[52.2,46.3,"03","c pt"],[71.6,48.8,"04","c pt"],[65.2,13.4,"05","c pt"],[52.2,28.3,"06","c pt"],[69,39.6,"07","c pt"],[6.9,36.8,"08","c pt"],[6.9,48.8,"09","c pt"],[40,46.4,"10","c pt"],[55.3,36.5,"11","c pt"],[52.9,13.3,"12","c pt"],[80,45.4,"13","c pt"],[91.6,30,"14","c pt"],[83,70,"15","c pt"],[40,84,"16","c pt"]]}], stack: true },
      { heading: "Scenes", text: "The street, the courtyard under the bridges, the module facade and the shared rooms inside.", images: [{src: "assets/img/modular-o-housing/street.jpg", caption: "Street", r: 1.778}, {src: "assets/img/modular-o-housing/courtyard.jpg", caption: "Courtyard", r: 1.778}, {src: "assets/img/modular-o-housing/module-facade.jpg", caption: "Module facade", r: 1.778}, {src: "assets/img/modular-o-housing/bridge-view.jpg", caption: "From the bridge", r: 1.778}, {src: "assets/img/modular-o-housing/atrium.jpg", caption: "Atrium", r: 1.993}, {src: "assets/img/modular-o-housing/smart-farm.jpg", caption: "Smart farm", r: 1.778}], stack: true, scenes: true },
    ],
  },
  {
    slug: "samgakji-residential", blurb: "용산 삼각지 타운하우스",
    title: "Share ho'US'e",
    titleKo: "불협화음으로 짓는 주거 이야기",
    subtitle: "A housing story composed in dissonance — a village laid on the old parcels of a leftover triangle by Yongsan Station",
    type: "Housing",
    year: "2025",
    studio: "Design Studio 6",
    award: "A+",
    program: "공공 공동주거 · 상업가로 · 공유오피스 · 게스트하우스 · 문화시설",
    site: "서울 용산구 삼각지",
    area: "",
    team: "2인 공동작품",
    tools: "",
    pos: [4.48, -2.38],
    mass: [
      [1.122, 2.298, 0.231, 0.301, 0.125, 0, "box", -45],
      [1.306, 2.088, 0.295, 0.301, 0.192, 0, "box", -45],
      [1.876, 1.585, 0.206, 0.301, 0.235, 0, "box", -45],
      [2.071, 1.302, 0.401, 0.301, 0.114, 0, "box", -45],
      [2.707, 0.786, 0.267, 0.301, 0.226, 0, "box", -45],
      [2.707, 0.786, 0.267, 0.301, 0.066, 0.226, "gable", -45],
      [1.306, 2.736, 0.22, 0.224, 0.119, 0, "box", -45],
      [1.306, 2.736, 0.22, 0.224, 0.092, 0.119, "gable", 45],
      [1.521, 2.502, 0.236, 0.224, 0.177, 0, "box", -45],
      [1.521, 2.502, 0.236, 0.224, 0.079, 0.177, "gable", 45],
      [1.671, 2.251, 0.401, 0.224, 0.155, 0, "box", -45],
      [1.671, 2.251, 0.401, 0.224, 0.093, 0.155, "gable", -45],
      [1.991, 1.911, 0.358, 0.224, 0.253, 0, "box", -45],
      [1.991, 1.911, 0.358, 0.224, 0.105, 0.253, "gable", 45],
      [2.899, 1.062, 0.203, 0.224, 0.13, 0, "box", -45],
      [3.163, 0.887, 0.208, 0.224, 0.128, 0, "box", -45],
      [3.163, 0.887, 0.208, 0.224, 0.115, 0.128, "gable", 45],
      [1.987, 2.513, 0.216, 0.299, 0.214, 0, "box", -45],
      [1.987, 2.513, 0.216, 0.299, 0.061, 0.214, "gable", -45],
      [2.186, 2.182, 0.381, 0.299, 0.105, 0, "box", -45],
      [2.186, 2.182, 0.381, 0.299, 0.064, 0.105, "gable", 45],
      [2.523, 1.887, 0.277, 0.299, 0.242, 0, "box", -45],
      [3.075, 1.369, 0.208, 0.299, 0.209, 0, "box", -45],
      [3.319, 1.109, 0.302, 0.299, 0.263, 0, "box", -45],
      [3.319, 1.109, 0.302, 0.299, 0.098, 0.263, "gable", -45],
      [2.232, 2.715, 0.338, 0.257, 0.134, 0, "box", -45],
      [2.533, 2.445, 0.348, 0.257, 0.103, 0, "box", -45],
      [2.533, 2.445, 0.348, 0.257, 0.067, 0.103, "gable", -45],
      [2.806, 2.138, 0.398, 0.257, 0.242, 0, "box", -45],
      [3.471, 1.454, 0.362, 0.257, 0.309, 0, "box", -45],
      [3.471, 1.454, 0.362, 0.257, 0.089, 0.309, "gable", 45],
      [3.816, 1.262, 0.237, 0.257, 0.099, 0, "box", -45],
      [2.515, 3.07, 0.261, 0.311, 0.207, 0, "box", -45],
      [2.515, 3.07, 0.261, 0.311, 0.119, 0.207, "gable", -45],
      [2.716, 2.768, 0.267, 0.311, 0.25, 0, "box", -45],
      [2.716, 2.768, 0.267, 0.311, 0.065, 0.25, "gable", -45],
      [2.952, 2.576, 0.255, 0.311, 0.223, 0, "box", -45],
      [2.952, 3.189, 0.225, 0.284, 0.152, 0, "box", -45],
      [2.994, 3.252, 0.124, 0.156, 0.08, 0.152, "box", -45],
      [3.245, 3.477, 0.262, 0.321, 0.123, 0, "box", -45],
      [0.495, 2.141, 0.23, 0.326, 1.55, 0, "box", -45],
      [0.597, 1.985, 0.23, 0.192, 1.75, 0, "box", -45],
      [0.818, 1.855, 0.25, 0.288, 1.45, 0, "box", -45],
      [0.753, 2.12, 0.23, 0.288, 1.3, 0, "box", -45],
      [1.322, 1.465, 0.192, 0.307, 1.6, 0, "box", -45],
      [1.354, 1.271, 0.346, 0.154, 1.9, 0, "box", -45],
      [1.709, 1.102, 0.192, 0.288, 1.5, 0, "box", -45],
      [2.268, 0.504, 0.269, 0.288, 1.7, 0, "box", -45],
      [2.492, 0.35, 0.269, 0.23, 1.45, 0, "box", -45],
      [2.372, 0.246, 0.25, 0.154, 1.95, 0, "box", -45],
      [3.097, -0.414, 0.307, 0.346, 1.65, 0, "box", -45],
      [3.017, -0.419, 0.25, 0.058, 1.8, 0, "box", -45],
      [3.348, -0.551, 0.173, 0.307, 1.4, 0, "box", -45],
      [2.449, 0.129, 1.766, 0.998, 0.16, 0, "box", -45],
      [1.725, 1.606, 0.173, 0.787, 0.04, 0.12, "box", -45],
      [1.915, 1.416, 0.173, 0.787, 0.04, 0.12, "box", -45],
      [2.105, 1.225, 0.173, 0.787, 0.04, 0.12, "box", -45]
    ],
    cover: "assets/img/samgakji-residential/guesthouse.jpg",
    coverVideo: "assets/img/samgakji-residential/cover-hq.mp4", // 핀 #51: 작품 머리에서 바로 재생되는 고화질 영상 (원본 portfolio-source/대표사진 영상)
    thumb: "assets/img/samgakji-residential/card-frame.jpg", // 카드 사진 = 대표 영상(card-loop.mp4)의 첫 장면이라 영상과 딱 맞아요
    coverCaption: "Guesthouse on the commercial spine",
    coverR: 2.01, // 핀 #171: Tim work처럼 화면 폭 가득(위아래 조금 잘림)
    summary: "A triangular parcel left over where the railway, the main road, the army base and Yongsan Park meet. Instead of the usual apartment complex that wipes the block and turns its back, the design keeps the old parcel lines, lets the surrounding streets run on through the site, and gives each edge the program it already faces — a tower toward the high-rise west, small stacked houses toward the old lanes, and a green road through the middle that everyone may walk.",
    sections: [
      {
        big: true,
        heading: "Site — Micro",
        text: "Close up, the site sits where two cities touch. Low neighbourhood buildings on one side, new large programs on the other; ageing, low-maintenance fabric facing fresh development; a fast arterial road on one edge and the slow lanes of a dense residential quarter on the other.",
        images: []
      },
      {
        big: true,
        heading: "Site — Macro",
        text: "The triangle is a remnant: military land and the future Yongsan Park, the rail lines and their development, and the roads that cut the district apart all draw its edges. Development runs in lines from the Han River and locks together where the main roads cross; the site's own strip is held apart from its neighbours by a major road.",
        images: [],
        seq: {
          kind: "frames",
          r: 1.414,
          lite: true,
          fade: true,
          below: true,
          k: 1.25,
          steps: [
            {
              src: "assets/img/samgakji-residential/macro-1.jpg",
              t: "Boundaries",
              s: "army base and park, rail, road",
              d: "Military facilities and Yongsan Park, the rail infrastructure and the roads that disconnect the district."
            },
            {
              src: "assets/img/samgakji-residential/macro-2.jpg",
              t: "Axes",
              s: "rail and road",
              d: "Development along the rail and road axes; Yongsan Station and the subway crossing beside the site."
            },
            {
              src: "assets/img/samgakji-residential/macro-3.jpg",
              t: "Districts",
              s: "Yongnidan-gil, station, Daegu-tang alley",
              d: "A planned commercial street, the large business blocks by the station, and the post-war alley that grew with the base."
            },
            {
              src: "assets/img/samgakji-residential/macro-4.jpg",
              t: "Remnant",
              s: "a parcel isolated by its edges",
              d: "Where the four boundaries meet, the triangle is left isolated from everything around it."
            }
          ]
        }
      },
      {
        big: true,
        heading: "Site — Meso: Three Edges, Three Rhythms",
        text: "High-rise buildings, rapid rhythms and panoramic scenes on the urban side; low-rise buildings, slow rhythms and framed scenes in the neighbourhood; mid-rise and moderate between them, where a destination street begins.",
        images: []
      },
      {
        big: true,
        heading: "Concept — Accommodating Contrast",
        text: "Mixing, inflow, cycle. Rather than the aggressive approach of an apartment complex, the design accepts the context and flows around it and sets up a new village inside the boundary — and draws the foot traffic from outside into it.",
        seq: {"kind":"frames","r":1.353,"lite":true,"fade":true,"k":0.45,"steps":[{"src":"assets/img/samgakji-residential/concept-inflow.jpg","t":"Inflow","s":"the outside flows in from every edge"},{"src":"assets/img/samgakji-residential/concept-mixing.jpg","t":"Mixing","s":"new and old programs mixed along the spine"},{"src":"assets/img/samgakji-residential/concept-cycle.jpg","t":"Cycle","s":"small loops that keep people moving through"}]},
        images: [{ src: "assets/img/samgakji-residential/concept-skyline.jpg", caption: "The skyline steps from tower to village", r: 5.875 }]
      },
      {
        big: true,
        heading: "Strategy — Parcels, Mass, Site Plan",
        text: "The block is read as a whole, then parcel by parcel, and the layout follows the existing subdivision directly. Because the parcels and the block structure stay, the surrounding streets simply carry on through the site: a commercial axis, a green axis, a contrast axis and two transit axes. Heights and programs are then matched to the edges and the mass is moved step by step along the green and commercial axes, until it settles into the site plan.",
        images: [],
        seq: {
          kind: "frames",
          r: 1.414,
          lite: true,
          fade: true,
          below: true,
          cols: 7,
          k: 1.25,
          steps: [
            {
              src: "assets/img/samgakji-residential/strategy-1.jpg",
              t: "Block",
              s: "relations with the adjacent zones"
            },
            {
              src: "assets/img/samgakji-residential/strategy-2.jpg",
              t: "Parcels",
              s: "the existing parcel configuration"
            },
            {
              src: "assets/img/samgakji-residential/strategy-3.jpg",
              t: "Alignment",
              s: "the layout laid on the old division"
            },
            {
              src: "assets/img/samgakji-residential/strategy-4.jpg",
              t: "Axes",
              s: "commercial, green, contrast, transit",
              d: "With the parcels kept, the road axes extend naturally into the site and the street network stays continuous."
            },
            {
              src: "assets/img/samgakji-residential/mass-0.jpg",
              t: "Basic mass",
              s: "height and program from the edges"
            },
            {
              src: "assets/img/samgakji-residential/mass-1.jpg",
              t: "Step 01",
              s: "of seven"
            },
            {
              src: "assets/img/samgakji-residential/mass-2.jpg",
              t: "Step 02",
              s: "of seven"
            },
            {
              src: "assets/img/samgakji-residential/mass-3.jpg",
              t: "Step 03",
              s: "of seven"
            },
            {
              src: "assets/img/samgakji-residential/mass-4.jpg",
              t: "Step 04",
              s: "of seven"
            },
            {
              src: "assets/img/samgakji-residential/mass-5.jpg",
              t: "Step 05",
              s: "of seven"
            },
            {
              src: "assets/img/samgakji-residential/mass-6.jpg",
              t: "Step 06",
              s: "of seven"
            },
            {
              src: "assets/img/samgakji-residential/mass-7.jpg",
              t: "Step 07",
              s: "of seven"
            },
            { src: "assets/img/samgakji-residential/site-plan-aligned.jpg", t: "Site plan", s: "the village on the old parcel lines", d: "The village inside the triangle, with the old parcel lines still readable and the streets running through it." }
          ]
        }
      },
      {
        big: true,
        heading: "Zoning and Residence Types",
        text: "Seven quarters face the green road, each with its own identity — a commercial street that extends Yongnidan-gil, a child-friendly village, short stays along the commercial spine, a co-working quarter, an art and culture quarter, and the local shops of the everyday neighbourhood. Then the residences inside them — Type A to D, a rooftop bridge deck, and an office and share-house cluster — each lit in turn.",
        images: [],
        seq: { tag: true, 
          below: true,
          cols: 7,
          kind: "frames",
          r: 1.414,
          fade: true,
          k: 1.45,
          steps: [
            {
              src: "assets/img/samgakji-residential/zoning-0.jpg",
              t: "Zoning",
              s: "seven quarters on one block"
            },
            {
              src: "assets/img/samgakji-residential/zoning-1.jpg",
              t: "Green Road",
              s: "Yongsan Park carried into the block",
              d: "A buffer between the zones and a public pedestrian corridor through the site."
            },
            {
              src: "assets/img/samgakji-residential/zoning-2.jpg",
              t: "Commercial Street",
              s: "Yongnidan-gil extended",
              d: "The existing commercial flow continues into the site, so the local network does not break."
            },
            {
              src: "assets/img/samgakji-residential/zoning-3.jpg",
              t: "Village Town",
              s: "a child-friendly village",
              d: "Walkable, slow-traffic, watched shared courtyards for families."
            },
            {
              src: "assets/img/samgakji-residential/zoning-4.jpg",
              t: "Flexible Stay",
              s: "guesthouse and short stays",
              d: "Along the commercial spine, keeping the street busy day and night."
            },
            {
              src: "assets/img/samgakji-residential/zoning-5.jpg",
              t: "Co-working Quarter",
              s: "studios and shared offices"
            },
            {
              src: "assets/img/samgakji-residential/zoning-6.jpg",
              t: "Art & Culture Quarter",
              s: "galleries and small studios"
            },
            {
              src: "assets/img/samgakji-residential/zoning-7.jpg",
              t: "Local Community",
              s: "fine-grained shops for the neighbourhood"
            },
            {
              src: "assets/img/samgakji-residential/type-1.jpg",
              t: "Type A",
              s: "residence"
            },
            {
              src: "assets/img/samgakji-residential/type-2.jpg",
              t: "Type B",
              s: "residence"
            },
            {
              src: "assets/img/samgakji-residential/type-3.jpg",
              t: "Type C",
              s: "residence"
            },
            {
              src: "assets/img/samgakji-residential/type-4.jpg",
              t: "Type D",
              s: "residence"
            },
            {
              src: "assets/img/samgakji-residential/type-5.jpg",
              t: "Rooftop",
              s: "bridge deck"
            },
            {
              src: "assets/img/samgakji-residential/type-6.jpg",
              t: "Cluster",
              s: "office and share house"
            }
          ]
        }
      },
      {
        big: true,
        heading: "High-rise Residence",
        text: "A tall mass is set against the high residential backdrop to the west, but its elevation is read as small low-rise houses stacked up. The alleys and the stacked parts are sized in proportion to the main tower, and the spaces left between them are fitted out for the fabric each one faces.",
        images: [{ src: "assets/img/samgakji-residential/tower-elevation.jpg", caption: "From the tower down to the village", r: 3.777, w: "100%" }]
      },
      {
        big: true,
        heading: "Plans",
        text: "Three floor plans, from the village on the ground to the homes above. Scroll through the levels; each number on the plan is named and described beside it.",
        // 핀 #133: 평면 시뮬레이션 — 스크롤로 층이 바뀌고, 번호마다 옆에 공간 설명(번호·레벨 위치는 원본 .ai, 이름은 최종 패널 범례)
        fplan: {"r":1.0525,"floors":[{"t":"Plan 1","s":"Ground ±0","src":"assets/img/samgakji-residential/plan-1.jpg","items":[[1,13.79,34.27,"Open Gallery","A gallery open to the green road, so passers-by walk straight into the work."],[2,29.39,34.27,"Office Lobby","The way in to the co-working quarter."],[3,46.42,34.48,"Library Lobby","The front door of the neighbourhood library."],[4,63.45,34.27,"Lobby","A shared lobby for the homes above."],[5,83.87,31.68,"Sunken Garden","A garden dropped below the street, leading down to the car park."],[6,14.1,46.36,"Showroom","Glass showrooms that face the main road."],[7,30,46.36,"Futsal Court","A court open to the children of the village."],[8,47.03,44.31,"Library Lounge","A reading room that looks over the court."],[9,63.04,48.41,"Stand Stairs","Wide steps for sitting, watching and meeting."],[10,17.38,56.94,"Comfort Garden","A quiet garden on the +2000 deck."],[11,29.69,55.86,"In-out Office","Small offices that open straight onto the alley."],[12,27.44,71.19,"Art Deck","A raised deck for shows in the art and culture quarter."],[13,46.62,54.35,"Piloti Lounge","A shaded lounge under the lifted houses."],[14,62.32,57.7,"Cave Class","A classroom set into the ground."],[15,76.79,48.95,"Busking Plaza","A small plaza for street music by the station side."],[16,92.49,37.08,"Local F&B","Local food and drink, carried in from Yongridan-gil."]],"lv":[[12.46,57.91,"+2000"],[1.58,39.56,"+0"],[21.9,25.31,"+0"],[38.31,27.25,"+0"],[38.31,39.56,"+0"],[21.9,39.56,"+0"],[86.95,47.55,"+0"],[77.71,27.68,"+0"],[27.23,72.38,"+0"],[26,62.45,"+0"],[42.21,60.07,"+0"],[52.47,62.02,"+0"],[38.11,51.65,"+0"],[52.27,49.28,"+0"],[73.81,39.56,"+0"],[55.14,27.68,"+0"],[55.14,39.56,"+0"],[56.78,56.19,"+2000"],[45.7,60.29,"+2000"],[22.1,65.69,"+2000"],[28.87,66.34,"+2000"],[28.46,52.08,"+2000"],[20.87,55.75,"+2000"]]},{"t":"Plan 2","s":"Deck +4000","src":"assets/img/samgakji-residential/plan-2.jpg","items":[[1,13.89,34.81,"Open Gallery","The gallery continues on the upper level."],[2,29.39,34.81,"Office Lounge","A lounge shared by the co-working offices."],[3,46.52,34.81,"Library","The main library floor."],[4,64.58,34.81,"Atelier Lounge","A shared lounge for the studios."],[5,81.92,34.81,"Sunken Garden","The garden seen from above, down at −5000."],[6,14.3,46.25,"Showroom","The upper floor of the showrooms."],[7,29.28,46.25,"Meeting Room","Bookable rooms over the court."],[8,46.52,43.23,"Library Lounge","A reading lounge wrapped around the stand stairs."],[9,46.52,49.49,"Stand Stairs","The steps rise to the +4000 deck."],[10,63.45,48.41,"Comfort Garden","A garden between the stay units."],[11,77.41,48.63,"Busking Plaza","The plaza seen from the deck."],[12,14.61,56.4,"Art Deck","Exhibition decks at +2000."],[13,29.39,56.4,"Piloti Lounge","A lounge between the lifted houses."],[14,59.86,54.24,"Cave Class","The upper floor of the classrooms."],[15,26.1,71.73,"Commerce Maze","A maze of small shops along the +4000 street."],[16,47.65,68.49,"Parking","The ramp down to the underground car park."],[17,93.21,36.97,"Local F&B","Local food and drink by the east entrance."]],"lv":[[1.99,39.99,"+0"],[21.69,25.42,"+0"],[37.9,80.16,"+4000"],[46.52,45.17,"+4000"],[46.52,62.45,"+4000"],[62.53,62.45,"+4000"],[62.53,58.99,"+4000"],[34.21,59.32,"+4000"],[37.9,62.56,"+4000"],[26.41,53.92,"+4000"],[26.41,57.59,"+4000"],[21.69,62.56,"+4000"],[12.25,57.91,"+2000"],[16.15,57.05,"+2000"],[31.34,58.67,"+2000"],[29.69,52.08,"+2000"],[21.28,77.46,"+2000"],[28.67,66.34,"+2000"],[20.66,54.68,"+2000"],[25.38,78,"+0"],[27.85,71.95,"+0"],[38.31,69.47,"+0"],[38.31,52.08,"+0"],[17.59,53.81,"+0"],[12.66,53.81,"+0"],[26.21,52.08,"+0"],[21.69,39.99,"+0"],[38.31,27.79,"+0"],[38.31,39.99,"+0"],[90.23,45.39,"+0"],[76.89,27.9,"+0"],[83.67,32,"−5000"],[102.34,30.92,"+0"],[93.52,38.8,"+0"],[90.03,33.84,"+0"],[73.61,39.99,"+0"],[46.73,51.33,"+0"],[57.6,48.95,"+0"],[55.55,39.99,"+0"],[55.55,28.22,"+0"]]},{"t":"Plan 3","s":"Upper +12000","src":"assets/img/samgakji-residential/plan-3.jpg","items":[[1,13.79,34.81,"Type A Residence","A cross-shaped unit with a court in the middle."],[2,29.39,34.05,"Type B Residence","A long unit split by two open courts."],[3,44.57,35.67,"Type C Residence","A unit set around stairs and a light well."],[4,63.25,34.05,"Type D Residence","A compact unit with a round stair."],[5,13.79,46.36,"Rooftop","Shared roof terraces over the showrooms."],[6,47.45,42.91,"Bridge Deck","A planted deck that bridges the village at +12000."],[7,62.84,44.63,"Family Residence","Larger homes for families."],[8,26.72,54.57,"Office Cluster","Shared offices around a planted deck."],[9,43.55,53.27,"Residence","Small homes along the bridge deck."],[10,26.92,71.84,"Share House","Shared rooms around an open court."]],"lv":[[46.52,45.17,"+12000"],[24.56,69.68,"+12000"],[24.56,52.95,"+12000"],[1.79,39.99,"+0"],[21.28,25.74,"+0"],[21.28,39.99,"+0"],[38.31,27.47,"+0"],[8.97,79.94,"+4000"],[62.73,62.45,"+4000"],[37.9,62.45,"+4000"],[21.69,79.94,"+4000"],[8.76,62.45,"+4000"],[38.31,79.94,"+4000"],[38.31,69.25,"+0"],[38.31,56.83,"+0"],[38.31,39.99,"+0"],[85.92,47.33,"+0"],[74.43,38.91,"+0"],[76.89,27.79,"+0"],[55.55,27.79,"+0"],[55.55,39.99,"+0"]]}]},
        images: []
      },
      {
        big: true,
        heading: "Sections",
        text: "Two cuts — through the tower and the village, and across the stacked blocks and the bridge deck.",
        stack: true,
        images: [{"src":"assets/img/samgakji-residential/section-1.jpg","caption":"Section 1 — through the tower and the village","r":1.767,"lead":20,"ln":true,"tags":[[25.7,16.2,"01","c pt"],[26.8,35.3,"02","c pt"],[48.9,63.3,"03","c pt"],[41.7,68.1,"04","c pt"],[36.9,70.2,"05","c pt"],[48.6,74.1,"06","c pt"],[38.9,80.5,"07","c pt"],[6.8,82,"08","c pt"],[21.4,75.1,"±0","r","lv"],[21.4,72,"+2000","r","lv"],[21.4,68.5,"+4000","r","lv"]],"notes":[["01","Tower homes","Low-rise houses stacked into a tower"],["02","Sky lounge","A shared room hung off the tower"],["03","Village houses","Cafés below, homes above"],["04","Deck +4000","The village street on the podium roof"],["05","Shops","Two floors of shops under the deck"],["06","Stand stairs","Steps from the street up to the deck"],["07","Car park","Four levels below ground"],["08","Subway","The existing line under the street"]]}, {"src":"assets/img/samgakji-residential/section-2.jpg","caption":"Section 2 — across the stacked blocks and the bridge deck","r":1.767,"lead":20,"ln":true,"tags":[[47.8,43.2,"01","c pt"],[33.3,52.8,"02","c pt"],[55.6,57.4,"03","c pt"],[32,60.9,"04","c pt"],[13.8,67.7,"05","c pt"],[63.9,72.8,"06","c pt"],[32.1,79.5,"07","c pt"],[50,88.4,"08","c pt"],[6.7,82.7,"±0","r","lv"],[42.1,55.1,"+12000","r","lv"]],"notes":[["01","Stacked modules","Homes lifted on a frame"],["02","Bridge floor","A shared floor across the tower"],["03","Bridge Deck","A planted deck joining the blocks"],["04","Shared floors","Lounges and kitchens in the middle"],["05","Homes","Units on both sides of the core"],["06","Family homes","Larger units under the deck"],["07","Lobbies and shops","Street level under each block"],["08","Car park","Below the whole village"]]}]
      },
      {
        big: true,
        heading: "Scenes",
        text: "The green road at night and in snow, the alleys and the commercial street, the guesthouse, the office bridge and the houses.",
        stack: true,
        scenes: true,
        images: [
          {
            src: "assets/img/samgakji-residential/residence.jpg",
            caption: "Residence",
            r: 1.463
          },
          {
            src: "assets/img/samgakji-residential/residence-2.jpg",
            caption: "Residence — the village in snow",
            r: 1.5
          },
          {
            src: "assets/img/samgakji-residential/alley.jpg",
            caption: "Alley",
            r: 1.502
          },
          {
            src: "assets/img/samgakji-residential/commercial-street.jpg",
            caption: "Commercial street",
            r: 1.502
          },
          {
            src: "assets/img/samgakji-residential/green-road.jpg",
            caption: "The Green Road — Yongsan Park carried into the block",
            r: 1.502
          },
          {
            src: "assets/img/samgakji-residential/commercial-corner.jpg",
            caption: "Commercial corner",
            r: 1.502
          },
          {
            src: "assets/img/samgakji-residential/office.jpg",
            caption: "Office bridge",
            r: 1.502
          }
        ]
      }
    ],
    drawings: []
  },
  // ---- 자료 준비 중 (CV의 수상·스튜디오 기록만 있어요. 자료를 받으면 채워요) ----
  {
    "slug": "the-tree-house", "blurb": "강원도 인제군 The tree house",
    "title": "Blooming",
    "titleKo": "블루밍 — 자작나무 숲의 트리하우스 키트",
    "subtitle": "Blooming — a tree house kit that hangs on a living birch and opens like a flower",
    "type": "Pavilion",
    "year": "2024",
    "studio": "Volume Zero 국제공모",
    "award": "",
    "program": "트리하우스 모듈 키트 · 일곱 방의 숲속 마을",
    "site": "강원 인제, 소양호 옆 자작나무 숲",
    "area": "모듈 3.6 × 2.4 m · 방 6.2 m² + 잎 데크",
    "team": "3인 공동작품", // 핀 #182
    "tools": "",
    // 핀 #178·#179: 대표사진(상세 머리) = 호숫가 새벽 렌더, studio 카드 = 숲속 아이들 렌더 (예전 대표: village-section.jpg)
    "cover": "assets/img/the-tree-house/cover.jpg",
    "coverFull": true, // 핀 #215: 영상 대신 대표 사진이 첫 화면을 꽉 채워요 (예전 cover-film.mp4는 핀 #215로 뺌)
    "thumb": "assets/img/the-tree-house/card.jpg",
    "coverCaption": "Morning on the Soyang lake — a bloomed room on its birch, curtains open to the water",
    "coverR": 1.2217,
    "summary": "A 3.6 × 2.4 m room hung on one living birch. Nothing stands on the ground: a split steel sleeve wraps the trunk, three tree bolts carry the whole room, and a helical flight lets the room climb its own tree, one turn per level. Every wall is a leaf on a hinge — a wall, an awning, a deck, a bridge, a stair or a ramp — so a few rooms on neighbouring trees join into a village without felling a tree or cutting a branch.",
    "sections": [
      {
        "big": true,
        "heading": "The Bloom Kit",
        "text": "One module threaded on its host tree — 26 coded parts in four families: tree and column, core, leaves and joints. A split steel sleeve hangs from three tree bolts; a helical flight on the sleeve carries the room through a climbing collar. Every wall is a leaf on a hinge. Scroll to name the parts, family by family.",
        "images": [],
        "seq": {
          "kind": "lead",
          "src": "assets/img/the-tree-house/bloom-kit-bare.jpg",
          "r": 1.169,
          "n": 10,
          "steps": [
            {
              "t": "Tree + column",
              "s": "bolts, crown, sleeve, flight, rail, spacers"
            },
            {
              "t": "Core",
              "s": "collar, cassettes, skin, columns, masts"
            },
            {
              "t": "Leaves",
              "s": "petal, flap, stair sleeve, treads"
            },
            {
              "t": "Joints",
              "s": "hinge, winch, seals"
            }
          ],
          "L": [
            [
              "l",
              4.34,
              46.44,
              "Host tree",
              0
            ],
            [
              "r",
              16.44,
              48.84,
              "Tree attachment bolts",
              0
            ],
            [
              "l",
              17.36,
              45.09,
              "Hanger crown + rods",
              0
            ],
            [
              "l",
              48,
              46.57,
              "Growth spacers",
              0
            ],
            [
              "r",
              50.37,
              47.72,
              "Main column",
              0
            ],
            [
              "r",
              52.93,
              46.33,
              "Guide rail",
              0
            ],
            [
              "r",
              63.21,
              48.62,
              "Helical flight",
              0
            ],
            [
              "l",
              27.35,
              44.39,
              "Guide ring",
              1
            ],
            [
              "l",
              33.07,
              37.7,
              "Corrugated roofing",
              1
            ],
            [
              "r",
              42.65,
              52.56,
              "Roof CLT",
              1
            ],
            [
              "r",
              45.23,
              53.65,
              "Roof cassette",
              1
            ],
            [
              "r",
              47.8,
              53.01,
              "Corner mast",
              1
            ],
            [
              "r",
              55.5,
              58.56,
              "Climate skin",
              1
            ],
            [
              "r",
              58.06,
              52.69,
              "Auxiliary column",
              1
            ],
            [
              "l",
              72.33,
              38.64,
              "Larch floorboards",
              1
            ],
            [
              "l",
              77.53,
              34.88,
              "Floor CLT",
              1
            ],
            [
              "l",
              81.03,
              35.03,
              "Floor cassette",
              1
            ],
            [
              "l",
              87.66,
              43.96,
              "Climbing collar",
              1
            ],
            [
              "l",
              50.6,
              31.88,
              "Flap leaf",
              2
            ],
            [
              "l",
              65.57,
              31.88,
              "Petal leaf",
              2
            ],
            [
              "r",
              65.79,
              66.17,
              "Stair leaf - sleeve A",
              2
            ],
            [
              "r",
              70.99,
              72.66,
              "Tread carriage B",
              2
            ],
            [
              "r",
              60.63,
              52.43,
              "EPDM corner seal",
              3
            ],
            [
              "r",
              68.39,
              52.63,
              "Crank winch",
              3
            ],
            [
              "l",
              69.73,
              31.49,
              "Leaf hinge",
              3
            ],
            [
              "l",
              74.93,
              44.99,
              "Brush seal ring",
              3
            ]
          ]
        }
      },
      {
        "heading": "Four Joints",
        "text": "Hang, climb, hinge, slide. Three TAB bolts carry a crown ring; a triple-start flight and six roller pairs lift the room; barrel hinges sit flush with the deck; the tread carriage rolls in stainless U-channels and cannot lift or drop out.",
        "images": [
          {
            "src": "assets/img/the-tree-house/bloom-joints.jpg",
            "caption": "Hang 1:30 · Climb 1:35 · Hinge 1:15 · Slide 1:10",
            "r": 3.882
          }
        ]
      },
      {
        "big": true,
        "heading": "One Leaf, Six Roles",
        "text": "The same 1,800 mm leaf is the module's wall and its way out. Hinged at floor and roof level and hung from the corner masts on stainless stays like a drawbridge, it needs nothing below it — the room hangs on its tree. Scroll to turn the leaf.",
        "images": [],
        "seq": {
          "kind": "frames",
          "below": true,
          "r": 1.984,
          "lite": true,
          "fade": true,
          "k": 1.1,
          "steps": [
            {
              "src": "assets/img/the-tree-house/leaf-1.jpg",
              "t": "Wall",
              "s": "leaf 90° · flap −90°",
              "d": "Both leaves close outside the climate skin: a vented larch rain-screen and storm shutter. Night, winter, away."
            },
            {
              "src": "assets/img/the-tree-house/leaf-2.jpg",
              "t": "Awning",
              "s": "flap leaf −45° on two stays",
              "d": "The upper leaf swings out on two stainless stays: shade, rain cover and a vent above the wall. Shade depth 424."
            },
            {
              "src": "assets/img/the-tree-house/leaf-3.jpg",
              "t": "Deck + flap",
              "s": "leaf 0° · 2 stays",
              "d": "The lower leaf drops like a drawbridge; a crank winch pays out its two stays. One person, two minutes — room 8 m² plus deck 6 m²."
            },
            {
              "src": "assets/img/the-tree-house/leaf-4.jpg",
              "t": "Bridge",
              "s": "carriage slides 1,800",
              "d": "The tread carriage slides out of the sleeve and hooks onto the neighbour's floor edge: hung at both ends, a clear reach of 3,600."
            },
            {
              "src": "assets/img/the-tree-house/leaf-5.jpg",
              "t": "Stair",
              "s": "carriage tilts 34.5°",
              "d": "The carriage pivots at the sleeve tip; link bars keep six treads level. One turn of the flight is one flight of stairs."
            },
            {
              "src": "assets/img/the-tree-house/leaf-6.jpg",
              "t": "Ramp",
              "s": "sleeve −10.9°",
              "d": "Sleeve and carriage align and the treads lock as cleats — 680 over 3,535, 1:5.2, to a neighbour two thirds of a turn lower."
            }
          ]
        }
      },
      {
        "heading": "Six Joints",
        "text": "The room hangs from three bolts in one tree, climbs that tree on its own sleeve, and lowers, extends and docks its leaves by hand. Every moving joint is pinned, visible and replaceable; every docking joint leaves the two trees free to sway.",
        "images": [],
        "keyed": {"key":{"src":"assets/img/the-tree-house/joints-key.jpg","r":0.855,"caption":"Key — south deck open, east leaf docked to a neighbour"},"items":[{"src":"assets/img/the-tree-house/joint-1.jpg","r":0.742,"t":"Hang","x":34.8,"y":39.5},{"src":"assets/img/the-tree-house/joint-2.jpg","r":0.742,"t":"Climb","x":38,"y":81},{"src":"assets/img/the-tree-house/joint-3.jpg","r":0.742,"t":"Hinge","x":21.1,"y":77.3},{"src":"assets/img/the-tree-house/joint-4.jpg","r":0.742,"t":"Drawbridge","x":45.4,"y":55.9},{"src":"assets/img/the-tree-house/joint-5.jpg","r":0.742,"t":"Tread carriage","x":65.5,"y":89.3},{"src":"assets/img/the-tree-house/joint-6.jpg","r":0.742,"t":"Docking latch","x":87.1,"y":91.3}]}
      },
      {
        "big": true,
        "heading": "Detailed Plan",
        "text": "Every wall is a leaf, so the plan changes with the day. Closed, a leaf is a 125 wall; down, the south petal makes a 6 m² terrace and the east stair leaf a landing that can slide on as a bridge. The trunk passes through a 900 opening — the flight round it carries the whole room.",
        "cols": 2,
        "cw": [
          1.212,
          0.55
        ],
        "images": [
          {
            "src": "assets/img/the-tree-house/plan.jpg",
            "caption": "Plan 1:25 at FL +1,100 — south petal and east stair leaf down",
            "r": 1.212
          },
          {
            "src": "assets/img/the-tree-house/plan-states.jpg",
            "caption": "One plan, four states — closed, terrace, terrace and landing, bridge",
            "r": 1.151
          }
        ]
      },
      {
        "big": true,
        "heading": "Growth",
        "text": "One grove by the Soyang, four stages — every module added on its own tree, every join chosen from the grammar.",
        "images": [],
        "seq": {
          "kind": "frames",
          "below": true,
          "r": 1.317,
          "lite": true,
          "fade": true,
          "k": 0.9,
          "steps": [
            {
              "src": "assets/img/the-tree-house/growth-1.jpg",
              "t": "Hut",
              "s": "1 module · 8 m² · deck 6 m²",
              "d": "One room on one tree, deck to the south."
            },
            {
              "src": "assets/img/the-tree-house/growth-2.jpg",
              "t": "Pair",
              "s": "2 modules · shared terrace",
              "d": "A second tree 6 m north: the two petals meet as a terrace of 12 m²."
            },
            {
              "src": "assets/img/the-tree-house/growth-3.jpg",
              "t": "Camp",
              "s": "4 modules · 7.1 m in the air",
              "d": "East across the slope: a bridge and a ramp, two levels."
            },
            {
              "src": "assets/img/the-tree-house/growth-4.jpg",
              "t": "Village",
              "s": "6 modules · 10.4 m in the air",
              "d": "Down to the river edge: a stair and a second terrace, three levels."
            }
          ]
        }
      },
      {
        "big": true,
        "heading": "Cluster Grammar",
        "text": "Each module hangs on its own tree, so neighbours are set by the forest, not by a grid. The leaves absorb the difference: heights are counted in turns of the flight — level for a bridge or terrace, two thirds of a turn for a ramp, one full turn for a stair.",
        "images": [
          {
            "src": "assets/img/the-tree-house/grammar.jpg",
            "caption": "Shared terrace · bridge · ramp · stair — the same three modules joined four ways",
            "r": 3.194
          }
        ]
      },
      {
        "big": true,
        "heading": "Assembly and Climb",
        "text": "Six days, no crane, no foundation. Nothing touches the forest floor but the tracks of a 2.5 t spider lift on ground mats; the house is put together at the lowest stop of its own screw, 4 m up, then winds itself one level higher. The same steps run backwards when the tree has grown into the sleeve.",
        "images": [],
        "seq": {
          "kind": "frames",
          "r": 0.615,
          "lite": true,
          "fade": true,
          "k": 0.62,
          "steps": [
            {
              "src": "assets/img/the-tree-house/assembly-1.jpg",
              "t": "Survey",
              "s": "day 0 · arborist",
              "d": "Ø ≥ 400 at 1.3 m, lean ≤ 1.3°, clear stem to 9.3 m, live crown ≥ 40 % and a sound resistograph trace where the bolts go."
            },
            {
              "src": "assets/img/the-tree-house/assembly-2.jpg",
              "t": "Hang",
              "s": "day 1 · 2 + lift",
              "d": "Three Ø38 tree bolts at 120°, 9.15 m up. The crown ring sits on their bosses — the only contact between house and tree."
            },
            {
              "src": "assets/img/the-tree-house/assembly-3.jpg",
              "t": "Sleeve",
              "s": "day 2 · 3 + lift",
              "d": "Six half-shells are hoisted from the crown ring and bolted round the trunk; growth jacks centre the sleeve with 100 mm to spare."
            },
            {
              "src": "assets/img/the-tree-house/assembly-4.jpg",
              "t": "Collar + floor",
              "s": "day 3 · 3 + lift",
              "d": "The collar closes round the flight at its lowest stop; four floor panels are hung in and bolted to its slewing ring."
            },
            {
              "src": "assets/img/the-tree-house/assembly-5.jpg",
              "t": "Room",
              "s": "day 4–5 · 3",
              "d": "Posts, skin frames and the roof go up from the floor. The roof's guide ring keys into the rail: the room can rise but never turn."
            },
            {
              "src": "assets/img/the-tree-house/assembly-6.jpg",
              "t": "Leaves + climb",
              "s": "day 6 · 2",
              "d": "Leaves hinged and tested, a drill on the worm shaft winds the whole room one level up — 600 turns, about two minutes."
            }
          ]
        }
      },
      {
        "heading": "Four Stops and Room to Grow",
        "text": "Flights 340 mm apart let the room stop at four heights, and a lock pin finds one every third of a turn. The sleeve leaves the trunk 100 mm all round; every autumn the jacks are backed off as the birch thickens, and after about twenty years the kit moves on and the tree heals.",
        "images": [
          {
            "sim": "stops",
            "src": "",
            "caption": "Four stops — elevation 1:200, the room steps down 340 mm at a time",
            "r": 0.95
          },
          {
            "sim": "grow",
            "src": "",
            "caption": "Room to grow — plan 1:20, twenty years of the birch in fourteen seconds",
            "r": 0.95
          }
        ]
      },
      {
        "heading": "Sun Path and the Year",
        "text": "Month by month, what the sun, the birch and the weather do — and what the leaves do back.",
        "images": [
          {
            "src": "assets/img/the-tree-house/sun-year.jpg",
            "caption": "Sun path at 38.07° N · the year, leaf by leaf",
            "r": 4.36,
            "sun": true
          }
        ]
      },
      {
        "big": true,
        "heading": "A Day in the Village",
        "text": "A long section through the seven-room village on a hummocky floor that falls to the Soyang lake. Seven rooms over 4.08 m on four hosts 5.2 to 6.0 m apart: G hangs highest and both its leaves drop as steep ladders onto A's and C's decks; C's east leaf climbs on to E by the water.",
        "images": [
          {
            "src": "assets/img/the-tree-house/village-section.jpg",
            "caption": "Long section A–A, looking north — eight scenes of one day",
            "r": 1.858
          },
          {
            "src": "assets/img/the-tree-house/village-day.jpg",
            "caption": "The day, leaf by leaf — 21 June, what each leaf of the seven rooms is doing hour by hour",
            "r": 5.208
          }
        ],
        "stack": true
      },
    ],
    "drawings": []
  },
  {
    slug: "smart-pixel", blurb: "귀갓길을 밝히는 빛 기둥",
    title: "SMART PIXEL",
    titleKo: "대림2동 귀갓길의 빛 기둥",
    subtitle: "One lit column on a 2.5 m grid — a gate, a colonnade and a pavilion for the walk home in Daerim 2-dong",
    type: "Urban",
    year: "2023",
    studio: "Teraviva 국제공모 · Tactical Urbanism",
    award: "",
    program: "골목 조명 키트 · 게이트, 회랑, 정자",
    site: "서울 영등포구 대림2동",
    area: "",
    team: "2인 공동작품",
    tools: "",
    pos: [-0.28, -1.26],
    mass: [
      [-0.01, -0.01, 0.07, 0.07, 0.33, 0, "cyl"],
      [0.34, -0.01, 0.07, 0.07, 0.33, 0, "cyl"],
      [0.69, -0.01, 0.07, 0.07, 0.33, 0, "cyl"],
      [1.04, -0.01, 0.07, 0.07, 0.33, 0, "cyl"],
      [1.39, -0.01, 0.07, 0.07, 0.33, 0, "cyl"],
      [-0.01, 0.75, 0.07, 0.07, 0.33, 0, "cyl"],
      [0.34, 0.75, 0.07, 0.07, 0.33, 0, "cyl"],
      [0.69, 0.75, 0.07, 0.07, 0.33, 0, "cyl"],
      [1.04, 0.75, 0.07, 0.07, 0.33, 0, "cyl"],
      [1.39, 0.75, 0.07, 0.07, 0.33, 0, "cyl"],
      [0, -0.05, 1.45, 0.2, 0.02, 0.33],
      [0, 0.66, 1.45, 0.2, 0.02, 0.33],
      [1.84, -0.01, 0.07, 0.07, 0.69, 0, "cyl"],
      [2.19, -0.01, 0.07, 0.07, 0.69, 0, "cyl"],
      [2.54, -0.01, 0.07, 0.07, 0.69, 0, "cyl"],
      [1.84, 0.34, 0.07, 0.07, 0.69, 0, "cyl"],
      [2.54, 0.34, 0.07, 0.07, 0.69, 0, "cyl"],
      [1.84, 0.69, 0.07, 0.07, 0.69, 0, "cyl"],
      [2.19, 0.69, 0.07, 0.07, 0.69, 0, "cyl"],
      [2.54, 0.69, 0.07, 0.07, 0.69, 0, "cyl"],
      [1.85, 0, 0.75, 0.75, 0.02, 0.34],
      [1.85, 0, 0.75, 0.75, 0.02, 0.69],
      [0.29, 1.34, 0.07, 0.07, 0.69, 0, "cyl"],
      [0.78, 1.34, 0.07, 0.07, 0.69, 0, "cyl"],
      [0.3, 1.33, 0.54, 0.09, 0.03, 0.66]
    ],
    cover: "assets/img/smart-pixel/cover-lane.jpg",
    coverR: 0.914, // 대표사진 가로/세로 (머리 배치용)
    coverCaption: "Eleven gates, seven lit lanes, one corridor, three rooms — one walk home from Daerim station",
    summary: "Daerim 2-dong has deep lanes that open straight into the dark, a market street edged by patchwork awnings, and corners that are left over. SMART PIXEL does not add lamps to them. It adds three of the oldest pieces of architecture, rebuilt from one lit column on a 2.5 m grid: a gate you pass through, a colonnade you walk along, a pavilion you stay in. Light is switched on only by the people who are there, and every piece bolts on and lifts out again.",
    sections: [
      {
        heading: "Site — Why Daerim 2-dong",
        text: "The kit is not spread over the city. It goes where many people walk home through deep, unlit alleys, and where the neighbourhood already lives outdoors at night. Six readings of the same 1 km frame decide where: 45,000 residents, 80 % of 16.6 km of streets are lanes, 177 of 400 walks home share one street, 64 % of street length lies over 40 m from a main road — and 316 of the 400 routes pass the frame.",
        images: [], seq: {"kind":"frames","below":true,"r":0.83,"k":1.05,"fade":true,"steps":[{"src":"assets/img/smart-pixel/site-1-location.jpg","t":"Location","s":"Korea's most concentrated ethnic enclave"},{"src":"assets/img/smart-pixel/site-2-fabric.jpg","t":"Fabric","s":"80 % of 16.6 km of streets are lanes"},{"src":"assets/img/smart-pixel/site-3-walk-home.jpg","t":"Walk home","s":"177 of 400 routes share one street"},{"src":"assets/img/smart-pixel/site-4-depth.jpg","t":"Depth","s":"64 % of street length is over 40 m deep"},{"src":"assets/img/smart-pixel/site-5-already-there.jpg","t":"Already there","s":"cameras, lamps, two safe routes"},{"src":"assets/img/smart-pixel/site-6-where.jpg","t":"Where the frame goes","s":"316 of 400 routes pass it"}]}
      },
      {
        heading: "Threshold, Colonnade, Pavilion", big: true, // 핀 #100: 그림 위 글자가 읽히게 넓게
        text: "Each old type is read for what it does to the ground, not for how it looks. The gate (Hongsalmun) marks where a lane begins; the market colonnade (Sijeon haengnang) thickens an edge into a room; the raised pavilion (nu) lifts the ground twice. The frame keeps the act, drops the ornament and the wall, and adds what the type never had after dark: light that answers.",
        stack: true,
        images: [
          {"src":"assets/img/smart-pixel/type-threshold.jpg","caption":"01 Threshold — pass through: ×11 at the mouths of deep lanes, 3.5 m between the piers","r":4.307,"tags":[[35.17,5.36,"5.0","",""],[33.22,10.69,"deep lane","","m"],[80.8,19.07,"lane walls","","m"],[89.88,24.82,"portal 3.5 × 2.5 × 4.96 m\nlit from the head","","nl w1"],[59,23.94,"lane 5.0","",""],[16.03,41.14,"arrow bars\non two beams","","nl w1"],[64.79,48.18,"head lit, cone ±34°;\nupper tier held at 20 %","","nl w1"],[26.55,56.78,"pavement","","m"],[16.03,64.25,"no wall,\nnothing closes","","nl w1"],[58.9,63.12,"3.3 clear","",""],[34.7,70.48,"3.5 c/c","",""],[63.93,73.59,"4.96","",""],[81.21,74.93,"pass through","","w"],[42.28,77.68,"street","","m"],[25.34,91.7,"bench, lane name,\nSOS button","","nl w1"],[38.41,91.7,"threshold 3.5 × 2.5 m,\n100 % while someone passes","","nl w1"]],"notes":[["01","Hongsalmun, red-arrow gate","Two posts and two beams before a shrine, tomb or school. No wall: it closes nothing, it marks where the inside begins."],["02","Plan: a line across the lane mouth","The frame stands on the pavement, 0.75 m in from the walls; its 3.5 × 2.5 m threshold is the brightest spot of the lane."],["03","Elevation from the pavement","The head frames the lane and keeps 3.3 m clear for deliveries and fire access; a seat waits at the door."],["04","A portal you cross, not enter","The lit volume is the doorway the lane never had: two piers, one head, no door."]]},
          {"src":"assets/img/smart-pixel/type-colonnade.jpg","caption":"02 Colonnade — walk along: 335 m along the market street, two aisles and a nave open to the sky","r":4.695,"tags":[[77.41,7.66,"shopfront","","m"],[25.72,12.32,"shops","","i"],[82.29,20.42,"open to the sky","","w"],[57.87,20.97,"open to the sky","","w"],[47.82,25.12,"1.25","",""],[47.82,32.42,"1.25","",""],[28.76,32.47,"aisle","","m"],[32.64,43.04,"nave, open to the sky","","w"],[47.82,44.82,"3.0","",""],[32.83,47.08,"fire access, deliveries","","m"],[54.44,52.2,"lintel light ±34°\n31 lx on the walk","","nl w1"],[83.73,51.9,"nave","","w"],[47.82,57.25,"1.25","",""],[71.91,57.55,"shopfront","","m"],[41.2,57.59,"aisle","","m"],[60.53,59.9,"roof panel, louvred","","w"],[61,63.49,"2 % fall outwards","","m"],[47.82,64.56,"1.25","",""],[78.52,68.7,"walk along","","w"],[89.24,71.93,"aisle under the roof\n2.5 m, lit from above","","nl w1"],[25.72,78.33,"shops","","i"],[6.42,91.87,"kan","c",""],[9.56,91.87,"kan","c",""],[12.69,91.87,"kan","c",""],[15.83,91.87,"kan","c",""],[50.97,92.97,"shop","",""],[54.67,92.97,"2.5 aisle","",""],[58.92,92.97,"3.0 nave","",""],[63.22,92.97,"2.5 aisle","",""],[67.77,92.97,"shop","",""]],"notes":[["01","Sijeon haengnang, Jongno","From 1412 the state built the market a long row of identical bays (kan); the merchants filled them."],["02","Plan: an edge thickened into aisles","Columns every 2.5 m in two rows; roofs over the stalls and the walkway, 3.0 m left open down the middle."],["03","Cross-section: aisle, nave, aisle","The roofs cover the stalls and the walk; the nave stays open to the sky for fire access and deliveries."],["04","A hall made of a street","Two lit aisles to walk along, one nave to look up from. Ten metres drawn; 335 m built."]]},
          {"src":"assets/img/smart-pixel/type-pavilion.jpg","caption":"03 Pavilion — stay in: ×3 on public land at route nodes, 2 × 2 cells over two tiers","r":4.317,"tags":[[42.4,7.86,"lane","","m"],[34,25.83,"pocket park","","m"],[90.44,25.98,"lantern 5.0 × 2.5 × 2.4 m","","w"],[64.95,41.98,"1.2 m guard on\nthe open edges","","nl w1"],[69.25,43.2,"house","","m"],[25.82,49.49,"lane","","m"],[56.03,49.9,"lantern: grating floor, lit screen","",""],[18.28,63.13,"a room to\nlook out from","","nl w1"],[88.51,62.4,"shade 5.0 × 5.0 × 2.56 m","","w"],[66,66.85,"2.40","",""],[54.5,68.05,"stair","","m"],[31.31,68.05,"up","","m"],[79.98,74.92,"stay in","","w"],[66,77.55,"2.56","",""],[18.28,79.25,"shade and\na path below","","nl w1"],[36.49,90.05,"lane","","m"],[58.8,93.57,"2.5","c",""],[61.12,93.57,"2.5","c",""]],"notes":[["01","Nu, raised pavilion","A floor lifted on posts, open on every side: shade and a path below, a room to look out from above."],["02","Plan: a roof on a left-over corner","2 × 2 cells where three lanes meet; the lantern upstairs is in view from each of them."],["03","Section: shade below, lantern above","A table under the first tier; upstairs a grating floor, a 1.2 m guard and the lit mesh screen."],["04","A room that is also a lamp","5.0 × 5.0 m of shade under 5.0 × 2.5 m of light, open on every side, closed by nothing."]]},
          {
            src: "assets/img/smart-pixel/type-abstraction.jpg",
            caption: "Keep the act, drop the form — mark, thicken, lift",
            r: 5.805
          }
        ]
      },
      {
        // 핀 #102: 엑소노를 키 그림으로 크게 고정, 상세 렌즈 a·b·c가 차례로 올라오고 빨간 지시선이 이어져요 (원본 03_frame.ai, 글자·번호 원·지시선 없이)
        "heading":"One Frame, Three Gestures","text":"The light column becomes architecture when it is joined. A lintel on two heads makes a gate; a row of gates under roof panels makes a corridor; a second tier on four cells makes a room. Same parts, same 2.5 m grid, all bolted, all removable — ten part types, about 2,300 pieces, nothing made for one place only.","images":[],"keyed":{"key":{"src":"assets/img/smart-pixel/frame-key.jpg","r":0.683,"caption":"The Pixel Frame — one 2.5 m cell, exploded in assembly order"},"items":[{"src":"assets/img/smart-pixel/lens-a.jpg","r":1,"t":"Head node and lintel joint","d":"Lintels slide over the arms, 2 × M12 each end; driver, board and cover lift out of the top.","x":83.3,"y":48.1,"notes":[["1","2 × M12 × 40"],["2","Lintel 100 × 160, LED + opal lens"],["3","Cover ø170, 4 × M6 pin-Torx"],["4","Gasket, EPDM"],["5","Controller + Bluetooth LE 5"],["6","Driver 30 W, 24 V"],["7","Arm 92 × 152, M12 bosses"],["8","Radar 24 GHz"]]},{"src":"assets/img/smart-pixel/lens-b.jpg","r":1,"t":"Light column","d":"Core, two LED lines, opal diffuser and mask; the diffuser slides off once the head is off.","x":64.8,"y":72.2,"notes":[["1","Mask, 180°"],["2","End ring"],["3","Spigot ø93, 2 × M8"],["4","Core ø101.6 × 4"],["5","Diffuser ø150, PC opal"],["6","LED 24 V, two lines"]]},{"src":"assets/img/smart-pixel/lens-c.jpg","r":1,"t":"Ground connection","d":"Plug, collar and lock pin on the cast-in sleeve; the socket stays when the pixel leaves.","x":64.8,"y":86.5,"notes":[["1","Lock pin M12 × 110"],["2","Collar ø170, hatch, QR"],["3","Plug IP68, 3-pole"],["4","Paving 200 × 100"],["5","Sleeve ø114.3"],["6","Socket shaft ø300"]]}]}
      },
      {
        heading: "Point, Line, Volume", big: true, cols: 3, // 핀 #153: 세 장면을 한 줄에
        text: "One column becomes a gate frame, a gate, a corridor and a room — scroll through the steps. The same ten standard parts, about 2,300 pieces in all, are counted for the Daerim 2-dong pilot: 620 sockets, 682 columns, 656 lintels, 280 roof panels. Below, the three gestures drawn at the same scale on a 12 × 12 m plot.",
        // 핀 #140: 다섯 단계 시뮬레이션 + 세 장면을 따로 크게(원본 03_frame.ai, 글자·지시선 없이), 치수·설명은 사이트 글자
        seq: {"kind":"frames","fade":true,"r":0.9381,"k":0.9,"steps":[{"src":"assets/img/smart-pixel/plv-1.jpg","t":"Column","s":"one pixel","d":"A socket set in the paving, one lit column, a head node on top — the smallest piece of the kit, on a 2.5 m grid.","k":[["In the pilot","682 columns"],["Sockets","620"]],"tags":[[3,5,"Point","","w"]]},{"src":"assets/img/smart-pixel/plv-2.jpg","t":"Gate frame","s":"+ lintel","d":"A lintel slides over two head nodes and two columns become a frame. 3.5 m across a gate, 2.5 m everywhere else.","k":[["Lintels","656"]],"tags":[[3,5,"Line","","w"]]},{"src":"assets/img/smart-pixel/plv-3.jpg","t":"Gate","s":"+ second tier","d":"A second tier stands on the head nodes: a portal 4.96 m high at the mouth of a deep lane.","k":[["Gates","11"],["Each","4 sockets · 8 columns · 6 lintels"]],"tags":[[3,5,"Line","","w"]]},{"src":"assets/img/smart-pixel/plv-4.jpg","t":"Corridor","s":"+ roof panels","d":"Two rows of frames carry roof panels over the stalls: 335 m along the market street. Seven lane lines (662 m) use the same frame without a roof.","k":[["Sockets · columns","270 · 270"],["Lintels · roof panels","268 · 268"]],"tags":[[3,5,"Line","","w"]]},{"src":"assets/img/smart-pixel/plv-5.jpg","t":"Room","s":"2 × 2 cells × 2 tiers","d":"Four cells on two tiers, with a grating floor, a mesh screen and guards: a small temporary building at a route node.","k":[["Rooms","3"],["Each","9 sockets · 15 columns · 19 lintels · 4 roof panels"],["Gratings · mesh · guards","2 · 2 · 4"]],"tags":[[3,5,"Volume","","w"]]}]},
        images: [{"src":"assets/img/smart-pixel/gesture-gate.jpg","r":1.0787,"tags":[[57.5,70.6,"4.96 m","",""],[36.5,79.3,"3.5 m c/c","",""],[48.3,86.7,"street","","m"]],"notes":[["01","Gate","Two piers on the pavement, 0.75 m in from the lane walls, joined at 4.96 m. Keeps 3.3 m clear for deliveries and fire access; carries the lane name, a bench and an SOS button."]]},{"src":"assets/img/smart-pixel/gesture-corr.jpg","r":1.0787,"tags":[[97.3,78.7,"3.0 m open to the sky","r",""],[15.4,81.6,"2.5 m","",""],[99,83.8,"8.0 m between shopfronts","r",""],[36.5,84.4,"near-side shopfront, cut away","","m"]],"notes":[["02","Corridor","Two colonnades 5.5 m apart replace the patchwork awnings. Panels shade the stalls by day; after closing at 20:30 the lintels light the 8 m street, 3 m of it open to the sky."]]},{"src":"assets/img/smart-pixel/gesture-room.jpg","r":1.0787,"tags":[[61.7,70.3,"4.96 m","",""],[39.2,78,"5.0 m","",""],[44.4,88.2,"pocket park","","m"]],"notes":[["03","Room","2 × 2 cells on two tiers: a table below, a lit lantern above with the mesh screen. A temporary building (max. 3 years, renewable) — the neighbourhood can keep it, move it or return it."]]}]
      },
      {
        heading: "The Gathering Rule", big: true,
        text: "Light is switched on only by the people who are there. The number of people sets the size of the space — scroll from nobody to a group of four: the plan on the left, the same 16 pixels on the right, and below what is lit, who it needs and when it runs. Every mode keeps the light at residents' windows at or below 10 lx, the limit for residential zones; when everyone leaves, or after 23:00, it falls back to the default.",
        // 핀 #152: 평면(원본 05_program) + 16기둥 엑소노를 한 장면에, Four Modes 사양 표를 단계마다
        images: [],
        seq: {"kind":"frames","fade":true,"below":true,"k":0.86,"r":2.2143,"steps":[{"src":"assets/img/smart-pixel/rule-0.jpg","t":"00 Default","s":"CPTED state · nobody gathered","d":"Runs by itself from dusk to dawn: every pixel low, rising to 100 % as you pass. Used for the walk home from the station, a lit and watched corner at 2 am, and SOS — the cluster flashes.","k":[["People","none: runs by itself"],["Pixels lit","all, low"],["Output","20 % → 100 % as you pass"],["Colour","2700 K warm white"],["Sensors","radar in the column head"],["Alarm","flashes on an Ansimi app SOS"],["Runs","dusk to dawn"]],"tags":[[1.6,4,"Plan","","m"],[38.3,4,"Axonometric — 16 pixels, 2.5 m grid","","m"],[45.9,80.5,"2.5 m","c",""]]},{"src":"assets/img/smart-pixel/rule-1.jpg","t":"01 Column","s":"point · 1 person","d":"One person checks in and the pixel next to them lights up. For waiting for someone, a short phone-free talk, walking the dog.","k":[["People","1, checked in on site"],["Pixels lit","1, next to you"],["Output","100 %"],["Colour","2700–4000 K, user set"],["Check-in","Bluetooth, within 3 m"],["Hold","while you stay, 10 min after"],["Runs","18:00–24:00"]],"tags":[[1.6,4,"Plan","","m"],[38.3,4,"Axonometric — 16 pixels, 2.5 m grid","","m"]]},{"src":"assets/img/smart-pixel/rule-2.jpg","t":"02 Wall","s":"line · 2 people","d":"Two neighbouring pixels pull a mesh screen between them. A neighbourhood film night, kids' drawings on the screen, a quiet backdrop for a stall.","k":[["People","2+, at neighbouring pixels"],["Pixels lit","2 + mesh screen"],["Screen","2.35 × 1.90 m, pulled by hand"],["Image","edge-lit, or projector in head"],["Set-up","unroll, clip to the next column"],["Sound","none"],["Runs","18:00–22:00"]],"tags":[[1.6,4,"Plan","","m"],[38.3,4,"Axonometric — 16 pixels, 2.5 m grid","","m"]]},{"src":"assets/img/smart-pixel/rule-3.jpg","t":"03 Space","s":"volume · 4 people","d":"Four corners of a cell light up under a string-light canopy, with a table and stools from the furniture box. A neighbour dinner, a study circle, the night-market table.","k":[["People","4+, one booking in the app"],["Pixels lit","4 corners of a cell"],["Canopy","2.5 × 2.5 m string lights, H 2.4 m"],["Furniture","box: 1 table, 4 stools"],["Set-up","15 min, by the group"],["Return","pack the box to sign out"],["Runs","18:00–22:00, Fri–Sat to 23:00"]],"tags":[[1.6,4,"Plan","","m"],[38.3,4,"Axonometric — 16 pixels, 2.5 m grid","","m"]]}]}
      },
      {
        heading: "Under the Corridor at 21:00", big: true,
        text: "Section A–A cuts the market street through a column pair. Shops keep their stalls under the roof, homes above keep their dark windows, and nothing under the street moves: the sockets stop at −0.88, above every service.",
        images: [
          {
            src: "assets/img/smart-pixel/section-aa.jpg",
            caption: "Section A–A — Digital-ro 37na-gil at 21:00, perspective beyond the cut",
            r: 1.291,
            w: "80%" // 핀 #149 전체 폭 → 핀 #158 조금 작게
          }
        ]
      },
      {
        heading: "Checks",
        text: "2.2 lx at the window, 31 / 6 lx on the walkway, 28 MPa in a frame in wind, 3.75 kN uplift on a socket, 21 kWh a night for the whole pilot.",
        images: [
          {
            src: "assets/img/smart-pixel/detail-checks.jpg",
            caption: "Light, wind, uplift and energy — checked against the limits",
            r: 9.256
          }
        ]
      },
      {
        heading: "One Pixel, Taken Apart", big: true,
        text: "A pixel is three things on one axis: a socket that ties it to the ground, a column that gives light, and a head that senses and talks. Nothing is glued or cast on site; every layer comes off with one spanner, top down. It travels as four packages — socket 200 kg, column set 33 kg, head unit 12 kg, lintel 13 kg — and only the socket needs a machine.",
        // 핀 #144: 단면 A(08_detail) + 분해 엑소노(11_device)를 한 장면에, 글자·지시선 없이 — 단계마다 묶음만 진하게, 같은 부품 번호
        seq: {"kind":"frames","fade":true,"below":true,"r":1.4285,"steps":[{"src":"assets/img/smart-pixel/pixel-0.jpg","t":"One pixel","s":"three things on one axis · 247 kg","d":"Left, the column cut across the street; right, the same pixel taken apart. Scroll to put it together from the ground up — socket, light, head — the order it is built in, and the reverse of the order it leaves.","k":[["Ground connection","202 kg"],["Light","33 kg"],["Sense and talk","12 kg"],["Lintel","13 kg per bay"]],"tags":[[0.6,2.5,"Section A, 1:10 — across the street, shaft broken","","m"],[66,2.5,"Exploded axonometric","","m"],[2.5,53,"±0.00 street","","m"],[2.5,84.7,"−0.82 socket base","","m"],[55.3,1.6,"4","c","m"],[29.6,8.1,"1","c","m"],[12.7,71.5,"3","c","m"]]},{"src":"assets/img/smart-pixel/pixel-1.jpg","t":"A Ground connection","s":"set once by a mini excavator · stays when the pixel leaves","d":"A precast socket with the sleeve, supply elbow and drain already cast in. The collar is bolted on top and a capped lock pin goes through it into the core; the plug sits behind a hatch.","k":[["01 Socket, precast","600 × 600 base, ø300 shaft · 200 kg"],["02 Sleeve ø114.3 × 3.6","cast in; the core stops at −560"],["03 Supply elbow ø50","cast in, to the feeder duct"],["04 Drain ø20","to the gravel bed"],["05 Plug-in connector","230 V 16 A, 3-pole"],["06 Base collar ø170 × 180","cast aluminium · 1.8 kg"],["07 Lock pin M12 × 110","stainless, capped"]],"tags":[[0.6,2.5,"Section A, 1:10 — across the street, shaft broken","","m"],[66,2.5,"Exploded axonometric","","m"],[2.5,53,"±0.00 street","","m"],[2.5,84.7,"−0.82 socket base","","m"],[55.3,1.6,"4","c","m"],[29.6,8.1,"1","c","m"],[12.7,71.5,"3","c","m"],[18.7,70.9,"01","c pt"],[86.2,92.6,"01","c pt"],[20.5,67.8,"02","c pt"],[81,78.3,"02","c pt"],[24.9,79,"03","c pt"],[88.4,88.6,"03","c pt"],[22,81.7,"04","c pt"],[83.5,96.8,"04","c pt"],[22,75.7,"05","c pt"],[82.4,69.3,"05","c pt"],[24.1,51.6,"06","c pt"],[83.3,64.4,"06","c pt"],[24.6,54.4,"07","c pt"],[77.1,62.8,"07","c pt"]]},{"src":"assets/img/smart-pixel/pixel-2.jpg","t":"C Light","s":"lifts out as one piece once the head is off","d":"A steel core carries two LED lines; an opal diffuser slides over it, with a black film on the shop side so no light reaches the windows. End rings clip it shut.","k":[["08 Core ø101.6 × 4.0 × 2,796","S275 · 26.9 kg"],["09 Linear LED, 24 V","2700–4000 K, × 2"],["10 Diffuser ø150 × 3 × 2,060","opal PC · 3.4 kg"],["11 Mask, 180° film","on the shop side"],["12 End ring","× 2, seals the gap"],["13 Spigot ø93 × 5","into the core, 2 × M8 grub"]],"tags":[[0.6,2.5,"Section A, 1:10 — across the street, shaft broken","","m"],[66,2.5,"Exploded axonometric","","m"],[2.5,53,"±0.00 street","","m"],[2.5,84.7,"−0.82 socket base","","m"],[55.3,1.6,"4","c","m"],[29.6,8.1,"1","c","m"],[12.7,71.5,"3","c","m"],[20.6,40.8,"08","c pt"],[82.8,37.3,"08","c pt"],[23.4,31.5,"09","c pt"],[82.2,55.3,"09","c pt"],[23.9,27.6,"10","c pt"],[73.9,48.5,"10","c pt"],[20,29.5,"11","c pt"],[68.8,46.9,"11","c pt"],[73.8,25.6,"12","c pt"],[20.9,24.1,"13","c pt"],[82.7,26.5,"13","c pt"]]},{"src":"assets/img/smart-pixel/pixel-3.jpg","t":"B Sense and talk","s":"the head unit, wired and tested · swapped in 10 minutes","d":"A cast node with four arms holds the radar, the controller and the driver under one cover plate, and takes up to four lintels. The radar sees a pass, not a face.","k":[["14 Head node ø170 × 320","four arms 92 × 152 · 9.9 kg"],["15 Sensor lens","radar and Bluetooth window"],["16 Radar 24 GHz","holds the light 40 s"],["17 Controller, Bluetooth LE 5","check-in within 3 m"],["18 LED driver 30 W, 24 V","column + four lintels"],["19 Gasket","EPDM, under the cover"],["20 Cover plate ø170 × 12","4 × M6 pin-Torx"],["21 Lintel 100 × 160 × 3 × 2,500","sleeved over an arm · 13 kg"]],"tags":[[0.6,2.5,"Section A, 1:10 — across the street, shaft broken","","m"],[66,2.5,"Exploded axonometric","","m"],[2.5,53,"±0.00 street","","m"],[2.5,84.7,"−0.82 socket base","","m"],[55.3,1.6,"4","c","m"],[29.6,8.1,"1","c","m"],[12.7,71.5,"3","c","m"],[20,11.4,"14","c pt"],[80.5,19.7,"14","c pt"],[24.4,19.5,"15","c pt"],[83.5,20.1,"15","c pt"],[86.7,23.1,"16","c pt"],[83.1,10.6,"17","c pt"],[82.5,13.2,"18","c pt"],[83.3,8.5,"19","c pt"],[83.3,6.4,"20","c pt"],[22.6,14.8,"21","c pt"],[69,11.6,"21","c pt"]]}]},
        images: []
      },
      {
        heading: "How a Resident Talks to a Pixel", big: true,
        text: "Four ways in, one phone, no account. Walking past needs nothing; a tap holds the light; a booking opens a room; a press on the gate calls for help. The pixel answers in light, and keeps nothing it does not need. Scroll through the four ways, then run them below.",
        stack: true,
        // 핀 #172: 원본 12_app.ai에서 글자 없이 뽑고 글은 모두 사이트 글자로, 네 가지 쓰임은 단계 장면 + 빛 시뮬레이션(church.js pixel)
        seq: {"kind":"frames","fade":true,"below":true,"r":2.3471,"steps":[{"src":"assets/img/smart-pixel/app-way-1.jpg","t":"Walk past","s":"No phone, no sign-in. The radar sees a pass, not a face.","d":"The radar in each head watches the lane, 6 m each way, ±60°. The pixel you pass goes to 100 %; the next ones each way go to 60 %. The bright patch walks with you, one pixel ahead. 40 s after the last pass it falls back to 20 %, warm 2700 K.","k":[["Trigger","movement in the radar field"],["Holds","40 s after the last pass"],["Hours","dusk to dawn"]],"tags":[[2.38,11.94,"22:10","",""],[4.91,29.36,"22:10","","b"],[8.26,36.74,"Friday","",""],[9.9,55.89,"no app, no alert\nthe phone stays\nin the pocket","c","nl"],[32.59,34.32,"20 %","",""],[47.11,34.32,"60 %","",""],[61.32,34.32,"100 %","",""],[76.16,34.32,"60 %","",""],[90.69,34.32,"20 %","",""],[82.45,57.15,"radar, 6 m","",""]]},{"src":"assets/img/smart-pixel/app-way-2.jpg","t":"Check in","s":"One tap in the app, within 3 m: for a wait, a slow walk, a dog.","d":"Open the app beside a pixel; Bluetooth finds its head within 3 m. Tap Stay lit: the pixel next to you goes to 100 %, only that one. Pick the colour between 2700 and 4000 K, if you like. It holds while the phone stays within 3 m, and 10 min after.","k":[["Trigger","a tap in the app, nothing to sign"],["Holds","while you stay, 10 min after"],["Hours","18:00 – 24:00"]],"tags":[[2.38,11.94,"22:10","",""],[1.58,17.83,"Pixel","","w"],[12.43,18.18,"anonymous","",""],[1.58,28.2,"G1-07 · Digital-ro 54-gil\n2.1 m away, Bluetooth","","nl"],[7.85,52.77,"Stay lit","",""],[1.58,65.25,"Colour","",""],[1.58,73.97,"2700 K","",""],[19.6,73.97,"4000 K","r",""],[1.58,79.5,"Hold","",""],[6.76,79.55,"while I'm here + 10 min","",""],[6.81,85.81,"Check out","",""],[36.55,34.32,"20 %","",""],[61.32,34.32,"100 %","",""],[86.73,34.32,"20 %","",""],[83.63,44.92,"Bluetooth, 3 m","",""]]},{"src":"assets/img/smart-pixel/app-way-3.jpg","t":"Gather","s":"Two checked in side by side open the wall; four with a booking, the room.","d":"Wall: two people checked in at neighbouring pixels pull the 2.35 × 1.90 m screen. Room: one booking for four or more lights the four corners of a cell and the canopy. The group opens the box — 1 table, 4 stools — and sets up in about 15 min. Packing the box signs the room out; from 23:00 only the walk-past light runs.","k":[["Trigger","2 check-ins, or 1 booking"],["Holds","the booking; packing ends it"],["Hours","18:00 – 22:00, Fri–Sat to 23:00"]],"tags":[[2.38,11.94,"19:00","",""],[1.58,17.83,"Book","","w"],[11.04,18.18,"R2 crossroads","",""],[4.51,27.98,"Wall","",""],[12.32,27.98,"Room","",""],[2.43,32.17,"2+ checked in","",""],[11.39,32.17,"4+, booked","",""],[1.58,41.07,"Cell","",""],[10.83,41.07,"B, 2.5 × 2.5 m","",""],[1.58,47.27,"Day","",""],[14.95,47.27,"Friday","",""],[1.58,53.47,"Time","",""],[11.25,53.47,"19:00 – 21:00","",""],[1.58,59.67,"People","",""],[15.37,59.67,"− 4 +","",""],[1.58,65.87,"Box","",""],[10,65.87,"1 table, 4 stools","",""],[1.58,75.1,"18:00 – 22:00, Fri–Sat to 23:00\npack the box to sign out","","nl"],[8.36,85.81,"Book","","i"],[32.36,34.32,"wall","",""],[48.86,34.32,"wall","",""],[64.95,34.32,"room","",""],[81.46,34.32,"room","",""],[86.36,66.94,"box","",""]]},{"src":"assets/img/smart-pixel/app-way-4.jpg","t":"Call for help","s":"One press on the gate sign, or SOS in Seoul's Ansimi app.","d":"Press SOS on the gate sign (under a flap), or hold SOS in the Ansimi app. The gate and its cluster flash once a second; the lane line goes to 100 %. A call goes to 112 and to the Daerim 2-dong police box, with the gate number. The flash stops when the police box clears it on site; then 20 % again.","k":[["Trigger","the sign button, or the Ansimi app"],["Reaches","112 and the police box"],["Hours","day and night; flash after dusk"]],"tags":[[2.38,11.94,"22:40","",""],[1.58,17.83,"Ansimi","","w"],[15.4,18.18,"Seoul","",""],[7.57,39.73,"SOS","","b"],[7.8,56.57,"hold 3 s","",""],[3.7,75.17,"Gate G1 flashing\nLane line at 100 %\nCall to 112\nPolice box alerted\nCall back to this phone","","nl"],[70.14,28.18,"a window opens","",""],[35.48,34.32,"gate","",""],[51.99,34.32,"gate","",""],[72.5,34.32,"lane","",""],[39.93,44.42,"G1 54-GIL","",""]]}]},
        images: [{"sim":"pixel","w":"76%","caption":"The four ways, live — the lane lights as each one runs; below, the light at one pixel over time. Pick a way, or let it cycle.","r":2.8},{"src":"assets/img/smart-pixel/app-network.jpg","caption":"What talks to what — the phone only asks; the pixel answers in light. No camera, no microphone, no account.","r":4.4057,"w":"100%","tags":[[75.91,6.31,"Seoul Ansimi app","",""],[75.91,10.74,"SOS from anywhere","",""],[10.47,18.85,"Bluetooth LE, 3 m\ntoken, hold, colour","","nl"],[29.66,18.85,"mesh, 2.5 m hops\nlevels, SOS, counts","","nl"],[51.56,18.85,"mesh\ngateway","c","nl"],[91.81,19.84,"112","",""],[66.42,21.19,"position → nearest gate","",""],[88.35,23.03,"112","","w"],[91.81,24.57,"police emergency line","",""],[66.35,30.53,"LTE\nSOS, counts, faults","c","nl"],[82.88,43.44,"call, alert\ngate no., map pin","c","nl"],[91.81,48.11,"police box","",""],[91.81,54.84,"Daerim 2-dong\ncalls back, comes","","nl"],[3.9,57.34,"your phone","",""],[19.45,57.34,"pixel head","",""],[30.73,57.34,"next pixel","",""],[41.88,57.34,"gate pixel","",""],[56.38,57.34,"sub-board","",""],[71.44,57.34,"gu office server","",""],[2.87,62.07,"the app, no account","",""],[21.35,64.06,"radar, Bluetooth,\nmesh node","c","nl"],[30.63,62.07,"passes it on","",""],[41.06,62.07,"sign, SOS button","",""],[58.33,64.06,"on the street-lamp feeder:\nLTE, astro timer, RCD","c","nl"],[74.37,64.06,"Yeongdeungpo-gu:\nbookings, faults, SOS","c","nl"],[39.23,82.66,"230 V feeder under the paving, about 58 columns a circuit","",""],[4.19,94.8,"Bluetooth","",""],[17.44,94.8,"mesh radio","",""],[30.7,94.8,"LTE, mobile network","",""],[43.95,94.8,"power","",""]]},{"src":"assets/img/smart-pixel/app-sos.jpg","caption":"SOS, second by second — from the gate sign; an app SOS joins at the gu server. Design targets for the pilot.","r":3.7069,"w":"100%","tags":[[6.02,8.47,"resident","",""],[20.19,8.47,"gate pixel","",""],[33.5,8.47,"cluster, lane line","",""],[48.88,8.47,"sub-board","",""],[63.46,8.47,"gu server","",""],[78.98,8.47,"112","",""],[92.18,8.47,"police box","",""],[12.97,15.76,"press SOS","",""],[1.12,18.34,"0 s","",""],[1.12,26.88,"0.1 s","",""],[24.47,26.88,"flash, once a second","",""],[23.39,32.83,"mesh: cluster flashes, lane to 100 %","",""],[1.12,35.41,"0.5 s","",""],[22.93,41.36,"mesh: SOS, gate G1","",""],[1.12,43.95,"1 s","",""],[54.74,49.9,"LTE: SOS, G1, 22:40","",""],[1.12,52.48,"2 s","",""],[67.01,58.43,"call with the gate no. and map pin","",""],[1.12,61.02,"3 s","",""],[66.19,66.97,"alert on the duty screen","",""],[1.12,69.55,"3 s","",""],[78.87,75.5,"call back (to the phone, if sent from the app)","",""],[1.12,78.09,"~1 min","",""],[82.29,84.03,"officer clears the SOS on the sign","",""],[1.12,86.62,"on site","",""],[25.59,92.57,"back to 20 % standby","",""],[1.12,95.16,"+40 s","",""]]},{"src":"assets/img/smart-pixel/app-screens.jpg","caption":"The rest of the app — six more screens behind the four above, one tap deep, nothing to sign in to","r":3.1555,"w":"100%","tags":[[2.46,14.45,"21:58","",""],[20,14.45,"22:00","",""],[37.54,14.45,"17:40","",""],[55.07,14.45,"20:50","",""],[72.61,14.45,"22:40","",""],[90.14,14.45,"22:41","",""],[2.03,18.8,"Smart Pixel","","w"],[19.57,18.8,"Nearby","","w"],[37.1,18.8,"Booked","","w"],[72.17,18.8,"Report","","w"],[89.71,18.8,"This phone","","w"],[8.54,19.05,"first open","",""],[26.71,19.05,"G1 lane","",""],[42.29,19.05,"R2 crossroads","",""],[79.69,19.05,"G1-07","",""],[96.1,19.05,"no sign-in","",""],[56.24,26.39,"20:50","","b"],[37.1,24.91,"Friday 19:00 – 21:00","",""],[72.17,24.91,"What is wrong?","",""],[89.71,25.43,"Token","",""],[93.8,25.43,"new every 15 min","",""],[37.1,28.17,"cell B · 4 people · 1 box","",""],[89.71,30,"On the pixel","",""],[95.22,30,"nothing kept","",""],[73.64,30.79,"Dark","",""],[77.72,30.79,"Flickering","",""],[58.3,31.83,"Friday","",""],[89.71,34.57,"Check-ins","",""],[95.24,34.57,"hourly totals","",""],[72.55,37.65,"Lens broken","",""],[78.32,37.65,"Other","",""],[6.59,41.66,"Bluetooth finds the light\nnext to you. No account,\nno name, no location history.","c","nl"],[89.71,39.15,"Bookings","",""],[93.44,39.15,"deleted at 30 days","",""],[44.43,39.79,"B","",""],[14.56,40.03,"allow","",""],[32.13,40.03,"book","",""],[49.59,40.03,"18:45","",""],[67.11,40.03,"menu","",""],[84.65,40.03,"menu","",""],[56.02,40.61,"SMART PIXEL · now","",""],[55,44.15,"R2: 10 minutes left","",""],[89.71,46.46,"Bluetooth check-in","",""],[24.18,46.52,"you · 3 m","",""],[55,48.45,"Pack the box to sign out.\nThe room dims at 21:00.","","nl"],[2.9,52.85,"walking past needs no app\nSOS works without it too\n한국어","","nl"],[73.85,50.61,"add a photo, optional","",""],[89.71,51.49,"Booking reminders","",""],[37.1,51.52,"Box code, live from 18:45","",""],[19.57,53.32,"G1-07","",""],[26.21,53.32,"2.1 m · lit","",""],[4.64,55.87,"·","",""],[5.13,55.72,"中文","",""],[6.29,55.87,"· English","",""],[98.53,56.37,"›","",""],[37.77,56.71,"4","","w"],[40.27,56.71,"1","","w"],[42.59,56.71,"7","","w"],[44.97,56.71,"2","","w"],[72.17,58.84,"The pixel has reported itself\nalready; this tells the gu what\nyou saw. Or call 120, Dasan.","","nl"],[89.71,56.52,"Language:","",""],[92.95,56.36,"한국어","",""],[19.57,57.9,"G1-08","",""],[27.06,57.9,"4.6 m","",""],[56.02,57.99,"SMART PIXEL · 18:45","",""],[55,61.52,"R2 is ready","",""],[3.7,62.09,"Allow while using","","i"],[19.57,62.47,"R2 room","",""],[23.77,62.47,"38 m · free 19:00","",""],[37.1,62.47,"Set-up","",""],[40.92,62.47,"15 min, from 18:45","",""],[55,65.82,"Box code 4172. The four\ncolumns light in turn.","","nl"],[5.24,68.49,"Not now","",""],[22.16,68.95,"Open G1-07","","i"],[39.13,68.95,"Cancel booking","",""],[75.88,68.95,"Send","","i"],[91.05,68.95,"Delete my bookings","",""],[2.9,82.87,"First open","",""],[20.43,82.87,"Nearby","",""],[37.97,82.87,"Booked","",""],[55.51,82.87,"Reminders","",""],[73.04,82.87,"Report","",""],[90.58,82.87,"This phone","",""],[1.6,82.85,"a","",""],[19.12,82.85,"b","",""],[36.68,82.85,"c","",""],[54.19,82.85,"d","",""],[71.74,82.85,"e","",""],[89.35,82.85,"f","",""],[1.16,90.76,"Asks for Bluetooth only. No\naccount, no name, no location\nhistory.","","nl"],[18.7,90.76,"The lane as it is: the pixels\nwithin 3 m are lit, the room\nup the lane is free.","","nl"],[36.23,90.76,"The cell, the hours and a\nfour-digit code for the box,\nlive 15 min before.","","nl"],[53.77,90.76,"On the lock screen: the room\nis ready; ten minutes left;\nnothing else.","","nl"],[71.3,90.76,"One tap: what is wrong. The\npixel has already told the gu\nit is dark.","","nl"],[88.84,89.16,"What is shared, for how long,\nand a button that deletes it.","","nl"]]},{"src":"assets/img/smart-pixel/app-words.jpg","caption":"The light's own words — how a pixel answers without a screen; level over time, each strip to its own scale","r":1.506,"w":"62%","tags":[[55.57,16.33,"20 → 100 % in 0.5 s; back to 20 % 40 s after the last pass","",""],[1.59,17.63,"Someone passes","",""],[55.57,26.21,"one slow breath, 1.5 s: the pixel knows it is you","",""],[1.59,27.51,"Check-in heard","",""],[55.57,36.09,"the cell's four columns light in turn, 1 s apart","",""],[1.59,37.4,"Room ready","",""],[55.57,45.97,"two slow breaths on the room's columns","",""],[1.59,47.28,"Ten minutes left","",""],[55.57,55.85,"23:00: down to 20 % over 60 s; rooms close","",""],[1.59,57.16,"Quiet hours","",""],[55.57,67.2,"the gate flashes once a second until the police box clears it","",""],[1.59,67.04,"SOS","",""],[55.57,77.08,"5 % and steady, never a flash, so it is never read as SOS; it reports itself","",""],[1.59,76.92,"Fault","",""],[55.57,85.49,"off; radar and radio listen on 0.5 W","",""],[1.59,86.8,"Day","",""],[1.59,95.37,"Dashed: the 20 % night level. All signals are warm white; nothing is coloured.","","m"],[1.59,8.74,"Signal","","m"],[23.96,8.74,"Level","","m"],[55.57,8.74,"What it means","","m"]]}]
      },
      {
        heading: "Two Sessions, Three Years, One Vote",
        text: "A gate goes up in a day of digging and an evening of bolting, with the lane open throughout. The whole network is then tested in public before it stays: pop-up first, a three-year pilot, then a vote on every piece.",
        stack: true,
        // 핀 #104: 설치 여섯 단계를 시간표가 흐르는 단계 그림으로 (원본 09_construct.ai, 글자 없이)
        seq: {"kind":"frames","below":true,"fade":true,"lite":true,"k":0.9,"r":0.969,"tl":{"bands":[["Day 1, daytime — permit for the pavement and kerb lane",480,900],["Day 2, after 20:30 — shops shut, hand tools only",1230,1440]]},"steps":[{"src":"assets/img/smart-pixel/install-1.jpg","t":"Mark and scan","s":"Day 1 · 08:30–09:30 · crew 2","d":"Dig notice filed with the one-call centre (EOCS) a week ahead; the gas and water owners mark their mains. A radar cart sweeps the lane mouth, and the four socket centres are sprayed on the 2.5 m grid, 0.75 m in from the walls. Plant: GPR cart, spray paint. Lane: open. Hold: anything above −1.00 in a pit: that pier stands on a ballast foot.","tm":[0,510,570,2]},{"src":"assets/img/smart-pixel/install-2.jpg","t":"Cut, dig and set","s":"Day 1 · 09:30–14:30 · crew 3","d":"Blocks lifted and stacked for reuse. Pits 0.9 × 0.9 to −0.88, a trench 300 wide to −0.70 from the street-light cabinet. Each 200 kg socket is lowered onto 60 of gravel, set level by laser and backfilled in two layers; blocks relaid, sockets capped. Plant: 1.7 t mini excavator, saw, plate compactor. Lane: one side fenced at a time. Hold: collar flush with the paving, ±3 mm.","tm":[0,570,870,3]},{"src":"assets/img/smart-pixel/install-3.jpg","t":"Plug","s":"Day 2 · 20:45–21:25 · crew 2","d":"After the shops shut. Two people walk each 33 kg column in, clip the plug on and lower it until the core sits on its stop; the base collar is closed and pinned. Plant: trolley, work lamp. Lane: open; cones round the pier. Hold: column plumb, plug seated.","tm":[1,1245,1285,2]},{"src":"assets/img/smart-pixel/install-4.jpg","t":"Bolt","s":"Day 2 · 21:30–22:10 · crew 2","d":"From two step ladders, each 13 kg lintel is lifted onto the head nodes, slid over the arms and fixed with 2 × M12 at each end. Each pier is now a frame that stands on its own. Plant: two 2 m step ladders. Lane: open. Hold: bolts torqued and paint-marked.","tm":[1,1290,1330,2]},{"src":"assets/img/smart-pixel/install-5.jpg","t":"Raise","s":"Day 2 · 22:15–23:05 · crew 3","d":"Upper columns go onto the spigots, then the two 3.5 m cross lintels are passed up to a mobile tower and bolted at 4.96 m. Their cable chamber carries power to the far pier. Plant: mobile tower, platform 3.2 m, outriggers out. Lane: 2.4 m beside the tower. Hold: frame square, top lintels level.","tm":[1,1335,1385,3]},{"src":"assets/img/smart-pixel/install-6.jpg","t":"Switch on","s":"Day 2 · 23:10–23:40 · crew 2","d":"Sign, bench and SOS fitted. The sub-board breaker is closed and each node joins the mesh. A walk-through checks 100 / 60 / 20 % and the 40 s hold; a test call goes to 112 and the police box. Plant: tablet. Lane: open, fences gone. Hold: test log signed by the gu office.","tm":[1,1390,1420,2]}]},
        images: [
          {
            src: "assets/img/smart-pixel/construct-pilot.jpg",
            caption: "Pop-up, pilot, then a vote — 3 gates, then 11, then what the residents keep",
            r: 4.35
          }
        ]
      },
      {
        heading: "A Night in Daerim, 18:40 to 22:40", big: true, // 핀 #177: 마지막 23:00 장면 삭제
        text: "One walk home on a June weekday, through the pieces of the frame. Each scene is the same 12 × 12 m plot, the same angle, the same scale.",
        images: [],
        seq: {
          kind: "frames",
          r: 1.119,
          lite: true,
          fade: true,
          steps: [
            {
              src: "assets/img/smart-pixel/night-1.jpg",
              t: "18:40",
              s: "Exit 10, the market corridor",
              d: "“I come up from the station and take the market way. Under the roofs it is still busy; nobody needs a light yet.” Frame off; the roof panels give the shade."
            },
            {
              src: "assets/img/smart-pixel/night-2.jpg",
              t: "20:30",
              s: "The market closes",
              d: "“The shutters come down and the same roofs light up from below. The street I knew by day is still the way home.” Lintels 100 %, walkway 31 lx."
            },
            {
              src: "assets/img/smart-pixel/night-3.jpg",
              t: "21:15",
              s: "Room at the crossroads",
              d: "“Four of us at the table, so the room is in its gathering mode. Tonight the screen upstairs shows the kids' drawings.”"
            }, // 핀 #189: 22:10 게이트 장면 뺌(night-4.jpg 파일은 남김)
            {
              src: "assets/img/smart-pixel/night-5.jpg",
              t: "22:40",
              s: "SOS at the gate",
              d: "“One press on the sign: the gate flashed, a neighbour opened the window, the police box called back.”"
            }
          ]
        }
      },
      // 핀 #150·#151: 밤 장면 뒤 렌더 두 장
      { heading: "Scenes", text: "Two nights in the rain: a gate on Digital-ro 54-gil held lit from a phone, and the room at the crossroads in its gathering mode.", images: [{src: "assets/img/smart-pixel/render-gate-app.jpg", caption: "Gate, Digital-ro 54-gil — stay lit from the app", r: 0.914}, {src: "assets/img/smart-pixel/render-room.jpg", caption: "Room at the crossroads — tables below, the lantern above", r: 0.788}], stack: true, scenes: true }
    ],
    drawings: []
  },
  {
    slug: "campus-renovation", blurb: "OLED 물결로 잇는 4계절 캠퍼스재생",
    title: "Campus Renovation J′",
    titleKo: "성균관대 자연과학캠퍼스 리노베이션",
    subtitle: "Central park, media corridor, bridge connect — the engineering buildings of SKKU joined through their corridors, and the same places followed through the seasons",
    type: "Education",
    year: "2024",
    studio: "Design Studio 4",
    award: "SKKU Design Excellence Award 3 · 4 최우수작품",
    program: "중앙공원 · 미디어 코리더 · 연결 브리지",
    site: "성균관대학교 자연과학캠퍼스 (수원)",
    area: "",
    team: "2인 공동작품",
    tools: "",
    pos: [-0.42, 5.53],
    mass: [
      [0, 0, 3, 0.6, 0.85],
      [0, 1.45, 3, 0.6, 0.85],
      [0.06, 0.6, 0.035, 0.07, 0.85],
      [0.06, 1.38, 0.035, 0.07, 0.85],
      [0.25, 0.6, 0.035, 0.07, 0.85],
      [0.25, 1.38, 0.035, 0.07, 0.85],
      [0.44, 0.6, 0.035, 0.07, 0.85],
      [0.44, 1.38, 0.035, 0.07, 0.85],
      [0.63, 0.6, 0.035, 0.07, 0.85],
      [0.63, 1.38, 0.035, 0.07, 0.85],
      [0.82, 0.6, 0.035, 0.07, 0.85],
      [0.82, 1.38, 0.035, 0.07, 0.85],
      [1.01, 0.6, 0.035, 0.07, 0.85],
      [1.01, 1.38, 0.035, 0.07, 0.85],
      [1.2, 0.6, 0.035, 0.07, 0.85],
      [1.2, 1.38, 0.035, 0.07, 0.85],
      [1.39, 0.6, 0.035, 0.07, 0.85],
      [1.39, 1.38, 0.035, 0.07, 0.85],
      [1.58, 0.6, 0.035, 0.07, 0.85],
      [1.58, 1.38, 0.035, 0.07, 0.85],
      [1.77, 0.6, 0.035, 0.07, 0.85],
      [1.77, 1.38, 0.035, 0.07, 0.85],
      [1.96, 0.6, 0.035, 0.07, 0.85],
      [1.96, 1.38, 0.035, 0.07, 0.85],
      [2.15, 0.6, 0.035, 0.07, 0.85],
      [2.15, 1.38, 0.035, 0.07, 0.85],
      [2.34, 0.6, 0.035, 0.07, 0.85],
      [2.34, 1.38, 0.035, 0.07, 0.85],
      [2.53, 0.6, 0.035, 0.07, 0.85],
      [2.53, 1.38, 0.035, 0.07, 0.85],
      [2.72, 0.6, 0.035, 0.07, 0.85],
      [2.72, 1.38, 0.035, 0.07, 0.85],
      [2.91, 0.6, 0.035, 0.07, 0.85],
      [2.91, 1.38, 0.035, 0.07, 0.85],
      [1.15, 0.67, 0.45, 0.71, 0.08, 0.5],
      [1.15, 0.67, 0.45, 0.71, 0.04, 0.8],
      [1.15, 0.72, 0.035, 0.035, 0.3, 0.5],
      [1.565, 0.72, 0.035, 0.035, 0.3, 0.5],
      [1.15, 0.88, 0.035, 0.035, 0.3, 0.5],
      [1.565, 0.88, 0.035, 0.035, 0.3, 0.5],
      [1.15, 1.04, 0.035, 0.035, 0.3, 0.5],
      [1.565, 1.04, 0.035, 0.035, 0.3, 0.5],
      [1.15, 1.2, 0.035, 0.035, 0.3, 0.5],
      [1.565, 1.2, 0.035, 0.035, 0.3, 0.5],
      [1.15, 1.36, 0.035, 0.035, 0.3, 0.5],
      [1.565, 1.36, 0.035, 0.035, 0.3, 0.5],
      [0.25, 0.85, 0.22, 0.22, 0.308, 0, "cone"],
      [0.6, 1.1, 0.18, 0.18, 0.252, 0, "cone"],
      [2, 0.8, 0.2, 0.2, 0.28, 0, "cone"],
      [2.45, 1.05, 0.24, 0.24, 0.336, 0, "cone"],
      [2.8, 0.78, 0.16, 0.16, 0.224, 0, "cone"],
      [0.15, 0.78, 0.85, 0.5, 0.06, 0, "dome"],
      [1.9, 0.72, 1, 0.6, 0.06, 0, "dome"],
      [0.06, 0, 0.035, 0.67, 0.035, 0.85],
      [0.06, 1.38, 0.035, 0.67, 0.035, 0.85],
      [0.25, 0, 0.035, 0.67, 0.035, 0.85],
      [0.25, 1.38, 0.035, 0.67, 0.035, 0.85],
      [0.44, 0, 0.035, 0.67, 0.035, 0.85],
      [0.44, 1.38, 0.035, 0.67, 0.035, 0.85],
      [0.63, 0, 0.035, 0.67, 0.035, 0.85],
      [0.63, 1.38, 0.035, 0.67, 0.035, 0.85],
      [0.82, 0, 0.035, 0.67, 0.035, 0.85],
      [0.82, 1.38, 0.035, 0.67, 0.035, 0.85],
      [1.01, 0, 0.035, 0.67, 0.035, 0.85],
      [1.01, 1.38, 0.035, 0.67, 0.035, 0.85],
      [1.2, 0, 0.035, 0.67, 0.035, 0.85],
      [1.2, 1.38, 0.035, 0.67, 0.035, 0.85],
      [1.39, 0, 0.035, 0.67, 0.035, 0.85],
      [1.39, 1.38, 0.035, 0.67, 0.035, 0.85],
      [1.58, 0, 0.035, 0.67, 0.035, 0.85],
      [1.58, 1.38, 0.035, 0.67, 0.035, 0.85],
      [1.77, 0, 0.035, 0.67, 0.035, 0.85],
      [1.77, 1.38, 0.035, 0.67, 0.035, 0.85],
      [1.96, 0, 0.035, 0.67, 0.035, 0.85],
      [1.96, 1.38, 0.035, 0.67, 0.035, 0.85],
      [2.15, 0, 0.035, 0.67, 0.035, 0.85],
      [2.15, 1.38, 0.035, 0.67, 0.035, 0.85],
      [2.34, 0, 0.035, 0.67, 0.035, 0.85],
      [2.34, 1.38, 0.035, 0.67, 0.035, 0.85],
      [2.53, 0, 0.035, 0.67, 0.035, 0.85],
      [2.53, 1.38, 0.035, 0.67, 0.035, 0.85],
      [2.72, 0, 0.035, 0.67, 0.035, 0.85],
      [2.72, 1.38, 0.035, 0.67, 0.035, 0.85],
      [2.91, 0, 0.035, 0.67, 0.035, 0.85],
      [2.91, 1.38, 0.035, 0.67, 0.035, 0.85]
    ],
    cover: "assets/img/campus-renovation/eng1-courtyard-winter.jpg",
    thumb: "assets/img/campus-renovation/card-frame.jpg", // 카드 사진 = 대표 영상(card-loop.mp4)의 첫 장면이라 영상과 딱 맞아요
    coverCaption: "Engineering No.1 Courtyard in winter — the central park under snow",
    coverR: 1.778,
    summary: "On SKKU's natural science campus, buildings that carry the university's history stand beside new ones that will make its future — but they do not meet. The proposal connects them through the corridor spaces between the engineering buildings: the scattered green spaces are gathered into one central park, a media facade turns the neglected streets into places to stop, and a bridge spans between the blocks so students can cross the whole campus on foot.",
    sections: [
      {
        heading: "Site Plan",
        text: "The natural science campus and its surroundings — the engineering blocks in the middle, the central green between them.",
        images: [
          {
            src: "assets/img/campus-renovation/site-plan.jpg",
            caption: "Site plan",
            r: 1.871
          }
        ]
      },
      {
        heading: "Concept",
        text: "Let students travel and enjoy the entire campus. The central park is revitalized by joining green spaces that had nothing to do with each other, and the connected green becomes a chain of pocket parks, each with its own theme — pedestrian-friendly, a central park, a green campus.",
        images: [
          {
            src: "assets/img/campus-renovation/concept.jpg",
            caption: "Pedestrian-friendly · Central park · Green campus",
            r: 2.537,
            w: "58%"
          }
        ]
      },
      {
        heading: "Strategy",
        text: "Three moves on the existing buildings.",
        cols: 3,
        images: [
          {
            src: "assets/img/campus-renovation/strategy-void.jpg",
            caption: "Center park — void: a green space for gathering, and a void in the lower floors that opens paths and lets light through",
            r: 2.876
          },
          {
            src: "assets/img/campus-renovation/strategy-media.jpg",
            caption: "Media facade: programs and images brought to the under-used streets, turning them into active places",
            r: 2.876
          },
          {
            src: "assets/img/campus-renovation/strategy-utilized.jpg",
            caption: "Utilized facade: the media facade becomes a louver and part of the bridge structure, guiding the landscape through",
            r: 2.876
          }
        ]
      },
      {
        heading: "Seasons",
        big: true,
        text: "The project is read through the year. The same seven places — two courtyards, two corridors and the bridge seen from outside, along it and inside it — are followed from summer rain to autumn ginkgo, to snow, and to night when the media facade lights up. Scroll to move through the seasons; each place turns over when its year is done.",
        images: [],
        seasons: {
          r: 1.778,
          places: [
            {
              t: "Engineering No.1 Courtyard",
              s: "the central park",
              d: "The courtyard opened as the central park: paths, low planting and steps where students stop.",
              imgs: {
                rain: "assets/img/campus-renovation/eng1-courtyard-rain.jpg",
                autumn: "assets/img/campus-renovation/eng1-courtyard-autumn.jpg",
                winter: "assets/img/campus-renovation/eng1-courtyard-winter.jpg",
                night: "assets/img/campus-renovation/eng1-courtyard-night.jpg"
              }
            },
            {
              t: "Engineering No.2 Courtyard",
              s: "a pocket park",
              d: "The second courtyard linked into the same green, with the media louvers on the facades around it.",
              imgs: {
                rain: "assets/img/campus-renovation/eng2-courtyard-rain.jpg",
                autumn: "assets/img/campus-renovation/eng2-courtyard-autumn.jpg",
                winter: "assets/img/campus-renovation/eng2-courtyard-winter.jpg",
                night: "assets/img/campus-renovation/eng2-courtyard-night.jpg"
              }
            },
            {
              t: "Ginkgo Corridor",
              s: "between the engineering blocks",
              d: "The corridor between the buildings made into a street — the ginkgo turns, the louvers carry images at night.",
              imgs: {
                rain: "assets/img/campus-renovation/ginkgo-corridor-rain.jpg",
                autumn: "assets/img/campus-renovation/ginkgo-corridor-autumn.jpg",
                winter: "assets/img/campus-renovation/ginkgo-corridor-winter.jpg",
                night: "assets/img/campus-renovation/ginkgo-corridor-night.jpg"
              }
            },
            {
              t: "Corridor",
              s: "looking toward the bridge",
              d: "The media facade folds out of the buildings and down to the ground as benches and edges.",
              imgs: {
                rain: "assets/img/campus-renovation/corridor-2-rain.jpg",
                autumn: "assets/img/campus-renovation/corridor-2-autumn.jpg",
                winter: "assets/img/campus-renovation/corridor-2-winter.jpg"
              }
            },
            {
              t: "Bridge — Outside",
              s: "spanning between the blocks",
              d: "The bridge hangs between the buildings like a suspension bridge, its truss curving down into the facades.",
              imgs: {
                autumn: "assets/img/campus-renovation/bridge-outside-autumn.jpg",
                winter: "assets/img/campus-renovation/bridge-outside-winter.jpg",
                night: "assets/img/campus-renovation/bridge-outside-night.jpg"
              }
            },
            {
              t: "Bridge — Along",
              s: "the straight deck",
              d: "Walking the deck, the campus is framed on both sides through glass and louvers.",
              imgs: {
                rain: "assets/img/campus-renovation/bridge-straight-rain.jpg",
                autumn: "assets/img/campus-renovation/bridge-straight-autumn.jpg",
                winter: "assets/img/campus-renovation/bridge-straight-winter.jpg",
                night: "assets/img/campus-renovation/bridge-straight-night.jpg"
              }
            },
            {
              t: "Bridge — Inside",
              s: "two levels, a half-void",
              d: "Inside, the bridge is a corridor with a view: the upper level is left half-open so the two floors talk to each other.",
              imgs: {
                rain: "assets/img/campus-renovation/bridge-inside-rain.jpg",
                autumn: "assets/img/campus-renovation/bridge-inside-autumn.jpg",
                winter: "assets/img/campus-renovation/bridge-inside-winter.jpg",
                night: "assets/img/campus-renovation/bridge-inside-night.jpg"
              }
            }
          ]
        }
      },
      {
        heading: "Long Section", big: true,
        text: "Through the campus, from the courtyard to the bridge.",
        images: [
          {
            src: "assets/img/campus-renovation/long-section.jpg",
            caption: "Long section",
            r: 2.963
          }
        ]
      },
      {
        heading: "Section Through the Bridge", big: true,
        text: "Across the corridor at the bridge: the lower truss on its steel frame, the two-level deck, and the upper truss with PV hanging it from above.",
        images: [
          {
            src: "assets/img/campus-renovation/section.jpg",
            caption: "Section through the bridge",
            r: 1.871
          }
        ]
      },
      { heading: "Plans", text: "Four levels on one frame, from the ground up — scroll and each floor drops onto the one below.", big: true, images: [], seq: {"kind":"frames","r":1.871,"fade":true,"drop":true,"tag":true,"below":true,"steps":[{"src":"assets/img/campus-renovation/plan-1.jpg","t":"Ground","s":"Engineering 2 B1F · Engineering 1 1F","d":"Both buildings meet the ground on two levels. The sunken court under Engineering 2 becomes a student shelter.","k":[["1","Student shelter"]]},{"src":"assets/img/campus-renovation/plan-2.jpg","t":"+1","s":"Engineering 2 1F · Engineering 1 2F","d":"The corridors open into an open library that runs between the two buildings around the gardens.","k":[["1","Open library"]]},{"src":"assets/img/campus-renovation/plan-3.jpg","t":"+2","s":"Engineering 2 3F · Engineering 1 4F","d":"The bridge crosses the central park and ties the two corridor rings into one loop.","k":[["1","Bridge"]]},{"src":"assets/img/campus-renovation/plan-4.jpg","t":"Roof","s":"Engineering 2 5F · Engineering 1 6F","d":"On top, the bridge widens into a media terrace beside a community lounge.","k":[["1","Media terrace"],["2","Community lounge"]]}]} },
      {
        heading: "Structure — A Suspension Bridge",
        text: "A suspension bridge reaches a long span in one piece by letting each part do one job. Here the buildings act as the main towers, the slab takes the walkers, cables carry the slab, and a truss replaces the hanging cable — spreading the forces between deck, towers and foundation.",
        images: [
          {
            src: "assets/img/campus-renovation/structure-bridge.jpg",
            caption: "Main tower · Slab · Cable · Suspension — the load runs from the deck up the cables, along the truss and down the towers",
            r: 2.652,
            reveal: 4,
            flow: "bridge"
          }
        ]
      },
      {
        heading: "Structure and System",
        text: "The bridge in three layers, and the joint that holds each one. The mega beam, the truss beam and the precast columns are welded and bolted so the joints stay seamless; expansion joints and heat-resistant materials take the movement of the steel through the seasons.",
        images: [],
        seq: {
          kind: "frames",
          r: 0.579,
          fade: true,
          k: 0.9,
          steps: [
            {
              src: "assets/img/campus-renovation/system-1.jpg", j: { src: "assets/img/campus-renovation/joint-truss.jpg", t: "Truss beam", s: "curved steel trusses, bolted at every node" },
              t: "The lower truss beam",
              s: "four main beams",
              d: "Carried by a single steel frame and made of four main beams; like a stadium roof, it is curved for both structure and form."
            },
            {
              src: "assets/img/campus-renovation/system-2.jpg", j: { src: "assets/img/campus-renovation/joint-mega.jpg", t: "Mega structure", s: "beams meet in welded and bolted plates" },
              t: "The bridge story",
              s: "two levels",
              d: "The inside has two levels. The upper level is not fully enclosed but left as a half-void, so the two floors talk to each other."
            },
            {
              src: "assets/img/campus-renovation/system-3.jpg", j: { src: "assets/img/campus-renovation/joint-precast.jpg", t: "Pre-cast concrete", s: "precast columns plated to the steel frame" },
              t: "The upper truss + PV",
              s: "held by cables",
              d: "Hung from the upper level through cables and built as a truss like the lower one, to take the tension."
            }
          ]
        }
      },
      {
        heading: "Media Facade", big: true,
        text: "Wider, more frequent windows bring more light than the existing facade. The louvers carry a media BIPV layer that generates solar power, and their angle changes how much sunlight the facade lets through.",
        images: [{"ba":["assets/img/campus-renovation/facade-before.jpg","assets/img/campus-renovation/facade-after.jpg"],"baL":["Existing","Renovated"],"caption":"Window width and spacing — drag the line to compare","r":0.542,"lite":true,"notes":[["","Window width and spacing","The existing brick wall has small windows set far apart. Widening them and adding a louver bay between each pair brings more daylight deep into the rooms than the old facade allows."]]},{"xp":{"w":1200,"h":1090,"k":0.06,"base":[[70,115],[390,115],[390,1025],[70,1025]],"parts":[[[418,508],[542,575],[542,937],[418,864]],[[558,426],[688,494],[688,856],[558,788]],[[712,346],[825,404],[825,769],[712,703]],[[828,268],[905,230],[1020,298],[1020,697],[938,702],[828,638]]]},"src":"assets/img/campus-renovation/facade-2.jpg","caption":"Media BIPV louver — glass · media BIPV · steel · steel · pipe","r":1.1,"lite":true,"notes":[["","Media BIPV louver","Each louver is a layered panel. Behind the outer glass sits a media BIPV sheet that makes solar power by day and shows images at night, held by two steel plates on a pipe."]]},{"sim":"louver","src":"assets/img/campus-renovation/facade-3.jpg","caption":"Variable permeability — the louver angle sets the light","r":1.1,"lite":true,"notes":[["","Variable permeability","Turned open, the louvers let the low sun reach the floor inside; turned flat, they throw it back out and shade the room. The same facade lets more or less sunlight through."]]}], cols: 3, cw: [0.542, 1.1, 1.1]
      }
    ],
    drawings: [
      {
        src: "assets/img/campus-renovation/detail-plan.jpg",
        caption: "Detail plan — 3rd and 4th floor (Engineering 1), 1/20",
        r: 1.871
      }
    ]
  },
  // 라주니타 (2026-11-22 추가) — 원본: portfolio-source/라주니타. 글은 패널(.ai)의 설명문에서 옮겼어요.
  // 확인 필요: year(원본 파일 날짜 2025.03 기준 추정) · studio · 대지 위치 · 팀 — 사용자에게 받으면 채우기
  {
    slug: "la-junita", blurb: "la junita, 아르헨티나 단독주택",
    title: "Flowing layers",
    titleKo: "아르헨티나 단독주택",
    subtitle: "A house for a family of four on a slope above the river — masses that step down the ground, each one turned to the water",
    type: "House",
    year: "2025",
    studio: "",
    award: "",
    program: "단독주택 (4인 가족 + 손님)",
    site: "Los Dorados Avenue",
    area: "",
    team: "3인 공동작품", // 핀 #184
    tools: "",
    cover: "assets/img/la-junita/aerial.jpg",
    coverR: 1.577, // 대표사진 가로/세로 (머리 배치용)
    coverCaption: "Aerial view — the masses stepping down toward the river",
    summary:
      "A home is more than a shelter; it is where life unfolds and memories are made. Designed for a family of four while welcoming guests with warmth and privacy, the house steps down a slope toward the river — open to natural light, with seamless passages between indoors and outdoors.",
    sections: [
      { heading: "Masses on the Slope", big: true, /* 핀 #187: 아래 평면과 같은 크기 */ text: "The masses were first laid along an axis that flows down the slope. Those running east to west were shifted south so none overlaps and every room gets daylight, and each mass along the slope opens to a view of the river. The land left over became a courtyard, keeping as many of the existing trees as possible.", images: [{ src: "assets/img/la-junita/site-plan.jpg", caption: "Site plan", r: 1.42, w: "min(100%, calc((100vh - 330px) * 1.385));margin-inline:auto" }] },
      // 핀 #137·#138: 두 층 평면을 같은 축척·같은 자리로 겹쳐 스크롤로 넘김 — 그리드 이름·치수(축척 막대로 잰 값, mm)·프로그램 번호는 사이트 글자
      { heading: "Two Levels on One Grid", big: true, text: "The lower level and the entrance level drawn at the same scale and laid on the same spot — scroll up a level. The grid lines run through both floors; dimensions are in millimetres between grid lines.", images: [], seq: {"kind":"frames","fade":true,"below":true,"r":1.385,"steps":[{"src":"assets/img/la-junita/plan-lower.jpg","t":"Lower level","s":"a few steps down, the house ends at the river","d":"A second living room connects to the two children's rooms and a bathroom. An open void with a stand and stair brings the family together, and a loft above the master bedroom adds variety. Glass on three sides brings light and the river in; large openings help passive heating, and a partition wall hides the utilities.","k":[["01 Living room","glass on three sides toward the river"],["02 Music hall","beside the open lounge"],["03 Master bedroom","with a loft above"],["04 Bedrooms","two children's rooms"],["05 Infinity pool","extending from the living room"],["06 Outdoor lounge · garden","sunken where the pool meets the garden"]],"tags":[[36,17.4,"X1","","m"],[43.7,17.4,"X2","","m"],[48.1,17.4,"X3","","m"],[56.8,17.4,"X4","","m"],[62.6,17.4,"X5","","m"],[71.6,17.4,"X6","","m"],[39.5,21,"8,000","c","m"],[45.6,21,"4,600","c","m"],[52.1,21,"9,000","c","m"],[59.3,21,"6,000","c","m"],[66.8,21,"9,400","c","m"],[19.9,32,"Y5","","m"],[19.9,48.1,"Y4","","m"],[19.9,57.2,"Y3","","m"],[19.9,68.5,"Y2","","m"],[19.9,80.8,"Y1","","m"],[19.5,41.2,"12,000","","m"],[19.5,53.8,"6,800","","m"],[19.5,64,"8,500","","m"],[19.5,75.9,"9,200","","m"],[78.4,95.3,"0","c","m"],[83.2,95.3,"5","c","m"],[88,95.3,"10","c","m"],[97.7,95.3,"20 m","c","m"],[50.2,54.9,"01","c pt"],[50.2,64.3,"02","c pt"],[58.8,77.2,"03","c pt"],[66.8,76.9,"04","c pt"],[39.2,57.7,"05","c pt"],[54,40.3,"06","c pt"]]},{"src":"assets/img/la-junita/plan-upper.jpg","t":"Entrance level","s":"by car and on foot from Los Dorados Avenue","d":"The main entrance sits on the east side. From the door the guest lounge opens to the river, while a corridor leads to two guest rooms with terraces — the guest wing stays apart, so the family keeps its privacy.","k":[["01 Guest lounge","living room at the door, facing the river"],["02 Open lounge","double-height void over the lower lounge"],["03 Guest rooms","two rooms with their own terraces"],["04 Multiroom · bedrooms","children's rooms above the stand"],["05 Parking","from Los Dorados Avenue"],["06 Living · dining","the family wing at the top of the slope"]],"tags":[[53.7,17.4,"X3′","","m"],[56.8,17.4,"X4","","m"],[62.6,17.4,"X5","","m"],[68.8,17.4,"X5′","","m"],[71.7,17.4,"X6","","m"],[80.5,17.4,"X7","","m"],[82.8,17.4,"X7′","","m"],[54.9,21,"3,300","c","m"],[59.4,21,"6,000","c","m"],[65.4,21,"6,400","c","m"],[69.9,21,"3,000","c","m"],[75.8,21,"9,200","c","m"],[81.3,21,"2,300","c","m"],[19.9,32,"Y5","","m"],[19.9,48.1,"Y4","","m"],[19.9,57.2,"Y3","","m"],[19.9,68.5,"Y2","","m"],[19.9,80.8,"Y1","","m"],[19.5,41.2,"12,000","","m"],[19.5,53.8,"6,800","","m"],[19.5,64,"8,500","","m"],[19.5,75.9,"9,200","","m"],[78.4,95.3,"0","c","m"],[83.2,95.3,"5","c","m"],[88,95.3,"10","c","m"],[97.7,95.3,"20 m","c","m"],[59.3,75.1,"01","c pt"],[58.8,64.7,"02","c pt"],[66.4,77.2,"03","c pt"],[74.4,40.3,"04","c pt"],[70.9,26.4,"05","c pt"],[74.4,54.9,"06","c pt"]]}]} }, // 핀 #188: 아래층부터
      { heading: "Materials", text: "Stone, brick, steel, glass and wood, balanced between the modern and the natural. Stone and brick ground the house; glass lets in light and the river; steel carries the open spaces; wood brings warmth inside. Outside, the pool extends from the living room toward the river, and a sunken lounge sits where the pool meets the garden.", big: true, images: [], seq: {"kind":"lead","src":"assets/img/la-junita/axo.jpg","r":1.159,"n":8,"steps":[{"t":"The house on the slope","s":"three masses stepping down to the river"},{"t":"Roofs lifted","s":"flat roofs drawn off the walls"},{"t":"Entrance level","s":"door, guest lounge and the open void"},{"t":"Brick, glass and steel","s":"the materials that hold the rooms"},{"t":"Pool and garden","s":"the house runs out toward the river"}],"L":[["l",41.7,37,"Flat roof, gravel, steel edge fascia",1],["r",44.6,60.5,"Roof over the family wing",1],["r",58.5,60.5,"Roof over the guest wing, stepped lower",1],["l",60.2,40,"Pedestrian access from the east",2],["l",65.7,24.5,"Vehicular access and parking",2],["r",66.6,54.5,"Guest lounge",2,1],["r",68.9,59,"Open lounge, double-height void",2,1],["l",71.2,31,"Parking court",2,1],["r",73,65,"Floor-to-ceiling low-E glass, slim steel frames",3],["l",75.3,50.5,"Dark clay brick, running bond",3],["r",76.4,62,"Terrazzo and oak floors",3],["l",78.6,46,"Terraced lawn steps, native planting",4],["r",82.2,69,"Infinity pool, mosaic tile, stone coping",4],["l",86.5,57.5,"Sunken lounge where pool meets garden",4,1]]} },
      { heading: "Scenes", text: "The house from the garden and the river side, and the living spaces inside.", images: [{ src: "assets/img/la-junita/exterior-1.jpg", caption: "Exterior", r: 1.577 }, { src: "assets/img/la-junita/exterior-2.jpg", caption: "Pool and garden", r: 1.577 }, { src: "assets/img/la-junita/interior-1.jpg", caption: "Living room", r: 1.502 }, { src: "assets/img/la-junita/interior-2.jpg", caption: "Interior", r: 1.502 }], stack: true, scenes: true },
    ],
  },
  // 유치원 (2026-11-23 추가) — 원본: portfolio-source/유치원 프로젝트 (KG 시트 11장). 그림은 원본 벡터에서 글자·지시선 레이어를 숨기고 뽑았고, 글은 시트의 설명문을 옮겼어요. 메모: portfolio-source/_kg-work/NOTES.md
  {
    slug: "natural-palette", blurb: "호수부터 숲까지, 유희 레이어 유치원",
    title: "Natural Palette",
    titleKo: "호수부터 숲까지, 유희 레이어 유치원",
    subtitle: "A kindergarten on the slope between the lake and the forest — six play grounds that climb from the water to the trees",
    type: "Education",
    year: "2023",
    studio: "Design Studio 2 · 2023-2",
    award: "",
    program: "유치원 · 신축 (5·6세반, 7세반, 특수학급)",
    site: "호수와 숲 사이 경사지",
    area: "실내 약 1,128 m² · 건축 투영 약 737 m² · 지붕 데크 약 506 m²",
    team: "단독작품", // 핀 #186
    tools: "",
    cover: "assets/img/natural-palette/render-main.jpg", // 2026-11-24 사용자 요청: 렌더 메인샷을 대표사진으로
    coverR: 1.1019, coverWide: true, coverFull: true, // 핀 #218: 화면 꽉 채움 // 핀 #198: 대표사진 크게 — 맨 위 화면 높이 가득(가로형 머리 배치)
    thumb: "assets/img/natural-palette/render-entrance.jpg", // 2026-11-24 사용자 요청: studio 카드 = 이게찐(입구 홀), 작품 페이지 대표 = 메인샷
    coverCaption: "The kindergarten across the lake, the forest behind",
    summary:
      "A kindergarten on a slope that falls about 14 m from the forest to the lake. The slope is set into two grounds — the lake ground at the level of the road and the forest ground a floor above — and a three-storey building is slid in between, carved by a hall and a light well so that children on every floor see and hear each other. What is left of the slope becomes six play grounds — lake, deck, sand, garden, small forest and forest — climbing one step at a time. Reinforced concrete, wrapped in ipe.",
    sections: [
      { heading: "Between the Lake Road and the Wooded Hill", big: true, // KG-04 배치도와 대지 분석
        text: "The site is a slope that climbs from the reservoir road on the east to the wooded hill on the north-west. The road side takes the drop zone, the main entrance and the parking, so cars end at the front of the site; the light well and the play yards step back from the noise and the eyes of the road, one level at a time toward the forest. The forest entrance on the second floor and the forest yard join the hill path directly.",
        images: [{"src":"assets/img/natural-palette/site.jpg","caption":"Site plan — roof plan between the lakeside road and the hill, structural grid X1–X10 · Y1–Y9, dimensions in mm","r":1.154,"tags":[[27.24,7.62,"X1","c","m"],[29.95,7.62,"X2","c","m"],[32.27,7.62,"X3","c","m"],[34.58,7.62,"X4","c","m"],[38.23,7.62,"X5","c","m"],[45.41,7.62,"X6","c","m"],[48.9,7.62,"X7","c","m"],[51.2,7.62,"X8","c","m"],[59.63,7.62,"X9","c","m"],[70.4,7.62,"X10","c","m"],[85.52,67.18,"Y1","","m"],[85.52,63.99,"Y2","","m"],[85.52,58.65,"Y3","","m"],[85.52,55.25,"Y4","","m"],[85.52,51.21,"Y5","","m"],[85.52,46.76,"Y6","","m"],[85.52,44.68,"Y7","","m"],[85.52,37.62,"Y8","","m"],[85.52,31.55,"Y9","","m"],[17.63,27.62,"Forest entrance · 2F S.L +3.9 →","r","m fl"],[18.79,63.2,"Main entrance · 1F S.L ±0 →","r","m fl"],[52.05,26.69,"Forest yard","c","m fl"],[54.36,35.22,"Garden","c","m fl"],[54.36,42.55,"Sand yard","c","m fl"],[54.36,50.01,"Play deck","c","m fl"],[35.19,31.75,"Roof classroom","c","m fl"],[66.14,61.87,"Parking","c","m fl"],[32.3,67.2,"Drop zone","c","m fl"],[63.25,80.52,"Car access ↑","c","m fl"],[14,78.6,"Lakeside road","c","b fl"],[50,94.6,"Reservoir","c","b fl"]],"w":"min(86%, calc((100vh - 170px) * 1.154));margin-inline:auto","dims":[[27.24,12.94,70.4,12.94,"36,879"],[27.24,16.57,29.95,16.57,"2,318"],[29.95,16.57,32.27,16.57,"1,976"],[32.27,16.57,34.58,16.57,"1,976"],[34.58,16.57,38.23,16.57,"3,116"],[38.23,16.57,45.41,16.57,"6,137"],[45.41,16.57,48.9,16.57,"2,983"],[48.9,16.57,51.2,16.57,"1,967"],[51.2,16.57,59.63,16.57,"7,210"],[59.63,16.57,70.4,16.57,"9,196"],[80.55,67.18,80.55,31.55,"26,391"],[76.73,67.18,76.73,63.99,"2,366"],[76.73,63.99,76.73,58.65,"3,952"],[76.73,58.65,76.73,55.25,"2,517"],[76.73,55.25,76.73,51.21,"2,993"],[76.73,51.21,76.73,46.76,"3,296"],[76.73,46.76,76.73,44.68,"1,539"],[76.73,44.68,76.73,37.62,"5,235"],[76.73,37.62,76.73,31.55,"4,493"]],"grid":[[27.24,8.88,27.24,74.27],[29.95,8.88,29.95,74.27],[32.27,8.88,32.27,74.27],[34.58,8.88,34.58,74.27],[38.23,8.88,38.23,74.27],[45.41,8.88,45.41,74.27],[48.9,8.88,48.9,74.27],[51.2,8.88,51.2,74.27],[59.63,8.88,59.63,74.27],[70.4,8.88,70.4,74.27],[22.24,67.18,84.18,67.18],[22.24,63.99,84.18,63.99],[22.24,58.65,84.18,58.65],[22.24,55.25,84.18,55.25],[22.24,51.21,84.18,51.21],[22.24,46.76,84.18,46.76],[22.24,44.68,84.18,44.68],[22.24,37.62,84.18,37.62],[22.24,31.55,84.18,31.55]]}] },
      { heading: "Four Readings of the Site", cols: 4, // KG-04 A–D
        text: "Sun, view, noise and access — the four things the slope gives and takes.",
        images: [{"src":"assets/img/natural-palette/sun.jpg","caption":"A Sun — open to the south and east. Classrooms and the play deck take the low winter sun; the light well lets the high summer sun in deep.","r":0.9017,"tags":[[44.4,3.9,"W","c","m"],[11.6,45.9,"S","c","m"],[44.4,96.4,"E","c","m"],[40,70.2,"Winter solstice","","m"],[38.2,82,"Summer solstice","","m"],[62.6,45.6,"Light well","","m"]]},{"src":"assets/img/natural-palette/view.jpg","caption":"B View — the water below, the forest ridge above. The first floor looks at the lake; the second, the third and the roof classroom look at the forest.","r":0.8989,"tags":[[31,9.8,"Forest ridge","c","m"],[93.1,10.2,"Forest","c","m"],[57.3,95.8,"Reservoir","c","m"]]},{"src":"assets/img/natural-palette/noise.jpg","caption":"C Noise — the road is filtered by the front yard, the street trees and the parking block; the play yards withdraw inside the building.","r":0.9043,"tags":[[49.1,37.5,"Quiet yard","c","m"],[10.2,83.2,"Road","","m"]]},{"src":"assets/img/natural-palette/access.jpg","caption":"D Access — cars end at the drop zone and the parking on the road. Children walk in two ways: the main door on the first floor, the forest door on the second.","r":0.9014,"tags":[[10.6,3.9,"Walk","","m"],[25.9,3.9,"Car","","m"],[13.9,13.2,"Forest entrance","","m"],[15.7,55.6,"Main entrance","c","m"],[24.8,63.5,"Drop zone","c","m"]]}] },
      { heading: "Read, Insert, Carve, Play", big: true, // KG-07 매스 과정
        text: "The slope that falls from the forest to the lake is set into two flat grounds, and a three-storey mass is slid in between. The middle of the mass is carved so light and eyes reach the play deck on the first floor; the rest of the slope is cut into sand, garden and small-forest yards that children climb one step at a time.",
        images: [],
        seq: {"kind":"frames","k":0.6,"fade":true,"below":true,"r":1.1755,"steps":[{"src":"assets/img/natural-palette/mass-1.jpg","t":"Read the slope","s":"From the forest (S.L +11) to the lake (W.L −3.0), the ground falls about 14 m.","d":"The road runs halfway down, at S.L ±0 — the level every ground of the building is measured from.","tags":[[62.7,9.9,"Forest on the hill\nS.L +3.8 → +11","","m nl"],[22.9,76.1,"Lakeside road\nS.L ±0","c","m nl"],[74.7,83.5,"Lake\nW.L −3.0","","m nl"]]},{"src":"assets/img/natural-palette/mass-2.jpg","t":"Two grounds","s":"The slope is set into a lake ground (±0) and a forest ground (+3.8).","d":"The building takes its place on the edge between the two.","tags":[[55.9,15.2,"Forest ground · S.L +3.8","","m"],[22,67.4,"Lake ground · S.L ±0","c","m"]]},{"src":"assets/img/natural-palette/mass-3.jpg","t":"Insert the mass","s":"Three floors slid into the edge.","d":"The first floor meets the lake ground, the second meets the forest ground, and the third opens over the trees.","tags":[[18.3,16,"3F — a classroom open over the forest","","m"],[77,33.5,"2F — meets the forest","","m"],[81.1,57.8,"1F — meets the road and the lake","","m"]]},{"src":"assets/img/natural-palette/mass-4.jpg","t":"Carve the voids","s":"The light well (c), the hall (b) and the void over the entrance (a).","d":"Carved out so that light and eyes come down to the play deck on the first floor.","tags":[[13.5,27.8,"b Hall","r","m"],[17.8,53.9,"a Entry void","r","m"],[66.2,25.9,"c Light well","","m"]]}]} },
      { heading: "Two Grounds, One Hall", big: true, // KG-06 분해 엑소
        text: "The building sits between two grounds of different height. The first floor meets the road and the lake ground (S.L ±0); the second meets the forest ground (S.L +3.9). Three voids thread them together — the void over the entrance, the hall linking the second and third floors, and the light well over the play deck — so a child on any floor sees and hears the play above and below.",
        cols: 2, cw: [3, 1],
        images: [{"src":"assets/img/natural-palette/axo.jpg","caption":"Exploded axonometric — the lake ground, the forest ground and the voids that join them","r":1.0776,"tags":[[69.1,10.8,"3F — roof classroom and sun terrace · S.L +7.6","","m"],[99,41.1,"2F — forest ground · S.L +3.9","r","m"],[98.5,77.2,"1F — lake ground · S.L ±0","r","m"],[12.2,40.2,"b Hall","r","m"],[23.9,60,"a Entry void","r","m"],[68,59.8,"c Light well","","m"]],"notes":[["1F","Lake ground","Entrance, welcome room, classrooms, open library — one floor out to the play deck and the sand yard, level with the road."],["2F","Forest ground","Forest entrance, dining, assembly hall, special class — at the height of the hill, looking down onto the garden and the forest yard."],["3F","Open classroom","A hand-wash corner over the hall, the roof garden and the sun terrace — a classroom open to the sky at the height of the forest."],["a·b·c","Three voids","Entry void (1↔2F), hall (2↔3F), light well (deck↔sky). On different floors, the children still see and hear each other."]]},{"src":"assets/img/natural-palette/axo-concept.jpg","caption":"Concept section — one hall between the lake ground and the forest ground","r":0.9529,"tags":[[53.5,5.2,"Hall","c","m"],[13.5,86.7,"Lake ground ±0","","m"],[98,65.7,"Forest ground +3.9","r","m"]]}] },
      { heading: "Four Strategies", big: true, // KG-08
        text: "Classrooms open to yards, the corridor loops around the light well, and two entrances sit on two grounds of different height. Floor by floor, the ground changes from the road and the lake to the forest and the sky.",
        images: [],
        seq: {"kind":"frames","fade":true,"below":true,"r":1.1414,"steps":[{"src":"assets/img/natural-palette/strategy-a.jpg","t":"Classroom + yard","s":"Each classroom opens onto its own yard.","d":"The 5–6 class opens west through folding doors onto the play palette, the 7 class north onto the play deck. With the doors open, room and yard become one play space, and the deck steps on to the sand yard and the garden.","tags":[[63.4,26.7,"Garden +1.8","c","m"],[63.7,41.4,"Sand yard +0.8","c","m"],[63.7,54.5,"Play deck ±0","c","m"],[19.3,68.3,"Play palette","c","m"],[41,51.2,"Welcome room","c","m"],[40.1,77.7,"Class 5–6","c","i"],[65.6,77.7,"Class 7","c","i"]]},{"src":"assets/img/natural-palette/strategy-b.jpg","t":"A loop around the light well","s":"The second-floor corridor goes once around the light well.","d":"It links the dining room, floor play, the assembly hall and the hall. With no dead end, children never walk back the same way, and all along they see the play deck below and the sky above. The north side of the well becomes a bridge over the sand yard.","tags":[[23.2,4.1,"Forest entrance +3.9","","m"],[21.3,19.7,"Director · counselling","c","m"],[15.4,37.7,"Special class","c","i"],[32.6,45.3,"Hall — open three floors","c","m"],[63.1,59.5,"Light well","c","m"],[84.9,53.1,"Floor play","c","m"],[45.6,80.4,"Dining","c","m"],[68.7,80.9,"Kitchen","c","m"],[86.4,78,"Assembly hall","c","m"]]},{"src":"assets/img/natural-palette/strategy-c.jpg","t":"Two grounds, two doors","s":"The main door on the lakeside road, the forest door on the hill.","d":"Main entrance on the first floor (S.L ±0), forest entrance on the second (S.L +3.9). Inside, the hall stair and the lift join the two grounds; outside, the play grounds do — deck, sand, garden, small forest.","tags":[[21.5,28.1,"Forest entrance · 2F","","m"],[80.9,34,"Main entrance · 1F","","m"],[94.3,30.1,"S.L +3.9","","m"],[94.3,35.7,"S.L ±0","","m"],[10.1,78.3,"1F indoor","c","m"],[24.3,78.3,"Play deck ±0","c","m"],[38.1,71.9,"Sand +0.8","c","m"],[53.5,64.4,"Garden +1.8","c","m"],[68,56.5,"Small forest +2.8","c","m"],[82.8,48.9,"Forest · 2F +3.8","c","m"]]},{"src":"assets/img/natural-palette/strategy-d.jpg","t":"Program by floor","s":"A different ground on each floor.","d":"First floor, the ground of the road and the lake: classrooms, the welcome room, the open library. Second, the ground of the forest: big rooms — dining, assembly, floor play — and the special class. Third, the ground of the sky: the roof garden, the sun terrace and the open classroom on the roof.","tags":[[3.7,7.3,"3F — ground of the sky · S.L +7.6","","m"],[3.7,41.8,"2F — ground of the forest · S.L +3.9","","m"],[3.7,77.6,"1F — ground of the road and lake · S.L ±0","","m"],[30.4,6.8,"Open classroom","c","i"],[21.8,47.7,"Special class","c","i"],[49.6,89.9,"Class","c","i"],[65.3,86.4,"Class","c","i"],[37.1,77.3,"Library","c","m"],[80.2,50.6,"Assembly hall","c","m"],[54.3,56.5,"Dining","c","m"]]}]} },
      { heading: "Three Floors on One Slope", big: true, // 핀 #195: 평면 시뮬레이션 — 1F(KG-03A)·2F·3F(KG-03B)를 같은 축척·같은 자리로 맞춰 스크롤로 층이 바뀜
        text: "The first floor starts level with the road (S.L ±0): past the entrance and the welcome room are the hall that threads three floors and the open library, and the classrooms open through folding doors to the deck and the yards. The second floor is entered from the forest ground — dining and kitchen, the assembly hall and the special class. The third floor opens to the forest and the sky. Scroll through the floors; each number is named beside the plan.",
        images: [],
        fplan: {"r":1.2269,"floors":[{"t":"1F","s":"S.L ±0 · lake side","src":"assets/img/natural-palette/plan-1f.jpg","items":[[1,17.94,23.62,"Plant","Mechanical and electrical room, tucked into the slope."],[2,23.14,23.62,"WC","Toilets sized for children, beside the rooms they serve."],[3,35.29,23.35,"Maze play","An open exhibition maze sunk 0.85 m below the floor."],[4,17.55,38.06,"Staff","Teachers' room, looking over the hall."],[5,24.02,37.51,"Meeting","Meeting room for teachers and parents."],[6,37.06,37.23,"Open library","Books in the open, at the foot of the hall."],[7,62.25,41.25,"Sand yard","Sand play at +0.8, one step above the deck."],[8,40.49,53.22,"Entrance hall","The way in from the road side."],[9,42.84,61.53,"Welcome room","Where parents wait and children are handed over."],[10,63.63,57.33,"Play deck","Outdoor deck at ±0 under the light well, joined to Class 7."],[11,26.67,69.29,"Play palette","The classroom yard — folding doors open the room onto it."],[12,40.2,79.25,"Class 5–6","Classroom for five- and six-year-olds, opening west to the play palette."],[13,54.9,76.97,"WC","Toilets sized for children, beside the rooms they serve."],[14,64.8,78.43,"Class 7","Classroom for seven-year-olds, opening north onto the play deck."],[15,86.18,80.62,"Parking","Parking at the road edge, so cars stop at the front."],[16,24.31,88.29,"Drop zone","Drop-off lane off the lakeside road."],[17,8.04,79.8,"Main entrance","Main entrance at road level, S.L ±0."]]},{"t":"2F","s":"S.L +3.9 · forest side","src":"assets/img/natural-palette/plan-2f.jpg","items":[[1,16.52,17.48,"Director","Director's office by the forest entrance."],[2,23.54,17.95,"Counsel","Counselling room for parents."],[3,29.27,17.48,"Entry","Lobby of the forest entrance."],[4,36.66,17.48,"WC","Toilets sized for children, beside the rooms they serve."],[5,45.44,9.49,"Terrace","A terrace on the roof of the floor below."],[6,57.26,9.95,"Forest yard","Forest play joined to the hill path."],[7,63.45,25.2,"Garden yard","Kitchen-garden play at +1.8, close to the dining room."],[8,19.75,37.93,"Special class","Special class with its own garden side."],[9,36.66,34.86,"Hall","The hall that threads all three floors."],[10,61.42,38.95,"Sand yard below","Looking down onto the sand yard."],[11,82.67,38.21,"Terrace","A terrace on the roof of the floor below."],[12,84.42,50.48,"Floor play","Indoor play on the floor, around the light well."],[13,63.45,58.2,"Light well","The open well that brings light and eyes down to the deck."],[14,26.03,69.72,"Play palette below","The classroom yard one floor down."],[15,42.11,77.07,"Staff dining","Dining for teachers, beside the kitchen."],[16,53.57,78.92,"Dining","Children's dining room, next to the kitchen."],[17,67.79,83.85,"Kitchen","Kitchen serving the dining room."],[18,85.72,78.65,"Assembly hall","A tall room for games, shows and rainy days."],[19,8.94,13.2,"Forest entrance","Second entrance from the forest ground, S.L +3.9."]]},{"t":"3F","s":"S.L +7.6 · roof","src":"assets/img/natural-palette/plan-3f.jpg","items":[[1,20.41,9.38,"Roof garden","Planted roof over the floor below."],[2,35,9.38,"Open classroom","A classroom on the roof, open to the forest and the sky."],[3,20.22,31.97,"Sun terrace","Sunny deck on the roof."],[4,48.86,45.26,"Hand-wash corner","Hand-washing over the hall."],[5,35.84,39.87,"Hall below","The hall seen from the top floor."]]}]} },
      { heading: "Classroom Unit — a Room That Becomes a Yard", big: true, // KG-12
        text: "The two classrooms on the first floor share the toilets in the middle and open three ways: sliding doors to the corridor by the welcome room, the 5–6 class's folding doors to the play palette, the 7 class's folding doors to the play deck under the light well. How far the doors open decides whether the classroom is a room, a corridor or a yard.",
        images: [{"src":"assets/img/natural-palette/unit.jpg","caption":"Classroom unit 1/100 — two classrooms, one shared core, three ways to open","r":1.4191,"tags":[[32,11.3,"Entrance hall","c","m"],[36.6,29.2,"Welcome room","c","m"],[75.8,20.2,"Play deck","c","m"],[6.1,46.1,"Play palette","c","m"],[32.5,67.5,"Class 5–6","c","b"],[59.3,62.6,"WC","c","m"],[77.7,65.2,"Class 7","c","b"],[19.5,79.4,"1","c","pt"],[88.9,35.9,"2","c","pt"],[47.2,43.1,"3","c","pt"],[58.7,43.1,"3","c","pt"],[60.2,71.4,"4","c","pt"],[79.8,81.8,"5","c","pt"],[28.6,41.4,"6","c","pt"]],"w":"100%","notes":[["1","Folding doors","to the play palette"],["2","Folding doors","to the play deck"],["3","Sliding doors","to the welcome room and the corridor"],["4","Shared toilets","used by both classrooms"],["5","Coffered ceiling","raised in each classroom"],["6","Teacher's desk","at the corner by the corridor"]]}] },
      { heading: "Three States of Opening", // KG-12 A–C
        text: "2 classrooms on the road side at FL ±0 · 1 shared core · 4 doors — 2 folding, 2 sliding — to three outsides · 2 outdoor classrooms, the play palette to the west and the play deck under the light well.",
        images: [], // 핀 #327: 세 장을 스크롤로 한 단계씩 넘기는 장면으로
        seq: { kind: "frames", r: 1.4083, fade: true, tag: true, below: true, steps: [
          { src: "assets/img/natural-palette/unit-closed.jpg", t: "A Closed", s: "each class its own room", d: "Each class its own room: circle time, activities, quiet voices." },
          { src: "assets/img/natural-palette/unit-hall.jpg", t: "B To the hall", s: "sliding doors open", d: "With the corridor's sliding doors open, both classes join the welcome room and play crosses from one class to the other." },
          { src: "assets/img/natural-palette/unit-yards.jpg", t: "C To the yards", s: "folding doors folded away", d: "With the folding doors folded away, the classroom becomes a yard that reaches the play palette and the play deck." },
        ] },
      },
      { heading: "From the Forest Floor to the Lake — Sectional Perspectives", big: true, stack: true, // KG-09A · 09C
        text: "Two cuts through A–A′, looking north. The first steps through the 7 class and the light well, then turns to pass through the hall: the first floor, entered from the lakeside road at S.L ±0, is buried under the forest ground at S.L +3.8 on the left; the light well opens from the play deck to the sky, the hall from the second floor to the roof. The second keeps the final section as the cut and pushes the rooms behind it back in one-point perspective — from the wall buried in the forest soil, through the two-storey hall and the entrance, to the lakeside road and the lake.",
        images: [{"src":"assets/img/natural-palette/section-stepped.jpg","caption":"Sectional perspective A–A′, stepped cut through the classroom, the light well and the hall — eye level of a child standing on the forest ground, S.L +4.7","r":2.4576,"tags":[[4.9,46.3,"Forest terrace","c","m"],[32.2,42.5,"Hall — 2F to roof","c","b"],[52.7,42.2,"Light well — open to the sky","c","b"],[72.4,43.5,"Dining","c","b"],[19.7,68.3,"Maze play","c","m"],[30.2,68.3,"Open library","c","m"],[52.7,74.5,"Play deck","c","b"],[74.2,68.3,"Class 7","c","b"],[93.1,57.8,"Lake road","c","m"],[97,6,"RF +11.8","r","m lvl"],[97,22.8,"RF +9.3","r","m lvl"],[97,34.2,"3F +7.6","r","m lvl"],[97,59.2,"2F +3.9","r","m lvl"],[97,85.3,"1F ±0","r","m lvl"]],"w":"100%"},{"src":"assets/img/natural-palette/section-final.jpg","caption":"Sectional perspective A–A′ on the final section — forest, hall, classrooms, lake road and lake; eye level of a child in the second-floor hall","r":2.5211,"tags":[[1.3,30.8,"Forest","c","m"],[11.4,28.2,"Open classroom","c","m"],[23.8,26.7,"Hall","c","m"],[37.5,26.7,"Hand-wash corner","c","m"],[9.3,49.4,"Forest entrance","c","m"],[16.2,49.4,"WC","c","m"],[36,49.4,"Hall stair","c","b"],[49.5,49.4,"Corridor","c","m"],[64.9,49.4,"Dining","c","b"],[74.2,49.4,"Terrace","c","m"],[25.7,69.7,"Maze play","c","m"],[35.5,69.7,"Open library","c","b"],[46.9,69.7,"Entrance","c","m"],[53.2,69.7,"Welcome","c","m"],[65.6,69.7,"Class 5–6","c","b"],[96.6,67.7,"Lake","c","m"],[91,79.8,"Lake road","c","m"],[97.6,15.4,"RF +11.8","r","m lvl"],[97.6,33,"RF +8.8","r","m lvl"],[97.6,39.7,"3F +7.6","r","m lvl"],[97.6,58.6,"2F +3.9","r","m lvl"],[97.6,81.7,"1F ±0","r","m lvl"]],"w":"100%"}] },
      { heading: "Concrete Wrapped in Timber", big: true, // 핀 #196: KG-13 — 키 엑소 + 확대 상세 4개(원본 벡터 700ppi 캡처), 스크롤로 하나씩, 재료 번호 목록
        text: "The structure is reinforced concrete, the skin is ipe. Scroll down the wall: the roof deck the children climb onto, the ceiling that hides the services, the timber cladding, and the hidden curtain wall. Below, the lower first floor sits on a 900 mm mat — drainage board, insulation, heating screed and engineered timber — with waterproofing and a perforated drain in a gravel trench outside.",
        images: [],
        keyed: {"lw":280,"key":{"src":"assets/img/natural-palette/detail-key.jpg","r":0.8077,"caption":"Wall section, axonometric — roof deck, ceiling, clad wall, hidden curtain wall, floor on the mat"},"items":[{"src":"assets/img/natural-palette/detail-d.jpg","r":1,"t":"Roof deck","d":"A roof the children climb onto. A screed over the insulation sets the fall; the ipe deck floats on galvanised battens fixed by small angle brackets, so water runs away underneath. The parapet is capped with aluminium flashing.","x":79.4,"y":18.8,"notes":[["1","Ipe deck boards"],["2","Galvanised steel batten"],["3","Angle bracket, one bolt"],["4","Screed laid to fall"],["5","Insulation and vapour barrier"],["6","Concrete roof slab"]]},{"src":"assets/img/natural-palette/detail-a.jpg","r":1,"t":"Ceiling hanger","d":"The ceiling drops to the window head (+3.0). Its 360 mm void gathers the supply duct and line diffusers, the sprinkler branches and the cable tray, hung from the slab on threaded rods.","x":80.4,"y":31.6,"notes":[["1","Concrete slab"],["2","Threaded hanger rod, nut and washer"],["3","Hanger clip"],["4","Main carrying channel"],["5","Ceiling runner"],["6","Ceiling board"]]},{"src":"assets/img/natural-palette/detail-c.jpg","r":1,"t":"Cladding fixing","d":"The concrete wall is insulated on the outside and clad in ipe boards over a ventilated cavity; each run of battens hangs from steel brackets bolted back to the wall. Birch plywood lines the inside.","x":55,"y":47.9,"notes":[["1","Ipe cladding boards"],["2","Timber batten, ventilated cavity behind"],["3","Steel bracket, two bolts"],["4","External insulation"],["5","Concrete wall"]]},{"src":"assets/img/natural-palette/detail-b.jpg","r":1,"t":"Curtain-wall base","d":"The window is a hidden curtain wall: its frame is buried in the wall, fixed lights below the transom and project vents above. Each mullion stands in a steel shoe bolted to the slab edge.","x":29.6,"y":63.2,"notes":[["1","Mullion, hidden in the wall"],["2","Glazing on setting blocks"],["3","Steel shoe, bolted"],["4","Base plate on the slab edge"],["5","Concrete upstand"]]}]} },
      // 2026-11-24 사용자 요청: 렌더 (원본 portfolio-source/유치원 프로젝트/렌더, 긴 변 2400px)
      { heading: "Scenes", text: "The kindergarten from the lake and the road, the court behind it, and the way in under the bear.", images: [{ full: true, src: "assets/img/natural-palette/render-main.jpg", caption: "The main view", r: 1.1019 }, { src: "assets/img/natural-palette/render-side.jpg", caption: "Along the slope", r: 1.0939 }, { src: "assets/img/natural-palette/render-court.jpg", caption: "The court between the wings", r: 1.0939 }, { src: "assets/img/natural-palette/render-entrance.jpg", caption: "Entrance hall", r: 1.0643 }], stack: true, scenes: true },
    ],
  },
  {
    "slug": "metaverse-church", "blurb": "디지털 트윈 건축 (메타버스)",
    "title": "Moduleverse Church",
    "titleKo": "메타버스 시스템의 교회공간",
    "subtitle": "One church built twice — a cross of 15,137 one-person modules over the water, and its digital twin in the metaverse",
    "type": "Religious",
    "year": "2023",
    "studio": "공모전",
    "award": "국민일보 미래교회 건축 공모전 입선",
    "program": "교회 · 예배당 · 교육 · 만남 공간 · 디지털 트윈",
    "site": "수공간 위 진입 축",
    "area": "219 × 454 m, EL +297 m · 모듈 15,137개",
    "team": "3인 공동작품", // 핀 #185
    "tools": "",
    "cover": "assets/img/metaverse-church/cover.jpg",
    "coverCaption": "On the axis — the scattered modules close into one cross above the water",
    "coverR": 1.778,
    "summary": "A church is a congregation, not a building. Moduleverse Church breaks the church into 15,137 one-person modules of 3 × 3 × 3 m and scatters them along an approach axis over the water. Off the axis they read as a cloud; only on the axis do they close into one cross, whose arm becomes a world-map plate where believers from every time zone meet. Every module carries an ID and a 1:1 digital twin, so the people on site and remote avatars share the same rooms in real time.",
    "sections": [
      {
        "heading": "Concept — The Digital Twin",
        "text": "The same modules three times: the physical church on the water, the data each module senses — occupancy, footprints, light and sound — and the twin where avatars stand on the same module IDs. A sync loop of sense, mirror, connect and project keeps the two churches within 0.2 s of each other.",
        "images": [
          {
            "src": "assets/img/metaverse-church/concept-twin-stack.jpg",
          "w": "min(100%, 1354px)",
            "caption": "Twin stack — the same 503 modules, three times",
            "r": 1.068
          },
          {
            "src": "assets/img/metaverse-church/concept-sync.jpg",
          "w": "min(100%, 823px)",
            "caption": "Sync loop — sense, mirror, connect, project",
            "r": 1.043
          }
        ]
      },
      {
        "heading": "A Kit for One",
        "text": "One module is one person's room for joining a service in the metaverse: a 120 mm frame, a walkable roof plate, translucent panels with display film and a sensor node that links it to the twin. Opened, a module becomes a path; stacked, a stair; shared, a room for two, four or a whole congregation.",
        "images": [
          {
            "src": "assets/img/metaverse-church/module-kit.jpg",
          "w": "min(100%, 1077px)",
            "caption": "Exploded axonometric — the 3 × 3 × 3 m kit",
            "r": 1.074
          },
          {
            "src": "assets/img/metaverse-church/module-uses.jpg",
          "w": "min(100%, 1183px)",
            "caption": "One module, four uses — closed, open, roof, step",
            "r": 2.556
          },
          {
            "src": "assets/img/metaverse-church/module-puzzle.jpg",
          "w": "min(100%, 1183px)",
            "caption": "Puzzle — modules share faces and become rooms",
            "r": 2.464
          },
          {
            "sim": "steps",
          "src": "assets/img/metaverse-church/module-footprints.jpg",
          "w": "min(100%, 1183px)",
            "caption": "Footprints — afterimages across time zones",
            "r": 3
          }
        ],
        "stack": true
      },
      {
        "heading": "Design Process",
        "text": "Module, extension, dispersion, context and twin: a one-person cell grows into a vertical cross of five layers, disperses by use along the height, settles on a causeway and water space, and is finally copied module by module into the metaverse.",
        "images": [
          {
            "src": "assets/img/metaverse-church/process.jpg",
          "w": "min(100%, 2280px)",
            "caption": "Five steps — module, extension, dispersion, context, digital twin",
            "r": 1.797
          }
        ],
        "stack": true
      },
      {
        "heading": "The Cross on the Axis",
        "text": "Read from the side, the church is a cloud of modules. Walking the causeway onto the axis, the modules line up and the cross completes. The cross-arm at EL +186 to +228 is laid out as a world map, where believers gather on the plate of their own continent.",
        "images": [
          {
            "src": "assets/img/metaverse-church/cross-sequence.jpg",
          "w": "min(100%, 1397px)",
            "caption": "The form completes only on the axis — 90°, 60°, 35°, 15°, 0°",
            "r": 2.629
          },
          {
            "sim": "cross",
          "src": "assets/img/metaverse-church/cross-elevation.jpg",
          "w": "min(100%, 806px)",
            "caption": "Front elevation on the axis and its twin under the water",
            "r": 0.85
          },
          {
            "src": "assets/img/metaverse-church/cross-worldmap.jpg",
          "w": "min(100%, 480px)",
            "caption": "World map — the cross-arm as a meeting plate",
            "r": 0.7
          }
        ],
        "stack": true
      },
      {
        "heading": "Five Vertical Layers",
        "text": "Entry and mission at the water, play and transition, education, meeting and communion on the world-map plate, and the sanctuary at the top. Community density thins and sanctity rises as the modules climb; each layer opens with the same IDs in the twin.",
        "images": [
        {
          "sim": "layers",
          "src": "",
          "caption": "Drag to turn 360° — hover a layer name to isolate it",
          "r": 1.5
        },
          {
            "src": "assets/img/metaverse-church/layers.jpg",
          "w": "min(100%, 2289px)",
            "caption": "Space — five vertical layers of one module, drawn 30 m apart",
            "r": 1.712
          }
        ],
        "stack": true
      },
      {
        "heading": "Plans — Two Floors in One Place",
        "text": "Each layer is cut at its own level and drawn twice: the physical floor, where empty modules read as rooms, and the twin, where the same place fills with remote believers, heat maps of occupancy and the footprints they leave.",
        "images": [
          {
            "sim": "plan",
            "span": true,
          "src": "assets/img/metaverse-church/plan-worldmap-base.jpg",
          "w": "100%",
            "caption": "World-map plate, EL +223.5 — physical and twin",
            "r": 1.8
          },
          {
            "sim": "prog",
            "src": "",
            "caption": "Front of the cross — five layers, five programs; hover a name to hold it",
            "r": 1.7
          },
          {
            "src": "assets/img/metaverse-church/plan-enlarged.jpg",
          "w": "min(100%, 2280px)",
            "caption": "Enlarged plan — glass halls and module rooms",
            "r": 7.389
          }
        ],
        "stack": true
      },
      {
        "heading": "Sections — On the Water, Under the Water",
        "text": "The long section on the axis, the cross section through the world-map plate and an enlarged section through the stepped glass halls. Each is drawn above the water as built and below it as the twin.",
        "images": [
          {
            "src": "assets/img/metaverse-church/sections.jpg",
          "w": "min(100%, 1491px)",
            "caption": "Long and cross sections — physical above, twin below",
            "r": 1.192
          },
          {
            "src": "assets/img/metaverse-church/section-halls.jpg",
          "w": "min(100%, 806px)",
            "caption": "Enlarged section — stepped glass halls",
            "r": 0.783
          }
        ]
      },
      {
        "heading": "A Day of the Twin",
        "text": "The local congregation follows the sun; the twin follows the planet. Over one Sunday the services in Seoul are joined by Los Angeles, London, Lagos and Manila in turn, so the church never goes dark — and the footprints of both worlds overlap on the sanctuary roof.",
        "images": [
          {
            "src": "assets/img/metaverse-church/day-occupancy.jpg",
          "w": "min(100%, 1474px)",
            "caption": "Occupancy by layer — on site above, in the twin below",
            "r": 2.15
          },
          {
            "sim": "clock",
          "src": "assets/img/metaverse-church/day-clock.jpg",
          "w": "min(100%, 789px)",
            "caption": "Who is awake in the twin",
            "r": 1.15
          },
          {
            "src": "assets/img/metaverse-church/day-journeys.jpg",
          "w": "min(100%, 1131px)",
            "caption": "Three journeys — time and elevation",
            "r": 1.737
          },
          {
            "src": "assets/img/metaverse-church/day-footprints.jpg",
          "w": "min(100%, 1131px)",
            "caption": "Footprints exchanged on the sanctuary roof",
            "r": 2.357
          }
        ],
        "stack": true
      }
    ],
    "drawings": []
  },
];

// About / CV — 포트폴리오 PDF 2면 기준 (전화번호·생년월일은 공개 사이트에 싣지 않아요)
// 각 줄: [기간, 이름, 보조 설명(선택), 자세한 내용(선택)]
const CV = {
  intro:
    "성균관대학교 건축학과에서 2027년 2월 졸업을 앞두고 있습니다. 설계사무소 인턴으로 기획설계, Revit 기반 BIM 전환설계와 마감 상세, 현상설계에 참여했고, 공모전과 설계 스튜디오에서 공공·주거·업무 프로젝트를 이어 왔습니다.", // 예전 철학 문장은 philosophy 페이지에
  languages: ["Korean", "English"],
  education: [
    ["2023.03 – 2027.02", "성균관대학교 건축학과", "", "Sungkyunkwan University, Department of Architecture"],
  ],
  experience: [
    // 2026-11-24 요청: 자세한 내용 줄은 뺌. 예전 글:
    //   사이트레스그룹: "화성 봉담 4층 무인호텔 기획설계 및 설계도서 작성 · Revit 기반 BIM 전환설계 및 마감 상세 작성 · 도산공원 현상설계 참여, 이중외피 패널 파라메트릭 설계"
    //   흥찬엔지니어링: "상수도 맨홀·토목시설물 현장조사 및 안전진단 보조 · 비파괴 장비 측정, 조사 결과와 도면 대조 및 데이터 관리"
    ["2024.12 – 2025.03", "사이트레스그룹 건축사사무소", "설계 인턴 · House of Creatives"],
    ["2025.06 – 2025.08", "흥찬엔지니어링", "토목 시설물 안전진단 · 아르바이트"],
  ],
  // [날짜, 대회, 상(빨간 글씨), 작품]
  awards: [
    ["2026.08", "제58회 SKKU DOA 졸업작품전", "설계우수상 · 건축사회상", "RE:TIDE"],
    ["2024.12", "SKKU Design Excellence Award 4", "최우수작품", "Campus Renovation J′"],
    ["2024.12", "제28회 LH 대학생 주택건축대전", "장려상", "Modular O′ housing"],
    ["2024.11", "2024 대한민국 목조건축대전", "서울특별시장상", "Tim(team) Work"],
    ["2024.10", "SKKU Design Excellence Award 3", "최우수작품", "Campus Renovation J′"],
    ["2024.06", "SKKU Design Excellence Award 2", "최우수작품", "Pangyo Green Office"],
    ["2024.04", "SKKU Design Excellence Award 1", "최우수작품", "Pangyo Green Office"],
    ["2023.11", "국민일보 미래교회 건축 공모전", "입선", "Metaverse Church"],
  ],
  activities: [
    ["2026.08 – 2026.11", "제3회 성균건축 졸업논문 집필위원회", "위원장", "'PROCESS' 주제로 집필 방향 수립, 원고 취합·편집·배포 총괄"],
    ["2025.12 – 2026.01", "신세계사이먼 프리미엄 아울렛 건축공모전", "3인 팀 · 팀장", "가로망·밀도·층수를 정량화해 도시 맥락에 대응하는 아울렛 계획"],
    ["2024.07 – 2024.08", "FEAU 동아시아 5개국 건축대학 워크숍", "최종 1위 · 팀장", "태국 · 10인 다국적 팀"],
    ["2024.07 – 2024.08", "Volume Zero 국제공모 · The Tree House", "3인 팀 · 팀장", "한지·레일 모듈 접합의 프리패브 트리하우스 제안, 조립 과정 구체화"],
    ["2024.02 – 2024.04", "YAC 국제공모 · Iron Island", "4인 팀", "폐해양시추선 하부를 파랑·조류 데이터 기반 인공어초형 구조로 전환"],
    ["2024.01 – 2024.03", "HSA & SKKUSOA 연합전시 기획팀", "팀원", "'마감의 육하원칙' 주제의 타 대학 연합전시 기획, 전시 방향 조율"],
    ["2023.06 – 2023.12", "사건사고 건축학회 SGSG", "학회원", "발주자·설계자·시공자 관점의 건설산업 이슈 발제와 라운드테이블 운영"],
    ["2023.01 – 2023.02", "Teraviva 국제공모 · Tactical Urbanism", "2인 팀", "대림동 가로망·유휴공간 분석, 모듈 디바이스 설치 과정 구체화"],
  ],
  certification: [
    ["2026.06", "건설안전기사", "한국산업인력공단"],
    ["2026.01", "투자자산운용사", "한국금융투자협회"],
    ["2025.12", "건축기사", "한국산업인력공단"],
    ["2019.07", "자동차운전면허 1종 보통", "서울특별시경찰청"],
  ],
  courses: [
    ["2025.12 – 2026.01", "건축 BIM 전문가 2급", "필기 교육 수료"],
    ["2024.07 – 2024.08", "FEAU 동아시아 5개국 건축대학 워크숍", "수료"],
  ],
  military: [], // 핀 #123: 사용자 요청으로 뺌 (예전: [["2020.07 – 2022.01", "육군 제3보병사단", "만기전역"]])
  studios: [
    ["Design Studio 7", "Tidal Range Public Facility", "A+"],
    ["Design Studio 6", "Samgakji Residential Project", "A+"],
    ["Design Studio 5", "Seongsu Complex", "A+"],
    ["Design Studio 4", "Campus Renovation", "A+"],
    ["Design Studio 3", "Pangyo Station MP · Office", "A+"],
    ["Design Studio 2", "Terrace Remodeling · Kindergarten", "A+"],
    ["Design Studio 1", "Gate & Information · Artist House", "A"],
    ["Architectural Design 2", "Light Shade · Potential Space, Personal Studio", "A+"],
    ["Architectural Design 1", "Cat Furniture · Reshape Project", "A+"],
  ],
  gpa: "4.3/4.5", // 2026-11-24 요청: Design Studio 목록 오른쪽 아래에 작은 회색 글씨
  // [도구, 숙련도 1–5]
  skills: [
    ["AutoCAD", 5], ["SketchUp", 5], ["Rhino", 4], ["Revit", 3], ["Grasshopper", 4],
    ["D5 Render", 5], ["Enscape", 4],
    ["Illustrator", 5], ["Photoshop", 5], ["InDesign", 3],
    ["Claude", 5], ["ChatGPT", 3],
  ],
};
