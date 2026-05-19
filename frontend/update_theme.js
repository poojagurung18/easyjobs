const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) {
            walkDir(dirPath, callback);
        } else if (dirPath.endsWith('.jsx') || dirPath.endsWith('.js')) {
            callback(dirPath);
        }
    });
}

function processTheme(dir) {
    walkDir(dir, (filePath) => {
        let content = fs.readFileSync(filePath, 'utf-8');
        let original = content;

        // Remove dark:* utility classes
        content = content.replace(/\bdark:[[\]a-zA-Z0-9_/%#:-]+\b/g, '');
        
        // Clean up multiple spaces
        content = content.replace(/ \s+/g, ' ');
        content = content.replace(/ "/g, '"');
        content = content.replace(/ '/g, "'");
        content = content.replace(/ `/g, '`');
        
        // Replace background off-whites to plain white
        content = content.replace(/\bbg-gray-50\b/g, 'bg-white');

        // Replace blue accents with gray-950 accents as requested
        content = content.replace(/\bbg-blue-600\b/g, 'bg-gray-950');
        content = content.replace(/\bhover:bg-blue-700\b/g, 'hover:bg-gray-800');
        content = content.replace(/\bborder-blue-500\b/g, 'border-gray-950');
        content = content.replace(/\bborder-blue-600\b/g, 'border-gray-950');
        content = content.replace(/\bring-blue-500\b/g, 'ring-gray-950');
        content = content.replace(/\bfocus:ring-blue-500\/20\b/g, 'focus:ring-gray-950/20');
        content = content.replace(/\btext-blue-600\b/g, 'text-gray-950');
        content = content.replace(/\bbg-blue-50\b/g, 'bg-gray-100');
        content = content.replace(/\btext-blue-500\b/g, 'text-gray-900');
        content = content.replace(/\bbg-blue-100\b/g, 'bg-gray-200');
        content = content.replace(/\bbg-blue-900\b/g, 'bg-gray-800');

        if (original !== content) {
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log('Updated', filePath);
        }
    });
}

processTheme('./src');
