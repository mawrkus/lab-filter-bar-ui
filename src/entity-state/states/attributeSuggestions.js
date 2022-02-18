export const loadAttributeSuggestions = {
  actions: {
    onEntry: async (event, ctx, toolkit) => {
      ctx.startLoading();

      const suggestions = await toolkit.suggestionService.loadAttributes();

      ctx.doneLoading(suggestions);

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
        action: (event, ctx) => {
          ctx.setFilterAttribute(event.data);
          // we might be editing a partial filter value and because we don't go back to idle
          // we have to stop editing
          ctx.stopEditing();
        },
      },
      {
        cond: (event, ctx) => ctx.hasPartialOperator(),
        targetId: "loadValueSuggestions",
        action: (event, ctx) => {
          ctx.setFilterAttribute(event.data);
            // we might be editing a partial filter value and because we don't go back to idle
          // we have to stop editing
          ctx.stopEditing();
        },
      },
    ],
    createItem: {
      targetId: "idle",
      action: (event, ctx) => {
        ctx.createFreeTextFilter(event.data);
      },
    },
  },
};
