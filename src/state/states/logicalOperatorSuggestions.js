export const loadLogicalOperatorSuggestions = {
  actions: {
    async onEntry(event, ctx, toolkit) {
      ctx.startLoading();

      const filterUnderEdition = ctx.getEdition()?.filter;

      // TODO: none of the left/right filter can be a parens filter
      const addParens =
        !ctx.isInserting() && filterUnderEdition
          ? filterUnderEdition.id !== ctx.getLastFilter().id
          : false;

      const items = await toolkit.suggestionService.loadLogicalOperators({
        addParens,
      });

      ctx.doneLoading({ items });

      toolkit.sendEvent("logicalOperatorsLoaded");
    },
  },
  events: {
    discardSuggestions: "idle",
    logicalOperatorsLoaded: [
      {
        cond: (event, ctx) => !ctx.isEditing(),
        targetId: "setLogicalOperator",
      },
      {
        cond: (event, ctx) => ctx.isEditing(),
        targetId: "editLogicalOperator",
      },
    ],
  },
};

export const setLogicalOperator = {
  events: {
    discardSuggestions: "idle",
    selectItem: {
      targetId: "proxyToNextSuggestions",
      action(event, ctx) {
        const { item, isSearchText } = event.data;

        if (isSearchText) {
          ctx.createLogicalOperatorFilter({
            item: { id: null, value: "and", label: "AND" },
          });
          ctx.createSearchTextFilter({ item });
        } else {
          ctx.createLogicalOperatorFilter({ item });
        }
      },
    },
    removeLastFilter: {
      targetId: "idle",
      action(event, ctx) {
        ctx.removeFilter(ctx.getLastFilter());
      },
    },
  },
};

export const editLogicalOperator = {
  actions: {
    onExit(event, ctx) {
      ctx.stopEditing();
    },
  },
  events: {
    discardSuggestions: "proxyToNextSuggestions",
    selectItem: {
      targetId: "proxyToNextSuggestions",
      action(event, ctx) {
        const { item } = event.data;

        if (item.type === "parens") {
          ctx.groupFiltersInParens();
          return;
        }

        ctx.editFilterOperator({ item });
      },
    },
  },
};
