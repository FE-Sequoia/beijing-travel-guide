const { getFoodById } = require('../../utils/data');

Page({
  data: { food: null, coverFailed: false, stars: [1, 2, 3, 4, 5] },
  onLoad(options) {
    const food = getFoodById(options.id);
    if (food) food.sections = food.sections.map((section) => ({ ...section, paragraphs: section.body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean) }));
    this.setData({ food, coverFailed: false });
  },
  onCoverError() { this.setData({ coverFailed: true }); },
  back() { wx.navigateBack(); },
});
