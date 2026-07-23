# Mini Program Full Content Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert every eligible Web Markdown place and guide into complete, offline-readable Mini Program data.

**Architecture:** A single Node sync script recursively discovers source documents and deterministically produces `places.json`, `guides.json`, and their CommonJS mirrors. The existing data access layer and pages retain their public interfaces; place records gain source and parent metadata for optional navigation.

**Tech Stack:** Node.js built-ins, CommonJS, JSON, native WeChat Mini Program (WXML/WXSS/JavaScript).

## Global Constraints

- Markdown under `docs/` is the single content source.
- All nested attraction documents and nested `index.md` parent documents are standalone records.
- Mini Program runtime must import `.js` static data modules, never JSON directly.
- No network dependency, framework, or package may be introduced.
- Existing itinerary `placeId` references must remain valid.

---

### Task 1: Define the content-sync contract with failing tests

**Files:**
- Modify: `beijing-travel-mp/tests/data.test.js`
- Modify: `beijing-travel-mp/tests/project.test.js`

**Interfaces:**
- Consumes: `getPlaces()`, `getGuides()`, `docs/{landmarks,museums,parks,religion,history,guide}`.
- Produces: executable assertions for source coverage, record completeness, parent records, and JS/JSON parity.

- [ ] **Step 1: Write failing source-coverage assertions**

```js
assert.strictEqual(getPlaces().length, countEligibleMarkdown(placeDirectories));
assert.strictEqual(getGuides().length, countEligibleMarkdown([guideDirectory]));
assert.ok(getPlaces().some((place) => place.id === 'forbidden-city-wumen'));
assert.ok(getPlaces().find((place) => place.id === 'forbidden-city').sections.length > 6);
```

- [ ] **Step 2: Run the test to verify failure**

Run: `node beijing-travel-mp/tests/data.test.js`

Expected: failure because nested entries and guide coverage are absent.

- [ ] **Step 3: Add module parity assertions**

```js
for (const name of ['places', 'guides']) {
  const json = JSON.parse(fs.readFileSync(path.join(dataDir, `${name}.json`), 'utf8'));
  assert.deepStrictEqual(require(path.join(dataDir, name)), json);
}
```

- [ ] **Step 4: Commit the red test contract**

```bash
git add beijing-travel-mp/tests/data.test.js beijing-travel-mp/tests/project.test.js
git commit -m "test: define full content sync contract"
```

### Task 2: Build deterministic recursive Markdown conversion

**Files:**
- Modify: `beijing-travel-mp/scripts/sync-from-docs.js`
- Modify: `beijing-travel-mp/scripts/migrate-markdown.js`

**Interfaces:**
- Consumes: `node beijing-travel-mp/scripts/sync-from-docs.js`.
- Produces: `places.json`, `guides.json`, `places.js`, `guides.js` with `module.exports = <json>`.

- [ ] **Step 1: Implement recursive eligible-file discovery**

```js
function getEligibleFiles(categoryId) {
  return listMarkdownFiles(path.join(DOCS_ROOT, categoryId)).filter((file) => {
    const relative = path.relative(path.join(DOCS_ROOT, categoryId), file);
    return relative !== 'index.md';
  });
}
```

- [ ] **Step 2: Implement stable IDs and parent IDs**

```js
function getRecordId(categoryId, file) {
  const relative = path.relative(path.join(DOCS_ROOT, categoryId), file).replace(/\\.md$/, '');
  return relative.endsWith('/index') ? relative.slice(0, -6) : relative;
}
function getParentId(categoryId, file) {
  const relative = path.relative(path.join(DOCS_ROOT, categoryId), file).replace(/\\.md$/, '');
  const parent = path.dirname(relative);
  return parent === '.' ? '' : parent;
}
```

- [ ] **Step 3: Convert headings, tables, links and paragraphs into full sections**

```js
const record = {
  id: getRecordId(categoryId, file),
  sourcePath: path.relative(DOCS_ROOT, file),
  parentId: getParentId(categoryId, file),
  sections: extractSections(markdown),
  info: extractInfo(markdown),
};
assert.ok(record.sections.length > 0);
```

- [ ] **Step 4: Generate full guide records and CommonJS mirrors**

