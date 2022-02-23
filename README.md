# 🧪 Lab project: a Filter Bar UI component

A filter bar UI component built with:

- [React + hooks](https://reactjs.org/)
- [Semantic UI](https://react.semantic-ui.com/)
- [TVmaze API](https://www.tvmaze.com/api)
- A custom state machine implementation inspired by [XState](https://xstate.js.org/)

## Architecture: core concepts

- State machine with domain context (the app state)
- Suggestion services (cancellable HTTP requests to API)
- Clear contract on the data structure (suggestion item -> filter)
- Dumb UI components
