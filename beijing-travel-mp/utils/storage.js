const FAVORITES_KEY = 'beijing-travel-mp:favorites';
const HISTORY_KEY = 'beijing-travel-mp:history';

function read(key) {
  try {
    const value = wx.getStorageSync(key);
    return Array.isArray(value) ? value : [];
  } catch (e) {
    return [];
  }
}
function write(key, value) { try { wx.setStorageSync(key, value); } catch (e) {} }
function getFavorites() { return read(FAVORITES_KEY); }
function isFavorite(id) { return getFavorites().indexOf(id) !== -1; }
function toggleFavorite(id) {
  const ids = getFavorites();
  const index = ids.indexOf(id);
  if (index === -1) ids.unshift(id); else ids.splice(index, 1);
  write(FAVORITES_KEY, ids);
  return index === -1;
}
function clearFavorites() { write(FAVORITES_KEY, []); }
function getHistory() { return read(HISTORY_KEY); }
function recordHistory(id) {
  const ids = getHistory().filter((item) => item !== id);
  ids.unshift(id);
  write(HISTORY_KEY, ids.slice(0, 20));
}
function clearHistory() { write(HISTORY_KEY, []); }

module.exports = {
  getFavorites,
  isFavorite,
  toggleFavorite,
  clearFavorites,
  getHistory,
  recordHistory,
  clearHistory,
};
