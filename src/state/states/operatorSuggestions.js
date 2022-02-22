export const loadOperatorSuggestions = {
  actions: {
    async onEntry(event, ctx, toolkit) {
      ctx.startLoading();

      const operators = await toolkit.suggestionService.loadOperators();

      ctx.doneLoading(operators);

      toolkit.sendEvent("onOperatorSuggestionsLoaded");
    },
  },
  events: {
    discardSuggestions: "idle",
    onOperatorSuggestionsLoaded: [
      {
        cond: (event, ctx) => !ctx.isEditing(),
        targetId: "chooseOperator",
      },
      {
        cond: (event, ctx) => ctx.isEditing(),
        targetId: "editOperator",
      }
    ],
  },
};

export const chooseOperator = {
  events: {
    discardSuggestions: "idle",
    selectItem: {
      targetId: "loadValueSuggestions",
      action:(event, ctx) => {
        ctx.setFilterOperator(event.data);
      },
    },
    // On backspace
    removeLastFilter: [
      {
        cond: (event, ctx) => ctx.hasPartialAttribute(),
        targetId: "idle",
        action(event, ctx) {
          ctx.removePartialAttribute();
        },
      },
    ],
  },
};

export const editOperator = {
  events: {
    discardSuggestions: "idle",
    selectItem: [
      {
        cond: (event, ctx) => !ctx.hasPartialFilter(),
        targetId: "idle",
        action:(event, ctx) => {
          ctx.setFilterOperator(event.data);
        },
      },
      {
        cond: (event, ctx) => ctx.hasPartialAttribute() && !ctx.hasPartialOperator(),
        targetId: "loadOperatorSuggestions",
        action(event, ctx) {
          ctx.setFilterOperator(event.data);
        },
      },
      {
        cond: (event, ctx) => ctx.hasPartialAttribute() && ctx.hasPartialOperator(),
        targetId: "loadValueSuggestions",
        action:(event, ctx) => {
          ctx.setFilterOperator(event.data);
        },
      },
    ],
  },
};
