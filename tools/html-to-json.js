/**
 * 工具脚本：从 software.html 重新生成 software.json
 * 当 HTML 中的链接有更新时，运行此脚本同步到 JSON
 * 用法：node tools/html-to-json.js
 */
const fs = require('fs');

const html = fs.readFileSync(__dirname + '/../software.html', 'utf-8');

function getLinks(html) {
    const links = [];
    const re = /<a href="([^"]+)"([^>]*)>([^<]+)<\/a>/g;
    let m;
    while ((m = re.exec(html)) !== null) {
        const url = m[1], attrs = m[2], name = m[3].trim();
        if ((url === '#' && !name) || name.includes('其他')) continue;
        const link = { name, url };
        const tm = attrs.match(/title="([^"]+)"/);
        if (tm) link.title = tm[1];
        const om = attrs.match(/onclick="([^"]+)"/);
        if (om) link.onclick = om[1];
        links.push(link);
    }
    return links;
}

// Main section
const mainMatch = html.match(/<section id="c-section">([\s\S]*?)<\/section>/);
const mainHTML = mainMatch ? mainMatch[1] : '';
const mainParts = mainHTML.split(/<h3>([^<]+)<\/h3>/);
const mainCategories = [];
for (let i = 1; i < mainParts.length; i += 2) {
    const name = mainParts[i].trim();
    const links = getLinks(mainParts[i + 1] || '');
    if (links.length > 0) mainCategories.push({ name, links });
}

// Sub-sections
const secRe = /<section id="(c-section-sub\d+)"[^>]*>([\s\S]*?)<\/section>/g;
const subSections = {};
let sm;
while ((sm = secRe.exec(html)) !== null) {
    const id = sm[1], content = sm[2];
    const titleM = content.match(/<h2 class="section-title">([^<]+)<\/h2>/);
    const title = titleM ? titleM[1].trim() : '';
    const parts = content.split(/<h3>([^<]+)<\/h3>/);
    if (parts.length > 1) {
        const cats = [];
        for (let i = 1; i < parts.length; i += 2) {
            const name = parts[i].trim();
            const links = getLinks(parts[i + 1] || '');
            if (links.length > 0) cats.push({ name, links });
        }
        subSections[id] = { title, categories: cats };
    } else {
        subSections[id] = { title, links: getLinks(content) };
    }
}

const result = { page: 'software', mainCategories, subSections };
const outPath = __dirname + '/../data/software.json';
fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf-8');

let totalLinks = 0;
mainCategories.forEach(c => { totalLinks += c.links.length; });
for (const [, ss] of Object.entries(subSections)) {
    if (ss.categories) ss.categories.forEach(c => { totalLinks += c.links.length; });
    if (ss.links) totalLinks += ss.links.length;
}
console.log('Main categories:', mainCategories.length);
console.log('Sub-sections:', Object.keys(subSections).length);
console.log('Total links:', totalLinks);
console.log('Output:', outPath);
