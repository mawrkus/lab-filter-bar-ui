# Filter Bar prototype

- [React](https://reactjs.org/)
- [Semantic UI](https://react.semantic-ui.com/)
- [TVmaze API](https://www.tvmaze.com/api)

## TODOS

### Bugs

### Features

- state ctx -> suggestions: { visible, loading, error, items }
- `<FilterBar filters={} onChange={} />`
- "IN" operator + multi-select
- Support delete key
- AbortController
- Contextual: if season selected -> reduce episodes list
- Contextual: remove selected items from suggestions
- HTTP cache

## Architecture

- State machine with domain context (the app state)
- Suggestion services (API requests via HTTP)
- Contract on the data structure (suggestion item -> filter)
- React Hooks
- Dumb components
