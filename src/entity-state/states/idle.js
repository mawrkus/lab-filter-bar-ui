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
        cond: (event, ctx) => !ctx.isPartialAttributeSelected() && !ctx.isPartialOperatorSelected(),
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
    editPartialOperatorSuggestion: {
      targetId: "loadOperatorSuggestions",
    },
    editAttributeSuggestion: {
      targetId: "loadAttributeSuggestions",
      action: (event, ctx) => {
        ctx.setEditFilter(event.data.filter);
      },
    },
    editOperatorSuggestion: {
      targetId: "loadOperatorSuggestions",
      action: (event, ctx) => {
        ctx.setEditFilter(event.data.filter);
      },
    },
    editValueSuggestion: {
      targetId: "loadValueSuggestions",
      action: (event, ctx) => {
        ctx.setEditFilter(event.data.filter);
      },
    },
    removeFilter: {
      targetId: "idle",
      action: (event, ctx) => {
        ctx.removeFilter(event.data.id);
      },
    },
  },
};
