export const displayAttributeSuggestions = {
  actions: {
    async onEntry(event, ctx, toolkit) {
      ctx.startLoading();

      const items = await toolkit.suggestionService.loadAttributes({
        addParens: !ctx.isInserting(),
      });

      ctx.doneLoading(items);

      toolkit.sendEvent("attributesLoaded");
    },
  },
  events: {
    discardSuggestions: "idle",
    attributesLoaded: [
      {
        cond: (event, ctx) => !ctx.isEditing(),
        targetId: "setAttribute",
      },
      {
        cond: (event, ctx) => ctx.isEditing(),
        targetId: "editAttribute",
      },
    ],
  },
};

export const setAttribute = {
  events: {
    discardSuggestions: "idle",
    selectItem: [
      {
        cond: (event) => event.data.item.type === "parens",
        targetId: "displayAttributeSuggestions",
        action(event, ctx) {
          ctx.createParensFilter();
        },
      },
      // non-parens
      {
        cond: (event) => event.data.isSearchText,
        targetId: "proxyToNextSuggestions",
        action(event, ctx) {
          ctx.createSearchTextFilter(event.data.item);
        },
      },
      {
        cond: (event) => !event.data.isSearchText,
        targetId: "displayOperatorSuggestions",
        action(event, ctx) {
          ctx.createPartialFilter(event.data.item);
        },
      },
    ],
    removeLastFilter: {
      targetId: "idle",
      action(event, ctx) {
        ctx.removeFilter(ctx.getLastFilter());
      },
    },
  },
};

export const editAttribute = {
  actions: {
    onExit(event, ctx) {
      ctx.stopEditing();
    },
  },
  events: {
    discardSuggestions: "idle",
    selectItem: {
      targetId: "proxyToNextSuggestions",
      action(event, ctx) {
        const { item, isSearchText } = event.data;

        if (item.type === "parens") {
          ctx.convertEditionToParensFilter();
          return;
        }

        if (isSearchText) {
          ctx.convertEditionToSearchTextFilter(event.data.item);
          return;
        }

        ctx.editFilter(item, "attribute");
      },
    },
  },
};
