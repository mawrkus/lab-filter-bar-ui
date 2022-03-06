export const loadLogicalOperatorSuggestions = {
  actions: {
    async onEntry(event, ctx, toolkit) {
      ctx.startLoading();

      const logicalOperators =
        await toolkit.suggestionService.loadLogicalOperators();

      ctx.doneLoading(logicalOperators);

      toolkit.sendEvent("logicalOperatorSuggestionsLoaded");
    },
  },
  events: {
    discardSuggestions: "idle",
    logicalOperatorSuggestionsLoaded: [
      {
        cond: (event, ctx) => !ctx.isEditing(),
        targetId: "chooseLogicalOperator",
      },
      {
        cond: (event, ctx) => ctx.isEditing(),
        targetId: "editLogicalOperator",
      },
    ],
  },
};

export const chooseLogicalOperator = {
  events: {
    discardSuggestions: "idle",
    selectItem: {
      targetId: "loadAttributeSuggestions",
      action: (event, ctx) => {
        ctx.createLogicalOperatorFilter(event.data);
      },
    },
    createItem: {
      targetId: "idle",
      action(event, ctx) {
        ctx.createLogicalOperatorFilter({ value: "and", label: "AND" });
        ctx.createSearchTextFilter(event.data);
      },
    },
    // On backspace
    removeLastFilter: {
      targetId: "idle",
      action(event, ctx) {
        ctx.removeFilter(ctx.getLastFilter());
      },
    },
  },
};

export const editLogicalOperator = {
  events: {
    discardSuggestions: "displayPartialFilterSuggestions",
    selectItem: {
      targetId: "displayPartialFilterSuggestions",
      action: (event, ctx) => {
        ctx.setFilterOperator(event.data);
      },
    },
  },
};
