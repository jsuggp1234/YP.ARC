// ============================================================
// data.js — 사이트의 "내용"은 전부 여기서 고쳐요. (디자인·코드는 몰라도 됨)
//
// ※ 지금 들어 있는 작품명·설명은 레이아웃 확인용 "예시"예요. 실제 작품으로 바꿔 주세요.
//
// 이미지 넣는 법
//   1) assets/img/<작품폴더>/ 에 파일을 넣고
//   2) cover: "assets/img/shared-ground/cover.jpg" 처럼 경로를 적어요.
//   3) 이미지 칸에 src를 비워두면 { kind: "plan" } 처럼 적은 종류의 "도면형 자리표시"가 그려져요.
//      kind 종류: site(배치도) · concept(다이어그램) · axon(액소노메트릭) · plan(평면) · section(단면) · elevation(입면)
//
// 첫 화면 3D 매스
//   pos:  [가로, 세로]  격자 위 위치 (-6 ~ 6)
//   mass: [[x, y, 폭, 깊이, 높이], ...]  작품 기준 좌표, 1 = 격자 한 칸(약 7.2m)
// ============================================================

const SITE = {
  name: "YP.ARC",
  owner: "Yeop", // TODO: 실명 (예: Park Yeop / 박엽)
  role: "Architectural Designer",
  based: "Seoul, KR",
  coords: "37.5665° N, 126.9780° E",
  status: "2027년 2월 졸업예정 · 설계사무소 입사 희망",
  email: "hello@yp-arc.com", // TODO: 실제 연락용 이메일
  links: [
    // { label: "Instagram", href: "https://instagram.com/..." },
    // { label: "GitHub", href: "https://github.com/..." },
  ],
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
  // 건축에 대한 메모 (번호가 굴러가며 하나씩)
  philosophy: [
    "좋은 건축은 그럴듯한 이미지가 아니라 정확한 해답에서 시작한다고 믿습니다.",
    "공기와 빛이 어떻게 드나드는지가 공간의 질을 결정합니다. 그래서 단면부터 확인합니다.",
    "도면 위의 선은 결국 누군가 실제로 세우는 부재입니다. 지어질 수 있는 접합부까지 그립니다.",
    "반복되는 설계 과정을 도구로 만들면, 더 많은 시간을 판단에 쓸 수 있습니다.",
  ],
  // Approach 머리말 (cycle: 돌아가며 바뀌는 단어)
  approachHead: {
    cycle: ["air", "light", "structure", "joints"],
    line1: "Not how it looks first —",
    line2: "how it works, and how it is built.",
    intro: "문제를 정의하고, 환경을 해석하고, 구조와 디테일로 답하는 방식으로 설계에 접근합니다.",
  },
  // 접근 방식 (펼쳐 보기)
  approach: [
    { t: "Problem before form", s: "형태보다 문제가 먼저", d: "대지 조건, 법규, 프로그램, 예산을 먼저 정리해 무엇을 풀어야 하는지 정의합니다. 형태는 그 답의 결과라고 생각합니다." },
    { t: "Air and light in section", s: "단면에서 공기와 빛", d: "일조, 채광, 맞통풍을 단면에서 검토합니다. 같은 평면도 빛과 바람의 경로에 따라 전혀 다른 공간이 됩니다." },
    { t: "Built, not just drawn", s: "그려지는 것이 아니라 지어지는 것", d: "기둥 간격과 코어로 구조의 질서를 세우고, 방수와 단열이 끊기지 않는 접합부까지 실제 시공을 기준으로 그립니다." },
    { t: "Process as tool", s: "과정을 도구로", d: "Grasshopper와 코드, AI로 반복 작업을 자동화합니다. 대안을 빠르게 비교하고, 판단에 집중합니다." },
  ],
  // 설계 프로세스 (순서가 있는 단계)
  process: [
    { t: "Research", d: "대지 답사, 법규 검토, 사례 조사" },
    { t: "Concept", d: "다이어그램과 매스 스터디로 방향 설정" },
    { t: "Development", d: "평면·단면·구조·재료 구체화" },
    { t: "Presentation", d: "도면, 모형, 렌더링, 패널로 전달" },
  ],
  // 툴킷
  toolkit: {
    Design: ["Rhino", "Grasshopper", "Revit", "AutoCAD", "SketchUp"],
    Visualization: ["Enscape", "V-Ray", "Twinmotion", "Photoshop", "Illustrator", "InDesign"],
    Computation: ["Python", "Claude Code", "Generative AI"],
    Making: ["모형 제작", "레이저 커팅", "3D 프린팅"],
  },
};

