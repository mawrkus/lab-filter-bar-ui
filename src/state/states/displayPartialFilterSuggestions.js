import { waitFor } from "../lib/waitFor";

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

      // we introduce a delay to prevent the dropdown that we will open now to be closed
      // on mouse up. this usually happen when editing a multi dropdown and closing it by clicking
      // on the document: the mouse down closes the multi dropdown, the partial suggestions
      // dropdown is open and the mouse up closes it immediately, resulting in poor UX
      // (see node_modules/semantic-ui-react/src/modules/Dropdown/Dropdown.js L160)
      await waitFor(100);

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
