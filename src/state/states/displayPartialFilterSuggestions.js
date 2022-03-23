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
        toolkit.sendEvent("redirectToIdle");
        return;
      }

      // no more edition & empty suggestions list
      ctx.reset();

      if (partialFilter.operator === null) {
        toolkit.sendEvent("redirectToLoadOperatorSuggestions");
      } else if (partialFilter.value === null) {
        toolkit.sendEvent("redirectToLoadValueSuggestions");
      }
    },
  },
  events: {
    redirectToIdle: "idle",
    redirectToLoadOperatorSuggestions: "loadOperatorSuggestions",
    redirectToLoadValueSuggestions: "loadValueSuggestions",
  },
};
