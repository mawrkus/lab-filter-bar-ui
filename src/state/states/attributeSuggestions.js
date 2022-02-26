export const loadAttributeSuggestions = {
  actions: {
    async onEntry(event, ctx, toolkit) {
      ctx.startLoading();

      const attributes = await toolkit.suggestionService.loadAttributes();

      ctx.doneLoading(attributes);

      toolkit.sendEvent("attributeSuggestionsLoaded");
    },
  },
  events: {
    discardSuggestions: "idle",
    attributeSuggestionsLoaded: "chooseAttribute",
  },
};

export const chooseAttribute = {
  events: {
    discardSuggestions: "idle",
    selectItem: {
      targetId: "displayPartialFilterSuggestions",
      action(event, ctx) {
        ctx.setFilterAttribute(event.data);
      },
    },
    createItem: {
      targetId: "idle",
      action(event, ctx) {
        ctx.createSearchTextFilter(event.data);
      },
    },
    // On backspace
    removeLastFilter: {
      targetId: "idle",
      action(event, ctx) {
        ctx.removeFilter(ctx.getLastFilter());
      },
    },
  },
};
