export const proxyToDisplayNextSuggestions = {
  actions: {
    onEntry(event, ctx, toolkit) {
      const lastFilter = ctx.getLastFilter();

      if (!lastFilter || lastFilter.type === "logical-operator") {
        toolkit.sendEvent("gotoLoadAttributeSuggestions");
        return;
      }

      if (lastFilter.type === "partial") {
        if (lastFilter.operator === null) {
          toolkit.sendEvent("gotoLoadOperatorSuggestions");
          return;
        }

        if (lastFilter.value === null) {
          toolkit.sendEvent("gotoLoadValueSuggestions");
          return;
        }
      }

      toolkit.sendEvent("gotoIdle");
    },
  },
  events: {
    gotoLoadAttributeSuggestions: "loadAttributeSuggestions",
    gotoLoadOperatorSuggestions: "loadOperatorSuggestions",
    gotoLoadValueSuggestions: "loadValueSuggestions",
    gotoIdle: "idle",
  },
};
