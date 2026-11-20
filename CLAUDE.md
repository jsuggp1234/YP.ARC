# YP.ARC — Claude Code 작업 안내

이 파일은 Claude Code가 작업을 이어받을 때 먼저 읽는 안내서예요. 지금까지 정한 것과 사이트 구조를 정리해 두었어요.

## 누구를 위한 사이트인가
- 주인: yeop. 건축학과 졸업예정(2027년 2월), 설계사무소 취업 준비 중.
- 코딩 경험이 없어요. 설명은 한국어로, 전문 용어는 풀어서, 건물에 빗대어 설명해 주세요. 코드를 직접 짜게 하기보다 무엇을 바꿨고 왜 그런지를 알려 주는 쪽을 원해요.
- 목표: 건축 설계 작품을 담는 고급스러운 포트폴리오 웹사이트. 레퍼런스는 https://santalarch.com/#works (전체 흐름), https://telhaclarke.com.au/ (작은 글자), https://www.marcel-eberharter.com/ (모션).

## 이미 정한 것 (바꾸기 전에 먼저 물어보기)
- 배경은 순수 흰색 `#ffffff`, 회색은 모두 무채색. 베이지나 따뜻한 톤은 쓰지 않아요.
- 글자는 작게. 크기는 `assets/css/site.css`의 `--t-xs`부터 `--t-xxl`까지 토큰으로만 조절해요.
- 건폐율·용적률 검토기 같은 계산 도구는 넣지 않아요.
- 첫 화면: 작품들이 3D 아이소 도시 모형 위의 매스로 서 있고, 마우스를 올리면 이름표와 좌표, 클릭하면 작품 페이지로 가요.
- Philosophy는 첫 화면 바로 다음에 스크롤 장면으로 나와요.
  1. 선언문: 화면이 고정된 채 단어가 하나씩 채워지고 핵심 단어에 밑줄.
  2. 세 키워드(Answer, Air & Light, Structure & Joints): 한 장씩 넘어가며 번호가 굴러가고 도면이 그려짐.
  3. 메모 00–03: 지나갈 때 번호가 굴러감.
- 설계 철학 원문 (사용자가 직접 쓴 문장이라 고치지 않아요):
  > I believe architecture is an answer before an image — found in air and light, structure and joints that can truly be built.
  실용적인 해법을 강조하는 톤으로 나머지 문구를 맞춰요.
- 다크 모드는 오른쪽 위 토글로만 켜지고, 기본은 흰 화면이에요.
- 페이지마다 도면 세트처럼 시트 번호가 붙어요: A-000 표지, A-100 작품 목록, A-1xx 작품, A-900 소개.

## 구조
| 경로 | 역할 |
|---|---|
| `index.html` | 메인 원페이지 (3D 첫 화면 → Philosophy 장면 → Notes → Approach → Works → Process → Toolkit → Profile → Contact) |
| `projects.html` | 작품 목록 (List/Grid, 필터, 따라오는 미리보기) |
| `project.html#<slug>` | 작품 상세 (목차, 도판, 가로로 흐르는 도면 띠, 다음 작품) |
| `about.html` | 소개·CV |
| `assets/js/data.js` | **모든 글과 작품 정보.** 내용 수정은 여기서만 |
| `assets/css/site.css` | 색, 글꼴, 배치, 모션 |
| `assets/js/site.js` | 화면 그리기, 스크롤 장면(`story()`), 커서, 페이지 전환 |
| `assets/js/hero3d.js` / `hero2d.js` | 첫 화면 3D 모형 / WebGL이 없을 때 2D 대체 |
| `assets/js/drawings.js` | 이미지가 없을 때 쓰는 도면 자리표시, 스크롤로 그려지는 선 도면(`Drawing.fig`) |
| `assets/img/` | 작품 이미지 폴더 (아직 비어 있음) |

## 기술 메모
- 빌드 도구 없음. 정적 파일이라 `python3 -m http.server 8000` 후 http://localhost:8000 에서 봐요.
- 라이브러리는 CDN: Three.js r128, GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.13. 글꼴은 Google Fonts의 IBM Plex Sans KR / Plex Sans / Plex Mono.
- 작품 주소는 `project.html#slug` (해시). 쿼리스트링은 쓰지 않아요.
- Philosophy 장면은 `position: sticky` + 스크롤 진행률로 움직여요. 폭 760px 이하와 `prefers-reduced-motion`에서는 일반 목록으로 펼쳐져요.
- 3D 색은 CSS 변수(`--model`, `--model-2`, `--model-hi`, `--ink`)를 읽어요. 테마가 바뀌면 `yp:theme` 이벤트가 나가요.
- 저장소(localStorage/sessionStorage) 접근은 모두 try/catch로 감싸 두었어요.

## 확인 방법
- 데스크톱 1440×900, 모바일 390×844에서 각 페이지를 열어 콘솔 오류와 가로 스크롤이 없는지 봐요.
- 첫 화면은 매스 호버·클릭, 다크 토글, Philosophy 장면의 진행(시작·중간·끝)을 확인해요.

## 진행 상황
- 작업 브랜치: `v1-calculator`, PR #1 열려 있음 (https://github.com/jsuggp1234/YP.ARC/pull/1).
- GitHub Pages 공개 배포는 아직 안 했어요. **공개 배포는 사용자에게 먼저 확인받기.**

## 남은 일
1. 사용자가 보내 줄 실제 작품 자료로 `data.js`의 `PROJECTS`와 `assets/img/` 채우기 (지금 4개 작품은 모두 예시).
2. 실명, 이메일, 인스타그램 등 링크, 프로필 사진 (`data.js`의 TODO 표시).
3. 한국어 번역과 메모 문장 다듬기 (지금은 초안).
4. 사용자 승인 후 GitHub Pages로 공개.
