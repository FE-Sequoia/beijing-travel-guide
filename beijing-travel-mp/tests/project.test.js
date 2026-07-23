const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const app = JSON.parse(fs.readFileSync(path.join(root, 'app.json'), 'utf8'));

app.pages.forEach((page) => {
  ['.js', '.json', '.wxml', '.wxss'].forEach((extension) => {
    assert.ok(fs.existsSync(path.join(root, page + extension)), `缺少页面文件：${page + extension}`);
  });
});
assert.deepStrictEqual(app.tabBar.list.map((item) => item.text), ['首页', '探索', '攻略', '我的']);
assert.ok(app.pages.includes('pages/itineraries/index'));
assert.ok(app.pages.includes('pages/itinerary-detail/index'));

['categories.json', 'places.json', 'guides.json', 'itineraries.json'].forEach((file) => {
  assert.doesNotThrow(() => JSON.parse(fs.readFileSync(path.join(root, 'data', file), 'utf8')));
});

console.log('project.test.js passed');
