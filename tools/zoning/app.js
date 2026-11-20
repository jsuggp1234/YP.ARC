// ============================================================
// app.js — 화면의 버튼과 계산을 연결하는 "설비" 파일
// 흐름: 입력값 읽기 → 계산(코드) → 결과를 화면에 그리기
// ============================================================

// 1) 화면이 열리면 용도지역 선택 목록을 zoning.js 데이터로 채워요.
const zoneSelect = document.getElementById("zone");
const groups = [...new Set(ZONES.map((z) => z.group))];
groups.forEach((g) => {
  const optgroup = document.createElement("optgroup");
  optgroup.label = g;
  ZONES.filter((z) => z.group === g).forEach((z) => {
    const opt = document.createElement("option");
    opt.value = z.name;
    opt.textContent = z.name;
    optgroup.appendChild(opt);
  });
  zoneSelect.appendChild(optgroup);
});
zoneSelect.value = "제2종일반주거지역";

// 2) 용도지역을 바꾸면 법정 상한을 조례값 칸에 기본값으로 넣어줘요. (사용자가 고칠 수 있음)
function fillDefaults() {
  const zone = ZONES.find((z) => z.name === zoneSelect.value);
  document.getElementById("bcrLimit").value = zone.bcr;
  document.getElementById("farLimit").value = zone.far;
  document.getElementById("legalNote").textContent =
    `시행령 상한: 건폐율 ${zone.bcr}% · 용적률 ${zone.far}%. 실제 값은 해당 지자체 도시계획조례로 확인하세요.`;
}
zoneSelect.addEventListener("change", fillDefaults);
fillDefaults();

// 숫자 보기 좋게: 1234.5 → "1,234.50"
const fmt = (n) => n.toLocaleString("ko-KR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// 3) "검토하기" 버튼을 누르면 계산해서 결과 표를 그려요.
document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault(); // 페이지가 새로고침되지 않게 막기

  const site = Number(document.getElementById("site").value);
  const bcrLimit = Number(document.getElementById("bcrLimit").value);
  const farLimit = Number(document.getElementById("farLimit").value);
  const planFootprint = Number(document.getElementById("footprint").value) || 0;
  const planFloorArea = Number(document.getElementById("floorArea").value) || 0;

  // 핵심 계산 — AI가 아니라 코드가 해요. (정답이 하나인 일)
  const maxFootprint = site * (bcrLimit / 100); // 최대 건축면적 = 대지면적 × 건폐율
  const maxFloorArea = site * (farLimit / 100); // 최대 용적률산정 연면적 = 대지면적 × 용적률

  let rows = `
    <tr><th>대지면적</th><td>${fmt(site)} ㎡</td><td></td></tr>
    <tr><th>최대 건축면적 (건폐율 ${bcrLimit}%)</th><td>${fmt(maxFootprint)} ㎡</td><td></td></tr>
    <tr><th>최대 연면적 (용적률 ${farLimit}%)</th><td>${fmt(maxFloorArea)} ㎡</td><td></td></tr>`;

  // 계획안을 입력했다면 적합/초과 판정까지
  if (planFootprint > 0) {
    const bcr = (planFootprint / site) * 100;
    const ok = bcr <= bcrLimit;
    rows += `<tr><th>계획 건폐율</th><td>${fmt(bcr)} %</td>
      <td class="${ok ? "ok" : "ng"}">${ok ? "적합" : `초과 (${fmt(planFootprint - maxFootprint)} ㎡)`}</td></tr>`;
  }
  if (planFloorArea > 0) {
    const far = (planFloorArea / site) * 100;
    const ok = far <= farLimit;
    rows += `<tr><th>계획 용적률</th><td>${fmt(far)} %</td>
      <td class="${ok ? "ok" : "ng"}">${ok ? "적합" : `초과 (${fmt(planFloorArea - maxFloorArea)} ㎡)`}</td></tr>`;
  }

  document.getElementById("result").innerHTML = `
    <h2>검토 결과 · ${zoneSelect.value}</h2>
    <table>${rows}</table>
    <p class="note">※ 용적률 산정 연면적은 지하층·지상 주차장 등 산입 제외 면적을 뺀 값을 넣어야 해요.
    본 결과는 학습·스터디용 참고값이며, 지구단위계획·조례·완화 규정은 반영하지 않았어요.</p>`;
});
