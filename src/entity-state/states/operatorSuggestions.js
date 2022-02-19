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
      // TODO: if isEditing and no partial and last filter is logical -> load value suggestions
      {
        cond: (event, ctx) => !ctx.isEditing() || (ctx.isEditing() && ctx.hasPartialAttribute() && ctx.hasPartialOperator()),
        targetId: "loadValueSuggestions",
        action:(event, ctx) => {
          ctx.setFilterOperator(event.data);
        },
      },
      {
        cond: (event, ctx) => ctx.isEditing() && (!ctx.hasPartialAttribute() && !ctx.hasPartialOperator()),
        targetId: "idle",
        action:(event, ctx) => {
          ctx.setFilterOperator(event.data);
        },
      },
      {
        cond: (event, ctx) => ctx.isEditing() && ctx.hasPartialAttribute() && !ctx.hasPartialOperator(),
        targetId: "loadOperatorSuggestions",
        action: (event, ctx) => {
          ctx.setFilterOperator(event.data);
        },
      },
    ],
  },
};
