/**
 * This state is/should be reached every time a parens group is edited.
 * It acts as a redirection proxy for these cases:
    (...)
    (attribute ...)
    (attribute operator ...)
    (attribute operator value ...)
    (attribute operator value AND/OR ...)
 */
export const displayParensSuggestions = {
  actions: {
    async onEntry(event, ctx, toolkit) {
      const { filter } = event.data;
      const { filters } = filter;
      const lastFilter = filters[filters.length - 1];

      ctx.startInserting(filter);

      if (!filters.length || lastFilter.type === "logical-operator") {
        toolkit.sendEvent("redirectToLoadAttributeSuggestions");
        return;
      }

      if (lastFilter.value !== null) {
        toolkit.sendEvent("redirectToLoadLogicalOperatorSuggestions");
        return;
      }

      if (lastFilter.operator !== null) {
        toolkit.sendEvent("redirectToLoadValueSuggestions");
        return;
      }

      if (lastFilter.attribute !== null) {
        toolkit.sendEvent("redirectToLoadOperatorSuggestions");
        return;
      }
    },
  },
  events: {
    redirectToLoadAttributeSuggestions: "loadAttributeSuggestions",
    redirectToLoadOperatorSuggestions: "loadOperatorSuggestions",
    redirectToLoadValueSuggestions: "loadValueSuggestions",
    redirectToLoadLogicalOperatorSuggestions: "loadLogicalOperatorSuggestions",
  },
};
