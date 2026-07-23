const { getItineraries } = require('../../utils/data');

Page({
  data: { itineraries: [] },
  onShow() { this.setData({ itineraries: getItineraries() }); },
  onItinerary(e) { wx.navigateTo({ url: '/pages/itinerary-detail/index?days=' + e.currentTarget.dataset.days }); },
});
