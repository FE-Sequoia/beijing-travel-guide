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
  getRelatedPlaces,
  getGuides,
  getGuideById,
  getItineraries,
  getItineraryByDays,
  getFoods,
  getFoodById,
} = require('../utils/data');

const { EXCLUDED_SOURCES } = require('../scripts/sync-from-docs');
const docsRoot = path.resolve(__dirname, '../../docs');
const placeCategories = ['landmarks', 'museums', 'parks', 'religion', 'history'];
function isFirstLevel(categoryId, file) {
  const relative = path.relative(path.join(docsRoot, categoryId), file).split(path.sep).join('/');
  if (relative === 'index.md') return false;
  if (relative.endsWith('/index.md')) return true;
  return !relative.includes('/');
}
function eligibleMarkdown(categoryId) {
  const categoryRoot = path.join(docsRoot, categoryId);
  const files = [];
  function walk(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(file);
      if (!entry.name.endsWith('.md')) return;
      const source = path.relative(docsRoot, file).split(path.sep).join('/');
      if (isFirstLevel(categoryId, file) && !EXCLUDED_SOURCES.has(source)) files.push(source);
    });
  }
  walk(categoryRoot);
  return files.sort();
}

assert.ok(getCategories().length > 0, '分类数据应可读取');
assert.ok(getCategories().some((category) => category.id === 'featured'), '必玩景点应为独立分类');
assert.deepStrictEqual(
  getPlaces({ categoryId: 'history' }).map((place) => place.id).sort(),
  ['landmarks-nanluoguxiang', 'niaochao', 'parks-temple-heaven'],
  '热门景点应仅收录精选成员',
);
assert.deepStrictEqual(
  getPlaces({ categoryId: 'religion' }).map((place) => place.id).sort(),
  ['dongjiaominxiang', 'guozijian', 'liangma-river', 'shougang', 'wudaoying-hutong', 'yangmeizhu-xiejie'],
  '特色景点应仅收录精选成员',
);
assert.deepStrictEqual(
  getPlaces({ categoryId: 'museums' }).map((place) => place.id).sort(),
  ['blue-harbor', 'guomao-viewing-deck', 'heshenghui', 'huaxi', 'sanlitun', 'wangfujing'],
  '商圈夜景应仅收录精选成员',
);
assert.ok(getPlaces().every((place) => !['cao-xueqin-former-residence', 'peking-university-red', 'lao-she-residence', 'lu-xun-residence', 'baiyunguan', 'beitang', 'dongtang', 'xitang', 'capital-museum', 'museums-palace-museum'].includes(place.id)), '被移除的旧分类景点不应出现在小程序数据中');
assert.ok(getPlaces().every((place) => Array.isArray(place.categories)), '每个景点都应具备分类成员数组');
assert.ok(getPlaces().every((place) => place.categories.length > 0 || place.featured), '非必玩景点应归属至少一个分类');
assert.ok(getPlaces({ categoryId: 'museums' }).every((place) => place.categoryId === 'museums'));
assert.ok(['tiananmen', 'yonghegong', 'national-museum'].every((id) => getPlaceById(id).categoryName === '必玩景点'), '仅归入必玩景点的地点徽标不应显示原目录分类');
assert.ok(['wudaoying-hutong', 'yangmeizhu-xiejie', 'liangma-river', 'shougang'].every((id) => getPlaceById(id).categoryName === '特色景点'), '新特色景点徽标应为特色景点');
assert.ok(['wangfujing', 'heshenghui', 'sanlitun', 'huaxi', 'blue-harbor'].every((id) => getPlaceById(id).categoryName === '商圈夜景'), '新商圈夜景徽标应为商圈夜景');
assert.ok(getPlaces({ featured: true }).every((place) => place.featured), '趣玩查询只能返回推荐景点');
assert.deepStrictEqual(
  getPlaces({ categoryId: 'featured' }).map((place) => place.id),
  getPlaces({ featured: true }).map((place) => place.id),
  '必玩景点分类应返回与推荐标记一致的景点',
);
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

const allPlaces = getPlaces();
assert.ok(allPlaces.every((place) => /^https:\/\//.test(place.cover)), '所有地点封面都应使用网络实拍图，不应回退到本地 SVG 占位图');
assert.strictEqual(getPlaceById('national-museum').cover, 'https://images.unsplash.com/photo-1701847895783-979e086dae5e?w=800', '中国国家博物馆应使用网络实拍封面');
assert.strictEqual(getPlaceById('jingshan-park').cover, 'https://images.unsplash.com/photo-1736237174975-0be4f327f35d?w=800', '景山公园应使用网络实拍封面');
assert.ok(syncedPlaces.every((place) => place.parentId === ''), '景点数据应只保留一级景点');
assert.strictEqual(getPlaceById('forbidden-city').parentId, '', '目录首页生成的父级景点不应关联到自身');
assert.ok(getPlaceById('forbidden-city').summary && getPlaceById('forbidden-city').sections.length > 0, '一级景点应具有可阅读详情');
assert.ok(getPlaceById('forbidden-city').children.length >= 10, '故宫应包含景区内子景点导览');
assert.strictEqual(getPlaceById('forbidden-city').children[0].id, 'forbidden-city-baohe-dian', '子景点应使用规范 ID');
assert.ok(getPlaceById('forbidden-city-baohe-dian') && getPlaceById('forbidden-city-baohe-dian').parentId === 'forbidden-city', '子景点应可单独打开并关联父级');
assert.ok(getPlaceById('forbidden-city-baohe-dian').sections.length > 0, '子景点应具有可阅读详情');
assert.deepStrictEqual(getRelatedPlaces(getPlaceById('forbidden-city-baohe-dian')).map((p) => p.id), ['forbidden-city'], '子景点应提供返回父级关联');
assert.ok(getPlaces().every((place) => place.parentId === ''), '列表查询不应混入子景点');
const ticketsGuide = getGuideById('tickets');
assert.ok(ticketsGuide.sections.some((section) => /故宫博物院｜提前7天/.test(section.body)), '攻略表格内容应转换为可读文本，不丢失表格信息');

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

const foods = getFoods();
assert.strictEqual(foods.length, 13, '美食精选应收录 13 家餐厅');
assert.strictEqual(new Set(foods.map((food) => food.id)).size, 13, '美食 ID 应保持唯一');
const placeIds = new Set(allPlaces.map((place) => place.id));
assert.ok(foods.every((food) => !placeIds.has(food.id)), '美食 ID 不应与景点 ID 冲突，以保证共享收藏存储可区分内容类型');
foods.forEach((food) => {
  assert.match(food.id, /^food-/, '美食 ID 应使用 food- 前缀');
  assert.match(food.cover, /^https:\/\//, `${food.name} 应使用网络实拍封面`);
  assert.ok(Number.isInteger(food.rating) && food.rating >= 1 && food.rating <= 5, `${food.name} 应有 1-5 的推荐指数`);
  ['name', 'summary', 'signature', 'address', 'tips'].forEach((field) => assert.ok(food[field], `${food.id} 缺少 ${field}`));
  assert.deepStrictEqual(food.sections.map((section) => section.title), ['美食发展历史', '品牌历史'], `${food.name} 应提供两段历史介绍`);
});
assert.strictEqual(getFoodById('missing-food'), null, '未知美食应返回 null');
assert.strictEqual(getFoodById(foods[0].id).name, foods[0].name, '应能按 ID 查询美食详情');

console.log('data.test.js passed');
