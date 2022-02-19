export const idle = {
  actions: {
    onEntry: (event, ctx, toolkit) => {
      toolkit.suggestionService.cancelLoad();
      ctx.reset();
    },
  },
  events: {
    discardSuggestions: "idle",
    startInput: [
      {
        cond: (event, ctx) => (ctx.getLastFilter() && ctx.getLastFilter().type !== 'logical-operator')
          && !ctx.hasPartialFilter(),
        targetId: "loadLogicalSuggestions",
      },
      {
        cond: (event, ctx) => (!ctx.getLastFilter() || ctx.getLastFilter().type === 'logical-operator')
          && !ctx.hasPartialFilter(),
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
      action: (event, ctx) => {
        ctx.startEditing();
      },
    },
    editPartialOperator: {
      targetId: "loadOperatorSuggestions",
      action: (event, ctx) => {
        ctx.startEditing();
      },
    },
    editOperator: {
      targetId: "loadOperatorSuggestions",
      action: (event, ctx) => {
        ctx.startEditing(event.data.filter);
      },
    },
    editValue: {
      targetId: "loadValueSuggestions",
      action: (event, ctx) => {
        ctx.startEditing(event.data.filter);
      },
    },
    editLogicalOperator: {
      targetId: "loadLogicalSuggestions",
      action: (event, ctx) => {
        ctx.startEditing(event.data.filter);
      },
    },
    removeFilter: {
      targetId: "idle",
      action: (event, ctx) => {
        ctx.removeFilter(event.data);
      },
    },
  },
};
