const { getGuides } = require('../../utils/data');
Page({
  data: { guides: [] },
  onShow() { this.setData({ guides: getGuides() }); },
  onGuide(e) { wx.navigateTo({ url: '/pages/guide-detail/index?id=' + e.currentTarget.dataset.id }); },
  onItineraryEntry() { wx.navigateTo({ url: '/pages/itineraries/index' }); }
});
