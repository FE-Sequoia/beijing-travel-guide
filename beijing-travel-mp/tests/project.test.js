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
assert.strictEqual(app.lazyCodeLoading, 'requiredComponents');

app.tabBar.list.forEach((tab) => {
  assert.ok(app.pages.includes(tab.pagePath), `tabBar 页面未注册：${tab.pagePath}`);
});

const projectConfig = JSON.parse(fs.readFileSync(path.join(root, 'project.config.json'), 'utf8'));
assert.ok(projectConfig.setting.minified, 'project.config.json 应开启压缩');
const ignored = projectConfig.packOptions.ignore.map((item) => item.value);
['tests', 'scripts', 'README.md'].forEach((item) => {
  assert.ok(ignored.includes(item), `packOptions.ignore 缺少：${item}`);
});
projectConfig.condition.miniprogram.list.forEach((entry) => {
  assert.ok(app.pages.includes(entry.pathName), `condition 编译页面未注册：${entry.pathName}`);
});

const sitemap = JSON.parse(fs.readFileSync(path.join(root, 'sitemap.json'), 'utf8'));
assert.ok(sitemap.rules.length > 0, 'sitemap.json 应显式声明索引规则');

['categories.json', 'places.json', 'guides.json', 'itineraries.json'].forEach((file) => {
  assert.doesNotThrow(() => JSON.parse(fs.readFileSync(path.join(root, 'data', file), 'utf8')));
});

console.log('project.test.js passed');