```js
function writeDataModule(name, records) {
  fs.writeFileSync(path.join(DATA_ROOT, `${name}.json`), `${JSON.stringify(records, null, 2)}\n`);
  fs.writeFileSync(path.join(DATA_ROOT, `${name}.js`), `module.exports = ${JSON.stringify(records, null, 2)};\n`);
}
```

- [ ] **Step 5: Run conversion and make the tests pass**

Run: `node beijing-travel-mp/scripts/sync-from-docs.js && node beijing-travel-mp/tests/data.test.js`

Expected: records cover every eligible source and the test prints `data.test.js passed`.

- [ ] **Step 6: Commit the converter and generated data**

```bash
git add beijing-travel-mp/scripts beijing-travel-mp/data beijing-travel-mp/tests
git commit -m "feat: sync complete web content to mini program"
```

### Task 3: Surface parent and related content in the place detail page

**Files:**
- Modify: `beijing-travel-mp/utils/data.js`
- Modify: `beijing-travel-mp/pages/place-detail/index.js`
- Modify: `beijing-travel-mp/pages/place-detail/index.wxml`
- Modify: `beijing-travel-mp/pages/place-detail/index.wxss`
- Modify: `beijing-travel-mp/tests/project.test.js`

**Interfaces:**
- Consumes: `getPlaceById(id)`, `getRelatedPlaces(place)`.
- Produces: optional parent link and child/related links that navigate to `/pages/place-detail/index?id=<id>`.

- [ ] **Step 1: Write the failing detail-data test**

```js
const wumen = getPlaceById('forbidden-city-wumen');
assert.strictEqual(wumen.parentId, 'forbidden-city');
assert.ok(getRelatedPlaces(wumen).some((place) => place.id === 'forbidden-city'));
```

- [ ] **Step 2: Implement `getRelatedPlaces`**

```js
function getRelatedPlaces(place) {
  return places.filter((item) => item.id === place.parentId || item.parentId === place.id)
    .map(withCategoryName);
}
```

- [ ] **Step 3: Bind related records in the detail page**

```js
const relatedPlaces = place ? getRelatedPlaces(place) : [];
this.setData({ place, relatedPlaces, favorite: place ? storage.isFavorite(place.id) : false });
```

- [ ] **Step 4: Add the WXML navigation list and WXSS full-width card style**

```xml
<view wx:if="{{relatedPlaces.length}}" class="related card">
  <view class="section-title">关联地点</view>
  <view wx:for="{{relatedPlaces}}" wx:key="id" data-id="{{item.id}}" bindtap="onRelated">{{item.name}} ›</view>
</view>
```

- [ ] **Step 5: Run source tests and syntax checks**

Run: `node beijing-travel-mp/tests/project.test.js && find beijing-travel-mp -name '*.js' -print0 | xargs -0 -n1 node --check`

Expected: project test passes and every JavaScript file parses.

- [ ] **Step 6: Commit detail navigation**

```bash
git add beijing-travel-mp/utils/data.js beijing-travel-mp/pages/place-detail beijing-travel-mp/tests/project.test.js
git commit -m "feat: link related mini program places"
```

### Task 4: Verify repeatability and release the sync

**Files:**
- Modify: `beijing-travel-mp/README.md`
- Test: `beijing-travel-mp/tests/data.test.js`
- Test: `beijing-travel-mp/tests/project.test.js`

**Interfaces:**
- Consumes: the sync command.
- Produces: documented one-command refresh workflow and verified clean diff after a second sync.

- [ ] **Step 1: Document the command**

```md
node scripts/sync-from-docs.js
```

- [ ] **Step 2: Verify idempotence**

Run: `node beijing-travel-mp/scripts/sync-from-docs.js && git diff --exit-code -- beijing-travel-mp/data`

Expected: exit code `0` after the second invocation.

- [ ] **Step 3: Run the full verification suite**

Run: `node beijing-travel-mp/tests/data.test.js && node beijing-travel-mp/tests/storage.test.js && node beijing-travel-mp/tests/project.test.js && git diff --check`

Expected: all tests print `passed` and `git diff --check` is silent.

- [ ] **Step 4: Commit documentation and verified completion**

```bash
git add beijing-travel-mp/README.md docs/superpowers
git commit -m "docs: document mini program content sync"
```
