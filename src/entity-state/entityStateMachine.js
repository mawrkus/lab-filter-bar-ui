import { StateMachine } from "../lib/state-machine/StateMachine";

import {
  idle,
  loadAttributeSuggestions,
  displayAttributeSuggestions,
  loadOperatorSuggestions,
  displayOperatorSuggestions,
  loadValueSuggestions,
  displayValueSuggestions,
} from "./states";

export const entityStateMachine = new StateMachine({
  initialStateId: "idle",
  context: {
    partialFilter: {
      attribute: null,
      operator: null,
    },
    filterId: 1,
    filters: [],
    suggestions: [],
    loading: false,
  },
  onTransition: console.log,
  states: {
    idle,
    loadAttributeSuggestions,
    displayAttributeSuggestions,
    loadOperatorSuggestions,
    displayOperatorSuggestions,
    loadValueSuggestions,
    displayValueSuggestions,
  },
});
