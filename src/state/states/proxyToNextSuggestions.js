/**
 * This state is reached after a filter has been completed, edited or removed.
 * It acts as a redirection proxy for these cases:
 *
 * [partial] attribute → operator suggestions
 * [partial] attribute operator → value suggestions
 * [complete + logical] attribute operator value AND/OR → attribute suggestions
 */
export const proxyToNextSuggestions = {
  actions: {
    onEntry(event, ctx, toolkit) {
      const lastFilter = ctx.getLastFilter();

      if (lastFilter?.type === "logical-operator") {
        toolkit.sendEvent("gotoLoadAttributeSuggestions");
        return;
      }

      if (lastFilter?.type === "partial") {
        if (lastFilter.operator === null) {
          toolkit.sendEvent("gotoLoadOperatorSuggestions");
          return;
        }

        if (lastFilter.value === null) {
          toolkit.sendEvent("gotoLoadValueSuggestions");
          return;
        }
      }

      if (ctx.isInserting() && ctx.getInsertion().filter.filters.length < 2) {
        toolkit.sendEvent("gotoLoadLogicalOperatorSuggestions");
        return;
      }

      toolkit.sendEvent("gotoIdle");
    },
  },
  events: {
    gotoLoadAttributeSuggestions: "loadAttributeSuggestions",
    gotoLoadOperatorSuggestions: "loadOperatorSuggestions",
    gotoLoadValueSuggestions: "loadValueSuggestions",
    gotoLoadLogicalOperatorSuggestions: "loadLogicalOperatorSuggestions",
    gotoIdle: "idle",
  },
};
