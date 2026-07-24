const { getFoodById } = require('../../utils/data');
const storage = require('../../utils/storage');

Page({
  data: { food: null, favorite: false, coverFailed: false, stars: [1, 2, 3, 4, 5] },
  onLoad(options) {
    const food = getFoodById(options.id);
    this.setData({ food, favorite: food ? storage.isFavorite(food.id) : false, coverFailed: false });
    if (food) storage.recordHistory(food.id);
  },
  onCoverError() { this.setData({ coverFailed: true }); },
  toggleFavorite() {
    if (!this.data.food) return;
    const favorite = storage.toggleFavorite(this.data.food.id);
    this.setData({ favorite });
    wx.showToast({ title: favorite ? '已收藏' : '已取消收藏', icon: 'none' });
  },
  back() { wx.navigateBack(); },
});
