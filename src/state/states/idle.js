export const idle = {
  actions: {
    onEntry(event, ctx, toolkit) {
      toolkit.suggestionService.cancelLoad();

      const resetError = event?.name === "discardSuggestions";

      ctx.reset(resetError);
    },
  },
  events: {
    discardSuggestions: "idle",
    startInput: [
      {
        cond: (event, ctx) => {
          const lastFilter = ctx.getLastFilter();
          return !lastFilter || lastFilter.type === "logical-operator";
        },
        targetId: "loadAttributeSuggestions",
      },
      {
        cond: (event, ctx) => {
          const partialFilter = ctx.getPartialFilter();
          return partialFilter && partialFilter.operator === null;
        },
        targetId: "loadOperatorSuggestions",
      },
      {
        cond: (event, ctx) => {
          const partialFilter = ctx.getPartialFilter();
          return partialFilter && partialFilter.value === null;
        },
        targetId: "loadValueSuggestions",
      },
      {
        cond: (event, ctx) => ctx.getLastFilter(),
        targetId: "loadLogicalOperatorSuggestions",
      },
    ],
    editFilter: [
      {
        cond: (event) => event.data.filter.type === "logical-operator",
        targetId: "loadLogicalOperatorSuggestions",
        action(event, ctx) {
          ctx.startEditing(event.data);
        },
      },
      {
        cond: (event) => event.data.part === "attribute",
        targetId: "loadAttributeSuggestions",
        action(event, ctx) {
          ctx.startEditing(event.data);
        },
      },
      {
        cond: (event) => event.data.part === "operator",
        targetId: "loadOperatorSuggestions",
        action(event, ctx) {
          ctx.startEditing(event.data);
        },
      },
      {
        cond: (event) => event.data.part === "value",
        targetId: "loadValueSuggestions",
        action(event, ctx) {
          ctx.startEditing(event.data);
        },
      },
      {
        cond: (event) => event.data.filter.type === "parens",
        targetId: "displayParensSuggestions",
      },
    ],
    removeFilter: {
      targetId: "displayPartialFilterSuggestions",
      action(event, ctx) {
        ctx.removeFilter(event.data.filter);
      },
    },
    removeLastFilter: {
      targetId: "idle",
      action(event, ctx) {
        ctx.removeFilter(ctx.getLastFilter());
      },
    },
  },
};
