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
        cond: (event, ctx) => ctx.isEditingPartialFilter(),
        targetId: "editPartialOperator",
      },
      {
        cond: (event, ctx) => !ctx.isEditingPartialFilter(),
        targetId: "editOperator",
      },
    ],
  },
};

export const hasPresetValue = (operator) =>
  typeof operator.presetValue !== "undefined";

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

/*
  simple operators:
    = -> != (only change operator)
    = -> IS NULL (change operator and value)
    = -> IN (change operator and value becomes an array)

  preset operators:
    IS NULL -> IS NOT NULL (only change operator)
    IS NULL -> = (change operator and value)
    IS NULL -> IN (change operator and value and value becomes an array)

  multiple operators
    IN -> NOT IN (only change operator)
    IN -> = (change operator and value becomes a primitive)
    IN -> IS NULL (change operator and value and value becomes a primitive)
*/

export const editOperator = {
  events: {
    discardSuggestions: "displayPartialFilterSuggestions",
    selectItem: [
      // E.g.
      //  IN -> NOT IN
      {
        cond: (event, ctx) =>
          event.data.selectionType === "multiple" &&
          ctx.get().edition.filter.operator.selectionType ===
            "multiple",
        targetId: "displayPartialFilterSuggestions",
        action: (event, ctx) => {
          ctx.setFilterOperator(event.data);
        },
      },
      // E.g.
      //  = -> !=
      //  NOT IN -> =
      //  IS NULL -> IS NOT NULL
      //  = -> IS NULL
      {
        cond: (event, ctx) => {
          const { filter: filterUnderEdition } = ctx.get().edition;

          return (
            event.data.selectionType !== "multiple" &&
            (hasPresetValue(filterUnderEdition.operator) ===
              hasPresetValue(event.data) ||
              (!hasPresetValue(filterUnderEdition.operator) &&
                hasPresetValue(event.data)))
          );
        },
        targetId: "displayPartialFilterSuggestions",
        action: (event, ctx) => {
          ctx.setFilterOperator(event.data);
        },
      },

      // E.g.
      //  = -> IN
      //  = "xxx" -> IN
      {
        cond: (event, ctx) =>
          event.data.selectionType === "multiple" &&
          !hasPresetValue(ctx.get().edition.filter.operator),
        targetId: "loadValueSuggestions",
        action: (event, ctx) => {
          ctx.setFilterOperator(event.data, true);
        },
      },
      // E.g.
      //  IS NULL -> =
      //  IS NULL -> IN
      {
        cond: (event, ctx) =>
          !hasPresetValue(event.data) &&
          hasPresetValue(ctx.get().edition.filter.operator),
        targetId: "loadValueSuggestions",
        action: (event, ctx) => {
          ctx.setFilterOperator(event.data, true);
        },
      },
    ],
  },
};
