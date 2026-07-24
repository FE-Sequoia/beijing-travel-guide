const fs = require('fs');
const path = require('path');

const DOCS_ROOT = path.resolve(__dirname, '../../docs');
const DATA_ROOT = path.resolve(__dirname, '../data');
const PLACE_CATEGORIES = {
  landmarks: { tag: '名胜古迹', fallback: 'https://images.unsplash.com/photo-1509195070461-b99ef33ceb67?w=800' },
  history: { tag: '近代历史', fallback: 'https://images.unsplash.com/photo-1583977393611-885b3e5cc701?w=800' },
  religion: { tag: '宗教建筑', fallback: 'https://images.unsplash.com/photo-1782915763074-87f3c2c62fc1?w=800' },
  museums: { tag: '博物馆', fallback: 'https://images.unsplash.com/photo-1701847895783-979e086dae5e?w=800' },
  parks: { tag: '城市公园', fallback: 'https://images.unsplash.com/photo-1736237174975-0be4f327f35d?w=800' },
};
const COVER_OVERRIDES = {
  'national-museum': 'https://images.unsplash.com/photo-1701847895783-979e086dae5e?w=800',
  'jingshan-park': 'https://images.unsplash.com/photo-1736237174975-0be4f327f35d?w=800',
};
const GUIDE_ICONS = { 'best-time': '🌤️', transportation: '🚇', tickets: '🎫', accommodation: '🛏️', food: '🥢', theater: '🎭', routes: '🗺️', tips: '💡' };
const FEATURED_IDS = new Set(['tiananmen', 'national-museum', 'forbidden-city', 'cao-xueqin-former-residence']);
const LEGACY_IDS = {
  'history/tiananmen-square.md': 'tiananmen',
  'museums/national-museum.md': 'national-museum',
  'landmarks/forbidden-city/index.md': 'forbidden-city',
  'parks/jingshan-park.md': 'jingshan-park',
  'landmarks/shichahai.md': 'landmarks-shichahai',
  'parks/beihai-park.md': 'parks-beihai-park',
  'history/summer-palace.md': 'history-summer-palace',
  'history/yuanmingyuan-ruins.md': 'history-yuanmingyuan-ruins',
  'parks/olympic-forest.md': 'parks-olympic-forest',
  'landmarks/qianmen.md': 'landmarks-qianmen',
  'landmarks/nanluoguxiang.md': 'landmarks-nanluoguxiang',
  'parks/temple-heaven.md': 'parks-temple-heaven',
  'history/cao-xueqin-residence.md': 'cao-xueqin-former-residence',
  'landmarks/gongwangfu.md': 'landmarks-gongwangfu',
};

function listMarkdownFiles(dir, files = []) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) listMarkdownFiles(file, files);
    else if (entry.name.endsWith('.md')) files.push(file);
  });
  return files;
}

