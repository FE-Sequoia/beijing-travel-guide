# Miniapp Food Tab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a static, curated 12-restaurant Beijing food experience as a new native Mini Program tab with a two-column list and restaurant detail pages.

**Architecture:** `data/foods.js` owns the records and `utils/data.js` is the page-facing API. New WXML/WXSS list and detail pages follow existing page conventions, while `app.json` owns tab registration and existing storage owns favourites.

**Tech Stack:** Native WeChat Mini Program WXML/WXSS/JavaScript, CommonJS static data, Node `assert` tests.

## Global Constraints

- Use no dependency, backend, cloud API, map, order, or payment integration.
- Create exactly 12 unique `food-` records with HTTPS cover, integer 1–5 rating, name, summary, signature, address, tips, and two history sections.
- Write original summaries based on public source material; do not reproduce comments, rankings, or long-form third-party copy.
- Use existing design tokens and ordinary root `view` scrolling, never a root vertical `scroll-view`.
- Provide page-local image fallbacks and existing local favourite storage.

---

## File Structure

- Create `beijing-travel-mp/data/foods.js`: twelve static food records.
- Modify `beijing-travel-mp/utils/data.js`: `getFoods()` and `getFoodById(id)`.
- Create `beijing-travel-mp/pages/food/index.{js,json,wxml,wxss}`: third-tab grid.
- Create `beijing-travel-mp/pages/food-detail/index.{js,json,wxml,wxss}`: food detail.
- Modify `beijing-travel-mp/app.json`: registrations and third tab.
- Modify `beijing-travel-mp/tests/data.test.js`: data shape and accessors.
- Modify `beijing-travel-mp/tests/project.test.js`: tab order, pages, navigation, and layout safety.

### Task 1: Food Data and Accessors

**Files:** Create `data/foods.js`; modify `utils/data.js`, `tests/data.test.js`.

**Interfaces:** Produces `getFoods(): Food[]` and `getFoodById(id: string): Food | null`.

- [ ] **Step 1: Write the failing test**

```js
const { getFoods, getFoodById } = require('../utils/data');
const foods = getFoods();
assert.strictEqual(foods.length, 12);
assert.ok(foods.every((food) => /^food-/.test(food.id) && /^https:\/\//.test(food.cover)));
assert.ok(foods.every((food) => Number.isInteger(food.rating) && food.rating >= 1 && food.rating <= 5));
assert.ok(foods.every((food) => food.summary && food.signature && food.address && food.tips && food.sections.length === 2));
assert.strictEqual(getFoodById('missing-food'), null);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node beijing-travel-mp/tests/data.test.js`

Expected: failure because `getFoods` is not exported.

- [ ] **Step 3: Implement the data API**

```js
const foods = require('../data/foods');
function getFoods() { return foods.slice(); }
function getFoodById(id) { return foods.find((item) => item.id === id) || null; }
```

Export the two functions with the existing API. Each object includes sections titled `美食发展历史` and `品牌历史`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node beijing-travel-mp/tests/data.test.js`

Expected: `data.test.js passed`.

- [ ] **Step 5: Commit**

```bash
git add beijing-travel-mp/data/foods.js beijing-travel-mp/utils/data.js beijing-travel-mp/tests/data.test.js
git commit -m "feat: add curated food data"
```

### Task 2: Navigation and Pages

**Files:** Modify `app.json`, `tests/project.test.js`; create `pages/food/index.*` and `pages/food-detail/index.*`.

**Interfaces:** The third tab is `pages/food/index`; list cards call `onFood` and navigate with `/pages/food-detail/index?id=<id>`.

- [ ] **Step 1: Write failing project assertions**

```js
assert.deepStrictEqual(app.tabBar.list.map((item) => item.text), ['首页', '探索', '美食', '攻略', '我的']);
assert.ok(app.pages.includes('pages/food/index'));
assert.ok(app.pages.includes('pages/food-detail/index'));
```

Also assert list WXML contains `food-grid` and `bindtap="onFood"`, detail WXML contains `美食发展历史`, and neither WXML begins with a vertical `scroll-view`.

- [ ] **Step 2: Run test to verify it fails**

Run: `node beijing-travel-mp/tests/project.test.js`

Expected: failure because food paths are not registered and files do not exist.

- [ ] **Step 3: Implement navigation configuration and list page**

```js
const { getFoods } = require('../../utils/data');
Page({
  data: { foods: [], stars: [1, 2, 3, 4, 5] },
  onLoad() { this.setData({ foods: getFoods() }); },
  onFood(e) { wx.navigateTo({ url: '/pages/food-detail/index?id=' + e.currentTarget.dataset.id }); },
});
```

Register the list as the third of five tabs and the detail as a normal page. Use two equal `minmax(0, 1fr)` grid columns. Each card renders cover, name, and five stateful text stars.

- [ ] **Step 4: Implement detail page**

```js
const { getFoodById } = require('../../utils/data');
const storage = require('../../utils/storage');
Page({
  data: { food: null, favorite: false, coverFailed: false, stars: [1, 2, 3, 4, 5] },
  onLoad(options) { const food = getFoodById(options.id); this.setData({ food, favorite: food ? storage.isFavorite(food.id) : false }); if (food) storage.recordHistory(food.id); },
  onCoverError() { this.setData({ coverFailed: true }); },
  toggleFavorite() { const favorite = storage.toggleFavorite(this.data.food.id); this.setData({ favorite }); },
  back() { wx.navigateBack(); },
});
```

Render cover, name, rating, summary, signature, both history sections, address, tips, a favourite control, unknown-ID empty state, and fixed-size failed-image fallback.

- [ ] **Step 5: Run project test to verify it passes**

Run: `node beijing-travel-mp/tests/project.test.js`

Expected: `project.test.js passed`.

- [ ] **Step 6: Commit**

```bash
git add beijing-travel-mp/app.json beijing-travel-mp/pages/food beijing-travel-mp/pages/food-detail beijing-travel-mp/tests/project.test.js
git commit -m "feat: add miniapp food tab"
```

### Task 3: Full Verification

**Files:** Verify every file modified by Tasks 1–2.

**Interfaces:** Consumes completed food data and pages; produces a clean Mini Program ready for DevTools opening.

- [ ] **Step 1: Run all tests**

```bash
node beijing-travel-mp/tests/data.test.js
node beijing-travel-mp/tests/storage.test.js
node beijing-travel-mp/tests/project.test.js
```

Expected: each test prints its passed marker.

- [ ] **Step 2: Run static checks**

```bash
find beijing-travel-mp -name '*.js' -print0 | xargs -0 -n1 node --check
git diff --check HEAD~2..HEAD
```

Expected: exit code zero and no output.

- [ ] **Step 3: Inspect repository state**

Run: `git status --short --branch`

Expected: no uncommitted files; `main` is ahead of `origin/main` only by this feature's commits.
