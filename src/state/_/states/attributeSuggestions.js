export const loadAttributeSuggestions = {
  actions: {
    async onEntry(event, ctx, toolkit) {
      ctx.startLoading();

      const attributes = await toolkit.suggestionService.loadAttributes();

      ctx.doneLoading(attributes);

      toolkit.sendEvent("attributeSuggestionsLoaded");
    },
  },
  events: {
    discardSuggestions: "idle",
    attributeSuggestionsLoaded: [
      {
        cond: (event, ctx) => !ctx.isEditing(),
        targetId: "chooseAttribute",
      },
      {
        cond: (event, ctx) => ctx.isEditing(),
        targetId: "editAttribute",
      },
    ],
  },
};

export const chooseAttribute = {
  events: {
    discardSuggestions: "idle",
    selectItem: [
      {
        cond: (event, ctx) => event.data.item.type !== "parens",
        targetId: "loadOperatorSuggestions",
        action(event, ctx) {
          ctx.createPartialFilter(event.data.item);
        },
      },
      {
        cond: (event, ctx) => event.data.item.type === "parens",
        targetId: "loadAttributeSuggestions",
        action(event, ctx) {
          ctx.createParensFilter();
        },
      },
    ],
    createItem: {
      targetId: "idle",
      action(event, ctx) {
        ctx.createSearchTextFilter(event.data.item);
      },
    },
    // On backspace
    removeLastFilter: {
      targetId: "idle",
      action(event, ctx) {
        ctx.removeFilter(ctx.getLastFilter());
      },
    },
  },
};

export const editAttribute = {
  events: {
    discardSuggestions: "displayPartialFilterSuggestions",
    selectItem: [
      {
        cond: (event, ctx) => event.data.item.type !== "parens",
        targetId: "displayPartialFilterSuggestions",
        action(event, ctx) {
          ctx.editFilterAttribute(event.data.item);
        },
      },
      {
        cond: (event, ctx) => event.data.item.type === "parens",
        targetId: "displayPartialFilterSuggestions",
        action(event, ctx) {
          ctx.createParensFilter(true);
        },
      },
    ],
    createItem: {
      targetId: "displayPartialFilterSuggestions",
      action(event, ctx) {
        ctx.createSearchTextFilter(event.data.item);
      },
    },
  },
};
