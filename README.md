# YP.ARC

건축 설계 포트폴리오 웹사이트 + AI로 만든 설계 도구 모음.

## 구조 (건물 비유)
| 경로 | 역할 |
|---|---|
| `index.html` | 메인: 모션 히어로, Studio, Selected Works, Method, Tools |
| `projects.html` | 작품 목록 (리스트 + 갤러리, 마우스 올리면 미리보기) |
| `project.html?p=<slug>` | 작품 상세 (자동 생성) |
| `tools.html` · `tools/zoning/` | 설계 도구: 건폐율·용적률 검토기 |
| `about.html` | 소개·CV |
| `assets/js/data.js` | **내용(텍스트·작품·이미지 경로)은 전부 여기서 수정** |
| `assets/css/site.css` | 마감재: 색, 글꼴, 배치, 모션 |
| `assets/js/site.js` | 설비: 화면 그리기, 스크롤 모션, 커서, 히어로 모션아트 |
| `assets/img/` | 작품 이미지 폴더 |

## 작품 추가하는 법
1. `assets/img/<작품이름>/` 폴더에 이미지를 넣어요.
2. `assets/js/data.js`의 `PROJECTS`에 항목을 하나 복사해서 내용과 이미지 경로를 바꿔요.
3. 그러면 목록, 갤러리, 상세 페이지가 자동으로 만들어져요.

## 로컬에서 보기
설치 필요 없음. 폴더에서 `python3 -m http.server` 실행 후 http://localhost:8000 접속.

⚠️ 건폐율·용적률 상한값은 국토계획법 시행령 기준이며, 실제 적용값은 지자체 도시계획조례로 확인해야 해요.
