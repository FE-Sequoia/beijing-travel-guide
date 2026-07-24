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

app.pages.forEach((page) => {
  const wxml = fs.readFileSync(path.join(root, page + '.wxml'), 'utf8').trim();
  assert.ok(!/^<scroll-view\b[^>]*\bscroll-y\b/.test(wxml), `${page} 不应使用根纵向 scroll-view，应使用原生页面滚动`);
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
const exploreWxml = fs.readFileSync(path.join(root, 'pages/explore/index.wxml'), 'utf8');
const guidesWxml = fs.readFileSync(path.join(root, 'pages/guides/index.wxml'), 'utf8');
const profileWxml = fs.readFileSync(path.join(root, 'pages/profile/index.wxml'), 'utf8');
const appWxss = fs.readFileSync(path.join(root, 'app.wxss'), 'utf8');
assert.ok(homeWxml.includes('class="category-grid"'), '首页分类应使用六宫格容器');
assert.ok(!homeWxml.includes('scroll-x class="categories"'), '首页分类不应横向滚动');
assert.match(homeWxss, /\.category-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/s, '首页分类应为三列网格');
assert.match(homeWxml, /class="featured-grid"/, '首页趣玩应使用两列内容网格');
assert.ok(!homeWxml.includes('scroll-x class="places"'), '首页趣玩不应使用横向滚动');
assert.match(homeWxss, /\.featured-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/s, '趣玩应为两列网格');
assert.ok(homeJs.includes("name: '全部景点'"), '首页分类应补足第六个入口');
assert.match(exploreJs, /pending\s*!==\s*undefined/, '探索页应能处理“全部景点”的空分类状态');
assert.match(appWxss, /box-sizing:\s*border-box/, '全局应使用 border-box 计算宽度');
assert.match(appWxss, /overflow-x:\s*hidden/, '页面应裁切意外的横向溢出');
assert.match(appWxss, /--paper:\s*#F7F3EC/, '全局应定义米白纸感背景令牌');
assert.match(appWxss, /--ink-green:\s*#1F5B4F/, '全局应定义墨绿主色令牌');
assert.match(appWxss, /\.body-copy\s*\{[^}]*line-height:\s*1\.9/s, '长正文应使用舒适行高');
assert.match(appWxss, /\.page\s*\{[^}]*padding:\s*32rpx/s, '页面应使用统一的水平留白');
assert.match(appWxss, /\.section-gap\s*\{[^}]*margin-top:\s*48rpx/s, '区块应使用统一的 48rpx 间距');

const placeCardWxss = fs.readFileSync(path.join(root, 'components/place-card/index.wxss'), 'utf8');
assert.match(placeCardWxss, /-webkit-line-clamp:\s*2/, '地点卡摘要应最多显示两行');
assert.match(placeCardWxss, /\.compact\s*\{[^}]*width:\s*100%/s, '紧凑卡应填满其网格单元');
assert.match(placeCardWxss, /\.card\s*\{[^}]*box-sizing:\s*border-box/s, '隔离组件内的卡片应自行使用 border-box');
assert.match(homeWxss, /\.hero\s+\.eyebrow\s*\{[^}]*color:\s*#FFF/s, '首页 Hero 眉题应使用高对比白色');
assert.match(placeCardWxss, /\.compact\s*\{[^}]*display:\s*block/s, '趣玩网格卡应使用纵向布局');
assert.match(homeWxml, /class="search-icon"/, '首页搜索入口应使用可控尺寸的图标容器');
assert.match(exploreWxml, /class="search-icon"/, '探索页搜索框应使用可控尺寸的图标容器');
assert.match(homeWxml, /action-text="全部推荐"\s+bind:actiontap="onAllRecommendations"/, '首页趣玩“全部推荐”应可跳转到探索页');
assert.match(homeJs, /onAllRecommendations\(\)/, '首页应提供全部推荐跳转处理函数');
assert.ok(!homeWxml.startsWith('<scroll-view'), '首页应使用页面原生滚动，避免根 scroll-view 兼容问题');
assert.ok(!exploreWxml.startsWith('<scroll-view'), '探索页应使用页面原生滚动，避免根 scroll-view 兼容问题');
assert.ok(!guidesWxml.startsWith('<scroll-view'), '攻略列表应使用页面原生滚动，确保点击事件可触发');
assert.ok(!profileWxml.startsWith('<scroll-view'), '我的页面应使用页面原生滚动，确保空状态正常渲染');

[
  'pages/explore/index.wxss',
  'pages/guides/index.wxss',
  'pages/itineraries/index.wxss',
  'pages/place-detail/index.wxss',
  'pages/guide-detail/index.wxss',
  'pages/itinerary-detail/index.wxss',
  'pages/home/index.wxss',
  'pages/profile/index.wxss',
  'components/empty-state/index.wxss',
].forEach((file) => {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  assert.ok(!/#(?:2E7D6B|718096|E8F2EC|FFFDF9)\b/.test(source), `${file} 不应保留旧视觉色值`);
});
assert.match(placeCardWxss, /\.fallback\s*\{[^}]*box-sizing:\s*border-box/s, '地点卡占位封面应在隔离组件内使用 border-box');

const placeDetailWxss = fs.readFileSync(path.join(root, 'pages/place-detail/index.wxss'), 'utf8');
const guideDetailWxss = fs.readFileSync(path.join(root, 'pages/guide-detail/index.wxss'), 'utf8');
assert.match(placeDetailWxss, /\.copy\s*\{[^}]*line-height:\s*1\.9/s, '景点正文应使用舒适行高');
assert.match(guideDetailWxss, /\.copy\s*\{[^}]*line-height:\s*1\.9/s, '攻略正文应使用舒适行高');
assert.match(placeDetailWxss, /\.info\s*\{[^}]*flex-wrap:\s*wrap/s, '景点信息应能在窄屏换行');

['categories.json', 'places.json', 'guides.json', 'itineraries.json'].forEach((file) => {
  assert.doesNotThrow(() => JSON.parse(fs.readFileSync(path.join(root, 'data', file), 'utf8')));
});

console.log('project.test.js passed');
