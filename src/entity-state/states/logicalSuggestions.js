export const loadLogicalSuggestions = {
  actions: {
    onEntry: async (event, ctx, toolkit) => {
      ctx.startLoading();

      const suggestions = await toolkit.suggestionService.loadLogicalOperators();

      ctx.doneLoading(suggestions);

      toolkit.sendEvent("onLogicalOperatorSuggestionsLoaded");
    },
  },
  events: {
    discardSuggestions: "idle",
    onLogicalOperatorSuggestionsLoaded: "displayLogicalSuggestions",
  },
};

export const displayLogicalSuggestions = {
  events: {
    discardSuggestions: "idle",
    selectItem: [
      // filter creation
      {
        cond: (event, ctx) => !ctx.isEditingFilter(),
        targetId: "idle",
        action:(event, ctx) => {
          ctx.setFilterOperator(event.data);
          ctx.addFilter(null, 'logical-operator');
        },
      },
      // filter edition
      {
        cond: (event, ctx) => ctx.isEditingFilter(),
        targetId: "idle",
        action: (event, ctx) => {
          ctx.setFilterOperator(event.data);
        },
      },
    ],
  },
};
