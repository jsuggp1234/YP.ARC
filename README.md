# YP.ARC

건축 설계 포트폴리오 웹사이트. 도면 세트처럼 페이지마다 시트 번호(A-000 표지, A-100 작품 목록, A-1xx 작품, A-900 소개)가 붙어 있어요.

## 구조 (건물 비유)
| 경로 | 역할 |
|---|---|
| `index.html` | 메인 원페이지: 3D 아이소 작품 매스, Principles, Philosophy, Approach, Selected Works, Process, Toolkit, Profile |
| `projects.html` | 작품 목록 (List / Grid 전환, 분류 필터, 마우스를 따라오는 미리보기) |
| `project.html#<slug>` | 작품 상세 (개요, 섹션별 도판, 가로로 흐르는 도면 띠, 다음 작품) |
| `about.html` | 소개·CV |
| `assets/js/data.js` | **내용(문장·작품·이미지 경로)은 전부 여기서 수정** |
| `assets/css/site.css` | 마감재: 색, 글꼴, 배치, 모션, 라이트/다크 |
| `assets/js/site.js` | 설비: 화면 그리기, 스크롤 모션, 커서, 페이지 전환 |
| `assets/js/hero3d.js` | 첫 화면 3D 모형 (Three.js) |
| `assets/js/hero2d.js` | 3D를 못 쓰는 기기를 위한 2D 대체 화면 |
| `assets/js/drawings.js` | 실제 이미지가 오기 전까지 보여 줄 도면 자리표시 (평면, 단면, 입면, 액소, 배치도, 다이어그램) |
| `assets/img/` | 작품 이미지 폴더 |

## 작품 추가하는 법
1. `assets/img/<작품이름>/` 폴더에 이미지를 넣어요.
2. `assets/js/data.js`의 `PROJECTS`에 항목을 하나 복사해서 내용을 바꿔요.
   - `cover`: 대표 이미지 경로. 비워 두면 `mass`로 그린 액소노메트릭이 나와요.
   - `sections[].images`: `{ src: "assets/img/...", caption: "..." }` 형식. `src`가 없으면 `kind`(plan, section, elevation, axon, site, concept)에 맞는 자리표시 도면이 나와요.
   - `drawings`: 상세 페이지 아래 가로 도면 띠에 들어가요.
   - `pos`, `mass`: 첫 화면 3D 모형에서 작품이 놓일 위치와 덩어리 `[x, y, 폭, 깊이, 높이]` (1칸 = 7.2 m).
3. 그러면 첫 화면 모형, 목록, 상세 페이지가 자동으로 만들어져요.

## 로컬에서 보기
설치 필요 없음. 폴더에서 `python3 -m http.server` 실행 후 http://localhost:8000 접속.
라이브러리(Three.js r128, GSAP 3.12.5, Lenis 1.1.13)는 CDN에서 불러와요.
