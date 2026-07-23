# Mini Program Layout Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the home interest selector into a six-cell grid and establish layout rules that keep cards full-width within consistent side gutters.

**Architecture:** Keep the native Mini Program structure and static data unchanged. Centralize box sizing and horizontal clipping at the application level, then remove page-level negative offsets and protect flex children from forcing their parents wider.

**Tech Stack:** Native WeChat Mini Program (JavaScript, WXML, WXSS); Node.js `assert` tests.

## Global Constraints

- Keep all content offline and static; no dependencies or backend.
- Preserve the existing jade, ivory, and cinnabar visual language.
- Keep horizontal scrolling only for intentionally swipeable recommendation and itinerary rows.

---

### Task 1: Add layout regression checks

**Files:**
- Modify: `beijing-travel-mp/tests/project.test.js`

- [ ] **Step 1: Write the failing test**

```js
const homeWxml = fs.readFileSync(path.join(root, 'pages/home/index.wxml'), 'utf8');
const homeWxss = fs.readFileSync(path.join(root, 'pages/home/index.wxss'), 'utf8');
const appWxss = fs.readFileSync(path.join(root, 'app.wxss'), 'utf8');
assert.ok(homeWxml.includes('class="category-grid"'));
assert.ok(!homeWxml.includes('scroll-x class="categories"'));
assert.match(homeWxss, /\.category-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/s);
assert.match(appWxss, /box-sizing:\s*border-box/);
assert.match(appWxss, /overflow-x:\s*hidden/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node beijing-travel-mp/tests/project.test.js`

Expected: FAIL because the home page still uses `scroll-x class="categories"`.

### Task 2: Apply the responsive layout baseline

**Files:**
- Modify: `beijing-travel-mp/app.wxss`
- Modify: `beijing-travel-mp/pages/home/index.wxml`
- Modify: `beijing-travel-mp/pages/home/index.wxss`
- Modify: `beijing-travel-mp/pages/explore/index.wxss`
- Modify: `beijing-travel-mp/components/place-card/index.wxss`
- Modify: `beijing-travel-mp/pages/guides/index.wxss`
- Modify: `beijing-travel-mp/pages/itineraries/index.wxss`
- Modify: `beijing-travel-mp/pages/place-detail/index.wxss`
- Modify: `beijing-travel-mp/pages/itinerary-detail/index.wxss`

- [ ] **Step 1: Replace the home category scroller**

Use a `view.category-grid` containing the existing category items. Define three equal columns with `minmax(0, 1fr)`, `gap: 16rpx`, and make each cell fill its grid track.

- [ ] **Step 2: Add containment rules**

Set global `box-sizing: border-box`; clip page-level horizontal overflow; give `.page` a full width. Use `min-width: 0` on text-bearing flex children and `box-sizing: border-box; width: 100%` on normal place cards.

- [ ] **Step 3: Remove page-level overflow sources**

Remove negative right margins from home swipe rows and negative side margins from Explore filters. Preserve intentional scroll behavior through the scroll-view itself and its internal item spacing.

- [ ] **Step 4: Run test to verify it passes**

Run: `node beijing-travel-mp/tests/project.test.js`

Expected: `project.test.js passed`.

### Task 3: Complete code audit and verification

**Files:**
- Modify: `beijing-travel-mp/tests/project.test.js`

- [ ] **Step 1: Audit source contracts**

Inspect all WXML/WXSS/JS files for missing page registrations, direct JSON requires, unbounded widths, negative horizontal layout offsets, and syntax errors. Add only regression assertions that cover the new layout contract.

- [ ] **Step 2: Run full checks**

Run:

```bash
node beijing-travel-mp/tests/data.test.js &&
node beijing-travel-mp/tests/storage.test.js &&
node beijing-travel-mp/tests/project.test.js &&
find beijing-travel-mp -name '*.js' -print0 | xargs -0 -n1 node --check &&
git diff --check
```

Expected: all commands exit with status 0.

- [ ] **Step 3: Commit**

```bash
git add beijing-travel-mp docs/superpowers/plans/2026-07-23-miniapp-layout-audit.md
git commit -m "fix: refine mini program card layout"
```
