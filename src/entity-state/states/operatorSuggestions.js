export const loadOperatorSuggestions = {
  actions: {
    onEntry: async (event, ctx, toolkit) => {
      ctx.startLoading();

      const suggestions = await toolkit.suggestionService.loadOperators();

      ctx.doneLoading(suggestions);

      toolkit.sendEvent("onOperatorSuggestionsLoaded");
    },
  },
  events: {
    discardSuggestions: "idle",
    onOperatorSuggestionsLoaded: "displayOperatorSuggestions",
  },
};

export const displayOperatorSuggestions = {
  events: {
    discardSuggestions: "idle",
    selectItem: [
      {
        cond: (event, ctx) => !ctx.isEditing() || (ctx.isEditing() && ctx.hasPartialOperator()),
        targetId: "loadValueSuggestions",
        action: (event, ctx) => {
          ctx.setFilterOperator(event.data);
        },
      },
      {
        cond: (event, ctx) => ctx.isEditing(),
        targetId: "idle",
        action: (event, ctx) => {
          ctx.setFilterOperator(event.data);
        },
      },
    ],
  },
};
