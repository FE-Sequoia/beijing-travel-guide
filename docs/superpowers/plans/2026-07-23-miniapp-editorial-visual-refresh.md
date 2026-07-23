# Miniapp Editorial Visual Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the WeChat Mini Program with a cohesive Beijing editorial visual system and readable content layouts without changing application behaviour or data contracts.

**Architecture:** Centralize the palette, surfaces, spacing, typography, and overflow safeguards in `app.wxss`, then make reusable components consume that visual language. Reshape page WXML only where content grouping must change; preserve page data properties, event bindings, and navigation paths. Extend the existing Node static test to guard the visual-contract selectors.

**Tech Stack:** Native WeChat Mini Program WXML/WXSS/JavaScript, Node.js `assert`, static local JSON/CommonJS data.

## Global Constraints

- Work directly on `main` in `beijing-travel-guide/`, per user instruction; do not create a worktree.
- Do not modify `beijing-travel-mp/data/*.json`, `beijing-travel-mp/data/*.js`, or `beijing-travel-mp/utils/data.js`.
- Preserve search, filtering, favourite/history storage, itinerary, related-place, and navigation event contracts.
- Use `#F7F3EC` for the page background, `#FFFCF7` for surfaces, `#1F5B4F` for the primary colour, and `#B9513A` only for emphasis.
- Retain `min-width: 0`, `box-sizing: border-box`, and horizontal-overflow protection throughout.

---

## File structure

- `beijing-travel-mp/app.wxss`: global visual tokens and shared layout/text/surface classes.
- `beijing-travel-mp/components/section-title/index.wxss`: editorial section heading rhythm.
- `beijing-travel-mp/components/place-card/index.wxml` and `index.wxss`: standard and compact place-card content hierarchy.
- `beijing-travel-mp/pages/{home,explore,guides,itineraries,profile}/index.{wxml,wxss}`: consistent list-page structure and surfaces.
- `beijing-travel-mp/pages/{place-detail,guide-detail,itinerary-detail}/index.{wxml,wxss}`: readable long-form and schedule layouts.
- `beijing-travel-mp/tests/project.test.js`: static assertions for the visual contract and key content structure.

### Task 1: Establish global tokens and verify the visual contract

**Files:**
- Modify: `beijing-travel-mp/app.wxss`
- Modify: `beijing-travel-mp/app.json`
- Modify: `beijing-travel-mp/tests/project.test.js`

**Interfaces:**
- Consumes: existing `.page`, `.card`, `.muted`, `.green`, `.red`, `.section-gap`, and `.safe-bottom` class names.
- Produces: reusable `.surface`, `.eyebrow`, `.page-heading`, `.page-lede`, `.body-copy`, `.meta-row`, `.pill`, and `.hairline-list` styles for all following tasks.

- [ ] **Step 1: Write the failing visual-contract test**

```js
assert.match(appWxss, /--paper:\s*#F7F3EC/, '全局应定义米白纸感背景令牌');
assert.match(appWxss, /--ink-green:\s*#1F5B4F/, '全局应定义墨绿主色令牌');
assert.match(appWxss, /\.body-copy\s*\{[^}]*line-height:\s*1\.9/s, '长正文应使用舒适行高');
assert.match(appWxss, /\.page\s*\{[^}]*padding:\s*32rpx/s, '页面应使用统一的水平留白');
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node beijing-travel-mp/tests/project.test.js`

Expected: failure stating that the paper background token is missing.

- [ ] **Step 3: Implement the global visual system**

Replace the global stylesheet with tokenized declarations and keep all legacy class names compatible:

```css
page { --paper:#F7F3EC; --surface:#FFFCF7; --ink:#263238; --muted:#6E746F; --ink-green:#1F5B4F; --soft-green:#E4EFE9; --vermilion:#B9513A; background:var(--paper); color:var(--ink); overflow-x:hidden; }
.page { width:100%; min-width:0; padding:32rpx 32rpx 0; }
.card,.surface { width:100%; min-width:0; background:var(--surface); border:1rpx solid rgba(38,50,56,.06); border-radius:24rpx; box-shadow:0 10rpx 28rpx rgba(53,72,65,.045); }
.body-copy { color:#48524E; font-size:27rpx; line-height:1.9; white-space:pre-line; }
```

Set `navigationBarBackgroundColor` and `backgroundColor` in `app.json` to `#F7F3EC`; update tab bar selected colour to `#1F5B4F`.

- [ ] **Step 4: Run the test to verify it passes**

