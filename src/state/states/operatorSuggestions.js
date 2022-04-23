export const displayOperatorSuggestions = {
  actions: {
    async onEntry(event, ctx, toolkit) {
      ctx.startLoading();

      const items = await toolkit.suggestionService.loadOperators();

      ctx.doneLoading(items);

      toolkit.sendEvent("operatorsLoaded");
    },
  },
  events: {
    discardSuggestions: "idle",
    operatorsLoaded: [
      {
        cond: (event, ctx) => !ctx.isEditing(),
        targetId: "setOperator",
      },
      {
        cond: (event, ctx) => ctx.isEditing("partial"),
        targetId: "editPartialOperator",
      },
      {
        cond: () => true,
        targetId: "editOperator",
      },
    ],
  },
};

export const setOperator = {
  events: {
    discardSuggestions: "idle",
    selectItem: [
      {
        cond: (event) => event.data.isSearchText,
        targetId: "setOperator",
      },
      {
        cond: (event) => event.data.item.type === "preset-value",
        targetId: "proxyToNextSuggestions",
        action(event, ctx) {
          ctx.completePartialFilter(event.data.item, "attribute-operator");
        },
      },
      {
        cond: (event) => event.data.item.type !== "preset-value",
        targetId: "displayValueSuggestions",
        action(event, ctx) {
          ctx.setPartialFilterOperator(event.data.item);
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

export const editPartialOperator = {
  events: {
    discardSuggestions: "idle",
    selectItem: [
      {
        cond: (event) => event.data.isSearchText,
        targetId: "editPartialOperator",
      },
      {
        cond: (event) => !event.data.isSearchText,
        targetId: "proxyToNextSuggestions",
        action(event, ctx) {
          const { item } = event.data;

          if (item.type === "preset-value") {
            ctx.completePartialFilter(item, "attribute-operator");
          } else {
            ctx.editFilter(item, "operator");
          }

          ctx.stopEditing();
        },
      },
    ],
  },
};

/*
  single-value operators:
    = -> != (only change operator) => proxyToNextSuggestions
    = -> IS NULL (change operator and value) => proxyToNextSuggestions
    = -> IN (change operator and value becomes an array) => displayValueSuggestions

  preset-value operators:
    IS NULL -> IS NOT NULL (only change operator) => proxyToNextSuggestions
    IS NULL -> = (change operator and value) => displayValueSuggestions
    IS NULL -> IN (change operator and value and value becomes an array) => displayValueSuggestions

  multiple-value operators
    IN -> NOT IN (only change operator) => proxyToNextSuggestions
    IN -> = (change operator and value becomes a primitive) => displayValueSuggestions
    IN -> IS NULL (change operator and value and value becomes a primitive) => proxyToNextSuggestions
*/
export const editOperator = {
  events: {
    discardSuggestions: "idle",
    selectItem: [
      {
        cond: (event) => event.data.isSearchText,
        targetId: "editOperator",
      },
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
        // only exception: we don't go to "proxyToNextSuggestions" because:
        //  - the operator's type changes and we know that the value has to be edited now
        targetId: "displayValueSuggestions",
        action(event, ctx) {
          ctx.editFilter(event.data.item, "operator");

          // we continue editing
          ctx.setEditingPart("value");
        },
      },
      {
        cond: () => true,
        targetId: "proxyToNextSuggestions",
        action(event, ctx) {
          ctx.editFilter(event.data.item, "operator");

          ctx.stopEditing();
        },
      },
    ],
  },
};
