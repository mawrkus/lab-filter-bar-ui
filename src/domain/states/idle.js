export const idle = {
  actions: {
    onEntry(event, ctx, toolkit) {
      toolkit.suggestionService.abortLoad();

      // reset:
      //   - suggestions (loading = false) and error,
      //   - insertion to root node and edition
      ctx.reset();
    },
  },
  events: {
    startInput: [
      {
        cond: (event, ctx) => !ctx.getLastFilter(),
        targetId: "displayAttributeSuggestions",
      },
      {
        cond: (event, ctx) => {
          const lastFilter = ctx.getLastFilter();
          return (
            lastFilter.type !== "partial" &&
            lastFilter.type !== "logical-operator"
          );
        },
        targetId: "displayLogicalOperatorSuggestions",
      },
      {
        cond: () => true,
        targetId: "proxyToNextSuggestions",
      },
    ],
    editFilter: [
      {
        cond: (event) => event.data.filter.type !== "parens",
        targetId: "proxyToEditSuggestions",
      },
      // parens
      {
        cond: (event) => !event.data.filter.filters.length,
        targetId: "displayAttributeSuggestions",
        action(event, ctx) {
          ctx.startInserting(event.data.filter.id);
        },
      },
      {
        cond: (event) => {
          const { filters } = event.data.filter;
          const lastFilter = filters[filters.length - 1];

          return (
            lastFilter.type !== "partial" &&
            lastFilter.type !== "logical-operator"
          );
        },
        targetId: "displayLogicalOperatorSuggestions",
        action(event, ctx) {
          ctx.startInserting(event.data.filter.id);
        },
      },
      {
        cond: () => true,
        targetId: "proxyToNextSuggestions",
        action(event, ctx) {
          ctx.startInserting(event.data.filter.id);
        },
      },
    ],
    removeFilter: {
      targetId: "proxyToNextSuggestions",
      action(event, ctx) {
        ctx.removeFilter(event.data.filter);
      },
    },
    removeLastFilter: {
      targetId: "idle",
      action(event, ctx) {
        const lastFilter = ctx.getLastFilter();

        if (
          lastFilter.type === "parens" &&
          lastFilter.filters[lastFilter.filters.length - 1]
        ) {
          ctx.removeFilter(lastFilter.filters[lastFilter.filters.length - 1]);
          return;
        }

        ctx.removeFilter(lastFilter);
      },
    },
  },
};