Run: `node beijing-travel-mp/tests/project.test.js`

Expected: `project.test.js passed`.

- [ ] **Step 5: Commit**

```bash
git add beijing-travel-mp/app.wxss beijing-travel-mp/app.json beijing-travel-mp/tests/project.test.js
git commit -m "feat: establish miniapp editorial visual tokens"
```

### Task 2: Rework shared headings and place cards

**Files:**
- Modify: `beijing-travel-mp/components/section-title/index.wxss`
- Modify: `beijing-travel-mp/components/place-card/index.wxml`
- Modify: `beijing-travel-mp/components/place-card/index.wxss`
- Modify: `beijing-travel-mp/tests/project.test.js`

**Interfaces:**
- Consumes: component properties `place`, `variant`, and event `tap` unchanged.
- Produces: two-line-clamped `.summary` and a `compact` card whose width is controlled by its parent.

- [ ] **Step 1: Write the failing component-style test**

```js
const placeCardWxss = fs.readFileSync(path.join(root, 'components/place-card/index.wxss'), 'utf8');
assert.match(placeCardWxss, /-webkit-line-clamp:\s*2/, '地点卡摘要应最多显示两行');
assert.match(placeCardWxss, /\.compact\s*\{[^}]*width:\s*100%/s, '紧凑卡应填满其网格单元');
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node beijing-travel-mp/tests/project.test.js`

Expected: failure stating that the card summary does not clamp to two lines.

- [ ] **Step 3: Implement the shared component refresh**

Keep the card event and data bindings intact. Replace the summary styles with:

```css
.summary { display:-webkit-box; overflow:hidden; -webkit-box-orient:vertical; -webkit-line-clamp:2; color:var(--muted); font-size:23rpx; line-height:1.65; }
.compact { display:flex; width:100%; min-width:0; }
```

Use `overflow:hidden` on the card, reduce tags to a subdued pill treatment, give the standard card a consistent media ratio, and update `section-title` with a hairline-bottom border and restrained action typography.

- [ ] **Step 4: Run the test to verify it passes**

Run: `node beijing-travel-mp/tests/project.test.js`

Expected: `project.test.js passed`.

- [ ] **Step 5: Commit**

```bash
git add beijing-travel-mp/components beijing-travel-mp/tests/project.test.js
git commit -m "feat: refine miniapp content cards"
```

### Task 3: Normalize home and list-page hierarchy

**Files:**
- Modify: `beijing-travel-mp/pages/home/index.wxml`
- Modify: `beijing-travel-mp/pages/home/index.wxss`
- Modify: `beijing-travel-mp/pages/explore/index.wxss`
- Modify: `beijing-travel-mp/pages/guides/index.wxss`
- Modify: `beijing-travel-mp/pages/itineraries/index.wxss`
- Modify: `beijing-travel-mp/pages/profile/index.wxss`
- Modify: `beijing-travel-mp/tests/project.test.js`

**Interfaces:**
- Consumes: all existing page data fields and `bindtap`/`bind:actiontap` handlers.
- Produces: category and featured-place grids on home; a consistent list-page top rhythm without changing routing.

- [ ] **Step 1: Write the failing structure test**

```js
assert.match(homeWxml, /class="featured-grid"/, '首页趣玩应使用两列内容网格');
assert.ok(!homeWxml.includes('scroll-x class="places"'), '首页趣玩不应使用横向滚动');
assert.match(homeWxss, /\.featured-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/s, '趣玩应为两列网格');
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node beijing-travel-mp/tests/project.test.js`

Expected: failure stating that the featured grid is missing.

- [ ] **Step 3: Implement the list-page refresh**

Change only the home 趣玩 wrapper from the horizontal `scroll-view` to `<view class="featured-grid">` while preserving each `place-card` and `bind:tap="onPlace"`. Make its CSS use `repeat(2, minmax(0, 1fr))`; remove fixed-width featured card rules. Apply common heading/lede spacing, low-contrast search and filter surfaces, and vertical list gaps on all listed pages. Preserve the existing six-grid category layout and itinerary handlers.

- [ ] **Step 4: Run the test to verify it passes**

Run: `node beijing-travel-mp/tests/project.test.js`

Expected: `project.test.js passed`.

- [ ] **Step 5: Commit**

```bash
git add beijing-travel-mp/pages/home beijing-travel-mp/pages/explore beijing-travel-mp/pages/guides beijing-travel-mp/pages/itineraries beijing-travel-mp/pages/profile beijing-travel-mp/tests/project.test.js
git commit -m "feat: unify miniapp list page rhythm"
```

