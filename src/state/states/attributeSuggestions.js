export const loadAttributeSuggestions = {
  actions: {
    async onEntry(event, ctx, toolkit) {
      ctx.startLoading();

      const addParens = !ctx.isInserting();
      const items = await toolkit.suggestionService.loadAttributes({ addParens });

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
    selectItem: {
      targetId: "proxyToDisplayNextSuggestions",
      action(event, ctx) {
        const { item, isSearchText } = event.data;

        if (item.type === "parens") {
          ctx.createParensFilter();
          return;
        }

        if (isSearchText) {
          ctx.createSearchTextFilter({ item: event.data.item });
          return;
        }

        ctx.createPartialFilter({ item });
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
      targetId: "proxyToDisplayNextSuggestions",
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
