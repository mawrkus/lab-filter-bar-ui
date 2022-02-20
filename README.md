# Filter Bar prototype

- [React](https://reactjs.org/)
- [Semantic UI](https://react.semantic-ui.com/)
- [TVmaze API](https://www.tvmaze.com/api)

## TODOS

- "IN" operator + multi-select
- tabIndex
- `<FilterBar onChange={} />`
- Parentheses
- Contextual: if season selected -> reduce episodes list

## Architecture

- State machine with domain context (the app state)
- Suggestion services (cancellable HTTP requests to API)
- Clear contract on the data structure (suggestion item -> filter)
- React Hooks
- Dumb components
