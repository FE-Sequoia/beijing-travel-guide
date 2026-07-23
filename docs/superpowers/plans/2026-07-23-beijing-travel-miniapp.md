# 北京旅游攻略微信小程序 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有北京旅游攻略内容逐步转化为一个无后端、原生 JavaScript、JSON 驱动的微信小程序，先交付完整框架与首批页面。

**Architecture:** 在仓库根目录新增独立的 `beijing-travel-miniapp/` 小程序目录，不改动现有 VitePress 站点。小程序使用四个 TabBar 页面和若干非 Tab 页面；页面通过 `utils/data.js` 读取 `data/` 下的静态 JSON，收藏与阅读记录通过 `wx.storage` 保存。

**Tech Stack:** 原生微信小程序 JavaScript、WXML、WXSS、JSON；微信开发者工具；无第三方依赖、无构建步骤、无后端。

## Global Constraints

- 所有 UI 文案使用中文。
- 不引入 TypeScript、UniApp、第三方 UI 组件库或服务端接口。
- 首版包含首页“趣玩”模块，推荐天安门广场、中国国家博物馆、故宫博物院、曹雪芹故居。
- 视觉采用暖米白、青绿色、朱砂红的“北京晨光”风格。
- 内容必须由本地 JSON 驱动，页面不得把景点正文硬编码在 WXML 中。
- 收藏和阅读历史仅使用本地存储，不保证跨设备保留。

## File Map

- Create: `beijing-travel-miniapp/app.js` — 全局生命周期和本地存储初始化。
- Create: `beijing-travel-miniapp/app.json` — 页面路由、TabBar、窗口配置。
- Create: `beijing-travel-miniapp/app.wxss` — 全局色彩、字号、间距和基础类。
- Create: `beijing-travel-miniapp/project.config.json` — 微信开发者工具导入配置。
- Create: `beijing-travel-miniapp/README.md` — 导入和运行说明。
- Create: `beijing-travel-miniapp/data/categories.json` — 五大分类。
- Create: `beijing-travel-miniapp/data/places.json` — 首批景点和趣玩排序。
- Create: `beijing-travel-miniapp/data/guides.json` — 首批实用攻略条目。
- Create: `beijing-travel-miniapp/utils/data.js` — 静态数据读取、分类和搜索接口。
- Create: `beijing-travel-miniapp/utils/storage.js` — 收藏和阅读历史接口。
- Create: `beijing-travel-miniapp/components/section-title/` — 首页分区标题组件。
- Create: `beijing-travel-miniapp/components/place-card/` — 景点卡片组件。
- Create: `beijing-travel-miniapp/components/empty-state/` — 空状态组件。
- Create: `beijing-travel-miniapp/pages/home/` — 首页和趣玩模块。
- Create: `beijing-travel-miniapp/pages/explore/` — 分类、搜索和景点列表。
- Create: `beijing-travel-miniapp/pages/guides/` — 攻略列表。
- Create: `beijing-travel-miniapp/pages/profile/` — 收藏和阅读历史。
- Create: `beijing-travel-miniapp/pages/place-detail/` — 景点详情。
- Create: `beijing-travel-miniapp/pages/guide-detail/` — 攻略详情。

### Task 1: Create the native Mini Program shell

**Files:**
- Create: all root files listed above except data, utils, components, and pages.

- [ ] **Step 1: Create the route and TabBar configuration**

Declare exactly these routes: `pages/home/index`, `pages/explore/index`, `pages/guides/index`, `pages/profile/index`, `pages/place-detail/index`, and `pages/guide-detail/index`. Configure the first four as TabBar entries with Chinese labels：首页、探索、攻略、我的，并将 `navigationBarBackgroundColor` 设置为 `#F8F5EF`。

- [ ] **Step 2: Add global design tokens**

Define reusable WXSS classes (WeChat WXSS-compatible, without relying on CSS custom properties) for `#F8F5EF` warm ivory, `#2E7D6B` jade green, `#B9513A` cinnabar, `#263238` ink, `#718096` muted text, 24rpx page padding, 20rpx card radius, and a safe-area bottom spacer.

- [ ] **Step 3: Add import documentation**

README must state: open WeChat DevTools, choose “导入项目”, select `beijing-travel-miniapp/`, use the user’s AppID or test AppID, and compile. State that no npm install or backend is required.

- [ ] **Step 4: Verify the shell**

Import the directory in WeChat DevTools and confirm all six routes compile and the four TabBar entries are visible. Expected: no JSON configuration errors.

- [ ] **Step 5: Commit**

```bash
git add beijing-travel-miniapp
git commit -m "feat: scaffold native mini program"
```

### Task 2: Add static data contracts and access helpers

**Files:**
- Create: `beijing-travel-miniapp/data/categories.json`
- Create: `beijing-travel-miniapp/data/places.json`
- Create: `beijing-travel-miniapp/data/guides.json`
- Create: `beijing-travel-miniapp/utils/data.js`
- Create: `beijing-travel-miniapp/utils/storage.js`

**Interfaces:**
- `getCategories(): Category[]`
- `getPlaces(options?: { categoryId?: string, keyword?: string, featured?: boolean }): Place[]`
- `getPlaceById(id: string): Place | null`
- `getGuides(): Guide[]`
- `getGuideById(id: string): Guide | null`
- `getFavorites(): string[]`, `toggleFavorite(id: string): boolean`, `isFavorite(id: string): boolean`
- `getHistory(): string[]`, `recordHistory(id: string): void`, `clearHistory(): void`

- [ ] **Step 1: Define JSON records**

