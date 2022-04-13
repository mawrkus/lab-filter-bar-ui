export const loadOperatorSuggestions = {
  actions: {
    async onEntry(event, ctx, toolkit) {
      ctx.startLoading();

      const items = await toolkit.suggestionService.loadOperators();

      ctx.doneLoading({ items });

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
          ctx.completePartialFilter({
            item: event.data.item,
            type: "attribute-operator",
          });
        },
      },
      {
        cond: (event) => event.data.item.type !== "preset-value",
        targetId: "loadValueSuggestions",
        action(event, ctx) {
          ctx.setPartialFilterOperator({ item: event.data.item });
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
            ctx.completePartialFilter({ item, type: "attribute-operator" });
          } else {
            ctx.editFilterOperator({ item });
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
    = -> IN (change operator and value becomes an array) => loadValueSuggestions

  preset-value operators:
    IS NULL -> IS NOT NULL (only change operator) => proxyToNextSuggestions
    IS NULL -> = (change operator and value) => loadValueSuggestions
    IS NULL -> IN (change operator and value and value becomes an array) => loadValueSuggestions

  multiple-value operators
    IN -> NOT IN (only change operator) => proxyToNextSuggestions
    IN -> = (change operator and value becomes a primitive) => loadValueSuggestions
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
        targetId: "loadValueSuggestions",
        action(event, ctx) {
          ctx.editFilterOperator({ item: event.data.item });

          // we continue editing
          ctx.setEditionPart("value");
        },
      },
      {
        cond: () => true,
        targetId: "proxyToNextSuggestions",
        action(event, ctx) {
          ctx.editFilterOperator({ item: event.data.item });

          ctx.stopEditing();
        },
      },
    ],
  },
};
