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
    editFilter: [
      {
        cond: (event) => event.data.part === "attribute",
        targetId: "loadAttributeSuggestions",
        action(event, ctx) {
          ctx.startEditing(event.data.filter, event.data.part);
        },
      },
      {
        cond: (event) =>
          event.data.filter.type !== "logical-operator" &&
          event.data.part === "operator",
        targetId: "loadOperatorSuggestions",
        action(event, ctx) {
          ctx.startEditing(event.data.filter, event.data.part);
        },
      },
      {
        cond: (event) =>
          event.data.filter.type === "logical-operator" &&
          event.data.part === "operator",
        targetId: "loadLogicalOperatorSuggestions",
        action(event, ctx) {
          ctx.startEditing(event.data.filter, event.data.part);
        },
      },
      {
        cond: (event) => event.data.part === "value",
        targetId: "loadValueSuggestions",
        action(event, ctx) {
          ctx.startEditing(event.data.filter, event.data.part);
        },
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
