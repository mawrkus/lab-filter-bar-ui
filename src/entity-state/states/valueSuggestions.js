export const loadValueSuggestions = {
  actions: {
    onEntry: async (event, ctx, toolkit) => {
      const ctxValue = ctx.startLoading();
      const { partialFilter, editFilter } = ctxValue;

      const type = editFilter
        ? editFilter.attribute.value
        : partialFilter.attribute.value;

      const suggestions = await toolkit.suggestionService.loadValues({ type });

      ctx.doneLoading(suggestions);

      toolkit.sendEvent("onValueSuggestionsLoaded");
    },
  },
  events: {
    discardSuggestions: "idle",
    onValueSuggestionsLoaded: "displayValueSuggestions",
  },
};

export const displayValueSuggestions = {
  events: {
    discardSuggestions: "idle",
    selectItem: {
      targetId: "idle",
      action: (event, ctx) => {
        const ctxValue = ctx.get();

        if (ctxValue.editFilter) {
          ctx.setFilterValue(event.data);
        } else {
          ctx.addFilter(event.data);
        }
      },
    },
  },
};
