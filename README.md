# Filter Bar prototype

- [React](https://reactjs.org/)
- [Semantic UI](https://react.semantic-ui.com/)
- [TVmaze API](https://www.tvmaze.com/api)

## TODOS

### Bugs

- Free text after free text not working

### Features

- Contextual: if season selected -> reduce episodes list
- FilterBar onChange
- Support delete key
- "EXISTS" operator
- AbortController
- HTTP cache

## Architecture

- State machine with domain context (the app state)
- Suggestion services (API requests via HTTP)
- Contract on the data structure (suggestion item -> filter)
- React Hooks
- Dumb components
