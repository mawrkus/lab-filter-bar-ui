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
    selectItem: {
      targetId: "loadOperatorSuggestions",
      action(event, ctx) {
        ctx.setPartialFilterAttribute(event.data.item);
      },
    },
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
    selectItem: {
      targetId: "displayPartialFilterSuggestions",
      action(event, ctx) {
        ctx.setPartialFilterAttribute(event.data.item);
      },
    },
    createItem: {
      targetId: "displayPartialFilterSuggestions",
      action(event, ctx) {
        ctx.createSearchTextFilter(event.data.item);
      },
    },
  },
};
