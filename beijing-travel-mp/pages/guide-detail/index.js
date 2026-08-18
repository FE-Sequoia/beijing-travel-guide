const { getGuideById } = require('../../utils/data');
Page({ data: { guide: null }, onLoad(options) { const guide = getGuideById(options.id); if (guide) guide.sections = guide.sections.map((section) => ({ ...section, paragraphs: section.body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean) })); this.setData({ guide }); }, back() { wx.navigateBack(); } });