### Task 4: Reshape long-form detail reading layouts

**Files:**
- Modify: `beijing-travel-mp/pages/place-detail/index.wxml`
- Modify: `beijing-travel-mp/pages/place-detail/index.wxss`
- Modify: `beijing-travel-mp/pages/guide-detail/index.wxml`
- Modify: `beijing-travel-mp/pages/guide-detail/index.wxss`
- Modify: `beijing-travel-mp/pages/itinerary-detail/index.wxml`
- Modify: `beijing-travel-mp/pages/itinerary-detail/index.wxss`
- Modify: `beijing-travel-mp/tests/project.test.js`

**Interfaces:**
- Consumes: `place`, `guide`, `itinerary`, `schedule`, `relatedPlaces`, and every existing event binding.
- Produces: shared `.body-copy` content styles and information groups that remain within the viewport.

- [ ] **Step 1: Write the failing detail-layout test**

```js
const placeDetailWxss = fs.readFileSync(path.join(root, 'pages/place-detail/index.wxss'), 'utf8');
const guideDetailWxss = fs.readFileSync(path.join(root, 'pages/guide-detail/index.wxss'), 'utf8');
assert.match(placeDetailWxss, /\.copy\s*\{[^}]*line-height:\s*1\.9/s, '景点正文应使用舒适行高');
assert.match(guideDetailWxss, /\.copy\s*\{[^}]*line-height:\s*1\.9/s, '攻略正文应使用舒适行高');
assert.match(placeDetailWxss, /\.info\s*\{[^}]*flex-wrap:\s*wrap/s, '景点信息应能在窄屏换行');
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node beijing-travel-mp/tests/project.test.js`

Expected: failure stating that the place-detail info block cannot wrap.

- [ ] **Step 3: Implement the long-form refresh**

Preserve the existing WXML data expressions and events. Group detail metadata in semantic containers where needed, set `.copy { color:#48524E; font-size:27rpx; line-height:1.9; white-space:pre-line; }`, set `.info { flex-wrap:wrap; }`, and assign each `.info-item` a minimum basis that fits a narrow viewport. Replace repetitive heavy cards in related places and itinerary stops with warm surfaces plus hairline separators. Keep cover-failure fallbacks and favourite interaction unchanged.

- [ ] **Step 4: Run the test to verify it passes**

Run: `node beijing-travel-mp/tests/project.test.js`

Expected: `project.test.js passed`.

- [ ] **Step 5: Commit**

```bash
git add beijing-travel-mp/pages/place-detail beijing-travel-mp/pages/guide-detail beijing-travel-mp/pages/itinerary-detail beijing-travel-mp/tests/project.test.js
git commit -m "feat: improve miniapp reading layouts"
```

### Task 5: Verify behaviour and publish the completed refresh

**Files:**
- Modify: `beijing-travel-mp/tests/project.test.js` only if a static contract assertion is needed to cover a final regression.

**Interfaces:**
- Consumes: all existing data and storage test interfaces.
- Produces: a verified working tree ready for the existing `main` branch.

- [ ] **Step 1: Run the complete automated suite**

Run:

```bash
node beijing-travel-mp/tests/data.test.js
node beijing-travel-mp/tests/storage.test.js
node beijing-travel-mp/tests/project.test.js
find beijing-travel-mp -name '*.js' -print0 | xargs -0 -n1 node --check
git diff --check
```

Expected: all three tests print `passed`, JavaScript syntax checks return zero, and `git diff --check` prints no output.

- [ ] **Step 2: Perform WeChat DevTools visual review**

Open the project in WeChat DevTools and inspect home, explore, place detail, guide detail, itinerary detail, and profile at a narrow device width. Confirm: no horizontal scrolling; all cards retain side margins; the `趣玩` grid is two columns; long text remains readable; search, filters, favourite, history, and navigation work.

- [ ] **Step 3: Commit and push**

```bash
git add beijing-travel-mp
git commit -m "feat: refresh miniapp editorial design"
git push origin main
```

Expected: `main -> main` is accepted by the configured GitHub SSH remote.

## Plan self-review

- Spec coverage: Tasks 1–2 implement the token and shared-component requirements; Task 3 implements home and list-page hierarchy; Task 4 implements all long-form reading layouts; Task 5 covers automated and manual verification.
- Placeholder scan: no incomplete requirements or deferred implementation markers remain.
- Type consistency: all tasks retain existing WXML data fields and event names; no JavaScript interface is renamed.
