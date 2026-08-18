// 部分微信开发者工具版本不会将 require(JSON) 注册为运行时模块，
// 因此使用同内容的 CommonJS 静态数据模块，保证真机与开发工具均可加载。
const categories = require('../data/categories');
const places = require('../data/places');
const guides = require('../data/guides');
const itineraries = require('../data/itineraries');
const foods = require('../data/foods');
const categoryNames = categories.reduce((result, item) => { result[item.id] = item.name; return result; }, {});
categoryNames.landmarks = '名胜古迹';
const byParent = {};
places.forEach((place) => { (byParent[place.parentId] = byParent[place.parentId] || []).push(place); });
const withCategoryName = (place) => {
  const primary = place.categories && place.categories.includes(place.categoryId)
    ? place.categoryId
    : (place.categories && place.categories.length ? place.categories[0] : (place.featured ? 'featured' : place.categoryId));
  return { ...place, categoryName: categoryNames[primary] || primary, children: (byParent[place.id] || []).map((child) => ({ id: child.id, name: child.name, summary: child.summary })) };
};

function getCategories() { return categories; }
function getPlaces(options = {}) {
  const keyword = (options.keyword || '').trim().toLowerCase();
  return places.filter((place) => {
    if (place.parentId) return false;
    if (options.featured && !place.featured) return false;
    if (options.categoryId === 'featured') { if (!place.featured) return false; }
    else if (options.categoryId && !(place.categories || [place.categoryId]).includes(options.categoryId)) return false;
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
  return places.filter((item) => item.id === place.parentId).map(withCategoryName);
}
function getGuides() { return guides; }
function getGuideById(id) { return guides.find((guide) => guide.id === id) || null; }
function getItineraries() { return itineraries.slice().sort((a, b) => a.days - b.days); }
function getItineraryByDays(days) { return itineraries.find((item) => item.days === Number(days)) || null; }
function getFoods() { return foods.slice(); }
function getFoodById(id) { return foods.find((food) => food.id === id) || null; }
function searchAll(keyword) {
  const kw = (keyword || '').trim().toLowerCase();
  if (!kw) return { places: [], guides: [], foods: [], itineraries: [] };
  const hit = (text) => (text || '').toLowerCase().includes(kw);
  return {
    places: getPlaces({ keyword: kw }),
    guides: guides.filter((guide) => hit(guide.title) || hit(guide.summary) || guide.sections.some((section) => hit(section.title))),
    foods: foods.filter((food) => hit(food.name) || hit(food.summary) || hit(food.signature) || food.sections.some((section) => hit(section.title))),
    itineraries: itineraries.filter((itinerary) => hit(itinerary.title) || hit(itinerary.summary) || itinerary.schedule.some((day) => day.stops.some((stop) => {
      const place = places.find((item) => item.id === stop.placeId);
      return hit(stop.note) || (place && hit(place.name));
    }))).map((itinerary) => ({ ...itinerary, placeNames: itinerary.schedule.reduce((result, day) => {
      day.stops.forEach((stop) => {
        const place = places.find((item) => item.id === stop.placeId);
        if (place) result.push(place.name);
      });
      return result;
    }, []) })),
  };
}

module.exports = { getCategories, getPlaces, getPlaceById, getRelatedPlaces, getGuides, getGuideById, getItineraries, getItineraryByDays, getFoods, getFoodById, searchAll };
