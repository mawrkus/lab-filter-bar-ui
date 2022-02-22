export const loadValueSuggestions = {
  actions: {
    async onEntry(event, ctx, toolkit) {
      const ctxValue = ctx.get();
      const { partialFilter, filterUnderEdition } = ctxValue;

      if (filterUnderEdition?.type === 'search-text') {
        ctx.doneLoading([filterUnderEdition.value], null);
        return toolkit.sendEvent("onValueSuggestionsLoaded");
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

      toolkit.sendEvent("onValueSuggestionsLoaded");
    },
  },
  events: {
    discardSuggestions: "idle",
    onValueSuggestionsLoaded: [
      {
        cond: (event, ctx) => ctx.hasLoadingError(),
        targetId: "idle",
      },
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
        cond: (event, ctx) => ctx.hasPartialOperator(),
        targetId: "loadOperatorSuggestions",
        action(event, ctx) {
          ctx.removePartialOperator();
        },
      },
    ],
  },
};

export const editValue = {
  events: {
    discardSuggestions: "idle",
    selectItem: [
      {
        cond: (event, ctx) => !ctx.hasPartialFilter(),
        targetId: "idle",
        action:(event, ctx) => {
          ctx.setFilterValue(event.data);
        },
      },
      {
        cond: (event, ctx) => ctx.hasPartialAttribute() && !ctx.hasPartialOperator(),
        targetId: "loadOperatorSuggestions",
        action(event, ctx) {
          ctx.setFilterValue(event.data);
        },
      },
      {
        cond: (event, ctx) => ctx.hasPartialAttribute() && ctx.hasPartialOperator(),
        targetId: "loadValueSuggestions",
        action(event, ctx) {
          ctx.setFilterValue(event.data);
        },
      },
    ],
    createItem: [
      {
        cond: (event, ctx) => !ctx.hasPartialFilter(),
        targetId: "idle",
        action(event, ctx) {
          ctx.setFilterValue(event.data);
        },
      },
      {
        cond: (event, ctx) => ctx.hasPartialAttribute() && !ctx.hasPartialOperator(),
        targetId: "loadOperatorSuggestions",
        action(event, ctx) {
          ctx.setFilterValue(event.data);
        },
      },
      {
        cond: (event, ctx) => ctx.hasPartialAttribute() && ctx.hasPartialOperator(),
        targetId: "loadValueSuggestions",
        action(event, ctx) {
          ctx.setFilterValue(event.data);
        },
      },
    ],
  },
};
