export const idle = {
  actions: {
    onEntry(event, ctx, toolkit) {
      toolkit.suggestionService.cancelLoad();

      // reset suggestions (loading = false) and reset insertion to root node
      ctx.reset();
    },
  },
  events: {
    startInput: "proxyToDisplayNextSuggestions",
    editFilter: "proxyToEditFilterSuggestions",
  },
};
