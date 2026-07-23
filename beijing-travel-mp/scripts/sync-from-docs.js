const fs = require('fs');
const path = require('path');

const DOCS_ROOT = path.resolve(__dirname, '../../docs');
const DATA_ROOT = path.resolve(__dirname, '../data');

const CATEGORIES = {
  landmarks: { tag: '名胜古迹' },
  history: { tag: '近代历史' },
  religion: { tag: '宗教建筑' },
  museums: { tag: '博物馆' },
  parks: { tag: '城市公园' },
};

const FEATURED = new Set([
  'tiananmen',
  'forbidden-city',
  'national-museum',
  'temple-of-heaven',
  'summer-palace',
  'yuanmingyuan',
  'badaling',
  'mutianyu',
  'capital-museum',
  'beihai',
  'jingshan-park',
  'yonghegong',
  'nanluoguxiang',
  'shichahai',
  'qianmen',
]);

function listMarkdownFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      listMarkdownFiles(fullPath, files);
    } else if (stat.isFile() && entry.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

function docId(filePath, category) {
  const relative = path.relative(path.join(DOCS_ROOT, category), filePath);
  const withoutExt = relative.replace(/\.md$/, '');
  const normalized = withoutExt.endsWith('index') ? path.dirname(withoutExt) : withoutExt;
  return normalized.replace(/\//g, '-').replace(/^-|-$/g, '');
}

function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : '';
}

function extractFirstImage(content) {
  const match = content.match(/!\[[^\]]*\]\((https?:\/\/[^\)]+)\)/);
  return match ? match[1].split('?')[0] + '?w=800' : '';
}

function cleanInline(text) {
  return text.replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
}

function extractSummary(content) {
  const lines = content.split('\n');
  let started = false;
  let inBlock = false;
  for (const line of lines) {
    if (line.startsWith('#')) {
      started = true;
      continue;
    }
    if (!started) continue;
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith(':::')) {
      inBlock = !inBlock;
      continue;
    }
    if (inBlock) continue;
    if (trimmed.startsWith('>') || trimmed.startsWith('![') || trimmed.startsWith('|') || trimmed.startsWith('##') || trimmed.startsWith('---')) continue;
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) continue;
    if (/^\*\*.+\*\*:/.test(trimmed)) continue;
    return cleanInline(trimmed);
  }
  return '';
}

function extractInfo(content) {
  const info = [];
  const ticketMatch = content.match(/\*\*门票\*\*[:：]\s*(.+)/);
  if (ticketMatch) {
    info.push({ label: '门票', value: cleanInline(ticketMatch[1].trim()) });
  }
  const durationMatch = content.match(/\*\*(?:建议时长|游玩时间|建议游玩)\*\*[:：]\s*(.+)/);
  if (durationMatch) {
    info.push({ label: '建议时长', value: cleanInline(durationMatch[1].trim()) });
  }
  const highlightMatch = content.match(/\*\*看点\*\*[:：]\s*(.+)/);
  if (highlightMatch) {
    info.push({ label: '看点', value: cleanInline(highlightMatch[1].trim()) });
  }
  return info;
}

function isUselessHeading(title) {
  return ['目录', '提示', '导航', '子景点', '周边景点', '交通', '地址', '电话', '官网'].some((k) => title.includes(k));
}

