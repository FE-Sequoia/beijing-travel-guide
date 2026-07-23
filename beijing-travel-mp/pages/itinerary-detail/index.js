const { getItineraryByDays, getPlaceById } = require('../../utils/data');

Page({
  data: { itinerary: null, schedule: [] },
  onLoad(options) {
    const itinerary = getItineraryByDays(options.days);
    const schedule = itinerary ? itinerary.schedule.map((day) => ({
      ...day,
      stops: day.stops.map((stop) => ({ ...stop, place: getPlaceById(stop.placeId) })).filter((stop) => stop.place),
    })) : [];
    this.setData({ itinerary, schedule });
  },
  onPlace(e) { wx.navigateTo({ url: '/pages/place-detail/index?id=' + e.currentTarget.dataset.id }); },
  back() { wx.navigateBack(); },
});
