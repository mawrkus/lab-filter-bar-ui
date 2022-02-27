export const loadValueSuggestions = {
  actions: {
    async onEntry(event, ctx, toolkit) {
      const ctxValue = ctx.get();
      const { partialFilter, filterUnderEdition } = ctxValue;

      if (filterUnderEdition?.type === 'search-text') {
        ctx.doneLoading([filterUnderEdition.value], null);

        return toolkit.sendEvent("valueSuggestionsLoaded");
      }

      const type = filterUnderEdition
        ? filterUnderEdition.attribute.value
        : partialFilter.attribute.value;

      let values = [];
      let error = null;

      ctx.startLoading();

      try {
        values = await toolkit.suggestionService.loadValues({ type });
      } catch (e) {
        if (toolkit.suggestionService.isCancelError(e)) {
          console.log('🗑️ "%s" suggestions request cancelled.', type);
          // nothing to do here as the cancellation was initiated when entering the "idle" state
          return;
        } else {
          console.error('💥 Ooops!', e);
          error = e;
        }
      }

      ctx.doneLoading(values, error);

      toolkit.sendEvent("valueSuggestionsLoaded");
    },
  },
  events: {
    discardSuggestions: "idle",
    valueSuggestionsLoaded: [
      // we allow search text filter creation regardless if there was a loading error or not
      {
        cond: (event, ctx) => !ctx.isEditing(),
        targetId: "chooseValue",
      },
      {
        cond: (event, ctx) => ctx.isEditing(),
        targetId: "editValue",
      }
    ],
  },
};

export const chooseValue = {
  actions: {
    onExit(event, ctx) {
      // we allowed search text filter edition even in case of loading error
      ctx.clearLoadingError();
    },
  },
  events: {
    discardSuggestions: "idle",
    selectItem: {
      targetId: "idle",
      action:(event, ctx) => {
        ctx.completePartialFilter(event.data);
      },
    },
    createItem: {
      targetId: "idle",
      action(event, ctx) {
        ctx.completePartialFilter(event.data);
      },
    },
    // On backspace
    removeLastFilter: [
      {
        cond: (event, ctx) => ctx.hasPartialFilter(),
        targetId: "loadOperatorSuggestions",
        action(event, ctx) {
          ctx.removePartialOperator();
        },
      },
    ],
  },
};

export const editValue = {
  actions: {
    onExit(event, ctx) {
      // we allowed search text filter edition even in case of loading error
      ctx.clearLoadingError();
    },
  },
  events: {
    discardSuggestions: "idle",
    selectItem: {
      targetId: "displayPartialFilterSuggestions",
      action:(event, ctx) => {
        ctx.setFilterValue(event.data);
      },
    },
    createItem: {
      targetId: "displayPartialFilterSuggestions",
      action(event, ctx) {
        ctx.setFilterValue(event.data);
      },
    },
  },
};
