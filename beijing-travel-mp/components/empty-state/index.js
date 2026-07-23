Component({ properties: { title: String, description: String, buttonText: String }, methods: { onAction() { this.triggerEvent('actiontap'); } } });
