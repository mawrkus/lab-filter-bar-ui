export const loadOperatorSuggestions = {
  actions: {
    onEntry: async (event, ctx, toolkit) => {
      ctx.set({ ...ctx.get(), loading: true });

      const suggestions = await toolkit.suggestionService.loadOperators();

      ctx.set({ ...ctx.get(), loading: false, suggestions });

      toolkit.sendEvent("onOperatorSuggestionsLoaded");
    },
  },
  events: {
    onDiscardSuggestions: "idle",
    onOperatorSuggestionsLoaded: "displayOperatorSuggestions",
  },
};

export const displayOperatorSuggestions = {
  events: {
    onDiscardSuggestions: "idle",
    onSelectItem: {
      targetId: "idle",
      action: (event, ctx) => {
        const newCtx = ctx.get();

        newCtx.partialFilter.operator = event.data;

        ctx.set(newCtx);
      },
    },
  },
};
