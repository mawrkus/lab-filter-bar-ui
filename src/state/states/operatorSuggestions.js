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

export const chooseOperator = {
  events: {
    discardSuggestions: "idle",
    selectItem: [
      {
        cond: (event) => event.data.type !== "preset-value",
        targetId: "loadValueSuggestions",
        action(event, ctx) {
          ctx.setPartialFilterOperator(event.data);
        },
      },
      {
        cond: (event) => event.data.type === "preset-value",
        targetId: "idle",
        action(event, ctx) {
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
        cond: (event) => event.data.type !== "preset-value",
        targetId: "loadValueSuggestions",
        action(event, ctx) {
          ctx.setPartialFilterOperator(event.data);
        },
      },
      {
        cond: (event) => event.data.type === "preset-value",
        targetId: "idle",
        action(event, ctx) {
          ctx.completePartialAttributeOperatorFilter(event.data);
        },
      },
    ],
  },
};

/*
  single-value operators:
    = -> != (only change operator) => displayPartialFilterSuggestions
    = -> IS NULL (change operator and value) => displayPartialFilterSuggestions
    = -> IN (change operator and value becomes an array) => loadValueSuggestions

  preset-value operators:
    IS NULL -> IS NOT NULL (only change operator) => displayPartialFilterSuggestions
    IS NULL -> = (change operator and value) => loadValueSuggestions
    IS NULL -> IN (change operator and value and value becomes an array) => loadValueSuggestions

  multiple-value operators
    IN -> NOT IN (only change operator) => displayPartialFilterSuggestions
    IN -> = (change operator and value becomes a primitive) => loadValueSuggestions
    IN -> IS NULL (change operator and value and value becomes a primitive) => displayPartialFilterSuggestions
*/
export const editOperator = {
  events: {
    discardSuggestions: "displayPartialFilterSuggestions",
    selectItem: [
      {
        cond: (event, ctx) => {
          const typeUnderEdition = ctx.get().edition.filter.operator.type;
          const newType = event.data.type;

          return (
            typeUnderEdition !== newType &&
            (typeUnderEdition === "preset-value" ||
              (typeUnderEdition === "multiple-value" &&
                newType === "single-value") ||
              newType === "multiple-value")
          );
        },
        targetId: "loadValueSuggestions",
        action(event, ctx) {
          ctx.editFilterOperator(event.data, true);
        },
      },
      {
        cond: () => true,
        targetId: "displayPartialFilterSuggestions",
        action(event, ctx) {
          ctx.editFilterOperator(event.data);
        },
      },
    ],
  },
};
