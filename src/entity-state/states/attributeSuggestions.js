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
    onDiscardSuggestions: "idle",
    onAttributeSuggestionsLoaded: "displayAttributeSuggestions",
  },
};

export const displayAttributeSuggestions = {
  events: {
    onDiscardSuggestions: "idle",
    onSelectItem: {
      targetId: "idle",
      action: (event, ctx) => {
        const newCtx = ctx.get();

        newCtx.partialFilter.attribute = event.data;

        ctx.set(newCtx);
      },
    },
  },
};
