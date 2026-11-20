// ============================================================
// data.js — 사이트에 들어가는 "내용"은 전부 여기서 고쳐요.
// 디자인/코드를 몰라도 이 파일의 글자만 바꾸면 사이트 전체가 바뀌어요.
//
// 이미지 넣는 법: assets/img/<프로젝트 폴더>/ 에 파일을 넣고
//   cover: "assets/img/riverside/cover.jpg" 처럼 경로를 적어요.
//   비워두면("") 자동으로 회색 자리표시가 나와요.
// ============================================================

const SITE = {
  name: "YP.ARC",
  owner: "Yeop", // TODO: 실명(국문/영문)
  tagline: "Architecture · Space · Computation",
  intro: "공간의 질서를 설계하고, 그 과정을 도구로 만드는 건축가 지망생입니다.",
  email: "hello@example.com", // TODO: 실제 연락용 이메일
  instagram: "", // 선택: https://instagram.com/...
  heroVideo: "", // 선택: 메인 배경 영상(mp4) 경로. 비우면 모션 그래픽이 나와요.
};

const PROJECTS = [
  {
    slug: "project-01",
    title: "Project Title 01",
    subtitle: "작품을 한 줄로 설명하는 부제",
    year: "2026",
    studio: "4학년 졸업설계",
    program: "공유주거 + 커뮤니티",
    site: "서울 성북구",
    area: "연면적 3,200 ㎡",
    tags: ["Housing", "Community"],
    cover: "",
    summary:
      "작품 개요가 들어갈 자리예요. 대지의 조건, 문제의식, 설계의 핵심 전략을 3~4문장으로 정리해 주세요.",
    sections: [
      { heading: "Concept", text: "컨셉 설명 문단.", images: ["", ""] },
      { heading: "Plan & Section", text: "평면·단면 설명 문단.", images: [""] },
      { heading: "Detail", text: "디테일·재료 설명 문단.", images: ["", "", ""] },
    ],
  },
  {
    slug: "project-02",
    title: "Project Title 02",
    subtitle: "작품을 한 줄로 설명하는 부제",
    year: "2025",
    studio: "4학년 설계스튜디오",
    program: "문화시설",
    site: "부산 영도구",
    area: "연면적 5,800 ㎡",
    tags: ["Culture", "Waterfront"],
    cover: "",
    summary: "작품 개요가 들어갈 자리예요.",
    sections: [
      { heading: "Concept", text: "컨셉 설명 문단.", images: ["", ""] },
      { heading: "Drawings", text: "도면 설명 문단.", images: [""] },
    ],
  },
  {
    slug: "project-03",
    title: "Project Title 03",
    subtitle: "작품을 한 줄로 설명하는 부제",
    year: "2024",
    studio: "3학년 설계스튜디오",
    program: "도서관",
    site: "경기 수원시",
    area: "연면적 2,400 ㎡",
    tags: ["Library", "Landscape"],
    cover: "",
    summary: "작품 개요가 들어갈 자리예요.",
    sections: [{ heading: "Concept", text: "컨셉 설명 문단.", images: ["", ""] }],
  },
  {
    slug: "project-04",
    title: "Project Title 04",
    subtitle: "작품을 한 줄로 설명하는 부제",
    year: "2023",
    studio: "2학년 설계스튜디오",
    program: "단독주택",
    site: "강원 강릉시",
    area: "연면적 180 ㎡",
    tags: ["House"],
    cover: "",
    summary: "작품 개요가 들어갈 자리예요.",
    sections: [{ heading: "Concept", text: "컨셉 설명 문단.", images: [""] }],
  },
];

// 설계 태도(Process) — 메인 화면의 번호 붙은 4단계
const PROCESS = [
  { k: "Read", t: "대지를 읽다", d: "맥락, 법규, 사람의 움직임을 데이터로 정리합니다." },
  { k: "Frame", t: "질서를 세우다", d: "그리드와 비례로 공간의 뼈대를 만듭니다." },
  { k: "Shape", t: "형태를 다듬다", d: "빛과 재료로 경험을 조율합니다." },
  { k: "Tool", t: "도구로 만들다", d: "반복되는 과정을 코드와 AI로 자동화합니다." },
];

// About/CV
const CV = {
  education: [["2020 – 2027", "OO대학교 건축학과 (5년제) 졸업예정"]], // TODO
  awards: [["2026", "수상 내역 예시"]], // TODO
  skills: ["Rhino", "Grasshopper", "Revit", "AutoCAD", "Enscape", "Adobe CC", "AI / Claude Code"],
};
