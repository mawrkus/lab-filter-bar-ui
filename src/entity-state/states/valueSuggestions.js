export const loadValueSuggestions = {
  actions: {
    onEntry: async (event, ctx, toolkit) => {
      const currentCtx = ctx.get();

      ctx.set({ ...currentCtx, loading: true });

      const type = currentCtx.partialFilter.attribute.value;

      const suggestions = await toolkit.suggestionService.loadValues({ type });

      ctx.set({ ...currentCtx, loading: false, suggestions });

      toolkit.sendEvent("onValueSuggestionsLoaded");
    },
  },
  events: {
    onDiscardSuggestions: "idle",
    onValueSuggestionsLoaded: "displayValueSuggestions",
  },
};

export const displayValueSuggestions = {
  events: {
    onDiscardSuggestions: "idle",
    onSelectItem: {
      targetId: "idle",
      action: (event, ctx) => {
        const newCtx = ctx.get();
        const { partialFilter, filters } = newCtx;

        const newFilter = {
          id: newCtx.filterId++,
          attribute: partialFilter.attribute,
          operator: partialFilter.operator,
          operand: event.data,
        };

        filters.push(newFilter);

        partialFilter.attribute = null;
        partialFilter.operator = null;

        ctx.set(newCtx);
      },
    },
  },
};
