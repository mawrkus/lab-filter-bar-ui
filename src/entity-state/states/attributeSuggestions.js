export const loadAttributeSuggestions = {
  actions: {
    onEntry: async (event, ctx, toolkit) => {
      ctx.startLoading();

      const suggestions = await toolkit.suggestionService.loadAttributes();

      ctx.doneLoading(suggestions);

      toolkit.sendEvent("onAttributeSuggestionsLoaded");
    },
  },
  events: {
    discardSuggestions: "idle",
    onAttributeSuggestionsLoaded: "displayAttributeSuggestions",
  },
};

export const displayAttributeSuggestions = {
  events: {
    discardSuggestions: "idle",
    selectItem: {
      targetId: "loadOperatorSuggestions",
      action: (event, ctx) => {
        ctx.setFilterAttribute(event.data);
      },
    },
    createItem: {
      targetId: "idle",
      action: (event, ctx) => {
        ctx.createFreeTextFilter(event.data);
      },
    },
  },
};
