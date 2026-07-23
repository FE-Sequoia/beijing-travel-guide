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

const homeWxml = fs.readFileSync(path.join(root, 'pages/home/index.wxml'), 'utf8');
const homeWxss = fs.readFileSync(path.join(root, 'pages/home/index.wxss'), 'utf8');
const homeJs = fs.readFileSync(path.join(root, 'pages/home/index.js'), 'utf8');
const exploreJs = fs.readFileSync(path.join(root, 'pages/explore/index.js'), 'utf8');
const appWxss = fs.readFileSync(path.join(root, 'app.wxss'), 'utf8');
assert.ok(homeWxml.includes('class="category-grid"'), '首页分类应使用六宫格容器');
assert.ok(!homeWxml.includes('scroll-x class="categories"'), '首页分类不应横向滚动');
assert.match(homeWxss, /\.category-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/s, '首页分类应为三列网格');
assert.ok(homeJs.includes("name: '全部景点'"), '首页分类应补足第六个入口');
assert.match(exploreJs, /pending\s*!==\s*undefined/, '探索页应能处理“全部景点”的空分类状态');
assert.match(appWxss, /box-sizing:\s*border-box/, '全局应使用 border-box 计算宽度');
assert.match(appWxss, /overflow-x:\s*hidden/, '页面应裁切意外的横向溢出');
assert.match(appWxss, /--paper:\s*#F7F3EC/, '全局应定义米白纸感背景令牌');
assert.match(appWxss, /--ink-green:\s*#1F5B4F/, '全局应定义墨绿主色令牌');
assert.match(appWxss, /\.body-copy\s*\{[^}]*line-height:\s*1\.9/s, '长正文应使用舒适行高');
assert.match(appWxss, /\.page\s*\{[^}]*padding:\s*32rpx/s, '页面应使用统一的水平留白');

['categories.json', 'places.json', 'guides.json', 'itineraries.json'].forEach((file) => {
  assert.doesNotThrow(() => JSON.parse(fs.readFileSync(path.join(root, 'data', file), 'utf8')));
});

console.log('project.test.js passed');
