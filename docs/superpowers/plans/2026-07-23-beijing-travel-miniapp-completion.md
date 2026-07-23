# 北京慢游记收口 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有离线小程序收口为可独立使用的北京旅行工具，补全行程规划、内容浏览、个人管理和可重复验证。

**Architecture:** 保持原生微信小程序和本地 JSON 数据模式。新增路线 JSON 与纯查询接口；页面只经 `utils/data.js` 读取内容，个人状态继续保存在微信本地存储；用 Node 内置断言检查数据合同与核心工具函数。

**Tech Stack:** 原生微信小程序 JavaScript、WXML、WXSS、JSON、Node.js 内置 `assert`；无第三方依赖、无后端。

## Global Constraints

- 目录固定为 `beijing-travel-mp/`，直接在 `main` 分支开发。
- 所有内容离线可用，正文和行程由本地 JSON 管理。
- 不新增网络请求、云能力、账号、支付或第三方依赖。
- 保持暖米白、青绿色、朱砂红的“北京晨光”视觉语言。

### Task 1: 建立收口测试与数据合同

**Files:**
- Create: `beijing-travel-mp/tests/data.test.js`
- Create: `beijing-travel-mp/tests/storage.test.js`
- Modify: `beijing-travel-mp/utils/data.js`
- Modify: `beijing-travel-mp/utils/storage.js`

- [ ] 先为景点查询、行程查询、收藏与历史的去重/上限行为编写 Node 断言测试并确认缺失功能失败。
- [ ] 实现最小数据接口和安全的本地存储边界，使测试通过。
- [ ] 运行 `node beijing-travel-mp/tests/data.test.js && node beijing-travel-mp/tests/storage.test.js`。

### Task 2: 补充可复用的离线路线与攻略内容

**Files:**
- Create: `beijing-travel-mp/data/itineraries.json`
- Modify: `beijing-travel-mp/data/guides.json`
- Modify: `beijing-travel-mp/utils/data.js`
- Modify: `beijing-travel-mp/README.md`

- [ ] 增加 1、2、3、5、7 日可选路线，每日包含景点 ID、时段和离线提示。
- [ ] 将七个攻略主题补成多区块结构，保留“规则可能变化，以官方为准”的说明。
- [ ] 添加与路线数据一致性的测试并运行。

### Task 3: 实现路线页、探索筛选和个人管理

**Files:**
- Create: `beijing-travel-mp/pages/itineraries/*`
- Create: `beijing-travel-mp/pages/itinerary-detail/*`
- Modify: `beijing-travel-mp/app.json`
- Modify: `beijing-travel-mp/pages/home/*`
- Modify: `beijing-travel-mp/pages/explore/*`
- Modify: `beijing-travel-mp/pages/profile/*`

- [ ] 首页新增“按天数安排行程”入口并传递分类选择到探索页。
- [ ] 路线列表和详情从 JSON 渲染，点击日程景点进入详情页。
- [ ] 探索页增加排序和结果计数；“我的”允许确认后清空收藏。
- [ ] 运行全部 Node 测试与 JavaScript 语法检查。

### Task 4: 收口详情页面的图片回退和体验

**Files:**
- Modify: `beijing-travel-mp/components/place-card/*`
- Modify: `beijing-travel-mp/pages/place-detail/*`
- Modify: `beijing-travel-mp/app.wxss`

- [ ] 为卡片和详情封面增加加载失败后的分类色块回退，不让坏图留白。
- [ ] 使用类别中文名、可读信息层级和空状态回退。
- [ ] 验证 WXML/WXSS 引用的页面和组件均存在。

### Task 5: 最终离线检查与交付说明

**Files:**
- Modify: `beijing-travel-mp/README.md`

- [ ] 运行 JSON、JavaScript、数据合同和路由引用的完整检查。
- [ ] 更新 README，说明导入方式、内容编辑、路线编辑、图像回退和本地存储限制。
- [ ] 提交可验证的收口实现。
