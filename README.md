# Filter Bar UI component

A filter bar UI component built with:

- [React + hooks](https://reactjs.org/)
- [Semantic UI](https://react.semantic-ui.com/)
- [TVmaze API](https://www.tvmaze.com/api)

## Architecture: core concepts

- State machine with domain context (the app state)
- Suggestion services (cancellable HTTP requests to API)
- Clear contract on the data structure (suggestion item -> filter)
- Dumb UI components

## TODOS

- Fix bug: ensure that the dropdown internal value is unselected, if not, editing an operator or a
  value in two different chiclets might not work, as the dropdown keeps the last selected value and
  compares it before allowing an update (e.g. change '=' to '!=' in the 1st chiclet then change 'LIKE' to '!=' in the 2nd)
- Split choose/edit states
- Remove filter types in filters[]? (check valueSuggestions L7)
- Create filter -> add isRemovable (except logical)?
- `<FilterBar onChange={} />`
- tabIndex
- Parentheses
- "IN" operator + multi-select
- Contextual: if season selected -> reduce episodes list
- React.memo()?
