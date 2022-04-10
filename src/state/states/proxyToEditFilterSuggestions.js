export const proxyToEditFilterSuggestions = {
  actions: {
    onEntry(event, ctx, toolkit) {
      const { filter, part } = event.data;

      // if has parent
      // if ! has parent

      if (part === "attribute") {
        ctx.startEditing({ filter, part });
        toolkit.sendEvent("gotoLoadAttributeSuggestions");
        return;
      }
    },
  },
  events: {
    gotoLoadAttributeSuggestions: "loadAttributeSuggestions",
    gotoLoadOperatorSuggestions: "loadOperatorSuggestions",
    gotoLoadValueSuggestions: "loadValueSuggestions",
    gotoIdle: "idle",
  },
};
