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
        cond: (event) => event.data.item.type !== "preset-value",
        targetId: "loadValueSuggestions",
        action(event, ctx) {
          ctx.setPartialFilterOperator(event.data.item);
        },
      },
      {
        cond: (event) => event.data.item.type === "preset-value",
        targetId: "idle",
        action(event, ctx) {
          ctx.completePartialFilter(event.data.item, "attribute-operator");
        },
      },
    ],
    // On backspace
    removeLastFilter: [
      {
        cond: (event, ctx) => ctx.getPartialFilter(),
        targetId: "idle",
        action(event, ctx) {
          ctx.removePartialFilter();
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
        cond: (event) => event.data.item.type !== "preset-value",
        targetId: "displayPartialFilterSuggestions",
        action(event, ctx) {
          ctx.setPartialFilterOperator(event.data.item);
        },
      },
      {
        cond: (event) => event.data.item.type === "preset-value",
        targetId: "displayPartialFilterSuggestions",
        action(event, ctx) {
          ctx.completePartialFilter(event.data.item, "attribute-operator");
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
          const { operator, value } = ctx.getEdition().filter;
          const typeUnderEdition = operator.type;
          const newType = event.data.item.type;

          /* same types */

          // IN -> NOT IN without any selected value
          if (typeUnderEdition === newType) {
            return value === null;
          }

          /* different types */

          // IS NULL -> =
          if (typeUnderEdition === "preset-value") {
            return true;
          }

          // IN -> =
          if (
            typeUnderEdition === "multiple-value" &&
            newType === "single-value"
          ) {
            return true;
          }

          // = -> IN
          if (newType === "multiple-value") {
            return true;
          }

          return false;
        },
        // only exception: we don't go to "displayPartialFilterSuggestions" because:
        //  - the operator's type changes and we know that the value has to be edited now
        //  - if we go to "displayPartialFilterSuggestions", the state will be resetted (no more edition)
        targetId: "loadValueSuggestions",
        action(event, ctx) {
          ctx.editFilterOperator(event.data.item);
          ctx.setEditionPart("value");
        },
      },
      {
        cond: () => true,
        targetId: "displayPartialFilterSuggestions",
        action(event, ctx) {
          ctx.editFilterOperator(event.data.item);
        },
      },
    ],
  },
};
