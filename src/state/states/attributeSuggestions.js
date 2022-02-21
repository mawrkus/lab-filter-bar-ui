export const loadAttributeSuggestions = {
  actions: {
    async onEntry(event, ctx, toolkit) {
      ctx.startLoading();

      const attributes = await toolkit.suggestionService.loadAttributes();

      ctx.doneLoading(attributes);

      toolkit.sendEvent("onAttributeSuggestionsLoaded");
    },
  },
  events: {
    discardSuggestions: "idle",
    onAttributeSuggestionsLoaded: "displayAttributeSuggestions",
  },
};

export const displayAttributeSuggestions = {
  events: {
    discardSuggestions: "idle",
    selectItem: [
      {
        cond: (event, ctx) => !ctx.hasPartialOperator(),
        targetId: "loadOperatorSuggestions",
        action(event, ctx) {
          ctx.setFilterAttribute(event.data);
        },
      },
      {
        cond: (event, ctx) => ctx.hasPartialOperator(),
        targetId: "loadValueSuggestions",
        action(event, ctx) {
          ctx.setFilterAttribute(event.data);
        },
      },
    ],
    createItem: {
      targetId: "idle",
      action(event, ctx) {
        ctx.createFreeTextFilter(event.data);
      },
    },
    // On backspace
    removeLastFilter: {
      targetId: "idle",
      action(event, ctx) {
        ctx.removeFilter(ctx.getLastFilter());
      },
    },
  },
};
