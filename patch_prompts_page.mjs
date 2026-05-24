import fs from 'fs';
let css = fs.readFileSync('c:/Users/gaming/tech-briefing/src/styles/global.css', 'utf8');

css = css.replace(/\.prompt-meta-grid strong\s*\{\s*display:\s*block;\s*margin-bottom:\s*8px;\s*color:\s*var\(--text\);\s*\}/g, 
".prompt-meta-grid strong {\n  display: block;\n  margin-bottom: 8px;\n  color: #fff;\n}");

css = css.replace(/\.prompt-meta-grid span\s*\{\s*color:\s*var\(--text-2\);\s*font-size:\s*14px;\s*line-height:\s*1\.55;\s*\}/g,
".prompt-meta-grid span {\n  color: rgba(255,255,255,0.8);\n  font-size: 14px;\n  line-height: 1.55;\n}");

css = css.replace(/\.prompt-copy-box pre\s*\{\s*margin:\s*0;\s*padding:\s*58px 22px 22px;\s*white-space:\s*pre-wrap;\s*color:\s*var\(--text-2\);\s*font-size:\s*14px;\s*line-height:\s*1\.7;\s*\}/g,
".prompt-copy-box pre {\n  margin: 0;\n  padding: 58px 22px 22px;\n  white-space: pre-wrap;\n  color: rgba(255,255,255,0.85);\n  font-size: 14px;\n  line-height: 1.7;\n}");

fs.writeFileSync('c:/Users/gaming/tech-briefing/src/styles/global.css', css, 'utf8');
console.log('Fixed prompts text contrast');
