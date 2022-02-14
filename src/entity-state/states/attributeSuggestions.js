export const loadAttributeSuggestions = {
  actions: {
    onEntry: async (event, ctx, toolkit) => {
      ctx.set({ ...ctx.get(), loading: true });

      const suggestions = await toolkit.suggestionService.loadAttributes();

      ctx.set({ ...ctx.get(), loading: false, suggestions });

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
