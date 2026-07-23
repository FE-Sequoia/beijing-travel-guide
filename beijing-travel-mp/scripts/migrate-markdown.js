const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../../docs');
const output = path.resolve(__dirname, '../data/places.json');
const existing = JSON.parse(fs.readFileSync(output, 'utf8'));
const known = new Set(existing.map((place) => place.id));
const categoryNames = { landmarks: '名胜古迹', history: '近代历史', religion: '宗教建筑', museums: '博物馆', parks: '城市公园' };
const files = [];
for (const categoryId of Object.keys(categoryNames)) {
  const dir = path.join(root, categoryId);
  for (const file of fs.readdirSync(dir).filter((name) => name.endsWith('.md') && name !== 'index.md')) files.push({ categoryId, file });
}
for (const item of files) {
  const id = `${item.categoryId}-${item.file.replace(/\.md$/, '')}`;
  if (known.has(id)) continue;
  const text = fs.readFileSync(path.join(root, item.categoryId, item.file), 'utf8');
  const title = (text.match(/^#\s+(.+)$/m) || [])[1] || item.file.replace(/\.md$/, '');
  const paragraphs = text.split(/\n\s*\n/).map((part) => part.replace(/^#+\s+/gm, '').replace(/[|*_`>#]/g, '').trim()).filter(Boolean);
  const summary = (paragraphs.find((part) => part.length > 12) || `${title}，等待继续整理详细攻略。`).slice(0, 80);
  existing.push({ id, name: title, categoryId: item.categoryId, summary, tags: [categoryNames[item.categoryId]], cover: '/assets/hero-image.svg', featured: false, funRank: 0, info: [], sections: [{ title: '攻略内容', body: paragraphs.slice(0, 3).join('\n\n') || summary }] });
}
fs.writeFileSync(output, `${JSON.stringify(existing, null, 2)}\n`);
console.log(`migrated ${existing.length} places`);
