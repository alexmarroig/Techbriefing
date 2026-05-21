const fs = require('fs');

const files = [
    'src/pages/ebook-agentes-ia.astro',
    'src/pages/ebook-agentes-ia-promo.astro',
    'src/pages/agentes-ia-premium.astro',
    'src/pages/agentes-ia-premium-promo.astro'
];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        let newContent = content.replace(
            /<a class="lp-role-card" href=\{r\.href\} aria-label=\{`Ver contedo sobre papel \$\{r\.role\}`\}>([\s\S]*?)<div class="lp-card-more">Ver no contedo &rarr;<\/div>\s*<\/a>/g, 
            (match, p1) => {
                return '<div class="lp-role-card" aria-label={`Papel ${r.role}`}>' + p1 + '</div>';
            }
        );
        // Fallback for utf8 decoding issues
        newContent = newContent.replace(
            /<a class="lp-role-card" href=\{r\.href\} aria-label=\{`Ver conteúdo sobre papel \$\{r\.role\}`\}>([\s\S]*?)<div class="lp-card-more">Ver no conteúdo &rarr;<\/div>\s*<\/a>/g, 
            (match, p1) => {
                return '<div class="lp-role-card" aria-label={`Papel ${r.role}`}>' + p1 + '</div>';
            }
        );
        
        fs.writeFileSync(file, newContent, 'utf8');
        console.log('Processed ' + file);
    }
});
