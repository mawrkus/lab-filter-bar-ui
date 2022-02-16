export const loadValueSuggestions = {
  actions: {
    onEntry: async (event, ctx, toolkit) => {
      const ctxValue = ctx.get();
      const { partialFilter, editFilter } = ctxValue;

      if (editFilter && editFilter.type === 'free-text') {
        ctx.doneLoading([editFilter.value], null);
        return toolkit.sendEvent("onValueSuggestionsLoaded");
      }

      const type = editFilter
        ? editFilter.attribute.value
        : partialFilter.attribute.value;

      let suggestions = [];
      let error = null;

      ctx.startLoading();

      try {
        suggestions = await toolkit.suggestionService.loadValues({ type });
      } catch (e) {
        console.error('💥 Ooops!', e);
        error = e;
      }

      ctx.doneLoading(suggestions, error);

      if (!error) {
        toolkit.sendEvent("onValueSuggestionsLoaded");
      } else {
        toolkit.sendEvent("idle");
      }
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
          ctx.completePartialFilter(event.data);
        }
      },
    },
    createItem: {
      targetId: "idle",
      action: (event, ctx) => {
        const ctxValue = ctx.get();

        if (ctxValue.editFilter) {
          ctx.setFilterValue(event.data);
        } else {
          ctx.completePartialFilter(event.data);
        }
      },
    },
  },
};
