const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src');

files.forEach(f => {
    if (!f.endsWith('.tsx') && !f.endsWith('.ts')) return;
    let content = fs.readFileSync(f, 'utf8');
    let changed = false;

    if (content.includes('ease: [0.16, 1, 0.3, 1]')) {
        content = content.replace(/ease: \[0\.16, 1, 0\.3, 1\]/g, 'ease: [0.16, 1, 0.3, 1] as const');
        changed = true;
    }

    if (f.includes('/data/') || f.includes('\\data\\') || f.includes('Button.tsx')) {
        if (content.includes("import { LucideIcon }")) {
            content = content.replace("import { LucideIcon }", "import type { LucideIcon }");
            changed = true;
        }
        if (content.match(/import\s+{\s*(Metric|PortfolioCase|Service|TeamMember)\s*}\s+from/)) {
            content = content.replace(/import\s+{\s*(Metric|PortfolioCase|Service|TeamMember)\s*}\s+from/g, "import type { $1 } from");
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(f, content, 'utf8');
        console.log('Fixed', f);
    }
});
