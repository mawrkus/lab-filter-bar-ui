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
    onAttributeSuggestionsLoaded: "chooseAttribute",
  },
};

export const chooseAttribute = {
  events: {
    discardSuggestions: "idle",
    selectItem: [
      {
        cond: (event, ctx) => ctx.hasMissingPartialOperator(),
        targetId: "loadOperatorSuggestions",
        action(event, ctx) {
          ctx.setFilterAttribute(event.data);
        },
      },
      {
        cond: (event, ctx) => ctx.hasMissingPartialValue(),
        targetId: "loadValueSuggestions",
        action(event, ctx) {
          ctx.setFilterAttribute(event.data);
        },
      },
    ],
    createItem: {
      targetId: "idle",
      action(event, ctx) {
        ctx.createSearchTextFilter(event.data);
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