const PROJECTS = [
  {
    slug: "shared-ground",
    title: "Shared Ground",
    titleKo: "성북동 청년 공유주거",
    subtitle: "경사지의 마당을 공유하는 청년 주거",
    type: "Housing",
    year: "2026",
    studio: "5학년 졸업설계",
    program: "공유주거 + 커뮤니티",
    site: "서울 성북구",
    area: "3,240 ㎡",
    team: "개인",
    tools: "Rhino, Revit, Enscape",
    pos: [-4, -3],
    mass: [[0, 0, 3, 1, 1.6], [0, 1, 1, 2, 1.6], [0, 0, 1, 1, 2.6]],
    cover: "",
    summary:
      "경사가 심한 대지의 레벨 차이를 그대로 살려, 층마다 다른 높이의 마당을 만들었습니다. 개인 방은 최소화하고 부엌·작업실·마당을 함께 쓰는 구조로, 1인 가구가 이웃과 자연스럽게 마주치는 주거를 제안합니다.",
    sections: [
      { heading: "Site", text: "성북동의 급경사지. 골목과 계단이 만드는 기존 동선을 끊지 않는 것을 첫 조건으로 삼았습니다.", images: [{ kind: "site" }] },
      { heading: "Concept", text: "ㄱ자 매스가 경사지에 걸쳐 앉으며 위아래 두 개의 마당을 만듭니다. 코어 타워는 두 마당을 수직으로 잇습니다.", images: [{ kind: "concept" }, { kind: "axon" }] },
      { heading: "Plan & Section", text: "공용 공간을 각 층의 마당 쪽으로 배치하고, 개인 방은 조용한 북측으로 모았습니다.", images: [{ kind: "plan" }, { kind: "section" }] },
      { heading: "Detail", text: "경사 마당의 단차를 계단식 벤치로 처리해 머무는 장소로 바꿨습니다.", images: [{ kind: "elevation" }, { kind: "section" }, { kind: "plan" }] },
    ],
    drawings: [
      { kind: "plan", caption: "1F Plan, 1:200" },
      { kind: "plan", caption: "2F Plan, 1:200" },
      { kind: "section", caption: "Section A–A′, 1:200" },
      { kind: "section", caption: "Section B–B′, 1:200" },
      { kind: "elevation", caption: "South Elevation, 1:200" },
    ],
  },
  {
    slug: "tidal-archive",
    title: "Tidal Archive",
    titleKo: "영도 해양 아카이브",
    subtitle: "조수 간만을 기록하는 수변 문화시설",
    type: "Culture",
    year: "2025",
    studio: "4학년 설계스튜디오",
    program: "아카이브 + 전시",
    site: "부산 영도구",
    area: "5,820 ㎡",
    team: "2인 팀",
    tools: "Rhino, Grasshopper, V-Ray",
    pos: [1, -4],
    mass: [[0, 0, 3.5, 1.6, 0.6], [2.4, 0.2, 1, 1, 2.4]],
    cover: "",
    summary:
      "낮고 긴 전시 매스가 바다를 향해 뻗고, 수직 타워가 수장고와 전망대 역할을 합니다. 하루 두 번 바뀌는 수위를 동선의 일부로 끌어들인 수변 문화시설입니다.",
    sections: [
      { heading: "Site", text: "옛 조선소 부지. 바다와 도시 사이의 높이 차를 해석의 출발점으로 삼았습니다.", images: [{ kind: "site" }] },
      { heading: "Concept", text: "수평의 전시 매스와 수직의 아카이브 타워가 대비를 이룹니다.", images: [{ kind: "concept" }, { kind: "axon" }] },
      { heading: "Section", text: "만조와 간조에 따라 달라지는 지상층 동선을 단면으로 검토했습니다.", images: [{ kind: "section" }] },
    ],
    drawings: [
      { kind: "plan", caption: "Ground Plan, 1:300" },
      { kind: "section", caption: "Long Section, 1:300" },
      { kind: "elevation", caption: "Sea Elevation, 1:300" },
    ],
  },
  {
    slug: "reading-terrace",
    title: "Reading Terrace",
    titleKo: "수원 계단형 도서관",
    subtitle: "언덕이 된 동네 도서관",
    type: "Public",
    year: "2024",
    studio: "3학년 설계스튜디오",
    program: "공공 도서관",
    site: "경기 수원시",
    area: "2,410 ㎡",
    team: "개인",
    tools: "Rhino, AutoCAD, 모형",
    pos: [-3, 2],
    mass: [[0, 0, 2.6, 2.6, 0.5], [0.4, 0.4, 1.8, 1.8, 1], [0.8, 0.8, 1, 1, 1.5]],
    cover: "",
    summary: "세 개의 판이 계단처럼 쌓여, 지붕 자체가 동네 사람들이 앉아 책을 읽는 언덕이 됩니다.",
    sections: [
      { heading: "Concept", text: "줄어드는 세 개의 판. 각 판의 지붕은 아래층의 테라스가 됩니다.", images: [{ kind: "concept" }, { kind: "axon" }] },
      { heading: "Plan & Section", text: "열람실은 테라스 쪽으로 열고, 서고는 중심부에 모았습니다.", images: [{ kind: "plan" }, { kind: "section" }] },
    ],
    drawings: [
      { kind: "plan", caption: "1F Plan, 1:200" },
      { kind: "section", caption: "Section, 1:200" },
      { kind: "elevation", caption: "East Elevation, 1:200" },
    ],
  },
  {
    slug: "two-rooms-house",
    title: "Two Rooms House",
    titleKo: "강릉 두 방의 집",
    subtitle: "바다와 숲을 각각 바라보는 두 볼륨의 주택",
    type: "Residential",
    year: "2023",
    studio: "2학년 설계스튜디오",
    program: "단독주택",
    site: "강원 강릉시",
    area: "182 ㎡",
    team: "개인",
    tools: "SketchUp, 모형",
    pos: [2, 1.5],
    mass: [[0, 0, 1.4, 1, 0.8], [1, 0.6, 0.9, 1, 1.2]],
    cover: "",
    summary: "어긋나게 놓인 두 볼륨이 하나는 바다를, 하나는 숲을 바라봅니다. 두 볼륨이 만나는 틈이 집의 중심 마당이 됩니다.",
    sections: [
      { heading: "Concept", text: "두 개의 방향, 두 개의 볼륨.", images: [{ kind: "concept" }, { kind: "axon" }] },
      { heading: "Gap", text: "두 볼륨 사이의 틈으로 빛과 바람이 지나갑니다.", images: [{ kind: "plan" }, { kind: "elevation" }] },
    ],
    drawings: [
      { kind: "plan", caption: "Plan, 1:100" },
      { kind: "section", caption: "Section, 1:100" },
    ],
  },
];

// About / CV
const CV = {
  intro:
    "건축은 이미지보다 먼저 하나의 해답이라고 믿습니다. 공기와 빛, 그리고 실제로 지어질 수 있는 구조와 접합부에서 그 답을 찾습니다. 졸업을 앞두고, 반복되는 설계 과정을 코드와 AI로 도구화하는 작업도 함께 하고 있습니다.",
  education: [["2022 – 2027", "OO대학교 건축학과 (5년제), 졸업예정"]], // TODO
  experience: [["2025 하계", "OO건축사사무소 인턴 (예시)"]], // TODO
  awards: [
    ["2026", "OO 대학생 건축공모전 입선 (예시)"], // TODO
    ["2025", "학과 우수작 선정 (예시)"],
  ],
  exhibitions: [["2026", "졸업작품전, 서울 (예시)"]], // TODO
  languages: ["한국어 (모국어)", "English (업무 가능)"],
};
