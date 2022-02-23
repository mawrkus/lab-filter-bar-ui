export const idle = {
  actions: {
    onEntry(event, ctx, toolkit) {
      toolkit.suggestionService.cancelLoad();

      const resetError = event?.name === 'discardSuggestions';
      ctx.reset(resetError);
    },
  },
  events: {
    discardSuggestions: "idle",
    startInput: [
      {
        cond: (event, ctx) => !ctx.hasPartialFilter()
          && (ctx.getLastFilter() && ctx.getLastFilter().type !== 'logical-operator'),
        targetId: "loadLogicalOperatorSuggestions",
      },
      {
        cond: (event, ctx) => !ctx.hasPartialFilter()
          && (!ctx.getLastFilter() || ctx.getLastFilter().type === 'logical-operator'),
        targetId: "loadAttributeSuggestions",
      },
      {
        cond: (event, ctx) => ctx.hasPartialAttribute() && !ctx.hasPartialOperator(),
        targetId: "loadOperatorSuggestions",
      },
      {
        cond: (event, ctx) => ctx.hasPartialAttribute() && ctx.hasPartialOperator(),
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
    removeFilter: [
      {
        cond: (event, ctx) => !ctx.hasPartialFilter(),
        targetId: "idle",
        action(event, ctx) {
          ctx.removeFilter(event.data);
        },
      },
      {
        cond: (event, ctx) => ctx.hasPartialAttribute() && !ctx.hasPartialOperator(),
        targetId: "loadOperatorSuggestions",
        action(event, ctx) {
          ctx.removeFilter(event.data);
        },
      },
      {
        cond: (event, ctx) => ctx.hasPartialAttribute() && ctx.hasPartialOperator(),
        targetId: "loadValueSuggestions",
        action(event, ctx) {
          ctx.removeFilter(event.data);
        },
      },
    ],
    removeLastFilter: {
      targetId: "idle",
      action(event, ctx) {
        ctx.removeFilter(ctx.getLastFilter());
      },
    },
  },
};
