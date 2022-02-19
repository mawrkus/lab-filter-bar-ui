export const loadValueSuggestions = {
  actions: {
    onEntry: async (event, ctx, toolkit) => {
      const ctxValue = ctx.get();
      const { partialFilter, filterUnderEdition } = ctxValue;

      if (filterUnderEdition?.type === 'free-text') {
        ctx.doneLoading([filterUnderEdition.value], null);
        return toolkit.sendEvent("onValueSuggestionsLoaded");
      }

      const type = filterUnderEdition
        ? filterUnderEdition.attribute.value
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
    selectItem: [
      // TODO: if isEditing and no partial and last filter is logical -> load value suggestions
      {
        cond: (event, ctx) => !ctx.isEditing() || (ctx.isEditing() && !ctx.hasPartialAttribute() && !ctx.hasPartialOperator()),
        targetId: "idle",
        action:(event, ctx) => {
          if (ctx.get().filterUnderEdition) {
            ctx.setFilterValue(event.data);
          } else {
            ctx.completePartialFilter(event.data);
          }
        },
      },
      {
        cond: (event, ctx) => ctx.isEditing() && ctx.hasPartialAttribute() && !ctx.hasPartialOperator(),
        targetId: "loadOperatorSuggestions",
        action: (event, ctx) => {
          ctx.setFilterValue(event.data);
        },
      },
      {
        cond: (event, ctx) => ctx.isEditing() && ctx.hasPartialAttribute() && ctx.hasPartialOperator(),
        targetId: "loadValueSuggestions",
        action: (event, ctx) => {
          ctx.setFilterValue(event.data);
        },
      },
    ],
    createItem: {
      // TODO: same as above
      targetId: "idle",
      action: (event, ctx) => {
        const ctxValue = ctx.get();

        if (ctxValue.filterUnderEdition) {
          ctx.setFilterValue(event.data);
        } else {
          ctx.completePartialFilter(event.data);
        }
      },
    },
  },
};
