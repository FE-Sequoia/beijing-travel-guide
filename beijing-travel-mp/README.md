# 北京慢游记

原生 JavaScript 微信小程序，内容完全来自本地 JSON，不需要后端或网络。

## 导入

打开微信开发者工具，选择“导入项目”，选择当前目录 `beijing-travel-mp/`，AppID 可使用测试号或 `touristappid`，然后点击编译。项目不需要执行 `npm install`。

## 内容维护

景点数据在 `data/places.json`，攻略数据在 `data/guides.json`。将景点的 `featured` 设为 `true` 并设置 `funRank`，即可出现在首页“趣玩”模块。收藏和阅读历史保存在当前设备本地，卸载或清除缓存后会消失。
