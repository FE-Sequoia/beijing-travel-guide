const fs = require('fs');
const path = require('path');

const DOCS_ROOT = path.resolve(__dirname, '../../docs');
const DATA_ROOT = path.resolve(__dirname, '../data');
const PLACE_CATEGORIES = {
  landmarks: { tag: '必玩景点', fallback: 'https://images.unsplash.com/photo-1509195070461-b99ef33ceb67?w=800' },
  history: { tag: '热门景点', fallback: 'https://images.unsplash.com/photo-1583977393611-885b3e5cc701?w=800' },
  religion: { tag: '特色景点', fallback: 'https://images.unsplash.com/photo-1782915763074-87f3c2c62fc1?w=800' },
  museums: { tag: '商圈夜景', fallback: 'https://images.unsplash.com/photo-1701847895783-979e086dae5e?w=800' },
  parks: { tag: '公园漫步', fallback: 'https://images.unsplash.com/photo-1736237174975-0be4f327f35d?w=800' },
};
const COVER_OVERRIDES = {
  'national-museum': 'https://images.unsplash.com/photo-1701847895783-979e086dae5e?w=800',
  'jingshan-park': 'https://images.unsplash.com/photo-1736237174975-0be4f327f35d?w=800',
  '798-art-zone': 'https://images.unsplash.com/photo-1639303638626-2003b9ac307e?w=800',
  'dashilan': 'https://images.unsplash.com/photo-1609788402404-5f5fac3f99a1?w=800',
  'landmarks-gongwangfu': 'https://images.unsplash.com/photo-1757229238044-499fafb313e1?w=800',
  'guozijian': 'https://images.unsplash.com/photo-1662165572076-fc1b28adf342?w=800',
  'landmarks-nanluoguxiang': 'https://images.unsplash.com/photo-1590301729964-23833732ee04?w=800',
  'national-theatre': 'https://images.unsplash.com/photo-1643578006768-ebeb3a175965?w=800',
  'niaochao': 'https://images.unsplash.com/photo-1748015331424-e1a00584a42d?w=800',
  'panjiayuan': 'https://images.unsplash.com/photo-1587825338028-f1d568e0dbb3?w=800',
  'landmarks-qianmen': 'https://images.unsplash.com/photo-1662791950162-001406e3aedb?w=800',
  'landmarks-shichahai': 'https://images.unsplash.com/photo-1613798518288-2e2ae91220ea?w=800',
  'zhengyangmen': 'https://images.unsplash.com/photo-1609788402404-5f5fac3f99a1?w=800',
  'zhonglou': 'https://images.unsplash.com/photo-1770944272463-38544f2f591f?w=800',
  'botanical-garden': 'https://images.unsplash.com/photo-1779126745580-a44077b3f71c?w=800',
  'xiangshan': 'https://images.unsplash.com/photo-1557228682-652da9b4cc60?w=800',
};
const GUIDE_ICONS = { 'best-time': '🌤️', transportation: '🚇', tickets: '🎫', accommodation: '🛏️', food: '🥢', theater: '🎭', routes: '🗺️', tips: '💡' };
const FEATURED_IDS = new Set(['tiananmen', 'forbidden-city', 'jingshan-park', 'national-museum', '798-art-zone', 'yonghegong', 'landmarks-gongwangfu', 'landmarks-shichahai']);
const EXCLUDED_SOURCES = new Set([
  'history/anti-japanese-war.md',
  'history/cai-yuanpei.md',
  'history/guo-moruo-residence.md',
  'history/lugou-bridge.md',
  'history/mao-dun-residence.md',
  'history/mausoleum.md',
  'history/monument.md',
  'history/national-museum.md',
  'history/soong-ching-ling-residence.md',
  'history/summer-palace.md',
  'history/yuanmingyuan-ruins.md',
  'landmarks/juyongguan.md',
  'landmarks/lao-she-teahouse.md',
  'museums/laoshe.md',
  'museums/lu-xun.md',
  'museums/military.md',
  'museums/natural-history.md',
  'museums/paleo-zoo.md',
  'museums/planetarium.md',
  'museums/science-center.md',
  'parks/beijing-zoo.md',
  'parks/cultural-palace.md',
  'parks/wenyuhe.md',
  'parks/zizhuyuan.md',
  'religion/catholic-churches.md',
  'religion/dongyuemiao.md',
  'religion/fayuan.md',
  'religion/guangji.md',
  'religion/huoshen.md',
  'religion/jietai.md',
  'religion/nantang.md',
  'religion/tanzhe.md',
]);
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
  fs.writeFileSync(path.join(DATA_ROOT, `${name}.js`), `// 由 scripts/sync-from-docs.js 自动生成，请勿手动编辑。\nmodule.exports = ${json};\n`, 'utf8');
}

function main() {
  const previous = require(path.join(DATA_ROOT, 'places'));
  const previousById = new Map(previous.map((place) => [place.id, place]));
  const places = Object.keys(PLACE_CATEGORIES).flatMap((categoryId) => listMarkdownFiles(path.join(DOCS_ROOT, categoryId))
    .filter((file) => sourcePath(file) !== `${categoryId}/index.md` && !EXCLUDED_SOURCES.has(sourcePath(file)))
    .map((file) => {
      const markdown = fs.readFileSync(file, 'utf8');
      const id = canonicalId(categoryId, file);
      const old = previousById.get(id) || {};
      const name = titleOf(markdown, id);
      return {
        id, sourcePath: sourcePath(file), parentId: parentId(categoryId, file), name, categoryId,
        summary: summaryOf(markdown, `${name}，等待继续整理详细攻略。`), tags: old.tags && old.tags.length ? old.tags : [PLACE_CATEGORIES[categoryId].tag],
        cover: COVER_OVERRIDES[id] || coverOf(markdown, PLACE_CATEGORIES[categoryId].fallback), featured: FEATURED_IDS.has(id), funRank: old.funRank || 999,
        info: infoOf(markdown), sections: sectionsOf(markdown, name),
      };
    })).filter((place) => place.parentId === '').sort((a, b) => a.sourcePath.localeCompare(b.sourcePath));
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

if (require.main === module) main();
module.exports = { EXCLUDED_SOURCES };
