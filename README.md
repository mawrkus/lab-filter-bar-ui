# Filter Bar prototype

- [React](https://reactjs.org/)
- [Semantic UI](https://react.semantic-ui.com/)
- [TVmaze API](https://www.tvmaze.com/api)

## TODOS

- `<FilterBar filters={[...]} onChange={} />`
- "IN" operator + multi-select
- Parentheses
- Support delete key
- Contextual: if season selected -> reduce episodes list
- Contextual: remove selected items from suggestions

## Architecture

- State machine with domain context (the app state)
- Suggestion services (cancellable HTTP requests to API)
- Clear contract on the data structure (suggestion item -> filter)
- React Hooks
- Dumb components
