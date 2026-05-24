import fs from 'fs';
let css = fs.readFileSync('c:/Users/gaming/tech-briefing/src/styles/global.css', 'utf8');

css = css.replace(/\.manual-playbook li\{\s*counter-increment:playbook;[\s\S]*?font-weight:500;\s*\}/, '');
css = css.replace(/\.manual-visual-card strong\{[\s\S]*?color:\s*#fff;\s*\}\s*\.manual-visual-card p\{[\s\S]*?font-size:14px;\s*\}/, '');

css = css.replace(/\.manual-visual-card strong\{\s*display:block;\s*font-family:var\(--serif\);\s*font-size:34px;\s*line-height:1\.02;\s*letter-spacing:-?\.035em;\s*\}/g, '.manual-visual-card strong{\n  display:block;\n  font-family:var(--serif);\n  font-size:34px;\n  line-height:1.02;\n  letter-spacing:-.035em;\n  color:#fff;\n}');

css = css.replace(/\.manual-visual-card p\{\s*margin:18px 0 0;\s*color:var\(--text-2\);\s*font-size:14px;\s*\}/g, '.manual-visual-card p{\n  margin:18px 0 0;\n  color:rgba(255,255,255,0.7);\n  font-size:14px;\n}');

css = css.replace(/\.manual-playbook li\{\s*counter-increment:playbook;\s*display:grid;\s*grid-template-columns:34px 1fr;\s*gap:12px;\s*align-items:center;\s*padding:12px 14px;\s*border:1px solid var\(--line-s\);\s*border-radius:14px;\s*background:oklch\(0\.09 0\.01 245\/\.72\);\s*color:var\(--text-2\);\s*\}/g, '.manual-playbook li{\n  counter-increment:playbook;\n  display:grid;\n  grid-template-columns:34px 1fr;\n  gap:12px;\n  align-items:center;\n  padding:12px 14px;\n  border:1px solid var(--line-s);\n  border-radius:14px;\n  background:oklch(0.09 0.01 245/.72);\n  color:#fff;\n  font-weight:500;\n}');

fs.writeFileSync('c:/Users/gaming/tech-briefing/src/styles/global.css', css, 'utf8');
console.log('Done!');
