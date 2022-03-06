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
        cond: (event, ctx) =>
          !ctx.hasPartialFilter() &&
          ctx.getLastFilter() &&
          ctx.getLastFilter().type !== "logical-operator",
        targetId: "loadLogicalOperatorSuggestions",
      },
      {
        cond: (event, ctx) =>
          !ctx.hasPartialFilter() &&
          (!ctx.getLastFilter() ||
            ctx.getLastFilter().type === "logical-operator"),
        targetId: "loadAttributeSuggestions",
      },
      {
        cond: (event, ctx) => ctx.hasMissingPartialOperator(),
        targetId: "loadOperatorSuggestions",
      },
      {
        cond: (event, ctx) => ctx.hasMissingPartialValue(),
        targetId: "loadValueSuggestions",
      },
    ],
    editPartialAttribute: {
      targetId: "loadAttributeSuggestions",
      action(event, ctx) {
        ctx.startEditing();
      },
    },
    editPartialOperator: {
      targetId: "loadOperatorSuggestions",
      action(event, ctx) {
        ctx.startEditing();
      },
    },
    editOperator: {
      targetId: "loadOperatorSuggestions",
      action(event, ctx) {
        ctx.startEditing(event.data);
      },
    },
    editValue: {
      targetId: "loadValueSuggestions",
      action(event, ctx) {
        ctx.startEditing(event.data);
      },
    },
    editLogicalOperator: {
      targetId: "loadLogicalOperatorSuggestions",
      action(event, ctx) {
        ctx.startEditing(event.data);
      },
    },
    removeFilter: {
      targetId: "displayPartialFilterSuggestions",
      action(event, ctx) {
        ctx.removeFilter(event.data);
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
