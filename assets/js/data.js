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
  name: "YP.STUDIO",
  // 표지 다음 화면의 휘어진 이미지 띠 — [작품 slug, 사진, 가로/세로 비율]. 작품 사진(렌더)만, 작품마다 1~2장
  reel: [
    ["re-tide", "assets/img/re-tide/cover.jpg", 0.859],
    ["motorism", "assets/img/motorism/cover.jpg", 2.034],
    ["timteam-work", "assets/img/timteam-work/cover.jpg", 2.01],
    ["modular-o-housing", "assets/img/modular-o-housing/cover.jpg", 1.778],
    ["samgakji-residential", "assets/img/samgakji-residential/guesthouse.jpg", 1.502],
    ["smart-pixel", "assets/img/smart-pixel/cover.jpg", 1.683],
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
    lead: "인턴·신입 설계직을 찾고 있어요. 편하게 연락 주세요.",
    pdf: "", // 예: "assets/portfolio.pdf" — 원본 PDF를 assets로 옮기면 채워요
    pdfNote: "PDF는 준비 중이에요. 메일로 요청하시면 보내 드려요.",
  },
  // Menu 카드 세 장 (v2 5단계)
  // 첫 화면 카드 네 장 (핀 #35). glyph = 카드 안 모션 아트 글자
  start: [
    { title: "philosophy", glyph: "P", href: "philosophy.html", note: "Answer before image — air and light, structure and joints." },
    { title: "works", glyph: "W", href: "works.html", note: "Selected works, 2022—2027" },
    { title: "about", glyph: "A", href: "about.html", note: "Profile, process and CV" },
    { title: "contact", glyph: "@", href: "#contact", contact: true, note: "Email · Instagram · Portfolio PDF" },
  ],
  pages: [
    { key: "works", title: "works", href: "works.html" },
    { key: "archive", title: "archive", href: "archive.html" },
    { key: "about", title: "about", href: "about.html" },
  ],
  // About 페이지 (v2 8–10단계). draft: true 인 글은 제가 쓴 초안이라 화면에 "Draft"가 붙어요 — 확인 후 draft를 지우면 표시가 사라져요
  about: {
    image2: "assets/img/timteam-work/night-exterior.jpg", // What I do 옆 사진
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
      ["re-tide","assets/img/re-tide/twelve-mounds.jpg",1.348],
      ["re-tide","assets/img/re-tide/water-a.jpg",1.462],
      ["motorism","assets/img/motorism/cover.jpg",2.034],
      ["motorism","assets/img/motorism/district-map.jpg",1.506],
      ["motorism","assets/img/motorism/axonometric.jpg",1.349],
      ["motorism","assets/img/motorism/detail-section-aa.jpg",0.962],
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
      ["smart-pixel","assets/img/smart-pixel/cover.jpg",1.683],
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
    slug: "re-tide",
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
    coverCaption: "Twelve mounds, one tissue — pavilion and lookout tower in the rain", // 대표 이미지 아래 캡션
    summary:
      "Twice a day the sea at the Incheon Inner Port rises and falls by up to 9.62 m. As the port declines, the project reads the tip of its jetty as the frontline where the city meets that water. RE:TIDE hands this edge back from human time to the moon's: twelve mounds grow into one walkable tissue that the tide opens and closes again, twice a day and every fifteen days.",
    sections: [
      { heading: "Site", text: "Incheon Inner Port has been shaped by its history and now sits at the centre of redevelopment debates as its port functions decline. Rather than a redevelopment target, the project reads the tip of the jetty as the frontline where the city meets the water — close to the city, far on foot.", images: [], panel: {"src":"assets/img/re-tide/site-wide.jpg","left":[],"right":[],"notes":[["2.94 km","the only walk in, to Incheon Station"],["3.2 ×","longer on foot than in a line"],["9.62 m","the largest range of the tide"]],"legend":[["F","Port quay, fenced"],["O","Open edge"],["L","Lock gate"],["T","Rail station"],["+","Place, a tenth of its walk"]],"w":"50%","cap":"01 Close to the city, far on foot — each place on its row: on the left the line from the plot, on the right the walk. Wolmido lies 1.07 km across the basin but 68 minutes on foot.","r":1.911} },
      { heading: "Tide — The Moon", text: "The 6-hour tidal cycle and the 15-day spring–neap cycle are the spatial logic. In line with the sun the two pulls add up to a spring range of 8.65 m; at right angles they cancel to a neap range of 3.11 m.", images: [], widget: "moon" },
      { heading: "Tide — Spring and Neap", text: "The moon's 12.42 h and the sun's 12.00 h waves fall in and out of step every 14.77 days — 705 high waters a year, the range swelling from 3.11 m at neap to 8.65 m at spring and 9.62 m at most. Their bands set the plan zones: always dry, wet near spring, wet every day, always wet.", images: [], widget: "springneap" },
      { heading: "Tide — One Tide as a Dial", text: "A low-water stand 19.1 % of the year, B flood 28.9 %, C high-water stand 20.5 %, D ebb 31.4 % — still water four times a day.", images: [], widget: "dial" },
      { heading: "Tide — Twelfths and the Sine", text: "h(t) = Z₀ + A cos(2πt / T − φ), Z₀ +4.75 m, T 12 h 25 min: hour by hour the water rises 1, 2, 3, 3, 2 and 1 twelfths of its range, as the measured tide does; the 9 m section is cut in these layers.", widget: "sine", images: [] },
      { heading: "Twelve Mounds, One Tissue", big: true, text: "Mounds on the eddies, paths on tangent arcs, a reef hollowed below and platforms on the crowns. Programs sit on the mounds and open and close with the tide.", images: [{src: "assets/img/re-tide/twelve-mounds.jpg", caption: "Twelve mounds, one tissue — programs and floor levels", r: 1.348}] },
      { heading: "Flow Layers", text: "Five layers, 21 programs, 58 links: strips from the low outer edge to the high inner ground, each carrying its own programs.", images: [], widget: "flow" },
      { heading: "Rising Water — Simulation", text: "One site at six water levels — the order in which the mounds become islands and go under. White is walkable ground joined to the pier, hatching is ground reached only over a long pavilion, dots are islands cut off by the sea, and a dashed line marks a mound already under water. Drag the bar or press play to run the water up and down.", images: [], sim: { r: 1.462, frames: [
        { src: "assets/img/re-tide/water-a.jpg", level: 2.43, share: "higher 82.5 % of the year", d: "Mean low-water stand. The sea is at its lowest and every mound is joined on foot — 39,512 m² of walkable ground." },
        { src: "assets/img/re-tide/water-b.jpg", level: 4.75, share: "higher 50.0 % of the year", d: "Mean sea level: the water stands higher than this for half the year. The bays fill, but every mound still holds to the pier — 34,233 m² on foot." },
        { src: "assets/img/re-tide/water-c.jpg", level: 5.45, share: "higher 40.9 % of the year", d: "The farthest +8.5 m mound, M10, breaks away first and becomes an island — 31,049 m² on foot." },
        { src: "assets/img/re-tide/water-d.jpg", level: 7.04, share: "higher about 18 % of the year", d: "Mean high-water stand. All five +8.5 m mounds are islands, and M07 is reached only across the stage pavilion — 22,082 m² on foot." },
        { src: "assets/img/re-tide/water-e.jpg", level: 8.5, share: "higher 3.2 % of the year", d: "The +8.5 m mounds go under — on 128 days a year, for 1.7 hours at a time. 18,806 m² stays on foot." },
        { src: "assets/img/re-tide/water-f.jpg", level: 9.24, share: "higher 0.24 % of the year", d: "The 99 % level. M02, M03, M05, M06 and M07 are cut off on the ground, and the library pavilion alone joins them to the pier — 6,914 m² on foot." },
      ], sections: [
        { src: "assets/img/re-tide/section-water.jpg", hi: "assets/img/re-tide/section-water-high.jpg", hiTop: 7.04, wr: "6.6%", r: 7.293, ticks: [[0,0.9267],[2.43,0.8015],[4.75,0.682],[7.04,0.564],[9.5,0.4373],[12,0.3085]], cap: "The long section at the same water — gate mound, library, theatre and sea-pool pavilion" },
      ] } },
      { heading: "Scenes", text: "Nine scenes along one tide — from the curtain pavilion and the sea pool to the library steps and the lookout tower.", images: [{src: "assets/img/re-tide/scene-1.jpg", caption: "Scene 1 — Curtain pavilion", r: 1.54}, {src: "assets/img/re-tide/scene-2.jpg", caption: "Scene 2 — Pavilion from the sea", r: 0.973}, {src: "assets/img/re-tide/scene-4.jpg", caption: "Scene 4 — Sea pool", r: 0.997}, {src: "assets/img/re-tide/scene-3.jpg", caption: "Scene 3 — High tide", r: 1.717}, {src: "assets/img/re-tide/scene-6.jpg", caption: "Scene 6 — Lookout tower", r: 1.048}, {src: "assets/img/re-tide/scene-8.jpg", caption: "Scene 8 — Library steps", r: 0.969}, {src: "assets/img/re-tide/scene-5.jpg", caption: "Scene 5 — Room facing the tower", r: 0.746}, {src: "assets/img/re-tide/scene-7.jpg", caption: "Scene 7 — Under the shell", r: 0.782}, {src: "assets/img/re-tide/scene-9.jpg", caption: "Scene 9 — Pavilion interior", r: 0.765}], stack: true, scenes: true },
    ],
    drawings: [
      {src: "assets/img/re-tide/mound-layout.jpg", caption: "Mound layout — drawing sets A-102, A-103", r: 1.407},
      {src: "assets/img/re-tide/pavilion-layout.jpg", caption: "Pavilion layout — roofs of A-204", r: 1.407},
      {src: "assets/img/re-tide/reef-structure.jpg", caption: "Structure at reef level — A-202", r: 1.403},
    ],
  },
  {
    slug: "motorism",
    title: "Motorism",
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
    coverR: 2.034,
    coverPos: "28% 50%", // 잘려 보일 때 사진의 어느 부분을 보여줄지 (가로% 세로%) — 작을수록 사진이 오른쪽으로 밀려 왼쪽이 더 보여요
    coverCaption: "Stacked bowls on trumpet columns, from Yeonmujang-gil",
    summary:
      "Pop-up stores line Yeonmujang-gil in Seongsu and fade out at its east end, where a public car park sits among car centres. Here the car is already part of everyday culture. Motorism turns that car park into a car complex. Two ramps, A up at 11 % and B down at 9 %, wind through stacked bowls of car museum, drive-thru, F&B and a rooftop showroom.",
    sections: [
      { heading: "District", text: "Yeonmujang-gil, Seongsu: main car-roads, parking around the site, and the point where the pop-up line ends.", images: [], panel: {"src":"assets/img/motorism/district-map.jpg","r":1.506,"w":"62%","left":[],"right":[],"notes":[["250 m","from the site to the main car-roads"],["100 m","to the nearest public parking"],["29","pop-up stores, thinning out east to the site"]],"legend":[["■","Site"],["▨","Parking lot"],["●","Pop-up store"],["⊕","Car destination"]],"cap":"01 District — Yeonmujang-gil, Seongsu. North up; base vectorised from the analysis model, scale from the CAD site plan."} },
      { heading: "Yeonmujang-gil Transect", text: "Yeonmujang-gil is defined by a linear flow of pop-up stores, densest in developed Seoseongsu and fading toward Dongseongsu. The site sits where that flow stops; with parking lots, car centres and the Achasan-ro / Seongsu-iro crossing around it, mobility is already the district's everyday culture — a car-based cultural hub here is both timely and grounded.", images: [{ sim: "transect", src: "", caption: "Transect, west to east — people walk the pop-up line and thin out at the threshold; cars arrive at the site. Scroll to run the strip on", w: "100%", r: 5.6 }] },
      { heading: "Strategy", text: "Linear → ramp → loop. Visitors move along a single line and go out to find content; the ramp lifts movement from horizontal to vertical, layering the limited site into upper, ground and lower levels; on a set route, the content moves toward the visitor — space approaches the user.", images: [], widget: "orbit", seq: {"kind":"frames","r":2.895,"lite":true,"fade":true,"below":true,"k":1,"car":"strategy","steps":[{"src":"assets/img/motorism/strategy-1.jpg","t":"Linear seeking","s":"one line, content found on foot","d":"Visitors move along a single line and go out to find content: black squares are content, red waves experience points."},{"src":"assets/img/motorism/strategy-2.jpg","t":"Ramp as connector","s":"horizontal to vertical","d":"The ramp lifts movement from horizontal to vertical, layering the limited site into upper, ground and lower levels."},{"src":"assets/img/motorism/strategy-3.jpg","t":"Circular arrival","s":"space approaches the user","d":"Vehicles stay on a set route while pop-up content and experiences move toward them: space approaches the user."}]} },
      { heading: "Zoning", text: "Two one-way ramps, one shared centre: A up and B down cross at one point, overlap in a shared centre to gather, start from the centre onto both loops, and hold booths on the outer curves, each tied back to the centre.", images: [], widget: "zoning" },
      { heading: "Stacked Bowls", text: "Two ramps, A up at 11 % and B down at 9 %, wind through stacked bowls of car museum, drive-thru, F&B and a rooftop showroom, carried on trumpet columns.", images: [{src: "assets/img/motorism/axonometric.jpg", caption: "Axonometric — steel deck truss in every slab, two one-way ramps, trumpet columns", r: 1.349}] },
      { heading: "Structure", big: true, cols: 2, cw: [0.5, 0.962], text: "Each storey is a deck truss carried off a trumpet column and wrapped by a bowl of perforated cassettes — one bay read three ways, the load path, the trumpet geometry and erection in four lifts.", images: [{src: "assets/img/motorism/typical-bay.jpg", caption: "Typical bay perspective", r: 0.452}, {src: "assets/img/motorism/detail-section-aa.jpg", caption: "Detail section A–A — mushroom column, ramp edge, parametric skin", r: 0.962}] },
      { heading: "Structure — Load, Shape, Lift", text: "The same bay read for how the load travels, how the trumpet shell is shaped, and how the ground storey goes up.", cols: 2, cw: [1.312, 1.935], images: [{src: "assets/img/motorism/load-path.jpg", caption: "Load path — bracket action", r: 1.312}, {src: "assets/img/motorism/trumpet-geometry.jpg", caption: "Trumpet geometry — GFRC shell profile as a curvature graph", r: 1.935}, {src: "assets/img/motorism/erection.jpg", caption: "Erection — ground storey in four lifts", r: 2.633, span: true}] },
      { heading: "Skin — Why This Pattern", text: "Four fields over one bay, weighted and summed, set how open each cassette is.", cols: 2, images: [{"src":"assets/img/motorism/skin-why-sight.svg","caption":"H — Sight + street","r":2.041},{"src":"assets/img/motorism/skin-why-views.svg","caption":"A — Views","r":2.041},{"src":"assets/img/motorism/skin-why-sun.svg","caption":"S — Sun","r":2.062},{"src":"assets/img/motorism/skin-why-grain.svg","caption":"N — Grain","r":2.049},{"src":"assets/img/motorism/skin-why-result.svg","caption":"Result — open area","r":2.028}] },
      { heading: "Skin — Process", text: "The eight steps of the definition, from the ramp edge to 234 cut cassettes; red marks what each step adds.", cols: 4, images: [{"src":"assets/img/motorism/skin-step-1.svg","caption":"01 Ramp edge + views","r":1.238},{"src":"assets/img/motorism/skin-step-2.svg","caption":"02 Three traced profiles","r":1.238},{"src":"assets/img/motorism/skin-step-3.svg","caption":"03 Sweep the hull","r":1.238},{"src":"assets/img/motorism/skin-step-4.svg","caption":"04 Divide into modules","r":1.238},{"src":"assets/img/motorism/skin-step-5.svg","caption":"05 Four fields","r":1.238},{"src":"assets/img/motorism/skin-step-6.svg","caption":"06 Weight + clamp","r":1.238},{"src":"assets/img/motorism/skin-step-7.svg","caption":"07 One triangle per cassette","r":1.238},{"src":"assets/img/motorism/skin-step-8.svg","caption":"08 Map back + fabricate","r":1.238}] },
      { heading: "Skin — The Definition", text: "The Grasshopper definition: input, hull, grid, the field rule, Ladybug sun, triangle and fabrication — every component checked against the model.", images: [], pan: {"src":"assets/img/motorism/skin-flow.svg","r":12.458,"h":"56vh","build":true,"cap":"Input → hull → grid → sun → the rule → triangle → fabrication; built left to right as you scroll"} },
      { heading: "Skin — One Cassette, One Input", text: "One cassette traced through the rule — then the same bay, re-run live: move one input and every cassette is re-computed.", images: [], widget: "skin" },
      { heading: "Scenes", text: "The car museum inside the bowls, the plaza under them, and the ramp winding past the showroom.", images: [{src: "assets/img/motorism/plaza.jpg", caption: "Plaza under the bowls", r: 1.5}, {src: "assets/img/motorism/interior-museum.jpg", caption: "Car museum", r: 1.778}, {src: "assets/img/motorism/ramp.jpg", caption: "Ramp and showroom", r: 1.5}], stack: true, scenes: true },
    ],
    drawings: [
      {src: "assets/img/motorism/section-a.jpg", caption: "Section A–A′ — through the core and both ramps", r: 1.405},
      {src: "assets/img/motorism/section-b.jpg", caption: "Section B–B′ — through the trumpet columns and the bowls", r: 1.405},
      {src: "assets/img/motorism/plan-b1.jpg", caption: "B1 plan — FL −4,000, parking for 46 cars, MDF room", r: 1.056},
      {src: "assets/img/motorism/plan-1f.jpg", caption: "1F plan — FL ±0, entrance, F&B, pop-up, plaza", r: 1.056},
      {src: "assets/img/motorism/plan-2f.jpg", caption: "2F plan — FL +5,200, car museum, information, exit", r: 1.056},
      {src: "assets/img/motorism/plan-3f.jpg", caption: "3F plan — FL +8,800, car museum, F&B", r: 1.056},
      {src: "assets/img/motorism/plan-4f.jpg", caption: "4F plan — FL +12,200, drive-thru booths (indoor)", r: 1.056},
      {src: "assets/img/motorism/plan-rf.jpg", caption: "RF plan — car showroom, car theatre", r: 1.056},
      {src: "assets/img/motorism/detail-section.jpg", caption: "Detail section A — radial cut at grid X5 / Y5", r: 0.743},
    ],
  },
  {
    slug: "timteam-work",
    title: "Tim(team) Work",
    titleKo: "판교 고층 목조 오피스(복합문화)",
    subtitle: "High-Rise Timber Complex Cultural Facilities in Pangyo",
    type: "Office",
    year: "2024",
    studio: "공모전",
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
    cover: "assets/img/timteam-work/cover.jpg",
    thumb: "assets/img/timteam-work/card.jpg", // 카드·목록에 쓰는 이미지 (상세 페이지 맨 위는 cover)
    coverCaption: "Glass floors over the timber arcade",
    summary:
      "Pangyo Techno Valley is a district of glass towers on a green edge. Sampyeong-dong 641 sits between the two and asks if an office can be built of timber and climb with the park. A 14-storey timber office: GLT frame and CLT slabs on a 3,500 grid around three cores, with 53 planted terraces rising to a roof garden at +61,000 over a timber arcade.",
    sections: [
      { heading: "Territorial Reading", text: "1.6 km around the plot, north up, 250 m grid — where the green link meets the office district. The site section runs west–east through the plot, from Hwarang Park to the towers of Pangyo.", images: [], panel: {"src":"assets/img/timteam-work/territorial-reading.jpg","r":0.708,"left":[["Startup Campus","public start-up centre"],["Cha Bio Complex","biotech research"],["SK Chemicals","research headquarters"],["Nexon Korea","game developer HQ"],["NHN Play Museum","museum and offices"],["AhnLab","security software HQ"],["NCSoft R&D Center","across the Unjungcheon"],["Plot 1","43 × 37 m · 1,591 m²"],["Hwarang Park","13 ha hill park"],["Kakao Pangyo Agit","offices over shops"],["Pangyo Station","Sinbundang, Gyeonggang"],["Krafton Tower","game developer HQ"],["Alpharium 2","high-rise housing"]],"right":[["11 min walk","4 programmes in 250 m"],["15 min walk","7 programmes in 250 m"],["10 min walk","11 programmes in 250 m"],["13 min walk","10 programmes in 250 m"],["8 min walk","10 programmes in 250 m"],["7 min walk","15 programmes in 250 m"],["7 min walk","8 programmes in 250 m"],["61 m timber tower","4 programmes in 250 m"],["10 min walk","1 programme in 250 m"],["6 min walk","9 programmes in 250 m"],["8 min walk","7 programmes in 250 m"],["10 min walk","6 programmes in 250 m"],["7 min walk","5 programmes in 250 m"]],"notes":[["5 min · 400 m","green 34 % · built 13 % · height 47 / 68 m · pedshed 21 %"],["10 min · 800 m","green 13 % · built 17 % · height 42 / 77 m · pedshed 44 %"],["15 min · 1,200 m","green 8 % · built 15 % · height 35 / 77 m · pedshed 43 %"],["Green link","park to plaza, through the plot"]],"legend":[["T","Tech office"],["R","Housing"],["C","Civic, culture"],["P","Park"],["S","Station"],["+","250 m grid"]],"cap":"Territorial reading — 1.6 km around plot 1, north up, 250 m grid. Each place on its row: on the left what it is, on the right the walk from the plot."}, stack: true, pan: {"src":"assets/img/timteam-work/site-section-wide.jpg","r":4.844,"h":"18vh","w":"47.7%","after":true,"cap":"Site section S–S′ — west–east through plot 1, from Hwarang Park to the offices of Pangyo; scroll to walk along it, past the neighbouring plots"} },
      { heading: "Composition of Timber", text: "In Pangyo Techno Valley, where many technologies meet, a tall timber building for culture and work that draws nature in. Timber columns carry the structure and divide the space as they go, and a small garden terrace on every floor ties nature in vertically, through real trees.", images: [], seq: {"kind":"frames","r":0.857,"k":0.5,"steps":[{"src":"assets/img/timteam-work/composition-1.jpg","t":"Mass timber","s":"one solid block of wood"},{"src":"assets/img/timteam-work/composition-2.jpg","t":"Tall timber","s":"floors stacked on a timber spine"},{"src":"assets/img/timteam-work/composition-3.jpg","t":"Timber in sequence","s":"stems repeated, like a grove"},{"src":"assets/img/timteam-work/composition-4.jpg","x":"4%","t":"Vertical flow","s":"terraces and trees up the frame"}]} },
      { heading: "Mass Process", text: "Ordinary block to vertical park, in five moves — scroll to run them.", images: [], seq: {"kind":"frames","r":0.842,"k":0.6,"steps":[{"src":"assets/img/timteam-work/mass-1.jpg","t":"Mass","s":"1 block · 14 storeys + roof","d":"The ordinary answer first: one block on the plot, 28,000 square and 61,000 to the roof.","k":[["Plot","1,591 m²"],["Footprint","835 m²"],["Coverage","52 %"]]},{"src":"assets/img/timteam-work/mass-2.jpg","t":"Grid","s":"8 × 8 bays · 896 cells","d":"Cut on the 3,500 timber grid and the real storeys: 5,500, 5,500, 6,000, then 4,000.","k":[["Bay","3,500"],["Podium","5,500–6,000"],["Typical","4,000"]]},{"src":"assets/img/timteam-work/mass-3.jpg","t":"Modular","s":"744 kept · 152 open","d":"Cells come out where the city should come in: the ground floor, a 4F courtyard and the terraces.","k":[["Cells kept","744"],["Cells open","152"],["Open share","17 %"]]},{"src":"assets/img/timteam-work/mass-4.jpg","t":"Flow","s":"53 terraces · roof 784 m²","d":"The open cells are planted. Terraces step two bays per storey and the park climbs the tower.","k":[["Terraces","53"],["Helices","3"],["Planted","1,433 m²"]]},{"src":"assets/img/timteam-work/mass-5.jpg","t":"Arcade","s":"19 bays · 1F 454 m²","d":"The 2F floor cantilevers one bay over a glazed ground floor, and the park passes under it.","k":[["Cantilever","3,950"],["1F enclosed","454 m²"],["Arcade bays","19"]]}]} },
      { heading: "Systems", text: "Cores, frame, slabs, skin and terraces: three concrete cores, a GLT column on every node of the 3,500 grid, one CLT slab per level, a post-and-beam curtain wall with timber slats, and the open cells planted 600 deep.", images: [{ src: "assets/img/timteam-work/systems.jpg", caption: "Systems — cores, frame, slabs, skin, terraces", r: 3.597, notes: [["01","Cores","Stairs, lifts and shafts in three concrete cores, the only concrete above ground"],["02","Frame","A GLT column on every node of the 3,500 grid and girders under each slab"],["03","Slabs","One CLT slab per level, left open where a terrace or the courtyard cuts in"],["04","Skin","A post-and-beam curtain wall, with a grating catwalk and timber slats outside"],["05","Terraces","The open cells planted 600 deep on the CLT, two helices up to the roof garden"]] }] },
      { heading: "Four Facades, Unfolded", text: "Terraces from the plans, levels from the sections: post-and-beam glazing, slab edge, glare slats and open bays, read around all four sides.", images: [{sim: "plant", src: "assets/img/timteam-work/four-facades.jpg", caption: "Four facades, unfolded — the flow runs left to right and plants the terraces as it passes", w: "72%", lite: true, r: 1.711}] },
      { heading: "Joints in Timber", text: "One slice from 1F to 5F around a single bay, six details redrawn at one scale, and six joints exploded — core, column, girder, arcade and facade.", images: [{src: "assets/img/timteam-work/six-joints.jpg", caption: "Six joints, exploded", lite: true, w: "72%", r: 0.812}], seq: {"kind":"lead","src":"assets/img/timteam-work/one-slice-bare.jpg","r":0.878,"n":9,"steps":[{"t":"One slice, 1F to 5F","s":"two bays by two, seen from inside"},{"t":"5F and 4F — the office floor","s":"frame, slab, girders and services"},{"t":"3F — the terrace","s":"dropped into the slab"},{"t":"2F — the lounge","s":"the same floor, finish taken off"},{"t":"1F — the arcade","s":"arches, wave ceiling, tree columns"}],"L":[["l",12.81,24.55,"Double-skin facade",1],["r",16.59,59,"Four-shaft GLT column 360",1],["l",18.39,24.95,"O.A floor 300",1],["r",19.7,69.5,"5F corporate workspace",1,1],["l",21.85,25.25,"CLT slab 250",1],["r",22.64,73.5,"Steel column foot, each floor",1],["l",25.32,33.6,"GLT double girders",1],["r",25.58,68.35,"Heating and cooling pipes",1],["r",28.52,62.2,"Air pipe 250",1],["l",28.78,38.5,"Flooring 10, impact 30",1],["r",31.46,69.5,"Sprinkler pipe",1],["l",32.25,48.05,"Waffle ceiling",1],["r",34.42,70.55,"4F office community",1,1],["l",35.72,39.5,"Curtain wall to the void",1],["r",48.75,54.7,"Curtain wall, lounge to terrace",2],["l",49.71,29.4,"Parapet, CLT 150, timber clad",2],["r",51.69,74,"3F lounge",2,1],["l",53.18,28.85,"Terrace soil 600",2],["r",54.63,73.85,"3F terrace",2,1],["l",56.65,24.55,"Drainage deck 100",2],["l",60.11,24.4,"CLT slab 250, dropped 575",2],["r",69.15,71.85,"2F lounge",3,1],["l",72.44,30.45,"O.A floor, 2F",3],["l",77.4,32.55,"Arches, carrying the load",4],["r",78.81,63.7,"2F and up drawn lifted 1 500",4],["l",80.85,37.85,"Wave ceiling, timber louvre",4],["r",81.77,60.45,"The louvre fanned up at the cut",4],["r",84.71,53.85,"Showroom curtain wall",4],["l",86.05,40,"PSL low-rise, tree columns",4],["r",88.94,69.8,"Four-shaft PSL column",4],["r",91.88,61.3,"1F showroom, companies",4,1],["r",95.66,53.1,"Steel column shoe",4]]} },
      { heading: "Six Details, in Timber", text: "Six details redrawn at one scale from 1:10 — one at a time, with the materials each one holds.", images: [], seq: {"kind":"frames","r":1.235,"steps":[{"src":"assets/img/timteam-work/detail-b1.jpg","t":"B1 Slab edge and facade","s":"where the office floor meets the double skin","k":[["O.A floor 300","6"],["CLT slab 250, five layers","1"],["EPS insulation","7"],["GLT girder 340 × 360","3"],["Heating and utilities conduit","15"],["Wooden grid ceiling","16"],["Post-and-beam facade","8"],["Steel grating catwalk","9"],["Glare slats, wood","10"]]},{"src":"assets/img/timteam-work/detail-b2.jpg","t":"B2 Terrace planter","s":"soil carried on the slab","k":[["Planting layer 600","13"],["Drainage deck and membrane","14"],["CLT slab 250, five layers","1"],["EPS insulation","7"],["GLT girder 340 × 360","3"],["Wooden grid ceiling","16"],["Parapet, CLT 150 in a timber frame","11"],["Post-and-beam facade","8"]]},{"src":"assets/img/timteam-work/detail-b3.jpg","t":"B3 Terrace parapet","s":"the edge of the dropped terrace","k":[["Planting layer 600","13"],["CLT slab 250, five layers","1"],["GLT girder 340 × 360","3"],["Parapet, CLT 150 in a timber frame","11"],["Deck coping on a steel pipe","12"],["Post-and-beam facade","8"],["Steel grating catwalk","9"]]},{"src":"assets/img/timteam-work/detail-b4.jpg","t":"B4 Office to terrace","s":"the step down in the slab","k":[["O.A floor 300","6"],["CLT slab 250, five layers","1"],["CLT stacked at the step","2"],["Planting layer 600","13"],["Wooden grid ceiling","16"]]},{"src":"assets/img/timteam-work/detail-b5.jpg","t":"B5 2F slab over the arcade","s":"the floor above the louvre","k":[["O.A floor 300","6"],["CLT slab 250, five layers","1"],["EPS insulation","7"],["GLT girder 340 × 360","3"],["Heating and utilities conduit","15"],["Steel grating catwalk","9"],["Wooden louvre ceiling, a wave","17"]]},{"src":"assets/img/timteam-work/detail-b6.jpg","t":"B6 Louvre ceiling, arches","s":"the wave hung under the 2F slab","k":[["CLT slab 250, five layers","1"],["GLT girder 340 × 360","3"],["Hanger rods","18"],["Wooden louvre ceiling, a wave","17"],["Pointed GLT arch","5"],["PSL column","4"]]}]} },
      { heading: "Scenes", text: "The tower at night over the timber arcade, and the interiors it shelters.", images: [{src: "assets/img/timteam-work/night-exterior.jpg", caption: "Exterior at night", r: 0.635}, {src: "assets/img/timteam-work/interior-hall.jpg", caption: "Hall in timber", r: 0.752}, {src: "assets/img/timteam-work/interior-arcade.jpg", caption: "Showroom under the arches", r: 1.07}, {src: "assets/img/timteam-work/interior-cafe.jpg", caption: "Cafeteria and spiral stair", r: 0.711}], stack: true, scenes: true },
    ],
    drawings: [
      {src: "assets/img/timteam-work/floor-plans.jpg", caption: "Floor plans — nine of fourteen floors, grid @ 3,500", r: 2.639},
      {src: "assets/img/timteam-work/sections.jpg", caption: "Sections A–A′ and B–B′", r: 1.817},
    ],
  },
  {
    slug: "modular-o-housing",
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
    coverCaption: "The courtyard under the bridges",
    summary:
      "Most housing is built once and torn down whole. Modular O′ treats the home as a kit: steel frames that serve two lives over 100 years, cassettes and pods changed every 15 to 30. Factory-made modules on one 4,500 grid stack into four blocks around two yards, joined by bridges at 3F and 8F. Every node is pinned and bolted, so any part can be taken apart again.",
    sections: [
      { heading: "The Loop", text: "One frame, 100 years — design, factory, road, crane, live and adapt, renew, take apart, use again.", images: [], widget: "loop", wsrc: "assets/img/modular-o-housing/loop-wheel.jpg" },
      { heading: "Assembly Sequence", text: "Twelve steps on site: piles, base, core, ground, tie plates, levels, open frames, facade, roof, plant and hand over.", images: [], seq: {"kind":"frames","r":0.872,"lite":true,"fade":true,"k":0.7,"steps":[{"src":"assets/img/modular-o-housing/assembly-01.svg","t":"Piles","s":"factory, in parallel","d":"Bored piles and ground beams under every node of the 4.5 m grid"},{"src":"assets/img/modular-o-housing/assembly-02.svg","t":"Base","s":"factory, in parallel","d":"RC plinth, cast-in plates set level on every node: the only wet work"},{"src":"assets/img/modular-o-housing/assembly-03.svg","t":"Core","s":"crane","d":"The braced core stack goes up first and takes the lateral load"},{"src":"assets/img/modular-o-housing/assembly-04.svg","t":"Ground","s":"crane","d":"Arcade frames bolt to the plates; shop modules land on pins"},{"src":"assets/img/modular-o-housing/assembly-05.svg","t":"Tie plates","s":"crane","d":"M24 bolts through the access windows; one plate ties each node"},{"src":"assets/img/modular-o-housing/assembly-06.svg","t":"Level 1","s":"crane","d":"One lift per home cell; the terrace frame comes flat-packed"},{"src":"assets/img/modular-o-housing/assembly-07.svg","t":"Level 2","s":"crane — frames and rods","d":"The stack steps back: open cells become the terraces above"},{"src":"assets/img/modular-o-housing/assembly-08.svg","t":"Open frames","s":"crane — frames and rods","d":"Greenhouse frame on the roof; X rods pinned into the open frames"},{"src":"assets/img/modular-o-housing/assembly-09.svg","t":"Facade","s":"dry trades","d":"Glazed cassettes and louvres clip on from outside, no scaffold"},{"src":"assets/img/modular-o-housing/assembly-10.svg","t":"Roof + PV","s":"dry trades","d":"Roof cassettes close the top modules; PV rows bolt to the frame"},{"src":"assets/img/modular-o-housing/assembly-11.svg","t":"Plant + serve","s":"dry trades","d":"Decks and planter trays lifted in; pods hook up to the core risers"},{"src":"assets/img/modular-o-housing/assembly-12.svg","t":"Hand over","s":"dry trades","d":"Lines sealed, linings closed, gaps fire-stopped: dry from base up"}]} },
      { heading: "Mass Study", text: "Six moves on one site: maximum volume, entrance axis, four blocks, modular cells, daylight, bridges and arcade.", images: [{src: "assets/img/modular-o-housing/axonometric-render.jpg", caption: "Axonometric view — install, live, take apart", r: 1.778}], seq: {"kind":"frames","r":1.492,"lite":true,"fade":true,"k":0.9,"steps":[{"src":"assets/img/modular-o-housing/mass-1.svg","t":"Maximum volume","s":"the largest mass the site allows"},{"src":"assets/img/modular-o-housing/mass-2.svg","t":"Entrance axis","s":"a long shared plaza opens from the entrance"},{"src":"assets/img/modular-o-housing/mass-3.svg","t":"Four blocks","s":"split for access, with shared yards on two layers"},{"src":"assets/img/modular-o-housing/mass-4.svg","t":"Modular cells","s":"infill system and factory-made frames for a shorter build, grouped in clusters"},{"src":"assets/img/modular-o-housing/mass-5.svg","t":"Daylight","s":"heights stepped so the sun reaches the yards"},{"src":"assets/img/modular-o-housing/mass-6.svg","t":"Bridges + arcade","s":"bridges between blocks, shops in a ground-floor arcade, farm yards between"}]} },
      { heading: "Kit of Parts", text: "One grid, one node, skeleton and infill, dry and reversible — eight module types that every part obeys.", images: [], pan: {"src":"assets/img/modular-o-housing/kit-strip.svg","r":23.857,"h":"15vh","solid":true,"labels":[[0.088,"V-00","Module frame","the base of every closed cell"],[5.643,"V-01","Studio cell","a whole home in one module"],[11.199,"V-02","Living cell","the wet cell of a joined home"],[16.754,"V-03","Bedroom cell","a dry cell: no pod, no kitchen"],[22.31,"V-04","Children’s room","two beds and a desk"],[27.865,"V-05","End cell","the gable is an outside wall"],[33.421,"V-06","Cluster hall","a living room for one storey"],[38.976,"V-07","Shop / café","ground floor, under the homes"],[44.532,"V-08","Community corner","the farm info centre"],[50.088,"F-00","Open frame","posts + beams, bolted on site"],[55.643,"F-01","Terrace","every home touches one"],[61.199,"F-02","Arcade","market, bikes, the doorstep"],[66.754,"F-03","Bridge","the complex crossed above the street"],[72.31,"F-04","Greenhouse / lounge","shared, in the voids"],[77.865,"F-05","Roof garden","beds rented by the season"],[83.421,"F-06","Smart-farm module","seedlings for the terraces"],[88.976,"C-01","Stair core","two flights a storey"],[94.532,"C-02","Lift core","beside each stair"]],"loop":true,"cap":"Kit of parts — eighteen modules on two frames"} },
      { heading: "Section and Detail", text: "The section through the courtyard bridges, and one terrace beside a home cell drawn at detail scale — the kit of parts, put together.", images: [{"src":"assets/img/modular-o-housing/section-a.jpg","caption":"Section A–A — looking east, through the courtyard bridges","r":1.614,"notes":[["01","Home cells","One module each, landed on pins at every node"],["02","Terrace cells","Open frames with a planter tray, every few floors"],["03","Bridges","Open frames on rods, at levels 3 and 8"],["04","Roof frames","Pergola and smart farm on top of each block"],["05","Courtyard","18 m between the blocks, open down to the shared rooms"],["06","Podium","Shared rooms on B1, parking on B2, on a raft and piles"]]}, {"src":"assets/img/modular-o-housing/detail-section.jpg","caption":"Detail section — a terrace beside a home cell","r":1.334,"w":"80%","notes":[["01","Terrace","An open cell, planted in a tray on the steel deck"],["02","Stacking node","Pin, tie plate and bolted end plates between cells"],["03","Floor cassette","Insulated, with services in the zone above the ceiling"],["04","Home cell","Kitchen, table and bed in one 4.5 m module"]]}], stack: true },
      { heading: "Scenes", text: "The street, the courtyard under the bridges, the module facade and the shared rooms inside.", images: [{src: "assets/img/modular-o-housing/street.jpg", caption: "Street", r: 1.778}, {src: "assets/img/modular-o-housing/courtyard.jpg", caption: "Courtyard", r: 1.778}, {src: "assets/img/modular-o-housing/module-facade.jpg", caption: "Module facade", r: 1.778}, {src: "assets/img/modular-o-housing/bridge-view.jpg", caption: "From the bridge", r: 1.778}, {src: "assets/img/modular-o-housing/atrium.jpg", caption: "Atrium", r: 1.993}, {src: "assets/img/modular-o-housing/smart-farm.jpg", caption: "Smart farm", r: 1.778}], stack: true, scenes: true },
      { heading: "Plans", text: "Four floors drawn on one frame — scroll to go up the building, one floor at a time — and the four home types the cells combine into.", images: [{src: "assets/img/modular-o-housing/unit-plans.jpg", caption: "Home types — four unit plans built from the same cells", r: 3.093}], seq: {"kind":"frames","below":true,"r":1.48,"lite":true,"fade":true,"k":0.85,"steps":[{"src":"assets/img/modular-o-housing/plan-1.jpg","t":"Ground floor","s":"shops and the arcade","d":"Shops line the street under the west block; the open ground runs from the entrance into the site"},{"src":"assets/img/modular-o-housing/plan-2.jpg","t":"Second floor","s":"the shared deck","d":"The first home clusters sit on the podium deck, each around its own small court"},{"src":"assets/img/modular-o-housing/plan-3.jpg","t":"Third floor","s":"clusters and bridges","d":"Clusters climb on the east blocks and the first bridge links them across the courtyard"},{"src":"assets/img/modular-o-housing/plan-4.jpg","t":"Typical floor","s":"four blocks, one grid","d":"Four blocks of home cells on one 4.5 m grid, tied together by bridges over the courtyard"}]} },
    ],
  },
  {
    slug: "samgakji-residential",
    title: "Samgakji Residential Project",
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
    coverCaption: "Guesthouse on the commercial spine",
    coverR: 1.502, // 표지를 사진 비율 그대로 (핀 #158)
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
        seq: {
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
        images: [{ src: "assets/img/samgakji-residential/tower-elevation.jpg", caption: "From the tower down to the village", r: 3.528, w: "72%" }]
      },
      {
        big: true,
        heading: "Scenes",
        text: "The green road at night and in snow, the alleys and the commercial street, the guesthouse, the office bridge and the houses.",
        stack: true,
        scenes: true,
        images: [
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
          },
          {
            src: "assets/img/samgakji-residential/residence.jpg",
            caption: "Residence",
            r: 1.463
          },
          {
            src: "assets/img/samgakji-residential/residence-2.jpg",
            caption: "Residence — the village in snow",
            r: 1.5
          }
        ]
      }
    ],
    drawings: [
      {
        src: "assets/img/samgakji-residential/plan-1.jpg",
        caption: "Plan 1",
        r: 1.052
      },
      {
        src: "assets/img/samgakji-residential/plan-2.jpg",
        caption: "Plan 2",
        r: 1.051
      },
      {
        src: "assets/img/samgakji-residential/plan-3.jpg",
        caption: "Plan 3",
        r: 1.051
      },
      {
        src: "assets/img/samgakji-residential/section-1.jpg",
        caption: "Section 1 — through the tower and the village",
        r: 1.767
      },
      {
        src: "assets/img/samgakji-residential/section-2.jpg",
        caption: "Section 2",
        r: 1.767
      },
      {
        src: "assets/img/samgakji-residential/elevation.jpg",
        caption: "Elevation",
        r: 1.414
      }
    ]
  },
  {
    slug: "smart-pixel",
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
    cover: "assets/img/smart-pixel/cover.jpg",
    coverCaption: "Eleven gates, seven lit lanes, one corridor, three rooms — one walk home from Daerim station",
    summary: "Daerim 2-dong has deep lanes that open straight into the dark, a market street edged by patchwork awnings, and corners that are left over. SMART PIXEL does not add lamps to them. It adds three of the oldest pieces of architecture, rebuilt from one lit column on a 2.5 m grid: a gate you pass through, a colonnade you walk along, a pavilion you stay in. Light is switched on only by the people who are there, and every piece bolts on and lifts out again.",
    sections: [
      {
        heading: "Site — Why Daerim 2-dong",
        text: "The kit is not spread over the city. It goes where many people walk home through deep, unlit alleys, and where the neighbourhood already lives outdoors at night. Six readings of the same 1 km frame decide where: 45,000 residents, 80 % of 16.6 km of streets are lanes, 177 of 400 walks home share one street, 64 % of street length lies over 40 m from a main road — and 316 of the 400 routes pass the frame.",
        images: [], seq: {"kind":"frames","below":true,"r":0.83,"k":1.05,"fade":true,"steps":[{"src":"assets/img/smart-pixel/site-1-location.jpg","t":"Location","s":"Korea's most concentrated ethnic enclave"},{"src":"assets/img/smart-pixel/site-2-fabric.jpg","t":"Fabric","s":"80 % of 16.6 km of streets are lanes"},{"src":"assets/img/smart-pixel/site-3-walk-home.jpg","t":"Walk home","s":"177 of 400 routes share one street"},{"src":"assets/img/smart-pixel/site-4-depth.jpg","t":"Depth","s":"64 % of street length is over 40 m deep"},{"src":"assets/img/smart-pixel/site-5-already-there.jpg","t":"Already there","s":"cameras, lamps, two safe routes"},{"src":"assets/img/smart-pixel/site-6-where.jpg","t":"Where the frame goes","s":"316 of 400 routes pass it"}]}
      },
      {
        heading: "Threshold, Colonnade, Pavilion",
        text: "Each old type is read for what it does to the ground, not for how it looks. The gate (Hongsalmun) marks where a lane begins; the market colonnade (Sijeon haengnang) thickens an edge into a room; the raised pavilion (nu) lifts the ground twice. The frame keeps the act, drops the ornament and the wall, and adds what the type never had after dark: light that answers.",
        stack: true,
        images: [
          {
            src: "assets/img/smart-pixel/type-threshold.jpg",
            caption: "01 Threshold — pass through: ×11 at the mouths of deep lanes, 3.5 m between the piers",
            r: 3.477
          },
          {
            src: "assets/img/smart-pixel/type-colonnade.jpg",
            caption: "02 Colonnade — walk along: 335 m along the market street, two aisles and a nave open to the sky",
            r: 3.581
          },
          {
            src: "assets/img/smart-pixel/type-pavilion.jpg",
            caption: "03 Pavilion — stay in: ×3 on public land at route nodes, 2 × 2 cells over two tiers",
            r: 3.581
          },
          {
            src: "assets/img/smart-pixel/type-abstraction.jpg",
            caption: "Keep the act, drop the form — mark, thicken, lift",
            r: 5.805
          }
        ]
      },
      {
        heading: "One Frame, Three Gestures",
        text: "The light column becomes architecture when it is joined. A lintel on two heads makes a gate; a row of gates under roof panels makes a corridor; a second tier on four cells makes a room. Same parts, same 2.5 m grid, all bolted, all removable — ten part types, about 2,300 pieces, nothing made for one place only.",
        cols: 2,
        cw: [
          1.052,
          0.924
        ],
        images: [
          {
            src: "assets/img/smart-pixel/frame-kit.jpg",
            caption: "The Pixel Frame — parts of one 2.5 m cell, exploded in assembly order",
            r: 1.052
          },
          {
            src: "assets/img/smart-pixel/frame-parts.jpg",
            caption: "Ten parts, the hardware and the assembly order",
            r: 0.924
          }
        ]
      },
      {
        heading: "Point, Line, Volume",
        text: "Column, gate frame, gate, corridor, room: the same pieces counted for the Daerim 2-dong pilot — 620 sockets, 682 columns, 656 lintels, 280 roof panels.",
        stack: true,
        images: [
          {
            src: "assets/img/smart-pixel/frame-assembly.jpg",
            caption: "Assembly rule — point, line, volume, and the quantities for the pilot",
            r: 6.585
          },
          {
            src: "assets/img/smart-pixel/frame-gestures.jpg",
            caption: "Three gestures at the same scale — gate, corridor, room",
            r: 3.018
          }
        ]
      },
      {
        heading: "The Gathering Rule",
        text: "Light is switched on only by the people who are there. The number of people sets the size of the space — and when everyone leaves, or after 23:00, it falls back to the default.",
        images: [],
        seq: {
          below: true,
          kind: "frames",
          r: 1.274,
          lite: true,
          fade: true,
          k: 1.15,
          steps: [
            {
              src: "assets/img/smart-pixel/rule-0.jpg",
              t: "00 Default",
              s: "CPTED state · nobody gathered",
              d: "Every pixel glows low through the night and brightens as someone walks past. 16 pixels, low."
            },
            {
              src: "assets/img/smart-pixel/rule-1.jpg",
              t: "01 Column",
              s: "point · 1 person",
              d: "Check in on site and the column next to you turns bright. 1 pixel, full."
            },
            {
              src: "assets/img/smart-pixel/rule-2.jpg",
              t: "02 Wall",
              s: "line · 2 people",
              d: "Two neighbours pull the mesh screen between their columns: a lit surface. 2 pixels and a screen."
            },
            {
              src: "assets/img/smart-pixel/rule-3.jpg",
              t: "03 Space",
              s: "volume · 4 people",
              d: "Four corners light up, the canopy is rigged and the furniture box opens. 4 pixels and a canopy."
            }
          ]
        }
      },
      {
        heading: "One Kit, Four Modes",
        text: "Each mode is the same columns doing more as more people gather: what is lit, who it needs, when it runs. Every mode keeps the light at residents' windows at or below 10 lx, the limit for residential zones.",
        images: [
          {
            src: "assets/img/smart-pixel/program.jpg",
            caption: "CPTED, column, wall, space — plan, axonometric, specification, hours and use",
            r: 1.851
          }
        ]
      },
      {
        heading: "Master Plan",
        text: "Not a city-wide grid of lights: one walk home, from Daerim station exits 9–12 into the lanes of Daerim 2-dong, built from the same frame. Each piece stands where the computed flows say people walk — and the longest unwatched stretch of a walk home falls from 436 m to 185 m.",
        images: [
          {
            src: "assets/img/smart-pixel/walk-home.jpg",
            caption: "One walk home, before and after — 510 m unwatched becomes 190 m",
            r: 8.127
          }
        ]
      },
      {
        heading: "Under the Corridor at 21:00",
        text: "Section A–A cuts the market street through a column pair. Shops keep their stalls under the roof, homes above keep their dark windows, and nothing under the street moves: the sockets stop at −0.88, above every service.",
        images: [
          {
            src: "assets/img/smart-pixel/section-aa.jpg",
            caption: "Section A–A — Digital-ro 37na-gil at 21:00, perspective beyond the cut",
            r: 1.291
          }
        ]
      },
      {
        heading: "Plugged In, Bolted On, Lifted Out",
        text: "Nothing is cast on site: the socket is precast. A column drops into it and is pinned; a node on top takes up to four lintels and a roof panel. Every joint opens with one spanner, so a gate can leave a lane as easily as it came.",
        cols: 2,
        cw: [
          0.663,
          0.758
        ],
        images: [
          {
            src: "assets/img/smart-pixel/detail-column.jpg",
            caption: "A Vertical section through column and socket, 1:10",
            r: 0.663
          },
          {
            src: "assets/img/smart-pixel/detail-joints.jpg",
            caption: "1–5 Head node, lintel, socket, roof edge, power and control",
            r: 0.758
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
        heading: "One Pixel, Taken Apart",
        text: "A pixel is three things on one axis: a socket that ties it to the ground, a column that gives light, and a head that senses and talks. Nothing is glued or cast on site; every layer comes off with one spanner, top down.",
        cols: 2,
        cw: [
          0.757,
          0.503
        ],
        images: [
          {
            src: "assets/img/smart-pixel/device-exploded.jpg",
            caption: "SP-01 exploded — ground connection, light, sense and talk",
            r: 0.757
          },
          {
            src: "assets/img/smart-pixel/device-parts.jpg",
            caption: "Twenty-one parts, order code, delivery and service life",
            r: 0.503
          }
        ]
      },
      {
        heading: "How a Resident Talks to a Pixel",
        text: "Four ways in, one phone, no account. Walking past needs nothing; a tap holds the light; a booking opens a room; a press on the gate calls for help. The pixel answers in light, and keeps nothing it does not need.",
        stack: true,
        images: [
          {
            src: "assets/img/smart-pixel/app-four-ways.jpg",
            caption: "Walk past, check in, gather, call for help",
            r: 2.691
          },
          {
            src: "assets/img/smart-pixel/app-network.jpg",
            caption: "What talks to what, and SOS second by second",
            r: 1.696
          },
          {
            src: "assets/img/smart-pixel/app-screens.jpg",
            caption: "The rest of the app — six screens, one tap deep",
            r: 4.114
          }
        ]
      },
      {
        heading: "Two Sessions, Three Years, One Vote",
        text: "A gate goes up in a day of digging and an evening of bolting, with the lane open throughout. The whole network is then tested in public before it stays: pop-up first, a three-year pilot, then a vote on every piece.",
        stack: true,
        images: [
          {
            src: "assets/img/smart-pixel/construct-gate.jpg",
            caption: "Installing a gate — mark and scan, cut and set, plug, bolt, raise, switch on",
            r: 1.654
          },
          {
            src: "assets/img/smart-pixel/construct-pilot.jpg",
            caption: "Pop-up, pilot, then a vote — 3 gates, then 11, then what the residents keep",
            r: 4.35
          }
        ]
      },
      {
        heading: "A Night in Daerim, 18:40 to 23:00",
        text: "One walk home on a June weekday, through the pieces of the frame. Each scene is the same 12 × 12 m plot, the same angle, the same scale.",
        images: [],
        seq: {
          kind: "frames",
          r: 1.176,
          lite: true,
          fade: true,
          k: 0.8,
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
            },
            {
              src: "assets/img/smart-pixel/night-4.jpg",
              t: "22:10",
              s: "Gate, Digital-ro 54-gil",
              d: "“I walk alone. The gate brightens as I pass under it, and the lane ahead is already lit before I get there.” 100 % here, 60 % on the next two."
            },
            {
              src: "assets/img/smart-pixel/night-5.jpg",
              t: "22:40",
              s: "SOS at the gate",
              d: "“One press on the sign: the gate flashed, a neighbour opened the window, the police box called back.”"
            },
            {
              src: "assets/img/smart-pixel/night-6.jpg",
              t: "23:00",
              s: "Front door",
              d: "“Home. Behind me the gate goes back to dim. The lane is quiet, not dark.” Back to 20 % standby 40 s after the last pass."
            }
          ]
        }
      }
    ],
    drawings: []
  },
  {
    slug: "campus-renovation",
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
        heading: "Structure — Joints",
        text: "The mega beam, the truss beam and the precast columns are welded and bolted so the joints stay seamless; expansion joints and heat-resistant materials take the movement of the steel through the seasons.",
        images: [
          {
            src: "assets/img/campus-renovation/structure-joints.jpg",
            caption: "Truss beam · Mega structure · Precast concrete",
            r: 2.816
          }
        ]
      },
      {
        heading: "System",
        text: "The bridge in three layers.",
        images: [],
        seq: {
          kind: "frames",
          r: 0.579,
          fade: true,
          k: 0.9,
          steps: [
            {
              src: "assets/img/campus-renovation/system-1.jpg",
              t: "The lower truss beam",
              s: "four main beams",
              d: "Carried by a single steel frame and made of four main beams; like a stadium roof, it is curved for both structure and form."
            },
            {
              src: "assets/img/campus-renovation/system-2.jpg",
              t: "The bridge story",
              s: "two levels",
              d: "The inside has two levels. The upper level is not fully enclosed but left as a half-void, so the two floors talk to each other."
            },
            {
              src: "assets/img/campus-renovation/system-3.jpg",
              t: "The upper truss + PV",
              s: "held by cables",
              d: "Hung from the upper level through cables and built as a truss like the lower one, to take the tension."
            }
          ]
        }
      },
      {
        heading: "Media Facade",
        text: "Wider, more frequent windows bring more light than the existing facade. The louvers carry a media BIPV layer that generates solar power, and their angle changes how much sunlight the facade lets through.",
        images: [],
        seq: {"kind":"frames","r":1.1,"lite":true,"fade":true,"below":true,"k":0.75,"steps":[{"src":"assets/img/campus-renovation/facade-1.jpg","t":"Window width and spacing","s":"wider, more frequent openings","d":"The existing brick wall has small windows set far apart. Widening them and adding a louver bay between each pair brings more daylight deep into the rooms than the old facade allows."},{"src":"assets/img/campus-renovation/facade-2.jpg","t":"Media BIPV louver","s":"glass · media BIPV · steel · steel · pipe","d":"Each louver is a layered panel. Behind the outer glass sits a media BIPV sheet that makes solar power by day and shows images at night, held by two steel plates on a pipe."},{"src":"assets/img/campus-renovation/facade-3.jpg","t":"Variable permeability","s":"the louver angle sets the light","d":"Turned open, the louvers let the low sun reach the floor inside; turned flat, they throw it back out and shade the room. The same facade lets more or less sunlight through."}]}
      }
    ],
    drawings: [
      {
        src: "assets/img/campus-renovation/plan-1.jpg",
        caption: "Plan 1",
        r: 1.871
      },
      {
        src: "assets/img/campus-renovation/plan-2.jpg",
        caption: "Plan 2",
        r: 1.871
      },
      {
        src: "assets/img/campus-renovation/plan-3.jpg",
        caption: "Plan 3",
        r: 1.871
      },
      {
        src: "assets/img/campus-renovation/plan-4.jpg",
        caption: "Plan 4",
        r: 1.871
      },
      {
        src: "assets/img/campus-renovation/detail-plan.jpg",
        caption: "Detail plan — 3rd and 4th floor (Engineering 1), 1/20",
        r: 1.871
      }
    ]
  },
  // ---- 자료 준비 중 (CV의 수상·스튜디오 기록만 있어요. 자료를 받으면 채워요) ----
  {
    "slug": "the-tree-house",
    "title": "The Tree House",
    "titleKo": "블루밍 — 자작나무 숲의 트리하우스 키트",
    "subtitle": "Blooming — a tree house kit that hangs on a living birch and opens like a flower",
    "type": "Pavilion",
    "year": "2024",
    "studio": "Volume Zero 국제공모",
    "award": "",
    "program": "트리하우스 모듈 키트 · 일곱 방의 숲속 마을",
    "site": "강원 인제, 소양호 옆 자작나무 숲",
    "area": "모듈 3.6 × 2.4 m · 방 6.2 m² + 잎 데크",
    "team": "3인 팀 · 팀장",
    "tools": "",
    "cover": "assets/img/the-tree-house/village-section.jpg",
    "coverCaption": "A day in the village — seven rooms on four birches by the Soyang lake",
    "coverR": 1.858,
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
    "slug": "metaverse-church",
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
    "team": "",
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
    "건축은 이미지보다 먼저 하나의 해답이라고 믿습니다. 공기와 빛, 그리고 실제로 지어질 수 있는 구조와 접합부에서 그 답을 찾습니다.",
  languages: ["Korean", "English"],
  education: [
    ["2023.03 – 2027.02", "성균관대학교 건축학과", "", "Sungkyunkwan University, Department of Architecture"],
  ],
  experience: [
    ["2024.12 – 2025.03", "사이트레스그룹 건축사사무소", "설계 인턴 · House of Creatives", "화성 봉담 4층 무인호텔 기획설계 및 설계도서 작성 · Revit 기반 BIM 전환설계 및 마감 상세 작성 · 도산공원 현상설계 참여, 이중외피 패널 파라메트릭 설계"],
    ["2025.06 – 2025.08", "흥찬엔지니어링", "토목 시설물 안전진단 · 아르바이트", "상수도 맨홀·토목시설물 현장조사 및 안전진단 보조 · 비파괴 장비 측정, 조사 결과와 도면 대조 및 데이터 관리"],
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
  military: [["2020.07 – 2022.01", "육군 제3보병사단", "만기전역"]],
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
  // [도구, 숙련도 1–5]
  skills: [
    ["AutoCAD", 5], ["SketchUp", 5], ["Rhino", 4], ["Revit", 3], ["Grasshopper", 4],
    ["D5 Render", 5], ["Enscape", 4],
    ["Illustrator", 5], ["Photoshop", 5], ["InDesign", 3],
    ["Claude", 5], ["ChatGPT", 3],
  ],
};
