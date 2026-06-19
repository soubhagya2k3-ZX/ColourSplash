const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx') && !fullPath.includes('node_modules')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;
            
            // Remove mix-blend classes
            content = content.replace(/mix-blend-multiply/g, '');
            content = content.replace(/mix-blend-overlay/g, '');
            content = content.replace(/mix-blend-screen/g, '');
            content = content.replace(/mix-blend-color/g, '');
            content = content.replace(/mix-blend-difference/g, '');
            
            // Remove animate-pulse from blur elements
            content = content.replace(/animate-pulse/g, '');
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log('Stripped mix-blend/pulse from ' + fullPath);
            }
        }
    }
}

processDir(path.join(process.cwd(), 'src'));