Create four place records with stable IDs `tiananmen`, `national-museum`, `forbidden-city`, and `cao-xueqin-former-residence`. Each record includes `categoryId`, `summary`, `tags`, `cover`, `featured`, `funRank`, `info`, and `sections`. Add at least one representative place for each of the five categories and seven guide records matching the existing guide directory.

- [ ] **Step 2: Implement pure data queries**

`getPlaces` must filter by exact `categoryId`, case-insensitive substring match on name/summary/tags for `keyword`, and `featured === true` when requested. Missing IDs return `null`; unknown categories return an empty array.

- [ ] **Step 3: Implement storage helpers**

Store arrays under `beijing-travel-miniapp:favorites` and `beijing-travel-miniapp:history`. `toggleFavorite` returns the new favorite state. `recordHistory` de-duplicates, prepends the ID, and keeps at most 20 entries. Catch storage errors and return safe empty defaults.

- [ ] **Step 4: Verify data behavior**

Use the DevTools console to call each helper with a known ID, unknown ID, category filter, keyword, and repeated history ID. Expected: deterministic arrays, `null` for missing records, and no uncaught storage exception.

- [ ] **Step 5: Commit**

```bash
git add beijing-travel-miniapp/data beijing-travel-miniapp/utils
git commit -m "feat: add local content data layer"
```

### Task 3: Build shared visual components

**Files:**
- Create: `components/section-title/*`
- Create: `components/place-card/*`
- Create: `components/empty-state/*`

- [ ] **Step 1: Implement the section title**

Accept `title`, optional `subtitle`, and optional `actionText`; emit `actiontap` only when action text is provided.

- [ ] **Step 2: Implement the place card**

Accept a `place` object and a `variant` of `featured` or `compact`; render cover fallback, category label, title, summary, and tags; emit `tap` with the place ID.

- [ ] **Step 3: Implement empty state**

Accept `title`, `description`, and optional `buttonText`; emit `actiontap` from the button.

- [ ] **Step 4: Verify visual states**

Preview each component with a normal record, missing cover, long title, and empty description. Expected: no overflow, readable contrast, and consistent margins on a 375px-wide simulator.

- [ ] **Step 5: Commit**

```bash
git add beijing-travel-miniapp/components
git commit -m "feat: add shared mini program components"
```

### Task 4: Implement the four TabBar pages

**Files:**
- Create/Modify: `pages/home/*`, `pages/explore/*`, `pages/guides/*`, `pages/profile/*`

- [ ] **Step 1: Implement home data loading**

Load categories, `getPlaces({ featured: true })`, and the latest history in `onShow`; render the “趣玩” horizontal card row with the four specified recommendations.

- [ ] **Step 2: Implement explore filters**

Load categories and all places; update the list on category tap or search input; navigate to `/pages/place-detail/index?id=<placeId>` on card tap.

- [ ] **Step 3: Implement guides list**

Render the seven guide topics and navigate to `/pages/guide-detail/index?id=<guideId>`.

- [ ] **Step 4: Implement profile state**

Load favorite IDs and history IDs on `onShow`, resolve records through `getPlaceById`, render separate sections, and provide a clear-history action with confirmation.

- [ ] **Step 5: Verify navigation and states**

Check every TabBar switch, home card navigation, category filtering, no-result state, favorites update, and history refresh. Expected: returning to a Tab refreshes local state without a reload.

- [ ] **Step 6: Commit**

```bash
git add beijing-travel-miniapp/pages/home beijing-travel-miniapp/pages/explore beijing-travel-miniapp/pages/guides beijing-travel-miniapp/pages/profile
git commit -m "feat: add mini program tab pages"
```

### Task 5: Implement detail pages and offline interaction polish

**Files:**
- Create/Modify: `pages/place-detail/*`, `pages/guide-detail/*`

- [ ] **Step 1: Implement place detail loading**

Read `id` from `onLoad`, resolve the place, record history, and render sections and practical info. Unknown IDs render `empty-state` with a back action.

- [ ] **Step 2: Implement favorite interaction**

Show the current favorite state, call `toggleFavorite`, update the button immediately, and display a lightweight toast.

- [ ] **Step 3: Implement guide detail loading**

Resolve the guide by ID and render its structured blocks; unknown IDs use the same empty state.

- [ ] **Step 4: Verify offline behavior**

Run the app with network access disabled in DevTools. Expected: all first-phase content, search, detail pages, favorites, and history remain usable.

- [ ] **Step 5: Commit**

```bash
git add beijing-travel-miniapp/pages/place-detail beijing-travel-miniapp/pages/guide-detail
git commit -m "feat: add offline detail pages"
```

### Task 6: Final migration pass and handoff documentation

**Files:**
- Modify: `beijing-travel-miniapp/data/places.json`
- Modify: `beijing-travel-miniapp/data/guides.json`
- Modify: `beijing-travel-miniapp/README.md`

- [ ] **Step 1: Reconcile first-phase content**

Check that every first-phase card has a resolvable ID, cover fallback, category, summary, and at least one body section; remove any placeholder copy that is presented as factual content.

- [ ] **Step 2: Document content workflow**

README must explain the JSON field conventions, how to add a place, how to mark a place for “趣玩”, and the local-storage limitation.

- [ ] **Step 3: Run final verification**

Import and compile in DevTools; manually test the four TabBar pages, four “趣玩” cards, one place per category, seven guides, search, unknown ID, missing cover, favorites, history, and clean-history confirmation. Expected: zero compile errors and no uncaught runtime errors.

- [ ] **Step 4: Commit**

```bash
git add beijing-travel-miniapp
git commit -m "docs: document mini program content workflow"
```
