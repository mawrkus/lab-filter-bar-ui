/**
 * This state is reached when a filter is edited. It acts as a redirection proxy.
 */
export const proxyToEditSuggestions = {
  actions: {
    onEntry(event, ctx, toolkit) {
      const { filter, part } = event.data;

      if (filter.parentId) {
        ctx.startInserting(filter.parentId);
      }

      if (filter.type === "logical-operator") {
        ctx.startEditing(filter, part);
        toolkit.sendEvent("gotoLoadLogicalOperatorSuggestions");
        return;
      }

      if (part === "attribute") {
        ctx.startEditing(filter, part);
        toolkit.sendEvent("gotoLoadAttributeSuggestions");
        return;
      }

      if (part === "operator") {
        ctx.startEditing(filter, part);
        toolkit.sendEvent("gotoLoadOperatorSuggestions");
        return;
      }

      if (part === "value") {
        ctx.startEditing(filter, part);
        toolkit.sendEvent("gotoLoadValueSuggestions");
        return;
      }

      toolkit.sendEvent("gotoIdle");
    },
  },
  events: {
    gotoLoadAttributeSuggestions: "displayAttributeSuggestions",
    gotoLoadOperatorSuggestions: "displayOperatorSuggestions",
    gotoLoadValueSuggestions: "displayValueSuggestions",
    gotoLoadLogicalOperatorSuggestions: "displayLogicalOperatorSuggestions",
    gotoIdle: "idle",
  },
};
