export const loadOperatorSuggestions = {
  actions: {
    async onEntry(event, ctx, toolkit) {
      ctx.startLoading();

      const items = await toolkit.suggestionService.loadOperators();

      ctx.doneLoading({items});

      toolkit.sendEvent("operatorsLoaded");
    },
  },
  events: {
    discardSuggestions: "idle",
    operatorsLoaded: "setOperator",
  },
};

export const setOperator = {
  events: {
    discardSuggestions: "idle",
    selectItem: [
      {
        cond: (event, ctx) => event.data.item.type !== "parens",
        targetId: "proxyToDisplayNextSuggestions",
        action(event, ctx) {
          ctx.editPartialFilterOperator(event.data.item);
        },
      },
      {
        cond: (event, ctx) => event.data.item.type === "parens",
        targetId: "proxyToDisplayNextSuggestions",
        action(event, ctx) {
          ctx.editFilterOperator(event.data.item);
        },
      },
    ],
  },
};
