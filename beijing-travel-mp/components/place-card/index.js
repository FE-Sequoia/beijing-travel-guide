Component({
  properties: {
    place: { type: Object, observer() { this.setData({ coverFailed: false }); } },
    variant: { type: String, value: 'compact' },
  },
  data: { coverFailed: false },
  methods: {
    onTap() { this.triggerEvent('tap', { id: this.data.place.id }); },
    onCoverError() { this.setData({ coverFailed: true }); },
  },
});
