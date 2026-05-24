import fs from 'fs';
let css = fs.readFileSync('c:/Users/gaming/tech-briefing/src/styles/global.css', 'utf8');

css = css.replace(/\.manual-prompt pre\{\s*margin:0;\s*padding:58px 22px 22px;\s*white-space:pre-wrap;\s*color:var\(--text-2\);\s*font-size:14px;\s*line-height:1\.7;\s*\}/g, '.manual-prompt pre{\n  margin:0;\n  padding:58px 22px 22px;\n  white-space:pre-wrap;\n  color:rgba(255,255,255,0.85);\n  font-size:14px;\n  line-height:1.7;\n}');

fs.writeFileSync('c:/Users/gaming/tech-briefing/src/styles/global.css', css, 'utf8');
console.log('Patch prompt text successful');
