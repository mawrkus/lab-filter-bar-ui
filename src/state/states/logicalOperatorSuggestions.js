export const loadLogicalOperatorSuggestions = {
  actions: {
    async onEntry(event, ctx, toolkit) {
      ctx.startLoading();

      const logicalOperators = await toolkit.suggestionService.loadLogicalOperators();

      ctx.doneLoading(logicalOperators);

      toolkit.sendEvent("onLogicalOperatorSuggestionsLoaded");
    },
  },
  events: {
    discardSuggestions: "idle",
    onLogicalOperatorSuggestionsLoaded: [
      {
        cond: (event, ctx) => !ctx.isEditing(),
        targetId: "chooseLogicalOperator",
      },
      {
        cond: (event, ctx) => ctx.isEditing(),
        targetId: "editLogicalOperator",
      }
    ],
  },
};

export const chooseLogicalOperator = {
  events: {
    discardSuggestions: "idle",
    selectItem: {
      targetId: "idle",
      action:(event, ctx) => {
        ctx.createLogicalOperatorFilter(event.data);
      },
    },
    createItem: {
      targetId: "idle",
      action(event, ctx) {
        ctx.createLogicalOperatorFilter({ value: 'and', label: 'AND' });
        ctx.createSearchTextFilter(event.data);
      },
    },
    // On backspace
    removeLastFilter: {
      targetId: 'idle',
      action(event, ctx) {
        ctx.removeFilter(ctx.getLastFilter());
      },
    },
  },
};

export const editLogicalOperator = {
  events: {
    discardSuggestions: "idle",
    selectItem: [
      {
        cond: (event, ctx) => !ctx.hasPartialFilter(),
        targetId: "idle",
        action:(event, ctx) => {
          ctx.setFilterOperator(event.data);
        },
      },
      {
        cond: (event, ctx) => ctx.hasPartialAttribute() && !ctx.hasPartialOperator(),
        targetId: "loadOperatorSuggestions",
        action(event, ctx) {
          ctx.setFilterOperator(event.data);
        },
      },
      {
        cond: (event, ctx) => ctx.hasPartialAttribute() && ctx.hasPartialOperator(),
        targetId: "loadValueSuggestions",
        action(event, ctx) {
          ctx.setFilterOperator(event.data);
        },
      },
    ],
  },
};
