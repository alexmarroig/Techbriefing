const fs = require('fs');

function extractMediaQueries(css) {
  let nonMediaCss = '';
  let mediaQueries = {}; 
  let i = 0;

  while (i < css.length) {
    let mediaMatch = css.indexOf('@media', i);
    if (mediaMatch === -1) {
      nonMediaCss += css.substring(i);
      break;
    }

    nonMediaCss += css.substring(i, mediaMatch);
    
    let openBraceIndex = css.indexOf('{', mediaMatch);
    if (openBraceIndex === -1) break;
    
    let query = css.substring(mediaMatch, openBraceIndex).trim();
    
    let braceCount = 1;
    let j = openBraceIndex + 1;
    let inString = false;
    let stringChar = '';
    let inComment = false;

    while (j < css.length && braceCount > 0) {
      let char = css[j];
      let nextChar = css[j + 1];

      if (!inComment && !inString) {
        if (char === '/' && nextChar === '*') {
          inComment = true;
          j++;
        } else if (char === '"' || char === "'") {
          inString = true;
          stringChar = char;
        } else if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
        }
      } else if (inComment) {
        if (char === '*' && nextChar === '/') {
          inComment = false;
          j++;
        }
      } else if (inString) {
        if (char === '\\') {
          j++; 
        } else if (char === stringChar) {
          inString = false;
        }
      }
      j++;
    }

    let mediaContent = css.substring(openBraceIndex + 1, j - 1).trim();
    
    if (!mediaQueries[query]) {
      mediaQueries[query] = [];
    }
    if (!mediaQueries[query].includes(mediaContent)) {
        mediaQueries[query].push(mediaContent);
    }
    
    i = j;
  }

  let sortedQueries = Object.keys(mediaQueries).sort((a, b) => {
    let matchA = a.match(/max-width:\s*(\d+)px/);
    let matchB = b.match(/max-width:\s*(\d+)px/);
    let valA = matchA ? parseInt(matchA[1]) : 0;
    let valB = matchB ? parseInt(matchB[1]) : 0;
    return valB - valA;
  });

  let newMediaCss = '\n\n/* ----- MEDIA QUERIES ----- */\n';
  for (let q of sortedQueries) {
    newMediaCss += q + ' {\n';
    for (let content of mediaQueries[q]) {
      newMediaCss += '  ' + content + '\n';
    }
    newMediaCss += '}\n';
  }

  return { nonMediaCss: nonMediaCss.trim(), mediaCss: newMediaCss };
}

const astroFiles = [
    'src/pages/ebook-agentes-ia.astro',
    'src/pages/ebook-agentes-ia-promo.astro',
    'src/pages/agentes-ia-premium.astro',
    'src/pages/agentes-ia-premium-promo.astro'
];

astroFiles.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        let styleStartIndex = content.indexOf('<style is:global>');
        let styleEndIndex = content.lastIndexOf('</style>');
        
        if (styleStartIndex !== -1 && styleEndIndex !== -1) {
            let css = content.substring(styleStartIndex + '<style is:global>'.length, styleEndIndex);
            let res = extractMediaQueries(css);
            
            let newStyle = '<style is:global>\n' + res.nonMediaCss + res.mediaCss + '\n</style>';
            let newContent = content.substring(0, styleStartIndex) + newStyle + content.substring(styleEndIndex + '</style>'.length);
            fs.writeFileSync(file, newContent, 'utf8');
            console.log('Processed ' + file);
        }
    }
});
