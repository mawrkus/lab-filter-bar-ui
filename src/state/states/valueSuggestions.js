export const loadValueSuggestions = {
  actions: {
    async onEntry(event, ctx, toolkit) {
      const filterUnderEdition = ctx.getEdition()?.filter;

      if (filterUnderEdition?.type === "search-text") {
        ctx.doneLoading({ items: [filterUnderEdition.value] });

        return toolkit.sendEvent("valueSuggestionsLoaded");
      }

      const targetFilter = filterUnderEdition || ctx.getPartialFilter();
      const valuesType = targetFilter.attribute.value;
      const operatorType = targetFilter.operator.type;

      const selectionType =
        operatorType === "multiple-value" ? "multiple" : "single";

      ctx.startLoading(selectionType);

      let items = [];
      let error = null;

      try {
        items = await toolkit.suggestionService.loadValues({
          type: valuesType,
        });
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

      ctx.doneLoading({ items, selectionType, error });

      toolkit.sendEvent("valuesLoaded");
    },
  },
  events: {
    discardSuggestions: "idle",
    valuesLoaded: [
      {
        cond: (event, ctx) => !ctx.isEditing(),
        targetId: "setValue",
      },
      {
        cond: (event, ctx) => ctx.isEditing(),
        targetId: "editValue",
      },
    ],
  },
};

export const setValue = {
  events: {
    discardSuggestions: "idle",
    selectItem: {
      targetId: "proxyToNextSuggestions",
      action(event, ctx) {
        ctx.completePartialFilter({ item: event.data.item });
      },
    },
  },
};

export const editValue = {
  actions: {
    onExit(event, ctx) {
      ctx.stopEditing();

      // we allowed search text filter edition even in case of loading error
      ctx.clearLoadingError();
    },
  },
  events: {
    discardSuggestions: "idle",
    selectItem: {
      targetId: "proxyToNextSuggestions",
      action(event, ctx) {
        ctx.editFilterValue({ item: event.data.item });
      },
    },
  },
};
