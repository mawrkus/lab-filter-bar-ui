import { StateMachine } from "../lib/state-machine";
import { suggestionService } from "../services";
import { entityStateMachineContext } from "./entityStateMachineContext";

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
  onTransition: (...args) => console.log('📟', ...args),
  context: entityStateMachineContext,
  toolkit: { suggestionService },
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
