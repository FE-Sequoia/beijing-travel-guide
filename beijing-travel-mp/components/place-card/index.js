Component({ properties: { place: Object, variant: { type: String, value: 'compact' } }, methods: { onTap() { this.triggerEvent('tap', { id: this.data.place.id }); } } });
