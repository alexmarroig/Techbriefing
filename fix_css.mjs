import fs from 'fs';

let css = fs.readFileSync('c:/Users/gaming/tech-briefing/src/styles/global.css', 'utf8');

css = css.replace(
  '.btn{\n  display:inline-flex;align-items:center;gap:8px;',
  '.btn{\n  display:inline-flex;align-items:center;justify-content:center;gap:8px;'
);

const lightFix = `
html[data-theme="light"] .btn-stroke {
  color: #000;
  border-color: rgba(0,0,0,0.1);
  background: rgba(0,0,0,0.03);
}
html[data-theme="light"] .btn-stroke:hover {
  color: var(--amber);
  border-color: var(--amber);
  background: rgba(255, 92, 0, 0.05);
}
`;

css = css.replace(
  'html[data-theme="light"] .btn-fill:hover{color:#000}',
  'html[data-theme="light"] .btn-fill:hover{color:#000}\n' + lightFix
);

fs.writeFileSync('c:/Users/gaming/tech-briefing/src/styles/global.css', css);
console.log("CSS fixed");
