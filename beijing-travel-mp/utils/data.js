// 部分微信开发者工具版本不会将 require(JSON) 注册为运行时模块，
// 因此使用同内容的 CommonJS 静态数据模块，保证真机与开发工具均可加载。
const categories = require('../data/categories');
const places = require('../data/places');
const guides = require('../data/guides');
const itineraries = require('../data/itineraries');
const foods = require('../data/foods');
const categoryNames = categories.reduce((result, item) => { result[item.id] = item.name; return result; }, {});
const withCategoryName = (place) => ({ ...place, categoryName: categoryNames[place.categoryId] || place.categoryId });

function getCategories() { return categories; }
function getPlaces(options = {}) {
  const keyword = (options.keyword || '').trim().toLowerCase();
  return places.filter((place) => {
    if (options.categoryId && place.categoryId !== options.categoryId) return false;
    if (options.featured && !place.featured) return false;
    if (!keyword) return true;
    const haystack = [place.name, place.summary, ...(place.tags || [])].join(' ').toLowerCase();
    return haystack.includes(keyword);
  }).sort((a, b) => {
    if (options.sort === 'name') return a.name.localeCompare(b.name, 'zh-Hans-CN');
    return (a.funRank || 999) - (b.funRank || 999) || a.name.localeCompare(b.name, 'zh-Hans-CN');
  }).map(withCategoryName);
}
function getPlaceById(id) { const place = places.find((item) => item.id === id); return place ? withCategoryName(place) : null; }
function getRelatedPlaces(place) {
  if (!place) return [];
  return places.filter((item) => item.id === place.parentId || item.parentId === place.id).map(withCategoryName);
}
function getGuides() { return guides; }
function getGuideById(id) { return guides.find((guide) => guide.id === id) || null; }
function getItineraries() { return itineraries.slice().sort((a, b) => a.days - b.days); }
function getItineraryByDays(days) { return itineraries.find((item) => item.days === Number(days)) || null; }
function getFoods() { return foods.slice(); }
function getFoodById(id) { return foods.find((food) => food.id === id) || null; }

module.exports = { getCategories, getPlaces, getPlaceById, getRelatedPlaces, getGuides, getGuideById, getItineraries, getItineraryByDays, getFoods, getFoodById };
