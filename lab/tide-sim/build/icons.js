// 핀 #302·#304: 물음 · 데이터 열 · 변수 · 기단 부분마다 작은 그림 (먹선, 20×20)
const ICN_D = {
  q0: '<circle cx="4" cy="10" r="1.6"/><circle cx="10" cy="10" r="1.6"/><circle cx="16" cy="10" r="1.6"/>',
  q1: '<path d="M3 10H17M3 6V14M17 6V14"/>',
  q2: '<circle cx="10" cy="10" r="6.5"/><path d="M10 10V5.5M10 10L13 12"/>',
  q3: '<path d="M4 16L16 4M10 4H16V10"/>',
  days: '<rect x="3" y="4.5" width="14" height="12.5"/><path d="M3 8.5H17M7 2.5V6M13 2.5V6"/>',
  above: '<path d="M2 15c2-2 4 2 6 0s4 2 6 0 3 1 4 0M10 12V3M7 6l3-3 3 3"/>',
  daylit: '<circle cx="10" cy="12" r="3"/><path d="M2 16H18M10 4.5V7M4 8l1.6 1.6M16 8l-1.6 1.6"/>',
  noonc: '<circle cx="10" cy="10" r="7"/><path d="M10 10V4"/>',
  speed: '<path d="M4 12l6-6 6 6M4 17l6-6 6 6"/>',
  layer: '<path d="M3 5.5H17M5 10H15M7 14.5H13"/>',
  edge: '<path d="M2 17H6V13H10V9H14V5H18"/>',
  connect: '<circle cx="5" cy="10" r="3"/><circle cx="15" cy="10" r="3"/><path d="M8 10H12"/>',
  stay: '<circle cx="10" cy="5.5" r="2"/><path d="M10 7.5V12M7 16l3-4 3 4M3 17H17"/>',
  slope: '<path d="M2 17L18 5M2 17H18"/>',
  zone: '<path d="M2 4.5H18M2 8.5H18M2 12.5H18M2 16.5H18"/>',
  noon: '<circle cx="10" cy="8" r="3"/><path d="M2 15H18M10 2V3.5"/>',
  floors: '<rect x="6" y="3.5" width="8" height="3"/><rect x="4" y="8.5" width="12" height="3"/><rect x="2" y="13.5" width="16" height="3"/>',
  steps: '<path d="M2 17H5V14H8V11H11V8H14V5H18"/>',
  neck: '<circle cx="4.5" cy="10" r="2.5"/><path d="M7 8.5H18M7 11.5H18"/>',
  ramp: '<path d="M2 7.5H8L18 15"/>',
  widths: '<path d="M3 10H17M3 10l3-3M3 10l3 3M17 10l-3-3M17 10l-3 3"/>',
  zones: '<rect x="2" y="4" width="16" height="12"/><path d="M7 4V16M12 4V16"/>',
  open: '<circle cx="10" cy="6.5" r="3"/><path d="M3 13.5H17M5 17H15"/>'
};
const icn = k => ICN_D[k] ? `<svg class="icn" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${ICN_D[k]}</svg>` : '';
