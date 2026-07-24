const assert = require('assert');

const memory = new Map();
global.wx = {
  getStorageSync(key) { return memory.get(key); },
  setStorageSync(key, value) { memory.set(key, value); },
};

const {
  getFavorites,
  isFavorite,
  toggleFavorite,
  clearFavorites,
  getHistory,
  recordHistory,
  clearHistory,
} = require('../utils/storage');

assert.strictEqual(toggleFavorite('forbidden-city'), true, '首次收藏应返回 true');
assert.strictEqual(isFavorite('forbidden-city'), true);
assert.strictEqual(toggleFavorite('forbidden-city'), false, '再次点击应取消收藏');
assert.deepStrictEqual(getFavorites(), []);
toggleFavorite('tiananmen');
assert.strictEqual(toggleFavorite('food-quanjude-qianmen'), true, '美食 ID 应能与景点共用收藏存储');
assert.strictEqual(isFavorite('food-quanjude-qianmen'), true, '美食收藏应可被读取');
clearFavorites();
assert.deepStrictEqual(getFavorites(), [], '清空收藏后应无记录');

recordHistory('tiananmen');
recordHistory('forbidden-city');
recordHistory('tiananmen');
assert.deepStrictEqual(getHistory(), ['tiananmen', 'forbidden-city'], '历史记录应去重并置顶');

clearHistory();
for (let index = 0; index < 22; index += 1) recordHistory(`place-${index}`);
assert.deepStrictEqual(
  getHistory(),
  Array.from({ length: 20 }, (_, index) => `place-${21 - index}`),
  '历史记录最多保留 20 条',
);
clearHistory();
recordHistory('food-quanjude-qianmen');
recordHistory('food-quanjude-qianmen');
assert.deepStrictEqual(getHistory(), ['food-quanjude-qianmen'], '美食浏览记录应去重并置顶');
clearHistory();
assert.deepStrictEqual(getHistory(), [], '清空历史后应无记录');

memory.set('beijing-travel-mp:history', 'invalid-value');
assert.deepStrictEqual(getHistory(), [], '异常存储值应安全降级为空数组');

console.log('storage.test.js passed');
