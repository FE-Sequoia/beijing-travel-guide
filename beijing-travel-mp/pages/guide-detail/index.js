const { getGuideById } = require('../../utils/data');
Page({ data: { guide: null }, onLoad(options) { this.setData({ guide: getGuideById(options.id) }); }, back() { wx.navigateBack(); } });