function extractSections(content) {
  const sections = [];
  const headingRe = /^(#{2,3})\s+(.+)$/gm;
  let match;
  const headings = [];
  while ((match = headingRe.exec(content)) !== null) {
    headings.push({ level: match[1].length, title: match[2].trim(), index: match.index });
  }

  for (let i = 0; i < headings.length; i++) {
    const h = headings[i];
    if (isUselessHeading(h.title)) continue;
    const start = h.index + h.title.length + h.level + 1;
    const end = i < headings.length - 1 ? headings[i + 1].index : content.length;
    const body = content
      .slice(start, end)
      .split('\n')
      .filter((line) => {
        const t = line.trim();
        return t && !t.startsWith('![') && !t.startsWith('---') && !t.startsWith('|');
      })
      .map((line) => cleanInline(line.replace(/^\s*[-*]\s+/, '')))
      .join('\n')
      .trim();
    if (body) {
      sections.push({ title: h.title, body });
    }
  }
  return sections.slice(0, 6);
}

function parseDoc(filePath, category) {
  const content = fs.readFileSync(filePath, 'utf8');
  const rawName = extractTitle(content);
  const name = rawName.replace(/（[^）]+视角）/g, '').replace(/\s+/g, ' ').trim();
  const summary = extractSummary(content);
  const cover = extractFirstImage(content);
  const info = extractInfo(content);
  const sections = extractSections(content);
  return { id: docId(filePath, category), name, categoryId: category, summary, cover, info, sections };
}

function preferDoc(matches, preferredCategory) {
  const sameCategory = matches.find((d) => d.categoryId === preferredCategory);
  if (sameCategory) return sameCategory;
  return matches.find((d) => d.categoryId === 'landmarks') || matches[0];
}

function findDocForPlace(place, docs) {
  const candidates = [];

  const byId = docs.find((d) => d.id === place.id);
  if (byId) candidates.push(byId);

  const placeName = place.name.replace(/[\s]/g, '').toLowerCase();
  const nameMatches = docs.filter((d) => d.name.replace(/[\s]/g, '').toLowerCase() === placeName);
  candidates.push(...nameMatches);

  for (const prefix of ['landmarks-', 'history-', 'religion-', 'museums-', 'parks-']) {
    if (place.id.startsWith(prefix)) {
      const suffix = place.id.slice(prefix.length);
      const bySuffix = docs.filter((d) => d.id === suffix || d.id.endsWith(`-${suffix}`));
      candidates.push(...bySuffix);
    }
  }

  if (!candidates.length) return undefined;
  return preferDoc(candidates, place.categoryId);
}

const FALLBACK_COVERS = {
  landmarks: '/assets/hero-image.svg',
  history: '/assets/hero-emblem.svg',
  religion: '/assets/logo.svg',
  museums: '/assets/qing-beijing-map.svg',
  parks: '/assets/hero-image.svg',
};

function cleanCover(cover, categoryId) {
  const fallback = FALLBACK_COVERS[categoryId] || '/assets/hero-image.svg';
  if (!cover || !cover.startsWith('http')) return fallback;
  const match = cover.match(/images\.unsplash\.com\/(photo-.+)$/);
  if (!match) return cover;
  const photoId = match[1].split('?')[0];
  if (photoId.length < 25) return fallback;
  return cover;
}

function cleanExisting(place) {
  return {
    ...place,
    summary: cleanInline(place.summary).replace(/^!\[.*$/, '').trim() || place.summary,
    cover: cleanCover(place.cover, place.categoryId),
  };
}

function main() {
  const places = JSON.parse(fs.readFileSync(path.join(DATA_ROOT, 'places.json'), 'utf8'));
  const docs = [];

  for (const category of Object.keys(CATEGORIES)) {
    const dir = path.join(DOCS_ROOT, category);
    const topIndex = path.join(dir, 'index.md');
    const files = listMarkdownFiles(dir).filter((f) => f !== topIndex);
    for (const file of files) {
      const relative = path.relative(dir, file);
      const isSubIndex = file.endsWith('index.md') && relative.includes(path.sep);
      if (!isSubIndex && relative.includes(path.sep)) continue;
      try {
        const doc = parseDoc(file, category);
        if (doc.name) docs.push(doc);
      } catch (e) {
        console.warn(`Failed to parse ${file}: ${e.message}`);
      }
    }
  }

  const updated = places.map((place) => {
    const doc = findDocForPlace(place, docs);
    if (!doc) return cleanExisting(place);
    return {
      ...place,
      name: doc.name || place.name,
      categoryId: place.categoryId,
      summary: doc.summary || cleanInline(place.summary),
      tags: place.tags && place.tags.length ? place.tags : [CATEGORIES[doc.categoryId].tag],
      cover: cleanCover(doc.cover || place.cover, place.categoryId),
      featured: FEATURED.has(place.id),
      info: doc.info.length ? doc.info : place.info,
      sections: doc.sections.length ? doc.sections : place.sections,
    };
  });

  const outputPath = path.join(DATA_ROOT, 'places.json');
  fs.writeFileSync(outputPath, JSON.stringify(updated, null, 2), 'utf8');
  console.log(`Updated ${updated.length} places at ${outputPath}`);
}

main();
