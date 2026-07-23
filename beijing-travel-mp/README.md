# 北京慢游记

原生 JavaScript 微信小程序，内容完全来自本地 JSON，不需要后端或网络。内置景点浏览、本地搜索、收藏、阅读历史，以及 1/2/3/5/7 日行程灵感。

## 导入

打开微信开发者工具，选择“导入项目”，选择当前目录 `beijing-travel-mp/`，AppID 可使用测试号或 `touristappid`，然后点击编译。项目不需要执行 `npm install`。

## 内容维护

景点数据在 `data/places.json`，攻略数据在 `data/guides.json`，行程数据在 `data/itineraries.json`。将景点的 `featured` 设为 `true` 并设置 `funRank`，即可出现在首页“趣玩”模块。

每个景点至少应保留 `id`、`name`、`categoryId`、`summary`、`tags`、`cover`、`info` 和 `sections` 字段；行程的每个 `stops[].placeId` 必须引用一个现有景点 ID。封面路径不可用时，页面会自动显示分类色块，因此内容仍可离线阅读。

收藏和阅读历史保存在当前设备本地，卸载小程序、清理微信缓存或更换设备后会消失。景点开放、预约、票价和交通等会变化的事项，请在出发前以官方渠道信息为准。
