export const loadOperatorSuggestions = {
  actions: {
    async onEntry(event, ctx, toolkit) {
      ctx.startLoading();

      const operators = await toolkit.suggestionService.loadOperators();

      ctx.doneLoading(operators);

      toolkit.sendEvent("operatorSuggestionsLoaded");
    },
  },
  events: {
    discardSuggestions: "idle",
    operatorSuggestionsLoaded: [
      {
        cond: (event, ctx) => !ctx.isEditing(),
        targetId: "chooseOperator",
      },
      {
        cond: (event, ctx) => {
          const { isEditing, filterUnderEdition } = ctx.get();
          return isEditing && !filterUnderEdition;
        },
        targetId: "editPartialOperator",
      },
      {
        cond: (event, ctx) => {
          const { isEditing, filterUnderEdition } = ctx.get();
          return isEditing && filterUnderEdition;
        },
        targetId: "editOperator",
      },
    ],
  },
};

export const hasPresetValue = (operator) => typeof operator.presetValue !== "undefined";

export const chooseOperator = {
  events: {
    discardSuggestions: "idle",
    selectItem: [
      {
        cond: (event) => !hasPresetValue(event.data),
        targetId: "loadValueSuggestions",
        action: (event, ctx) => {
          ctx.setPartialFilterOperator(event.data);
        },
      },
      {
        cond: (event) => hasPresetValue(event.data),
        targetId: "idle",
        action: (event, ctx) => {
          ctx.completePartialAttributeOperatorFilter(event.data);
        },
      },
    ],
    // On backspace
    removeLastFilter: [
      {
        cond: (event, ctx) => ctx.hasPartialFilter(),
        targetId: "idle",
        action(event, ctx) {
          ctx.removePartialAttribute();
        },
      },
    ],
  },
};

export const editPartialOperator = {
  events: {
    discardSuggestions: "idle",
    selectItem: [
      {
        cond: (event, ctx) => !hasPresetValue(event.data),
        targetId: "loadValueSuggestions",
        action: (event, ctx) => {
          ctx.setPartialFilterOperator(event.data);
        },
      },
      {
        cond: (event, ctx) => hasPresetValue(event.data),
        targetId: "idle",
        action: (event, ctx) => {
          ctx.completePartialAttributeOperatorFilter(event.data);
        },
      },
    ],
  },
};

export const editOperator = {
  events: {
    discardSuggestions: "displayPartialFilterSuggestions",
    selectItem: [
      // E.g.:
      // = -> !=
      // IS NULL -> IS NOT NULL
      // = -> IS NULL
      // = -> IN
      // IS NULL -> IN
      {
        cond: (event, ctx) => {
          const { filterUnderEdition } = ctx.get();

          return (
            hasPresetValue(filterUnderEdition.operator) ===
              hasPresetValue(event.data) ||
            (!hasPresetValue(filterUnderEdition.operator) &&
              hasPresetValue(event.data))
          );
        },
        targetId: "displayPartialFilterSuggestions",
        action: (event, ctx) => {
          ctx.setFilterOperator(event.data);
        },
      },
      // E.g.: IS NULL -> =
      {
        cond: (event, ctx) =>
          !hasPresetValue(event.data) &&
          hasPresetValue(ctx.get().filterUnderEdition.operator),
        targetId: "loadValueSuggestions",
        action: (event, ctx) => {
          const { filterUnderEdition } = ctx.get();

          ctx.setFilterOperator(event.data);
          ctx.startEditing(filterUnderEdition);
        },
      },
    ],
  },
};
