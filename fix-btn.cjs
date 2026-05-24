const fs = require('fs');
const p = 'src/styles/global.css';
let content = fs.readFileSync(p, 'utf-8');
content = content.replace(/html\[data-theme="light"\] \.btn-fill\{color:#fff\}/g, 'html[data-theme="light"] .btn-fill{color:#000}');
content = content.replace(/html\[data-theme="light"\] \.btn-fill:hover\{color:#fff\}/g, 'html[data-theme="light"] .btn-fill:hover{color:#000}');
fs.writeFileSync(p, content);
console.log("Done");
