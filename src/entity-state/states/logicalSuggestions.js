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
          ctx.createLogicalOperator(event.data);
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
    createItem: {
      targetId: "idle",
      action: (event, ctx) => {
        ctx.createLogicalOperator({ value: 'and', label: 'AND' });
        ctx.createFreeTextFilter(event.data);
      },
    },
  },
};
