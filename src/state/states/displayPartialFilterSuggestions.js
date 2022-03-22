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
      if (!ctx.hasPartialFilter()) {
        toolkit.sendEvent("redirectToIdle");
        return;
      }

      // no more edition & empty suggestions list
      ctx.reset();

      if (ctx.hasMissingPartialOperator()) {
        toolkit.sendEvent("redirectToLoadOperatorSuggestions");
        return;
      }

      if (ctx.hasMissingPartialValue()) {
        toolkit.sendEvent("redirectToLoadValueSuggestions");
        return;
      }
    },
  },
  events: {
    redirectToIdle: "idle",
    redirectToLoadOperatorSuggestions: "loadOperatorSuggestions",
    redirectToLoadValueSuggestions: "loadValueSuggestions",
  },
};
