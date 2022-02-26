export const displayPartialFilterSuggestions = {
  actions: {
    onEntry(event, ctx, toolkit) {
      if (ctx.hasPartialFilter()) {
        if (ctx.hasMissingPartialOperator()) {
          toolkit.sendEvent("redirectToLoadOperatorSuggestions");
          return;
        }

        if (ctx.hasMissingPartialValue()) {
          toolkit.sendEvent("redirectToLoadValueSuggestions");
          return;
        }
      }

      toolkit.sendEvent("redirectToIdle");
    },
  },
  events: {
    redirectToIdle: "idle",
    redirectToLoadOperatorSuggestions: "loadOperatorSuggestions",
    redirectToLoadValueSuggestions: "loadValueSuggestions",
  },
};
