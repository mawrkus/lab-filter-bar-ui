export const idle = {
  actions: {
    onEntry: (event, ctx) => {
      ctx.set({ ...ctx.get(), loading: false });
    },
  },
  events: {
    onDiscardSuggestions: "idle",
    onInputFocus: [
      {
        cond: (event, ctx) => ctx.get().partialFilter.attribute === null,
        targetId: "loadAttributeSuggestions",
      },
      {
        cond: (event, ctx) => ctx.get().partialFilter.operator === null,
        targetId: "loadOperatorSuggestions",
      },
      {
        cond: (event, ctx) =>
          ctx.get().partialFilter.attribute && ctx.get().partialFilter.operator,
        targetId: "loadValueSuggestions",
      },
    ],
    onRemoveFilter: {
      targetId: "idle",
      action: (event, ctx) => {
        const newCtx = ctx.get();
        const { id } = event.data;

        newCtx.filters = newCtx.filters.filter((f) => f.id !== id);

        ctx.set(newCtx);
      },
    },
  },
};
