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
} = require('../utils/data');

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
