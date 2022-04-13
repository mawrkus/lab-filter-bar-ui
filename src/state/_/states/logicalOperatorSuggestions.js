export const loadLogicalOperatorSuggestions = {
  actions: {
    async onEntry(event, ctx, toolkit) {
      ctx.startLoading();

      const { edition, insertion } = ctx.get();

      const parens =
        insertion.filter.id === "root" &&
        edition?.filter?.type === "logical-operator";

      const logicalOperators =
        await toolkit.suggestionService.loadLogicalOperators({ parens });

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
      action(event, ctx) {
        ctx.createLogicalOperatorFilter(event.data.item);
      },
    },
    createItem: {
      targetId: "idle",
      action(event, ctx) {
        ctx.createLogicalOperatorFilter({ value: "and", label: "AND" });
        ctx.createSearchTextFilter(event.data.item);
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
    selectItem: [
      {
        cond: (event, ctx) => event.data.item.type !== "parens",
        targetId: "displayPartialFilterSuggestions",
        action(event, ctx) {
          ctx.editFilterOperator(event.data.item);
        },
      },
      {
        cond: (event, ctx) => event.data.item.type === "parens",
        targetId: "displayPartialFilterSuggestions",
        action(event, ctx) {
          ctx.groupFiltersInParens();
        },
      },
    ],
  },
};
