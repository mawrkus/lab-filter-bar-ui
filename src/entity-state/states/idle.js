export const idle = {
  actions: {
    onEntry: (event, ctx) => {
      ctx.cancelLoading();
    },
  },
  events: {
    discardSuggestions: "idle",
    startInput: [
      {
        cond: (event, ctx) => (ctx.lastFilter() && ctx.lastFilter().type !== 'logical-operator')
          && !ctx.isPartialAttributeSelected() && !ctx.isPartialOperatorSelected(),
        targetId: "loadLogicalSuggestions",
      },
      {
        cond: (event, ctx) => (!ctx.lastFilter() || ctx.lastFilter().type === 'logical-operator')
          && !ctx.isPartialAttributeSelected() && !ctx.isPartialOperatorSelected(),
        targetId: "loadAttributeSuggestions",
      },
      {
        cond: (event, ctx) => ctx.isPartialAttributeSelected() && !ctx.isPartialOperatorSelected(),
        targetId: "loadOperatorSuggestions",
      },
      {
        cond: (event, ctx) =>
        ctx.isPartialAttributeSelected() && ctx.isPartialOperatorSelected(),
        targetId: "loadValueSuggestions",
      },
    ],
    editPartialOperator: {
      targetId: "loadOperatorSuggestions",
    },
    editOperator: {
      targetId: "loadOperatorSuggestions",
      action: (event, ctx) => {
        ctx.setEditFilter(event.data.filter);
      },
    },
    editValue: {
      targetId: "loadValueSuggestions",
      action: (event, ctx) => {
        ctx.setEditFilter(event.data.filter);
      },
    },
    editLogicalOperator: {
      targetId: "loadLogicalSuggestions",
      action: (event, ctx) => {
        ctx.setEditFilter(event.data.filter);
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