function sourcePath(file) { return path.relative(DOCS_ROOT, file).split(path.sep).join('/'); }
function stripMarkdown(value) {
  return value.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[`*_>#]/g, '').replace(/\s+/g, ' ').trim();
}
function titleOf(markdown, fallback) { return stripMarkdown((markdown.match(/^#\s+(.+)$/m) || [])[1] || fallback); }
function coverOf(markdown, fallback) {
  const cover = (markdown.match(/!\[[^\]]*\]\((https?:\/\/[^)]+)\)/) || [])[1];
  return cover ? cover.split('?')[0] + '?w=800' : fallback;
}
function summaryOf(markdown, fallback) {
  const blocks = markdown.split(/\n\s*\n/).map(stripMarkdown)
    .filter((block) => block.length > 20 && !/^\|/.test(block) && !/^#{1,3}\s/.test(block));
  return (blocks[0] || fallback).slice(0, 220);
}
function sectionsOf(markdown, fallback) {
  const lines = markdown.split('\n');
  const sections = [];
  let current = null;
  lines.forEach((line) => {
    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      if (current && current.body.length) sections.push({ title: current.title, body: current.body.join('\n').trim() });
      current = { title: stripMarkdown(heading[1]), body: [] };
    } else if (current && !/^!\[/.test(line) && !/^\|/.test(line) && !/^---+$/.test(line.trim())) {
      const nested = line.match(/^###\s+(.+)$/);
      current.body.push(nested ? `【${stripMarkdown(nested[1])}】` : stripMarkdown(line));
    }
  });
  if (current && current.body.length) sections.push({ title: current.title, body: current.body.join('\n').replace(/\n{3,}/g, '\n\n').trim() });
  return sections.filter((section) => section.body).length ? sections.filter((section) => section.body) : [{ title: '内容', body: fallback }];
}
function infoOf(markdown) {
  const info = [];
  markdown.split('\n').forEach((line) => {
    if (!/^\|/.test(line) || /^\|\s*:?-+/.test(line)) return;
    const cells = line.split('|').slice(1, -1).map(stripMarkdown);
    if (cells.length < 2 || ['项目', '内容', '数据', '类别', '餐厅', '糕点', '店铺'].includes(cells[0])) return;
    if (cells[0] && cells[1]) info.push({ label: cells[0], value: cells.slice(1).join('｜') });
  });
  return info.slice(0, 10);
}
function canonicalId(categoryId, file) {
  const source = sourcePath(file);
  if (LEGACY_IDS[source]) return LEGACY_IDS[source];
  let relative = source.replace(`${categoryId}/`, '').replace(/\.md$/, '');
  if (relative.endsWith('/index')) relative = relative.slice(0, -6);
  const id = relative.replace(/\//g, '-');
  if ((categoryId === 'history' && ['national-museum', 'summer-palace'].includes(id)) || (categoryId === 'museums' && id === 'palace-museum')) return `${categoryId}-${id}`;
  return id;
}
function parentId(categoryId, file) {
  const relative = sourcePath(file).replace(`${categoryId}/`, '').replace(/\.md$/, '');
  if (relative.endsWith('/index')) return '';
  const parent = path.posix.dirname(relative);
  return parent === '.' ? '' : parent;
}
function writeData(name, records) {
  const json = `${JSON.stringify(records, null, 2)}\n`;
  fs.writeFileSync(path.join(DATA_ROOT, `${name}.json`), json, 'utf8');
  fs.writeFileSync(path.join(DATA_ROOT, `${name}.js`), `// 由 scripts/sync-from-docs.js 自动生成，请勿手动编辑。\nmodule.exports = ${JSON.stringify(records, null, 2)};\n`, 'utf8');
}

function main() {
  const previous = JSON.parse(fs.readFileSync(path.join(DATA_ROOT, 'places.json'), 'utf8'));
  const previousById = new Map(previous.map((place) => [place.id, place]));
  const places = Object.keys(PLACE_CATEGORIES).flatMap((categoryId) => listMarkdownFiles(path.join(DOCS_ROOT, categoryId))
    .filter((file) => sourcePath(file) !== `${categoryId}/index.md`)
    .map((file) => {
      const markdown = fs.readFileSync(file, 'utf8');
      const id = canonicalId(categoryId, file);
      const old = previousById.get(id) || {};
      const name = titleOf(markdown, id);
      return {
        id, sourcePath: sourcePath(file), parentId: parentId(categoryId, file), name, categoryId,
        summary: summaryOf(markdown, `${name}，等待继续整理详细攻略。`), tags: old.tags && old.tags.length ? old.tags : [PLACE_CATEGORIES[categoryId].tag],
        cover: COVER_OVERRIDES[id] || coverOf(markdown, PLACE_CATEGORIES[categoryId].fallback), featured: old.featured || FEATURED_IDS.has(id), funRank: old.funRank || 999,
        info: infoOf(markdown), sections: sectionsOf(markdown, name),
      };
    })).sort((a, b) => a.sourcePath.localeCompare(b.sourcePath));
  const guides = listMarkdownFiles(path.join(DOCS_ROOT, 'guide')).filter((file) => sourcePath(file) !== 'guide/index.md')
    .map((file) => {
      const markdown = fs.readFileSync(file, 'utf8');
      const id = path.basename(file, '.md');
      const title = titleOf(markdown, id);
      return { id, sourcePath: sourcePath(file), title, summary: summaryOf(markdown, title), icon: GUIDE_ICONS[id] || '📖', sections: sectionsOf(markdown, title) };
    }).sort((a, b) => a.sourcePath.localeCompare(b.sourcePath));
  writeData('places', places);
  writeData('guides', guides);
  console.log(`Synced ${places.length} places and ${guides.length} guides from docs.`);
}

main();
