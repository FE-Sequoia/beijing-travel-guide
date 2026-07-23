# 小程序全量内容同步设计

## 目标

将 `docs/` 中现有的北京旅行 Markdown 内容完整转换为 `beijing-travel-mp` 可离线使用的静态数据。小程序列表可检索所有景点，父级景点和目录内子景点均可独立打开详情；Web 端攻略文章也提供完整小程序详情。

## 内容范围

- 景点来源：`docs/landmarks`、`docs/museums`、`docs/parks`、`docs/religion`、`docs/history` 下除各目录入口页外的每篇 Markdown。
- 攻略来源：`docs/guide` 下除入口页外的每篇 Markdown。
- 嵌套目录内的 `index.md` 作为父级景点，其他 Markdown 作为子景点；二者均生成独立稳定 ID。
- 顶级分类页不生成无内容的列表项。

## 数据与同步架构

以 Markdown 为唯一内容源。同步脚本递归解析文件、提取标题、首图、首段摘要、信息表格和二三级标题正文，输出 `data/places.json` 与 `data/guides.json`；随后从 JSON 生成同内容的 CommonJS 数据模块。小程序仅通过 `utils/data.js` 读取 JS 模块，以规避部分微信开发者工具不能运行时 `require(JSON)` 的兼容性问题。

景点条目至少包含：`id`、`name`、`categoryId`、`summary`、`tags`、`cover`、`featured`、`funRank`、`info`、`sections`。保留可选 `parentId`、`sourcePath` 与 `relatedPlaceIds`，用于展示父子关联及定位来源。攻略条目包含 `id`、`title`、`summary`、`icon` 与完整 `sections`。

## 显示与降级

现有列表与详情页沿用现有组件和布局，不新增网络依赖。正文段落使用换行保留 Markdown 的阅读层级；表格转换为标签和值的基础信息。图片缺失、外链不可用或无法识别时使用项目现有 SVG 默认封面，避免空白卡片。

## 可重复性与质量门槛

- 同步脚本可重复运行，不会累积重复条目。
- 生成数量必须与 Web 可迁移 Markdown 数量一致，且每个条目有非空标题、摘要和至少一个内容区块。
- JSON 与对应 `.js` CommonJS 模块数据逐字等价。
- 现有行程引用的景点 ID 必须全部继续存在。
- 测试覆盖递归子景点、父级目录页、攻略页、数据模块一致性和行程引用完整性。

## 范围边界

本次只迁移仓库中已有的 Web 内容；不联网补写、校验或更新官方票务、开放时间等时效信息。
