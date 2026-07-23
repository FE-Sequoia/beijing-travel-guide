const assert = require('assert');
const fs = require('fs');
const path = require('path');

const dataModuleSource = fs.readFileSync(path.join(__dirname, '../utils/data.js'), 'utf8');
assert.ok(
  !/require\(['\"]\.\.\/data\/[^'\"]+\.json['\"]\)/.test(dataModuleSource),
  '小程序数据层不能直接 require JSON 文件，应通过 JS 数据模块加载',
);
const {
  getCategories,
  getPlaces,
  getPlaceById,
  getGuides,
  getGuideById,
  getItineraries,
  getItineraryByDays,
  getRelatedPlaces,
} = require('../utils/data');

const docsRoot = path.resolve(__dirname, '../../docs');
const placeCategories = ['landmarks', 'museums', 'parks', 'religion', 'history'];
function eligibleMarkdown(categoryId) {
  const categoryRoot = path.join(docsRoot, categoryId);
  const files = [];
  function walk(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(file);
      if (!entry.name.endsWith('.md')) return;
      if (path.relative(categoryRoot, file) === 'index.md') return;
      files.push(path.relative(docsRoot, file).split(path.sep).join('/'));
    });
  }
  walk(categoryRoot);
  return files.sort();
}

assert.ok(getCategories().length > 0, '分类数据应可读取');
assert.ok(getPlaces({ categoryId: 'museums' }).every((place) => place.categoryId === 'museums'));
assert.ok(getPlaces({ featured: true }).every((place) => place.featured), '趣玩查询只能返回推荐景点');
assert.ok(getPlaces({ keyword: '故宫' }).some((place) => place.id === 'forbidden-city'), '关键词应匹配景点名称');
assert.deepStrictEqual(
  getPlaces({ categoryId: 'museums', sort: 'name' }).map((place) => place.name),
  getPlaces({ categoryId: 'museums' }).map((place) => place.name).slice().sort((a, b) => a.localeCompare(b, 'zh-Hans-CN')),
  '名称排序应按中文名称升序返回',
);
assert.strictEqual(getPlaceById('missing-place'), null, '未知景点应返回 null');
assert.ok(getGuides().length >= 7, '应提供基础行前攻略');
assert.strictEqual(getGuideById('missing-guide'), null, '未知攻略应返回 null');

const expectedPlaceSources = placeCategories.flatMap(eligibleMarkdown).sort();
const expectedGuideSources = eligibleMarkdown('guide');
const syncedPlaces = getPlaces();
assert.strictEqual(syncedPlaces.length, expectedPlaceSources.length, '每篇可迁移景点文档都应成为独立景点');
assert.deepStrictEqual(syncedPlaces.map((place) => place.sourcePath).sort(), expectedPlaceSources, '景点数据应覆盖所有 Web 来源文档');
assert.strictEqual(getGuides().length, expectedGuideSources.length, '每篇实用攻略都应成为独立攻略');
assert.deepStrictEqual(getGuides().map((guide) => guide.sourcePath).sort(), expectedGuideSources, '攻略数据应覆盖所有 Web 来源文档');
const wumen = syncedPlaces.find((place) => place.sourcePath === 'landmarks/forbidden-city/wumen.md');
assert.ok(wumen, '故宫子景点应成为独立条目');
assert.strictEqual(wumen.parentId, 'forbidden-city', '故宫子景点应关联到父级景点');
assert.strictEqual(getPlaceById('forbidden-city').parentId, '', '目录首页生成的父级景点不应关联到自身');
assert.ok(wumen.summary && wumen.sections.length > 0, '转换后的子景点应具有可阅读详情');
assert.ok(getRelatedPlaces(wumen).some((place) => place.id === 'forbidden-city'), '子景点详情应能找到父级地点');
assert.ok(getRelatedPlaces(getPlaceById('forbidden-city')).some((place) => place.id === wumen.id), '父级地点详情应能找到子景点');

['places', 'guides'].forEach((name) => {
  const json = JSON.parse(fs.readFileSync(path.join(__dirname, `../data/${name}.json`), 'utf8'));
  assert.deepStrictEqual(require(`../data/${name}`), json, `${name}.js 应与 ${name}.json 保持一致`);
});

assert.deepStrictEqual(
  getItineraries().map((item) => item.days),
  [1, 2, 3, 5, 7],
  '应提供 1、2、3、5、7 日路线',
);
assert.strictEqual(getItineraryByDays(3).days, 3, '应按天数查询路线');
assert.strictEqual(getItineraryByDays(4), null, '未配置的天数应返回 null');
getItineraries().forEach((itinerary) => itinerary.schedule.forEach((day) => day.stops.forEach((stop) => {
  assert.ok(getPlaceById(stop.placeId), `${itinerary.days} 日路线引用了未知景点 ${stop.placeId}`);
})));

console.log('data.test.js passed');
