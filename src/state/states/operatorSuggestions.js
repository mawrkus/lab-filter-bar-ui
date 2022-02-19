export const loadOperatorSuggestions = {
  actions: {
    onEntry: async (event, ctx, toolkit) => {
      ctx.startLoading();

      const operators = await toolkit.suggestionService.loadOperators();

      ctx.doneLoading(operators);

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
        cond: (event, ctx) => !ctx.isEditing() || (ctx.isEditing() && ctx.hasPartialAttribute() && ctx.hasPartialOperator()),
        targetId: "loadValueSuggestions",
        action:(event, ctx) => {
          ctx.setFilterOperator(event.data);
        },
      },
      {
        cond: (event, ctx) => ctx.isEditing() && !ctx.hasPartialFilter(),
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
