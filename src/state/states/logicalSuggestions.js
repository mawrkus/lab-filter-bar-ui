export const loadLogicalSuggestions = {
  actions: {
    onEntry: async (event, ctx, toolkit) => {
      ctx.startLoading();

      const logicalOperators = await toolkit.suggestionService.loadLogicalOperators();

      ctx.doneLoading(logicalOperators);

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
        cond: (event, ctx) => !ctx.isEditing(),
        targetId: "idle",
        action:(event, ctx) => {
          ctx.createLogicalOperator(event.data);
        },
      },
      // filter edition
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
      {
        cond: (event, ctx) => ctx.isEditing() && ctx.hasPartialAttribute() && ctx.hasPartialOperator(),
        targetId: "loadValueSuggestions",
        action: (event, ctx) => {
          ctx.setFilterOperator(event.data);
        },
      },
    ],
    createItem: [
      // to automatically connect free text filters
      {
        cond: (event, ctx) => !ctx.isEditing(),
        targetId: "idle",
        action: (event, ctx) => {
          ctx.createLogicalOperator({ value: 'and', label: 'AND' });
          ctx.createFreeTextFilter(event.data);
        },
      },
    ],
    // On backspace
    removeLastFilter: {
      targetId: 'displayLogicalSuggestions',
    },
  },
};
