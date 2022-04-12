export const loadAttributeSuggestions = {
  actions: {
    async onEntry(event, ctx, toolkit) {
      ctx.startLoading();

      const items = await toolkit.suggestionService.loadAttributes({
        addParens: !ctx.isInserting(),
      });

      ctx.doneLoading({ items });

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
        targetId: "loadAttributeSuggestions",
        action(event, ctx) {
          ctx.createParensFilter();
        },
      },
      // non-parens
      {
        cond: (event) => event.data.isSearchText,
        targetId: "proxyToNextSuggestions",
        action(event, ctx) {
          ctx.createSearchTextFilter({ item: event.data.item });
        },
      },
      {
        cond: (event) => !event.data.isSearchText,
        targetId: "loadOperatorSuggestions",
        action(event, ctx) {
          ctx.createPartialFilter({ item: event.data.item });
        },
      },
    ],
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
          ctx.convertEditionToSearchTextFilter({ item: event.data.item });
          return;
        }

        ctx.editFilterAttribute({ item });
      },
    },
  },
};
