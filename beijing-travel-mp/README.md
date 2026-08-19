# 丫头京游攻略

原生 JavaScript 微信小程序，内容完全来自本地数据模块，不需要后端或网络。内置景点浏览、跨类型搜索、美食与实用攻略，以及 1/2/3/5/7 日行程灵感。

## 导入

打开微信开发者工具，选择“导入项目”，选择当前目录 `beijing-travel-mp/`，AppID 可使用测试号或 `touristappid`，然后点击编译。项目不需要执行 `npm install`。

## 内容维护

Web 端 Markdown 是景点和攻略的唯一内容源。更新 `docs/landmarks`、`docs/museums`、`docs/parks`、`docs/religion`、`docs/history` 或 `docs/guide` 后，在仓库根目录运行：

```bash
node beijing-travel-mp/scripts/sync-from-docs.js
```

该命令会递归转换父级景点和所有子景点，并更新 `data/places.js`、`data/guides.js` 运行时模块（自动生成，请勿手动编辑）。行程数据保存在 `data/itineraries.js`。首页“趣玩”由同步脚本中的精选 ID 和既有排序决定。

每个景点至少应保留 `id`、`name`、`categoryId`、`summary`、`tags`、`cover`、`info` 和 `sections` 字段；行程的每个 `stops[].placeId` 必须引用一个现有景点 ID。封面路径不可用时，页面会自动显示分类色块，因此内容仍可离线阅读。

景点开放、预约、票价和交通等会变化的事项，请在出发前以官方渠道信息为准。
