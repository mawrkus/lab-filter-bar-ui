/**
 * This state is/should be reached every time a filter has been edited.
 * It acts as a proxy to:
 * - the "idle" state, when there's no partial filter that needs to be completed
 * - the "loadOperatorSuggestions" state, when there's a partial filter without operator
 * - the "loadValueSuggestions" state, when there's a partial filter without value
 */
export const displayPartialFilterSuggestions = {
  actions: {
    async onEntry(event, ctx, toolkit) {
      const partialFilter = ctx.getPartialFilter();

      if (!partialFilter) {
        const lastFilter = ctx.getLastFilter();

        if (lastFilter?.type === "logical-operator") {
          ctx.reset(); // no more edition & empty suggestions list
          toolkit.sendEvent("redirectToLoadAttributeSuggestions");
          return;
        }

        toolkit.sendEvent("redirectToIdle");
        return;
      }

      ctx.reset(); // no more edition & empty suggestions list

      if (partialFilter.operator === null) {
        toolkit.sendEvent("redirectToLoadOperatorSuggestions");
      } else if (partialFilter.value === null) {
        toolkit.sendEvent("redirectToLoadValueSuggestions");
      }
    },
  },
  events: {
    redirectToIdle: "idle",
    redirectToLoadAttributeSuggestions: "loadAttributeSuggestions",
    redirectToLoadOperatorSuggestions: "loadOperatorSuggestions",
    redirectToLoadValueSuggestions: "loadValueSuggestions",
  },
};
