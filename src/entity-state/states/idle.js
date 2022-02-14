export const idle = {
  actions: {
    onEntry: (event, ctx) => {
      ctx.cancelLoading();
    },
  },
  events: {
    onDiscardSuggestions: "idle",
    onInputFocus: [
      {
        cond: (event, ctx) => !ctx.isAttributeSelected() && !ctx.isOperatorSelected(),
        targetId: "loadAttributeSuggestions",
      },
      {
        cond: (event, ctx) => ctx.isAttributeSelected() && !ctx.isOperatorSelected(),
        targetId: "loadOperatorSuggestions",
      },
      {
        cond: (event, ctx) =>
        ctx.isAttributeSelected() && ctx.isOperatorSelected(),
        targetId: "loadValueSuggestions",
      },
    ],
    onRemoveFilter: {
      targetId: "idle",
      action: (event, ctx) => {
        ctx.removeFilter(event.data.id);
      },
    },
  },
};
