export const loadValueSuggestions = {
  actions: {
    async onEntry(event, ctx, toolkit) {
      const ctxValue = ctx.get();
      const { partialFilter, filterUnderEdition } = ctxValue;

      if (filterUnderEdition?.type === "search-text") {
        ctx.doneLoading([filterUnderEdition.value]);
        return toolkit.sendEvent("valueSuggestionsLoaded");
      }

      let values = [];
      let error = null;

      const valuesType = filterUnderEdition
        ? filterUnderEdition.attribute.value
        : partialFilter.attribute.value;

      const selectionType = filterUnderEdition
        ? filterUnderEdition.operator.selectionType || "single"
        : partialFilter.operator.selectionType || "single";

      ctx.startLoading(selectionType);

      try {
        values = await toolkit.suggestionService.loadValues({ type: valuesType });
      } catch (e) {
        if (toolkit.suggestionService.isCancelError(e)) {
          console.log('🗑️ Request cancelled for "%s" values.', valuesType);
          // nothing to do here as the cancellation was initiated when entering the "idle" state
          return;
        } else {
          console.error("💥 Ooops!", e);
          error = e;
        }
      }

      ctx.doneLoading(values, selectionType, error);

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
      },
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
      action: (event, ctx) => {
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
    discardSuggestions: "displayPartialFilterSuggestions",
    selectItem: {
      targetId: "displayPartialFilterSuggestions",
      action: (event, ctx) => {
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
