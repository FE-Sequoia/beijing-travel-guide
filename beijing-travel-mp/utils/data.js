const categories = require('../data/categories.json');
const places = require('../data/places.json');
const guides = require('../data/guides.json');
const itineraries = require('../data/itineraries.json');
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
function getGuides() { return guides; }
function getGuideById(id) { return guides.find((guide) => guide.id === id) || null; }
function getItineraries() { return itineraries.slice().sort((a, b) => a.days - b.days); }
function getItineraryByDays(days) { return itineraries.find((item) => item.days === Number(days)) || null; }

module.exports = { getCategories, getPlaces, getPlaceById, getGuides, getGuideById, getItineraries, getItineraryByDays };
