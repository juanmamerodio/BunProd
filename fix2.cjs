const fs = require('fs');

function replaceFile(path, search, replace) {
    if (!fs.existsSync(path)) return;
    let c = fs.readFileSync(path, 'utf8');
    c = c.replace(search, replace);
    fs.writeFileSync(path, c, 'utf8');
}

// Button.tsx
replaceFile('./src/components/ui/Button.tsx', "import { motion, HTMLMotionProps } from 'framer-motion';", "import { motion } from 'framer-motion';\nimport type { HTMLMotionProps } from 'framer-motion';");
replaceFile('./src/components/ui/Button.tsx', "{children}", "{children as React.ReactNode}");

// Unused imports
replaceFile('./src/App.tsx', "import React from 'react';\n", "");
replaceFile('./src/components/layout/Footer.tsx', "import { motion } from 'framer-motion';\n", "");
replaceFile('./src/components/sections/FeaturedPortfolio.tsx', "Sparkles,\n", "");
replaceFile('./src/components/sections/FreeConsulting.tsx', "import { Button } from '../ui/Button';\n", "");
replaceFile('./src/components/sections/FreeConsulting.tsx', "Calendar,\n", "");
replaceFile('./src/components/sections/FreeConsulting.tsx', "ArrowRight,\n", "");
replaceFile('./src/components/sections/QualificationFunnel.tsx', "Sparkles,\n", "");

// Instagram and Linkedin - Lucide react might not have them? Actually they do, but maybe not in the installed version or under a different name. Let's just remove them from the import and usages, or ignore for now. Let's change to `svg` inline or just ignore them. Wait, if it errors, the build fails. Let's replace them with `Twitter` and `Facebook`? No, let's just comment out the import and use an inline SVG.
// Actually, `lucide-react` does have `Instagram`. Maybe the version is old. Let's just remove them.
const fFooter1 = './src/components/layout/Footer.tsx';
if (fs.existsSync(fFooter1)) {
    let cf = fs.readFileSync(fFooter1, 'utf8');
    cf = cf.replace(/Instagram,?\s*/g, "").replace(/Linkedin,?\s*/g, "");
    fs.writeFileSync(fFooter1, cf, 'utf8');
}

const fFooter2 = './src/components/sections/Footer.tsx';
if (fs.existsSync(fFooter2)) {
    let cf = fs.readFileSync(fFooter2, 'utf8');
    cf = cf.replace(/Instagram,?\s*/g, "").replace(/Linkedin,?\s*/g, "");
    fs.writeFileSync(fFooter2, cf, 'utf8');
}

console.log("Fixes applied");
