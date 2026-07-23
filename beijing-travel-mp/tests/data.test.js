const assert = require('assert');
const {
  getCategories,
  getPlaces,
  getPlaceById,
} = require('../utils/data');

assert.ok(getCategories().length > 0, '分类数据应可读取');
assert.ok(getPlaces({ categoryId: 'museums' }).every((place) => place.categoryId === 'museums'));
assert.strictEqual(getPlaceById('missing-place'), null, '未知景点应返回 null');

console.log('data.test.js passed');
