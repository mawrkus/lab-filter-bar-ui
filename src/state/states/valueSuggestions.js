export const loadValueSuggestions = {
  actions: {
    async onEntry(event, ctx, toolkit) {
      const ctxValue = ctx.get();
      const { partialFilter, filterUnderEdition } = ctxValue;

      if (filterUnderEdition?.type === 'free-text') {
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
      {
        cond: (event, ctx) => !ctx.isEditing() || (ctx.isEditing() && !ctx.hasPartialFilter()),
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
        action(event, ctx) {
          ctx.setFilterValue(event.data);
        },
      },
      {
        cond: (event, ctx) => ctx.isEditing() && ctx.hasPartialAttribute() && ctx.hasPartialOperator(),
        targetId: "loadValueSuggestions",
        action(event, ctx) {
          ctx.setFilterValue(event.data);
        },
      },
    ],
    createItem: {
      targetId: "idle",
      action(event, ctx) {
        const ctxValue = ctx.get();

        if (ctxValue.filterUnderEdition) {
          ctx.setFilterValue(event.data);
        } else {
          ctx.completePartialFilter(event.data);
        }
      },
    },
    // On backspace
    removeLastFilter: [
      {
        cond: (event, ctx) => !ctx.isEditing() && ctx.hasPartialOperator(),
        targetId: "loadOperatorSuggestions",
        action(event, ctx) {
          ctx.removePartialOperator();
        },
      },
    ],
  },
};
