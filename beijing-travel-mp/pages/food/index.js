const { getFoods } = require('../../utils/data');

Page({
  data: { foods: [], stars: [1, 2, 3, 4, 5] },
  onLoad() {
    this.setData({ foods: getFoods().map((food) => ({ ...food, coverFailed: false })) });
  },
  onFood(e) {
    wx.navigateTo({ url: '/pages/food-detail/index?id=' + e.currentTarget.dataset.id });
  },
  onCoverError(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ [`foods[${index}].coverFailed`]: true });
  },
});
