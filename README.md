# 🧪 Lab project: a Filter Bar UI component

A filter bar UI component built with:

- [React + hooks](https://reactjs.org/)
- [Semantic UI](https://react.semantic-ui.com/)
- [TVmaze API](https://www.tvmaze.com/api)
- A custom state machine implementation inspired by [XState](https://xstate.js.org/)

## ⛩️ Architecture: core concepts

- State machine with domain context (the app state)
- The app state is observable
- The Filter Bar receives the app state as props
- The Filter Bar renders "dumb" UI components (Chiclet, ...)
- Suggestions are fetched from HTTP clients → API (+ cancellable requests)
- Clear contract on the data structure: suggestion item from the API → component prop → filter

### State diagram

```mermaid
stateDiagram-v2
    [*]     --> idle
    idle    --> loadAttributeSuggestions: startInput (no filters)
    idle    --> loadLogicalOperatorSuggestions: startInput (last filter is complete and != logical operator)
    idle    --> proxyToNextSuggestions: startInput (last filter incomplete or logical operator)
    idle    --> proxyToEditFilterSuggestions: editFilter (!= parens)
    idle    --> loadAttributeSuggestions: editFilter (empty parens)
    idle    --> loadLogicalOperatorSuggestions: editFilter (last filter in parens is complete and != logical operator)
    idle    --> proxyToNextSuggestions: editFilter (last filter in parens incomplete or logical operator)
    idle    --> proxyToNextSuggestions: removeFilter
    idle    --> idle: removeLastFilter

    loadAttributeSuggestions    --> attributesLoaded
    state if_editing <<choice>>
    attributesLoaded    --> if_editing
    if_editing          --> setAttribute: not editing
    if_editing          --> editAttribute: editing

    setAttribute        --> idle: discardSuggestions
    setAttribute        --> loadAttributeSuggestions: selectItem (parens)
    setAttribute        --> proxyToNextSuggestions: selectItem (!= parens)
    setAttribute        --> loadOperatorSuggestions: selectItem (!= search text)
    setAttribute        --> idle: removeLastFilter
    editAttribute       --> idle: discardSuggestions
    editAttribute       --> proxyToNextSuggestions: selectItem
```

## 📗 Use cases

### Creation

Using the mouse or the keyboard:

1. Creation of a 3-part filter
2. Creation of a logical operator
3. Creation of search text filter
4. Creation of a 3-part filter with search text
5. Creation of 2-part filter

### Edition

Using the mouse or the keyboard:

- Edition of each part of the filters
- Changing a 3-part filter to a 2-part one and vice-versa
- Same with a partial attribute
- Same with a partial attribute and operator
- Changing a filter operator from "single" to "multi" type

### Deletion

Using the mouse or keyboard:

- Deletion of complete filters
- Deletion of a partial filter

### Loading

- Request cancellation
- Error: selection blocked, search text creation allowed

### Parens

- ...

## 🙈 Quirks

### Invalid state transitions

Choosing "Crew" then the "IN" operator:

- sends a `selectItem` event with type = "multiple-value"
- transitions from `chooseOperator` → `loadValueSuggestions`
- sends a `startInput` event (!)
- 💥 which triggers an invalid transition `loadValueSuggestions` → `undefined`
- (...then a bit later) sends a `valueSuggestionsLoaded` event
- (...then a bit later) everything is all good

Why? Because the `startInput` event comes from:

- unmounting `<SuggestionDropdownSingle />`
- mounting `<SuggestionDropdowMulti />` with `open` = true
- which calls the `onOpen` prop
- which sends the `startInput` event

The same hapens when removing a partial IN operator.

State machine FTW! :D

### Dropdown component warnings

```text
Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.
    at Dropdown (http://localhost:3000/static/js/bundle.js:52590:29)
```

### Editing IN/NOT IN values with a partial filter present

The items of the multi-dropdown are selected on close.
When editing a multi dropdown and closing it by clicking on the document:

- the mouse down closes the multi dropdown,
- the partial suggestions dropdown is open and
- 💥 the mouse up closes it immediately (node_modules/semantic-ui-react/src/modules/Dropdown/Dropdown.js L160)

..resulting in poor UX :/

We've tried to introduce a 100ms delay in the `proxyToNextSuggestions` state to prevent the
dropdown that opens for the partial filter to be closed on mouse up but it produced wrong dropdown
placements when editing completed filter values and a partial filter is present.
